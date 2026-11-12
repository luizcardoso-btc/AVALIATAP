// Layout profissional das páginas de SEO (mesma identidade visual da home). ARQUIVO NOVO. Só gera HTML.
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const R = n => 'R$ ' + Number(n).toFixed(2).replace('.', ',');

const CSS = `:root{--bg:#fff;--soft:#eafbf1;--card:#fff;--tx:#0b1710;--mut:#5b6b60;--br:#dfece4;--pr:#0f9d4e;--pr2:#0c7a3d;--pr3:#0a5c2f;--grad:linear-gradient(135deg,#22c55e,#0a5c2f);--warn:#fff7e0;--warnb:#f3d27a}
@media(prefers-color-scheme:dark){:root{--bg:#081410;--soft:#0e1f17;--card:#0f231a;--tx:#eafbf1;--mut:#8fb0a0;--br:#173428;--warn:#2a2410;--warnb:#6b5a1d}}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:90px}body{margin:0;background:var(--bg);color:var(--tx);font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.55}
a{color:inherit;text-decoration:none}.w{max-width:1120px;margin:auto;padding:0 20px}img{max-width:100%}
header{position:sticky;top:0;z-index:9;background:var(--bg);border-bottom:1px solid var(--br)}.nav{display:flex;align-items:center;gap:22px;height:78px}.nav .logo img{height:58px;width:auto;display:block}
.nav nav{display:flex;gap:22px;margin-left:auto;font-size:14px;color:var(--mut);font-weight:600}.nav nav a:hover{color:var(--pr)}
.btn{display:inline-block;border:1px solid var(--br);background:var(--card);color:var(--tx);padding:11px 20px;border-radius:10px;font:600 14px inherit;cursor:pointer}
.btn.p{background:var(--grad);border-color:transparent;color:#fff;box-shadow:0 6px 16px #0f9d4e3d}.btn.p:hover{filter:brightness(1.06)}.btn.lg{padding:14px 26px;font-size:15px;border-radius:12px}
.tag{display:inline-block;background:var(--soft);color:var(--pr2);font-weight:700;font-size:12px;padding:5px 12px;border-radius:99px;letter-spacing:.04em;text-transform:uppercase}
.bc{font-size:13px;color:var(--mut);padding:16px 0 0}.bc a:hover{color:var(--pr)}
.hero{display:grid;grid-template-columns:1.1fr .9fr;gap:44px;align-items:center;padding:34px 0 56px}.hero.solo{grid-template-columns:1fr;padding:34px 0 40px;max-width:820px}
h1{font-size:clamp(30px,4.6vw,48px);line-height:1.1;margin:14px 0;letter-spacing:-.02em}h2{font-size:clamp(24px,3.4vw,34px);margin:8px 0 8px;line-height:1.2;letter-spacing:-.01em}h3{margin:0 0 6px;font-size:17px}
.lead{font-size:18px;color:var(--mut);max-width:620px}.row{display:flex;gap:12px;flex-wrap:wrap;margin:24px 0 18px}
.chips{display:flex;gap:10px 18px;flex-wrap:wrap;font-size:13.5px;color:var(--mut);font-weight:600}.chips span:before{content:"✓";color:var(--pr);font-weight:900;margin-right:6px}
.float{position:relative;display:flex;justify-content:center;padding:10px 0 30px}.float img{width:100%;max-width:400px;height:auto;border-radius:24px;box-shadow:0 34px 60px -22px #0a5c2f59;animation:fl 5.5s ease-in-out infinite}
@keyframes fl{0%,100%{transform:translateY(0) rotate(-1.4deg)}50%{transform:translateY(-14px) rotate(1.4deg)}}@media(prefers-reduced-motion:reduce){.float img{animation:none}}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:6px 0 40px}.stat{background:var(--card);border:1px solid var(--br);border-radius:14px;padding:20px 14px;text-align:center}
.stat b{display:block;font-size:clamp(20px,3vw,28px);background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;line-height:1.2}.stat small{color:var(--mut);font-weight:600}
section{padding:54px 0}section.s{background:var(--soft)}.c{text-align:center}.c .lead{margin:0 auto}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-top:28px}
.card{background:var(--card);border:1px solid var(--br);border-radius:16px;padding:22px}.card p{margin:6px 0 0;color:var(--mut);font-size:15px}
.num{width:40px;height:40px;border-radius:12px;background:var(--grad);color:#fff;font-weight:800;display:grid;place-items:center;margin-bottom:12px;font-size:17px}
.steps{counter-reset:s}.step{position:relative}.step .num{border-radius:50%}
.callout{margin:26px auto 0;max-width:860px;background:var(--card);border:1px solid var(--br);border-left:5px solid var(--pr);border-radius:14px;padding:20px 22px;text-align:left}
.callout.warn{background:var(--warn);border-color:var(--warnb);border-left-color:#e0a800}.callout b{display:block;margin-bottom:4px}.callout p{margin:0;color:var(--mut)}
.tiers{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px;margin-top:28px}.tier{background:var(--card);border:1px solid var(--br);border-radius:16px;padding:22px 14px;text-align:center}
.tier small{color:var(--mut);font-weight:600;display:block}.tier b{display:block;font-size:30px;margin:6px 0 2px;letter-spacing:-.02em}.tier.best{border:2px solid var(--pr);background:var(--soft);position:relative}.tier.best:before{content:"Melhor preço";position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:var(--grad);color:#fff;font-size:11px;font-weight:800;padding:3px 10px;border-radius:99px}
.note{color:var(--mut);font-size:14px;text-align:center;margin-top:14px}
details{border:1px solid var(--br);border-radius:12px;padding:15px 18px;margin-bottom:10px;background:var(--card)}summary{cursor:pointer;font-weight:700}details p{margin:10px 0 0;color:var(--mut)}
.faq{max-width:820px;margin:26px auto 0;text-align:left}
.pills{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:22px}.pills a{border:1px solid var(--br);background:var(--card);border-radius:99px;padding:10px 16px;font-weight:600;font-size:14px}.pills a:hover{border-color:var(--pr);color:var(--pr)}
.cta{background:var(--grad);color:#fff;border-radius:24px;padding:46px 26px;text-align:center;margin:10px 0 56px;box-shadow:0 24px 50px -24px #0a5c2f88}.cta h2{margin-top:0;color:#fff}.cta p{color:#e6fff0;max-width:560px;margin:0 auto 22px}
.cta .btn{background:#fff;color:var(--pr3);border-color:#fff;font-weight:800}
.art{max-width:820px;margin:0 auto}.art h2{margin-top:38px;padding-top:6px}.art p,.art li{font-size:16.5px}.art ul{list-style:none;padding:0}.art ul li{position:relative;padding:6px 0 6px 28px}.art ul li:before{content:"✓";position:absolute;left:0;color:var(--pr);font-weight:900}
.art ol{list-style:none;padding:0;counter-reset:n}.art ol li{counter-increment:n;position:relative;padding:12px 16px 12px 62px;background:var(--card);border:1px solid var(--br);border-radius:14px;margin:10px 0}.art ol li:before{content:counter(n);position:absolute;left:14px;top:50%;transform:translateY(-50%);width:34px;height:34px;border-radius:50%;background:var(--grad);color:#fff;font-weight:800;display:grid;place-items:center}
.art table{width:100%;border-collapse:separate;border-spacing:0;border:1px solid var(--br);border-radius:14px;overflow:hidden;margin:16px 0;background:var(--card)}.art th,.art td{text-align:left;padding:12px 16px;border-bottom:1px solid var(--br)}.art tr:last-child td{border-bottom:0}.art th{background:var(--soft);font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--pr2)}
.art a{color:var(--pr2);text-decoration:underline;text-underline-offset:3px}.mut{color:var(--mut)}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;margin:18px 0}.card.lk{display:flex;flex-direction:column;gap:6px;text-decoration:none!important;transition:.15s}.card.lk:hover{border-color:var(--pr);transform:translateY(-3px);box-shadow:0 14px 30px -18px #0a5c2f66}.card.lk b{font-size:17px}.card.lk span{color:var(--mut);font-size:14.5px}.card.lk i{color:var(--pr2);font-style:normal;font-weight:700;font-size:14px;margin-top:auto;padding-top:6px}
footer{background:var(--soft);border-top:1px solid var(--br);padding:44px 0 26px;font-size:14px;color:var(--mut)}.fg{display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr;gap:30px}.fg img{height:58px;margin-bottom:10px}.fg h4{margin:0 0 10px;color:var(--tx);font-size:14px}.fg a{display:block;padding:3px 0}.fg a:hover{color:var(--pr)}
.copy{border-top:1px solid var(--br);margin-top:28px;padding-top:18px;font-size:13px}
.wa{position:fixed;right:18px;bottom:18px;width:54px;height:54px;border-radius:50%;background:#22c55e;color:#fff;display:grid;place-items:center;box-shadow:0 6px 18px #0004;z-index:8}
@media(max-width:800px){.hero{grid-template-columns:1fr;gap:10px}.hero .float{order:-1}.nav nav{display:none}.nav{height:66px}.nav .logo img{height:48px}.fg{grid-template-columns:1fr 1fr}.stats{grid-template-columns:1fr}.float img{max-width:270px}}
@media(max-width:480px){.fg{grid-template-columns:1fr}.btn.lg{width:100%;text-align:center}}`;

