# Pre-build design review (2026-11-13)

Read-only review by a reviewer agent over `docs/`, `index.html`, `design/` and the transcripts
of the parallel chats. Line numbers refer to `docs/vision.md` as of this date. Recommendations
are the reviewer's; **nothing here is decided until Joseph says so.** When a decision is made,
record it in `vision.md` and tick it off here.

## Blocking: decide before code

- [x] **1. The single demo story.** *(Decided: miracles + small Gospel slice.)* The docs describe three: "Follow Paul to Corinth"
  (`presentation.md` slide 6), Eucharistic miracles with no journeys (vision "First dataset"),
  and Life of Jesus / Nazareth → Capernaum (mockup v2). Options: A miracles only; B miracles +
  a small hand-entered Gospel slice with one route; C Paul to Corinth.
  *Recommended: A, with B as a stretch.* The deck's slides 1 and 6 and the mockup content then change.
- [x] **2. How much of the timeline + moving borders is in the hackathon build.** *(Decided: scrubber + 4–6 fixed border years.)* Scrubber,
  century border swaps with preloading, realm names and computed "Then / Today" are all written
  as decided, none marked later. Options: A everything; B scrubber filters pins + 4–6 fixed
  border years, simple swap; C scrubber + modern borders only. *Recommended: B.* Also fix the bar's
  scale: a straight line from Bible times to today squeezes 27–30 AD to nothing; a fixed
  700–2026 range works for a miracles-only demo.
- [x] **3. Is a pin a place or an event?** *(Decided: place with named events.)* The format is one file per place with one `date`, but
  Jerusalem or Capernaum has many dated events, and even Buenos Aires is "1992-1994-1996".
  Options: A one date range per place; B place file with a list of `events` (date, summary,
  verses, sources each); C separate place and event files. *Recommended: B.*
- [ ] **4. Finish the file format.** *(Proposed defaults recorded in vision.md; Joseph can veto.)* Proposed: slug ids (`lanciano`); dates as signed whole years
  (BC negative) + `approx`; structured verse codes (`MAT 4:13`), display names from the pack;
  three fixed certainty keys in the engine, labels from the pack; a separate Church-recognition
  field; `scripture` optional for miracles; verse-link target as a pack setting.
- [x] **5. What the map shows on first load.** *(Decided: empty map centered on the Holy Land.)* Options: A Europe view with the 10–20 featured
  miracles on and the timeline live; B empty map with a prompt; C Holy Land view.
  *Recommended: A.* Name the featured list (candidates from the data chat: Lanciano,
  Bolsena/Orvieto, Siena, Santarém, Buenos Aires, Tixtla, Sokółka, Legnica).
- [x] **6. Which Explore groups appear in the demo.** *(Decided: only groups that have data.)* Books/Eras/People/Journeys would return
  nothing with miracles-only data. Options: A show all; B engine shows only groups that have data;
  C grey out "coming soon". *Recommended: B.* Related: Eras ticks and the scrubber both filter time.
- [ ] **7. Search behavior.** *(Proposed defaults recorded in vision.md; Joseph can veto.)* Still listed as open. Proposed: one small index loaded up front
  (id, name, coords, date, tags), details on click; simple in-browser text match; "or" within a
  group, "and" across groups; typed text becomes a chip; no matches → disabled button reading
  "No places match"; many matches → list in panel + fit map; non-matches hidden, not faded.
  Note: "Search drives the map" (goal 2) is now two clicks away inside Explore.
- [x] **8. Share the docs with the team and pick the build setup.** *(Decided: Vite + React + TypeScript. Sharing: keep local for now; basemap choice still to confirm with Eric and DJ.)* The local folder is not a git
  repo and the GitHub repo holds only `index.html`, so Eric and DJ can't see these decisions.
  The Natural Earth choice replaced a teammate's OpenHistoricalMap idea without their yes.
  Build setup options: A Vite + plain JS + a YAML→JSON script; B React/Next; C no build step.
  *Recommended: push docs/design/packs, confirm the basemap with the team, choose A*, and create
  `engine/` next to `packs/`.

## Soon: first day of build

- [x] **9. Basemap style:** *(Decided: soft tinted.)* quiet, atlas, or tinted (`design/map/renders/`). Realm names on or
  off. Add color roles (`water`, `border-line`, `pin-muted`) to `brand.md`.
- [x] **10. Pin look and states.** *(Decided: plain dots, ring only when selected; appear when reached, then mute.)* `brand.md` says white ring; vision says plain dots; the mockup
  chat dropped rings for bigger pins. Fading rules conflict (earlier places fade vs. not-yet-reached
  at 30%). Certainty on the pin itself and overlapping pins (Italy) are not designed.
- [x] **11. Interface font.** *(Decided: Merriweather Sans.)* `brand.md`: Geologica or Open Sans; mockup: Merriweather Sans;
  `index.html`: Open Sans.
- [x] **12. "Suggest an edit" for the demo, and licenses.** *(Decided: contact Joseph directly, detail to confirm; MIT + CC BY-SA 4.0.)* The repo is private, so a GitHub link
  404s for visitors. Options: A public repo + pre-filled GitHub issue; B Google Form; C "coming
  soon". Forces the license pick (proposed: MIT code, CC BY-SA 4.0 content, GPL border files separate).
- [ ] **13. Phone layout in the demo.** *(Story · Donate: bottom of Explore. Rest in progress in another chat.)* No phone mockup exists; where Story · Donate go is open.

## Later (safe to defer)
Donation provider and Story/Donate pages; pins for the 43 people-based catalogue entries; journey
file format and route player; computed "Then / Today"; dark mode; shareable link per place (cheap,
could move up); whether the parent project gets its own site; AI-assisted search.

## Stale or contradictory text to clean up
- vision "Load little data": first load includes "search", but search now lives only in Explore.
- vision "Data": still gives OpenHistoricalMap as the basemap idea; the Basemap section replaced it.
- vision "First dataset": says the world-view question must be answered first; it has been.
- vision "Design process" and `brand.md` "Look": signature element is "aged-paper map with one
  crimson route", but the basemap is now flat and the first dataset has no routes.
- vision "Mockup v2"/"Next": says the 1748 scan is still the stand-in and v2 review is pending.
- `index.html`: placeholder with an old needle-compass drawing, not the final logo.
- `presentation.md`: slides 1 and 6 conflict with miracles-first.
- `CLAUDE.md` has eight end goals (mobile is 7, hackathon-shippable is 8).

## Decided in chats but missing from vision.md
Candidate featured-miracle list; white rings dropped for bigger pins; the three basemap style
renders and that a pick is pending; the "about 15 places per era" default was dropped with no
replacement; staged catalogue issues (Weingarten and Valencia undated, six shared links,
Paray-le-Monial location guessed).

## Not covered by this review
Full transcripts (only Joseph's messages and each turn's final reply were read), the team Google
Doc, the Canva files, the atlas and tinted renders, and dataset license terms.
