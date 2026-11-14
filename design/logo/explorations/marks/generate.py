"""Black-only logo thumbnails, 2026-11-13. Run: python3 generate.py  (writes SVGs + sheet next to this file)."""
import math, os, subprocess
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
K = '#111111'

def P(r, deg, cx=50, cy=50):
    a = math.radians(deg); return (cx + r*math.sin(a), cy - r*math.cos(a))
def pts(*ps): return ' '.join(f'{x:.2f},{y:.2f}' for x, y in ps)
def ray(deg, r0, r1, hw):
    a = P(r0, deg - hw); b = P(r1, deg); c = P(r0, deg + hw)
    return f'<polygon points="{pts(a,b,c)}"/>'
def kite(deg, r, waist=10, wdeg=45):
    return f'<polygon points="{pts((50,50), P(waist, deg-wdeg), P(r, deg), P(waist, deg+wdeg))}"/>'
def arc(r, a0, a1, sw, large=1):
    (x0,y0),(x1,y1) = P(r,a0), P(r,a1)
    return f'<path d="M{x0:.2f} {y0:.2f} A{r} {r} 0 {large} 1 {x1:.2f} {y1:.2f}" fill="none" stroke="{K}" stroke-width="{sw}"/>'
def ring(r, sw): return f'<circle cx="50" cy="50" r="{r}" fill="none" stroke="{K}" stroke-width="{sw}"/>'
HOLE = lambda r: f'<circle cx="50" cy="50" r="{r}" fill="#FFFFFF"/>'
DOT = lambda r, cx=50, cy=50: f'<circle cx="{cx}" cy="{cy}" r="{r}"/>'
CURSOR = 'M0 0 L0 17 L4.6 12.8 L7.6 19.6 L10.4 18.4 L7.4 11.6 L13 11.6 Z'

marks = {}
# 1 Monstrance as compass rose
rays = ''.join(ray(d, 15, 47 if d == 0 else (38 if d % 90 == 0 else 30), 7 if d % 90 == 0 else 5) for d in range(0, 360, 30))
marks['1a Monstrance rose'] = rays + HOLE(15) + DOT(10)
marks['1b Monstrance rays, long north'] = ''.join(ray(d, 18, 48 if d == 0 else 34, 4.5) for d in [i*22.5 for i in range(16)]) + DOT(12)
star = kite(0, 47) + kite(90, 36) + kite(180, 36) + kite(270, 36) + kite(45, 22, 8) + kite(135, 22, 8) + kite(225, 22, 8) + kite(315, 22, 8)
marks['1c Compass star, host at center'] = star + HOLE(11) + DOT(7)
# 2 Needle pointing to a host
needle = f'<polygon points="{pts((50,82),(42,56),(50,34),(58,56))}"/>'
marks['2a Needle to host, in ring'] = ring(44, 5) + needle + DOT(7, 50, 22)
marks['2b Needle to host, half-outline'] = (f'<polygon points="{pts((42,56),(50,30),(58,56))}"/>'
    f'<polygon points="{pts((42,56),(50,88),(58,56))}" fill="none" stroke="{K}" stroke-width="3.5" stroke-linejoin="round"/>' + DOT(8, 50, 15))
# 3 Halo as compass ring
tick = f'<polygon points="{pts((50,2),(41,17),(59,17))}"/>'
marks['3a Halo ring, north tick'] = ring(33, 8) + tick
marks['3b Halo ring, north tick, host'] = ring(33, 8) + tick + DOT(11)
# 4 Cursor as needle
marks['4a Cursor needle, in ring'] = ring(44, 5) + f'<path d="{CURSOR}" transform="translate(45 18) rotate(20) scale(3.1)"/>'
marks['4b Cursor reaching a host'] = DOT(9, 50, 20) + f'<path d="{CURSOR}" transform="translate(47 36) rotate(20) scale(3.4)"/>'
# 5 CC monogram
marks['5a CC monogram as compass'] = arc(40, 125, 55, 9) + arc(21, 125, 55, 9) + f'<polygon points="{pts((50,0),(44,10),(56,10))}"/>'
marks['5b C around a host'] = arc(36, 130, 50, 11) + DOT(13) + f'<polygon points="{pts((50,1),(43,13),(57,13))}"/>'

def svg(body, fg=K, bg=None):
    body = body.replace(K, fg)
    bgr = f'<rect width="100" height="100" fill="{bg}"/>' if bg else ''
    hole = bg or '#FFFFFF'
    body = body.replace('fill="#FFFFFF"', f'fill="{hole}"')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">{bgr}<g fill="{fg}">{body}</g></svg>'

tmp = os.path.join(HERE, '.render'); os.makedirs(tmp, exist_ok=True)
def render(text, size, name):
    s = os.path.join(tmp, name + '.svg'); o = os.path.join(tmp, f'{name}-{size}.png')
    open(s, 'w').write(text)
    subprocess.run(['sips', '-s', 'format', 'png', '-Z', str(size), s, '--out', o], capture_output=True)
    return Image.open(o).convert('RGBA')

font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 15)
small = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 11)
cols, cw, ch = 4, 270, 290
rows = math.ceil(len(marks) / cols)
sheet = Image.new('RGB', (cols*cw + 20, rows*ch + 50), '#FFFFFF')
d = ImageDraw.Draw(sheet)
d.text((20, 14), 'Black-only mark directions. Sizes: 140, 32, 16 px on white; 32 px on navy.', fill='#555', font=font)
for i, (name, body) in enumerate(marks.items()):
    slug = name.split()[0]
    open(os.path.join(HERE, f'{slug}.svg'), 'w').write(svg(body))
    x, y = 20 + (i % cols)*cw, 50 + (i // cols)*ch
    sheet.paste(render(svg(body, bg='#FFFFFF'), 140, slug), (x + 50, y))
    sheet.paste(render(svg(body, bg='#FFFFFF'), 32, slug), (x + 60, y + 160))
    sheet.paste(render(svg(body, bg='#FFFFFF'), 16, slug), (x + 112, y + 168))
    nav = Image.new('RGB', (48, 48), '#002747'); nav.paste(render(svg(body, fg='#FAF3D7', bg='#002747'), 32, slug + 'n'), (8, 8))
    sheet.paste(nav, (x + 150, y + 152))
    d.text((x + 10, y + 214), name, fill='#111', font=font)
sheet.save(os.path.join(HERE, '..', '2026-11-13-mark-directions.png'))
print('saved')
