"""Turn a historical-basemaps year file into what the map needs (run once per border year).

In:  design/map/data/historical-basemaps/world_<year>.geojson   (GPL-3.0, aourednik/historical-basemaps)
     app/public/basemap/ne_50m_land.geojson                    (Natural Earth, public domain)
Out: app/public/basemap/borders/<year>-realms.geojson  realm shapes, each with a `tint` (0-4) so
                                                       neighbours differ (same greedy colouring as
                                                       design/map/render_styles.py)
     app/public/basemap/borders/<year>-lines.geojson   realm edges, shared edges once (clean dashes)
     app/public/basemap/borders/<year>-labels.json     realm names, label point, zoom where they fit
Realm shapes are clipped to today's land, and edges to land a little in from the coast, so tints
and dashes stop at the coastline (needs the `shapely` package).

Usage: python3 app/scripts/build_borders.py 100     (with shapely installed, e.g. in a venv)
"""
import json, math, sys
from pathlib import Path
from shapely.geometry import shape, mapping, LineString
from shapely.ops import unary_union
from shapely.validation import make_valid

ROOT = Path(__file__).resolve().parents[2]
APP = ROOT / 'app'
year = sys.argv[1] if len(sys.argv) > 1 else '100'
src = ROOT / 'design/map/data/historical-basemaps' / f'world_{year}.geojson'
if not src.exists():  # worktrees don't carry design/ until it is committed; fall back to main checkout
    src = ROOT.parents[1] / 'design/map/data/historical-basemaps' / f'world_{year}.geojson'
out = APP / 'public/basemap/borders'
out.mkdir(parents=True, exist_ok=True)

realms = json.load(open(src))['features']
land = unary_union([make_valid(shape(f['geometry']))
                    for f in json.load(open(APP / 'public/basemap/ne_50m_land.geojson'))['features']])
inland = land.buffer(-0.05)   # about 5 km in from the coast: realm edges that trace the coast are dropped

def polys(g):
    return [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates'] if g['type'] == 'MultiPolygon' else []

# --- tints: greedy colouring over shared vertices -------------------------------------------
verts = {}
for i, f in enumerate(realms):
    for p in polys(f['geometry']):
        for c in p[0][::3]:
            verts.setdefault((round(c[0], 2), round(c[1], 2)), set()).add(i)
nbrs = {i: set() for i in range(len(realms))}
for s in verts.values():
    for i in s:
        nbrs[i] |= s - {i}
tint = {}
for i in sorted(nbrs, key=lambda i: -len(nbrs[i])):
    used = {tint.get(j) for j in nbrs[i]}
    tint[i] = next((t for t in range(5) if t not in used), 0)

fills = []
for i, f in enumerate(realms):
    name = f['properties'].get('NAME')
    g = make_valid(shape(f['geometry'])).intersection(land)
    if g.is_empty:
        continue
    g = g.simplify(0.01, preserve_topology=True)
    fills.append({'type': 'Feature', 'geometry': mapping(g), 'properties': {'name': name, 'tint': tint[i]}})
json.dump({'type': 'FeatureCollection', 'features': fills}, open(out / f'{year}-realms.geojson', 'w'),
          separators=(',', ':'))

# --- edges: every segment once, chained into lines -----------------------------------------
key = lambda p: (round(p[0], 4), round(p[1], 4))
seen, segs = set(), []
for f in realms:
    for p in polys(f['geometry']):
        for ring in p:
            for a, b in zip(ring, ring[1:]):
                k = tuple(sorted((key(a), key(b))))
                if k[0] != k[1] and k not in seen:
                    seen.add(k); segs.append(k)
adj = {}
for a, b in segs:
    adj.setdefault(a, []).append(b); adj.setdefault(b, []).append(a)
used, lines = set(), []
for a, b in segs:
    if (a, b) in used:
        continue
    chain = [a, b]; used.add((a, b)); used.add((b, a))
    for end in (1, 0):
        while True:
            tip = chain[-1] if end else chain[0]
            nxt = [n for n in adj[tip] if (tip, n) not in used]
            if len(adj[tip]) != 2 or not nxt:
                break
            n = nxt[0]; used.add((tip, n)); used.add((n, tip))
            chain.append(n) if end else chain.insert(0, n)
    clipped = LineString(chain).intersection(inland)
    if not clipped.is_empty:
        lines.append({'type': 'Feature', 'properties': {}, 'geometry': mapping(clipped)})
json.dump({'type': 'FeatureCollection', 'features': lines}, open(out / f'{year}-lines.geojson', 'w'),
          separators=(',', ':'))

# --- labels: centroid of each realm's largest polygon (in Mercator), zoom where the name fits ---
def merc(lon, lat):
    lat = max(min(lat, 85), -85)
    return lon / 360 + 0.5, 0.5 - math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)) / (2 * math.pi)

def unmerc(x, y):
    return (x - 0.5) * 360, math.degrees(2 * math.atan(math.exp((0.5 - y) * 2 * math.pi)) - math.pi / 2)

best = {}
for f in realms:
    name = f['properties'].get('NAME')
    if not name:
        continue
    for p in polys(f['geometry']):
        pts = [merc(*c[:2]) for c in p[0]]
        a = cx = cy = 0.0
        for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
            c = x1 * y2 - x2 * y1
            a += c; cx += (x1 + x2) * c; cy += (y1 + y2) * c
        if abs(a) < 1e-12:
            continue
        xs = [q[0] for q in pts]; ys = [q[1] for q in pts]
        if abs(a) / 2 > best.get(name, {}).get('area', 0):
            best[name] = {'area': abs(a) / 2, 'x': cx / (3 * a), 'y': cy / (3 * a),
                          'w': max(xs) - min(xs), 'h': max(ys) - min(ys)}
labels = []
for name, b in sorted(best.items(), key=lambda kv: -kv[1]['area']):
    text_w = len(name) * 11 * 1.3       # 13 px small caps, wide tracking, plus breathing room
    # world is 512 px wide at zoom 0; the name fits once the realm is wider and taller than it
    minzoom = max(math.log2(text_w / (512 * b['w'])), math.log2(40 / (512 * b['h'])))
    lng, lat = unmerc(b['x'], b['y'])
    labels.append({'name': name, 'lng': round(lng, 4), 'lat': round(lat, 4), 'minzoom': round(minzoom, 2)})
json.dump(labels, open(out / f'{year}-labels.json', 'w'), indent=0)

print(f'{len(fills)} realms on land, {len(lines)} edge lines, {len(labels)} labels')
