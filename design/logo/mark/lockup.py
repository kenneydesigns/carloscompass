"""Carlo's Compass lockups: mark + Merriweather wordmark, text outlined. 2026-11-13.
Run with a Python that has fontTools:  python3 mark/lockup.py"""
import os, re, subprocess
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HERE, '..', '..', 'fonts', 'Merriweather[opsz,wdth,wght].ttf')
TEXT = 'Carlo’s Compass'
INK, PARCH = '#002747', '#FAF3D7'
WGHT, OPSZ = 700, 48

font = instantiateVariableFont(TTFont(FONT), {'wght': WGHT, 'opsz': OPSZ, 'wdth': 100})
gs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font['hmtx']
upm, cap = font['head'].unitsPerEm, font['OS/2'].sCapHeight

# pair kerning from GPOS PairPos format 1 (glyph pairs) and format 2 (classes)
def kern(a, b):
    for lk in font['GPOS'].table.LookupList.Lookup:
        for st in lk.SubTable:
            if lk.LookupType == 9: st = st.ExtSubTable
            if getattr(st, 'LookupType', lk.LookupType) != 2 or a not in st.Coverage.glyphs: continue
            if st.Format == 1:
                ps = st.PairSet[st.Coverage.glyphs.index(a)]
                for r in ps.PairValueRecord:
                    if r.SecondGlyph == b and r.Value1: return getattr(r.Value1, 'XAdvance', 0) or 0
            else:
                c1 = st.ClassDef1.classDefs.get(a, 0); c2 = st.ClassDef2.classDefs.get(b, 0)
                v = st.Class1Record[c1].Class2Record[c2].Value1
                if v and getattr(v, 'XAdvance', 0): return v.XAdvance
    return 0

def word():
    x, parts, names = 0, [], [cmap[ord(c)] for c in TEXT]
    for i, g in enumerate(names):
        pen = SVGPathPen(gs); gs[g].draw(pen); d = pen.getCommands()
        if d: parts.append(f'<path transform="translate({x} 0)" d="{d}"/>')
        x += hmtx[g][0] + (kern(g, names[i+1]) if i + 1 < len(names) else 0)
    return ''.join(parts), x   # font units, y up, baseline 0

WORD, WW = word()
MARK = re.search(r'<g fill="[^"]+">(.*)</g></svg>', open(os.path.join(HERE, 'carlo-compass-mark-ink.svg')).read()).group(1)

def text_g(fill, x, baseline, cap_px):
    s = cap_px / cap
    return f'<g fill="{fill}" transform="translate({x:.2f} {baseline:.2f}) scale({s:.5f} {-s:.5f})">{WORD}</g>', WW * s

def horizontal(fg, bg):
    capp = 27; base = 50 + capp/2
    t, w = text_g(fg, 104, base, capp)
    W = 104 + w + 6
    return W, 100, f'<g fill="{fg}">{MARK.replace(INK, fg)}</g>{t}'
def stacked(fg, bg):
    capp = 16; t, w = text_g(fg, 0, 0, capp)
    W = max(100, w) + 12
    t, w = text_g(fg, (W - w)/2, 100 + 6 + capp, capp)
    return W, 100 + 6 + capp + 8, f'<g fill="{fg}" transform="translate({(W-100)/2:.2f} 0)">{MARK.replace(INK, fg)}</g>{t}'

def doc(W, H, body, bg=None):
    bgr = f'<rect x="-8" y="-8" width="{W+16:.2f}" height="{H+16:.2f}" fill="{bg}"/>' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 {W+16:.2f} {H+16:.2f}" '
            f'width="{(W+16)*4:.0f}" height="{(H+16)*4:.0f}"><title>Carlo’s Compass</title>{bgr}{body}</svg>\n')

png = os.path.join(HERE, 'png')
for layout in (horizontal, stacked):
    for tone, fg, bg in (('ink', INK, None), ('parchment', PARCH, None)):
        W, H, body = layout(fg, bg)
        name = f'carlo-compass-lockup-{layout.__name__}-{tone}'
        open(os.path.join(HERE, name + '.svg'), 'w').write(doc(W, H, body))
        # PNG previews on their intended background
        prev = os.path.join(HERE, '.prev.svg')
        open(prev, 'w').write(doc(W, H, body, PARCH if tone == 'ink' else INK))
        subprocess.run(['sips', '-s', 'format', 'png', '-Z', '1600', prev, '--out', os.path.join(png, name + '.png')], capture_output=True)
        os.remove(prev)
print('lockups built; text width', round(WW))
