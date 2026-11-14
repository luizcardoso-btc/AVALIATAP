// Prospecção de empresas locais (admin) — cadastro, funil, cadência automática, pontuação por oportunidade, fila do dia, números e entrada de leads da Bianca.
// Rotas: /api/admin/prospeccao (lista, fila, stats, cria, importa, edita, apaga, registra contato)
//        /api/prospeccao/bianca/* (lote e resumo; aceita admin logado OU o token BIANCA_TOKEN no cabeçalho x-bianca-token)
const express = require('express');
const crypto = require('crypto');
const db = require('./database.js');
const { requireAdmin } = require('./auth-middleware.js');

const router = express.Router();
const STATUS = ['novo', 'abordado', 'interessado', 'orcamento', 'fechado', 'perdido'];
const TIPOS = ['visita', 'whatsapp', 'ligacao', 'instagram', 'nota'];
// Motivo de perda padronizado (para somar no painel) e em quantos dias a empresa volta sozinha para "novo".
const MOTIVOS = {
  preco: ['Achou caro', 60], ja_tem: ['Já tem solução', 90], sem_interesse: ['Sem interesse', 120],
  sem_resposta: ['Não respondeu', 60], nao_e_decisor: ['Não é o decisor', 60], fechou_concorrente: ['Fechou com concorrente', 120], outro: ['Outro motivo', 90],
};
// Cadência de WhatsApp: abordagem (dia 0), demonstração (+1), empurrão (+2 = dia 3), encerramento (+4 = dia 7). Depois disso vira "perdido/sem resposta" e volta em 60 dias.
const PASSOS_DIAS = [1, 2, 4];
const MAX_TENTATIVAS = 4;

const txt = (v, n) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
const data = v => (/^\d{4}-\d\d-\d\d$/.test(String(v || '')) ? v : null);
const digitos = v => String(v || '').replace(/\D/g, '');
const agora = () => new Date().toISOString().replace('T', ' ').slice(0, 19);
const hojeBR = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
const maisDias = n => new Date(Date.now() - 3 * 3600e3 + n * 864e5).toISOString().slice(0, 10);
const num = (v, min, max) => { if (v === null || v === undefined || v === '') return null; const n = Number(String(v).replace(',', '.')); return Number.isFinite(n) && n >= min && n <= max ? n : null; };

// Celular (WhatsApp) x fixo: no Brasil celular tem 9 dígitos depois do DDD, e começa com 9.
function foneTipo(t) {
  let d = digitos(t); if (d.startsWith('55') && d.length >= 12) d = d.slice(2);
  if (!d) return '';
  if (d.length === 11 && d[2] === '9') return 'movel';
  if (d.length === 10 && '2345'.includes(d[2])) return 'fixo';
  return 'duvida';
}
const chaveFone = t => { let d = digitos(t); if (d.startsWith('55') && d.length >= 12) d = d.slice(2); return d.length >= 10 ? d.slice(-10) : ''; }; // compara sem o 9 extra: últimos 10 dígitos

