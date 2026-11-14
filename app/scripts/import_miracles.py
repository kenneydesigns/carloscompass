"""Turn the staged Eucharistic-miracles catalogue rows into draft place files.

In:  packs/bible-catholic/staging/eucharistic-miracles-catalogue.csv  (facts only, from Carlo's list)
Out: packs/bible-catholic/places/miracle-<slug>.yaml  one per `place` row; no `review`, so the
     built site never shows them (the local dev server does, for testing).
     The CSV gets lat/lng filled in and a note where the lookup needs a person to check it.

What it does NOT do (on purpose): copy any text from the catalogue (link to it instead), guess a
summary, a location certainty, or a Church-recognition level. Those stay empty and show as
"FFFF FFFF FFFF" until a person fills them from a source.

Coordinates: OpenStreetMap Nominatim town lookup (1 request a second, generic client name,
results cached in the CSV so it only runs once). A town centre, not the church: flagged in the
location note.

Usage: python3 -I app/scripts/import_miracles.py
"""
import csv, json, re, sys, time, unicodedata, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CSV = ROOT / 'packs/bible-catholic/staging/eucharistic-miracles-catalogue.csv'
OUT = ROOT / 'packs/bible-catholic/places'

CC = {'Argentina': 'ar', 'Austria': 'at', 'Belgium': 'be', 'Colombia': 'co', 'Croatia': 'hr',
      'Egypt': 'eg', 'France': 'fr', 'Germany': 'de', 'India': 'in', 'Italy': 'it',
      'Martinique': 'fr', 'Réunion': 'fr', 'Mexico': 'mx', 'Netherlands': 'nl', 'Poland': 'pl',
      'Peru': 'pe', 'Portugal': 'pt', 'Spain': 'es', 'Switzerland': 'ch', 'Venezuela': 've'}
# Rows whose name is not a plain town: what to look up instead (each flagged for a person to check).
LOOKUP = {'Scete': 'Wadi El Natrun', 'Betania': 'Cúa', 'Middleburg-Lovanio': 'Middelburg',
          'Gorkum-El Escorial': 'San Lorenzo de El Escorial', 'Boxtel-Hoogstraten': 'Boxtel',
          'Breda-Niervaart': 'Breda', 'Herkenrode-Hasselt': 'Hasselt', 'Weiten-Raxendorf': 'Raxendorf',
          'Alboraya-Almacéra': 'Alboraya', 'Marseille-En-Beauvais': 'Marseille-en-Beauvaisis',
          'Gruaro (Valvasone)': 'Gruaro', 'Patierno (Naples)': 'Casoria', 'Assisi (Saint Clare)': 'Assisi',
          'Alcalà': 'Alcalá de Henares', 'Montserrat': 'Monestir de Montserrat', 'Cimballa': 'Cimballa', 'Eten': 'Ciudad Eten',
          'Middleburg': 'Middelburg', 'Gerona': 'Girona', 'Krakow': 'Kraków', 'Poznan': 'Poznań',
          'Glotowo': 'Głotowo', 'Chirattakonam': 'Chirattakonam', 'Tixtla': 'Tixtla de Guerrero', 'Morne-Rouge': 'Le Morne-Rouge, Martinique', 'Saint-André de la Réunion': 'Saint-André, La Réunion'}
NO_PLACE = {'St. Mary of Egypt', 'S. Peter Damian'}   # a person, not a town: no pin until checked
NEEDS_CHECK = set(LOOKUP) - {'Gerona', 'Krakow', 'Poznan', 'Glotowo', 'Cimballa', 'Chirattakonam'}

def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

