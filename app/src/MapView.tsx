import { useEffect, useRef, useState } from 'react'
import { AttributionControl, Map as MlMap, Marker, setWorkerUrl, type GeoJSONSource, type MapLayerMouseEvent, type MapMouseEvent, type StyleSpecification } from 'maplibre-gl'
import type { FeatureCollection } from 'geojson'
import type { BorderYear, Place } from './data'
import { borderYearFor, hasCoords, placeColor, ringFor } from './data'

// Calm basemap we style ourselves (vision.md "Basemap"): Natural Earth land, lakes and rivers,
// no terrain, no modern labels. Colors are mixed from the brand tokens, as in render_styles.py.
// MapLibre fetches GeoJSON inside its worker, where a path like /basemap/... has no page to resolve against.
const BASE = window.location.origin
// Vite rewrites the worker file it serves (dev) or bundles it away (build), so MapLibre loads an
// untouched copy from public/maplibre (copied by the predev/prebuild scripts).
setWorkerUrl(BASE + '/maplibre/maplibre-gl-worker.mjs')

const PARCH = '#FAF3D7'
const SEA = '#CDD2C9'    // parchment mixed 34% toward muted water
const RIVER = '#8A9FAC'  // parchment mixed 80% toward muted water
const EARTH = '#71421D'
const SIGNATURE = '#A80C31'

const GOLD = '#DBBB7C'
// Pale realm tints (soft tinted style): parchment mixed toward gold, earth and muted, as in
// design/map/render_styles.py. Neighbouring realms get different tints (index from the build script).
const TINTS = ['#F1E2BC', '#EBE0C3', '#E6E1CB', '#F5EAC8', '#DFD0B2']

const EMPTY: FeatureCollection = { type: 'FeatureCollection', features: [] }
const FADE_MS = 150    // short fade when the border year changes
const SETTLE_MS = 150  // on a fast drag, wait until the handle pauses before swapping (vision.md update rules)
const LINE_OPACITY = ['interpolate', ['linear'], ['zoom'], 2, 0.15, 5, 0.5] as const

interface BorderSet { realms: FeatureCollection; lines: FeatureCollection; labels: RealmLabel[] }
const borderCache = new Map<number, Promise<BorderSet>>()
/** Fetch one border year's files once; later calls share the same promise (preload = call early). */
function loadBorders(year: number): Promise<BorderSet> {
  let p = borderCache.get(year)
  if (!p) {
    const get = (f: string) => fetch(`${BASE}/basemap/borders/${year}-${f}`).then(r => {
      if (!r.ok) throw new Error(`${year}-${f}: ${r.status}`)
      return r.json()
    })
    p = Promise.all([get('realms.geojson'), get('lines.geojson'), get('labels.json')])
      .then(([realms, lines, labels]) => ({ realms, lines, labels }))
    p.catch(() => borderCache.delete(year))  // let a later swap retry
    borderCache.set(year, p)
  }
  return p
}

function makeStyle(hasBorders: boolean): StyleSpecification {
  return {
    version: 8,
    sources: {
      land: { type: 'geojson', data: BASE + '/basemap/ne_50m_land.geojson' },
      lakes: { type: 'geojson', data: BASE + '/basemap/ne_50m_lakes.geojson' },
      rivers: { type: 'geojson', data: BASE + '/basemap/ne_50m_rivers_lake_centerlines.geojson' },
      // Filled in by MapView with the border year the timeline is on.
      ...(hasBorders ? {
        realms: { type: 'geojson', data: EMPTY },
        realmLines: { type: 'geojson', data: EMPTY },
      } : {}),
    },
    layers: [
      { id: 'sea', type: 'background', paint: { 'background-color': SEA } },
      { id: 'land', type: 'fill', source: 'land', paint: { 'fill-color': PARCH } },
      ...(hasBorders ? [
        { id: 'realms', type: 'fill', source: 'realms', paint: {
          'fill-color': ['match', ['get', 'tint'], 0, TINTS[0], 1, TINTS[1], 2, TINTS[2], 3, TINTS[3], TINTS[4]],
          'fill-opacity': 0.45, 'fill-opacity-transition': { duration: FADE_MS, delay: 0 },
        } },
        // The realm around the selected pin turns gold (the map's "Then:" line).
        { id: 'realm-selected', type: 'fill', source: 'realms', filter: ['==', ['get', 'name'], '\u0000'],
          paint: { 'fill-color': GOLD, 'fill-opacity': 0.38, 'fill-opacity-transition': { duration: FADE_MS, delay: 0 } } },
        // Dashed: every old border is approximate.
        { id: 'realm-lines', type: 'line', source: 'realmLines', paint: {
          'line-color': EARTH, 'line-width': 1, 'line-dasharray': [5, 3.5],
          // Faint when zoomed out (many small realms would crowd the view), full strength from zoom 5.
          'line-opacity': LINE_OPACITY as unknown as number,
          'line-opacity-transition': { duration: FADE_MS, delay: 0 },
        } },
      ] as StyleSpecification['layers'] : []),
      { id: 'coast', type: 'line', source: 'land', paint: { 'line-color': RIVER, 'line-width': 0.8, 'line-opacity': 0.6 } },
      { id: 'lakes', type: 'fill', source: 'lakes', paint: { 'fill-color': SEA } },
      { id: 'rivers', type: 'line', source: 'rivers', paint: { 'line-color': RIVER, 'line-width': 1 } },
    ],
  }
}