// Qual página do site mostrar para cada tipo de empresa (a mesma que o Google enxerga).
const LINKS_SEG = [
  [/barbear/, 'barbearia'], [/sal[aã]o|beleza|est[eé]tica|cabelo|unha|manicure/, 'salao-de-beleza'], [/odont|dent/, 'dentista'],
  [/cl[ií]nica|consult[oó]rio|m[eé]dic|psic|fisio|nutri/, 'clinica-e-consultorio'], [/padaria|caf[eé]|confeitaria|past[eé]is|pastelaria|doceria|sorvet|a[cç]a[ií]/, 'padaria-e-cafeteria'],
  [/restaurante|lanchonete|pizz|hamb|churrasc|bar\b|delivery|marmit|espet|food/, 'restaurante'], [/lava|detail|funilaria|pintura autom/, 'lava-jato-e-estetica-automotiva'],
  [/oficina|auto|mec[aâ]nic|pneu|borrach|autope/, 'oficina-mecanica'], [/academia|crossfit|pilates|muscula|fitness/, 'academia'], [/pet|veterin|banho e tosa/, 'pet-shop'],
  [/loja|roupa|boutique|moda|cal[cç]ado/, 'loja-de-roupas'], [/farm[aá]cia|drogaria/, 'farmacia'], [/imobili|corretor/, 'imobiliaria'],
  [/contab|advoc|escrit[oó]rio/, 'escritorio-de-contabilidade-e-advocacia'], [/hotel|pousada|hostel/, 'hotel-e-pousada'],
];
function linkSeg(seg) {
  const s = String(seg || '').toLowerCase();
  for (const [re, slug] of LINKS_SEG) if (re.test(s)) return '/placa-avaliacao-google-para-' + slug;
  return '/placa-avaliacao-google-nfc';
}
const SEG_FORTES = /restaurante|lanchonete|pizz|barbear|sal[aã]o|beleza|est[eé]tica|cl[ií]nica|consult|odont|dent|academia|pet|oficina|auto|padaria|caf[eé]|past/i;

// Pontuação 0–100: quanto mais a empresa tem a ganhar com avaliações (e quanto mais fácil falar com ela), maior.
function pontuar(p) {
  let s = 0;
  const av = p.google_avaliacoes, nota = p.google_nota;
  if (av === null || av === undefined) s += 14; else s += av <= 10 ? 40 : av <= 50 ? 34 : av <= 150 ? 24 : av <= 400 ? 12 : 5;
  if (nota === null || nota === undefined) s += 8; else s += nota < 4 ? 25 : nota < 4.5 ? 22 : nota <= 4.7 ? 12 : 5;
  const ft = foneTipo(p.telefone); s += ft === 'movel' ? 15 : ft === 'fixo' ? 3 : ft === 'duvida' ? 6 : 0;
  s += SEG_FORTES.test(p.segmento || '') ? 12 : 6;
  if (p.instagram) s += 4; if (p.contato) s += 4;
  return Math.max(0, Math.min(100, Math.round(s)));
}

// Primeira frase da abordagem, baseada nos números do Google.
function gancho(p) {
  const av = p.google_avaliacoes, nota = p.google_nota;
  if (av === null || av === undefined) return '';
  const n = (nota !== null && nota !== undefined) ? ` (nota ${String(nota).replace('.', ',')})` : '';
  return `Vi que ${p.nome} tem ${av} avaliaç${av === 1 ? 'ão' : 'ões'} no Google${n}. `;
}

function enriquecer(p) {
  if (!p) return p;
  p.fone_tipo = foneTipo(p.telefone);
  p.link = linkSeg(p.segmento);
  p.gancho = gancho(p);
  p.msg_passo = Math.min(p.tentativas || 0, 3); // 0 = abordagem, 1 = demonstração, 2 = empurrão, 3 = encerramento
  return p;
}

function campos(b) {
  b = b || {};
  const nome = txt(b.nome, 120);
  if (!nome) return { erro: 'Informe o nome da empresa.' };
  const status = STATUS.includes(b.status) ? b.status : 'novo';
  const d = {
    nome, segmento: txt(b.segmento, 40), contato: txt(b.contato, 80), telefone: txt(b.telefone, 25), instagram: txt(b.instagram, 60).replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/[/?].*$/, ''),
    endereco: txt(b.endereco, 160), bairro: txt(b.bairro, 60), obs: String(b.obs ?? '').trim().slice(0, 800),
    status, prox_contato: data(b.prox_contato),
    google_nota: num(b.google_nota, 1, 5), google_avaliacoes: num(b.google_avaliacoes, 0, 1e6), maps_url: /^https?:\/\//i.test(String(b.maps_url || '')) ? String(b.maps_url).trim().slice(0, 300) : '',
    motivo_cod: status === 'perdido' ? (MOTIVOS[b.motivo_cod] ? b.motivo_cod : 'outro') : '',
  };
  if (d.google_avaliacoes !== null) d.google_avaliacoes = Math.round(d.google_avaliacoes);
  d.motivo_perda = status === 'perdido' ? (txt(b.motivo_perda, 120) || MOTIVOS[d.motivo_cod][0]) : '';
  d.score = pontuar(d);
  return { d };
}

