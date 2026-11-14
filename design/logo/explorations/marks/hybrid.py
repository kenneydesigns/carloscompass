"""Monstrance-compass hybrid variations, 2026-11-13. Run: python3 hybrid.py"""
import math, os, subprocess, shutil
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
K = '#111111'

def P(r, deg):
    a = math.radians(deg); return (50 + r*math.sin(a), 50 - r*math.cos(a))
def off(pt, deg, d):  # move perpendicular to the ray direction
    a = math.radians(deg + 90); return (pt[0] + d*math.sin(a), pt[1] - d*math.cos(a))
def pts(ps): return ' '.join(f'{x:.2f},{y:.2f}' for x, y in ps)

def straight(deg, r0, r1, w):
    return f'<polygon points="{pts([off(P(r0,deg),deg,-w), P(r1,deg), off(P(r0,deg),deg,w)])}"/>'
def wavy(deg, r0, r1, w, amp=1.6, waves=1.5):
    n = 24; L, R = [], []
    for i in range(n + 1):
        t = i / n; c = P(r0 + (r1 - r0)*t, deg)
        c = off(c, deg, amp*math.sin(t*waves*2*math.pi)*min(1, t*3))
        hw = w*(1 - t)
        L.append(off(c, deg, -hw)); R.append(off(c, deg, hw))
    return f'<polygon points="{pts(L + R[::-1])}"/>'

def mark(n, ring=True, north=True, wave=False, long_=40, short=31):
    out = []
    for i in range(n):
        deg = i*360/n; is_long = i % 2 == 0
        r1 = long_ if is_long else short
        if north and i == 0: r1 = 48
        spacing = 2*math.pi*17/n; w = (0.36 if is_long else 0.26) * spacing
        if wave and not is_long: out.append(wavy(deg, 17, r1 + 2, w*1.3))
        else: out.append(straight(deg, 17, r1, w))
    body = ''.join(out)
    body += '<circle cx="50" cy="50" r="17" fill="#FFFFFF"/>'
    if ring: body += f'<circle cx="50" cy="50" r="13.2" fill="none" stroke="{K}" stroke-width="2.6"/>'
    body += '<circle cx="50" cy="50" r="9"/>'
    return body

V = {
  'H1  16 rays, ring, long north':            dict(n=16),
  'H2  24 rays, ring, long north':            dict(n=24),
  'H3  32 rays, ring, long north':            dict(n=32),
  'H4  24 rays, no ring, long north':         dict(n=24, ring=False),
  'H5  16 rays, straight + wavy, ring':       dict(n=16, wave=True),
  'H6  24 rays, straight + wavy, ring':       dict(n=24, wave=True),
  'H7  32 rays, straight + wavy, ring':       dict(n=32, wave=True),
  'H8  24 rays, ring, no long north (pure)':  dict(n=24, north=False),
}

def svg(body, fg=K, bg='#FFFFFF'):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">'
            f'<rect width="100" height="100" fill="{bg}"/><g fill="{fg}">'
            + body.replace(K, fg).replace('#FFFFFF', bg) + '</g></svg>')

tmp = os.path.join(HERE, '.render'); os.makedirs(tmp, exist_ok=True)
def render(text, size, name):
    s = os.path.join(tmp, name + '.svg'); o = os.path.join(tmp, f'{name}-{size}.png')
    open(s, 'w').write(text)
    subprocess.run(['sips', '-s', 'format', 'png', '-Z', str(size), s, '--out', o], capture_output=True)
    return Image.open(o).convert('RGB')

font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 15)
cols, cw, ch = 4, 270, 270
rows = math.ceil(len(V) / cols)
sheet = Image.new('RGB', (cols*cw + 20, rows*ch + 50), '#FFFFFF')
d = ImageDraw.Draw(sheet)
d.text((20, 14), 'Monstrance-compass hybrids. Sizes: 150, 32, 16 px on white; 32 px on navy.', fill='#555', font=font)
for i, (name, kw) in enumerate(V.items()):
    slug = name.split()[0]; body = mark(**kw)
    open(os.path.join(HERE, f'{slug}.svg'), 'w').write(svg(body).replace('<rect width="100" height="100" fill="#FFFFFF"/>', ''))
    x, y = 20 + (i % cols)*cw, 50 + (i // cols)*ch
    sheet.paste(render(svg(body), 150, slug), (x + 45, y))
    sheet.paste(render(svg(body), 32, slug), (x + 60, y + 170))
    sheet.paste(render(svg(body), 16, slug), (x + 112, y + 178))
    nav = Image.new('RGB', (48, 48), '#002747'); nav.paste(render(svg(body, fg='#FAF3D7', bg='#002747'), 32, slug + 'n'), (8, 8))
    sheet.paste(nav, (x + 150, y + 162))
    d.text((x + 10, y + 222), name, fill='#111', font=font)
sheet.save(os.path.join(HERE, '..', '2026-11-13-monstrance-hybrids.png'))
shutil.rmtree(tmp)
print('saved')
