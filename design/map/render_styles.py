"""Basemap style explorations for the Canva mockup, 2026-11-13.

Renders the map behind the homepage mockup (1440x900 page, exported at 2x) in three
border styles, using real data: Natural Earth land/coast/rivers/lakes (public domain),
historical-basemaps borders for 1200 (GPL-3.0, see data/historical-basemaps/LICENSE),
and Eucharistic miracles dated on or before 1264 (scrubber parked on Bolsena, 1264).

Pin coordinates are approximate town centres for the mockup only; they are not reviewed data.

Run: python3 design/map/render_styles.py [europe-1264|holyland-28] [style ...]   (needs Pillow + numpy)
Out: design/map/renders/basemap-{quiet,atlas,tinted,tinted-soft}.png
"""
import json, math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, 'data')
OUT = os.path.join(HERE, 'renders')
FONT = os.path.join(HERE, '..', 'fonts', 'Merriweather[opsz,wdth,wght].ttf')

# Brand tokens (docs/brand.md)
INK, PARCH, SIGNATURE = (0, 39, 71), (250, 243, 215), (168, 12, 49)
GOLD, EARTH, MUTED = (219, 187, 124), (113, 66, 29), (92, 107, 122)

def mix(a, b, t):
    return tuple(round(a[i] * (1 - t) + b[i] * t) for i in range(3))

WATER = (96, 128, 150)                          # muted navy-blue, for sea and rivers
SEA = mix(PARCH, WATER, 0.34)
RIVER = mix(PARCH, WATER, 0.80)

# Frame: 1440x900 page; map visible left of the 400px side panel, under a 64px top bar.
W, H, OUT_SCALE, SS = 1440, 900, 2, 2          # SS = extra supersampling for anti-aliasing
S = OUT_SCALE * SS                              # drawing units per 1x pixel
# Views. 'europe-1264': miracles view, Bolsena selected. 'holyland-28': the Canva homepage mockup
# (Capernaum selected; pins/route/card are drawn in Canva, so no pins here). The Holy Land frame
# puts Capernaum at (619, 401) on the 1440x900 page, where the mockup's selected pin sits.
VIEWS = {
    'europe-1264': dict(px=27.5, lon0=-11.5, lat_top=56.4, box=(-20, 30, 50, 62), res='50m',
                        year='1200', pins=True, select=('Bolsena', 42.64, 11.99), suffix=''),
    'holyland-28': dict(px=210.0, anchor=((35.575, 32.881), (619, 401)), box=(31, 29, 40, 36),
                        res='10m', year='bc1', river_rank=12,
                        # 'soft-regions' style: hand-placed 1st-century region names instead of
                        # the world-scale borders, which are too coarse at this zoom.
                        regions=[('GALILEE', 33.06, 35.22), ('SAMARIA', 32.22, 35.18),
                                 ('JUDEA', 31.62, 35.02), ('DECAPOLIS', 32.55, 35.92),
                                 ('PEREA', 31.95, 35.68)],
                        sea=('MEDITERRANEAN SEA', 32.45, 34.15), pins=False, select=('Capernaum', 32.881, 35.575),
                        suffix='-holyland'),
}
V = VIEWS['europe-1264']
PX_PER_DEG = V['px']
LON0, LAT_TOP = V['lon0'], V['lat_top']

def merc(lat):
    return math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))

Y0 = merc(LAT_TOP)

def proj(lon, lat):
    return ((lon - LON0) * PX_PER_DEG * S, (Y0 - merc(max(min(lat, 85), -85))) * PX_PER_DEG * S)

VIEW = V['box']                                 # lon/lat box we bother drawing

def rings(geom):
    if geom is None:
        return []
    polys = geom['coordinates'] if geom['type'] == 'MultiPolygon' else [geom['coordinates']]
    return polys

def lines(geom):
    if geom['type'] == 'LineString':
        return [geom['coordinates']]
    if geom['type'] == 'MultiLineString':
        return geom['coordinates']
    return []

def in_view(coords):
    xs = [c[0] for c in coords]; ys = [c[1] for c in coords]
    return not (max(xs) < VIEW[0] or min(xs) > VIEW[2] or max(ys) < VIEW[1] or min(ys) > VIEW[3])

