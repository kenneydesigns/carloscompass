# General-purpose interactive historical timeline maps and ancient-world digital atlases (state as of November 2026)

Scope note: KronAtlas and Summit are excluded by instruction. Research was done 2026-11-13 with web search and page fetches. Several official pages blocked automated fetching (oldmapsonline.org about page, darmc.harvard.edu, vici.org about page, whgazetteer.org site guide), so those entries lean on secondary sources and are flagged. Nothing here was verified by using the live apps hands-on; "status" statements are based on page content and dated news, not on a live uptime check.

## 1. How do history-timeline maps work and differ (Chronas, Running Reality, GeaCron, TimeMaps, Histography, OpenHistoricalMap, Old Maps Online TimeMap, World History Atlas apps, Kronoscope, HistoryMaps, Omniatlas, newer entrants 2024-2026)?

### Takeaway
The field splits into four models: (1) Wikipedia/Wikidata-driven "everything at year X" maps (TimeMap.org, Chronas, and hobby entrants like Globe of History and Chronoscope), (2) a hand-curated simulation with per-claim citations (Running Reality), (3) a wiki-style open geodatabase with date tags on every feature (OpenHistoricalMap), and (4) editorial, hand-drawn step-by-step map series (Omniatlas, TimeMaps, GeaCron). TimeMap.org (Old Maps Online/MapTiler) is the current mass-audience leader and the most-discussed product; OpenHistoricalMap is the only one whose data and stack are fully open and directly reusable in MapLibre.

### Cited Findings

