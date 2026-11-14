# Carlo's Compass: Vision & Decisions

Living document. Last updated 2026-11-13. Team: Joseph, Eric, DJ (Fall Hackathon 2026).
Colors/type live in [brand.md](brand.md).

## What it is
An interactive Bible map, inspired by St. Carlo Acutis. Map-first, searchable,
uncluttered. Built so it can later become an open-source platform other
communities reuse.

## Prior art we studied
- **KronAtlas** (biblico.kronatlas.com): good skeleton (map + side panel + era
  timeline, certainty per place). Weak: clutter clusters, journeys don't draw
  clearly, modern place names on the basemap.
- **Summit** (summit.terranalytics.com): best idea is animated journeys with
  stop-by-stop story cards. Weak: 9 nav sections, too much non-map content,
  map tiles broken ("API KEY REQUIRED").
- **Decision:** streamline, don't copy. KronAtlas skeleton + Summit journeys, cut the rest.

## Interface (one screen)
- Navy top bar: logo, **About · Donate** text links, **Explore** button. No search box in the
  top bar (moved into the Explore overlay, 2026-11-13).
- Parchment map fills the screen. Right side: one panel showing whatever was clicked.
- v1's clickable era bar is gone (read as too simple, unclear it was clickable). It is
  replaced by the live timeline scrubber below.

## Live timeline scrubber (decision 2026-11-13; mocked up in v2)
Joseph wants people to scroll through time while looking at the map and watch it change,
with more information popping up as they go.
- A slim draggable bar along the bottom of the map with an obvious handle, year ticks, and
  era names. It must look draggable, unlike v1's era bar.
- It scrubs only through what is already loaded (the current search or Explore result), so
  it never pulls more pin data. That keeps the "load little data" rule. (Only exception: the
  border file for a new border year, loaded ahead; see update rules below.)
- As the handle moves, places light up when their date is reached and earlier ones fade to
  muted dots. Journey routes draw step by step, and the side panel shows the event at that
  moment (date, 1–2 sentences, verse).
- The bar's range fits the current results: about 27–30 AD for Jesus' ministry, or wide
  (Bible times to today) when Eucharistic miracles are on.
- Phone: the bar sits just above the bottom sheet, dragged with a thumb.
- Data: every place/event needs a date or date range ("c." allowed), and the date needs a
  source like any other claim.
- Engine feature: the engine knows dates; the pack supplies the eras and labels.
- **Update rules, so dragging never lags** (decision 2026-11-13). Three things change at
  different speeds:
  - **Pins:** every frame while dragging. They are already loaded, so it's a cheap show/hide
    filter in MapLibre, not a download or redraw.
  - **Borders:** only when the handle crosses into a new border year (about once per century).
    The previous and next border years load ahead in the background and stay cached, so the
    swap is a short fade. On a fast drag across several centuries, wait until the handle slows
    or pauses (~0.15 s) before swapping, instead of flashing through each one.
  - **Side panel text:** when the handle pauses (~0.2 s) or is released; updating text every
    frame would flicker and can't be read anyway.
  - Same on phones, where loading ahead matters most.

## Mobile-friendly (decision 2026-11-13)
The site must be easy to use on a phone, not just usable. Every screen is designed for a
phone width (about 375px) as well as desktop, and every feature has to work by touch.
Proposed phone layout (to confirm in a mockup):
- **Top bar:** logo + **Explore** as a visible button (search lives inside Explore). Still no hamburger menu.
- **Pin card / results list:** a bottom sheet that slides up over the map (peek → full),
  instead of the right-side panel.
- **Explore overlay:** full screen, with **Show on map** pinned to the bottom.
- **Filter chips:** one row that scrolls sideways.
- **Touch:** tap targets at least 44px; pins are easy to tap even when close together.
- **Speed on cellular:** the "load little data" rules below matter even more on phones.

## About and Donate pages (decision 2026-11-13)
Two quiet text links in the navy top bar, left of Explore: **About · Donate**. No dropdown or
hamburger menu, nothing on the map itself.
- **About:** simple parchment page about Carlo Acutis and why he inspired the site, who built
  it (Joseph, Eric, DJ, Fall Hackathon 2026), and a short "help improve the map" section
  pointing to the edit/PR process.
- **Donate:** one static page that never needs updating. It says what donations pay for:
  1. hosting the site
  2. developers who keep improving it
  3. marketing so more people find it
  One button links out to an external donation page; the site itself takes no payments.
  Provider still to pick (e.g. Open Collective, which shows spending publicly and suits open
  source). Don't call donations tax-deductible unless a nonprofit is receiving them.
- Engine vs pack: the links are engine; the story text and donation link belong to the pack.
- **About page copy is written by a person** (Joseph, 2026-11-13). Joseph writes the "about"
  text himself; AI only fixes grammar and spelling, never rewrites or adds content. The draft
  lives in [packs/bible-catholic/about.md](../packs/bible-catholic/about.md). This text is
  shown on the About page only, never on the map screen.
- **The About page includes pictures** (Joseph, 2026-11-13). Which pictures is still open.
  Each one needs a credit and permission or an open license before it goes on the site.