ROMAN = {'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
         'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15}

def parse_date(s):
    """'1310' / '1230-1595' / 'XI cent.' / '17th cent.' / '750 D.C.' -> (from, to, approx)"""
    s = s.strip()
    if not s:
        return None
    m = re.match(r'^([IVX]+)(?:-([IVX]+))?\s*cent', s)
    if m:
        a = ROMAN[m.group(1)]; b = ROMAN[m.group(2)] if m.group(2) else a
        return (a - 1) * 100, b * 100, True
    m = re.match(r'^(\d+)(?:st|nd|rd|th)\s*cent', s)
    if m:
        c = int(m.group(1)); return (c - 1) * 100, c * 100, True
    years = [int(y) for y in re.findall(r'\d{3,4}', s)]
    if not years:
        return None
    return years[0], (years[-1] if len(years) > 1 else None), False

def geocode(name, country):
    q = urllib.parse.urlencode({'q': name, 'countrycodes': CC[country], 'format': 'json', 'limit': 1})
    req = urllib.request.Request('https://nominatim.openstreetmap.org/search?' + q,
                                 headers={'User-Agent': 'bible-map-prototype/0.1'})
    time.sleep(1.1)
    with urllib.request.urlopen(req, timeout=20) as r:
        hits = json.load(r)
    return (round(float(hits[0]['lat']), 4), round(float(hits[0]['lon']), 4)) if hits else None

rows = list(csv.DictReader(open(CSV, encoding='utf-8')))
fields = list(rows[0].keys())
OUT.mkdir(parents=True, exist_ok=True)
seen_ids, made, missing = set(), 0, []

for row in rows:
    if row['section'] != 'place':
        continue
    name, country = row['name'], row['country']
    if not row['lat'] and name not in NO_PLACE:
        hit = geocode(LOOKUP.get(name, name), country)
        if hit:
            row['lat'], row['lng'] = str(hit[0]), str(hit[1])
            if name in NEEDS_CHECK:
                note = f'located via "{LOOKUP[name]}"; check'
                row['notes'] = '; '.join(filter(None, [row['notes'], note]))
        else:
            missing.append(name)
            row['notes'] = '; '.join(filter(None, [row['notes'], 'no coordinates found']))
        print(f'{name}: {row["lat"] or "-"},{row["lng"] or "-"}', flush=True)

    date = parse_date(row['date_as_listed'])
    pid = 'miracle-' + slug(name)
    if pid in seen_ids:
        pid += f'-{date[0]}' if date else '-2'
    seen_ids.add(pid)

    y = [f'# Draft from the staged catalogue row ({CSV.name}), 2026-11-13. Not reviewed by a person:',
         '# it shows only on the local dev server. Summary, certainty and Church recognition still to',
         '# be filled from sources (link to the catalogue, do not copy its text).']
    if row['notes']:
        y.append(f'# Staging note: {row["notes"]}')
    y += [f'id: {pid}', f'name: {json.dumps(name, ensure_ascii=False)}', 'category: eucharistic-miracle']
    if row['lat']:
        y += ['location:', f'  lat: {row["lat"]}', f'  lng: {row["lng"]}',
              '  note: Town centre from OpenStreetMap; the exact site is not checked yet.']
    y += ['events:', f'  - title: {json.dumps("Eucharistic miracle of " + name, ensure_ascii=False)}']
    if date:
        frm, to, approx = date
        parts = [f'from: {frm}'] + ([f'to: {to}'] if to else []) + (['approx: true'] if approx else [])
        y.append(f'    date: {{ {", ".join(parts)} }}')
    y += ['    sources:', '      - kind: catalogue',
          f'        title: {json.dumps("Carlo Acutis, The Eucharistic Miracles of the World: " + name, ensure_ascii=False)}',
          f'        url: {row["catalogue_url"]}',
          'tags:', '  collection: [Eucharistic miracles]', f'  country: [{json.dumps(country, ensure_ascii=False)}]']
    (OUT / f'{pid}.yaml').write_text('\n'.join(y) + '\n', encoding='utf-8')
    made += 1

with open(CSV, 'w', encoding='utf-8', newline='') as f:
    w = csv.DictWriter(f, fieldnames=fields); w.writeheader(); w.writerows(rows)
print(f'{made} place files written; no coordinates for: {missing}')