const LISTA = `SELECT p.*, (SELECT COUNT(*) FROM prospecto_hist h WHERE h.prospecto_id = p.id) AS contatos,
  (SELECT MAX(h.criado_em) FROM prospecto_hist h WHERE h.prospecto_id = p.id AND h.tipo <> 'nota') AS ultimo_contato FROM prospectos p`;

// Perdidas voltam sozinhas para "novo" quando chega a data de reativação.
function reativar() {
  const hoje = hojeBR();
  const ids = db.prepare("SELECT id FROM prospectos WHERE status = 'perdido' AND reativar_em IS NOT NULL AND reativar_em <= ?").all(hoje);
  if (!ids.length) return 0;
  db.transaction(() => {
    for (const { id } of ids) {
      db.prepare("UPDATE prospectos SET status = 'novo', tentativas = 0, prox_contato = NULL, reativar_em = NULL, motivo_cod = '', motivo_perda = '', atualizado_em = datetime('now') WHERE id = ?").run(id);
      db.prepare("INSERT INTO prospecto_hist (prospecto_id, tipo, texto, criado_em) VALUES (?, 'nota', 'Voltou para a fila automaticamente (prazo de reativação).', ?)").run(id, agora());
    }
  })();
  return ids.length;
}

const lista = () => db.prepare(LISTA + ' ORDER BY p.atualizado_em DESC, p.id DESC LIMIT 3000').all().map(enriquecer);
const um = id => enriquecer(db.prepare(LISTA + ' WHERE p.id = ?').get(id));

router.get('/api/admin/prospeccao', requireAdmin, (req, res) => { reativar(); res.json(lista()); });

// ----- fila do dia: retornos vencidos primeiro, depois novas empresas por pontuação -----
router.get('/api/admin/prospeccao/fila', requireAdmin, (req, res) => {
  reativar();
  const hoje = hojeBR(), meta = Math.max(1, Math.min(100, parseInt(req.query.meta, 10) || 15));
  const feitos = db.prepare("SELECT COUNT(*) n FROM prospecto_hist WHERE tipo <> 'nota' AND date(criado_em, '-3 hours') = ?").get(hoje).n;
  const retornos = db.prepare(LISTA + " WHERE p.status NOT IN ('fechado','perdido') AND p.prox_contato IS NOT NULL AND p.prox_contato <= ? ORDER BY p.prox_contato ASC, p.score DESC LIMIT 200").all(hoje).map(enriquecer);
  // Hoje já contatadas não voltam para a fila de "novas".
  const novos = db.prepare(LISTA + " WHERE p.status = 'novo' AND (p.prox_contato IS NULL OR p.prox_contato > ?) ORDER BY p.score DESC, p.id ASC LIMIT 300").all(hoje).map(enriquecer);
  const fila = [...retornos, ...novos.filter(n => n.fone_tipo === 'movel' || n.instagram), ...novos.filter(n => !(n.fone_tipo === 'movel' || n.instagram))];
  const totalNovos = db.prepare("SELECT COUNT(*) n FROM prospectos WHERE status = 'novo'").get().n;
  const bianca7 = db.prepare("SELECT COUNT(*) n FROM prospectos WHERE origem = 'bianca' AND date(criado_em, '-3 hours') >= ?").get(maisDias(-6)).n;
  const biancaHoje = db.prepare("SELECT COUNT(*) n FROM prospectos WHERE origem = 'bianca' AND date(criado_em, '-3 hours') = ?").get(hoje).n;
  res.json({ meta, feitos_hoje: feitos, retornos_total: retornos.length, novos_total: totalNovos, bianca_hoje: biancaHoje, bianca_7d: bianca7, fila: fila.slice(0, 60) });
});

