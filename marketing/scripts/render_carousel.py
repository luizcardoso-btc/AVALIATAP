#!/usr/bin/env python3
"""Renderiza um carrossel 'novelinha' (1080x1350) a partir de um JSON de roteiro.
Uso: python3 render_carousel.py roteiro.json saida_dir [--zip]
Cada slide: capitulo (ex.: "Capítulo 2"), titulo, texto, imagem (opcional: caminho de foto/arte gerada por IA), tipo (capa|cena|revelacao|cta), gancho (frase 'continua...').
Sem imagem, o slide usa fundo em degradê com número gigante do capítulo (a arte de IA entra depois, trocando só o campo imagem).
"""
import sys, os, json, zipfile
sys.path.insert(0, os.path.dirname(__file__))
from _comum import *
W, H = 1080, 1350
AQUI = os.path.dirname(os.path.abspath(__file__)); LOGO = os.path.join(AQUI, '..', 'assets', 'logo-nextap.png')

def slide(s, i, n, cfg):
    pal = cfg.get('paleta', {}); bg = pal.get('bg', '#0a1f16'); ac = pal.get('acento', '#22c55e'); txt = pal.get('texto', '#ffffff')
    topo, base = hexrgb(bg)[:3], tuple(int(c * 0.45) for c in hexrgb(bg)[:3])
    tipo = s.get('tipo', 'cena')
    if s.get('imagem') and os.path.exists(s['imagem']): im = cobrir(Image.open(s['imagem']), W, H)
    else:
        im = gradiente(W, H, tuple(min(255, int(c * 1.9) + 10) for c in topo), base)
        d0 = ImageDraw.Draw(im, 'RGBA'); f = fonte(760); num = str(i + 1)
        d0.text((W - d0.textlength(num, font=f) + 40, 120), num, font=f, fill=hexrgb(ac, 34))
    im = im.convert('RGBA'); im.alpha_composite(sombra_vertical(W, H)); d = ImageDraw.Draw(im)
    # topo: etiqueta do capítulo + marca
    cap = s.get('capitulo') or ('Capa' if tipo == 'capa' else 'Capítulo %d' % i)
    pilula(im, (64, 64), cap.upper(), fonte(30), hexrgb(ac), hexrgb('#06130d'))
    if os.path.exists(LOGO):
        lg = Image.open(LOGO).convert('RGBA'); lg.thumbnail((150, 120)); im.alpha_composite(lg, (W - 64 - lg.width, 54))
    # texto principal, ancorado embaixo
    ft = fonte(86 if tipo == 'capa' else 70); fb = fonte(40, False)
    tit_l = quebra(d, s.get('titulo', ''), ft, W - 128); corpo_l = quebra(d, s.get('texto', ''), fb, W - 128)
    alt = len(tit_l) * int(ft.size * 1.14) + (len(corpo_l) * int(fb.size * 1.4) + 26 if corpo_l else 0)
    y = H - 210 - alt
    for l in tit_l:
        d.text((64, y), l, font=ft, fill=hexrgb(txt), stroke_width=3, stroke_fill=(0, 0, 0, 200)); y += int(ft.size * 1.14)
    y += 26
    for l in corpo_l:
        d.text((64, y), l, font=fb, fill=hexrgb('#e5e7eb'), stroke_width=2, stroke_fill=(0, 0, 0, 170)); y += int(fb.size * 1.4)
    # rodapé: aviso, progresso e gancho
    aviso = cfg.get('aviso', '')
    if aviso: d.text((64, H - 62), aviso, font=fonte(24, False), fill=hexrgb('#cbd5e1', 220))
    for k in range(n):
        d.rounded_rectangle((64 + k * 46, H - 120, 64 + k * 46 + 34, H - 112), radius=4, fill=hexrgb(ac) if k <= i else hexrgb('#ffffff', 70))
    if tipo != 'cta' and i < n - 1:
        g = s.get('gancho') or 'Continua'; f = fonte(32); tw = d.textlength(g, font=f); bw = tw + 26 * 2 + 62; x0 = W - 64 - bw
        d.rounded_rectangle((x0, H - 150, x0 + bw, H - 150 + 62), radius=31, fill=hexrgb('#ffffff', 238))
        d.text((x0 + 26, H - 150 + 9), g, font=f, fill=hexrgb('#06130d')); seta(im, int(x0 + 26 + tw + 14), H - 150 + 31, 28, hexrgb('#06130d'))
    return im.convert('RGB')

def main():
    cfg = json.load(open(sys.argv[1])); out = sys.argv[2]; os.makedirs(out, exist_ok=True)
    sl = cfg['slides']; arquivos = []
    for i, s in enumerate(sl):
        p = os.path.join(out, 'slide-%02d.png' % (i + 1)); slide(s, i, len(sl), cfg).save(p, optimize=True); arquivos.append(p)
    if '--zip' in sys.argv:
        z = os.path.join(out, 'carrossel.zip')
        with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
            for a in arquivos: zf.write(a, os.path.basename(a))
    print('\n'.join(arquivos))
if __name__ == '__main__': main()
