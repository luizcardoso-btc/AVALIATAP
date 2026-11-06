// Promoção por período (Black NexTap) — ARQUIVO NOVO. Troca a tabela de preços (price_tiers) no início e devolve a tabela normal no fim,
// sozinha, no horário de Brasília. A tabela normal fica guardada em settings até o encerramento.
const express = require('express');
const db = require('./database.js');
const { requireAdmin } = require('./auth-middleware.js');

const KEY = 'promo_bf';
const router = express.Router();
const get = () => { const r = db.prepare('SELECT valor FROM settings WHERE chave = ?').get(KEY); try { return r ? JSON.parse(r.valor) : null; } catch (e) { return null; } };
const set = p => db.prepare('INSERT INTO settings (chave, valor) VALUES (?, ?) ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor').run(KEY, JSON.stringify(p));
const atuais = () => db.prepare('SELECT min_qty, max_qty, unit_price FROM price_tiers ORDER BY min_qty').all();
const gravar = db.transaction(lista => {
  db.prepare('DELETE FROM price_tiers').run();
  const ins = db.prepare('INSERT INTO price_tiers (min_qty, max_qty, unit_price) VALUES (?, ?, ?)');
  lista.forEach(t => ins.run(t.min_qty, t.max_qty, t.unit_price));
});

// Liga/desliga conforme o relógio. Seguro para rodar várias vezes.
function tick() {
  const p = get(); if (!p || p.estado === 'encerrada') return p;
  const agora = Date.now(), ini = Date.parse(p.ini), fim = Date.parse(p.fim);
  if (p.estado === 'agendada' && agora >= ini && agora < fim) {
    p.normais = atuais(); gravar(p.tiers); p.estado = 'ativa'; set(p); console.log('[PROMO] Ativada:', p.nome);
  } else if (p.estado === 'ativa' && agora >= fim) {
    if (p.normais && p.normais.length) gravar(p.normais); p.estado = 'encerrada'; set(p); console.log('[PROMO] Encerrada, tabela normal restaurada:', p.nome);
  } else if (p.estado === 'agendada' && agora >= fim) { p.estado = 'encerrada'; set(p); }
  return p;
}
const ativa = () => { const p = get(); return !!(p && p.estado === 'ativa'); };

// Primeira instalação: cadastra a Black NexTap combinada (05/11 a 05/12/2026). Roda uma vez.
if (!db.prepare("SELECT 1 FROM settings WHERE chave = 'promo_bf2026_seed'").get() && !get()) {
  set({ nome: 'Black NexTap', ini: '2026-11-05T00:00:00-03:00', fim: '2026-12-05T23:59:59-03:00', estado: 'agendada',
    tiers: [{ min_qty: 5, max_qty: 9, unit_price: 19.99 }, { min_qty: 10, max_qty: 49, unit_price: 17.99 }, { min_qty: 50, max_qty: 1000000, unit_price: 14.99 }] });
}
db.prepare("INSERT OR IGNORE INTO settings (chave, valor) VALUES ('promo_bf2026_seed', '1')").run();
tick();
setInterval(() => { try { tick(); } catch (e) { console.error('[PROMO]', e.message); } }, 30000).unref();

// Público: dados para o banner e a contagem regressiva.
router.get('/api/public/promocao', (req, res) => {
  const p = tick(); res.set('Cache-Control', 'public, max-age=30');
  if (!p || p.estado !== 'ativa') return res.json({ ativa: false });
  res.json({ ativa: true, nome: p.nome, fim: p.fim, de: p.normais && p.normais[0] ? p.normais[0].unit_price : null, a_partir: Math.min(...p.tiers.map(t => t.unit_price)), minimo_a_partir: p.tiers.reduce((a, t) => t.unit_price < a.unit_price ? t : a).min_qty });
});

const A = express.Router(); A.use('/api/admin/promocao', requireAdmin);
A.get('/api/admin/promocao', (req, res) => { const p = tick(); res.json(p ? { ...p, normais_atuais: p.estado === 'ativa' ? p.normais : atuais() } : null); });
const bad = (res, m) => res.status(400).json({ error: m });
A.put('/api/admin/promocao', (req, res) => {
  const b = req.body || {}, p = get() || { estado: 'agendada' };
  if (p.estado === 'encerrada') { p.estado = 'agendada'; p.normais = undefined; }
  const ini = Date.parse(b.ini), fim = Date.parse(b.fim);
  if (!Number.isFinite(ini) || !Number.isFinite(fim) || fim <= ini) return bad(res, 'Datas inválidas: o fim precisa ser depois do início.');
  const tiers = Array.isArray(b.tiers) ? b.tiers.map(t => ({ min_qty: Number(t.min_qty), max_qty: Number(t.max_qty), unit_price: Math.round(Number(String(t.unit_price).replace(',', '.')) * 100) / 100 })) : null;
  if (!tiers || !tiers.length || !tiers.every(t => Number.isInteger(t.min_qty) && Number.isInteger(t.max_qty) && t.min_qty >= 1 && t.max_qty >= t.min_qty && t.unit_price > 0 && t.unit_price < 10000)) return bad(res, 'Faixas inválidas (quantidades inteiras e preço maior que zero).');
  tiers.sort((x, y) => x.min_qty - y.min_qty);
  for (let i = 1; i < tiers.length; i++) if (tiers[i].min_qty <= tiers[i - 1].max_qty) return bad(res, 'As faixas não podem se sobrepor.');
  const toIso = v => { const t = String(v); return /([zZ]|[+-]\d{2}:?\d{2})$/.test(t) ? t : t + '-03:00'; };
  const antes = p.estado;
  Object.assign(p, { nome: String(b.nome || p.nome || 'Black NexTap').trim().slice(0, 40), ini: toIso(b.ini), fim: toIso(b.fim), tiers });
  if (antes === 'ativa') gravar(tiers); // promoção em andamento: os novos preços valem na hora
  set(p); res.json(tick());
});
A.post('/api/admin/promocao/encerrar', (req, res) => {
  const p = get(); if (!p || p.estado !== 'ativa') return bad(res, 'Não há promoção ativa.');
  if (p.normais && p.normais.length) gravar(p.normais); p.estado = 'encerrada'; set(p); res.json({ ok: true });
});
router.use(A);

module.exports = router; module.exports.ativa = ativa; module.exports.get = get;