// ----- números: funil, segmento, bairro, motivos, origem, ritmo -----
router.get('/api/admin/prospeccao/stats', requireAdmin, (req, res) => {
  reativar();
  const L = db.prepare('SELECT * FROM prospectos').all();
  const abord = x => x.status !== 'novo';
  const agrupa = (campo, vazio) => {
    const m = {};
    for (const x of L) {
      const k = (x[campo] || '').trim() || vazio; const g = m[k] || (m[k] = { nome: k, total: 0, abordadas: 0, interessadas: 0, fechadas: 0, perdidas: 0 });
      g.total++; if (abord(x)) g.abordadas++; if (['interessado', 'orcamento', 'fechado'].includes(x.status)) g.interessadas++; if (x.status === 'fechado') g.fechadas++; if (x.status === 'perdido') g.perdidas++;
    }
    return Object.values(m).map(g => ({ ...g, conversao: g.abordadas ? Math.round(g.fechadas / g.abordadas * 100) : 0 })).sort((a, b) => b.fechadas - a.fechadas || b.interessadas - a.interessadas || b.total - a.total);
  };
  const funil = {}; STATUS.forEach(s => { funil[s] = L.filter(x => x.status === s).length; });
  const motivos = {}; L.filter(x => x.status === 'perdido').forEach(x => { const k = x.motivo_cod || 'outro'; motivos[k] = (motivos[k] || 0) + 1; });
  const origem = {}; L.forEach(x => { const o = origem[x.origem || 'manual'] || (origem[x.origem || 'manual'] = { origem: x.origem || 'manual', total: 0, abordadas: 0, fechadas: 0 }); o.total++; if (abord(x)) o.abordadas++; if (x.status === 'fechado') o.fechadas++; });
  const dias = {}; for (let i = 13; i >= 0; i--) dias[maisDias(-i)] = 0;
  db.prepare("SELECT date(criado_em, '-3 hours') d, COUNT(*) n FROM prospecto_hist WHERE tipo <> 'nota' GROUP BY d").all().forEach(r => { if (r.d in dias) dias[r.d] = r.n; });
  const fech = L.filter(x => x.status === 'fechado' && x.fechado_em);
  const diasFechar = fech.length ? Math.round(fech.reduce((a, x) => a + Math.max(0, (new Date(x.fechado_em.replace(' ', 'T') + 'Z') - new Date(x.criado_em.replace(' ', 'T') + 'Z')) / 864e5), 0) / fech.length * 10) / 10 : null;
  const faixa = x => (x.score >= 70 ? 'Alta (70+)' : x.score >= 50 ? 'Média (50–69)' : 'Baixa (<50)');
  const porScore = {}; L.filter(abord).forEach(x => { const k = faixa(x); const g = porScore[k] || (porScore[k] = { nome: k, abordadas: 0, fechadas: 0 }); g.abordadas++; if (x.status === 'fechado') g.fechadas++; });
  const semWpp = L.filter(x => x.status === 'novo' && foneTipo(x.telefone) !== 'movel' && !x.instagram).length;
  res.json({
    total: L.length, funil, segmentos: agrupa('segmento', 'Sem segmento'), bairros: agrupa('bairro', 'Sem bairro').slice(0, 12), motivos: Object.entries(motivos).map(([k, n]) => ({ cod: k, nome: (MOTIVOS[k] || MOTIVOS.outro)[0], n })).sort((a, b) => b.n - a.n),
    origem: Object.values(origem), ritmo: Object.entries(dias).map(([d, n]) => ({ d, n })), dias_para_fechar: diasFechar, por_score: Object.values(porScore), sem_canal: semWpp,
    conversao: L.filter(abord).length ? Math.round(funil.fechado / L.filter(abord).length * 100) : 0,
  });
});

// ----- cadastro e importação (com repetidos detectados por telefone ou nome+bairro) -----
const BASE_INS = `INSERT INTO prospectos (nome, segmento, contato, telefone, instagram, endereco, bairro, obs, status, prox_contato, motivo_perda, google_nota, google_avaliacoes, maps_url, origem, score, motivo_cod)
  VALUES (@nome, @segmento, @contato, @telefone, @instagram, @endereco, @bairro, @obs, @status, @prox_contato, @motivo_perda, @google_nota, @google_avaliacoes, @maps_url, @origem, @score, @motivo_cod)`;

