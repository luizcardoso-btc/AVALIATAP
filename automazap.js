// Avisos para o Automazap (robô do Instagram) — ARQUIVO NOVO.
// Quando um lead que veio do robô cria conta, inicia um pedido ou paga, o Automazap fica sabendo:
// marca a etapa no funil, registra a venda sozinho e para de mandar follow-up para quem já comprou.
//
// Variáveis (nos dois serviços o segredo é o mesmo): AUTOMAZAP_URL (ex.: https://automazap-production.up.railway.app)
// e NEXTAP_WEBHOOK_SECRET (mínimo 16 caracteres). Sem elas, nada é enviado.
// Nunca atrapalha o cadastro nem o pagamento: roda depois, e qualquer falha só vai para o log.
const db = require('./database.js');

const LEAD_OK = /^[\w-]{6,40}$/;
const limparLead = v => (typeof v === 'string' && LEAD_OK.test(v) ? v : null);

function notificar(evento, dados) {
  const url = String(process.env.AUTOMAZAP_URL || '').replace(/\/+$/, ''), seg = process.env.NEXTAP_WEBHOOK_SECRET || '';
  if (!url || seg.length < 16 || !dados || !dados.lead) return false;
  setImmediate(async () => {
    try {
      const r = await fetch(url + '/webhook/nextap', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Automazap-Secret': seg },
        body: JSON.stringify({ evento, ...dados }), signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) console.warn(`[AUTOMAZAP] aviso "${evento}" recusado: HTTP ${r.status}`);
    } catch (e) { console.warn(`[AUTOMAZAP] aviso "${evento}" não enviado:`, e.message); }
  });
  return true;
}

// Guarda de qual lead do robô veio este revendedor (só o primeiro: quem já tem não é trocado).
function vincularLead(resellerId, lead) {
  const l = limparLead(lead);
  if (!l) return null;
  const r = db.prepare('UPDATE resellers SET lead_token = ? WHERE id = ? AND lead_token IS NULL').run(l, resellerId);
  return r.changes ? l : null;
}
const leadDoRevendedor = id => (db.prepare('SELECT lead_token FROM resellers WHERE id = ?').get(id) || {}).lead_token || null;

function avisarPedido(evento, orderId) {
  const o = db.prepare('SELECT id, reseller_id, qty_azul, qty_preta, qty_outras, total FROM orders WHERE id = ?').get(orderId);
  if (!o) return false;
  return notificar(evento, { lead: leadDoRevendedor(o.reseller_id), pedido: o.id, qty: (o.qty_azul || 0) + (o.qty_preta || 0) + (o.qty_outras || 0), total: o.total });
}

// ---------- Financeiro para o Prédio do Automazap (somente leitura) ----------
// GET /api/integracao/financeiro com o cabeçalho X-Automazap-Secret = NEXTAP_WEBHOOK_SECRET.
// Usa o mesmo contador do painel admin (financeiro.js): nada é recalculado nem alterado aqui.
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
function autorizado(req) {
  const seg = process.env.NEXTAP_WEBHOOK_SECRET || '';
  const a = Buffer.from(String(req.get('X-Automazap-Secret') || '')), b = Buffer.from(seg);
  return seg.length >= 16 && a.length === b.length && crypto.timingSafeEqual(a, b);
}
const compacto = L => ({ periodo: L.periodo, pedidos: L.pedidos, placas: L.placas, receita_bruta: L.receita_bruta, custo_placas: L.custo_placas, icms: L.icms,
  taxas_mp: L.taxas_mp, custo_envio: L.custo_envio, lucro_bruto: L.lucro_bruto, despesas: L.despesas, lucro_final: L.lucro_final, margem_pct: L.margem_pct,
  lucro_por_placa: L.lucro_por_placa, ticket_medio: L.pedidos ? Math.round((L.receita_bruta / L.pedidos) * 100) / 100 : 0 });
router.get('/api/integracao/financeiro', (req, res) => {
  if (!(process.env.NEXTAP_WEBHOOK_SECRET || '').length) return res.status(503).json({ error: 'NEXTAP_WEBHOOK_SECRET não configurado.' });
  if (!autorizado(req)) return res.sendStatus(401);
  try {
    const F = require('./financeiro.js');
    const mes = F.lucro('month');
    const periodos = {}; for (const p of ['today', '7', '30', 'month', 'all']) periodos[p] = p === 'month' ? compacto(mes) : compacto(F.lucro(p));
    const um = (sql, ...a) => db.prepare(sql).get(...a);
    const status = db.prepare('SELECT status, COUNT(*) AS n, COALESCE(SUM(total), 0) AS valor FROM orders GROUP BY status').all();
    // Operação: pedidos pagos parados (sem produção/envio) e em produção há muitos dias
    const parados = db.prepare(`SELECT id, status, total, COALESCE(producao_at, paid_at, created_at) AS desde, ship_name FROM orders
      WHERE status IN ('pago', 'em_producao') ORDER BY desde LIMIT 50`).all()
      .map(o => ({ ...o, dias: Math.floor((Date.now() - Date.parse(String(o.desde).replace(' ', 'T') + 'Z')) / 864e5) }));
    const res_ = {
      gerado_em: Date.now(),
      periodos,
      mes: { alertas: mes.alertas, a_receber: mes.a_receber, estoque: mes.estoque, despesas_itens: (mes.despesas_itens || []).slice(0, 10),
        faixas: mes.faixas, pedidos_prejuizo: mes.pedidos_prejuizo.length, ponto_equilibrio_placas: mes.ponto_equilibrio_placas, config: mes.config },
      pedidos: { por_status: status, parados: parados.filter(o => o.dias >= 3).slice(0, 10), aguardando_pagamento_14d: um("SELECT COUNT(*) AS n FROM orders WHERE status = 'aguardando_pagamento' AND created_at >= datetime('now', '-14 days')").n },
      revendedores: { total: um('SELECT COUNT(*) AS n FROM resellers').n, novos_7d: um("SELECT COUNT(*) AS n FROM resellers WHERE created_at >= datetime('now', '-7 days')").n,
        compraram_30d: um("SELECT COUNT(DISTINCT reseller_id) AS n FROM orders WHERE status IN ('pago','em_producao','enviado','entregue') AND COALESCE(paid_at, created_at) >= datetime('now', '-30 days')").n },
    };
    res.json(res_);
  } catch (e) { console.error('[AUTOMAZAP] financeiro:', e.message); res.status(500).json({ error: 'Falha ao montar o financeiro.' }); }
});

module.exports = { notificar, vincularLead, leadDoRevendedor, avisarPedido, limparLead, router, autorizado };
