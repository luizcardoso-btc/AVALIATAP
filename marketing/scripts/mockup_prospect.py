#!/usr/bin/env python3
"""Prévia grátis da placa NexTap para um negócio (porta de entrada da prospecção).
Uso: python3 mockup_prospect.py --empresa "Barbearia do Zé" [--segmento Barbearia] [--nota 4.1] [--avaliacoes 23] [--cor "#16a34a"] --saida previa.png
Gera 1080x1350: a placa 10x10 cm com o nome da empresa, as 5 estrelas e um QR de demonstração, mais uma mensagem sugerida (previa.txt).
Não usa logo nem foto da empresa (só o nome em texto): é uma ilustração, marcada como prévia.
"""
import sys, os, argparse
sys.path.insert(0, os.path.dirname(__file__))
from _comum import *
import segno, io
W, H = 1080, 1350
AQUI = os.path.dirname(os.path.abspath(__file__)); LOGO = os.path.join(AQUI, '..', 'assets', 'logo-nextap.png')

def estrela(d, cx, cy, r, cor):
    import math
    pts = []
    for k in range(10):
        a = -math.pi / 2 + k * math.pi / 5; rr = r if k % 2 == 0 else r * 0.42; pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=cor)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--empresa', required=True); ap.add_argument('--segmento', default=''); ap.add_argument('--nota', type=float); ap.add_argument('--avaliacoes', type=int)
    ap.add_argument('--cor', default='#16a34a'); ap.add_argument('--saida', default='previa.png'); ap.add_argument('--link', default='https://nextapbrasil.com.br'); a = ap.parse_args()
    ac = hexrgb(a.cor); im = gradiente(W, H, (10, 31, 22), (4, 14, 10)).convert('RGBA'); d = ImageDraw.Draw(im, 'RGBA')
    brilho = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(brilho).ellipse((-250, -250, 650, 650), fill=hexrgb(a.cor, 34)); im.alpha_composite(brilho); d = ImageDraw.Draw(im)
    pilula(im, (64, 64), 'PRÉVIA GRÁTIS', fonte(30), hexrgb('#ffffff'), hexrgb('#06130d'))
    if os.path.exists(LOGO):
        lg = Image.open(LOGO).convert('RGBA'); lg.thumbnail((150, 120)); im.alpha_composite(lg, (W - 64 - lg.width, 54))
    y = texto_bloco(im, (64, 190), 'Como ficaria a placa da', fonte(44, False), W - 128, hexrgb('#d1d5db'))
    y = texto_bloco(im, (64, y + 4), a.empresa, fonte(78), W - 128, hexrgb('#ffffff'), 1.12)
    # a placa
    S = 600; px, py = (W - S) // 2, y + 30
    d.rounded_rectangle((px + 14, py + 22, px + S + 14, py + S + 22), radius=56, fill=(0, 0, 0, 110))
    d.rounded_rectangle((px, py, px + S, py + S), radius=56, fill=(250, 250, 250, 255), outline=hexrgb('#d1d5db'), width=4)
    d.rounded_rectangle((px + 12, py + 12, px + S - 12, py + S - 12), radius=46, outline=hexrgb(a.cor, 255), width=6)
    f = fonte(40); t = 'Avalie a'; d.text((px + (S - d.textlength(t, font=f)) / 2, py + 44), t, font=f, fill=hexrgb('#111827'))
    # nome: encolhe a fonte até caber; se ainda não couber, quebra em até 2 linhas
    tam = 54
    while tam > 34 and d.textlength(a.empresa, font=fonte(tam)) > S - 80: tam -= 2
    fn = fonte(tam); linhas = quebra(d, a.empresa, fn, S - 80)[:2]; yy = py + 90
    for l in linhas:
        d.text((px + (S - d.textlength(l, font=fn)) / 2, yy), l, font=fn, fill=hexrgb(a.cor)); yy += int(tam * 1.15)
    yy += 6
    for k in range(5): estrela(d, px + S / 2 + (k - 2) * 60, yy + 26, 25, hexrgb('#f59e0b'))
    qy = yy + 62; qs = py + S - 82 - qy
    qr = segno.make(a.link, error='m'); buf = io.BytesIO(); qr.save(buf, kind='png', scale=12, border=1, dark='#0b1f17'); q = Image.open(buf).convert('RGBA'); q = q.resize((qs, qs), Image.NEAREST)
    im.alpha_composite(q, (px + (S - qs) // 2, qy))
    f2 = fonte(28, False); t = 'Aproxime o celular ou leia o QR'; d.text((px + (S - d.textlength(t, font=f2)) / 2, py + S - 64), t, font=f2, fill=hexrgb('#374151'))
    y2 = py + S + 44
    if a.avaliacoes is not None:
        n = ('%.1f' % a.nota).replace('.', ',') if a.nota else '—'
        y2 = texto_bloco(im, (64, y2), 'Hoje: %s no Google, com %d avaliações.' % (n, a.avaliacoes), fonte(40), W - 128, hexrgb('#ffffff'), 1.2, alinha='center')
    y2 = texto_bloco(im, (64, y2 + 6), 'O cliente aproxima o celular e já cai na tela de avaliar.', fonte(32, False), W - 128, hexrgb('#d1d5db'), 1.3, alinha='center')
    ImageDraw.Draw(im).text((64, H - 62), 'Prévia ilustrativa · o QR é de demonstração', font=fonte(24, False), fill=hexrgb('#9ca3af'))
    im.convert('RGB').save(a.saida, optimize=True)
    msg = ('Oi! Tudo bem? Sou da NexTap, aqui de Feira de Santana.\n' + ('Vi que a %s tem %d avaliações no Google (nota %s). ' % (a.empresa, a.avaliacoes, ('%.1f' % a.nota).replace('.', ',') if a.nota else 'sem nota') if a.avaliacoes is not None else '') +
           'Fiz uma prévia de como ficaria a placa de avaliação da %s, sem compromisso. Posso te mandar um vídeo de 15 segundos mostrando como funciona?' % a.empresa)
    open(os.path.splitext(a.saida)[0] + '.txt', 'w').write(msg + '\n'); print(a.saida)
if __name__ == '__main__': main()
