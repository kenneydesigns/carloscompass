"""Final Carlo's Compass mark (H2: 24-ray monstrance-compass), 2026-11-13. Run: python3 mark/build.py"""
import os, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, '..', 'explorations', 'marks', 'hybrid.py')).read()
exec(src[:src.index('V = {')])            # reuse mark() geometry from the exploration
INK, PARCH, BLACK = '#002747', '#FAF3D7', '#111111'

def body(**kw):  # drop the white knockout disc: rays start at r=17, so the gap is real transparency
    return mark(**kw).replace('<circle cx="50" cy="50" r="17" fill="#FFFFFF"/>', '')
MAIN = body(n=24)
FAV = body(n=8, ring=False, long_=44, short=33)    # bolder 8-ray cut for 16-32 px

def doc(b, fg, vb='0 0 100 100', bg=None, scale=None):
    b = b.replace('#111111', fg)
    inner = f'<g fill="{fg}">{b}</g>'
    if scale:
        inner = f'<g transform="translate(50 50) scale({scale}) translate(-50 -50)">{inner}</g>'
    bgr = f'<rect width="100" height="100" fill="{bg}"/>' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="512" height="512">'
            f'<title>Carlo\'s Compass mark</title>{bgr}{inner}</svg>\n')

files = {
  'carlo-compass-mark-ink.svg':       doc(MAIN, INK),
  'carlo-compass-mark-parchment.svg': doc(MAIN, PARCH),
  'carlo-compass-mark-black.svg':     doc(MAIN, BLACK),
  'carlo-compass-avatar.svg':         doc(MAIN, PARCH, bg=INK, scale=0.74),   # circle-crop safe
  'carlo-compass-favicon.svg':        doc(FAV, PARCH, bg=INK, scale=0.9),
}
for name, text in files.items():
    open(os.path.join(HERE, name), 'w').write(text)
png = os.path.join(HERE, 'png'); os.makedirs(png, exist_ok=True)
for name, sizes in [('carlo-compass-avatar', [1024, 512, 400, 180]), ('carlo-compass-favicon', [64, 32, 16]),
                    ('carlo-compass-mark-ink', [512]), ('carlo-compass-mark-parchment', [512])]:
    for s in sizes:
        subprocess.run(['sips', '-s', 'format', 'png', '-Z', str(s), os.path.join(HERE, name + '.svg'),
                        '--out', os.path.join(png, f'{name}-{s}.png')], capture_output=True)
print('built', len(files), 'svgs')
