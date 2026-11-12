// Prova social, vídeos e fotos reais da NexTap para as páginas de SEO. ARQUIVO NOVO. Só gera HTML/JSON-LD.
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const PROVA = [
  { nome: 'Qê Pizza Delivery', tipo: 'Pizzaria e delivery', img: '/midia/prova-qe-pizza.webp', alt: 'Placa NexTap de avaliação do Google na Qê Pizza Delivery' },
  { nome: 'Stop Pastelaria', tipo: 'Pastelaria', ig: 'stopastelaria', img: '/midia/prova-stop-pastelaria.webp', alt: 'Placa NexTap de avaliação do Google na Stop Pastelaria' },
  { nome: 'Neto Pneus e Rodas', tipo: 'Pneus e rodas', ig: 'neto_rodas', img: '/midia/prova-neto-rodas.webp', alt: 'Placa NexTap de avaliação do Google na Neto Pneus e Rodas' },
  { nome: 'Expresso Burguer e Espetos', tipo: 'Food truck', ig: 'expresso.foodtruck', img: '/midia/prova-expresso.webp', alt: 'Placa NexTap de avaliação do Google no Expresso Burguer e Espetos' },
];
const VIDEOS = [
  { nome: 'Placas NexTap: modelos Google, Pix e Instagram', desc: 'Veja de perto as placas NexTap com NFC e QR Code: avaliação do Google, pagar com Pix e siga no Instagram.', src: '/midia/placas-modelos.mp4', poster: '/midia/placas-modelos.jpg', dur: 'PT11S' },
  { nome: 'Placa NexTap Instagram: retirando a película protetora', desc: 'Passo a passo para retirar a película protetora da placa de acrílico NexTap com NFC e QR Code.', src: '/midia/placa-instagram-pelicula.mp4', poster: '/midia/placa-instagram-pelicula.jpg', dur: 'PT11S' },
];

const provaHtml = (titulo = 'Negócios que já usam a NexTap') => `<section id="prova"><div class="w"><div class="c"><span class="tag">Prova social</span><h2>${esc(titulo)}</h2><p class="lead">Placas NexTap funcionando no balcão de negócios reais.</p></div>
<div class="prova">${PROVA.map(p => `<figure class="pv"><img loading="lazy" src="${p.img}" width="360" height="640" alt="${esc(p.alt)}"><figcaption><b>${esc(p.nome)}</b><span>${esc(p.tipo)}</span>${p.ig ? `<a href="https://www.instagram.com/${p.ig}/" target="_blank" rel="nofollow noopener">@${esc(p.ig)}</a>` : ''}</figcaption></figure>`).join('')}</div></div></section>`;

const videosHtml = (titulo = 'Veja as placas em ação') => `<section id="videos"><div class="w"><div class="c"><span class="tag">Vídeos</span><h2>${esc(titulo)}</h2><p class="lead">Acabamento em acrílico, NFC e QR Code dinâmico, em vídeo.</p></div>
<div class="vids">${VIDEOS.map(v => `<figure class="vd"><video controls preload="none" playsinline poster="${v.poster}" width="360" height="640"><source src="${v.src}" type="video/mp4"></video><figcaption>${esc(v.nome)}</figcaption></figure>`).join('')}</div></div></section>`;

const painelHtml = () => `<section id="painel"><div class="w"><div class="split"><div><span class="tag">Painel do revendedor</span><h2>Tudo o que o revendedor precisa, em um só lugar</h2><p class="lead">Gerencie placas, acompanhe vendas em um dashboard completo e crie biosites integrados para os seus clientes.</p><ul class="chk"><li>Gestão de placas: ative, configure e acompanhe todas.</li><li>Vendas e dashboard: faturamento e resultados em tempo real.</li><li>Biosites integrados: página personalizada com WhatsApp, Google, localização e Instagram.</li><li>Feito para revendedores: organize clientes e entregas.</li></ul><a class="btn p lg" href="/revendedor/?tab=registro">Seja um revendedor NexTap</a></div>
<figure class="pn"><img loading="lazy" src="/midia/painel-revendedor.webp" width="560" height="700" alt="Painel do revendedor NexTap com dashboard de vendas, gestão de placas e biosite integrado"></figure></div></div></section>`;

const fotosHtml = () => `<section id="fotos"><div class="w"><div class="c"><span class="tag">Na prática</span><h2>As placas NexTap de perto</h2></div><div class="gal"><img loading="lazy" src="/midia/placas-mao-google.webp" width="900" height="816" alt="Placas NexTap azul e preta de avaliação do Google com NFC e QR Code"><img loading="lazy" src="/midia/placas-mao-azul.webp" width="900" height="951" alt="Placas NexTap azuis de avaliação do Google em acrílico com NFC e QR Code"></div></div></section>`;

const videoLd = url => VIDEOS.map(v => ({ '@context': 'https://schema.org', '@type': 'VideoObject', name: v.nome, description: v.desc, thumbnailUrl: url + v.poster, contentUrl: url + v.src, uploadDate: '2026-11-11', duration: v.dur, inLanguage: 'pt-BR' }));

const CSS = `.prova{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:28px}.pv{margin:0;background:var(--card);border:1px solid var(--br);border-radius:18px;overflow:hidden;box-shadow:0 20px 40px -30px #0a5c2f66}.pv img{display:block;width:100%;height:auto;aspect-ratio:9/14;object-fit:cover}.pv figcaption{padding:12px 14px;display:flex;flex-direction:column;gap:2px}.pv b{font-size:15px}.pv span{color:var(--mut);font-size:13px}.pv a{color:var(--pr2);font-weight:700;font-size:13px}
.vids{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,320px));gap:20px;justify-content:center;margin-top:28px}.vd{margin:0}.vd video{width:100%;height:auto;aspect-ratio:9/16;background:#000;border-radius:20px;display:block;box-shadow:0 24px 44px -26px #0a5c2f88}.vd figcaption{margin-top:8px;color:var(--mut);font-size:14px;text-align:center}
.split{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center}.pn{margin:0}.pn img{width:100%;height:auto;border-radius:22px;box-shadow:0 30px 60px -28px #0a5c2f66;display:block}.chk{list-style:none;padding:0;margin:14px 0 22px}.chk li{position:relative;padding:5px 0 5px 28px}.chk li:before{content:"✓";position:absolute;left:0;color:var(--pr);font-weight:900}
@media(max-width:900px){.prova{grid-template-columns:repeat(2,1fr)}.split{grid-template-columns:1fr}.pn{max-width:420px;margin:auto}}`;
module.exports = { PROVA, VIDEOS, provaHtml, videosHtml, painelHtml, fotosHtml, videoLd, CSS };