**TimeMap.org / Old Maps Online "TimeMap" (MapTiler / Klokan Technologies, with David Rumsey Map Collection)**
- Launched by Old Maps Online, MapTiler and the David Rumsey Map Collection as an interactive world map covering roughly the last 6,000 years; first reported May 2024. — [Maps Mania, May 2024](https://googlemapsmania.blogspot.com/2024/05/old-maps-online.html)
- An OldMapsOnline press release dated May 27, 2025 is titled "Six thousand years of history in one map"; the Czech team presented TimeMap at Stanford. Exact "launch" date is fuzzy (beta 2024, wide coverage Dec 2024, press push 2025). — [OldMapsOnline press page](https://www.oldmapsonline.org/es/project/press)
- A bottom slider selects any year from 4000 BCE to (per this article) 2010; top tabs are Regions, Rulers, People, Battles; Wikipedia pages are embedded; the site also overlays 500,000+ scanned historical maps; a free account allows uploading maps. — [Mental Floss, Jan 2025](https://www.mentalfloss.com/geography/maps/explore-world-history-interactive-map)
- In March 2026 a new "Places" layer added cities and settlements as clickable points showing how the surrounding regions changed over time. — [OldMapsOnline news, March 2026](https://mzk.oldmapsonline.org/it/news/2026/03/explore-historical-places-with-timemap)
- A beta program page exists for TimeMap. — [beta.oldmapsonline.org](https://beta.oldmapsonline.org/about/)
- The Hacker News thread "Timemap.org – Interactive Map of History" (Dec 12, 2024) reached 1,306 points and 180 comments; the creator (HN user klokan) replied in-thread and pointed users to an in-app Feedback button. Commenters said it draws on OpenHistoricalMap for street-level data. — [Hacker News](https://news.ycombinator.com/item?id=42397550)
- Free to use; described as a free interactive map, not a subscription. — [Product Hunt reviews page](https://www.producthunt.com/products/timemap/reviews)

**Chronas (chronas.org; founder Dietmar Aumann, per 2019 coverage)**
- Listed as free and open source; a history map application with "over 50 million data points" that every registered user can curate and contribute to. — [AlternativeTo](https://alternativeto.net/software/chronas-org/about)
- Maps about 4,000 years of world history (2000 BC to 2000 AD) with rulers, cultures, religions, migrations, battle and city markers, and linked Wikipedia articles and media; users can create article collections called "Epics". — [Outils TICE review](https://outilstice.com/en/chronas-carte-interactive-histoire-mondiale/)
- Product Hunt launch dated March 22, 2019; a 2019 interview describes a successful Kickstarter and a revisioning system for user edits. — [Product Hunt](https://www.producthunt.com/products/chronas/launches); [eLearning Inside](https://news.elearninginside.com/chronas-map-of-history-50-million-data-points/)
- Frontend repo Chronasorg/chronas: React/Redux/webpack, Express server, Docker/Kubernetes/Azure/AWS Amplify configs; 615 commits, 30 stars, 9 forks, 14 open issues; self-described as "the second version of Chronas in beta stage". No license was visible in the fetched page. — [GitHub Chronasorg/chronas](https://github.com/Chronasorg/chronas)
- An educator review notes that the option to explore data sets is "somewhat hidden" in the map. — [Free Technology for Teachers](https://freetech4teach.teachermade.com/?p=14522)
- No review or news item dated 2024-2026 was found for Chronas; all coverage found is 2019-era. — [AlternativeTo alternatives list](https://alternativeto.net/software/chronas-org)

**Running Reality (runningreality.org; creator Garth Henning)**
- A map-based model of world history from 3000 BC to today showing borders, territories, city locations and battles; website plus downloadable desktop app; created by Garth Henning. — [World History Commons review](https://worldhistorycommons.org/running-reality)
- Describes itself as a world history model, not a map: built from hundreds of thousands of small "factoids"; the engine keeps a world timeline plus an individual timeline for each object; the baseline is partly interpolated. — [Running Reality timelines reference](https://runningreality.org/docs/reference/timelines.jsp)
- The main world, "Reality", requires that every factoid have a citation and be reviewed by the Running Reality team; alternate or unverified material goes into other "worlds". — [Running Reality history-research tutorial](https://runningreality.org/docs/tutorial/history.jsp)
- "Running Reality will always be free and open access"; web and desktop versions are both free. Some teacher lesson plans are sold. — [Data Use Policy](https://runningreality.org/docs/policy/datausepolicy.jsp); [World History Commons](https://worldhistorycommons.org/running-reality)
- Review weakness: the breadth of content makes it hard to know where to start or to find specific information. — [World History Commons](https://worldhistorycommons.org/running-reality)

**OpenHistoricalMap (openhistoricalmap.org; OSM-community sister project)**
- Time slider filters map data to a point in time from 4001 BCE to the present; a 2020 revamp lets users animate the map over any date range. — [OSM wiki OHM News](https://wiki.openstreetmap.org/wiki/OpenHistoricalMap/News)
- Data is CC0 public domain unless a feature says otherwise (CC0 adopted Aug 3, 2022); map styles and docs are CC0; website code is GPL. — [OHM Copyright and License](https://openhistoricalmap.org/copyright)
- MapLibre GL JS is OHM's preferred web library; official vector tiles at `https://vtiles.openhistoricalmap.org/maps/ohm/{z}/{x}/{y}.pbf` (plus `ohm_admin` boundary polygons, `osm_land`, and Natural Earth water); styles published on npm as `@openhistoricalmap/map-styles`. — [OSM wiki OHM/Reuse](https://wiki.openstreetmap.org/wiki/OpenHistoricalMap/Reuse)
- Date filtering in MapLibre uses the `maplibre-gl-dates` plugin (`map.filterByDate('2013-04-14')`), filtering on `start_decdate`/`end_decdate`; a ready-made slider exists for Leaflet (leaflet-ohm-timeslider-v2), and "Timescope" is suggested for MapLibre. — [OSM wiki OHM/Reuse](https://wiki.openstreetmap.org/wiki/OpenHistoricalMap/Reuse)
- Actively maintained in 2026: first donation drive (Feb 13, 2026), 2,000th contributor (Feb 17, 2026), quality/coverage stats dashboard (Apr 1), tile server migrated from Tegola to Martin (Apr 14), official TileJSON tilesets (Apr 16), search filters (Jul 10), GraphHopper historical trip planner (Oct 26), MapRoulette campaigns and a coastline dataset (Nov 9, 2026). — [OSM wiki OHM News](https://wiki.openstreetmap.org/wiki/OpenHistoricalMap/News)
- Third parties build on it: OpenRailwayMap added a time slider using OHM data (Apr 17, 2025). — [OSM wiki OHM News](https://wiki.openstreetmap.org/wiki/OpenHistoricalMap/News)

**GeaCron (geacron.com)**
- Freemium: free 2D map with limited zoom and labels linking to Wikipedia; premium is a one-time US$45 perpetual license adding a 3D globe, more zoom, more political/geographic detail and no ads. Covers 3000 BC to present; users step forward/back by 1, 10 or 100 years. Online only. Note says the map "sometimes takes a little bit to load". This is a third-party listing last updated Oct 28, 2021. — [AlternativeTo GeaCron](https://alternativeto.net/software/geacron/about)

**TimeMaps (timemaps.com)**
- Atlas of world history is free to use; "Extension Units" remain part of a Premium (teacher-oriented) membership. — [timemaps.com](https://timemaps.com/)

**Omniatlas (omniatlas.com; Rick Westera, Auckland, NZ)**
- A free interactive historical atlas with step-by-step maps of major world and regional events, plus articles and timelines; built with Python, Django, Adobe Creative Cloud and QGIS; acknowledges Wikipedia, Britannica and Natural Earth; maps are "free to share so long as Omniatlas is notified and clearly credited"; supported via Patreon; copyright notice 2011-2026 with recent content (e.g. Europe 216, Roman-Sasanian wars). — [Omniatlas About](https://test.omniatlas.com/about/)

**HistoryMaps (history-maps.com)**
- Positions itself as an education platform, "Learn History Visually", with an "Academy" of history courses and an "Ask Herodotus" feature image; subscriptions fund free access for students/teachers who cannot afford it; no prices shown on the landing page. — [history-maps.com](https://history-maps.com/)
- Product Hunt shows a single review, rated 1/5. — [Product Hunt HistoryMaps reviews](https://www.producthunt.com/products/historymaps/reviews)

**Histography (histography.io; Matan Stauber)**
- 2015 Bezalel Academy final project: Wikipedia events rendered as interactive dots across 14 billion years, with a selector to view decades or millions of years at a time. It is a timeline visualization, not a map. — [Smithsonian Magazine](https://www.smithsonianmag.com/smart-news/what-14-billion-years-of-history-looks-like-180956971/)

**Centennia Historical Atlas (historicalatlas.com) — desktop software, Europe/Middle East**
- Sold as licensed software: single-user US$89, ten-user site license US$395. — [Centennia purchase page](https://www.historicalatlas.com/purchase/)

**World History Atlas / "History Maps" apps**
- AlternativeTo lists "History Maps" (a free world map for every year from 3000 BC to the present) as the top Chronas alternative, and "World History Atlas" as an app presenting topics chronologically and geographically. — [AlternativeTo Chronas alternatives](https://alternativeto.net/software/chronas-org)

**Newer entrants 2024-2026 (mostly solo/hobby projects)**
- Globe of History (globeofhistory.com): Show HN Oct 28, 2025 (3 points, no comments); 3D globe with 5,000+ events from 4000 BCE to 2025; data scraped from Wikipedia/Wikidata with Python, enriched and "verified" with Gemini 2.0 Flash; Mapbox GL JS + React (Vite); desktop only. — [Hacker News](https://news.ycombinator.com/item?id=45738662)
- Chronoscope (shiphappens.xyz/chronoscope): Show HN March 12, 2026 (11 points, 5 comments); merges OpenHistoricalMap, Wikidata and academic databases into one timeline; shuffle button, geolocated events per period, ancient cities with original names, empire hierarchies; all sources linked in-app. — [HN Showcase](https://hnshowcase.com/post/47348772/i-built-chronoscope-because-google-maps-won-t-let-you-visit-)
- Chrono Civilizations: free interactive atlas visualizing 5,500 years of world history on one map. — [chrono-civilizations.vercel.app](https://chrono-civilizations.vercel.app)
- Diena: zoomable timeline of about 4 million Wikipedia events (timeline-first, Show HN; date not confirmed). — [zeli.app listing](https://zeli.app/en/story/48950774)
- Other tools named by HN commenters as alternatives: Chronas, GeaCron, chron.ist, markwhen.com, Topotijdreis (Netherlands), native-land.ca. — [Hacker News](https://news.ycombinator.com/item?id=42397550)

### Inferences
- For Carlo's Compass, the closest architectural precedent is OpenHistoricalMap's stack (MapLibre + date-attributed vector features + a date filter), while the closest UX precedent is TimeMap.org (one bottom slider, a few layer tabs, click-through to a side panel). Running Reality is the precedent for "every claim has a citation".
- The Wikipedia/Wikidata-scrape approach is now a commodity: at least three hobby clones appeared in 2025-2026 and got little traction (3 and 11 HN points). Differentiation comes from curation, citations and a focused theme, which is what a Eucharistic-miracles + Bible-places pack offers.
- Editorial projects run by one person (Omniatlas since 2011, Running Reality, GeaCron) survive a long time but have bus-factor risk; community/open-data projects (OHM) show the healthiest 2026 activity.

### Gaps
- Kronoscope: no product by this exact name was found in any search. The nearest match is "Chronoscope" (2026 hobby project above); it may be what was meant, or Kronoscope may be a small app not indexed.
- Chronas current status (online/offline, last data update, license) could not be confirmed; no 2024-2026 coverage was found and the GitHub page fetched showed no commit dates. Treat as "possibly stagnant; verify by loading chronas.org". Unverified recollection: Chronas uses a bottom year slider with selectable area-colour dimensions (ruler/culture/religion) and Mapbox GL; not confirmed this session.
- Histography's current availability was not verified (all coverage is 2015-2016).
- GeaCron's official pricing page, maker identity, and 2026 status were not retrieved; the US$45 figure is from a 2021 third-party listing.
- HistoryMaps subscription prices, platforms, and whether its timeline-map product is still the core offering were not found.
- TimeMaps premium price and "World History Atlas" app details (maker, price, platform) were not retrieved.
- TimeMap.org's own "about" page returned HTTP 403, so its exact data pipeline (Wikidata vs. in-house editorial borders) and licence are not confirmed from the primary source.

## 2. What does the timeline control look like, and how do they handle different time scales, dense periods, and uncertain dates?

### Takeaway
Almost all products use a single horizontal year control at the bottom of the map; the differences are in granularity (any year vs. fixed steps vs. hand-authored event steps) and very few do anything explicit about density or uncertain dates. Running Reality (competing-hypothesis "Bubbles") and the historical-basemaps `BORDERPRECISION` attribute are the only explicit uncertainty mechanisms found among timeline maps.

### Cited Findings
- TimeMap.org: a slider along the bottom selects any single year between 4000 BCE and the present. — [Mental Floss](https://www.mentalfloss.com/geography/maps/explore-world-history-interactive-map)
- TimeMap.org usability complaints: the year control "looked like a slider but behaved as a text box"; the timeline slider failed on smaller viewports and some Firefox setups; no pinch zoom on mobile; overlapping battles/points of interest were hard to tell apart; sidebars were called clunky. — [Hacker News thread](https://news.ycombinator.com/item?id=42397550)
- TimeMap.org anachronism complaints: cities are shown before they were founded (users asked that they appear only once they exist); coastlines are modern at all dates. — [Hacker News thread](https://news.ycombinator.com/item?id=42397550)
- GeaCron: stepping control, forward/back by 1, 10 or 100 years (three fixed scales rather than a continuous zoom). — [AlternativeTo GeaCron](https://alternativeto.net/software/geacron/about)
- OpenHistoricalMap: slider spans 4001 BCE to present and can animate over any chosen date range; features are filtered by decimal start/end dates (`start_decdate`, `end_decdate`) derived from `start_date`/`end_date` tags, so every feature has a validity interval rather than belonging to a snapshot year. — [OSM wiki OHM/Reuse](https://wiki.openstreetmap.org/wiki/OpenHistoricalMap/Reuse); [OSM wiki OHM News](https://wiki.openstreetmap.org/wiki/OpenHistoricalMap/News)
- Running Reality: per-object timelines plus a world timeline; uncertainty handled with "Bubbles" that represent, for example, two candidate dates for an event or an unknown death date, and let users show competing hypotheses; the baseline between known data points is interpolated. — [Running Reality timelines reference](https://runningreality.org/docs/reference/timelines.jsp)
- Omniatlas: no free slider; maps advance step-by-step through authored events. — [Omniatlas About](https://test.omniatlas.com/about/)
- Histography: scale selector lets the user view decades at a time or millions of years at a time, a variable-scale answer to very uneven event density. — [Smithsonian Magazine](https://www.smithsonianmag.com/smart-news/what-14-billion-years-of-history-looks-like-180956971/)
- Chronoscope adds a "shuffle" control to jump to a random period, and lists notable events for the selected period. — [HN Showcase](https://hnshowcase.com/post/47348772/i-built-chronoscope-because-google-maps-won-t-let-you-visit-)
- Globe of History's author explicitly asked for "ideas for better temporal exploration UX" and for help with performance on large point datasets, i.e. these are unsolved for hobby builders. — [Hacker News](https://news.ycombinator.com/item?id=45738662)
- ToposText (text atlas) marks mythological-era paragraphs with a conventional date "~1000 BC" and filters its text index by date. — [ToposText project page](https://topostext.org/the-project)

### Inferences
- Lessons for a 700 AD-to-today scrubber with a separate Bible era: (a) make the control unambiguous (TimeMap's slider-that-is-a-text-box confused people), (b) test it on narrow viewports and Firefox, (c) never show a pin before its date (the "cities before founding" complaint is exactly the behaviour Carlo's Compass avoids by revealing pins as the scrubber reaches them), (d) plan for overlapping pins in dense periods.
- With only a handful of fixed border years, the app behaves like a snapshot atlas (GeaCron/historical-basemaps model), not an interval model (OHM). Users on HN noticed and complained about border dates that were off by decades, so showing the border snapshot year in the UI (e.g. "borders as of 1492") is an honest mitigation.
- No product found uses a non-linear (compressed/expanded) slider; scale changes are done by step size (GeaCron) or scale selector (Histography). A segmented or era-based timeline would be a differentiator rather than a copied pattern.

### Gaps
- No primary documentation was found describing the precise UI of Chronas's, Running Reality's, or TimeMaps' timeline controls (play buttons, zoomable ticks, keyboard stepping). The Running Reality reference page fetched did not describe the control itself.
- No source was found describing how any of these products display "circa" dates on the timeline control itself (as opposed to in the data model).
- No UX study or digital-humanities journal article directly comparing timeline-control designs across these products was found.

## 3. Where do they get historical border data, and what are the licenses?

### Takeaway
Border data comes from three places: Wikipedia/Wikidata-derived or in-house proprietary sets (TimeMap, Chronas, GeaCron, Running Reality, Centennia, Euratlas), the CC0 OpenHistoricalMap database, and the hobbyist `aourednik/historical-basemaps` GeoJSON set, which is GPL-3.0 and self-described as approximate. Only OHM (CC0) and historical-basemaps (GPL-3.0) are openly reusable; Running Reality explicitly restricts bulk reuse.

### Cited Findings
- historical-basemaps (aourednik): licence shown as GPL-3.0; 883 stars, 149 forks, 313 commits, 7 open issues; `index.json` lists each year and its file (e.g. `world_1492.geojson`). — [GitHub aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps)
- historical-basemaps attributes: `NAME` (label), `SUBJECTO` (colonial/sovereign power, suited to choropleth colour), `PARTOF` (larger cultural grouping), `BORDERPRECISION` ordinal 1 = approximate, 2 = moderately precise, 3 = determined by international law. — [GitHub aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps)
- historical-basemaps disclaimers: "work in progress"; "verify the maps by comparison to other sources before using in academic work"; historical boundaries are more disputed than modern ones; territorial sovereignty concepts apply in Europe mainly after 1648; ancient areas often overlap; overlaying on modern physical maps misleads because rivers and shorelines moved. Origin: basemaps "collected, adapted and converted from diverse sources", some only via the Wayback Machine, crediting students of ThinkQuest Team C006628. — [GitHub aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps)
- Licence conflict: repository metadata says GPL-3.0, while a third-party "skill" page labels the data CC BY 4.0 and also inverts the BORDERPRECISION scale; the repository is the authoritative source. — [ecosyste.ms repo listing](https://repos.ecosyste.ms/hosts/GitHub/repositories/aourednik%2Fhistorical-basemaps); contradicted by [clawhub.ai skill page](https://clawhub.ai/skills/historical-map)
- The historical-basemaps README points to other border sources: CShapes, Old Maps Online, Native Land, David Rumsey, AWMC (UNC), Euratlas, GeaCron, Wikimedia Commons. — [GitHub aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps)
- OpenHistoricalMap: data CC0 (some features carry CC BY / CC BY-SA or other requirements via `license=*` tags; as of April 2024 only 0.12% of features carried explicit licence tags, 63% of those CC0-1.0); attribution requested: "credit OpenHistoricalMap contributors on or near the map"; the new coastline file is ODbL because it mixes OSM and OHM data. — [OHM Copyright](https://openhistoricalmap.org/copyright); [OSM wiki OHM/Reuse](https://wiki.openstreetmap.org/wiki/OpenHistoricalMap/Reuse)
- OHM bulk access: daily planet file, weekly full-history file, Overpass and REST API; no regional extracts yet; boundary polygons are served as a dedicated `ohm_admin` vector tileset. — [OSM wiki OHM/Reuse](https://wiki.openstreetmap.org/wiki/OpenHistoricalMap/Reuse)
- Running Reality: no open licence; non-commercial educational use and individual screenshots are allowed with credit; commercial use or mass distribution of raw data is not permitted; data is watermarked; raw model data is not available for export; embedding a live map is offered instead. — [Running Reality Data Use Policy](https://runningreality.org/docs/policy/datausepolicy.jsp)
- Chronas: described as built on a mix of OpenStreetMap, Wikipedia and Google Earth, with Wikipedia-linked content. — [Outils TICE](https://outilstice.com/en/chronas-carte-interactive-histoire-mondiale/)
- Omniatlas: maps hand-made in QGIS/Adobe on Natural Earth; share-with-credit-and-notification terms, not an open data licence. — [Omniatlas About](https://test.omniatlas.com/about/)
- Commercial border datasets exist as paid products: Centennia (US$89 single user) and Euratlas Periodis (site licences sold in euros). — [Centennia purchase](https://www.historicalatlas.com/purchase/); [Euratlas shop](https://www.euratlas.net/PHA/shop/groupl.htm)
- Globe of History and Chronoscope use Wikipedia/Wikidata (and OHM for Chronoscope) for events and geometry. — [Hacker News](https://news.ycombinator.com/item?id=45738662); [HN Showcase](https://hnshowcase.com/post/47348772/i-built-chronoscope-because-google-maps-won-t-let-you-visit-)

### Inferences
- Licence implication for Carlo's Compass: historical-basemaps is GPL-3.0, a software copyleft licence applied to data. If the project wants its content packs under a Creative Commons licence "like Wikipedia", the border GeoJSON should be kept as a clearly separate, attributed, GPL-3.0 asset, and the team should decide whether bundling it has implications for the engine's own licence. This is an inference; get the LICENSE file text and, if it matters, proper advice.
- OHM's CC0 `ohm_admin` boundaries are the cleaner licence choice and work natively with MapLibre + `maplibre-gl-dates`, but coverage for 700-1500 AD is community-dependent and likely patchier than a hand-made snapshot set; a hybrid (historical-basemaps snapshots now, OHM later) is plausible.
- `BORDERPRECISION` could drive a visual cue (e.g. softer/blurred or dashed line for value 1), which aligns with the project's certainty-badge goal without adding map text.

### Gaps
- TimeMap.org's border source and licence were not confirmed from a primary page (403). HN commenters only state that OHM is used for street-level detail.
- GeaCron's border sources and data licence were not found.
- The exact list of years in historical-basemaps and the date of its last commit were not captured by the fetch; check `index.json` in the repo.
- CShapes and Euratlas licence terms were not researched in detail.

## 4. Which ancient-world tools are relevant to Bible geography (Pleiades, Pelagios/Peripleo, ORBIS, DARE, Vici.org, ToposText, World Historical Gazetteer, AWMC tools, DARMC), what do they offer, and how open is the data?

### Takeaway
Pleiades (42,000+ places, CC BY 3.0, stable URIs, peer-reviewed community edits) is the backbone the others link to, and is the right identifier/citation source for Bible-era places. Around it: WHG (v3.2, aggregator with API), ToposText (5,000+ Greek-world places tied to texts, downloadable), Vici.org (wiki-style archaeological map, CC BY-SA), DARE and CAWM tiles (Roman-era basemap tiles, CC BY), ORBIS (travel-cost model c. 200 CE), and the new Itiner-e Roman roads dataset (CC BY 4.0). Several older tools are deprecated or offline (original Peripleo, AWMC Antiquity À-la-carte).

### Cited Findings

**Pleiades (pleiades.stoa.org; ISAW/NYU and AWMC/UNC)**
- Just over 42,000 ancient places and spaces as of 2026; about 34,000 began as digitized Barrington Atlas entries, nearly 8,000 created natively, 23,000+ Barrington-derived records updated since import. — [Pleiades 2026 conference paper](https://pleiades.stoa.org/docs/papers-and-presentations/conference-paper-catching-up-with-the-daughters-of-atlas-2026-1/conference-paper-catching-up-with-the-daughters-of-atlas-2026)
- Funded by four NEH grants 2005-2019; hosted by NYU ISAW since 2008; future work needs funding it does not currently have; plans include a move from founder leadership to communal governance and an AI policy. — [Pleiades 2026 conference paper](https://pleiades.stoa.org/docs/papers-and-presentations/conference-paper-catching-up-with-the-daughters-of-atlas-2026-1/conference-paper-catching-up-with-the-daughters-of-atlas-2026)
- Data model: each Place has a stable canonical URI, prose summary, Names (any IANA-registered language/script) and bibliographic references; a place can have multiple Locations (points, polygons, competing identifications) or none; Connections ("located at/in/near") link places. — [Pleiades 2026 conference paper](https://pleiades.stoa.org/docs/papers-and-presentations/conference-paper-catching-up-with-the-daughters-of-atlas-2026-1/conference-paper-catching-up-with-the-daughters-of-atlas-2026)
- A Linked Data sidebar (launched about 2025) appears on 22,000+ place pages showing about 38,000 inbound links from 20 external sources. — [Pleiades 2026 conference paper](https://pleiades.stoa.org/docs/papers-and-presentations/conference-paper-catching-up-with-the-daughters-of-atlas-2026-1/conference-paper-catching-up-with-the-daughters-of-atlas-2026)
- Licence: content is CC BY (site states Attribution 3.0); versioned dataset dumps are published on Zenodo/GitHub (e.g. "Pleiades Datasets 4.1"). — [Zenodo Pleiades Datasets](https://zenodo.org/records/8206033/latest); [Pleiades credits](https://pleiades.stoa.org/credits)

**World Historical Gazetteer (whgazetteer.org)**
- Current release v3.2 (v1 beta launched Oct 2019); sections for Search, Workbench and Teaching; published Datasets and Collections; Swagger-documented API; a "Data licences" page exists; users can contribute and augment place records and publish collections. — [WHG About](https://whgazetteer.org/about/)
- Contributions use the Linked Places format, co-developed with Pelagios' Rainer Simon for use by both WHG and Peripleo; registration required; data cannot be edited inside WHG but datasets can be updated; contributions are linked through a "union index". — [WHG blog: Contributing preview](https://blog.whgazetteer.org/2018/06/06/contributing-to-world-historical-gazetteer-a-preview/); [WHG v2.1 guide](https://whgazetteer.org/tutorials/guide/)

**Pelagios / Peripleo**
- Original Peripleo is deprecated; the repository directs users to the successor `peripleo2`, described as a prototype search frontend to Pelagios; Peripleo was open-source software from the Mellon-funded Pelagios 3 project and exposed a map-based linked-open-data API over partners such as the British Museum and Pleiades. — [pelagios/peripleo2 on GitHub](https://github.com/pelagios/peripleo2); [ecosyste.ms listing for pelagios/peripleo](https://awesome.ecosyste.ms/projects/github.com%2Fpelagios%2Fperipleo)
- The British Library's "Locating a National Collection" project reused Peripleo as map software to visualise collection records. — [British Library LaNC](https://britishlibrary.github.io/locating-a-national-collection)
- Pelagios Network lists tools and resources for linked open geodata. — [Pelagios tools and resources](https://pelagios.org/lod/tools-resources)

**ORBIS (orbis.stanford.edu; Walter Scheidel, Elijah Meeks, Karl Grossner)**
- Interactive model estimating time and cost of travel in the Roman world by road, river and sea, with seasonal variation and transport modes, approximating conditions around 200 CE. — [Digital Classicist wiki: ORBIS](https://wiki.digitalclassicist.org/ORBIS)
- Links about 750 Roman-era sites (an aggregator site says 632; the ISAW figure is preferred). — [ISAW exhibition page](https://isaw.nyu.edu/exhibitions/space/orbis.html)
- Working paper "Version 1.0", May 2015. — [SSRN](https://papers.ssrn.com/abstract=2609654)

**Digital Atlas of the Roman Empire (DARE; Johan Åhlfeldt)**
- Now described as hosted and managed by the Centre for Digital Humanities, University of Gothenburg; older sources list Lund University (dare.ht.lu.se). Tiles served at zoom levels 4-11; map tiles available under a Creative Commons licence with attribution to DARE required; a 2017 grant funded a vector-tile version. — [AWOL: Digital Atlas of the Roman Empire](https://ancientworldonline.blogspot.com/2014/04/digital-atlas-of-roman-empire.html); [Digital Classicist wiki: DARE](https://wiki.digitalclassicist.org/Digital_Atlas_of_the_Roman_Empire); [Pelagios: Roman Empire Vector Map Tiles](https://medium.com/pelagios/roman-empire-vector-map-tiles-1e4e9e0f26fb)

**Vici.org (Archaeological Atlas of Antiquity)**
- Community-driven archaeological map "inspired by and modelled after Wikipedia"; written content reusable under CC BY-SA (images/line tracings may differ); data services and an embeddable widget; a 2014 figure gives 140+ contributors and nearly 20,000 locations (dated). — [Digital Classicist wiki: Archaeological Atlas of Antiquity](https://wiki.digitalclassicist.org/Archaeological_Atlas_of_Antiquity); [Vici.org about page](https://vici.org/about-vici.php)

**ToposText (topostext.org; Aikaterini Laskaridis Foundation; developed by Pavla SA)**
- Indexed collection of ancient texts and mapped places for Greek history and mythology, Neolithic to 2nd century CE: 5,000+ places and about 240 works in English translation; map shows places mentioned as you read; confidence levels for place coordinates; per-paragraph dates; designed as an offline-capable mobile app; "Web Version 4.0", copyright 2026. — [ToposText project page](https://topostext.org/the-project)
- Place data downloadable as KMZ, GeoJSON, RDF/Pelagios and JSON-LD "Linked Open Data files" for use with attribution to ToposText; site footer otherwise says All Rights Reserved and some translations are used by permission. — [ToposText downloads](https://topostext.org/TT-downloads); [ToposText project page](https://topostext.org/the-project)

**Ancient World Mapping Center (AWMC, UNC) tools**
- Antiquity À-la-carte (custom ancient map maker) was taken offline, announced January 2024. — [Digital Classicist wiki: Antiquity À-la-carte](https://wiki.digitalclassicist.org/Antiquity_%C3%80-la-carte)
- AWMC public map tiles (2014) were CC BY-NC 3.0; the Consortium of Ancient World Mappers (CAWM) tile set derived from them is offered under CC BY 4.0. — [AWOL: new public map tiles 2014](https://ancientworldonline.blogspot.com/2014/02/announcement-new-public-map-tiles-and.html); [AWOL: CAWM Map Tiles 2022](https://ancientworldonline.blogspot.com/2022/06/cawm-map-tiles-consortium-of-ancient.html?m=0)
- AWMC publishes GIS data (coastlines, rivers, roads, etc. for the ancient world). — [AWMC GIS data](https://awmc.unc.edu/gis-data/)

**Itiner-e (itiner-e.org; Aarhus University Center for Humanities Computing; Brughmans, de Soto, Pažout) — newer entrant**
- Aims to be "the most detailed open digital dataset of roads in the entire Roman Empire"; CC BY 4.0; nightly full export of all road segments as ndjson (GeoJSON-like LineStrings with a `pleiadesPlaces` property); static 2024 version on Zenodo; each segment has its own citable URI; edited by a scholarly community. — [Itiner-e About](https://www.itiner-e.org/about)

### Inferences
- For Bible places, the practical pattern is: store a Pleiades URI per place (stable ID + citation + CC BY data), optionally cross-reference WHG and Vici, and link out rather than re-host depth. This matches the project's "pins are cited summaries; depth lives behind links" goal.
- Pleiades coverage is the Greek/Roman world (Barrington Atlas extent), so New Testament and Roman-period Levant places are well covered; Old Testament/Bronze-Iron Age sites may be thinner. This is an inference from its Barrington origin, not a measured fact.
- DARE/CAWM tiles are raster-style period basemaps for roughly the Roman imperial era; they could serve as an optional pack-level basemap for a New Testament era but do not fit a 700 AD-today timeline.
- Funding fragility is real even for the anchor project: Pleiades has had no NEH grant since 2019 and says future work is unfunded. Storing IDs plus a local copy of the cited facts (with attribution) protects against link rot.

### Gaps
- DARMC (Harvard Digital Atlas of Roman and Medieval Civilizations): darmc.harvard.edu returned HTTP 403 and searches returned nothing usable. Unverified recollection: it is an ArcGIS-based web map with downloadable layers hosted on Harvard Dataverse, led by Michael McCormick; platform, licence and 2026 status need direct checking.
- WHG's record counts and exact data licence text were not retrieved (site guide 404; About page only links to a "Data licences" page).
- ORBIS data/code availability, licence and current maintenance status were not found; the Digital Classicist entry was last edited in 2020.
- Whether DARE's Gothenburg-hosted site is fully operational in 2026, and the exact CC variant for its tiles, were not confirmed from the primary site.
- Vici.org's current place/contributor counts, API terms and 2026 activity were not retrieved (about page 404 to the fetcher).
- Current status of Peripleo2 / the Pelagios Network's live services in 2026 was not confirmed.
- Bible-specific open datasets (e.g. OpenBible.info geocoding) were out of scope here and are presumably covered by another researcher.

## 5. Which of these show per-place certainty or scholarly citations, and which accept community edits?

### Takeaway
Explicit certainty is rare outside the scholarly gazetteers: Pleiades (uncertain/less-certain location qualifiers), ToposText (coordinate confidence levels), historical-basemaps (BORDERPRECISION 1-3) and Running Reality (hypothesis "Bubbles") are the examples found. Community editing ranges from fully open wiki (OHM, Vici, Chronas) through reviewed submission (Pleiades, Running Reality) to feedback-button-only (TimeMap) and closed editorial (Omniatlas, GeaCron).

### Cited Findings
- Pleiades certainty: locations can be qualified as "less certain" or "uncertain"; a place can hold several competing identifications or no location at all. — [Pleiades 2026 conference paper](https://pleiades.stoa.org/docs/papers-and-presentations/conference-paper-catching-up-with-the-daughters-of-atlas-2026-1/conference-paper-catching-up-with-the-daughters-of-atlas-2026)
- Pleiades citations: every place carries bibliographic references, managed through a project Zotero library; about 270 credited volunteer editors/reviewers/contributors. — [Pleiades 2026 conference paper](https://pleiades.stoa.org/docs/papers-and-presentations/conference-paper-catching-up-with-the-daughters-of-atlas-2026-1/conference-paper-catching-up-with-the-daughters-of-atlas-2026)
- Pleiades edit workflow: a new resource starts in a private "drafting" state visible only to the author, editorial college and managers; the author chooses "Submit for review"; the project describes "pervasive peer review" open to "any knowledgeable person". — [Pleiades help: better locations](https://pleiades.stoa.org/help/better-locations); [Pleiades participate](https://pleiades.stoa.org/participate)
- ToposText shows confidence levels for place coordinates; it is not community-edited. — [ToposText project page](https://topostext.org/the-project)
- Running Reality: every factoid in the "Reality" world needs a citation and is reviewed by the team; corrections "void" baseline factoids; unverified/alternate history lives in separate worlds; users can also add family histories. — [Running Reality history-research tutorial](https://runningreality.org/docs/tutorial/history.jsp); [World History Commons](https://worldhistorycommons.org/running-reality)
- historical-basemaps: per-polygon `BORDERPRECISION` (1 approximate, 2 moderately precise, 3 international law); error reports via GitHub Issues. — [GitHub aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps)
- OpenHistoricalMap: open wiki-style editing with OSM tools (iD, JOSM, Vespucci, Level0); 2,000+ contributors by Feb 2026; a quality/coverage dashboard tracks common data errors; per-feature source/licence tags. — [OSM wiki OHM News](https://wiki.openstreetmap.org/wiki/OpenHistoricalMap/News); [OHM Copyright](https://openhistoricalmap.org/copyright)
- Vici.org: Wikipedia-style community editing. — [Digital Classicist wiki: Archaeological Atlas of Antiquity](https://wiki.digitalclassicist.org/Archaeological_Atlas_of_Antiquity)
- Chronas: every registered user can curate and contribute; revision system for edits. — [AlternativeTo](https://alternativeto.net/software/chronas-org/about); [eLearning Inside](https://news.elearninginside.com/chronas-map-of-history-50-million-data-points/)
- TimeMap.org: citations are effectively the embedded Wikipedia articles; corrections go through an in-app Feedback button; users can upload scanned maps with a free account, not edit borders. — [Hacker News](https://news.ycombinator.com/item?id=42397550); [Mental Floss](https://www.mentalfloss.com/geography/maps/explore-world-history-interactive-map)
- WHG: contributions are whole datasets uploaded by registered users in Linked Places format, not in-place edits. — [WHG v2.1 guide](https://whgazetteer.org/tutorials/guide/)
- Itiner-e: per-segment citable URIs; edited by a scholarly community. — [Itiner-e About](https://www.itiner-e.org/about)
- Chronoscope links every data source inside the app. — [HN Showcase](https://hnshowcase.com/post/47348772/i-built-chronoscope-because-google-maps-won-t-let-you-visit-)
- Omniatlas: single author with credited contributors; sources acknowledged at site level (Wikipedia, Britannica), no open editing described. — [Omniatlas About](https://test.omniatlas.com/about/)

### Inferences
- A per-pin certainty badge plus per-claim sources, delivered through reviewed pull requests, sits between Pleiades (reviewed submissions, certainty qualifiers) and Running Reality (mandatory citation per factoid). No mass-market timeline map (TimeMap, Chronas, GeaCron) shows certainty on the map, so this is a real differentiator.
- Pleiades' three-level vocabulary (certain / less certain / uncertain) is an established scholarly precedent that could be adopted directly for the badge wording.
- Pleiades' "draft, then submit for review" flow is the same shape as a GitHub pull request; pointing to it is a credible justification for the PR-based editing model.

### Gaps
- Unverified recollection: Pleiades also records "association certainty" on name/location links and positional accuracy assessments on locations; the 2026 paper fetched did not discuss these, so confirm on a Pleiades place page.
- Whether GeaCron, TimeMaps or HistoryMaps show any citations or certainty indicators was not found.
- How Itiner-e encodes certainty per road segment (it is known for distinguishing confirmed vs. conjectured routes) was not stated on the About page fetched.

## 6. What do users praise or criticize (clutter, accuracy, speed, paywalls)?

### Takeaway
Users reward the simple "one slider, click for Wikipedia" experience and punish wrong or anachronistic borders, blank regions, modern coastlines, overlapping markers, sluggishness and broken sliders on mobile. Paywalls exist but are mild (GeaCron US$45, TimeMaps premium units, Centennia US$89); the dominant complaints are about accuracy and discoverability, not price.

### Cited Findings
- Praise for TimeMap.org: "Really amazing site. I could spend hours on it."; "Excellent UI and very fun to explore"; embedding Wikipedia called "super smart"; several commenters said they had long wanted such a tool. — [Hacker News](https://news.ycombinator.com/item?id=42397550)
- Accuracy complaints (TimeMap.org): Portuguese territories shown under Spain in 1580; Macau dates off; "Kingdom of Spain" from 1479 called anachronistic; Grand Duchy of Lithuania dates not matching Wikipedia; Taiwan/"Republic of China" labelling disputed; missing states (Frisia, Urartu, 1917-1921 Ukraine); Kalmar Union borders absent; Catalonia and Canary Islands misrepresented. — [Hacker News](https://news.ycombinator.com/item?id=42397550)
- Coverage complaints: North America blank before 1607; Australia starting around 1860; requests for Indigenous territories (native-land.ca suggested); one commenter argued blank areas imply that places without recorded states did not matter. — [Hacker News](https://news.ycombinator.com/item?id=42397550)
- Design complaints: modern coastlines at all dates; contested territories not shown; cities shown before founding; no hierarchy view (e.g. duchies within the Holy Roman Empire); overlapping battles/POIs hard to distinguish; clunky sidebars. — [Hacker News](https://news.ycombinator.com/item?id=42397550)
- Speed/bugs: "seems a bit slow"; a 500 error every 30 seconds for one user; slider failing on small viewports and some Firefox setups; no pinch zoom on mobile; a click redirecting the whole page to Wikipedia; Feedback button hidden by uBlock Origin. — [Hacker News](https://news.ycombinator.com/item?id=42397550)
- Running Reality: praised as open-access and useful for classroom discussion and geographic analysis; criticised because its breadth makes it hard to know where to start or find specific information. — [World History Commons](https://worldhistorycommons.org/running-reality)
- Chronas: educator notes the data-set exploration option is "somewhat hidden". — [Free Technology for Teachers](https://freetech4teach.teachermade.com/?p=14522)
- GeaCron: free tier limited in zoom with ads; "sometimes the map takes a little bit to load". — [AlternativeTo GeaCron](https://alternativeto.net/software/geacron/about)
- HistoryMaps: one Product Hunt review, 1/5. — [Product Hunt](https://www.producthunt.com/products/historymaps/reviews)
- TimeMaps: premium tier aimed at teachers; reviews mostly from educators. — [timemaps.com](https://timemaps.com/)
- historical-basemaps maintainers themselves warn the borders need verification before academic use and that a third-party app built on it ("Point in History") was displaying errors. — [GitHub aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps)
- New Wikidata-scrape entrants attract little engagement: Globe of History's Show HN got 3 points and no comments; Chronoscope got 11 points and 5 comments. — [Hacker News](https://news.ycombinator.com/item?id=45738662); [HN Showcase](https://hnshowcase.com/post/47348772/i-built-chronoscope-because-google-maps-won-t-let-you-visit-)

### Inferences
- Border errors are the single biggest reputational risk for any timeline map, and a demo audience will look at its own country first. With a handful of snapshot years from an "approximate" dataset, the UI should label borders as approximate and dated, and keep them visually secondary to the pins.
- The praised pattern (one slider, minimal chrome, click opens a panel with a sourced summary and outbound link) is the same as the project's goals 1-3; the criticised patterns (overlapping markers, clunky multiple sidebars, hidden options) are what goal 1 forbids.
- "Too broad to know where to start" (Running Reality) and "hidden options" (Chronas) suggest a narrow, opinionated default view with search is a strength, not a limitation.
- Mobile and Firefox slider failures were called out publicly even for a well-funded product; a quick cross-browser check of the scrubber is cheap insurance before a demo.

### Gaps
- No Reddit threads (r/MapPorn, r/history, r/AskHistorians, r/gis) were retrieved; search results did not surface them, so Reddit sentiment is unrepresented here.
- No digital-humanities journal article comparing these products' usability was found; the 2019 Society for Classical Studies review of ORBIS (Palladino) and the SCS review of ToposText exist but were not read.
- User sentiment for OpenHistoricalMap, Omniatlas, Vici.org, Pleiades and WHG specifically (speed, clutter) was not found.