def load(path):
    return json.load(open(os.path.join(DATA, path)))['features']

def setup(name):
    """Point the module-level frame and data at one of VIEWS."""
    global V, PX_PER_DEG, LON0, LAT_TOP, Y0, VIEW, LAND, LAKES, RIVERS, REALMS, SELECTED
    V = VIEWS[name]
    PX_PER_DEG, VIEW, SELECTED = V['px'], V['box'], V['select']
    if 'anchor' in V:
        (alon, alat), (ax, ay) = V['anchor']
        LON0 = alon - ax / PX_PER_DEG
        Y0 = merc(alat) + ay / PX_PER_DEG
    else:
        LON0, Y0 = V['lon0'], merc(V['lat_top'])
    r = V['res']
    LAND = load(f'natural-earth/ne_{r}_land.geojson')
    LAKES = load(f'natural-earth/ne_{r}_lakes.geojson')
    RIVERS = load(f'natural-earth/ne_{r}_rivers_lake_centerlines.geojson')
    REALMS = load(f"historical-basemaps/world_{V['year']}.geojson")

SIZE = (W * S, H * S)

def poly_mask(features, keep=lambda f: True):
    m = Image.new('L', SIZE, 0)
    d = ImageDraw.Draw(m)
    for f in features:
        if not keep(f):
            continue
        for poly in rings(f['geometry']):
            if not in_view(poly[0]):
                continue
            d.polygon([proj(*c) for c in poly[0]], fill=255)
            for hole in poly[1:]:
                d.polygon([proj(*c) for c in hole], fill=0)
    return m

def fill(img, mask, color, alpha=1.0):
    layer = Image.new('RGBA', SIZE, color + (0,))
    layer.putalpha(mask.point(lambda v: int(v * alpha)))
    img.alpha_composite(layer)

def stroke_layer(paths, width, dash=None):
    """Draw polylines opaque on a mask; dash = (on, off) in 1x px, phase continuous along a path."""
    m = Image.new('L', SIZE, 0)
    d = ImageDraw.Draw(m)
    w = max(1, round(width * S))
    for pts in paths:
        if len(pts) < 2:
            continue
        if not dash:
            d.line(pts, fill=255, width=w, joint='curve')
            continue
        on, off = dash[0] * S, dash[1] * S
        period, pos = on + off, 0.0
        for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
            seg = math.hypot(x2 - x1, y2 - y1)
            t = 0.0
            while t < seg:
                phase = pos % period
                step = min((on - phase) if phase < on else (period - phase), seg - t)
                if phase < on:
                    a, b = t / seg, (t + step) / seg
                    d.line([(x1 + (x2 - x1) * a, y1 + (y2 - y1) * a),
                            (x1 + (x2 - x1) * b, y1 + (y2 - y1) * b)], fill=255, width=w)
                t += step; pos += step
    return m

def realm_edges():
    """Realm outlines with shared edges drawn once, chained into polylines (projected)."""
    seen, segs = set(), []
    key = lambda p: (round(p[0], 4), round(p[1], 4))
    for f in REALMS:
        for poly in rings(f['geometry']):
            for ring in poly:
                if not in_view(ring):
                    continue
                for a, b in zip(ring, ring[1:]):
                    k = tuple(sorted((key(a), key(b))))
                    if k[0] == k[1] or k in seen:
                        continue
                    seen.add(k); segs.append(k)
    adj = {}
    for a, b in segs:
        adj.setdefault(a, []).append(b); adj.setdefault(b, []).append(a)
    used, paths = set(), []
    for a, b in segs:
        if (a, b) in used:
            continue
        chain = [a, b]; used.add((a, b)); used.add((b, a))
        for end in (1, 0):                        # extend forwards, then backwards
            while True:
                tip = chain[-1] if end else chain[0]
                nxt = [n for n in adj[tip] if (tip, n) not in used]
                if len(adj[tip]) != 2 or not nxt:
                    break
                n = nxt[0]; used.add((tip, n)); used.add((n, tip))
                chain.append(n) if end else chain.insert(0, n)
        paths.append([proj(*p) for p in chain])
    return paths