- **About page built** (2026-11-13): opens as a parchment page over the map at `#about` (top-bar
  link on desktop, Explore footer on phones), so the link can be shared and Back closes it. It
  shows `about.md` word for word; notes for editors go in `<!-- -->` and are not shown. The link
  is now named About (was Story). Pictures, the team credit and "help improve the map" are
  still to be written by Joseph.

## Explore overlay (decision 2026-11-13)
The map stays clean; all the "pull things up" options live on one overlay screen
opened by the Explore button. Users tick checkmarks, then press **Show on map**:
the overlay closes and only the matching places load. Nothing on the map changes
while they're still choosing.
- **Search bar at the bottom, by the timeline** (Joseph, 2026-11-13, later; replaces the next
  item's placement and the top-bar Explore button). One parchment bar with a navy outline and a
  crimson search icon sits at the bottom of the map; tapping it opens the Explore panel with the
  keyboard up. What is showing appears inside the bar as removable navy tags. The timeline sits
  just above it. The top bar is now only the logo on phones (Story · Donate on desktop); the
  top-right spot is free for something not yet decided (the map credits ⓘ sit there for now).
- **Search box inside the overlay** (2026-11-13): at the top of the panel, so people can type
  exactly what they want and combine it with checkmarks. This is the only search box: the
  top-bar search was removed (Joseph, 2026-11-13), so the main screen is just map + panel.
- **Eucharistic miracles** (2026-11-13): its own featured option at the top of the overlay,
  because Carlo's own life's work was cataloguing them. Implications:
  - Most are after the Bible (e.g. Lanciano, 8th c.) and outside the Holy Land, so the map must
    zoom out to Europe and the world, not just Bible lands.
  - Each pin cites Church recognition (the bishop or Vatican approval) plus Carlo's own
    catalogue where it covers the miracle; the certainty badge is about the location.
  - Pack content, not engine: the engine just sees one more category.
- **Books:** Genesis → Revelation, grouped (Law, History, Prophets, Gospels, Letters)
- **Eras:** Patriarchs → Church
- **People:** Abraham, Moses, David, Jesus, Paul, …
- **Journeys:** Exodus, Jesus' ministry, Paul's missionary trips, …
- **Place types:** cities, mountains, rivers/seas, battle sites
- **Certainty:** confirmed / probable / uncertain
Search and Explore both just produce a filter; the map draws only that result.
- **Active filter chips** (2026-11-13): after "Show on map", each active choice shows as a
  removable chip under the top bar (e.g. "Gospels ×", "Paul ×"), so people can refine
  without reopening the overlay.
- **Results list** (2026-11-13): the side panel lists matching places as text (click → opens
  that pin's card). Maps aren't screen-reader accessible by default; the list is the fallback.

## Load little data
- First load is light: map + search + a handful of key places, no full dataset.
- Places/pins load only for the current search or Explore selection.
- Pin card details (sources, verses) load when a pin is clicked.

## Anti-clutter rules
- Only a handful of key places show by default; more appear on search, Explore, or zoom.
- Search drives the map: matches light up crimson, everything else fades.
- One panel, not many menus.
- No modern place labels on the map; every place shows location certainty. Borders follow the
  timeline (see Basemap), thin and muted.
- **Calm basemap** (2026-11-13): the basemap must stay faded/desaturated so pins and the
  crimson route carry the color. v1's full-strength 1748 map was too busy. Decided below
  (see Basemap).

## Basemap (decision 2026-11-13; borders revised same day)
One calm world map we style ourselves, not an embedded map service.
- **Shows:** land, sea, coastlines and major rivers, in parchment and muted navy. No terrain
  shading (Joseph, 2026-11-13). No modern place labels; only our pins carry names.
- **Why Natural Earth stays even with the Google Maps link:** it is the shape of the land, not
  street detail. Border data alone can't replace it: unclaimed land would read as sea and
  coastlines would shift between centuries. Google Maps still covers street level.
- **Borders follow the timeline** (Joseph, 2026-11-13, reversing "no borders"). People should be
  able to compare "back then this was X" with "today this is Y". As the scrubber moves, the map
  shows the borders of that period: thin, muted lines with faint realm names, so pins stay the
  focus (goal 1). At the present day it shows modern borders.
- **Then vs today on the pin card:** e.g. "Then: Kingdom of Poland · Today: Poland". Worked out
  automatically at build time by checking which border shape each pin falls inside, so no
  one types it by hand. **Reviewers can override it per pin** (a `then` field), because the
  world-scale data is rough around small states: the 1200 data puts Bolsena in the Holy Roman
  Empire, though by 1264 it was most likely in the Papal States.
- **Style: soft tinted** (Joseph, 2026-11-13; render `design/map/renders/basemap-tinted-soft.png`).
  Each realm a pale parchment/gold/earth tint (half strength, neighbours differ), dashed `earth`
  borders (every old border is "approximate"), small-caps realm names in `earth`, kept off pins
  and the sea. **The realm around the selected pin turns gold**, the map's version of the card's
  "Then:" line (brand rule: only the selected thing gets gold). Beat Quiet, Atlas, and full
  Tinted (too busy, fills fought the pins).
- **Which border year to show (proposed):** the nearest available year, not only the one at or
  before. The 1200 vs 1279 gap is why Bolsena 1264 showed 1200 borders.
- **Close zoom (Holy Land): borders plus region names** (Joseph, 2026-11-13, mockup v3). Borders
  and tints stay on at every zoom. At Holy Land zoom, hand-placed 1st-century region names are
  added (GALILEE, SAMARIA, JUDEA, DECAPOLIS, PEREA), smaller and lighter than realm names; they are
  pack content and each needs a source (e.g. a Bible atlas).
- **Gospel-era border year: 100 AD, not 1 BC** (Joseph, 2026-11-13). The 1 BC data is wrong at
  this zoom (Galilee and Samaria as "Roman Empire", "Judea" as an eastern desert block). The
  100 AD data shows the whole area as the Roman Empire with the Nabatean border to the east:
  less detail, but true for Jesus' ministry. So the border year is not always the nearest one;
  the pack can pin a reviewed year for an era. Real Galilee/Samaria/Judea borders would have to
  be drawn from a sourced atlas as pack data (later).
- **In the prototype (2026-11-13, `phone-layout` branch):** 100 AD borders only, soft tinted,
  dashed, gold realm under the selected pin, realm names shown only where they fit. The
  "approximate · c. 100 AD" note sits in the map credits (the ⓘ button) for now, to keep the
  phone screen clear. Region names (Galilee, Samaria…) wait for a sourced atlas. Files are made
  by `app/scripts/build_borders.py`.
- **Borders are approximate** and say so (small note on the map). Old borders were fuzzy and
  disputed, and the data is thin before about 1000 AD (Lanciano c. 750, the Egypt entries).
- **Border data (to confirm licenses):**
  - Historical: `historical-basemaps` (github.com/aourednik/historical-basemaps), checked
    2026-11-13. Actively maintained (updated Nov 2026).
    - **Years:** every 100 years from 100 to 1900 AD, plus extra years (1279, 1492, 1530,
      1650, 1715, 1783, 1815, 1878, 1880, 1914, 1920, 1930, 1938, 1945, 1960, 1994, 2000,
      2010), and BC years back to 2000 BC and beyond. Covers every miracle date (Lanciano c. 750
      snaps to 700; the Egypt entries to 300/400) and Bible times later.
    - **Detail:** drawn for world/continent scale, which matches our region-level zoom limit.
      Each shape has a `NAME` (for labels) and a `BORDERPRECISION` (1 approximate, 2 moderately
      precise, 3 legal), so the map can blur or dash the approximate borders honestly.
    - **Size:** about 1–2 MB per year as raw GeoJSON. The build step should simplify and
      compress them to a few hundred KB each; only the year in view is loaded.
    - **License: GPL-3.0.** We may use and share it, but the border files must stay GPL-3.0 with
      credit to the author. Plan: keep them in their own folder in the pack with their own
      license file, separate from the MIT engine code and the
      CC BY-SA pin content. Whether loading GPL data makes the engine itself GPL is not settled
      law; keeping them separate is the cautious route. Confirm before launch.
    - **Zoom out to the whole world** (Joseph, 2026-11-13): the farthest zoom-out is set from the
      screen width so the world's full width fits (much farther on a phone than the old fixed limit).
    - **Credit lives with the files, not on the map** (Joseph, 2026-11-13): the ⓘ shows only
      "Borders approximate · c. 100 AD". The GPL credit is in `app/public/basemap/borders/CREDITS.txt`
      (served with the files); add it to the About page later if wanted.
  - Modern: Natural Earth (public domain).
  - OpenHistoricalMap stays the "later" option for finer, year-by-year borders.
- **On top:** only our pins (plain dots; name on the selected pin or when zoomed in).
- **Zoom:** stops at the region level. The card's **View on Google Maps ↗** link covers street
  level for free, with no API key.
- **Tech:** MapLibre GL JS (free, open source, touch-friendly) + Natural Earth for land, coastline and
  major rivers (public domain, small). No API key or tile server that can break.
- **One map, not two:** it starts on the world view for miracles and zooms into the Holy Land
  for Bible places. The 1748 scan as a faded optional overlay can come later.
- **Not now:** antique scan as the base (Holy Land only, licensing); embedded Google Maps (API
  key/billing, modern labels, off-brand).
- **Engine vs pack:** the engine draws whatever border sets it is given by date; the pack picks
  the border sources.
- **Data impact:** each place still needs only coordinates and certainty; "then/today" country
  names are computed.

## Pins = Wikipedia-style summaries
Clicking a pin opens a short card, not an article:
- 2–3 sentence summary + certainty badge
- **In Scripture:** verse links
- **Sources:** links to primary/scholarly sources (Wikipedia, Pleiades, excavation reports)
- **Suggest an edit** button
- **View on Google Maps ↗** (decision 2026-11-13): opens the pin's coordinates in a new
  tab via `https://www.google.com/maps/search/?api=1&query=LAT,LNG` (no API key). Shown
  for every place; when the location is uncertain it reads "View approximate location ↗".
  Engine treats it as a generic "modern map" link; the pack picks the provider.

Every claim cited. Depth lives behind links.

## Data
- Candidate open datasets (check licenses before use): OpenBible.info Bible
  Geocoding (places + verses + confidence), Pleiades (ancient gazetteer),
  Wikidata/Wikipedia (IDs, summaries).
- Basemap idea from teammate: OpenHistoricalMap + MapLibre GL JS, customized, not embedded as-is.

### Own database, not live AI (decision 2026-11-13)
- **Our reviewed data files are the only source of truth.** The map shows only reviewed data;
  nothing is generated or fetched by AI while a visitor is on the site.
  Why: live AI can invent places, verses, or citations that no one reviews (breaks "every
  claim cited" and faithfulness to Scripture); results would be unpredictable (clutter); and
  every search would be slower and cost money.
- **Fill the database in bulk, behind the scenes.** Import scripts pull places and verses from
  the open datasets above, keeping each one's source link. AI may draft the 2–3 sentence
  summaries and flag mismatches between sources, but a person reviews everything before merge.
- **Depth goes out through links** (Wikipedia, Pleiades, excavation reports), not copied in.
- **Later, not hackathon:** AI-assisted search that turns a plain-English question ("where was
  Paul shipwrecked?") into a filter over our own data. It never writes the answer itself.

### No mock data in the app (decision 2026-11-13)
Joseph: the site must never show made-up example content.
- Every word on a place card comes from the data files. No sample text, no "Lorem ipsum",
  no hard-coded example places in the code, not even temporarily.
- **Any empty field shows a repeating "FFFF FFFF FFFF" placeholder** (optional sections too),
  so a gap is obvious at a glance and can never be mistaken for real information.
- Tests and demos use real reviewed records, or the placeholder.

### Review check and certainty on the card (decision 2026-11-13)
- **Reviewed:** the bottom of every card has one small line, e.g. "✓ Reviewed by a person ·
  Nov 2026", linking to that place's edit history. Unreviewed places still never reach the site (changed 2026-11-13: see "Drafts on the live site")
  (the line says who/when, it doesn't sort reviewed from unreviewed). Data: `review` (by, date).
- **Certainty:** the old "✓ Confirmed site · New Testament" line goes. Certainty becomes a
  short phrase under the title ("Confirmed location" / "Probable location" / "Uncertain
  location") in gold-text, underlined to show it can be explained. Hover (desktop) or tap (phone)
  opens a one-sentence explanation of what that level means. No icon. The testament/category
  label is dropped from the card (the filters already show it).

- **Explore shows only the main collections** (Joseph, 2026-11-13): "Eucharistic miracles" and
  "Life of Jesus", no country or region checkboxes. The pack lists which groups Explore offers
  (`explore_filters` in pack.yaml); country and region stay in the data.
- **"Historical events" heading with "World history"** (Joseph, 2026-11-13): context for the
  timeline (what else was happening then). First five draft pins: Fall of the Western Roman
  Empire (Ravenna, 476), Great Schism (Hagia Sophia, 1054), Black Death reaches Europe (Messina,
  1347), Columbus's landfall (San Salvador Island, 1492, probable), Luther's Ninety-five Theses
  (Wittenberg, 1517). Emperors and more may join later. Ticking boxes under different headings
  now shows both ("or"), since every heading is a collection of pins.
- **First load is zoomed out over the Mediterranean** (Joseph, 2026-11-13; replaces "centered on
  the Holy Land" close-up): Europe and the Holy Land both in view, so it is clear what the map is.
  Realm borders are faint at this zoom and full strength from zoom 5.
- **Each collection has its own pin color** (Joseph, 2026-11-13); see brand.md.
- **Drafts on the live site** (Joseph, 2026-11-13, when the site first went public): unreviewed
  places show on carloscompass.com too, so the demo isn't an empty map, but every draft card says
  "Draft · not yet reviewed by a person" where the review line goes. A place becomes reviewed when
  a person fills its `review` (by, date). Replaces "only reviewed data reaches the site" for now.
### First dataset: Eucharistic miracles (decision 2026-11-13)
Joseph: start the data with the Eucharistic miracles, not Bible places, because it is simpler.
- Why it's simpler: one category, no journeys to draw, and most sites are churches that still
  stand, so the location is usually certain. Each miracle has one date, which suits the timeline.
- Why it fits: it's the core of Carlo's own work, so it makes the strongest demo of "true to
  Carlo" (goal 6) with the smallest dataset (goal 8).
- Hand-entered, not imported: there is no clean open dataset like OpenBible for these. Start with
  a small batch of well-documented miracles (about 10–20), each citing its Church recognition.
  Link to Carlo's catalogue rather than copying its text (copyright).
- Consequences: the basemap has to show Europe and the world from day one (the "Next" question
  about a world view must be answered first), and the 1748 Holy Land scan can't be the basemap
  for this slice. The data schema built here must still fit Bible places later.

### Data format foundation (decision 2026-11-13; no code written yet)
Agreed as the foundation; schema/build files come later.
- **One YAML file per place:** `packs/bible-catholic/places/<id>.yaml`. YAML over JSON because
  it is easier to edit in a PR (comments, multi-line text, clean diffs).
- **Fields:** `id`, `name`, `category`, `featured` (team-only), `location` (lat, lng,
  certainty, note, source), `date` (from, to, approx, source), `summary` (2–3 sentences),
  `scripture` (optional; required in practice for Bible places), `tags` (pack facets like era,
  book, person, journey), `sources` (id, kind, title, url), `ids` (wikidata, pleiades, …),
  `then` (optional: realm name + source, overrides the computed "Then:" when the border data
  is wrong).
- **Every claim points at a source:** location and date name a source id; summary is covered
  by the sources list.
- **Engine vs pack:** category names, tag facets, source kinds (e.g. recognition, catalogue),
  eras and certainty labels are defined in `packs/bible-catholic/pack.yaml`, not the engine.
- **Build step (later):** compiles the files into a light map index plus one detail file per
  pin, so pin details load on click. A schema check on every PR enforces the quality gate.
- **Journeys (later):** separate files listing place ids in order; they don't change this format.
- **Open:** `scripture` optional for miracles (proposed) vs. always citing a Eucharistic verse.

### Clutter is controlled by display, not database size (decision 2026-11-13)
- The database can grow to thousands of places; the anti-clutter rules decide what shows.
- Only the team picks which places are **featured** on the default view.

### Gospel and Exodus places (overnight draft by Claude, 2026-11-14; not yet reviewed)
Joseph asked for sourced places only, no AI summaries (the gap shows FFFF on purpose).
- **Added:** 24 Life of Jesus places (`gospel-place`) and a new **Exodus** collection
  (`exodus-place`, 9 places). Every event cites Scripture; every verse range was checked to
  exist (KJV numbering) and to begin and end on the event it names.
- **Coordinates:** 30 of 33 come from the OpenBible.info Bible Geocoding Data (CC BY 4.0,
  credited on each source link), read from the dataset by `app/scripts/generate_openbible_places.py`,
  not typed by hand. Each file's header names the OpenBible identification and its confidence
  score (out of 1000). The other three (Temple Mount, Cenacle, Jacob's Well) are Wikipedia
  infobox coordinates seen only through search results, because wikipedia.org was blocked
  from the session; check them on the live pages.
- **Certainty rule used:** `confirmed` when OpenBible scores the site ~800+ and nobody disputes
  it; `probable` for traditional sites and good-but-contested identifications; `uncertain` for
  disputed sites (Upper Room, Bethsaida, Tabgha, Emmaus, Kursi, Gabbatha) and every Sinai route
  station (they all depend on the southern-route assumption). Gethsemane is `probable` although
  OpenBible gives it 1000, because the exact spot is traditional.
- **One proposal per disputed site** (the card's "uncertain" text already says the pin marks one
  proposal): Cana = Khirbet Qana (OpenBible's leading identification), not the Kafr Kanna
  pilgrimage church; Emmaus = Qalunya/Motza; Red Sea = the Bitter Lakes (OpenBible ranks the
  Gulf of Suez first, but its only point is mid-gulf, ~180 km south); Mount Nebo = Jabal al-Naba
  (the Franciscan Memorial at Ras Siyagha is ~2 km west). Alternatives are named in each file.
- **Gospel dates** (all approx): Presentation c. 5 BC; finding in the Temple c. AD 8; baptism and
  early ministry AD 28 (Luke 3:1, 15th year of Tiberius); mid-ministry AD 29; Holy Week through
  Pentecost AD 30 (AD 33 is the other common proposal). The Temple cleansing is listed twice
  (John's early account and the Synoptic Holy Week account), without harmonizing.
- **Exodus dating is disputed.** Chosen: the early chronology, exodus c. 1446 BC from 1 Kings 6:1
  (480 years before Solomon's 4th year); the main alternative is c. 1250 BC. Year-1 events -1446;
  the spies at Kadesh -1445 (2nd year, Num 10:11); Kadesh in Num 20 and Moses' death on Nebo
  -1407 (40th year, Num 33:38, Deut 1:3).
- **Pin color:** Exodus = `muted` (slate), the one brand role not yet used for pins.
- **Left out (cannot be located):** the temptation in the wilderness, the Sermon on the Mount,
  the burning bush (dated before the exodus year), Aenon, Salim, Ephraim.
- **Miracle pins marked "located via …; check" (19):** each checked against Wikipedia/GeoNames
  coordinates (through search results only), and the header comment now says what was checked.
  - Fixed 2: Tixtla (was ~5.6 km off, at the municipality centroid) and Patierno (was located via
    Casoria; moved ~1.4 km into the San Pietro a Patierno quarter of Naples).
  - Left for a person 3: Scete (which monastery), Betania (the shrine's position is disputed) and
    Middleburg-Lovanio (Middelburg in Belgium or in Zeeland).
  - The other 14 were OK as town centres; where the relic or shrine is elsewhere (Herkenrode Abbey,
    Weiten church, Hoogstraten), the comment says so, but the pin was not moved.

## Editing model: GitHub as the wiki
- Each pin is a small data file in the repo.
- "Suggest an edit" → form → pull request → team reviews → merged. History is free (git).
- **Quality gate** (decision 2026-11-13): every submission must include a source, required
  fields (location, certainty, verses or citation) are checked automatically, and a reviewer
  approves before anything goes live.
- **Contributing is free; never tied to donating** (decision 2026-11-13). Paying doesn't make an
  edit accurate, a paywall drives off the scholars and careful volunteers we want, and "pay to add
  content" on a Scripture reference looks like donors can buy influence. Donations stay voluntary
  and pay for hosting, developers, and marketing (see Donate page).
- Friendlier editor UI later if non-technical contributors grow.

## Open-source future: one engine, many packs
- **Parent = engine:** map, timeline, search, journey player, panel. No religious content or fixed branding.
- **Children = content pack + theme:** Carlo's Compass is the Catholic Bible pack.
  Others (e.g., an Islamic history pack) could run their own site on the same engine.
- Do now: data separate from code; colors named by role; repo laid out as
  `engine/` + `packs/bible-catholic/`; pick licenses early (code MIT/Apache-2.0,
  content per pack, e.g. CC BY-SA).
- Hackathon scope: build only the Catholic site.
- Open question: is the parent its own directory site, or only shared code?

## Design process
- Mockups in **Canva** (team decision 2026-11-13), Mines Chrome profile, built by
  click-and-drag on a **blank 1440×900 page**, not a template (templates read as generic).
- Avoid the "AI-made" look: no default fonts (Inter/Roboto/Arial), no gradients (one exception: the Carlo illustration's light falloff, see brand.md),
  no repeated icon+headline cards, real content (real places/verses/sources) instead
  of filler, and one hand-crafted signature element (illustrated aged-paper map with
  a single crimson route). Joseph makes the taste calls.

## Mockup v1 (2026-11-13)
Canva design "Carlo's Compass - Homepage mockup" (Mines account). Snapshot:
[mockups/2026-11-13-homepage-v1.png](mockups/2026-11-13-homepage-v1.png).
- Basemap: 1748 antique map "Carte de la Terre de Chanaan" (aged paper, period place names).
- Type: Merriweather (headings/logo) + Merriweather Sans (UI/body).
- Pins: muted earth dots by default; selected pin crimson with white ring.
- One crimson dashed route (Nazareth → Capernaum, Matt 4:13).
- Pin card order (updated 2026-11-13 below: certainty is now an underlined phrase, review line at the bottom): title → certainty badge (gold-text) → 2–3 sentence summary →
  IN SCRIPTURE (crimson verse links) → SOURCES (crimson links) → Suggest an edit.
- Timeline: era names in parchment on navy; active era in gold bold.
- Joseph's review: didn't like it. Era bar too simple / unclear it was clickable →
  replaced by the Explore overlay (above).

## Mockup v2 (2026-11-13)
Same Canva design, edited in place (page 1 = home, page 2 = Explore overlay). Snapshots:
[mockups/2026-11-13-homepage-v2.png](mockups/2026-11-13-homepage-v2.png),
[mockups/2026-11-13-explore-overlay-v2.png](mockups/2026-11-13-explore-overlay-v2.png).
- Home: era bar removed; **Story · Donate** text links and a crimson **Explore** button in the top bar (the Story link was renamed About after this mockup); active filter chips
  ("Gospels ×", "Jesus ×") under the bar; "← 4 places match · show list" above the card;
  "View on Google Maps ↗" on the card; side panel runs full height.
- Overlay: navy scrim over the map, parchment panel with serif title "Explore the map" and ×;
  three checkmark columns (Books + Journeys, Eras + Place types, People + Certainty);
  footer "Clear all · 4 places match" and a crimson **Show on map** button.
- Overlay update: search field under the title, then a featured "Eucharistic miracles ·
  Church-approved sites worldwide" checkbox above the three columns.
- Home update: live timeline scrubber along the bottom of the map: navy bar, label
  "LIFE OF JESUS · ◂ drag to move through time ▸", slate track with a gold filled part up to
  a crimson handle, labels 27 AD · **c. 28 AD** (under the handle) · 30 AD. Pins not reached
  yet are faded (30%); the card shows the place at the handle's moment.
- Home update: the final logo (monstrance–compass mark + "Carlo's Compass", parchment
  lockup from design/logo/mark/) replaces the plain text title in the top bar. Page 2 (overlay)
  still shows the old text title under the scrim.
- Home update (designer pass): filter chips and timeline bar are now parchment surfaces with a
  soft shadow (navy only in the top bar); chips have a thin navy outline; timeline text is ink,
  fill gold-text; panel type bumped to 12 px labels / 14 px links on an 8 px spacing rhythm.
  Rules (incl. phone/touch sizes) in brand.md "Type scale, spacing and surfaces".
- Basemap is still the 1748 scan as a stand-in; the "calm basemap" rule still applies.

## Mockup v3 (2026-11-13)
Same Canva design, page 1 edited in place. Snapshot:
[mockups/2026-11-13-homepage-v3.png](mockups/2026-11-13-homepage-v3.png).
- The 1748 scan is replaced by the real basemap in the soft tinted palette, rendered from Natural
  Earth (10m) at the Holy Land frame, placed at 1440×900, 0/0, behind everything.
- The frame is anchored so Capernaum and Nazareth fall exactly on the existing pins and route.
  The two muted pins were moved to the real Jerusalem and Bethlehem positions.
- Borders from the 100 AD data (whole area Roman, Nabatean border to the east) plus region
  names; see Basemap, "Close zoom" and "Gospel-era border year". Render:
  `design/map/renders/basemap-tinted-soft-holyland-ad100.png`
  (`python3 design/map/render_styles.py holyland-28-ad100 tinted-soft`).

## Pre-build decisions (Joseph, 2026-11-13 evening)
From the pre-build review ([pre-build-review.md](pre-build-review.md)). Where older text in this
file disagrees, this section wins.
- **Demo story: Eucharistic miracles + a small Gospel slice.** The miracles stay the first
  dataset; add 4–6 hand-entered, real, sourced Gospel places and one route (Nazareth →
  Capernaum, Matt 4:13), matching mockup v2. "Follow Paul to Corinth" is no longer the demo
  (the deck's slides 1 and 6 need updating).
- **Timeline scope for the hackathon:** the scrubber shows/hides pins, and borders swap between
  4–6 fixed years (e.g. 700, 1200, 1500, 1800, today) with a simple swap. Later, not now:
  century-by-century borders with preloading, realm names, computed "Then / Today".
- **Pin model: a place with named events.** One pin (one file) per place; the file holds a list
  of `events`, each with its own **title**, date, summary, verses and sources. A miracle is a
  place with one event. Search matches event titles: searching "centurion" lights up Capernaum
  and opens the card on "Healing of the centurion's servant". On the timeline a place is lit
  when one of its events is reached, and the panel shows that event. This replaces the single
  `date` on a place in "Data format foundation".
- **First load: an empty map centered on the Holy Land,** with a nudge to open Explore. No pins
  until the user chooses something. (Replaces "a handful of key places" on first load.)
- **Explore shows only groups that have data.** The engine hides empty filter groups; they
  appear by themselves as data is added.
- **Sharing:** keep docs, design and packs local for now (tonight); Eric and DJ are working on
  their own parts. Push to the private repo later. Still to confirm with the team: Natural
  Earth replaced the OpenHistoricalMap idea.
- **Build setup: Vite + React + TypeScript** (Joseph confirmed 2026-11-13). Chosen because it
  has to scale: the site is static files on Vercel either way (visitors and data size are not
  affected by the choice), and React gives a component structure that holds up as the Explore
  overlay, chips, panel, timeline and map grow, and is the framework most contributors know.
  Next.js only later, if each place needs its own search-engine-indexable page; the components
  would carry over.
- **Working defaults (proposed by the review, veto any):**
  - File format: slug ids (`lanciano`); dates as signed whole years (BC negative) with an
    `approx` flag; structured verse codes (`MAT 4:13`) with display names from the pack; three
    fixed certainty keys (`confirmed`, `probable`, `uncertain`) in the engine, labels from the
    pack; a separate Church-recognition field; `scripture` optional for miracles; the verse-link
    target is a pack setting.
  - Search: one small index loaded when Explore opens (id, names, event titles, coordinates,
    dates, tags), details on click; simple text match in the browser; "or" within a group,
    "and" across groups; typed text becomes a chip; no matches → the button is disabled and
    reads "No places match"; many matches → list in the panel and fit the map to them;
    non-matching places are not loaded (nothing to fade).
- **Basemap style: decided, soft tinted** (Joseph, 2026-11-13, later the same evening; see Basemap).
  Fits the fixed-years scope: realm names come with the border files, and the gold "selected
  realm" is one point-in-shape check on click. Only the computed "Then / Today" card line stays later.
- **Pin look** (Joseph, 2026-11-13): plain 12 px earth-colored dots, no ring. The selected pin
  grows to 16 px, turns crimson and gets a white ring. An uncertain location is a hollow dot.
  No number clusters. (brand.md updated; the old "white ring on every pin" rule is dropped.)
- **Pin timing on the scrubber** (Joseph, 2026-11-13): places not yet reached are hidden; a
  place appears at full strength when one of its events is reached, then settles to a muted
  dot. (Replaces the "faded to 30% until reached" note in Mockup v2.)
- **Interface font: Merriweather Sans** (Joseph, 2026-11-13). Headings stay Merriweather.
- **Timeline scale: two zones with a break** (Joseph, 2026-11-13). When Gospel places and
  miracles are both showing, the bar splits into a Gospel zone and a miracles zone with a
  small break mark, each scaled to its own dates. With one dataset on, the bar fits that one.
- **"Suggest an edit" for the demo: contact Joseph by phone** (Joseph, 2026-11-13). The button
  shows Joseph's phone number, 605-261-7740, instead of a form or GitHub link. Joseph chose
  this knowing the site and (later) the repo are public; swap to an email or form any time.
  The contact detail belongs to the pack, not the engine. The reviewed pull-request model
  stays the long-term plan.
- **Licenses: MIT for code, CC BY-SA 4.0 for pin content** (Joseph, 2026-11-13). GPL-3.0 border
  files stay in their own folder.
- **Phone: About · Donate go at the bottom of the Explore overlay** (Joseph, 2026-11-13). No
  hamburger menu. The rest of the phone layout is being worked on in another chat.
  - **Update (Joseph, 2026-11-13):** About was too hidden there, so phones also show **About** in
    the navy top bar (right side). Donate stays only in the Explore footer on phones.

## Lessons from the similar-products research (2026-11-13)
Full report: [reports/Bible map similar products.md](../reports/Bible%20map%20similar%20products.md)
(notes in `research_notes/`). Joseph OK'd adding its recommendations here. The researchers read
pages, store listings and press, not the products hands-on, so "none found" is not proof.

**Where we stand**
- No product found combines the whole vision, but nearly every piece exists somewhere.
- A free phone app, "St Carlo: Eucharistic Miracles" (St. Carlo Acutis Shrine at Malvern, with
  Antonia Acutis, Feb 2026, 13,000+ downloads), already maps the miracles. Per coverage it has
  no web version, no miracle timeline, no sources or approval status per miracle, closed data.
- **Do not claim "the first map of Carlo's miracles."** The claim we can defend: the first on the
  web with a timeline, sources on every card, and data anyone can check and reuse.
- "Bible data on a map" is now common (dozens of small 2025–2026 projects on OpenBible.info
  data). Our difference is **trust made visible**: every sentence sourced, location and Church
  recognition each stating how sure they are, a reviewer and date, open data. That costs effort
  per pin, so prefer a small, flawless set of miracles over a large one.
- Open ground (none found): an openly licensed Eucharistic-miracles dataset; a Catholic-canon
  Bible map with cited pins; one engine shared across faith communities (demand unproven, say so).
- Closest to study: History Globe (time slider, review labels), `GeiserX/biblical-atlas` (same
  one-YAML-file-per-entity + automatic checks + MapLibre design; GPL-3.0, so learn from it, do
  not copy code), TimeMap.org (the bottom slider people love, and the mistakes they punish).

**Changes to the design**
- **Church recognition is per miracle, not a blanket label.** No authoritative list of each
  miracle's recognition status was found, and recognition is usually local and varies (the
  researchers' reading, not a sourced fact). Each miracle carries a recognition level with its
  own citation, with levels modelled on the Marian-apparitions maps (e.g. local tradition /
  bishop-approved / Vatican-recognised / no decision found). The Explore label "Church-approved
  sites worldwide" (Mockup v2) should be reworded, e.g. "Eucharistic miracles worldwide", with
  recognition shown on each card.
- **Say which border year is showing,** e.g. "borders as of 1200", next to the "borders
  approximate" note. Border mistakes are the biggest reputation risk for a timeline map, and the
  border dataset calls itself a work in progress.
- **Test the scrubber on a real phone and in Firefox before the demo;** make sure the handle
  looks and behaves like a slider. The two-zone timeline has no precedent in other products, so
  show it to a few people before committing.
- **Bible places later (not the demo):** about 55% of located places in the OpenBible data have
  rival scholarly identifications, so one dot plus a certainty word can hide a real dispute;
  consider candidate sites or zones. OpenBible has no dates and leaves out the deuterocanonical
  books, so those places are added by hand and each date states where it comes from (stated in
  Scripture / calculated / estimated / unknown).
- **Editing:** outside contributions will be rare at first (similar open projects get almost
  none); the team's own entries are the content. A non-GitHub way to suggest edits (form or
  "edit this pin" link) is required before expecting outside edits. Watch reviewer backlog, not
  vandalism.
- **Record the source licence in each place file,** so reuse stays clear as data sources mix.
- **Maintenance is the real competitor:** most similar projects die by the author stopping. Keep
  the site static, with plain files and no server.

## Next
- From the similar-products research: (1) email the Associazione Amici di Carlo Acutis
  (info@miracolieucaristici.org) to tell them about the project and ask their blessing, since no
  written reuse terms exist; (2) read the `GeiserX/biblical-atlas` repo before finalising the data
  schema; (3) reword the "Church-approved sites worldwide" label in the mockup.
- Basemap style picked: soft tinted (see Basemap). Next design step: drop
  `design/map/renders/basemap-tinted-soft.png` into the Canva mockup in place of the 1748 scan.
  Pin positions in the render are approximate, mockup only.
- Joseph's review of mockup v2.
- About and Donate page mockups: later (Joseph, 2026-11-13).
- Phone mockup (home + pin card bottom sheet + Explore). Open question: where About · Donate
  go on a phone without adding a hamburger menu.
- Open question: how search results look on the map. (Basemap is decided; see Basemap.)
- Done 2026-11-13: Carlo's catalogue list extracted (facts only) to
  [packs/bible-catholic/staging/eucharistic-miracles-catalogue.csv](../packs/bible-catholic/staging/eucharistic-miracles-catalogue.csv):
  151 rows, 108 place miracles in 20 countries (map pins) plus saints, Our Lady, and miraculous
  communions (people, not fixed places; decide later whether they get pins). All `unreviewed`.
  Next: add coordinates + certainty, then Church-recognition sources, starting with the featured few.
- Done 2026-11-13 (`phone-layout` branch): all 108 place miracles turned into draft place files by
  `app/scripts/import_miracles.py`: name, country, date, Carlo's catalogue link, and town-centre
  coordinates from OpenStreetMap (106 found; St. Mary of Egypt and S. Peter Damian are people, so
  no pin). Summary, location certainty and Church recognition are left empty (they show FFFF).
  Unreviewed, so only the local dev server shows them. Lookups marked "check" in the CSV need a
  person (e.g. Scete, Betania, the double names). The 100 AD borders hide past 300 AD (`until`
  in pack.yaml), and Show fits the map to the middle 80% of the results.
- Hackathon pitch deck: first draft in Canva (Mines account), "Carlo's Compass - Hackathon Pitch",
  https://www.canva.com/design/DAHa2jbuDfk/edit. Outline in [presentation.md](presentation.md).
- Done 2026-11-14 (`overnight-data` branch, Claude, unreviewed): 24 Life of Jesus places and a new
  Exodus collection (9 places), sourced from OpenBible.info and Scripture, no summaries. Judgment
  calls in "Gospel and Exodus places" above.