function repetida(d) {
  const k = chaveFone(d.telefone);
  const todas = db.prepare('SELECT id, nome, bairro, telefone, instagram FROM prospectos').all();
  return todas.find(p => (k && chaveFone(p.telefone) === k) || (p.nome.toLowerCase() === d.nome.toLowerCase() && (!d.bairro || !p.bairro || p.bairro.toLowerCase() === d.bairro.toLowerCase()))
    || (d.instagram && p.instagram && p.instagram.toLowerCase() === d.instagram.toLowerCase()));
}

router.post('/api/admin/prospeccao', requireAdmin, (req, res) => {
  const v = campos(req.body); if (v.erro) return res.status(400).json({ error: v.erro });
  const r = db.prepare(BASE_INS).run({ ...v.d, origem: 'manual' });
  res.json(um(r.lastInsertRowid));
});

// Cola uma lista: uma empresa por linha — "Nome; telefone; segmento; bairro; nota; avaliações" (separador ; ou tab ou |).
router.post('/api/admin/prospeccao/importar', requireAdmin, (req, res) => {
  const linhas = String((req.body || {}).texto || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean).slice(0, 500);
  const segPadrao = txt((req.body || {}).segmento, 40);
  let novos = 0, repetidos = 0;
  db.transaction(() => {
    for (const l of linhas) {
      const [nome, tel, seg, bairro, nota, av] = l.split(/\s*[;\t|]\s*/).map(x => txt(x, 120));
      if (!nome) continue;
      const v = campos({ nome, telefone: tel, segmento: seg || segPadrao, bairro, google_nota: nota, google_avaliacoes: av }); if (v.erro) continue;
      if (repetida(v.d)) { repetidos++; continue; }
      db.prepare(BASE_INS).run({ ...v.d, origem: 'importacao' }); novos++;
    }
  })();
  res.json({ novos, repetidos });
});

router.get('/api/admin/prospeccao/:id', requireAdmin, (req, res) => {
  const p = um(req.params.id);
  if (!p) return res.status(404).json({ error: 'Empresa não encontrada.' });
  p.historico = db.prepare('SELECT id, tipo, texto, criado_em FROM prospecto_hist WHERE prospecto_id = ? ORDER BY id DESC LIMIT 200').all(p.id);
  res.json(p);
});

router.put('/api/admin/prospeccao/:id', requireAdmin, (req, res) => {
  const v = campos(req.body); if (v.erro) return res.status(400).json({ error: v.erro });
  const prev = db.prepare('SELECT * FROM prospectos WHERE id = ?').get(req.params.id);
  if (!prev) return res.status(404).json({ error: 'Empresa não encontrada.' });
  const reativar_em = v.d.status !== 'perdido' ? null : (prev.status === 'perdido' && prev.reativar_em ? prev.reativar_em : maisDias(MOTIVOS[v.d.motivo_cod][1]));
  const fechado_em = v.d.status !== 'fechado' ? null : (prev.fechado_em || agora());
  db.prepare(`UPDATE prospectos SET nome=@nome, segmento=@segmento, contato=@contato, telefone=@telefone, instagram=@instagram, endereco=@endereco,
    bairro=@bairro, obs=@obs, status=@status, prox_contato=@prox_contato, motivo_perda=@motivo_perda, motivo_cod=@motivo_cod, google_nota=@google_nota,
    google_avaliacoes=@google_avaliacoes, maps_url=@maps_url, score=@score, reativar_em=@reativar_em, fechado_em=@fechado_em, atualizado_em=datetime('now') WHERE id=@id`)
    .run({ ...v.d, reativar_em, fechado_em, id: Number(req.params.id) });
  res.json(um(req.params.id));
});

