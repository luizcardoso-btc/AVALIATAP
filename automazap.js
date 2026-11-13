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

module.exports = { notificar, vincularLead, leadDoRevendedor, avisarPedido, limparLead };
