// Fotos dos segmentos: /segmentos/<slug>.jpg (principal), <slug>-2.jpg, <slug>-3.jpg (galeria). Também aceita .webp. ARQUIVO NOVO.
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'segmentos');
function fotos(slug) {
  const out = [];
  for (const suf of ['', '-2', '-3']) {
    for (const ext of ['webp', 'jpg']) {
      if (fs.existsSync(path.join(dir, slug + suf + '.' + ext))) { out.push(`/segmentos/${slug}${suf}.${ext}`); break; }
    }
  }
  return out;
}
module.exports = { fotos, dir };