def font(size, weight=400):
    f = ImageFont.truetype(FONT, round(size * S))
    f.set_variation_by_axes([weight, 100, min(max(size, 18), 144)])
    return f

def spaced_text(img, xy, text, size, color, alpha, tracking=0.18, weight=400, halo=None, left=False):
    """Letter-spaced text centred on xy (1x px). Draws on its own layer at `alpha`."""
    f = font(size, weight)
    adv = [f.getlength(ch) + tracking * size * S for ch in text]
    total = sum(adv) - tracking * size * S
    if left:
        xy = (xy[0] + total / S / 2, xy[1])
    x = xy[0] * S - total / 2
    asc, desc = f.getmetrics()
    y = xy[1] * S - (asc + desc) / 2
    layer = Image.new('RGBA', SIZE, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for ch, a in zip(text, adv):
        if halo:
            d.text((x, y), ch, font=f, fill=halo + (255,), stroke_width=round(2.2 * S),
                   stroke_fill=halo + (255,))
        x += a
    x = xy[0] * S - total / 2
    for ch, a in zip(text, adv):
        d.text((x, y), ch, font=f, fill=color + (255,))
        x += a
    layer.putalpha(layer.getchannel('A').point(lambda v: int(v * alpha)))
    img.alpha_composite(layer)
    return (xy[0] - total / S / 2, xy[1] - size, xy[0] + total / S / 2, xy[1] + size)

def realm_labels():
    """(name, x, y, area) at 1x px for each realm's largest polygon, biggest first."""
    out = {}
    for f in REALMS:
        name = f['properties'].get('NAME')
        for poly in rings(f['geometry']):
            ring = poly[0]
            if not name or not in_view(ring):
                continue
            pts = [proj(*c) for c in ring]
            a = cx = cy = 0.0
            for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
                c = x1 * y2 - x2 * y1
                a += c; cx += (x1 + x2) * c; cy += (y1 + y2) * c
            if abs(a) < 1e-9:
                continue
            area = abs(a) / 2 / S / S
            if area > out.get(name, (0,))[0]:
                out[name] = (area, cx / (3 * a) / S, cy / (3 * a) / S)
    return sorted(((n, x, y, ar) for n, (ar, x, y) in out.items()), key=lambda r: -r[3])

# Mockup pins: Carlo's catalogue miracles dated on or before 1264 (approximate coordinates).
PINS = [
    ('Bruges', 51.21, 3.22), ('Douai', 50.37, 3.08), ('Neuvy-Saint-Sépulchre', 46.60, 1.81),
    ('Meerssen', 50.89, 5.75), ('Augsburg', 48.37, 10.90), ('Benningen', 47.97, 10.22),
    ('Bettbrunn', 48.93, 11.43), ('Regensburg', 49.01, 12.10), ('Ferrara', 44.84, 11.62),
    ('Rimini', 44.06, 12.57), ('Florence', 43.77, 11.25), ('Assisi', 43.07, 12.61),
    ('Lanciano', 42.23, 14.39), ('Rome', 41.90, 12.50), ('Alatri', 41.73, 13.34),
    ('Trani', 41.28, 16.42), ('Santarém', 39.24, -8.69), ('Caravaca de la Cruz', 38.11, -1.86),
    ('Daroca', 41.11, -1.41), ('Ivorra', 41.77, 1.39), ('Sant Joan de les Abadesses', 42.23, 2.29),
]

def draw_pins(img):
    d = ImageDraw.Draw(img)
    for _, lat, lon in PINS:
        x, y = proj(lon, lat)
        r, ring = 4.5 * S, 1.6 * S
        d.ellipse([x - r - ring, y - r - ring, x + r + ring, y + r + ring], fill=PARCH + (255,))
        d.ellipse([x - r, y - r, x + r, y + r], fill=EARTH + (255,))
    name, lat, lon = SELECTED
    x, y = proj(lon, lat)
    r, ring = 8 * S, 2.6 * S
    halo = Image.new('RGBA', SIZE, (0, 0, 0, 0))       # soft shadow so the selected pin lifts
    ImageDraw.Draw(halo).ellipse([x - r * 1.9, y - r * 1.5, x + r * 1.9, y + r * 2.3],
                                 fill=INK + (70,))
    img.alpha_composite(halo.filter(ImageFilter.GaussianBlur(5 * S)))
    d.ellipse([x - r - ring, y - r - ring, x + r + ring, y + r + ring], fill=(255, 255, 255, 255))
    d.ellipse([x - r, y - r, x + r, y + r], fill=SIGNATURE + (255,))
    spaced_text(img, (x / S + 54, y / S - 1), name, 15, INK, 1.0, tracking=0.02, weight=700,
                halo=PARCH)

def paper(img, amount):
    arr = np.asarray(img).astype(np.int16)
    rng = np.random.default_rng(7)
    small = rng.normal(0, amount, (SIZE[1] // 8, SIZE[0] // 8)).astype(np.float32)
    grain = np.asarray(Image.fromarray(small).resize(SIZE, Image.BICUBIC))
    fine = rng.normal(0, amount * 0.5, (SIZE[1], SIZE[0]))
    arr[..., :3] = np.clip(arr[..., :3] + (grain + fine)[..., None], 0, 255)
    return Image.fromarray(arr.astype(np.uint8), 'RGBA')

def color_realms():
    """Greedy colouring so neighbouring realms get different pale tints."""
    tints = [mix(PARCH, GOLD, 0.30), mix(PARCH, EARTH, 0.11), mix(PARCH, MUTED, 0.13),
             mix(PARCH, GOLD, 0.16), mix(PARCH, EARTH, 0.20)]
    verts = {}
    for i, f in enumerate(REALMS):
        for poly in rings(f['geometry']):
            if in_view(poly[0]):
                for c in poly[0][::3]:
                    verts.setdefault((round(c[0], 2), round(c[1], 2)), set()).add(i)
    nbrs = {}
    for s in verts.values():
        for i in s:
            nbrs.setdefault(i, set()).update(s - {i})
    colors = {}
    for i in sorted(nbrs, key=lambda i: -len(nbrs[i])):
        used = {colors.get(j) for j in nbrs[i]}
        colors[i] = next((t for t in tints if t not in used), tints[0])
    return colors

def contains(geom, lon, lat):
    for poly in rings(geom):
        ring, inside = poly[0], False
        for (x1, y1), (x2, y2) in zip(ring, ring[1:]):
            if (y1 > lat) != (y2 > lat) and lon < x1 + (lat - y1) * (x2 - x1) / (y2 - y1):
                inside = not inside
        if inside:
            return True
    return False

def render(style):
    img = Image.new('RGBA', SIZE, SEA + (255,))
    land = poly_mask(LAND)
    lakes = poly_mask(LAKES)
    landish = Image.fromarray(np.minimum(np.asarray(land), 255 - np.asarray(lakes)))

    regions_only = style == 'soft-regions'
    if style in ('atlas', 'soft-regions'):        # faint water-lining band along the coast
        band = land.filter(ImageFilter.MaxFilter(1 + 2 * round(5 * S)))
        band = Image.fromarray(np.clip(np.asarray(band).astype(int) - np.asarray(land), 0, 255).astype(np.uint8))
        fill(img, band.filter(ImageFilter.GaussianBlur(2 * S)), INK, 0.10)

    fill(img, landish, PARCH)

    if style in ('tinted', 'tinted-soft'):
        soft = style == 'tinted-soft'
        for i, tint in color_realms().items():
            m = poly_mask([REALMS[i]])
            m = Image.fromarray(np.minimum(np.asarray(m), np.asarray(landish)))
            fill(img, m, tint, 0.45 if soft else 0.85)
            if soft and contains(REALMS[i]['geometry'], SELECTED[2], SELECTED[1]):
                fill(img, m, GOLD, 0.38)          # the selected pin's realm: "Then: <realm>"

    img = paper(img, 2.2)

    # rivers + coast
    river_paths = [[proj(*c) for c in ln] for f in RIVERS if (f['properties'].get('scalerank') or 9) <= V.get('river_rank', 6)
                   for ln in lines(f['geometry']) if in_view(ln)]
    fill(img, stroke_layer(river_paths, 1.1), RIVER, 0.85)
    coast = landish.filter(ImageFilter.FIND_EDGES).point(lambda v: 255 if v > 40 else 0)
    coast = coast.filter(ImageFilter.MaxFilter(3 if style != 'atlas' else 5))
    fill(img, coast, EARTH, {'quiet': 0.35, 'atlas': 0.6, 'tinted': 0.45, 'tinted-soft': 0.5, 'soft-regions': 0.5}[style])

    # borders, kept off the sea and the coastline itself
    if regions_only:
        for name, lat, lon in V.get('regions', []):
            x, y = proj(lon, lat)
            spaced_text(img, (x / S, y / S), name, 13, EARTH, 0.6, tracking=0.28)
        if V.get('sea'):
            name, lat, lon = V['sea']
            x, y = proj(lon, lat)
            spaced_text(img, (x / S, y / S), name, 14, mix(SEA, INK, 0.45), 0.8, tracking=0.35)
    else:
        inland = landish.filter(ImageFilter.MinFilter(1 + 2 * round(1.5 * S)))
        edges = realm_edges()
        spec = {'quiet': (0.7, None, 0.22), 'atlas': (1.15, (5, 3.5), 0.62), 'tinted': (0.9, None, 0.42),
                'tinted-soft': (1.0, (5, 3.5), 0.5)}[style]
        b = stroke_layer(edges, spec[0], spec[1])
        fill(img, Image.fromarray(np.minimum(np.asarray(b), np.asarray(inland))), EARTH, spec[2])

        # realm names (not in quiet): small caps, only where the map is visible and they fit
        if style != 'quiet':
            # keep names off the pins and the selected pin's label, and only on land
            boxes = [(x / S - 9, y / S - 9, x / S + 9, y / S + 9)
                     for x, y in (proj(lon, lat) for _, lat, lon in PINS)]
            sx, sy = proj(SELECTED[2], SELECTED[1])
            boxes.append((sx / S - 14, sy / S - 14, sx / S + 100, sy / S + 14))
            land_px = np.asarray(landish)
            hits = lambda b: any(not (b[2] < o[0] or b[0] > o[2] or b[3] < o[1] or b[1] > o[3]) for o in boxes)
            for name, x, y, area in realm_labels():
                if area < 900:
                    continue
                size = 11 if area < 6000 else 12.5 if area < 20000 else 14
                text = name.upper().replace('BURGANDY', 'BURGUNDY').replace('BRITANY', 'BRITTANY')
                half = len(text) * size * 0.5
                for dx, dy in [(0, 0), (0, -22), (0, 22), (-40, 0), (40, 0), (0, -44), (0, 44)]:
                    cx, cy = x + dx, y + dy
                    box = (cx - half, cy - size * 0.8, cx + half, cy + size * 0.8)
                    if not (40 < box[0] and box[2] < 1020 and 90 < box[1] and box[3] < 790):
                        continue
                    ends = [(box[0], cy), (box[2], cy), (cx, cy)]
                    if not all(land_px[min(int(py * S), SIZE[1] - 1), min(int(px * S), SIZE[0] - 1)] > 128
                               for px, py in ends):
                        continue
                    if hits(box):
                        continue
                    boxes.append(box)
                    spaced_text(img, (cx, cy), text, size, EARTH, 0.6, tracking=0.22, halo=None)
                    break

    if V['pins']:
        draw_pins(img)

    # honesty note + data credit, bottom-left above where the scrubber sits
    year = {'bc1': '1 BC', '1200': '1200'}.get(V['year'], V['year'])
    note = ('Region names approximate · 1st century' if regions_only else
            f'Borders approximate · c. {year} · historical-basemaps (GPL-3.0)')
    spaced_text(img, (24, 812 if V['pins'] else 889), note,
                9.5, MUTED, 0.9, tracking=0.03, left=True)

    out = img.convert('RGB').resize((W * OUT_SCALE, H * OUT_SCALE), Image.LANCZOS)
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, f"basemap-{style}{V['suffix']}.png")
    out.save(path, optimize=True)
    return path

if __name__ == '__main__':
    import sys
    args = sys.argv[1:]
    view = 'europe-1264'
    if args and args[0] in VIEWS:
        view, args = args[0], args[1:]
    setup(view)
    for s in args or ['quiet', 'atlas', 'tinted', 'tinted-soft']:
        print(render(s))
