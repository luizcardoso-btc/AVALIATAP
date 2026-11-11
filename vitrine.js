// Vitrine de banners do Dashboard do revendedor — ARQUIVO NOVO.
// Três banners prontos (Black NexTap, Grupo de ofertas, NFC Academy) desenhados no próprio painel com dados ao vivo,
// mais banners do admin (imagem e/ou texto), com ordem, datas de início/fim, liga/desliga e contagem de cliques.
const express = require('express');
const db = require('./database.js');
const { requireAdmin, requireReseller } = require('./auth-middleware.js');

const router = express.Router();
const TEMAS = ['verde', 'preto', 'dourado'];
const PRONTOS = [{ tipo: 'black', ordem: 10 }, { tipo: 'grupo', ordem: 20 }, { tipo: 'academy', ordem: 90 }];
for (const b of PRONTOS) {
  if (!db.prepare('SELECT 1 FROM vitrine_banners WHERE tipo = ?').get(b.tipo)) db.prepare('INSERT INTO vitrine_banners (tipo, ordem, ativo) VALUES (?, ?, 1)').run(b.tipo, b.ordem);
}

const txt = (v, n) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, n);
const MAX_IMG = 900 * 1024;
// data:image/jpeg;base64,... → { buf, tipo }
function lerImagem(v) {
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(v || ''));
  if (!m) return null;
  const buf = Buffer.from(m[2], 'base64');
  if (!buf.length || buf.length > MAX_IMG) return false;
  return { buf, tipo: m[1] };
}
// Datas do admin ("2026-11-20T08:00") valem no horário de Brasília.
const toMs = v => { if (!v) return null; const t = String(v); const ms = Date.parse(/([zZ]|[+-]\d{2}:?\d{2})$/.test(t) ? t : t + '-03:00'); return Number.isFinite(ms) ? ms : NaN; };
const noPrazo = (b, agora) => { const i = toMs(b.inicio), f = toMs(b.fim); return !(i && agora < i) && !(f && agora >= f); };

function validarDestino(v) {
  const d = String(v || '').trim();
  if (!d) return '';
  if (['comprar', 'pedidos', 'placas', 'vendas', 'academy', 'grupo', 'conta'].includes(d)) return d;
  if (/^https:\/\/[^\s]+$/i.test(d) && d.length <= 500) return d;
  return false;
}

