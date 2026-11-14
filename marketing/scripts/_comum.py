"""Utilidades compartilhadas: fontes, texto com quebra, gradientes, cover-crop."""
import os, glob
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def fonte(tam, negrito=True):
    cand = (['/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf'] if negrito else ['/usr/share/fonts/truetype/google-fonts/Poppins-Regular.ttf']) + \
           glob.glob('/usr/share/fonts/**/Poppins-%s.ttf' % ('Bold' if negrito else 'Regular'), recursive=True) + ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if negrito else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']
    for c in cand:
        if os.path.exists(c):
            return ImageFont.truetype(c, tam)
    return ImageFont.load_default()

def hexrgb(h, a=255):
    h = h.lstrip('#'); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)

def quebra(draw, texto, f, largura):
    linhas, atual = [], ''
    for p in str(texto).split():
        t = (atual + ' ' + p).strip()
        if draw.textlength(t, font=f) <= largura or not atual: atual = t
        else: linhas.append(atual); atual = p
    if atual: linhas.append(atual)
    return linhas

def texto_bloco(img, xy, texto, f, largura, cor, espac=1.18, contorno=0, alinha='left'):
    d = ImageDraw.Draw(img); x, y = xy; alt = int(f.size * espac)
    for l in quebra(d, texto, f, largura):
        xx = x + ((largura - d.textlength(l, font=f)) / 2 if alinha == 'center' else 0)
        d.text((xx, y), l, font=f, fill=cor, stroke_width=contorno, stroke_fill=(0, 0, 0, 255) if contorno else None)
        y += alt
    return y

def cobrir(im, w, h):
    im = im.convert('RGB'); r = max(w / im.width, h / im.height)
    im = im.resize((int(im.width * r) + 1, int(im.height * r) + 1), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))

def gradiente(w, h, topo, base):
    g = Image.new('RGB', (1, h)); px = g.load()
    for y in range(h):
        t = y / max(1, h - 1); px[0, y] = tuple(int(topo[i] + (base[i] - topo[i]) * t) for i in range(3))
    return g.resize((w, h))

def sombra_vertical(w, h, topo=55, base=225):
    m = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(m)
    for y in range(h):
        t = y / h; d.line([(0, y), (w, y)], fill=(0, 0, 0, int(topo + (base - topo) * t ** 1.5)))
    return m

def seta(img, x, y, tam, cor):
    d = ImageDraw.Draw(img); d.line([(x, y), (x + tam, y)], fill=cor, width=5); d.line([(x + tam - 12, y - 12), (x + tam, y), (x + tam - 12, y + 12)], fill=cor, width=5)

def pilula(img, xy, texto, f, bg, fg, pad=(26, 12), raio=999):
    d = ImageDraw.Draw(img); w = d.textlength(texto, font=f); x, y = xy
    box = (x, y, x + w + pad[0] * 2, y + f.size + pad[1] * 2 - 4)
    d.rounded_rectangle(box, radius=raio, fill=bg); d.text((x + pad[0], y + pad[1] - 4), texto, font=f, fill=fg)
    return box