const check = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

function tierCards(t, minimo) {
  const last = t.length - 1;
  const f = x => x.max_qty && x.max_qty < 100000 ? (x.min_qty === x.max_qty ? `${x.min_qty} placas` : `${x.min_qty} a ${x.max_qty} placas`) : `${x.min_qty}+ placas`;
  return `<div class="tiers">${t.map((x, i) => `<div class="tier${i === last && t.length > 1 ? ' best' : ''}"><small>${f(x)}</small><b>${R(x.unit_price)}</b><small>por placa</small></div>`).join('')}</div><p class="note">Frete calculado pelo CEP antes de pagar. Pedido mínimo de ${minimo} placas.</p>`;
}

function chrome({ p, url, canon, j, tiers, minimo, FOOT, FOOTSEG, title, body }) {
  const nav = `<header><div class="w nav"><a class="logo" href="/"><img src="/logo.png" alt="NexTap" width="76" height="58"></a><nav><a href="/#produto">Para quem</a><a href="/placas-avaliacao-google-por-segmento">Segmentos</a><a href="/#precos">Preços</a><a href="/como-conseguir-avaliacoes-no-google">Guia</a><a href="/revender-placas-nfc">Revender</a></nav><a class="btn p" href="/revendedor/?tab=registro">Criar conta grátis</a></div></header>`;
  const foot = `<footer><div class="w"><div class="fg"><div><img src="/logo.png" alt="NexTap" width="76" height="58"><p>Placas de acrílico com NFC e QR Code dinâmico para avaliação do Google. Atacado para revender ou usar no seu negócio, com envio para todo o Brasil.</p></div>
<div><h4>Segmentos</h4>${FOOTSEG.map(s => `<a href="${s.path}">${esc(s.nome)}</a>`).join('')}<a href="/placas-avaliacao-google-por-segmento"><b>Ver todos →</b></a></div>
<div><h4>Guias</h4><a href="/como-conseguir-avaliacoes-no-google">Conseguir mais avaliações</a><a href="/como-gerar-link-de-avaliacao-do-google">Gerar o link de avaliação</a><a href="/nfc-ou-qr-code-para-avaliacoes">NFC ou QR Code</a></div>
<div><h4>NexTap</h4><a href="/">Página inicial</a><a href="/fornecedor-placas-nfc-google">Fornecedor de placas NFC</a><a href="/placa-avaliacao-google-nfc">Como funciona a placa</a><a href="/revender-placas-nfc">Como revender</a><a href="/revendedor/">Área do revendedor</a></div></div>
<div class="copy">© 2026 NexTap. Todos os direitos reservados.</div></div></footer>`;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" type="image/png" href="/favicon.png">
<title>${esc(p.titulo)}</title><meta name="description" content="${esc(p.desc)}"><link rel="canonical" href="${esc(canon)}"><meta name="robots" content="index,follow,max-image-preview:large"><meta name="theme-color" content="#0f9d4e">
<meta property="og:type" content="${p.tipo === 'guia' ? 'article' : 'website'}"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="NexTap"><meta property="og:title" content="${esc(p.titulo)}"><meta property="og:description" content="${esc(p.desc)}"><meta property="og:url" content="${esc(canon)}"><meta property="og:image" content="${esc(url)}/placa.jpg"><meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${j}</script><style>${CSS}</style></head><body>${nav}${body}${foot}</body></html>`;
}

const faqHtml = faq => `<div class="faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`;
const ctaBlock = (h, t) => `<div class="cta"><h2>${h}</h2><p>${t}</p><a class="btn lg" href="/revendedor/?tab=registro">Criar conta grátis e comprar placas</a></div>`;
const crumbs = (p, canon) => `<div class="bc"><a href="/">NexTap</a>${p.hub ? ` › <a href="${p.hub}">Segmentos e guias</a>` : ''} › ${esc(p.nomeCurto || p.h1)}</div>`;

function render(ctx) {
  const { p, tiers, minimo, faq } = ctx;
  let body;
  if (p.seg) {
    const s = p.seg;
    body = `<div class="w">${crumbs(p)}<div class="hero"><div><span class="tag">Para ${esc(s.plural)}</span><h1>${esc(p.h1)}</h1><p class="lead">${esc(p.lead)}</p>
<div class="row"><a class="btn p lg" href="/revendedor/?tab=registro">Criar conta e comprar placas</a><a class="btn lg" href="#precos">Ver preços</a></div><div class="chips"><span>NFC + QR Code dinâmico</span><span>Sem aplicativo</span><span>Envio para todo o Brasil</span></div></div>
<div class="float"><img src="/placa.jpg" width="400" height="500" alt="Placa NexTap de avaliação do Google com NFC e QR Code para ${esc(s.plural)}"></div></div>
<div class="stats"><div class="stat"><b>NFC + QR Code</b><small>na mesma placa</small></div><div class="stat"><b>Poucos segundos</b><small>para o cliente avaliar</small></div><div class="stat"><b>A partir de ${minimo} placas</b><small>pedido mínimo baixo</small></div></div></div>
<section class="s" id="por-que"><div class="w"><div class="c"><span class="tag">Por que importa</span><h2>Avaliações no Google para ${esc(s.art)}</h2><p class="lead">${esc(s.intro)}</p></div><div class="grid">${s.porque.map((x, i) => `<div class="card"><div class="num">${i + 1}</div><p style="margin:0;color:var(--tx);font-size:15.5px">${esc(x)}</p></div>`).join('')}</div></div></section>
<section id="onde"><div class="w"><div class="c"><span class="tag">Onde colocar</span><h2>Os melhores pontos para a placa</h2></div><div class="grid">${s.onde.map(x => `<div class="card"><div class="num" style="background:var(--soft);color:var(--pr2)">${check}</div><p style="margin:0;color:var(--tx);font-size:15.5px">${esc(x)}</p></div>`).join('')}</div>
<div class="callout"><b>Quando pedir a avaliação</b><p>${esc(s.momento)}</p></div></div></section>
<section class="s" id="como"><div class="w"><div class="c"><span class="tag">Como funciona</span><h2>Do balcão à avaliação em 3 passos</h2></div><div class="grid steps"><div class="card step"><div class="num">1</div><h3>Coloque a placa</h3><p>Fixe a placa de acrílico em um ponto visível, como o balcão ou a recepção.</p></div><div class="card step"><div class="num">2</div><h3>Cliente aproxima o celular</h3><p>Por NFC ou lendo o QR Code com a câmera. Sem aplicativo e sem digitar nada.</p></div><div class="card step"><div class="num">3</div><h3>Avalia no Google</h3><p>A tela de avaliação da sua empresa abre direto. O link pode ser trocado depois pelo painel.</p></div></div></div></section>
<section id="precos"><div class="w"><div class="c"><span class="tag">Preços</span><h2>Quanto custa a placa NexTap</h2><p class="lead">Preço por placa conforme a quantidade. Compre para usar no seu negócio ou para revender a outros ${esc(s.plural)}.</p></div>${tierCards(tiers, minimo)}
<div class="callout warn"><b>Cuidados importantes</b><p>${esc(s.cuidado)} Seguindo as regras do Google, peça a todos os clientes, sem oferecer vantagens e sem escolher quem avalia.</p></div></div></section>
<section class="s" id="faq"><div class="w"><div class="c"><span class="tag">Dúvidas</span><h2>Perguntas frequentes</h2></div>${faqHtml(faq)}</div></section>
<section><div class="w"><div class="c"><h2>Veja também outros segmentos</h2></div><div class="pills">${(p.rel || []).map(o => `<a href="${o.path}">${esc(o.nome)}</a>`).join('')}<a href="${p.hub}"><b>Todos os segmentos →</b></a><a href="/como-conseguir-avaliacoes-no-google">Guia: mais avaliações</a></div></div></section>
<div class="w">${ctaBlock('Comece a receber mais avaliações', 'Crie sua conta grátis, escolha as placas e acompanhe o envio pelo painel.')}</div>`;
  } else {
    
    body = `<div class="w">${crumbs(p)}<div class="hero solo"><div><span class="tag">${p.tipo === 'guia' ? 'Guia' : p.tipo === 'hub' ? 'Segmentos' : 'NexTap'}</span><h1>${esc(p.h1)}</h1><p class="lead">${esc(p.lead)}</p>
<div class="row"><a class="btn p lg" href="/revendedor/?tab=registro">Criar conta grátis</a><a class="btn lg" href="/placas-avaliacao-google-por-segmento">Ver por segmento</a></div><div class="chips"><span>NFC + QR Code dinâmico</span><span>Sem aplicativo</span><span>Envio para todo o Brasil</span></div></div></div></div>
<section class="s"><div class="w"><div class="art">${p.corpo()}</div></div></section>
<section><div class="w"><div class="c"><span class="tag">Dúvidas</span><h2>Perguntas frequentes</h2></div>${faqHtml(faq)}</div></section>
<div class="w">${ctaBlock('Pronto para começar?', 'Crie sua conta grátis e faça seu pedido pelo painel.')}</div>`;
  }
  return chrome({ ...ctx, body });
}
module.exports = { render, tierCards };