interface RealmLabel { name: string; lng: number; lat: number; minzoom: number }

/** Realm names as small-caps HTML labels (no font server needed), shown only where they fit
 *  and never overlapping each other. */
function realmLabels(m: MlMap, isOn: () => boolean) {
  let labels: { data: RealmLabel; marker: Marker; el: HTMLDivElement }[] = []
  const place = () => {
    const z = m.getZoom()
    const on = isOn()
    const taken: DOMRect[] = []
    const box = m.getContainer().getBoundingClientRect()
    for (const l of labels) {
      let show = on && z >= l.data.minzoom
      if (show) {
        const p = m.project([l.data.lng, l.data.lat])
        const w = l.el.offsetWidth || l.data.name.length * 11, h = 20
        const r = new DOMRect(p.x - w / 2, p.y - h / 2, w, h)
        show = r.left >= 8 && r.right <= box.width - 8 && r.top >= 8 && r.bottom <= box.height - 8 // whole name on screen
          && !taken.some(t => r.left < t.right && r.right > t.left && r.top < t.bottom && r.bottom > t.top)
        if (show) taken.push(r)
      }
      l.el.style.display = show ? '' : 'none'
    }
  }
  /** Replace the names with another border year's. */
  const set = (data: RealmLabel[]) => {
    for (const l of labels) l.marker.remove()
    labels = data.map(d => {
      const el = document.createElement('div')
      el.className = 'realm-label'
      el.textContent = d.name
      el.setAttribute('aria-hidden', 'true')
      return { data: d, el, marker: new Marker({ element: el }).setLngLat([d.lng, d.lat]).addTo(m) }
    })
    place()
  }
  m.on('moveend', place)
  m.on('zoom', place)
  return { place, set }
}

function toGeoJSON(list: Place[], selectedId?: string): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: list.filter(hasCoords).map(p => ({
      type: 'Feature',
      id: p.id,
      geometry: { type: 'Point', coordinates: [p.location!.lng!, p.location!.lat!] },
      properties: {
        id: p.id,
        selected: p.id === selectedId,
        uncertain: p.location?.certainty === 'uncertain',
        color: placeColor(p),
        ring: ringFor(placeColor(p)),
      },
    })),
  }
}

interface Props {
  places: Place[]
  selectedId?: string
  start: { lng: number; lat: number; zoom: number }
  borders?: BorderYear[]
  year?: number
  fitTo?: Place[]
  fitKey?: number
  onSelect: (id: string | undefined) => void
}

