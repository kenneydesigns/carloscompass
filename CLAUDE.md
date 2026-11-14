# Carlo's Compass

Interactive Bible map inspired by St. Carlo Acutis. Fall Hackathon 2026 (Joseph, Eric, DJ).
Read [docs/vision.md](docs/vision.md) and [docs/brand.md](docs/brand.md) before proposing or building anything.

## Rule: every addition is checked against the end goals

Before adding a feature, screen, data field, dependency, or design element, compare it
to the goals below and say how it fits. If it doesn't serve at least one goal, or works
against any goal, flag it and don't add it without an explicit OK. When a new decision is
made, update `docs/vision.md`.

## End goals

1. **Map-first and uncluttered.** One screen: map, one side panel, era timeline. Show less
   by default; more on zoom or search. No feature should add menus, clutter, or noise to the map.
2. **Queryable.** Search (place, person, verse) drives the map; matches light up, the rest fades.
3. **Pins are cited summaries.** 2–3 sentences, verses, links to primary/scholarly sources,
   certainty badge. Depth lives behind links, not on the map.
4. **Open and editable like Wikipedia.** Data lives in plain files separate from code;
   edits go through reviewed pull requests; every claim has a source.
5. **One engine, many packs.** Nothing Catholic-specific hard-coded in the engine; content and
   theme (colors named by role) belong to a pack, so other communities can reuse it.
6. **Beautiful and true to Carlo.** Follows the brand guide (navy, parchment, crimson signature,
   gold accents), readable contrast, and stays faithful and respectful to Scripture.
7. **Easy on mobile.** Every screen and feature works well on a phone, by touch, not just on desktop.
8. **Hackathon-shippable.** Only build the Catholic site now; prefer the smallest version that
   demos well over breadth.

## Quick check (answer before adding anything)

- Which goal(s) does this serve?
- Does it add clutter, a new menu, or text on the map? (If yes, rethink.)
- Is it engine or pack? Is anything content-specific leaking into the engine?
- Is every claim it adds sourced?
- Does it fit the hackathon scope, or is it a "later" item for vision.md?

## Rule: no mock data

Never put example or placeholder content in the app code (no sample places, no lorem ipsum).
Everything shown comes from the data files; any empty field renders as "FFFF FFFF FFFF" so
gaps are obvious. See docs/vision.md "No mock data in the app".

## Where work lives (so nothing gets lost)

- This folder is a git repo; GitHub `josephtunge-cyber/carloscompass` (private) is the home.
  Vercel deploys `main` to carloscompass.com and gives every other branch a preview link.
- Commit every prototype or mockup change; try experiments on a branch (e.g. `phone-layout`)
  and open its Vercel preview on a phone. No loose HTML files outside this repo.
- Mockup snapshots: `docs/mockups/`. Decisions: `docs/vision.md`. Look: `docs/brand.md`.
