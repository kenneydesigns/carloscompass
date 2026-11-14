# New entrants (2023–2026) and the open data layer for Bible geography

Research date: 2026-11-13. GitHub figures (stars, created/pushed dates, licence) were read from the public GitHub REST API on that date; "pushed" is the last push to any branch. README statements are the projects' own claims and were not independently tested. Excluded by instruction: KronAtlas, Summit.

## 1. What new Bible map / Scripture geography products launched or relaunched in 2023–2026, and which use AI?

### Takeaway
The long tail is busy but tiny: a wave of 2025–2026 solo-developer apps and sites, nearly all built on the same OpenBible.info geocoding data, with almost no measurable traction (0–40 GitHub stars, App Store listings without enough ratings to display). The AI-using ones split into two patterns: (a) live AI chat/explanations inside a Bible app with a small map bolted on (Kerygma, Cardinal Bible, kjvstudy.org), and (b) AI used to draft or extract content that is then checked against a gazetteer or sources (History Globe, Bible Journeys); pattern (b) is the same stance as Carlo's Compass.

### Cited Findings

**History Globe (historyglobe.app)** — closest analogue found
- Maker Vadym Arnaut; repo created 2026-09-28, last push 2026-11-09, 2 stars. Free web 3D globe, no accounts, ads or fees. — [GitHub API](https://api.github.com/repos/ArVaViT/history-globe); [README](https://github.com/ArVaViT/history-globe)
- Contents as of its 2026-10-25 release: 21 languages (incl. Italian, Spanish, Portuguese, Polish), 1,231 Bible places with verses and their own pages, 746 place articles, 54 tours, 329 dated events, 57 battles, 2,994 people (from STEPBible TIPNR), state borders by year 3500 BC–AD 1300 (Cliopatria), Roman roads (Itiner-e), 320 photographs. — [README](https://github.com/ArVaViT/history-globe)
- Time slider moves borders, cities, roads, journeys and battles; disputed places show candidate sites. — [README](https://github.com/ArVaViT/history-globe)
- AI and accuracy: articles, tours and events are "drafted by the author with the assistance of large language models and then checked against their sources in separate review passes"; these are stated to be the project's own checks, not peer review. Specialist reviews are published by name (Juan Manuel Tebes reviewed five articles); every other article page says it has not been read by a historian. — [README](https://github.com/ArVaViT/history-globe)
- Publishes a list of errors it found in upstream datasets (`docs/crosswalk/their-errors.md`) and a crosswalk to OpenBible, Wikidata, Pleiades, TIPNR and Theographic. — [README](https://github.com/ArVaViT/history-globe)
- Licences: data CC BY 4.0; articles CC BY-NC-ND 4.0; code "all rights reserved; public to read". Static JSON API with no key, plus a Hugging Face dataset. — [README](https://github.com/ArVaViT/history-globe); [API docs](https://historyglobe.app/docs/api.html)

**biblical-atlas (biblical-atlas.geiser.cloud)** — Spanish, sourced, plain-file data
- Maker GeiserX; repo created 2020-04-29, last push 2026-11-06, 11 stars, GPL-3.0-or-later. — [GitHub API](https://api.github.com/repos/GeiserX/biblical-atlas)
- Spanish-language map plus timeline driven by a single date ("eliges un año y ves quién vivía, dónde estaba"), covering Adam to John on Patmos; people graph where each edge carries its verb and supporting passage; four guided tours; reading and presentation modes. — [README](https://github.com/GeiserX/biblical-atlas)
- Uncertain places are drawn as zones or candidates, "never as a sure point"; every fact carries its linked source, reason and date consulted; a public research log lists each claim. — [README](https://github.com/GeiserX/biblical-atlas)
- Stack: static site with MapLibre GL, no server and no build step; data is one YAML file per entity in `data/`; CI validates the data; also exported as SQLite. Own maps built from Natural Earth and OpenBible. — [README](https://github.com/GeiserX/biblical-atlas)
- Companion MCP server exposing people, places, events and passages "each with its source, as tools for AI agents" (Go, MIT, created 2026-09-30, 2 stars). — [GitHub API](https://api.github.com/repos/GeiserX/biblical-atlas-mcp)

**Bible Journeys (jamesburrow23/bible-journey)** — AI-generated journeys
- User pastes a chapter; Google Gemini (with Google Search grounding and structured output) extracts stops in narrative order with summaries, verse references and waypoints, drawn as an animated route on a parchment-styled MapLibre GL map. Vue 3 + TypeScript + Vite, no backend; users bring their own API key. — [README](https://github.com/jamesburrow23/bible-journey)
- Accuracy handling: a bundled gazetteer of 1,335 places distilled from OpenBible.info supplies coordinates and confidence; unmatched places fall back to the model and are badged "? model guess"; verse references are checked against known mentions and flagged on mismatch; badges distinguish verified, AI-guessed and user-set coordinates. — [README](https://github.com/jamesburrow23/bible-journey)
- Repo created 2026-08-23, 0 stars, no licence file. — [GitHub API](https://api.github.com/repos/jamesburrow23/bible-journey)

**Cardinal Bible (iOS)**
- Bible reader with 16 mapped "Journeys" on 3D satellite maps (Paul's voyages, Abraham, Exodus, Passion Week) with narration at each stop; Journeys are free. — [faith.tools](https://faith.tools/app/cardinal-bible)
- Free; Pro at $2.99/month or $19.99/year; Pro AI runs on Anthropic's Claude models and prompts leave the device. — [Learn of Christ review](https://learnofchrist.com/resources/cardinal-bible)
- Launch date: one search summary of the review gave an App Store record date of January 28, 2026; a second search could not confirm it and the review page itself returned HTTP 429 when fetched. Treat the date as unverified. — [Learn of Christ review](https://learnofchrist.com/resources/cardinal-bible)

**Kerygma – Bible Explained (iOS, Catholic)**
- Developer Ange Rodriguez; free with Kerygma+ at $1.99/week, $4.99/month or $29.99/year; languages English, French, Italian, Polish, Portuguese, Spanish; includes the deuterocanonical books. — [App Store](https://apps.apple.com/app/id6762185288)
- Biblical Atlas maps "over 100 locations connected to the Bible and Christianity" (ancient cities, apostolic routes, Christian heritage sites) with passages linked to each. — [App Store](https://apps.apple.com/app/id6762185288)
- AI: generated passage explanations and a "Kerygo" chat companion said to be "grounded in Scripture and Tradition"; five free questions. No rating overview is shown (too few ratings). Version 1.0 dated May 2 and version 12.0 in November (year not shown on page; 12 major versions in about six months). — [App Store](https://apps.apple.com/app/id6762185288)

**kjvstudy.org**
- Kenneth Reitz; FastAPI + Tufte CSS KJV study platform with AI commentary; repo created 2025-05-26, last push 2026-07-08, 39 stars, ISC licence. — [GitHub API](https://api.github.com/repos/kennethreitz/kjvstudy.org)
- Added an interactive map of biblical locations in 2025, first as SVG and then replaced by Leaflet with OpenStreetMap tiles; filters for Old Testament, New Testament and Paul's journeys. — [commit](https://git.kennethreitz.org/kennethreitz/kjvstudy.org/commit/5b8fbe430c58b6178df9da94bedae448e11ef654)

**Other small products seen (thin evidence, listed for completeness)**
- Bible Atlas: Journeys (Android, dev.duolabs.biblemap): 15 journeys and 82 places; listing updated 2026-09-28. — [Google Play](https://play.google.com/store/apps/details?id=dev.duolabs.biblemap&hl=en)
- Verse: Product Hunt launch, visual Bible reader with AI illustrations and interactive maps of biblical locations. — [Product Hunt](https://www.producthunt.com/posts/verse-5)
- BibleOne AI: "Christian super app" with a map page claiming every significant location Genesis to Revelation. — [bibleone.in/maps](https://bibleone.in/maps)
- Bibleo: roadmap lists animated journeys of Jesus, Paul and Moses; web app live, mobile apps in store review at time of page. — [Bibleo roadmap](https://bibleo.ai/en/roadmap)
- Prism Bible: journeys map page. — [prismbible.app](https://prismbible.app/map/journeys)
- An interactive map of Paul's travels with a Roman-roads/modern toggle was posted to Hacker News by user "intofarlands". — [HN mirror](https://frontpage-app.vercel.app/newest/45023071)
- interactive-bible-app (RW2523): local-first app with offline atlas and timeline plus an "AI Sermon Studio"; only AI calls go to Gemini; MIT, created 2026-09-21, 0 stars. — [GitHub API](https://api.github.com/repos/RW2523/interactive-bible-app)

### Inferences
- No new entrant found has both real traction and a rigorous citation model. The two that take sourcing seriously (History Globe, biblical-atlas) have 2 and 11 stars; the ones with commercial polish (Cardinal, Kerygma) put AI chat in front of the user and treat maps as a side feature.
- "AI drafts, humans review, and the page says who reviewed it" already exists in the wild (History Globe). Its labelling of every unreviewed article is a direct precedent for Carlo's Compass review badges.
- The provenance-badge pattern in Bible Journeys (verified / model guess / user-set) is a compact way to show location certainty on a pin.
- None of the new entrants found combines Bible places with Eucharistic miracles or any Catholic pack concept; Kerygma is the only Catholic-framed one and its atlas is small (about 100 places).
- 3D globes are the fashionable choice (History Globe, Cardinal, Atlas of Scripture, Yahweh's World); a calm 2D map-first product is a differentiator rather than a gap.

### Gaps
- Product Hunt, Indie Hackers and Kickstarter were only reachable through general web search; no vote counts, launch dates or funding figures were retrieved. Verse's launch date is unknown.
- No download or rating numbers were obtained for any app (the Google Play page did not render; App Store showed none for Kerygma).
- Cardinal Bible launch date unverified (see above).
- No faith-tech press coverage (FaithTech, Christianity Today) of any of these was found in this pass; that absence is itself a signal of low visibility but was not searched exhaustively.

## 2. Which open-source repositories implement an interactive Bible map or timeline, how active are they, and what stacks do they use?

### Takeaway
GitHub search for "bible map / bible atlas / biblical places / bible timeline map" returns dozens of repos, but almost all were created in 2025–2026, have 0–2 stars and a single author; the only repos with meaningful stars are data projects (Theographic 370, OpenBible geocoding 143) and one stale 3D globe (EarthViewer, 19 stars, last push 2018). MapLibre GL has displaced Leaflet in the newer ones, and CesiumJS or custom canvases are used for globes.

### Cited Findings
Stats from [GitHub repository search](https://api.github.com/search/repositories?q=bible+atlas&sort=stars) and per-repo API calls on 2026-11-13.

| Repo | Stars | Created / last push | Licence | Stack and notable design |
|---|---|---|---|---|
| [GeiserX/biblical-atlas](https://github.com/GeiserX/biblical-atlas) | 11 | 2020-04 / 2026-11-06 | GPL-3.0 | MapLibre GL static site, YAML per entity, CI data validation, per-claim sources |
| [ArVaViT/history-globe](https://github.com/ArVaViT/history-globe) | 2 | 2026-09 / 2026-11-09 | data CC BY 4.0, code all rights reserved | 3D globe, TypeScript, static JSON API |
| [atlasofscripture/atlas](https://github.com/atlasofscripture/atlas) | 2 | 2026-04-26 / 2026-04-26 | not asserted | CesiumJS globe, YAML data folders (people, places, events, journeys, sources), "contention layer" |
| [SuyangLiuPaul/Yahwehs-World](https://github.com/SuyangLiuPaul/Yahwehs-World) | 2 | 2026-09 / 2026-11-04 | none | Bilingual Chinese/English 3D globe, procedurally painted parchment basemap, no tiles |
| [lineabuildsclaws/bible-map](https://github.com/lineabuildsclaws/bible-map) | 0 | 2026-08 / 2026-10-01 | MIT (data CC BY 4.0) | "Calm" 2D atlas, static GeoJSON, zoom thresholds by mention count |
| [jeroen-leverman/bible-timeline](https://github.com/jeroen-leverman/bible-timeline) | 0 | 2026-08-22 / 2026-08-24 | none | Timeline + map + family tree; 239 events, 149 places, 50 routes |
| [jamesburrow23/bible-journey](https://github.com/jamesburrow23/bible-journey) | 0 | 2026-08-23 | none | Vue 3, MapLibre GL, Gemini extraction |
| [robertrouse/theographic-web](https://github.com/robertrouse/theographic-web) | 37 | 2018 / 2026-11-14 UTC | GPL-3.0 | TypeScript linked encyclopedia over Theographic |
| [EarthViewer/bible-atlas](https://github.com/EarthViewer/bible-atlas) | 19 | last push 2018-08-26 | MIT | 3D virtual globe of the Holy Land; dormant |
| [BenShelton/timeline-of-everything](https://github.com/BenShelton/timeline-of-everything) | 9 | last push 2026-01-28 | MIT | TypeScript Bible timeline (events, characters, prophecies) |
| [kennethreitz/kjvstudy.org](https://github.com/kennethreitz/kjvstudy.org) | 39 | 2025-05 / 2026-07-08 | ISC | FastAPI, Leaflet + OSM |

- Design details worth copying, from READMEs:
  - lineabuildsclaws/bible-map shows major landmarks first using Bible-mention thresholds and defers obscure places to close zoom; explains feature type, confidence, modern association, references, source and alternative proposals; treats Sodom and Gomorrah as competing candidate regions; plots 1,278 records and lists 7 recognised-but-unlocatable ones. — [README](https://github.com/lineabuildsclaws/bible-map)
  - Yahweh's World reports that 740 of 1,332 located places (55%) have more than one rival scholarly identification in the OpenBible data, and labels them; 10 of 1,342 ancient places resolve to no coordinates and are kept under `unlocated`. Its timeline steps through 5,582 verses in canonical order rather than years, because "OpenBible carries no dates at all" and chronology is contested (Exodus c. 1446 BC vs c. 1270 BC). — [README](https://github.com/SuyangLiuPaul/Yahwehs-World)
  - jeroen-leverman/bible-timeline labels each date by origin (age stated in scripture; year chained from stated ages; estimated from external evidence; no date given) and notes that carrying two chronologies at once produced an impossible genealogy. — [README](https://github.com/jeroen-leverman/bible-timeline)
  - Atlas of Scripture is explicitly "Phase 0 — Scaffold" with sample data only for Paul's first journey; one day of commits. — [README](https://github.com/atlasofscripture/atlas)
- Other zero- or one-star 2025–2026 repos surfaced by search: loganrector1/bible-timeline, criscfer/bible-mappedia, sarahw6/bible-world-explorer, RhitCE/view.bible, JadenB9/scripturestack, cainmenard/bible-atlas, raboriel/BibleTrip, dentalking/bible-map-01 (Korean), ZiemerLabs/biblebridge (WordPress plugin with "Scripture Atlas", GPL-2.0). — [GitHub search](https://api.github.com/search/repositories?q=bible+timeline+map&sort=stars)
- Eucharistic miracles on GitHub: about a dozen repos, all 0–1 stars, mostly Next.js/TypeScript UIs with no licence; e.g. cast-iron-developer/eucharistic-miracles ("continuing the work of Bl. Carlo Acutis", last push 2025-03), michaelMondoro/eucharistic_miracles_api (2022), thsmale/eucharistic-miracles-ui (2026-05). — [GitHub search](https://api.github.com/search/repositories?q=eucharistic+miracles&sort=stars)

### Inferences
- The burst of near-identical repos created in Aug–Nov 2026 suggests AI coding tools have made "OpenBible data on a map" a weekend project. Differentiation now comes from curation, citations, review process and design, not from having a map.
- No open-source project found offers a reusable engine with swappable content packs; each hard-codes its own content. Goal 5 of Carlo's Compass is unoccupied ground.
- No well-maintained, openly licensed, structured Eucharistic miracles dataset was found on GitHub; the Carlo's Compass dataset could be the first with coordinates, sources and a licence.
- biblical-atlas is the nearest architectural match (plain YAML per entity, CI validation, per-claim source, uncertain places as zones) and is worth reading before finalising the data schema. Its GPL-3.0 licence matters if any code is borrowed.

### Gaps
- GitLab and Codeberg were not searched.
- Repo activity beyond last-push date (commit counts, contributors, issues) was not collected except where a README stated it.
- AlexLamper/scripture, mentioned in a search summary as a gamified Bible app with a map, returned Not Found from the GitHub API (deleted, renamed or private).

## 3. What open datasets exist, under what licences, and with what fields?

### Takeaway
OpenBible.info's Bible Geocoding Data (CC BY 4.0) is the de facto base layer for places and uncertainty, and Theographic (CC BY-SA 4.0) for people, events and dates; STEPBible TIPNR (CC BY 4.0) covers proper names. Licence mixing needs care: CC BY-SA sources (Theographic, ACAI, Biblica maps, Gnosis) and GPL-3.0 historical-basemaps impose share-alike on derived data, while OpenBible and STEPBible only need attribution.

### Cited Findings

**OpenBible.info Bible Geocoding Data**
- Repo openbibleinfo/Bible-Geocoding-Data: 143 stars, 29 forks, CC-BY-4.0, created 2021-10-31; GitHub reports last push 2021-11-01 and 3 commits. — [GitHub API](https://api.github.com/repos/openbibleinfo/Bible-Geocoding-Data); [repo](https://github.com/openbibleinfo/Bible-Geocoding-Data)
- Files (JSON Lines): `ancient.jsonl` (places as the Bible names them: `identifications`, `score`, `resolutions`, `linked_data` with Wikidata, Pleiades and TIPNR ids, `verses`, `translations`, `modern_associations`), `modern.jsonl` (`lonlat`, `geometry`, `class`, `type`, `precision`, `accuracy_claims`, `coordinates_source`, `names`, `ancient_associations`), `geometry.jsonl` (paths, polygons, isobands, rough boundaries, suggested label lines), `image.jsonl` (licence and credit per image), `source.jsonl`. — [repo](https://github.com/openbibleinfo/Bible-Geocoding-Data)
- Confidence model: each identification has `vote_average`, `vote_count`, `vote_total`, built from tagged source votes ranging from `confidence_yes` (+30) to `confidence_no` (−20); a total of 500 or more indicates high confidence. Time-weighted scores bin sources into six periods (1969 and earlier to 2010 onward) so newer scholarship counts; `time_total` drives ranking. — [repo](https://github.com/openbibleinfo/Bible-Geocoding-Data)
- Built from over 70 modern sources (commentaries, dictionaries, encyclopedias, atlases), over 400 unique sources cited; names from ten English translations. — [repo](https://github.com/openbibleinfo/Bible-Geocoding-Data)
- Licence caveats: data CC BY 4.0; some geometry from OpenStreetMap under ODbL 1.0; image licences vary (about 1,000 Wikimedia Commons photos, the rest Sentinel-2 satellite thumbnails). — [repo](https://github.com/openbibleinfo/Bible-Geocoding-Data)
- Size per a downstream user: 1,342 ancient places, 1,596 modern places, 5,616 verse references. — [Yahweh's World README](https://github.com/SuyangLiuPaul/Yahwehs-World)
- Limits: Protestant canon only ("every place mentioned in the Protestant Bible"); carries no dates. — [repo](https://github.com/openbibleinfo/Bible-Geocoding-Data); [Yahweh's World README](https://github.com/SuyangLiuPaul/Yahwehs-World)

**Theographic Bible Metadata (Viz.Bible, Robert Rouse)**
- 370 stars, 91 forks, CC-BY-SA-4.0, created 2012, pushed 2026-11-14 UTC (actively maintained). — [GitHub API](https://api.github.com/repos/robertrouse/theographic-bible-metadata)
- Tables: 31,102 KJV verses linked to entities; 3,067 people (family relations, birth/death places and years); 1,298 places (coordinates, feature types, gazetteer links, other names, part-of); 450 events (dates, durations, predecessors, participants, locations); 23 people groups; 6,519 Easton's dictionary entries. — [README](https://github.com/robertrouse/theographic-bible-metadata)
- Formats: JSON (preferred), CSV, GeoJSON in Linked Places format (`bible-places.geojson`, Paul's journeys), Neo4j Cypher, live GraphQL API. — [README](https://github.com/robertrouse/theographic-bible-metadata)
- Now ships a versioned data-quality ledger (`data-quality/issues.yaml`) and corrections log, and a data-correction issue template. — [README](https://github.com/robertrouse/theographic-bible-metadata)
- Chronology follows Floyd Nolen Jones, *The Chronology of the Old Testament* (a single, Ussher-style conservative chronology). — [README](https://github.com/robertrouse/theographic-bible-metadata)

**STEPBible Data (Tyndale House, Cambridge)**
- 219 stars, 65 forks, pushed 2026-11-02; description: "available to other projects under CC BY 4.0". Top-level folders include "Proper Nouns" (TIPNR: people and places), Lexicons, Tagged-Bibles, Versification. — [GitHub API](https://api.github.com/repos/STEPBible/STEPBible-Data); [repo](https://github.com/STEPBible/STEPBible-Data)
- Used as the people source (2,994 people) by History Globe. — [History Globe README](https://github.com/ArVaViT/history-globe)

**ACAI (Mission Mutual / Bible Aquifer; contact Rick Brannan)**
- Annotates people, places, deities, groups, fauna, flora, realia and key terms at word/phrase level in the original languages; CC BY-SA 4.0; JSON, one file per record; labels and descriptions localised in English plus 18 languages. Repo created 2024-10-11, pushed 2026-11-07, 17 stars. — [repo](https://github.com/BibleAquifer/ACAI); [GitHub API](https://api.github.com/repos/BibleAquifer/ACAI)
- The README summary did not mention coordinate fields. — [repo](https://github.com/BibleAquifer/ACAI)

**Biblica Open Bible Maps**
- Colour Bible maps under CC BY-SA 4.0, credit to Biblica required; hosted on STEPBible and Free Bible Images. — [STEPBible](https://www.stepbible.org/html/biblica_maps.html); [Free Bible Images](https://www.freebibleimages.org/contributors/biblica/)
- Packaged as a Bible Aquifer resource repo (created 2026-03-07, pushed 2026-09-18, 8 stars). — [GitHub API](https://api.github.com/repos/BibleAquifer/BiblicaOpenBibleMaps)

**Bible Mapper (David Barrett)**
- A secondary source says maps made with Bible Mapper are copyright-free and usable in papers, lectures, websites and publications; no formal licence text from Barrett was found. — [BiblePlaces blog](https://bibleplaces.com/blog/tag/resources/page/68)
- With version 3.0 the program became free but support was discontinued (as reported in a search summary of a secondary source). — [Precious Seed](https://preciousseed.org/articles/bible-bytes-biblical-maps)

**Historical borders**
- aourednik/historical-basemaps: 883 stars, GPL-3.0, pushed 2026-11-02; georeferenced boundaries of countries and cultural regions for historical mapping at global or continental scale. — [GitHub API](https://api.github.com/repos/aourednik/historical-basemaps)
- Cliopatria (Seshat Global History Databank): geospatial dataset of states, political groups, events and rulers 3400 BCE–2024 CE; 82 stars, created 2024-08, pushed 2026-10-03; licence not detected by GitHub. History Globe uses it "corrected for the lands of the Bible". — [GitHub API](https://api.github.com/repos/Seshat-Global-History-Databank/cliopatria); [History Globe README](https://github.com/ArVaViT/history-globe)

**Aggregators and other**
- Gnosis (spearssoftware): merges 11 open sources incl. Theographic and OpenBible into JSON + SQLite releases (people, places with coordinates, events, verse index, about 340k cross-references); CC BY-SA 4.0; created 2026-03, pushed 2026-10-14, 1 star. — [README](https://github.com/spearssoftware/gnosis)
- History Globe open data: CC BY 4.0 static JSON API and Hugging Face dataset, with a crosswalk across OpenBible, Wikidata, Pleiades, TIPNR, Theographic. — [README](https://github.com/ArVaViT/history-globe)
- Pleiades dataset exports: isawnyu/pleiades.datasets, 54 stars, pushed 2026-11-13 (updated continuously). — [GitHub API](https://api.github.com/repos/isawnyu/pleiades.datasets)
- scrollmapper/bible_databases: Bible texts and cross-reference databases, MIT, 1,731 stars, pushed 2026-10-24 (text layer, not geography). — [GitHub API](https://api.github.com/repos/scrollmapper/bible_databases)
- BYU "The Scriptures, Mapped" notes that many geocoded Bible placenames are "somewhat speculative". — [scriptures.byu.edu](https://scriptures.byu.edu/mapscrip/)

### Inferences
- Recommended base for Carlo's Compass: OpenBible for coordinates and certainty (attribution only), Theographic for people/events (share-alike: keep it in a separately licensed pack file or accept CC BY-SA for the pack data), STEPBible TIPNR for name disambiguation.
- OpenBible's vote totals map cleanly onto a 3-level certainty badge (for example: total of 500 or more = high; single dominant candidate below that = probable; multiple rival identifications = disputed). The thresholds below 500 would be the project's own choice.
- Deuterocanonical places (Tobit, Judith, 1–2 Maccabees) are not in OpenBible (Protestant canon) and Theographic is KJV-based. A Catholic pack must add them by hand; this is both a gap and a distinguishing contribution.
- OpenBible supplies no dates and Theographic supplies one conservative chronology. A timeline scrubber needs either era buckets or year ranges with stated chronology; several new projects chose ranges or canonical order to avoid taking a side.
- The OpenBible repo shows no pushes since 2021-11-01 on GitHub. The brief's "2023+ version" could not be confirmed from the repository metadata; the confidence/vote model described above is what the current repo README documents.

### Gaps
- Pleiades, Wikidata and AWMC licence terms and field lists were not fetched in this session (GitHub reports no detected licence for the Pleiades export repo). Verify before use.
- Cliopatria's exact licence was not retrieved.
- STEPBible TIPNR field-level schema was not read; only the folder listing and licence statement.
- Whether OpenBible.info publishes newer data on its website than in the GitHub repo was not checked.
- Access Foundation maps were not researched.

## 4. Academic and digital-humanities Bible geography projects with interactive maps

### Takeaway
The main academic interactive atlas found is UCSD's Digital Archaeological Atlas of the Holy Land (DAAHL), which is large but dated in technology; little else was reached in this pass.

### Cited Findings
- DAAHL is a project of the GAIA Lab with CISA3 at the Qualcomm Institute, UCSD, covering Israel, Palestine, Jordan, southern Lebanon, Syria and Sinai; part of the MedArchNet network of Mediterranean archaeological atlases. — [DAAHL About](https://daahl.ucsd.edu/DAAHL/AboutAtlas.php)
- Map sheets were converted into more than 50,000 tiles in a Google Maps interface with sites overlaid; users can query sites by period and by site/feature type; an "Empires" view animates empires over time with sites of each period. — [DAAHL Home](https://daahl.ucsd.edu/DAAHL/Home.php); [DAAHL GML](https://daahl.ucsd.edu/DAAHL/GML.php)
- The Israel Antiquities Authority provided about 18,500 site records from the Survey of Israel database to DAAHL. — [UC San Diego Today](https://today.ucsd.edu/story/new_center_for_cyber_archaeology_and_sustainability_partners_with_israel_an)
- A MedArchNet page on the same server currently displays raw PHP notices (XAMPP path visible in the page title), a sign of an unmaintained deployment. — [daahl.ucsd.edu/gaialab/MedArchNet](https://daahl.ucsd.edu/gaialab/MedArchNet)
- BYU's "The Scriptures, Mapped" is a university-hosted scripture-to-map tool that reuses Bible geocoding data. — [scriptures.byu.edu](https://scriptures.byu.edu/mapscrip/)
- Specialist involvement in a new product: archaeologist Juan Manuel Tebes reviewed five History Globe articles on Edom and the Arabah. — [History Globe README](https://github.com/ArVaViT/history-globe)

### Inferences
- Academic atlases hold deep archaeological site data but are not verse-linked or beginner-friendly; they are better used as "primary/scholarly source" link targets on pin cards than as competitors.

### Gaps
- Bible Odyssey (SBL), the IAA survey map site, Madaba map digital projects, and other university labs were not researched in this pass; DAAHL's current feature set and uptime were not tested directly.

## 5. Non-English products, especially Catholic ones

### Takeaway
No dedicated Catholic interactive Bible atlas was found in Italian, Spanish, Portuguese, Polish or Korean; the non-English offerings found are multilingual indie projects and one Spanish open-source atlas.

### Cited Findings
- Italian: the search surfaced only print or older items — the San Paolo *Atlante Biblico* (print, 24 chapters) and the Saxum Foundation's *Portico della Bibbia* (book with 16 maps from the Oxford Bible Atlas, tied to a visitor centre with touchscreens). — [SOBICAIN](https://www.sobicain.org/en/?p=16643); [Opus Dei](https://opusdei.org/it/article/portico-della-bibbia-una-porta-daccesso-alla-bibbia/)
- Spanish: biblical-atlas (GeiserX) is entirely in Spanish, aimed at family Bible study, with every fact sourced. — [README](https://github.com/GeiserX/biblical-atlas)
- Chinese: Yahweh's World is bilingual Simplified Chinese/English and states that the five atlases it compared are all English-only. — [README](https://github.com/SuyangLiuPaul/Yahwehs-World)
- Korean: a small repo, dentalking/bible-map-01, describes a Bible persons journey map with timeline (0 stars, last push 2025-09-25). — [GitHub search](https://api.github.com/search/repositories?q=bible+timeline+map&sort=stars)
- Multilingual: History Globe ships 21 languages including Italian, Spanish, Portuguese and Polish; Kerygma (Catholic) ships English, French, Italian, Polish, Portuguese, Spanish. — [History Globe README](https://github.com/ArVaViT/history-globe); [App Store](https://apps.apple.com/app/id6762185288)
- Jehovah's Witnesses publish a multilingual online Bible atlas ("See the Good Land"). — [jw.org](https://www.jw.org/ase/bible-teachings/bible-study-tools/see-good-land/)

### Inferences
- A Catholic, Italian-capable interactive Bible map appears to be open ground, which fits the Carlo Acutis framing; keeping display text in pack files would make translation cheap later.

### Gaps
- Searches were run through a US-only engine and returned mostly English results; native-language app stores and Korean/Polish/Portuguese sites were not reached. Absence here is weak evidence.

## 6. Which projects failed or shut down, and why?

### Takeaway
Few documented shutdowns were found; the observable failure mode is quiet abandonment (single-author repos with one burst of commits, unmaintained university servers) rather than announced closures.

### Cited Findings
- Biola's Unbound Bible project was discontinued, citing maintenance costs. — [unbound.biola.edu](https://unbound.biola.edu)
- GMI, a missions map maker, closed in 2017 as donor funding shifted (missions mapping, not Bible geography). — [Christianity Today](https://www.christianitytoday.com/2017/04/gmi-mission-map-maker-folds-donor-shifts/)
- Legacy Biblearc was shut down in favour of a new Biblearc platform. — [Biblearc](https://equip.biblearc.com/blog-post/legacy-biblearc-shutdown--new-biblearc-updates)
- EarthViewer/bible-atlas (19 stars) has had no push since 2018-08-26. — [GitHub search](https://api.github.com/search/repositories?q=bible+atlas&sort=stars)
- Atlas of Scripture's only commits are from a single day (created and last pushed 2026-04-26) despite an ambitious roadmap. — [GitHub API](https://api.github.com/repos/atlasofscripture/atlas)
- jeroen-leverman/bible-timeline: all activity within 2026-08-22 to 2026-08-24. — [GitHub API](https://api.github.com/repos/jeroen-leverman/bible-timeline)
- DAAHL's MedArchNet page shows server errors. — [daahl.ucsd.edu](https://daahl.ucsd.edu/gaialab/MedArchNet)

### Inferences
- Causes visible in the evidence: hosting and maintenance cost for institution-run tools, grant or donor cycles ending, and solo authors moving on. Scope far larger than the first slice (Atlas of Scripture) is a recurring pattern.
- A static site with plain-file data and no server (the biblical-atlas and lineabuildsclaws approach) is the cheapest way to survive abandonment, and supports goal 4 and goal 7.

### Gaps
- No status was found for BibleMap.org or Glo Bible; no post-mortems by Bible map founders were located.