export default function MapView({ places, selectedId, start, borders, year, fitTo, fitKey, onSelect }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const map = useRef<MlMap | null>(null)
  const ready = useRef(false)
  // The border year the timeline is on (pack `borders`); none outside every range.
  const wanted = borderYearFor(borders, year)
  // The border year actually on screen: it trails `wanted` by a short pause, so a fast drag
  // across centuries doesn't flash through each one (vision.md "Update rules").
  const [shown, setShown] = useState<BorderYear>()
  const bordersOn = !!shown
  const bordersOnRef = useRef(bordersOn)
  bordersOnRef.current = bordersOn
  const labelsCtl = useRef<{ place: () => void; set: (d: RealmLabel[]) => void }>(undefined)
  const attrib = useRef<AttributionControl>(undefined)
  const swapSeq = useRef(0)  // so a late fade-in from an older swap can't undo a newer fade-out
  const latest = useRef({ places, selectedId })
  latest.current = { places, selectedId }

  useEffect(() => {
    // Zoom out until the whole world's width fits the screen (the world is 512 px wide at zoom 0),
    // so a phone can see all of it, not just Europe (Joseph, 2026-11-13). Never tighter than before (2).
    const worldFits = () => Math.min(2, Math.log2(box.current!.clientWidth / 512))
    const m = new MlMap({
      container: box.current!,
      style: makeStyle(!!borders?.length),
      center: [start.lng, start.lat],
      zoom: start.zoom,
      minZoom: worldFits(),
      maxZoom: 11,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
    })
    m.touchZoomRotate.disableRotation()
    m.on('resize', () => m.setMinZoom(worldFits()))
    attrib.current = new AttributionControl({ compact: true })
    m.addControl(attrib.current, 'top-right') // bottom belongs to the search bar
    if (borders?.length) labelsCtl.current = realmLabels(m, () => bordersOnRef.current)
    // Start the credits folded into the (i) button so they never sit under the bottom controls.
    m.once('load', () => m.getContainer().querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show'))
    m.on('load', () => {
      m.addSource('places', { type: 'geojson', data: toGeoJSON(latest.current.places, latest.current.selectedId) })
      // Pin look (brand.md): 12 px earth dot; uncertain = hollow; selected = 16 px crimson, white ring.
      m.addLayer({
        id: 'pins', type: 'circle', source: 'places',
        filter: ['!', ['get', 'selected']],
        paint: {
          'circle-radius': 6,
          'circle-color': ['case', ['get', 'uncertain'], 'rgba(0,0,0,0)', ['get', 'color']],
          'circle-stroke-color': ['get', 'ring'],
          'circle-stroke-width': ['case', ['get', 'uncertain'], 2, ['!=', ['get', 'ring'], ['get', 'color']], 1.5, 0],
        },
      })
      m.addLayer({
        id: 'pin-selected', type: 'circle', source: 'places',
        filter: ['get', 'selected'],
        paint: { 'circle-radius': 8, 'circle-color': SIGNATURE, 'circle-stroke-color': '#fff', 'circle-stroke-width': 3 },
      })
      // Invisible 44 px tap target around every pin (touch rule in brand.md).
      m.addLayer({
        id: 'pin-hit', type: 'circle', source: 'places',
        paint: { 'circle-radius': 22, 'circle-color': '#000', 'circle-opacity': 0 },
      })
      m.on('click', 'pin-hit', (e: MapLayerMouseEvent) => {
        e.preventDefault()
        onSelect(e.features?.[0]?.properties?.id as string)
      })
      m.on('click', (e: MapMouseEvent) => { if (!e.defaultPrevented) onSelect(undefined) })
      m.on('mouseenter', 'pin-hit', () => (m.getCanvas().style.cursor = 'pointer'))
      m.on('mouseleave', 'pin-hit', () => (m.getCanvas().style.cursor = ''))
      ready.current = true
    })
    map.current = m
    return () => { m.remove(); map.current = null; ready.current = false }
    // The map is created once; data updates go through the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const m = map.current
    if (!m || !ready.current) return
    ;(m.getSource('places') as GeoJSONSource | undefined)?.setData(toGeoJSON(places, selectedId))
  }, [places, selectedId])

  // Swap the border set when the timeline crosses into another border year: wait for the handle
  // to settle, fade out, swap the (already loaded) data and names, fade back in.
  useEffect(() => {
    const m = map.current
    if (!m || !borders?.length) return
    // Keep the years either side of the one on screen loaded ahead, so the next swap is quick (most
    // of all on phones). Only around the settled year: a fast drag doesn't fetch every year it crosses.
    const i = borders.indexOf((shown ?? wanted)!)
    for (const j of [i - 1, i + 1]) if (i >= 0 && borders[j]) loadBorders(borders[j].year).catch(() => {})
    if (wanted === shown) return
    let cancelled = false
    const realmPaint: [string, string, number][] = [
      ['realms', 'fill-opacity', 0.45], ['realm-selected', 'fill-opacity', 0.38], ['realm-lines', 'line-opacity', LINE_OPACITY as unknown as number],
    ]
    const fade = (on: boolean) => {
      for (const [id, prop, v] of realmPaint) if (m.getLayer(id)) m.setPaintProperty(id, prop as 'fill-opacity', on ? v : 0)
      m.getContainer().classList.toggle('borders-fading', !on)
    }
    const wait = (ms: number) => new Promise(r => setTimeout(r, ms))
    const t = window.setTimeout(async () => {
      if (!wanted) { setShown(undefined); return }  // outside every range: the visibility effect hides them
      let data: BorderSet
      try { data = await loadBorders(wanted.year) } catch { return }
      if (cancelled) return
      if (!ready.current) await new Promise(r => m.once('load', r))
      const seq = ++swapSeq.current
      if (shown) { fade(false); await wait(FADE_MS) } else fade(false)
      if (cancelled) { fade(true); return }
      ;(m.getSource('realms') as GeoJSONSource | undefined)?.setData(data.realms)
      ;(m.getSource('realmLines') as GeoJSONSource | undefined)?.setData(data.lines)
      labelsCtl.current?.set(data.labels)
      setShown(wanted)
      // Fade back in once the new set has drawn (or after a moment, if the map isn't drawing).
      let done = false
      const show = () => { if (!done && seq === swapSeq.current) { done = true; fade(true) } }
      m.once('idle', show)
      setTimeout(show, 300)
    }, shown ? SETTLE_MS : 0)
    return () => { cancelled = true; clearTimeout(t) }
  }, [borders, wanted, shown])

  // The credits (the (i) button) name the border year on screen.
  useEffect(() => {
    const m = map.current
    if (!m || !borders?.length) return
    const open = m.getContainer().querySelector('.maplibregl-ctrl-attrib')?.classList.contains('maplibregl-compact-show')
    if (attrib.current) m.removeControl(attrib.current)
    attrib.current = new AttributionControl({ compact: true, customAttribution: shown?.note ? [shown.note] : [] })
    m.addControl(attrib.current, 'top-right')
    m.getContainer().querySelector('.maplibregl-ctrl-attrib')?.classList.toggle('maplibregl-compact-show', !!open)
  }, [borders, shown])

  // Gold realm under the selected pin.
  useEffect(() => {
    const m = map.current
    if (!m || !borders?.length) return
    const p = places.find(x => x.id === selectedId)
    const apply = () => {
      if (!m.getLayer('realm-selected')) return
      let name: string | undefined
      if (p && hasCoords(p) && bordersOnRef.current) {
        const hit = m.queryRenderedFeatures(m.project([p.location!.lng!, p.location!.lat!]), { layers: ['realms'] })
        name = hit[0]?.properties?.name as string | undefined
      }
      m.setFilter('realm-selected', ['==', ['get', 'name'], name ?? '\u0000'])
    }
    // Again once a just-swapped border set has rendered.
    if (m.isStyleLoaded()) apply()
    m.once('idle', apply)
  }, [places, selectedId, borders, shown])

  useEffect(() => {
    const m = map.current
    if (!m || !borders?.length) return
    const apply = () => {
      for (const id of ['realms', 'realm-selected', 'realm-lines'])
        if (m.getLayer(id)) m.setLayoutProperty(id, 'visibility', bordersOn ? 'visible' : 'none')
      labelsCtl.current?.place()
    }
    if (m.isStyleLoaded()) apply(); else m.once('idle', apply)
  }, [borders, bordersOn])

  // Each time Show is pressed, fit the map to the results (open space only: not under the panels).
  useEffect(() => {
    const m = map.current
    const pts = (fitTo ?? []).filter(hasCoords).map(p => [p.location!.lng!, p.location!.lat!] as [number, number])
    if (!m || !fitKey || !pts.length) return
    // With many results, fit where most of them are (middle 80%), so a few far-off ones don't
    // leave a phone looking at empty ocean; they stay a pan away.
    const trim = (v: number[]) => {
      const s = [...v].sort((a, b) => a - b)
      if (s.length < 10) return s
      const k = Math.floor(s.length * 0.1)
      return s.slice(k, s.length - k)
    }
    const lngs = trim(pts.map(p => p[0])), lats = trim(pts.map(p => p[1]))
    const phone = !window.matchMedia('(min-width: 768px)').matches
    m.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], {
      padding: phone ? { top: 48, bottom: 200, left: 32, right: 32 } : { top: 64, bottom: 200, left: 64, right: 64 },
      maxZoom: 7, duration: 600,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey])

  // Keep the selected pin in the part of the map the card (and, on a phone, the raised timeline)
  // doesn't cover. Only moves the map when the pin would be hidden.
  useEffect(() => {
    const m = map.current
    const p = places.find(x => x.id === selectedId)
    if (!m || !p || !hasCoords(p)) return
    const lngLat: [number, number] = [p.location!.lng!, p.location!.lat!]
    const box = m.getContainer().getBoundingClientRect()
    const phone = !window.matchMedia('(min-width: 768px)').matches
    const timelineH = (document.querySelector('.timeline') as HTMLElement | null)?.offsetHeight ?? 0
    const margin = 32
    const padding = phone
      ? { top: margin + 56, left: margin, right: margin, bottom: window.innerHeight * 0.42 + timelineH + 16 }
      : { top: margin, left: margin, right: 400 + margin, bottom: timelineH + 24 + 64 + margin }
    const pt = m.project(lngLat)
    const hidden = pt.x < padding.left || pt.x > box.width - padding.right
      || pt.y < padding.top || pt.y > box.height - padding.bottom
    if (hidden) {
      const cx = (padding.left + box.width - padding.right) / 2
      const cy = (padding.top + box.height - padding.bottom) / 2
      m.easeTo({ center: lngLat, offset: [cx - box.width / 2, cy - box.height / 2], duration: 400 })
    }
  }, [places, selectedId])

  return <div ref={box} className="map" aria-label="Map" role="region" />
}
