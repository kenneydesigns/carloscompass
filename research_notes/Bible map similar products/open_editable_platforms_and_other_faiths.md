# Open, community-editable map projects, reusable "one engine, many packs" platforms, and sacred-geography maps of other faiths (state as of Nov 2026)

Scope notes: KronAtlas and Summit excluded by instruction. Bible-specific and Eucharistic-miracle products are not catalogued. Everything under "Cited Findings" was seen in a search result or fetched page during this session (Nov 2026). Anything I know only from background knowledge and did not verify this session is placed under "Gaps" and labelled "unverified background".

## 1. Which projects run a map on community-edited open data with review, and how do they handle quality and sources?

### Takeaway
There are two distinct models: "publish first, patrol afterwards" (OpenStreetMap, OpenHistoricalMap, Wikimapia) and "submit, editor reviews, then publish" (Pleiades, World Historical Gazetteer, Atlas Obscura, Syriac Gazetteer). The scholarly, cited, small-scale projects closest to Carlo's Compass all use the second model, and their recurring problem is not vandalism but a review backlog and a small editor pool.

### Cited Findings

**OpenStreetMap (OSM)** — openstreetmap.org, OpenStreetMap Foundation
- Review is post-hoc: edits go live, and the community reverts bad ones. More serious cases go to the Data Working Group (DWG), which is "authorised by the Foundation to deal with more serious vandalism" and handles copyright violation, disputes, vandalism and bots "beyond the normal means of the community" — [OSMF Data Working Group](https://osmfoundation.org/wiki/Data_Working_Group)
- Vandalism reports are sent by email to data@openstreetmap.org — [OSM community forum](https://community.openstreetmap.org/t/have-you-spotted-vandalism-on-openstreetmap-org/114684)
- User blocks range from an hour to 10 years — [OSM user blocks](https://www.openstreetmap.org/user_blocks/3276)
- Automated vandalism detection approaches are either changeset-focused or user-focused — [OSM wiki: Vandalism](https://wiki.openstreetmap.org/wiki/Vandalism)
- A vandalism wave visibly defaced the standard tile layer (white lines, abusive text), producing a very long forum thread in which members proposed pre-approval of edits or flagging objects as "awaiting approval"; these were proposals, not adopted policy — [OSM forum thread](https://community.openstreetmap.org/t/the-osm-standard-tile-layer-looks-wrong-white-lines-abusive-comments-etc/111583?page=10)
- The OSMF board publicly thanked the DWG for handling a vandalism event between 13 and 18 June (year not shown in the snippet) — [OSM forum: Praise of the DWG](https://community.openstreetmap.org/t/praise-of-the-data-working-group/115066)
- Community threads also discuss limiting new accounts as a countermeasure — [OSM forum: limit new accounts](https://community.openstreetmap.org/t/how-about-limit-new-accounts/101656?page=2)

**OpenHistoricalMap (OHM)** — openhistoricalmap.org; OSM-software sister project for historical features
- Default dedication is CC0, adopted 3 August 2022; contributors are "strongly encouraged" to use CC0, but other open licences are accepted per feature via a `license=*` tag (e.g. CC BY 4.0) — [OHM Copyright and License](https://openhistoricalmap.org/copyright); [OSM wiki: OHM license key](https://wiki.openstreetmap.org/wiki/OpenHistoricalMap/Tags/Key/license)
- Features without a licence tag are presumed public domain; only 0.12% of features carry an explicit licence tag — [OSM wiki: OHM license key](https://wiki.openstreetmap.org/wiki/OpenHistoricalMap/Tags/Key/license)
- OHM hosts thematic sub-projects such as a Roman Empire project, which lists Vici.org (ca. 16k places) as a source — [OSM wiki: OHM Roman Empire project](https://wiki.openstreetmap.org/wiki/Open_Historical_Map%2FProjects%2FRoman_Empire)

**Pleiades** — pleiades.stoa.org; ISAW (NYU) and partners; gazetteer of ancient places
- Publishes "over 36,000 ancient places and spaces (and growing)" — [ISAW: Pleiades](https://isaw.nyu.edu/publications/research-reference/pleiades)
- Content licence is CC BY 3.0 (use, share, remix permitted) — [Pleiades credits](https://pleiades.stoa.org/credits)
- Workflow: a contributor makes a personal working copy of a published place/name/location, edits in "Drafting" state, then chooses "Submit for review"; a submission can be retracted back to drafting; editors publish — [Pleiades help: better locations](https://pleiades.stoa.org/help/better-locations); [Pleiades: Getting started 2, modifying and adding](https://pleiades.stoa.org/events/pleiades-getting-started-2-modifying-and-adding)
- Review backlog is a known weakness: a blog post announced "review parties" to clear a backlog of just over 1,000 items (historical, about 2013) — [Pleiades blog: review parties](https://pleiades.jazkarta.com/news/blog/review-parties-in-december-and-january)
- Data is exported as versioned datasets on GitHub/Zenodo (e.g. Pleiades Datasets 4.1) — [Zenodo: Pleiades Datasets](https://zenodo.org/records/8206033/latest); [Pleiades blog: datasets 3.1](https://pleiades.stoa.org/news/blog/now-available-pleiades-datasets-3.1)
- Still active in 2026: a 2026 conference paper by the team ("Catching up with the Daughters of Atlas") is on the site — [Pleiades 2026 conference paper](https://pleiades.stoa.org/docs/papers-and-presentations/conference-paper-catching-up-with-the-daughters-of-atlas-2026-1/conference-paper-catching-up-with-the-daughters-of-atlas-2026)

**World Historical Gazetteer (WHG)** — whgazetteer.org; University of Pittsburgh World History Center
- Contribution unit is a whole dataset, not a single edit. Upload formats: Linked Places Format (LPF, JSON-LD/GeoJSON based) and the simpler LP-TSV spreadsheet derivative — [WHG v3 documentation](https://whgazetteer.org/documentation)
- v4 (beta docs) also lists CSV and GeoJSON input and a "submit for review, publish after approval" step, with indicative review times such as 1-2 weeks for under 50 places — [WHG v4 FAQ](https://docs.whgazetteer.org/content/v4/user-guide/troubleshooting/faq.html)
- Licence statements conflict across WHG's own pages: the licensing page says "CC BY 4.0 ... Non-Commercial" — [WHG licensing](https://whgazetteer.org/licensing); a dataset page says public datasets are downloadable under CC BY 4.0 — [WHG dataset 819](https://www.whgazetteer.org/datasets/819)
- Hosts religious-geography datasets, e.g. "Buddhist monasteries of the Western Ghats" — [WHG dataset 693](https://whgazetteer.org/datasets/693)

**Vici.org** — vici.org; "Archaeological Atlas of Antiquity"; wiki-style map of Roman-era sites
- Text content CC BY-SA (individual entries cite CC BY-SA 4.0), metadata CC0 — [About Vici](https://vici.org/about-vici.php); [Vici entry example](https://preview.vici.org/vici/36765?lang=en)
- Each entry shows creator and last editor with dates; an entry seen this session was last updated 2026-07-06, so the site is live in 2026 — [Vici entry example](https://preview.vici.org/vici/36765?lang=en)
- Scale figures conflict: "ca 16k places" — [OSM wiki: OHM Roman Empire project](https://wiki.openstreetmap.org/wiki/Open_Historical_Map%2FProjects%2FRoman_Empire); a news article headline says "over 85,000" — [Daily Times](https://dailytimes.com.pk/1097323/map-reveals-the-locations-of-over-85000-archaeological-gems-discovered-around-britain-europe-and-beyond/amp). Neither is the site's own current count.
- An older listing gives the licence as CC BY-SA 2.5 (probably outdated) — [Digital Classicist wiki](https://wiki.digitalclassicist.org/Archaeological_Atlas_of_Antiquity)

**Wikimapia** — wikimapia.org; commercial, wiki-style polygons on a map
- Listed with about 2.5 million users; quality control relies on a volunteer hierarchy in which power users set rules and fight vandalism — [Wikipedia: Wikimapia](https://en.wikipedia.org/wiki/Wikimapia); [OSM wiki: Wikimapia](https://wiki.openstreetmap.org/wiki/Wikimapia)
- Popularity "steadily declining" since 2012 according to a 2018 study — [Ballatore & Jokar Arsanjani 2018, Placing Wikimapia](https://vbn.aau.dk/en/publications/placing-wikimapia-an-exploratory-analysis/)
- A September 2025 OSM diary post expresses surprise that Wikimapia is "still active" with volunteer mappers (anecdotal) — [OSM diary](https://api.openstreetmap.org/user/rphyrin/diary/407477)
- The Wikipedia article contains a conflicting note about a March 2022 closure alongside "Active" status; unresolved — [Wikipedia: Wikimapia](https://en.wikipedia.org/wiki/Wikimapia)

**Native Land Digital** — native-land.ca; Indigenous-led Canadian non-profit; territories, languages, treaties
- Data comes from a mix of sources with a preference for Indigenous knowledge; each entry lists sources and links; the map is described as a living document; users report errors through the site — [Native Land: about](https://native-land.ca/about/)
- Strong disclaimers: not an official or legal source; does not represent official or legal boundaries — [Native Land API docs: about and disclaimers](https://api-docs.native-land.ca/about-and-disclaimers)
- Licensing is inconsistent: API docs state CC0 with a request for credit — [Native Land API docs](https://api-docs.native-land.ca/about-and-disclaimers); but API terms (API key required since late 2024) forbid storing/redistributing data without permission and forbid commercial use — [Native Land Substack: API](https://nativeland.substack.com/p/native-land-digital-api-indigenous)
- Widely reused in education (National Geographic MapMaker layer) — [National Geographic](https://education.nationalgeographic.org/resource/mapmaker-indigenous-territories/)

**Atlas Obscura** — atlasobscura.com; commercial media company; user-submitted places
- All contributions are reviewed and edited by the editorial team before publication; review can take a few weeks; drafts are locked once submitted; editors may rewrite titles, fix facts, add photos — [Atlas Obscura FAQ](https://www.atlasobscura.com/faq)
- Rejection reasons include duplicates, mainstream guidebook places, unverifiable claims, fictional or defunct sites, overly broad subjects, and business ads; live entries have a "Suggest an Edit" route — [Atlas Obscura FAQ](https://www.atlasobscura.com/faq)
- The model dates from the start: "Everything that comes in from users goes through an editor's hands before it gets published" (2013 interview) — [The Next Web](https://thenextweb.com/news/hidden-wonders-atlas-obscura-everything-curious-traveler-ever-wish-interview)

**The Syriac Gazetteer** — syriaca.org/geo; Syriaca.org (Vanderbilt and partners); places relevant to Syriac Christianity (also relevant to section 4)
- CC BY 4.0; place records are TEI XML stored in a public GitHub repository (srophe/syriaca-data) — [Syriaca: about the Gazetteer](https://syriaca.org/geo/about.html); [GitHub: srophe/syriaca-data](https://github.com/srophe/syriaca-data)
- Four contribution routes: report a mistake, add data to an entry, create a new entry, contribute a batch dataset (contact general editors first to agree format). The documented path is through the editors, not a public pull-request workflow — [Syriaca: instructions for contributors](https://syriaca.org/geo/howtoadd.html)

### Inferences
- The projects that require a citation for every claim (Pleiades, Syriac Gazetteer, WHG, Atlas Obscura) all gate publication behind an editor. None of them relies on open, instant editing. A pull-request gate is the same model with different tooling, so Carlo's Compass is in line with scholarly practice rather than with OSM/Wikipedia practice.
- Review capacity, not vandalism, is the binding constraint for small cited projects (Pleiades backlog of 1,000+; Atlas Obscura saying reviews take weeks).
- Licence clarity is commonly poor even in respected projects (WHG's "CC BY Non-Commercial" wording, Native Land's CC0 claim versus restrictive API terms, Vici's version drift). Stating one licence for code and one for content in a LICENSE file from day one avoids this.
- Per-entry provenance display (creator, last editor, date, sources) as on Vici and Native Land is a low-cost trust feature that fits the "certainty badge plus sources" pin design.
- Disclaimers about authority (Native Land: "not an official source") are standard where the subject is contested; a religious map will need a similar statement on disputed site identifications.

### Gaps
- Wikidata/Wikipedia maps, Wikivoyage, and Mapping Gothic (France) were not researched this session; no sourced findings. Unverified background: Wikidata is CC0 with post-hoc patrolling and reference fields per statement; Wikivoyage is CC BY-SA with map listings embedded in articles through the Kartographer extension; Mapping Gothic France (Columbia/Vassar) was a closed scholarly project with no public editing. Verify before citing.
- No authoritative 2025-2026 numbers were found for Wikimapia traffic or editors, or for Vici.org's own site count.
- OHM's actual moderation practice (beyond licence policy) was not found in sources.
- I could not date the OSM June vandalism event or tile-layer defacement thread precisely from the snippets.

## 2. Which projects use Git/GitHub pull requests on plain data files as their wiki, and what are the lessons for non-technical contributors?

### Takeaway
The best-documented precedent for "one YAML file per entity, edited by pull request, linted in CI" is Open States' `openstates/people` (12,000+ commits, CC0). It works, but every source on non-technical contributors reports the same frictions: YAML syntax, branch/PR concepts, and dependence on a technical person to merge. The fixes are consistent too: schema checks in CI, in-file examples, the GitHub web editor, and a spreadsheet or form on-ramp.

### Cited Findings

**Open States "people"** — github.com/openstates/people; Open States / Plural Policy
- Repository contains "YAML files with official information on state legislators, governors, and some municipal leaders", one file per person, organised in per-state directories (legislature, executive, municipalities, retired, committees) — [GitHub: openstates/people](https://github.com/openstates/people)
- 12,401 commits, 161 stars, 125 forks, 31 open pull requests, not archived, a "Lint YAML" GitHub Actions workflow and `.yamllint` config (as fetched Nov 2026) — [GitHub: openstates/people](https://github.com/openstates/people)
- Contributions are by fork and pull request; all data is CC0 and contributors waive copyright by contributing — [Open States docs: contributing people](https://docs.openstates.org/contributing/people/)
- The project wrote a formal enhancement proposal for helper tooling for manual people data, i.e. raw YAML editing alone was not enough — [OSEP #3: Manual People Data Tools](https://docs.openstates.org/enhancement-proposals/003-manual-people-data-tools/)
- The YAML repo is the source of truth; CSV exports are generated nightly for downstream users — [Open States legislator bulk data](https://open.pluralpolicy.com/data/legislator-csv/)
- In 2021 the US Congress data from the `unitedstates/congress-legislators` project (YAML/JSON/CSV, members 1789 to present) was ported into the same repo — [GitHub: openstates/people](https://github.com/openstates/people)

**Syriaca.org data** — TEI XML files per entity in a public GitHub repo, but contributions are routed through editors rather than open PRs — [GitHub: srophe/syriaca-data](https://github.com/srophe/syriaca-data); [Syriaca contributor instructions](https://syriaca.org/geo/howtoadd.html)

**al-Thurayya Gazetteer** — one GeoJSON file per place in a GitHub repo; 222 commits, 23 issues, 1 open pull request, no contribution guide; README asks users to report errors — [GitHub: althurayya/althurayya.github.io](https://github.com/althurayya/althurayya.github.io)

**Lessons on non-technical contributors**
- Thread (a company) taught non-engineers to use GitHub; they then made more contributions to the main codebase than all engineers and contractors combined. Thread added unit tests that check the structure of data files because the files were now edited by people who do not know the code. Code-like data syntax was hard for non-coders; planned fix was step-by-step instructions and copy-paste examples inside the files. Contributors still depended on an engineer to press merge — [Thread engineering blog](https://medium.com/thread-engineering/teaching-non-engineers-how-to-contribute-code-2e85411ab464)
- dxw (2022): five non-technical staff who had never opened a pull request went on to edit the live playbook site by themselves through Git — [dxw blog](https://www.dxw.com/2022/04/using-git-to-manage-our-playbook-content/)
- Tom Johnson (2015): the obstacle in PR-based documentation editing is that reviewers and contributors must understand branches and source syntax — [I'd Rather Be Writing](https://idratherbewriting.com/2015/09/10/edits-through-pull-requests/)
- Galaxy Project trains contributors to edit a YAML file and open/update a pull request entirely in the GitHub web interface, with no local Git — [Galaxy Training: contributing via GitHub interface](https://training.galaxyproject.org/training-material/topics/contributing/tutorials/github-interface-contribution/tutorial.html)
- Catalyst Co-op (PUDL): for outside contributors, give clear step-by-step task lists rather than vague requests — [PUDL docs: managing external contributions](https://docs.catalyst.coop/pudl/en/latest/dev/managing_external_contributions.html)
- Messagevisor docs: translators find one-YAML-file-at-a-time editing tedious; recommended workaround is a CSV round trip with an engineer applying changes back to YAML — [Messagevisor docs](https://messagevisor-prod.pages.dev/docs/use-cases/onboarding-non-engineers)
- The Carpentries publishes training material specifically on collaborating with newcomers on GitHub — [Carpentries: collaborating with newcomers](https://carpentries.github.io/github-skills/collaborating_newcomers.html)

### Inferences
- "One YAML file per place plus PR review" is proven at the scale of thousands of entities and tens of thousands of commits (Open States), but that project's contributors are civic-tech volunteers, not the general public. Expect the realistic contributor pool for Carlo's Compass to be technically comfortable people unless an on-ramp exists.
- Minimum viable contributor kit, taken directly from the sources: (a) a CI schema/lint check on every PR, (b) a template file with commented examples, (c) a "edit this pin" link that opens the GitHub web editor on the right file, (d) a PR template with a sources checklist, (e) a non-Git route (issue form or simple web form) that a maintainer converts to YAML.
- Generated exports (CSV/GeoJSON built from the YAML) make the data useful to people who never touch Git, as Open States does nightly.
- Scholarly projects that keep data in Git (Syriaca, al-Thurayya) mostly do not receive public PRs; Git serves as storage and transparency, and contributions come through editors. Open data in Git does not by itself create a contributor community.

### Gaps
- No systematic study of non-technical contribution rates to PR-based open datasets was found; the evidence is blog posts and project docs.
- Contributor counts for `openstates/people` were not shown on the fetched page.
- Not researched this session (unverified background; worth checking): OSM `name-suggestion-index`, Transitland Atlas (DMFR files), OpenAddresses sources, and "awesome"-list datasets, all of which use PRs on plain files; and Git-backed CMS front ends such as Decap CMS, Pages CMS, or Sveltia CMS, which give non-technical editors a form that commits to GitHub for them.

## 3. Which open-source engines or templates let different groups publish their own cited pin-map or story map, and how do they separate engine from content and theme?

### Takeaway
The dominant, proven separation pattern is "static engine plus one config file plus a data file": Mapbox's storytelling template (`config.js`), Peripleo (`peripleo.config.json` plus Linked Places/GeoJSON), CollectionBuilder (`config.yml` plus a metadata CSV), and Knight Lab tools (hosted engine plus a spreadsheet). Peripleo is the closest existing open-source analogue to a "pack"-driven cited pin map; no surveyed tool has a first-class concept of a swappable content-plus-theme pack with per-claim sources and certainty.

### Cited Findings

**Peripleo** — github.com/britishlibrary/peripleo; British Library "Locating a National Collection" (LaNC), developed by Rainer Simon; descends from the Pelagios Peripleo
- Browser-based tool for visualising records with a geographic component; customised by copying the open-source repo; hosted free on GitHub Pages — [LaNC: Peripleo](https://britishlibrary.github.io/locating-a-national-collection/Peripleo.html)
- MIT licence; marked as a public template repository; 164 commits, 31 stars, 15 forks; no releases; not archived (as fetched Nov 2026) — [GitHub: britishlibrary/peripleo](https://github.com/britishlibrary/peripleo)
- Separation: deployable files sit in `docs/`; settings in `peripleo.config.json`; switching dataset means changing a filename in the config; data must be Linked Places Format or GeoJSON — [GitHub: britishlibrary/peripleo](https://github.com/britishlibrary/peripleo)
- Engine source is in a separate repo, `britishlibrary/peripleo-lanc`; the template repo holds only configuration and data — [LaNC: software](https://britishlibrary.github.io/locating-a-national-collection/software.html)
- Companion tool Locolligo converts spreadsheets to the format Peripleo needs — [LaNC: Locolligo](https://britishlibrary.github.io/locating-a-national-collection/Locolligo.html)
- LaNC was a 2022 foundation project of the AHRC "Towards a National Collection" programme (partners included British Library, National Trust, University of Exeter, Historic Royal Palaces) — [LaNC final report](https://bl.iro.bl.uk/concern/reports/877f3e85-93bf-4e27-bdfa-9a8bb91033d5?locale=zh)
- Third parties have reused the template (forks with their own configuration guides exist) — [maxguen Peripleo configuration guide](https://maxguen.github.io/peripleo/Configuration-Guide.html)

**Mapbox storytelling template and MapLibre ports**
- Mapbox's scrollytelling template is on GitHub under BSD 3-Clause; the author copies `config.js.template` to `config.js` and fills in chapters; requires a Mapbox access token — [Mapbox blog: how to build a scrollytelling map](https://www.mapbox.com/blog/how-to-build-a-scrollytelling-map); [GitHub: mapbox/storytelling](https://github.com/mapbox/storytelling)
- `digidem/maplibre-storymap` is a port of that template to MapLibre (Digital Democracy) using the same copy-the-config workflow — [GitHub: digidem/maplibre-storymap](https://www.github.com/digidem/maplibre-storymap)
- `opengeos/maplibre-gl-storymaps` is a separate MIT-licensed MapLibre storytelling project needing no proprietary dependencies or API keys, credited as inspired by the Mapbox template; uses Scrollama for scroll behaviour — [opengeos/maplibre-gl-storymaps](https://ghproxy-9d2.pages.dev/opengeos/maplibre-gl-storymaps)
- The template has been reused by unrelated organisations (e.g. Washington Trails Association) — [GitHub: washingtontrails/mapboxstory-trailsrebooted2023](https://github.com/washingtontrails/mapboxstory-trailsrebooted2023)

**uMap** — umap-project; OpenStreetMap France community; self-hostable Django app for making custom maps on OSM tiles
- Licence changed from WTFPL to AGPLv3 in February 2024 because partners and sponsors wanted an OSI-approved licence — [uMap changelog](https://umap-project.readthedocs.io/en/master/changelog/)
- Live collaborative editing was in development in 2024 under an NLnet/NGI grant — [OSM diary, David Larlet](https://www.openstreetmap.org/user/David%20Larlet/diary/403560)
- Multiple public instances exist (umap.openstreetmap.fr, framacarte.org, umap.osm.ch, umap.openstreetmap.de) — [OSM wiki: uMap](https://wiki.openstreetmap.org/wiki/DE:UMap)
- Described in the cartography literature as "a free, open-source alternative to Google My Maps" — [Cartographic Perspectives](https://cartographicperspectives.org/index.php/journal/article/download/1729/2073?inline=1)

**Knight Lab StoryMapJS and TimelineJS** — Northwestern University Knight Lab
- StoryMapJS listed as active and open source, last modified 11 April 2025, by a third-party directory — [Civic Tech Field Guide](https://directory.civictech.guide/listing/storymap)
- TimelineJS is under Mozilla Public License 2.0; the original repo has issues and PRs disabled, development moved to TimelineJS3, and Knight Lab continues to serve it from its CDN — [Knight Lab 2012 post](https://knightlab.northwestern.edu/2012/09/02/timlinejs-deployed-more-than-1500-times/); [GitHub: NUKnightLab/TimelineJS3](https://github.com/NUKnightLab/TimelineJS3)
- TimelineJS content is authored in a Google Spreadsheet — [opensource.com](https://opensource.com/article/18/10/create-interactive-timelines-open-source-tool)
- Widely taught in university library guides — [UT Austin guide: StoryMapJS](https://guides.lib.utexas.edu/storymap-js-by-knightlab)

**CollectionBuilder** — University of Idaho Library; static digital-collection templates on Jekyll
- Variants: CollectionBuilder-GH (GitHub Pages, small collections because of the 1 GB repo cap), CollectionBuilder-CSV (copy template, put metadata CSV in `_data`, edit `config.yml`, build with Jekyll), CollectionBuilder-Sheets (reads a published Google Sheet) — [ecosyste.ms: CollectionBuilder-GH](https://science.ecosyste.ms/projects/16765); [ecosyste.ms: CollectionBuilder-CSV](https://science.ecosyste.ms/projects/57366)
- Three-way licence split: code MIT, documentation CC BY-SA 4.0, collection objects under their own rights recorded in a per-item "rights" field — [ecosyste.ms: CollectionBuilder-Sheets](https://science.ecosyste.ms/projects/126077)

**Neatline (Omeka plugin)** — Scholars' Lab, University of Virginia; later Performant Software
- The Omeka S version of Neatline has a read-only GitHub repo and a user reported no response from the listed maintainers; the Omeka Classic version was described as still active (undated forum post) — [Omeka forum: Neatline compatibility](https://forum.omeka.org/t/neatline-compatibility/16793)
- Omeka S depends on Laminas MVC, which had an announced end of life of 31 December 2025, a maintenance risk for every module — [Omeka forum: replacing Laminas MVC](https://forum.omeka.org/t/replacing-laminas-mvc-with-mezzio/27628)
- Omeka itself remains maintained (year-end 2025 post; geospatial work in stated priorities) — [Omeka news: closing out 2025](https://omeka.org/news/2025/12/23/closing-out-2025/)

**Humap** — humap.me; UK software-as-a-service company
- Participatory mapping platform for humanities; the team built Layers of London (commissioned 2016, launched 2018, Institute of Historical Research) and then productised it — [Humap case study: IHR](https://humap.me/case-studies/the-institute-of-historical-research/); [About Humap](https://humap.me/about-humap/)
- No public pricing; sales by demo/contact; no open-source claim found — [Humap: digital humanities](https://humap.me/use-cases/digital-humanities/)

### Inferences
- Engine/content separation in every successful template is physical, not just conceptual: content and config live in a different file or repo from the engine (Peripleo splits them across two repos). A `packs/<name>/` directory with `pack.yml` (title, theme colour roles, eras) plus `places/*.yml` matches the proven pattern.
- Theme is the weak spot in existing tools: Peripleo, the Mapbox template, and CollectionBuilder let you change data and some settings, but theming is mostly "edit the CSS". Role-named colour tokens in a pack file would go beyond what these templates offer.
- CollectionBuilder's three-way licence statement (code MIT, docs CC BY-SA, objects per-item rights field) is a ready-made model for "code MIT, content CC BY-SA 4.0, images per-item".
- Hosted-engine tools that depend on one institution (Knight Lab CDN, Neatline) show the main risk of non-static tools: when funding or staff leave, users' maps degrade. Static, forkable, token-free templates (MapLibre ports, Peripleo) survive neglect better.
- uMap's forced move from WTFPL to AGPLv3 shows institutional adopters want a mainstream OSI licence; MIT is safe.
- Humap demonstrates there is a paid market for "many communities, one participatory map engine", but as closed SaaS.

### Gaps
- Felt, Kepler.gl, Wax (minimal computing), and Leaflet-based templates such as "leaflet-storymaps-with-google-sheets" were not verified this session. Unverified background: Felt is a commercial hosted product; Kepler.gl is an MIT-licensed analysis tool rather than a publishing template; Wax is a Jekyll-based minimal-computing exhibit framework whose maintenance had slowed; HandsOnDataViz's Leaflet storymap template reads content from Google Sheets. Verify before citing.
- StoryMapJS licence could not be confirmed (aggregators report "non-SPDX/other"); check the repo LICENSE.
- Last-commit dates for Peripleo and the MapLibre storymap ports were not visible; Peripleo has no tagged releases, so treat its maintenance as uncertain after the 2022 project end.
- Whether uMap's real-time collaboration shipped in a stable release by 2026 was not confirmed.

## 4. Which religious or sacred-geography maps exist for other traditions, and do any share an engine across traditions?

### Takeaway
Every tradition has at least one sacred-geography map, but each is a single-tradition, single-team build on its own stack (Google Maps/Earth, d3, GitHub Pages), usually with no public contribution workflow. None of the projects found shares an engine with another tradition; the only shared infrastructure is general scholarly gazetteers (Pleiades, WHG) that host religious datasets.

### Cited Findings

**Islam**
- **al-Thurayya Gazetteer** — althurayya.github.io; Masoumeh Seydi and Maxim Romanov (University of Leipzig). Geospatial model of the classical Islamic world: over 2,000 toponyms and almost as many route sections, georeferenced from Georgette Cornu's *Atlas du monde arabo-islamique* (Brill, 1983). Code Apache 2.0; original datasets CC BY 4.0. Data: one GeoJSON per place plus JSON for sources and routes; d3.js front end. 222 commits, 23 issues; no contribution guide — [GitHub: althurayya](https://github.com/althurayya/althurayya.github.io); [UCLA Islamic Studies resource page](https://islamicstudies.ucla.edu/resource/al-%E1%B9%AFurayya-gazetteer-gazetteer-classical-islamic-world/)
- **Atlas of Quran (AoQ)** — atlasofquran.github.io; curators Ayesha Gohar and Sadaqat Mulla, a DigitalQuranLab project. Interactive world map of Quranic places, people and prophets with geo-locations, linked verses and hadith, plus a topic network graph. Content CC BY-SA 4.0. Contributions by feedback/volunteer form or GitHub. Page last updated 21 May 2020, so it appears dormant — [Atlas of Quran](https://atlasofquran.github.io); [DigitalQuranLab](https://digitalquranlab.github.io)
- **Parallel Quran places map** — map of identifiable locations referenced in the Quran; no open licence found — [Parallel Quran](https://parallelquran.com/quran/places-map/)
- **pverkind/islamicempire** — Leaflet web map with grouped layers and search (scope not verified) — [GitHub mirror](https://github.imc.re/pverkind/islamicempire)

**Judaism**
- **Sefaria** has no geographic map product; its visualisations are text-link explorers, and it has a "Places" topic category — [Sefaria visualizations](https://www.sefaria.org/visualizations); [Sefaria topics: places](https://voices.sefaria.org/topics/category/places)
- **HaTanakh (Herzog College) "Places in the Bible"** — zoomable map of places mentioned in Tanakh with click-through details — [hatanakh.herzog.ac.il](https://hatanakh.herzog.ac.il/en/places)
- **ALMA: Digital Atlas of the Ancient Jewish World** — Hebrew University; aims at an open digital atlas of historical and archaeological information for late-antique Jewish sources — [ALMA introductory essay](https://jjar.huji.ac.il/publications/alma-digital-atlas-ancient-jewish-world-introductory-essay)
- **Diarna Geo-Museum** — diarna.org; maps Jewish heritage sites in North Africa and the Middle East using Google Earth; nearly 3,000 sites documented per Smithsonian, versus 650 in a 2010 report — [Diarna](https://diarna.org/); [Smithsonian Magazine](https://www.smithsonianmag.com/history/diarna-jewish-sites-not-seen-generations-visit-from-home-180974875/)

**Latter-day Saints**
- **Church History Maps** — official static maps in the Church's study helps — [churchofjesuschrist.org](https://www.churchofjesuschrist.org/study/scriptures/history-maps/introduction)
- **Scriptures Mapped** — BYU (Taylor Halverson, Steve Liddle); chapter-by-chapter scripture reading with every location plotted on Google Maps — [LDS365](https://lds365.com/2019/07/04/study-tools-map-where-scripture-events-happened/)
- **MormonPlaces** — BYU; interactive gazetteer of locations significant to the Church and sister churches — [mormonplaces.byu.edu](https://mormonplaces.byu.edu/)
- **Mapping Mormonism** — BYU atlas; maps are copyrighted and deliberately lower quality online than in print — [mappingmormonism.byu.edu](https://mappingmormonism.byu.edu/the-maps)

**Buddhism and Hinduism**
- **Buddhist Geographical Information System (BGIS)** — University of Arizona Center for Buddhist Studies; Chinese Buddhism data with intent to extend to the whole Buddhist world; downloadable temple datasets — [BGIS](https://cbs.arizona.edu/projects/buddhist-geographical-information-system-bgis)
- **Sacred Centers in India** — Hamilton College Digital Humanities Initiative (from 2013); archive of Hindu Gaya and Buddhist Bodh Gaya with a Google Maps interface and Unity WebGL 3D temple views — [Hamilton College](https://my.hamilton.edu/academics/open-curriculum/digital-hamilton/projects/sacred-centers-in-india)
- **Buddhist monasteries of the Western Ghats** — a dataset hosted on World Historical Gazetteer — [WHG dataset 693](https://whgazetteer.org/datasets/693)
- A CC BY open-access article reconstructs Buddhist sites of Hangzhou from a historical local gazetteer (method example) — [Religions 13(8):711](https://mdpi.com/2077-1444/13/8/711)

**Orthodox and Eastern Christianity**
- **Syriac Gazetteer** — see section 1; CC BY 4.0, TEI in GitHub — [Syriaca](https://syriaca.org/geo/about.html)
- **Russian Orthodox Church monastic map** — interactive map of monasteries in Russia, Ukraine, Belarus, Kazakhstan and elsewhere, from the Church's monasticism department — [gorthodox.com](https://gorthodox.com/en/news-item/an-interactive-map-of-all-the-monasteries-in-russia)
- **Ukrainian Orthodox Church map** — 293 monasteries, in Ukrainian, Russian and English — [spzh.eu](https://spzh.eu/en/amp-news/45541-interactive-map-of-monasteries-developed-and-published-in-the-uoc)

### Inferences
- No tradition's map found here is built on a reusable engine that another tradition also uses. "One engine, many packs" for sacred geography appears to be an open niche.
- The most plausible first non-Catholic pack partners are projects that already publish openly licensed, structured data: al-Thurayya (CC BY 4.0 GeoJSON), Atlas of Quran (CC BY-SA 4.0, same licence as Carlo's Compass content), Syriac Gazetteer (CC BY 4.0), BGIS downloads, and WHG datasets.
- Licence compatibility matters for packs: CC BY 4.0 data can be included in a CC BY-SA 4.0 pack with attribution; copyrighted atlases (Mapping Mormonism) and unlicensed maps (Parallel Quran, HaTanakh) cannot be reused.
- Volunteer-run religious maps go dormant quickly (Atlas of Quran last updated 2020). University projects persist longer but freeze when grants end. A pack format that is plain files means a dormant pack still renders.
- Official-church maps (LDS, Russian and Ukrainian Orthodox) are institutional, closed, and uncited directories; scholarly ones (al-Thurayya, Syriaca, BGIS) are cited but aimed at researchers. A cited-summary map for a general audience sits between them.

### Gaps
- Licences and contribution workflows for HaTanakh, ALMA, Diarna, BGIS, MormonPlaces, and Sacred Centers in India were not confirmed.
- Not found or not researched: Hajj and pilgrimage-route maps, Sikh and Jain sacred-site maps, Tibetan Buddhist resources, Joseph Smith Papers geography. Unverified background: the Buddhist Digital Resource Center and the Tibetan and Himalayan Library maintain place gazetteers; verify before citing.
- The Atlas of Quran GitHub organisation was not opened, so data format and last commit are unknown.

## 5. Are there any direct precedents for a multi-faith or multi-community sacred map platform?

### Takeaway
No open-source platform was found where different faith communities each publish their own pack on a shared engine. The nearest precedents are (a) single scholarly maps that cover several faiths in one dataset, (b) educational story maps, and (c) commercial or general-purpose tools that happen to be used by religious groups.

### Cited Findings
- **HolyNet / "Holy Networks"** — University of Fribourg; digital map of pilgrimage routes in post-Crusader Palestine reconstructing the holy topographies of Jews, Christians and Muslims, 1187 to 1852, in a non-linear interactive form. One research team, one dataset, three faiths — [University of Fribourg: Holy Networks database](https://www.unifr.ch/art/fr/recherche/projets-de-recherche/holy-networks/database.html)
- **The Pluralism Project (Harvard)** — its Directory of Religious Centers ran 1995 to 2019 and is now an archive; Boston data is on an interactive Mapbox map with a directory by tradition; twenty cities have interactive religious-diversity maps — [Pluralism Project Archive](https://pluralismarchive.hsites.harvard.edu/); [World Religions in Greater Boston](https://pluralism.org/boston)
- **"Sacred Places, Sacred Ways"** — Esri/National Geographic story map covering five religions in five sites, for educators; not a platform — [National Geographic Education](https://education.nationalgeographic.org/resource/sacred-places-sacred-ways/)
- **British Pilgrimage Trust map** — routes and sacred places in Britain, search by location/route/place, registered users can save and complete routes; single country, single organisation — [British Pilgrimage Trust](https://www.britishpilgrimage.org/resources/announcing-our-new-online-pilgrimage-map)
- **Mapme "places of worship"** — commercial map-builder marketed to faith organisations across traditions — [Mapme](https://cdn.mapme.com/solutions/places-of-worship/)
- **Humap** — commercial multi-tenant participatory mapping SaaS for heritage and humanities (not faith-specific) — [About Humap](https://humap.me/about-humap/)
- **World Historical Gazetteer** — neutral scholarly platform where separately authored datasets (including religious ones) coexist under one engine and format — [WHG dataset 693](https://whgazetteer.org/datasets/693); [WHG documentation](https://whgazetteer.org/documentation)
- **Sefaria** (texts, not maps) is the best-known example of a faith-specific open content library on open-source code, but its visualisations are not geographic — [Sefaria visualizations](https://www.sefaria.org/visualizations)

### Inferences
- The "engine with community packs" idea has precedent structurally (WHG datasets, Peripleo forks, Humap tenants) but not for sacred geography with community ownership of each pack. That is a genuine differentiator, though unproven demand.
- Multi-faith maps made by a single neutral team (HolyNet, Pluralism Project, Esri) avoid the hard problem a pack model has to face: each community controls its own claims, so the engine needs neutral vocabulary (certainty levels, source types) that does not privilege one tradition's view of contested sites.
- The Pluralism Project directory's end in 2019 after 24 years shows a centrally maintained multi-faith directory is costly to keep current; decentralised packs spread that cost.

### Gaps
- Absence of evidence only: two searches found no open multi-faith sacred map platform, which does not prove none exists. Wikidata-based sacred-site queries and OSM `religion=*`/`place_of_worship` tagging are de facto multi-faith open datasets but were not researched (unverified background).
- HolyNet's licence, data format, and public availability were not confirmed.

## 6. What typically goes wrong: vandalism, low contribution, contributor friction with Git, licensing conflicts?

### Takeaway
For a small, reviewed, cited project the realistic risks, in order, are: too few contributors, reviewer backlog, tooling friction, and unclear licensing. Vandalism is mainly a problem for instant-publish projects like OSM and is largely removed by a review gate.

### Cited Findings

**Vandalism**
- OSM publishes edits immediately; defacement reached the default map tiles and required DWG intervention and blocks; the community debated but did not adopt pre-moderation — [OSM forum thread](https://community.openstreetmap.org/t/the-osm-standard-tile-layer-looks-wrong-white-lines-abusive-comments-etc/111583?page=10); [OSMF DWG](https://osmfoundation.org/wiki/Data_Working_Group)
- Region- and conflict-specific vandalism and blocks occur in contested areas (e.g. an Israel thread) — [OSM forum: vandalism and blocks in Israel](https://community.openstreetmap.org/t/vandalism-and-blocks-in-israel/105176?page=2)
- Pre-publication review (Atlas Obscura, Pleiades) avoids public vandalism by design — [Atlas Obscura FAQ](https://www.atlasobscura.com/faq); [Pleiades help](https://pleiades.stoa.org/help/better-locations)

**Low contribution and decline**
- Wikimapia's popularity has declined steadily since 2012 — [Ballatore & Jokar Arsanjani 2018](https://vbn.aau.dk/en/publications/placing-wikimapia-an-exploratory-analysis/)
- Atlas of Quran invites GitHub contributions but its page was last updated in May 2020 — [Atlas of Quran](https://atlasofquran.github.io)
- al-Thurayya has open data on GitHub but no contribution guide and a single open pull request — [GitHub: althurayya](https://github.com/althurayya/althurayya.github.io)
- The Pluralism Project's directory stopped being maintained in 2019 — [Pluralism Project Archive](https://pluralismarchive.hsites.harvard.edu/)

**Review bottleneck**
- Pleiades accumulated a backlog of over 1,000 submissions awaiting review — [Pleiades blog: review parties](https://pleiades.jazkarta.com/news/blog/review-parties-in-december-and-january)
- Atlas Obscura reviews take weeks and staff say they lack bandwidth to give feedback on rejected submissions (user forum, anecdotal) — [Atlas Obscura FAQ](https://www.atlasobscura.com/faq); [Atlas Obscura feedback board](https://atlas-obscura-digital-product.nolt.io/111)

**Git and tooling friction**
- Non-coders struggle with data-file syntax and still need an engineer to merge; structural tests on data files catch their mistakes — [Thread engineering blog](https://medium.com/thread-engineering/teaching-non-engineers-how-to-contribute-code-2e85411ab464)
- Branch and syntax knowledge is the core obstacle in PR-based editing — [I'd Rather Be Writing](https://idratherbewriting.com/2015/09/10/edits-through-pull-requests/)
- Per-file YAML editing is tedious for bulk contributors; CSV round-trip recommended — [Messagevisor docs](https://messagevisor-prod.pages.dev/docs/use-cases/onboarding-non-engineers)
- Open States needed dedicated tooling for manual YAML data — [OSEP #3](https://docs.openstates.org/enhancement-proposals/003-manual-people-data-tools/)

**Platform and maintenance decay**
- Neatline for Omeka S: read-only repository, unresponsive maintainers — [Omeka forum](https://forum.omeka.org/t/neatline-compatibility/16793)
- Framework end-of-life (Laminas MVC, end of 2025) threatens every Omeka S module — [Omeka forum](https://forum.omeka.org/t/replacing-laminas-mvc-with-mezzio/27628)
- The Mapbox storytelling template requires a proprietary access token, which prompted token-free MapLibre ports — [opengeos/maplibre-gl-storymaps](https://ghproxy-9d2.pages.dev/opengeos/maplibre-gl-storymaps)

**Licensing conflicts and confusion**
- uMap had to relicense from WTFPL to AGPLv3 at sponsors' request — [uMap changelog](https://umap-project.readthedocs.io/en/master/changelog/)
- OHM mixes CC0 default with per-feature licences, but only 0.12% of features carry a licence tag — [OSM wiki: OHM license key](https://wiki.openstreetmap.org/wiki/OpenHistoricalMap/Tags/Key/license)
- OHM reminds contributors that facts are not copyrightable but database rights still apply when copying from sources — [OHM Copyright](https://openhistoricalmap.org/copyright)
- Native Land states CC0 in one place and restrictive non-commercial, no-redistribution API terms in another — [Native Land API docs](https://api-docs.native-land.ca/about-and-disclaimers); [Native Land Substack](https://nativeland.substack.com/p/native-land-digital-api-indigenous)
- WHG's licensing page uses the non-standard phrase "CC BY 4.0 Non-Commercial" while dataset pages say CC BY 4.0 — [WHG licensing](https://whgazetteer.org/licensing); [WHG dataset 819](https://www.whgazetteer.org/datasets/819)
- Printed-atlas publishers restrict online reuse (Mapping Mormonism maps are copyrighted and degraded online) — [Mapping Mormonism](https://mappingmormonism.byu.edu/the-maps)

### Inferences
- With PR review, the vandalism surface is the PR queue (spam PRs), not the live map; the cost moves to reviewer time. Plan for one or two named reviewers per pack and a stated turnaround, since every reviewed project reports backlog.
- "Open on GitHub" does not produce contributors by itself (al-Thurayya, Atlas of Quran). Projects with sustained contribution have either an institution (Pleiades, Open States) or a very low-friction editor (OSM, uMap). For a hackathon project, seed content by the team is what will exist; the open workflow is for credibility and later growth.
- Contested religious sites will attract edit disputes similar to OSM's conflict-region disputes. A pack model localises that: each pack's maintainers arbitrate their own content, and the certainty badge can record "traditional identification, disputed" without the engine taking a side.
- CC BY-SA 4.0 for content is compatible with ingesting CC0 and CC BY sources (Pleiades CC BY 3.0, al-Thurayya CC BY 4.0, OHM CC0, Vici metadata CC0) and with Vici/Atlas of Quran CC BY-SA text, but share-alike prevents CC BY or CC0 projects from importing Carlo's Compass text back. Record the source licence per place file to keep this auditable.
- A static, token-free stack (MapLibre plus plain files) avoids the two decay modes seen above: vendor tokens and server frameworks reaching end of life.

### Gaps
- No quantitative data found on spam or abusive pull requests in open-data repos.
- No Hacker News or Reddit threads specifically on community gazetteers or religious map platforms surfaced in this session's searches.
- Legal detail on database rights and CC BY-SA versus ODbL (OSM's licence) compatibility was not researched; unverified background: OSM data is under ODbL, which is not straightforwardly compatible with CC BY-SA for derived databases, so copying OSM-derived coordinates into CC BY-SA place files needs care. Verify before relying on it.
