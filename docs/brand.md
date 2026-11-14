# Carlo's Compass: Brand Guide (v0.1, 2026-11-13)

Built from Carlo Acutis's official site (carloacutis.com), the St. Carlo Acutis
Catholic Student Center in Rapid City (stcarlocsc.org), and a scan of current
Catholic/Christian sites (FOCUS, Hallow, BibleProject, Ascension, Formed, etc.).

**Idea:** navy + gold reads as trustworthy and Catholic (nearly every peer uses it);
Carlo's crimson is our signature so we don't look like everyone else.

## Colors

Name colors by their job (token), not by hue, so a dark "night map" mode can swap values later.

| Token | Hex | Use | Contrast note |
|---|---|---|---|
| `ink` | `#002747` | Headers, main text, top bar | 13.7:1 on parchment |
| `parchment` | `#FAF3D7` | Page + map land background | — |
| `signature` (crimson) | `#A80C31` | Primary buttons, selected place, active journey route | white text on it 7.6:1 |
| `gold` | `#DBBB7C` | Fills, highlights, icons on navy. **Never text on parchment** | 1.65:1 on parchment (fails); 8.3:1 on navy |
| `gold-text` | `#8A6420` | Gold-looking text on parchment | 4.8:1 (passes AA) |
| `earth` (brown) | `#71421D` | Secondary text, map borders, muted markers | 7.5:1 on parchment |
| `muted` (slate) | `#5C6B7A` | Panel labels (IN SCRIPTURE, SOURCES), counts, "Suggest an edit" | 4.9:1 on parchment |

### Side panel color roles (2026-11-13)

Joseph flagged the v2 panel as looking amateur: crimson, gold and navy all competed for
attention. Fix, following the common 60-30-10 / "one accent, used sparingly" practice:
- **ink** for everything readable, including verse and source links (links read as links
  from context and an underline on hover, not from a color of their own).
- **muted** for small uppercase labels and helper lines, so they step back.
- **gold-text** only for the certainty line (it means "how sure we are").
- **signature** crimson stays off the panel; it is reserved for the Explore button, the
  selected pin, the active route and the timeline handle.

## Type scale, spacing and surfaces (2026-11-13)

So every screen looks like one system, on desktop and on a phone:
- **Type sizes:** 12 / 14 / 16 / 20 / 32 px only. Nothing smaller than 12. Small uppercase
  labels are 12 px, semibold, `muted`. Body and links are 14–16 px. On a phone, body text is
  at least 16 px (also stops iOS from zooming into inputs).
- **Spacing:** multiples of 8 px (8 / 16 / 24 / 32). Side panel / bottom sheet padding 24 px
  (16 px on a phone). 24 px between panel sections, 8 px between a label and its content.
- **Surfaces that float on the map** (filter chips, timeline bar, phone bottom sheet):
  `parchment` fill, soft shadow (straight down, small offset, large blur, low opacity), one
  corner radius family: 12 px for bars and sheets, fully round for chips. Navy is kept for the
  top bar only, so it anchors the page instead of repeating.
- **Chips:** parchment, 1–2 px `ink` outline, `ink` text, "×" to remove.
- **Timeline:** `ink` text, `muted` track, `gold-text` for the filled part, crimson handle with
  a white ring.

### Touch and phone rules
- Every tappable thing has a hit area of at least 44 × 44 px (Apple) / 48 × 48 dp (Android),
  even when it looks smaller: chips, the timeline handle, pins, links in the panel.
- The timeline handle is at least 28 px across on a phone and the whole track is draggable,
  not just the handle.
- Pins: plain 12 px dot with no ring and a 44 px invisible tap target; the selected pin grows to
  16 px, turns crimson and gets a white ring. Uncertain location: hollow dot. No number clusters.
- Pin color by category (2026-11-13): faith pins (Gospel places, Eucharistic miracles) are
  `earth`; world-history context pins are `ink` (navy). The pack sets this (`pin_colors`).
- Links in the panel stack one per line on a phone (no "·"-separated runs to aim at).
- Shadows and parchment surfaces stay the same on a phone; the side panel becomes a bottom
  sheet with the same padding, type and colors.

## Map rule (fights information overload)

Everything not being looked at stays muted (parchment / earth). Only what the
user searched or selected gets gold or crimson.

## Type

One serif + one sans, no more.

- Headings: book-style serif (Merriweather, or a Century Schoolbook-style face; Carlo's site uses TeX Gyre Schola).
- Interface/body: **Merriweather Sans** (decided 2026-11-13; replaces Geologica / Open Sans).

## Look

- Warm off-white, subtle paper texture, not pure white.
- Lead with the map itself as the hero image: parchment map, one crimson route.

## Logo mark (2026-11-13)

**Monstrance–compass.** 24 thin rays alternating long and short around a host in a round window
(ring), with the north ray longest. Catholics see a monstrance; everyone else sees a compass star.
Flat, one color, no gradients. Chosen by Joseph 2026-11-13 (sketch "H2"; directions explored in
`design/logo/explorations/`).

Files in [design/logo/mark/](../design/logo/mark/) (rebuild with `python3 design/logo/mark/build.py`):

| File | Use |
|---|---|
| `carlo-compass-mark-ink.svg` | navy mark on parchment/light backgrounds |
| `carlo-compass-mark-parchment.svg` | parchment mark on navy/dark backgrounds |
| `carlo-compass-mark-black.svg` | one-color print, stamps, embroidery |
| `carlo-compass-avatar.svg` + `png/carlo-compass-avatar-*.png` | profile pictures (navy square, circle-crop safe) |
| `carlo-compass-favicon.svg` + `png/carlo-compass-favicon-*.png` | browser tab, 16–64 px: simplified 8-ray cut, no ring |
| `carlo-compass-lockup-horizontal-{ink,parchment}.svg` | top bar, slide footers, docs headers |
| `carlo-compass-lockup-stacked-{ink,parchment}.svg` | title slide, posters, square spaces |

- Below ~48 px use the favicon cut; the 24-ray mark fills in at tiny sizes.
- No cross, stem, or foot on purpose: it stays low-key and doubles as a compass.
- **Lockups:** wordmark is Merriweather Bold (wght 700, opsz 48), text converted to outlines so it
  renders without the font. Horizontal: cap height = 27% of mark height, centered on the host.
  Stacked: wordmark centered under the mark. Rebuild with `design/logo/mark/lockup.py` (needs fontTools;
  font file + OFL license in `design/fonts/`). Preview: `design/logo/explorations/2026-11-13-lockups.png`.

## Carlo illustration (2026-11-13)

File: [design/illustration/carlo-tone-on-tone.svg](../design/illustration/carlo-tone-on-tone.svg)
(PNGs in `design/illustration/png/`; tune it with `design/illustration/tuner.html`).

- Not the logo: brand art for the story/About page, title slide, or loading screen.
- Inspired by the composition of the Covent Garden icon of St. Carlo (halo, curly hair, Eucharist
  in front of a laptop), drawn from simple original shapes, **not traced** from the CC BY-SA photo.
- Black field; the light comes from the Eucharist (ciborium, no cross) but the ciborium is
  tone-on-tone, only warmer than the figure, never a bright spot.
- **Exception to "no gradients":** this illustration uses radial light falloff (approved by Joseph
  2026-11-13). The logo, UI and slides stay flat.
