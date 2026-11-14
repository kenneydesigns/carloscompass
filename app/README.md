# Carlo's Compass

Interactive historical geography prototype built with React, TypeScript, Vite and MapLibre. No map API key or paid service is required.

## Run locally

Install Node.js LTS (the installed Vite version requires a recent Node.js release). Open a new PowerShell window:

```powershell
cd "C:\Users\timot\Downloads\carloscompass-main\carloscompass-main\app"
npm.cmd ci
npm.cmd run dev
```

Open the Local URL printed by Vite. On macOS or Linux use `npm ci` and `npm run dev`. Build with `npm run build`; test with `npm test` (Node 22.18+ with built-in TypeScript stripping, or a recent Node LTS).

## Explore the prototype

The timeline runs from 2000 BC through AD 100; the slider, era menu and playback all update one shared year. Open Layers to control historic territories, cities, events, natural water features and optional modern boundaries. Click a crimson event marker to read its source, Scripture reference, confidence and location precision. Click a territory for its name and snapshot year. The land / Jerusalem view and Explore search remain available.

The map defaults to historic mode without modern roads, airports, labels or political boundaries. The optional comparison boundaries are Natural Earth 1:110m data. Land, lakes, rivers and present-day boundaries come from Natural Earth, which dedicates its datasets to the public domain: https://www.naturalearthdata.com/about/terms-of-use/.

## Historical data and limitations

The boundary polygons are adapted from the world-scale historical-basemaps project by André Ourednik, https://github.com/aourednik/historical-basemaps. That data is licensed GPL-3.0; the full license is in `../design/map/data/historical-basemaps/LICENSE`. The derivative GeoJSON is at `../packs/bible-catholic/geography/territories.geojson`. The app selects a small subset of named features, rounds coordinates for most snapshots and adds dates, provenance and uncertainty metadata. The derived features retain the underlying source's geometry; they are not independent archaeological verification. Borders are approximate, selected from discrete snapshot years, and their display windows are a UI approximation, not a claim that the borders held constant. There are explicit gaps: no borders appear where a suitable snapshot is not available. Do not infer that the exact point of a political transition is represented.

The source's 1500 BC and 700 BC files contain identical early-region shapes to the 1000 BC file, including an anachronistic united kingdom in 700 BC. Those two snapshots were excluded pending research. The 100 AD Roman world boundary is not a reconstruction of Judea's provincial boundaries. Separate polygons for Israel, Judah, and the Neo-Babylonian Empire were not independently sourced and are not represented; the product must not be described as a complete historical atlas. Verify source compatibility and licensing before any public release.

Events in `../packs/bible-catholic/geography/events.json` are an intentionally small, draft sample; date ranges and city-level coordinates are approximate. Historically disputed or undated traditions are not forced into precise coordinates. Travel routes have no dataset yet; the control says data is pending. No topographic terrain model is included. Historical city walls, city-scale reconstructions and 3D geometry are not included.

This version's timeline ends at AD 100. Existing post-biblical Eucharistic miracle content remains in the pack, but is outside the time window and does not appear as a historical pin here. Restoring a separate wider chronology is a future task.

Internally time uses astronomical years: `0 = 1 BC`, `-1 = 2 BC`, and `1 = AD 1`. Existing pack files use the older negative-BC convention; conversion occurs at the integration boundary. GeoJSON intervals are inclusive. Openly licensed or permissioned datasets, event-level citations, source review, accessibility testing, terrain, route data and a separate later-history timeline are priorities for future work.