router.delete('/api/admin/prospeccao/:id', requireAdmin, (req, res) => {
  db.transaction(() => {
    db.prepare('DELETE FROM prospecto_hist WHERE prospecto_id = ?').run(req.params.id);
    db.prepare('DELETE FROM prospectos WHERE id = ?').run(req.params.id);
  })();
  res.json({ ok: true });
});

// Registra um contato (visita, WhatsApp, ligação) ou nota. A cadência é automática:
// sem data informada, o retorno é marcado sozinho (+1, +2, +4 dias). Na 4ª tentativa sem avanço a empresa vai para "perdida/sem resposta" e volta em 60 dias.
router.post('/api/admin/prospeccao/:id/contato', requireAdmin, (req, res) => {
  const p = db.prepare('SELECT * FROM prospectos WHERE id = ?').get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Empresa não encontrada.' });
  const b = req.body || {};
  const tipo = TIPOS.includes(b.tipo) ? b.tipo : 'nota';
  const texto = String(b.texto ?? '').trim().slice(0, 800);
  if (!texto && tipo === 'nota') return res.status(400).json({ error: 'Escreva a anotação.' });
  let status = STATUS.includes(b.status) ? b.status : p.status;
  const saiu = tipo !== 'nota'; // contato de verdade (não só anotação)
  if (status === 'novo' && saiu) status = 'abordado';
  const explicita = data(b.prox_contato);
  let tentativas = p.tentativas || 0, prox = explicita || (saiu ? null : p.prox_contato), motivoCod = '', motivoTxt = '', reativarEm = null, nota = '';
  if (saiu && ['abordado', 'novo'].includes(status)) tentativas++;
  if (status === 'abordado' && saiu) {
    if (tentativas >= MAX_TENTATIVAS && !explicita) { status = 'perdido'; motivoCod = 'sem_resposta'; prox = null; nota = 'Sem resposta depois de ' + tentativas + ' tentativas. Volta para a fila em 60 dias.'; }
    else if (!explicita) prox = maisDias(PASSOS_DIAS[Math.min(tentativas - 1, PASSOS_DIAS.length - 1)]);
  } else if (['interessado', 'orcamento'].includes(status) && saiu && !explicita) prox = maisDias(2);
  if (status === 'perdido' && !motivoCod) motivoCod = MOTIVOS[b.motivo_cod] ? b.motivo_cod : (p.motivo_cod || 'outro');
  if (status === 'perdido') { motivoTxt = txt(b.motivo_perda, 120) || MOTIVOS[motivoCod][0]; reativarEm = p.status === 'perdido' && p.reativar_em ? p.reativar_em : maisDias(MOTIVOS[motivoCod][1]); prox = null; }
  if (status === 'fechado') prox = null;
  const fechadoEm = status === 'fechado' ? (p.fechado_em || agora()) : null;
  db.transaction(() => {
    db.prepare('INSERT INTO prospecto_hist (prospecto_id, tipo, texto, criado_em) VALUES (?, ?, ?, ?)').run(p.id, tipo, texto || 'Contato registrado', agora());
    if (nota) db.prepare("INSERT INTO prospecto_hist (prospecto_id, tipo, texto, criado_em) VALUES (?, 'nota', ?, ?)").run(p.id, nota, agora());
    db.prepare("UPDATE prospectos SET status=?, prox_contato=?, tentativas=?, motivo_cod=?, motivo_perda=?, reativar_em=?, fechado_em=?, atualizado_em=datetime('now') WHERE id=?")
      .run(status, prox, tentativas, motivoCod, motivoTxt, reativarEm, fechadoEm, p.id);
  })();
  res.json(um(p.id));
});

// ----- Bianca (setor de vendas): entrega leads novos e consulta o que já existe -----
function tokenOk(req) {
  const t = process.env.BIANCA_TOKEN; const h = String(req.get('x-bianca-token') || '');
  if (!t || t.length < 16 || !h) return false;
  const a = crypto.createHash('sha256').update(t).digest(), b = crypto.createHash('sha256').update(h).digest();
  return crypto.timingSafeEqual(a, b);
}
function adminOuBianca(req, res, next) { if (tokenOk(req)) return next(); return requireAdmin(req, res, next); }

