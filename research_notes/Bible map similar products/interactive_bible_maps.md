# Interactive Bible Map and Bible Atlas Products (state as of November 2026)

Scope note: KronAtlas and Summit are excluded by instruction. "Search snippet" marks a fact taken from a search-result summary of the cited page rather than a full read of that page; treat those as lower confidence. Research date: 2026-11-13.

## Which interactive Bible maps exist on the web today, and what does each offer?

### Takeaway
The web field splits into (a) two open datasets that almost everyone else reuses (OpenBible.info Bible Geocoding and Theographic/Viz.Bible), (b) older link-heavy portal sites (Bible Hub/BibleAtlas.org, Bible History Online, BibleMap.org), (c) one paywalled passage-synced atlas (Bible Gateway Plus), and (d) a wave of small 2025-2026 web apps. No product found combines a map-first single screen, search plus filters, a timeline, per-pin cited summaries with a certainty badge, and pull-request editing; OpenBible has the best certainty and citation data but presents it as an alphabetical list and Google Earth downloads rather than a filterable map app.

### Cited Findings

**OpenBible.info Bible Geocoding (web + open data; Protestant canon)**
- Maker and model: run by OpenBible.info; free; whole dataset under Creative Commons Attribution 4.0, usable for any purpose with credit — [OpenBible Geo](https://www.openbible.info/geo/)
- Coverage: the repository describes itself as "Geographic data for every place mentioned in the Protestant Bible"; no deuterocanon is mentioned — [GitHub repo](https://github.com/openbibleinfo/Bible-Geocoding-Data)
- Features: an alphabetical "atlas" of all places with thumbnails, verses, and photos; a preview page per Bible book; KMZ/KML downloads by book and chapter for Google Earth; a KML of water bodies; about 1,000 hand-picked photos, mostly Wikimedia Commons; overlays of ancient and modern Jerusalem — [OpenBible Geo](https://www.openbible.info/geo/)
- Certainty: the project "expresses a data-backed confidence level in each identification"; a separate KMZ shows only the most likely location per place — [OpenBible Geo](https://www.openbible.info/geo/)
- How certainty is computed: scholarly sources are counted as votes (for example confidence_yes = 30, confidence_no = -20); time-weighted scores read as a fraction of 1000 (500 = 50%); a vote total of 500 or more is high confidence; votes are bucketed into six periods from "1969 and before" to "2010 and after" — [GitHub repo](https://github.com/openbibleinfo/Bible-Geocoding-Data)
- Citations: draws on "over seventy modern sources" and over 400 unique cited sources (commentaries, dictionaries, encyclopedias, atlases); named inputs include Biblemapper, DARE, Faithlife Factbook, Pleiades, Tyndale House STEPBible, Wikidata, Wikipedia, UBS; each place page lists its sources (example: Abdon has over 20) — [GitHub repo](https://github.com/openbibleinfo/Bible-Geocoding-Data); [OpenBible Geo](https://www.openbible.info/geo/)
- Data model: separates places as the Bible mentions them (ancient) from modern locations they may be identified with; five JSON Lines files (ancient, modern, geometry, image, source) plus thousands of GeoJSON/KML geometry files — [GitHub repo](https://github.com/openbibleinfo/Bible-Geocoding-Data)
- Maintenance: repo created 2021-10-31, last push 2021-11-01, only 3 commits, 143 stars, 29 forks, 4 open issues, not archived — [GitHub API](https://api.github.com/repos/openbibleinfo/Bible-Geocoding-Data)
- Weakness noted by a downstream user: BYU's Scriptures, Mapped site says many geocoded placenames are "somewhat speculative" and its database likely has inaccuracies (search snippet) — [Scriptures, Mapped](https://scriptures.byu.edu/mapscrip/)
- No timeline or journey view surfaced in any description of the site (search snippet) — [learnofchrist review](https://learnofchrist.com/resources/openbible)

**Theographic Bible Metadata / Viz.Bible (open data + small web app)**
- Maker: Robert Rouse (robert@viz.bible); open-source knowledge graph linking people, places, events, groups to verses — [Theographic about](https://theographic.netlify.app/about); [Viz.Bible data](https://viz.bible/bible-data/)
- Coverage: 3,067 people, 450 events, 23 groups, 31,102 verses across 66 books; places listed as 1,274 on one page and 1,298 on the other (sources conflict) — [Viz.Bible data](https://viz.bible/bible-data/); [Theographic about](https://theographic.netlify.app/about)
- Place data: coordinates derived from openbible.info/geo, augmented with a place type (region, city, water) and links to Pleiades and GeoNames; GeoJSON available including Paul's journeys — [Viz.Bible data](https://viz.bible/bible-data/)
- Other sources: KJV 1769 text, Easton's Bible Dictionary (1897), Floyd Nolen Jones' Old Testament chronology for event dates, Todd Atwood for Acts dates — [Viz.Bible data](https://viz.bible/bible-data/)
- License: data CC BY-SA 4.0, code GPL v3.0 — [Theographic about](https://theographic.netlify.app/about)
- The web app is described as search plus a browsable index; its about page mentions no map or timeline — [Theographic about](https://theographic.netlify.app/about)
- Viz.Bible also publishes an interactive map of Paul's missionary journeys (search snippet) — [La Vista map resources](https://www.lavistachurchofchrist.org/cms/resources/map-resources/)
- Maintenance: actively pushed; last push timestamp 2026-11-14 UTC, 370 stars, 91 forks, 4 open issues — [GitHub API](https://api.github.com/repos/robertrouse/theographic-bible-metadata)

**Bible Mapper (biblemapper.com; David Barrett)**
- Product family on the home page: Atlas (free digital Bible maps and photos in a chronological list), Bible Mapper Jr. (free kids' map lessons), Bible Mapper desktop software (build custom maps), PassageBrowser (online Bible with related maps beside the passage), WebViewer (locate Bible places and view photos), Image Fetcher (photo catalogue of hundreds of places), TimeGlider (scrollable online timeline of Bible events) — [BibleMapper.com](https://biblemapper.com/)
- Developer is David Barrett; the blog offers over 100 free maps with captions (search snippet) — [BiblePlaces blog](https://bibleplaces.com/?p=11595)
- Desktop tool lets users choose which object types appear, including political boundaries, and which biblical eras to display so only places existing in that period show (search snippet) — [The Gospel Coalition](https://www.thegospelcoalition.org/blogs/justin-taylor/bible-mapper/)
- Distribution: Bible Gateway hosts the Bible Mapper maps, and Bible Hub embeds the Bible Mapper WebViewer — [Bible Gateway blog](https://www.biblegateway.com/blog/?p=66882); [Bible Hub Atlas](https://biblehub.com/atlas/)
- Its identifications are one of the inputs to OpenBible's confidence votes — [GitHub repo](https://github.com/openbibleinfo/Bible-Geocoding-Data)

**BibleAtlas.org / Bible Hub Atlas**
- bibleatlas.org now 301-redirects to biblehub.com/atlas/ — [BibleAtlas.org](https://bibleatlas.org/)
- Tagline "Maps for Every Location in the Bible"; atlas and Bible search boxes; links to three collections: Bible Mapper WebViewer, Shepherd Historical Atlas, ISV Bible Atlas; simple text-based layout — [Bible Hub Atlas](https://biblehub.com/atlas/)

**Bible Gateway Plus Atlas (HarperCollins Christian / Bible Gateway)**
- Scrollable, zoomable maps synchronized with the passage being read; opened from the Study tab on a passage page; lists the places in that passage (search snippet) — [Bible Gateway blog](https://www.biblegateway.com/blog/?p=57998)
- Paywalled: available only to Bible Gateway Plus members, on the website only, not in the app (search snippet) — [Bible Gateway support](https://www.biblegateway.com/support/KA-01410)
- Data: possible locations are based on the Zondervan Encyclopedia of the Bible and Zondervan Atlas of the Bible; a "?" marks places where scholars are uncertain (search snippet) — [Bible Gateway support](https://www.biblegateway.com/support/KA-01410)
- Clicking a place shows a satellite view rather than a historical-style map (search snippet) — [Bible Gateway blog](https://www.biblegateway.com/blog/?p=57998)

**Bible History Online (bible-history.com)**
- Has an "Interactive Maps" section (Ancient Israel first century, Old Testament Israel, Ancient Jerusalem, Roman Empire) described as "growing"; most other maps are labelled colour or black-and-white images; page is text- and link-heavy with mega-menus and promotes a paid Map Store of "over 1000" maps and images — [Bible History Online maps](https://bible-history.com/maps)

**Bible Maximum (biblemaximum.com/bible-maps)**
- Claims 1,342+ biblical places, 1,335 GPS-mapped, 5,616 verse references, each with a confidence score; browse by book, chapter, or place type; collections such as Paul's journeys; links to quizzes, timeline, lexicons; login option; copyright 2025 — [Bible Maximum](https://biblemaximum.com/bible-maps)
- The page does not name its sources or explain how confidence is calculated — [Bible Maximum](https://biblemaximum.com/bible-maps)

**BibleMap.org**
- Look up a chapter and a Google satellite map appears with that chapter's locations marked (search snippet) — [La Vista map resources](https://www.lavistachurchofchrist.org/cms/resources/map-resources/)

**Biblical Atlas (biblemap.onrender.com)**
- Site markers with descriptions, travel routes of biblical figures, kingdom maps, archaeological sites; copyright 2025; no stated data source, author, search, timeline, or confidence indicator — [Biblical Atlas](https://biblemap.onrender.com/)

**Other small or adjacent web projects**
- The Scriptures, Mapped (BYU): built on OpenBible data, Creative Commons licensed with attribution (search snippet) — [Scriptures, Mapped](https://scriptures.byu.edu/mapscrip/)
- KJV Study (kjvstudy.org, Kenneth Reitz, open source): a May 2025 commit added an SVG map with clickable locations and Paul's journey routes (search snippet) — [kjvstudy commit](https://git.kennethreitz.org/kennethreitz/kjvstudy.org/commit/5b8fbe430c58b6178df9da94bedae448e11ef654)
- OT in Context (otincontext.com): web app with interactive maps, historical timelines, integrated Old Testament text (search snippet, undated) — [Faith News](https://faithnews.cc/?p=34641)
- Biblios Bible Atlas: interactive map of Paul's journeys; select routes or click place names for what happened there (search snippet) — [La Vista map resources](https://www.lavistachurchofchrist.org/cms/resources/map-resources/)

**Important static references (not interactive)**
- Satellite Bible Atlas (Bill Schlegel, via BiblePlaces.com): 85 full-page maps with events marked on satellite imagery plus commentary; digital map files are for owners of the print copy (search snippet) — [BiblePlaces](https://bibleplaces.com/satellite-bible-atlas-schlegel/)

### Inferences
- OpenBible's dataset is the de facto upstream: Theographic takes its coordinates from it, BYU builds on it, and Bible Maximum's count (about 1,340 places with confidence scores) looks like the same data, though that site does not say so.
- The OpenBible repo has not been pushed since November 2021, so its data is stable but frozen; anyone wanting corrections must fork. A pull-request-reviewed dataset would be a real difference.
- Nearly all existing web products are either a data download, a place-by-place page list, or a per-passage map. A single map filtered by book, era, person, journey, place type, and certainty at once was not found.
- Certainty exists in three forms: OpenBible's numeric vote score, Bible Gateway's "?" marker, and Bible Maximum's unexplained score. Only OpenBible shows the sources behind it.

### Gaps
- BibleProject, Bible Odyssey (SBL), and BiblePlaces.com interactive map offerings: searches returned nothing describing them, so I could not confirm what they currently offer or whether they have interactive maps at all.
- STEP Bible (Tyndale House): only an old planning wiki mentioning a gazetteer and Google Earth coordinates was found; I could not confirm the current map feature. STEP place data is confirmed only as an input to OpenBible.
- Exact OpenBible counts of ancient places and modern locations were not stated on the pages read.
- Bible Mapper desktop version and price were not on the home page.
- No launch dates or usage numbers for Bible Maximum, Biblical Atlas, or OT in Context.

## Which mobile apps do this, and how are they rated?

### Takeaway
Mobile Bible map apps are small, mostly solo-developer products with few ratings; the older ones are galleries of static map images with ads, and the richer interactive ones (timeline plus animated journeys) are 2026 newcomers with almost no reviews yet. None found shows location certainty or per-place citations.

### Cited Findings
- Bible Maps: Scripture Atlas (iOS/iPadOS/Mac/Vision, Eyermin Colon Sanchez): free, contains advertising; 4.3/5 from 108 ratings; version 2.0.0; 182 full-colour maps, satellite views, journeys of Abraham, Moses, Paul, timeline by era, quiz mode, notes, offline; English and Spanish — [App Store](https://apps.apple.com/us/app/id1150969326)
- Complaints on that app: "Constant ad & game pop ups" (2024 review); opened in Spanish with no easy switch (2018-2020); zoom missing in 2019-2020 reviews — [App Store](https://apps.apple.com/us/app/id1150969326)
- Bible Map (iPad, Tim Kimberley / Credo House): free; 4.6 average from 241 reviews; listing calls itself the most interactive and thorough Bible map app (search snippet) — [App Store](https://apps.apple.com/us/app/bible-map/id1100364686); [AppFollow](https://apps.appfollow.io/ios/bible-map/1100364686?country=us)
- 179 Bible Atlas Maps (Sand Apps, iOS): $2.99; about 2.25/5 from 12 ratings; a reviewer reports maps must be re-downloaded after each iOS update; last update 2021 per one listing (search snippet) — [App Store](https://apps.apple.com/us/app/sandapps/id434159066); [Marlvel](https://marlvel.ai/apps/179-bible-atlas-maps)
- Bible Trace Maps / BibleChronos (Android, Nivedh Cyrus Labs): free; swimlane lifespan timeline with Ussher/Josephus chronology toggle; 30+ animated journeys with playback; 350+ locations with satellite and terrain views; genealogy trees; 12 tribal territory maps; English/Telugu; released 2026-04-19, updated 2026-08-14; 1.6K+ installs; no ratings yet — [AppGoblin](https://appgoblin.info/apps/com.nivedh.bibletracemaps)
- BibleAtlas (iOS): $1.99; version 1.0 released 2026-01-06; maps cities, regions, rivers, mountains and links them to the text; no ratings at snapshot (search snippet) — [AppsHunter](https://appshunter.io/ios/app/bibleatlas/id6755648201)
- Steadfast: Bible Atlas & Study (iOS): interactive maps and historical timelines for students, teachers, pastors; no rating or price found (search snippet) — [MWM](https://mwm.ai/apps/steadfast-bible-atlas-study/6789970396)
- Gospel Map (iOS): paid New Testament explorer with a timeline of events and authorship (search snippet) — [App Store](https://apps.apple.com/mx/app/gospel-map/id6751021138)
- Bible Maps (palki.maps, Android): free, positioned as every Bible location on an interactive map (search snippet) — [Android-Stats](https://android-stats.com/d/palki.maps)
- Cardinal Bible: includes 16 interactive Bible-map routes; Pro tier $2.99/month or $19.99/year (search snippet; review page itself returned HTTP 429) — [learnofchrist review](https://learnofchrist.com/resources/cardinal-bible)
- Glo Bible: an interactive atlas with virtual tours existed on iOS/Android; a reviewer says it "feels its age"; the Glo Premium DVD is listed unavailable (search snippet) — [learnofchrist review](https://learnofchrist.com/resources/glo-bible); [Cokesbury](https://www.cokesbury.com/9780982697818-GLO-Premium-DVD-ROM)

### Inferences
- Rating counts are tiny (12 to 241), so there is no dominant mobile Bible map app; the category is open.
- Timeline plus animated journeys is becoming table stakes in the newest apps (Bible Trace Maps, Scripture Atlas 2.0, Steadfast), but certainty and citations are still absent on mobile.

### Gaps
- Google Play ratings and install counts for most Android apps were not retrievable.
- Whether Glo Bible is still downloadable or maintained in 2026 is unconfirmed.
- Cardinal Bible's maker, platform, and whether it is Catholic (the name suggests it may be) could not be verified.

## How do major Bible software suites handle maps?

### Takeaway
Logos/Verbum and Accordance have the strongest map tools, but both sit behind paid desktop software; Logos ties its Atlas to events and Factbook entries, while Accordance offers user-controlled layers, animated routes, and 3D. Users on Logos' own forum repeatedly say the Logos Atlas trails Accordance. Evidence for the lighter suites was thin.

### Cited Findings
- Logos Atlas: an interactive map database maintained by Logos that connects biblical events to places; hovering a map feature shows a tooltip with part of the Factbook entry (search snippet) — [Logos support: Using Maps](https://support.logos.com/hc/en-us/articles/360057516851)
- Logos' Biblical Places Maps dataset links 63 maps of places, missionary journeys, and battles to Factbook entries (search snippet) — [Verbum product page](https://verbum.com/product/182764/biblical-places-maps)
- Faithlife (Logos) Factbook place data is one of OpenBible's vote sources — [GitHub repo](https://github.com/openbibleinfo/Bible-Geocoding-Data)
- User complaints about Logos Atlas: Factbook maps do not show where the place is when opened; no way to highlight searched terms in red as Accordance does; a long-time user calls the atlas the one disappointing part and wants places shown in relation to each other; older Biblical Places maps lost their ease of viewing after Logos 4/5 (search snippets, user opinion) — [Logos forum: Biggest Annoyance with the Atlas](https://community.logos.com/discussion/243709/my-biggest-annoyance-with-the-atlas); [Logos forum: Atlas vs. Accordance](https://community.logos.com/forums/t/106385.aspx)
- Accordance Bible Atlas 2.2: $69.90 standalone, also bundled in collections; user picks a background then chooses which sites, roads, regions, and routes to show; stacked layers; animated routes; custom areas viewable in 3D; version 2.2 added high-resolution backgrounds and modern boundaries; not supported on Accordance Mobile or Lite (search snippet) — [Accordance Atlas 2.2](https://www.accordancebible.com/product/accordance-bible-atlas-version-2-2/); [Accordance atlas comparison](https://www.accordancebible.com/Atlas-Comparison/)
- Verbum (Catholic edition of Logos): same Atlas tool, opened via Tools > Reference > Atlas; focuses on events as well as geography (search snippet) — [Verbum support: Using Maps](https://support.verbum.com/hc/en-us/articles/360057046352-Using-Maps)
- Olive Tree: sells print-style atlas titles as in-app books at about $14.99 to $29.99, and its maps appear in Bible Gateway Plus as high-resolution static maps (search snippet) — [Olive Tree store](https://www.olivetree.com/store/product/62586); [Bible Gateway blog](https://www.biblegateway.com/blog/2021/08/bible-gateway-plus-members-gain-biblical-insight-with-zondervan-academic-maps)
- e-Sword: listed as including maps among its resources (search snippet, third-party description) — [AlternativeTo](https://alternativeto.net/software/blue-letter-bible/?p=2)

### Inferences
- In the big suites, maps are a secondary tool attached to a library, not the front door; a free, map-first web page competes on access and focus rather than depth.
- Accordance's "choose which layers show" model is the closest precedent for filter-driven loading, but it is desktop-only and paid.

### Gaps
- The Logos Atlas support article returned HTTP 403, so current package/subscription requirements and pricing were not confirmed.
- Blue Letter Bible, YouVersion, and Glo: no reliable description of a current interactive map feature was found.
- No independent side-by-side review of Logos vs Accordance atlases dated 2025-2026 was found.

## Which have a timeline, animated journeys, searchable places tied to verses, location certainty, or cited sources per place?

### Takeaway
Each feature exists somewhere, but no single product was found with all five. Certainty with visible sources exists only in OpenBible; animated journeys exist in Accordance and the newest mobile apps; verse-tied places are common.

### Cited Findings
- Timeline: Bible Mapper TimeGlider (separate tool) — [BibleMapper.com](https://biblemapper.com/); Bible Trace Maps swimlane timeline with dual chronology — [AppGoblin](https://appgoblin.info/apps/com.nivedh.bibletracemaps); Scripture Atlas timeline by era — [App Store](https://apps.apple.com/us/app/id1150969326); Bible Maximum links out to a timeline — [Bible Maximum](https://biblemaximum.com/bible-maps)
- Animated journeys: Accordance Atlas animated routes (search snippet) — [Accordance Atlas 2.2](https://www.accordancebible.com/product/accordance-bible-atlas-version-2-2/); Bible Trace Maps 30+ journeys with playback — [AppGoblin](https://appgoblin.info/apps/com.nivedh.bibletracemaps)
- Static or selectable journeys: Theographic GeoJSON of Paul's journeys — [Viz.Bible data](https://viz.bible/bible-data/); Biblical Atlas travel routes — [Biblical Atlas](https://biblemap.onrender.com/)
- Places tied to verses: OpenBible place pages and per-book/chapter layers — [OpenBible Geo](https://www.openbible.info/geo/); Theographic links 31,102 verses — [Theographic about](https://theographic.netlify.app/about); Bible Gateway Atlas per passage (search snippet) — [Bible Gateway blog](https://www.biblegateway.com/blog/?p=57998); Bible Mapper PassageBrowser — [BibleMapper.com](https://biblemapper.com/)
- Location certainty: OpenBible numeric confidence from source votes — [GitHub repo](https://github.com/openbibleinfo/Bible-Geocoding-Data); Bible Gateway "?" for uncertain sites (search snippet) — [Bible Gateway support](https://www.biblegateway.com/support/KA-01410); Bible Maximum confidence score, method unexplained — [Bible Maximum](https://biblemaximum.com/bible-maps)
- Cited sources per place: OpenBible lists sources on each place page — [OpenBible Geo](https://www.openbible.info/geo/); Bible Gateway names two Zondervan works for the whole atlas, not per place (search snippet) — [Bible Gateway support](https://www.biblegateway.com/support/KA-01410)
- Era filtering: Bible Mapper desktop shows only places that existed in the chosen era (search snippet) — [The Gospel Coalition](https://www.thegospelcoalition.org/blogs/justin-taylor/bible-mapper/)
- User editing: both open datasets live on GitHub with issues and pull requests enabled, but OpenBible has 3 commits total and no push since 2021 — [GitHub API](https://api.github.com/repos/openbibleinfo/Bible-Geocoding-Data); Theographic is actively pushed — [GitHub API](https://api.github.com/repos/robertrouse/theographic-bible-metadata)

### Inferences
- A draggable timeline that filters the map itself (rather than a separate timeline tool) was not found on the web; it appears only in new mobile apps.
- A short written summary per pin with a certainty badge and source links is not offered by any product found; OpenBible gives sources and scores but not a prose summary.
- Community editing through reviewed pull requests is offered in practice only by Theographic, and that covers the knowledge graph rather than a map site.

### Gaps
- Could not verify whether Logos Atlas exposes any certainty indicator.
- Could not verify whether OpenBible's GitHub actually accepts outside pull requests.

## Are any of them Catholic-specific or use a Catholic canon?

### Takeaway
No Catholic-specific interactive Bible map was found, and no product was confirmed to cover deuterocanonical places (Tobit, Judith, 1-2 Maccabees). The main open dataset is explicitly Protestant-canon.

### Cited Findings
- OpenBible's dataset covers "every place mentioned in the Protestant Bible" — [GitHub repo](https://github.com/openbibleinfo/Bible-Geocoding-Data)
- Theographic covers 66 books using the KJV — [Theographic about](https://theographic.netlify.app/about)
- Bible Maximum's map cites 61 to 66 books — [Bible Maximum](https://biblemaximum.com/bible-maps)
- Verbum is the Catholic-branded edition of Logos and has the same Atlas tool, but no result stated that its maps cover Tobit or Maccabees (search snippet) — [Verbum support: Using Maps](https://support.verbum.com/hc/en-us/articles/360057046352-Using-Maps)
- Ascension's Catholic Bible app (Great Adventure Bible, Bible Timeline) has no interactive map mentioned in its listing; the printed Great Adventure Bible has 16 static maps (search snippet) — [App Store: Ascension](https://apps.apple.com/app/id1660909501); [National Catholic Register](https://www.ncregister.com/blog/sspencer/the-great-adventure-bible-a-new-tool-for-scripture-study)
- Catholic print atlases exist, for example the St. Joseph Atlas of the Bible with 79 maps (search snippet) — [Catholic Book Publishing](https://catholic.store/products/st-joseph-atlas-of-the-bible-79-full-color-maps-of-bible-lands-with-photos-charts-and-diagrams)

### Inferences
- A Catholic-canon interactive map appears to be an unfilled niche. Using OpenBible or Theographic data would leave deuterocanonical places to be added and sourced by hand.

### Gaps
- Did not verify inside Verbum whether deuterocanonical places such as Modein appear in the Atlas.
- Cardinal Bible's denominational stance is unknown (page blocked).
- Non-English Catholic products were not searched.

## What do reviews and users complain about?

### Takeaway
Documented complaints centre on ads and pop-ups in free apps, paywalls and platform limits, weak map-to-text linking in Logos, and stale apps that break after OS updates. Reddit-specific sentiment could not be retrieved.

### Cited Findings
- Ads: "Constant ad & game pop ups" in Bible Maps: Scripture Atlas (2024 review) — [App Store](https://apps.apple.com/us/app/id1150969326)
- Staleness: 179 Bible Atlas Maps rated about 2.25/5; maps reportedly need re-downloading after each iOS update (search snippet) — [App Store](https://apps.apple.com/us/app/sandapps/id434159066)
- Paywall and platform limits: Bible Gateway Atlas is members-only and website-only (search snippet) — [Bible Gateway support](https://www.biblegateway.com/support/KA-01410); Accordance Atlas costs $69.90 and does not run on mobile (search snippet) — [Accordance Atlas 2.2](https://www.accordancebible.com/product/accordance-bible-atlas-version-2-2/)
- Usability in Logos: map does not show where the place is on open; no highlighting of searched places; users keep Accordance just for its atlas (search snippets, forum opinion) — [Logos forum: Biggest Annoyance with the Atlas](https://community.logos.com/discussion/243709/my-biggest-annoyance-with-the-atlas); [Logos forum: Atlas vs. Accordance](https://community.logos.com/forums/t/106385.aspx)
- Accuracy: BYU warns OpenBible-derived placenames are speculative and likely contain inaccuracies (search snippet) — [Scriptures, Mapped](https://scriptures.byu.edu/mapscrip/)
- Satellite rather than period view: Bible Gateway's atlas shows a modern satellite view of a clicked place (search snippet) — [Bible Gateway blog](https://www.biblegateway.com/blog/?p=57998)
- Clutter: Bible History Online's maps page is link-heavy with mega-menus and store promotions — [Bible History Online maps](https://bible-history.com/maps)
- Modern borders are treated as an optional layer by the serious tools: Accordance added modern boundaries in 2.2 and Bible Mapper lets users toggle political boundaries (search snippets) — [Accordance Atlas 2.2](https://www.accordancebible.com/product/accordance-bible-atlas-version-2-2/); [The Gospel Coalition](https://www.thegospelcoalition.org/blogs/justin-taylor/bible-mapper/)

### Inferences
- An ad-free, no-login, no-paywall web map that opens straight onto the place searched addresses the most frequently documented complaints.
- Showing certainty openly answers the accuracy worry rather than hiding it.

### Gaps
- No Reddit threads (r/Bible, r/AcademicBiblical, r/Catholicism) were retrieved; two targeted searches returned none, so community sentiment there is unreported.
- No seminary library guide comparing interactive atlases was found.
- No user complaints specifically about modern borders being shown were found; that concern is unverified.
