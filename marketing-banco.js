// Banco de imagens de marketing: guarda as artes (ChatGPT, etc.) no servidor, com tipo/segmento/tags, e serve links públicos curtos (/m/<id>.png).
// Admin: GET/POST/PATCH/DELETE /api/admin/marketing/imagens. Envio: corpo cru da imagem (image/png|jpeg|webp) + metadados na query.
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const db = require('./database.js');
const { requireAdmin } = require('./auth-middleware.js');

const router = express.Router();
const PASTA = path.join(path.dirname(db.name), 'marketing-img');
fs.mkdirSync(PASTA, { recursive: true });
const TIPOS = ['placa', 'cena', 'personagem', 'fundo', 'mockup', 'slide', 'video', 'outro'];
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };
const MAX = 10 * 1024 * 1024;
const txt = (v, n) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n);

function detectar(b) {
  if (b.length > 12 && b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { mime: 'image/png', largura: b.readUInt32BE(16), altura: b.readUInt32BE(20) };
  }
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) {
    for (let i = 2; i + 9 < b.length;) { // procura o marcador SOF para ler as dimensões
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { mime: 'image/jpeg', altura: b.readUInt16BE(i + 5), largura: b.readUInt16BE(i + 7) };
      i += 2 + b.readUInt16BE(i + 2);
    }
    return { mime: 'image/jpeg' };
  }
  if (b.length > 30 && b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP') return { mime: 'image/webp' };
  return null;
}
const linha = r => ({ ...r, url: '/m/' + r.id + '.' + EXT[r.mime] });
const lista = () => db.prepare('SELECT * FROM marketing_imagens ORDER BY criado_em DESC, rowid DESC LIMIT 1000').all().map(linha);

router.get('/api/admin/marketing/imagens', requireAdmin, (req, res) => res.json(lista()));

router.post('/api/admin/marketing/imagens', requireAdmin, express.raw({ type: ['image/png', 'image/jpeg', 'image/webp'], limit: MAX }), (req, res) => {
  const buf = req.body;
  if (!Buffer.isBuffer(buf) || !buf.length) return res.status(400).json({ error: 'Envie uma imagem PNG, JPG ou WEBP de até 10 MB.' });
  const d = detectar(buf);
  if (!d) return res.status(400).json({ error: 'Arquivo inválido. Use PNG, JPG ou WEBP.' });
  const q = req.query, id = crypto.randomBytes(10).toString('hex');
  fs.writeFileSync(path.join(PASTA, id + '.' + EXT[d.mime]), buf);
  db.prepare('INSERT INTO marketing_imagens (id, nome, tipo, segmento, tags, mime, bytes, largura, altura) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(id, txt(q.nome, 120), TIPOS.includes(q.tipo) ? q.tipo : 'outro', txt(q.segmento, 40), txt(q.tags, 200), d.mime, buf.length, d.largura || null, d.altura || null);
  res.json({ ok: true, imagem: linha(db.prepare('SELECT * FROM marketing_imagens WHERE id = ?').get(id)) });
});

router.patch('/api/admin/marketing/imagens/:id', requireAdmin, express.json(), (req, res) => {
  const cur = db.prepare('SELECT * FROM marketing_imagens WHERE id = ?').get(req.params.id);
  if (!cur) return res.status(404).json({ error: 'Imagem não encontrada.' });
  const b = req.body || {};
  db.prepare('UPDATE marketing_imagens SET nome=?, tipo=?, segmento=?, tags=? WHERE id=?')
    .run(b.nome !== undefined ? txt(b.nome, 120) : cur.nome, TIPOS.includes(b.tipo) ? b.tipo : cur.tipo, b.segmento !== undefined ? txt(b.segmento, 40) : cur.segmento, b.tags !== undefined ? txt(b.tags, 200) : cur.tags, cur.id);
  res.json({ ok: true });
});

router.delete('/api/admin/marketing/imagens/:id', requireAdmin, (req, res) => {
  const cur = db.prepare('SELECT * FROM marketing_imagens WHERE id = ?').get(req.params.id);
  if (!cur) return res.status(404).json({ error: 'Imagem não encontrada.' });
  try { fs.unlinkSync(path.join(PASTA, cur.id + '.' + EXT[cur.mime])); } catch (e) { /* arquivo já sumiu */ }
  db.prepare('DELETE FROM marketing_imagens WHERE id = ?').run(cur.id);
  res.json({ ok: true });
});

// Link público e curto da arte (o id é aleatório e longo; serve para postar no Instagram, anúncios etc.).
router.get('/m/:arq', (req, res) => {
  const m = /^([0-9a-f]{20})\.(png|jpg|webp)$/.exec(req.params.arq);
  if (!m) return res.status(404).end();
  const r = db.prepare('SELECT mime FROM marketing_imagens WHERE id = ?').get(m[1]);
  if (!r || EXT[r.mime] !== m[2]) return res.status(404).end();
  res.set({ 'Content-Type': r.mime, 'Cache-Control': 'public, max-age=604800, immutable', 'X-Content-Type-Options': 'nosniff' });
  res.sendFile(path.join(PASTA, m[1] + '.' + m[2]));
});

module.exports = router;