router.post('/api/prospeccao/bianca/lote', adminOuBianca, (req, res) => {
  const lista = Array.isArray((req.body || {}).empresas) ? req.body.empresas.slice(0, 200) : [];
  if (!lista.length) return res.status(400).json({ error: 'Envie "empresas": uma lista com pelo menos uma empresa.' });
  let novos = 0, repetidos = 0, invalidos = 0; const ids = [];
  db.transaction(() => {
    for (const e of lista) {
      const v = campos({ ...e, status: 'novo' }); if (v.erro) { invalidos++; continue; }
      if (!digitos(v.d.telefone) && !v.d.instagram) { invalidos++; continue; } // sem canal de contato não serve
      if (repetida(v.d)) { repetidos++; continue; }
      const r = db.prepare(BASE_INS).run({ ...v.d, origem: 'bianca' }); ids.push(r.lastInsertRowid); novos++;
    }
  })();
  res.json({ novos, repetidos, invalidos, ids });
});

// Resumo para a Bianca não repetir empresas: nomes/telefones já cadastrados (sem dados de contato de pessoas), mais o placar de hoje.
router.get('/api/prospeccao/bianca/resumo', adminOuBianca, (req, res) => {
  reativar();
  const L = db.prepare('SELECT nome, bairro, segmento, status, telefone FROM prospectos').all();
  const porSeg = {}; L.forEach(x => { const k = x.segmento || 'Sem segmento'; porSeg[k] = (porSeg[k] || 0) + 1; });
  res.json({ total: L.length, novos_aguardando: L.filter(x => x.status === 'novo').length, por_segmento: porSeg, cadastradas: L.map(x => ({ nome: x.nome, bairro: x.bairro, telefone_final: digitos(x.telefone).slice(-4) })) });
});

// ----- Lotes da Bianca por arquivo -----
// A Bianca roda fora do servidor e entrega os leads do dia em bianca/lotes/AAAA-MM-DD.json (no GitHub). Cada arquivo é importado uma única vez,
// no início do servidor (a cada deploy). Se você apagar uma empresa depois, ela não volta: o arquivo já consta como importado.
const fs = require('fs'), path = require('path');
function importarLotes() {
  const dir = path.join(__dirname, 'bianca', 'lotes'); let arqs = [];
  try { arqs = fs.readdirSync(dir).filter(f => /^[\w.-]+\.json$/.test(f)).sort(); } catch (e) { return { arquivos: 0, novos: 0 }; }
  let arquivos = 0, novos = 0;
  for (const f of arqs) {
    const chave = 'bianca_lote_' + f;
    if (db.prepare('SELECT 1 FROM settings WHERE chave = ?').get(chave)) continue;
    let j; try { j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { console.error('[Bianca] Arquivo inválido:', f, e.message); continue; }
    const empresas = Array.isArray(j) ? j : (Array.isArray(j.empresas) ? j.empresas : []);
    let n = 0, rep = 0;
    db.transaction(() => {
      for (const e of empresas.slice(0, 300)) {
        const v = campos({ ...e, status: 'novo' }); if (v.erro) continue;
        if (!digitos(v.d.telefone) && !v.d.instagram) continue;
        if (repetida(v.d)) { rep++; continue; }
        db.prepare(BASE_INS).run({ ...v.d, origem: 'bianca' }); n++;
      }
      db.prepare('INSERT INTO settings (chave, valor) VALUES (?, ?)').run(chave, new Date().toISOString());
    })();
    arquivos++; novos += n; console.log(`[Bianca] ${f}: ${n} novas empresas (${rep} já existiam).`);
  }
  return { arquivos, novos };
}
try { importarLotes(); } catch (e) { console.error('[Bianca] Falha ao importar lotes:', e.message); }

module.exports = router;
module.exports._t = { pontuar, foneTipo, linkSeg, chaveFone, gancho };