// ---------- revendedor ----------
router.get('/api/resellers/vitrine', requireReseller, (req, res) => {
  const agora = Date.now();
  const rows = db.prepare('SELECT id, tipo, titulo, subtitulo, destaque, botao, destino, tema, imagem_tipo, (imagem IS NOT NULL) AS tem_img, inicio, fim, atualizado_em FROM vitrine_banners WHERE ativo = 1 ORDER BY ordem, id').all();
  res.json(rows.filter(b => noPrazo(b, agora)).map(b => ({
    id: b.id, tipo: b.tipo, titulo: b.titulo || '', subtitulo: b.subtitulo || '', destaque: b.destaque || '', botao: b.botao || '', destino: b.destino || '', tema: b.tema || 'verde',
    img: b.tem_img ? `/api/public/vitrine/${b.id}/img?v=${encodeURIComponent(b.atualizado_em || '')}` : null
  })));
});
router.post('/api/resellers/vitrine/:id/clique', requireReseller, (req, res) => {
  db.prepare('UPDATE vitrine_banners SET cliques = cliques + 1 WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});
// A imagem é pública (é propaganda e o <img> não envia o login).
router.get('/api/public/vitrine/:id/img', (req, res) => {
  const b = db.prepare('SELECT imagem, imagem_tipo FROM vitrine_banners WHERE id = ? AND imagem IS NOT NULL').get(req.params.id);
  if (!b) return res.status(404).end();
  res.set('Content-Type', b.imagem_tipo || 'image/jpeg').set('Cache-Control', 'public, max-age=86400').send(b.imagem);
});

// ---------- admin ----------
const adm = express.Router(); adm.use(requireAdmin);
const lista = () => db.prepare('SELECT id, tipo, titulo, subtitulo, destaque, botao, destino, tema, (imagem IS NOT NULL) AS tem_img, ativo, ordem, inicio, fim, cliques, atualizado_em FROM vitrine_banners ORDER BY ordem, id').all()
  .map(b => ({ ...b, tem_img: !!b.tem_img, img: b.tem_img ? `/api/public/vitrine/${b.id}/img?v=${encodeURIComponent(b.atualizado_em || '')}` : null }));
adm.get('/', (req, res) => res.json(lista()));

function ler(b, res) {
  const d = validarDestino(b.destino);
  if (d === false) { res.status(400).json({ error: 'Destino inválido. Use um link que comece com https:// ou escolha uma página do painel.' }); return null; }
  const tema = TEMAS.includes(b.tema) ? b.tema : 'verde';
  const i = toMs(b.inicio), f = toMs(b.fim);
  if (Number.isNaN(i) || Number.isNaN(f)) { res.status(400).json({ error: 'Data inválida.' }); return null; }
  if (i && f && f <= i) { res.status(400).json({ error: 'O fim precisa ser depois do início.' }); return null; }
  return { titulo: txt(b.titulo, 80), subtitulo: txt(b.subtitulo, 160), destaque: txt(b.destaque, 40), botao: txt(b.botao, 30), destino: d, tema, inicio: b.inicio ? String(b.inicio).slice(0, 25) : null, fim: b.fim ? String(b.fim).slice(0, 25) : null };
}
adm.post('/', (req, res) => {
  const b = req.body || {}, v = ler(b, res); if (!v) return;
  const img = b.imagem ? lerImagem(b.imagem) : null;
  if (img === false) return res.status(400).json({ error: 'Imagem muito grande (máximo 900 KB) ou inválida.' });
  if (b.imagem && !img) return res.status(400).json({ error: 'Imagem inválida. Use JPG, PNG ou WEBP.' });
  if (!img && !v.titulo) return res.status(400).json({ error: 'Envie uma imagem ou escreva ao menos o título.' });
  const max = db.prepare('SELECT COALESCE(MAX(ordem), 0) m FROM vitrine_banners WHERE tipo = ?').get('custom').m;
  const id = db.prepare(`INSERT INTO vitrine_banners (tipo, titulo, subtitulo, destaque, botao, destino, tema, imagem, imagem_tipo, ativo, ordem, inicio, fim)
    VALUES ('custom', ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`).run(v.titulo, v.subtitulo, v.destaque, v.botao, v.destino, v.tema, img ? img.buf : null, img ? img.tipo : null, Math.max(50, max + 1), v.inicio, v.fim).lastInsertRowid;
  res.json({ ok: true, id, lista: lista() });
});
adm.put('/:id', (req, res) => {
  const cur = db.prepare('SELECT id, tipo FROM vitrine_banners WHERE id = ?').get(req.params.id);
  if (!cur) return res.status(404).json({ error: 'Banner não encontrado.' });
  const b = req.body || {};
  if (cur.tipo !== 'custom') { // prontos: só liga/desliga
    db.prepare('UPDATE vitrine_banners SET ativo = ? WHERE id = ?').run(b.ativo === false || b.ativo === 0 ? 0 : 1, cur.id);
    return res.json({ ok: true, lista: lista() });
  }
  const v = ler(b, res); if (!v) return;
  let sqlImg = '', args = [];
  if (b.remover_imagem) { sqlImg = ', imagem = NULL, imagem_tipo = NULL'; }
  else if (b.imagem) {
    const img = lerImagem(b.imagem);
    if (img === false) return res.status(400).json({ error: 'Imagem muito grande (máximo 900 KB) ou inválida.' });
    if (!img) return res.status(400).json({ error: 'Imagem inválida. Use JPG, PNG ou WEBP.' });
    sqlImg = ', imagem = ?, imagem_tipo = ?'; args = [img.buf, img.tipo];
  }
  const tem = db.prepare('SELECT (imagem IS NOT NULL) t FROM vitrine_banners WHERE id = ?').get(cur.id).t;
  if (!v.titulo && !b.imagem && (b.remover_imagem || !tem)) return res.status(400).json({ error: 'O banner precisa de uma imagem ou de um título.' });
  db.prepare(`UPDATE vitrine_banners SET titulo = ?, subtitulo = ?, destaque = ?, botao = ?, destino = ?, tema = ?, inicio = ?, fim = ?, ativo = ?, atualizado_em = CURRENT_TIMESTAMP${sqlImg} WHERE id = ?`)
    .run(v.titulo, v.subtitulo, v.destaque, v.botao, v.destino, v.tema, v.inicio, v.fim, b.ativo === false || b.ativo === 0 ? 0 : 1, ...args, cur.id);
  res.json({ ok: true, lista: lista() });
});
adm.delete('/:id', (req, res) => {
  const cur = db.prepare('SELECT tipo FROM vitrine_banners WHERE id = ?').get(req.params.id);
  if (!cur) return res.status(404).json({ error: 'Banner não encontrado.' });
  if (cur.tipo !== 'custom') return res.status(400).json({ error: 'Os banners prontos não se apagam; desligue-os.' });
  db.prepare('DELETE FROM vitrine_banners WHERE id = ?').run(req.params.id);
  res.json({ ok: true, lista: lista() });
});
// Nova ordem: { ids: [3, 1, 2, ...] } (todos os banners, na ordem em que devem aparecer)
adm.post('/reordenar', (req, res) => {
  const ids = Array.isArray((req.body || {}).ids) ? req.body.ids.map(Number).filter(Number.isInteger) : [];
  db.transaction(() => ids.forEach((id, i) => db.prepare('UPDATE vitrine_banners SET ordem = ? WHERE id = ?').run((i + 1) * 10, id)))();
  res.json({ ok: true, lista: lista() });
});
router.use('/api/admin/vitrine', adm);

module.exports = router;
