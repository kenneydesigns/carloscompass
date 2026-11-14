import { useEffect, useRef } from 'react'
import { AttributionControl, Map as MlMap, Marker, setWorkerUrl, type GeoJSONSource, type MapLayerMouseEvent, type MapMouseEvent, type StyleSpecification } from 'maplibre-gl'
import type { FeatureCollection } from 'geojson'
import type { Place } from './data'
import { hasCoords, pack } from './data'

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
const INK = '#002747'
// Brand color roles a pack may name for its pins (brand.md); unknown roles fall back to earth.
const ROLES: Record<string, string> = { earth: EARTH, ink: INK, muted: '#5C6B7A', 'gold-text': '#8A6420' }
const pinColor = (category?: string) => ROLES[pack.pin_colors?.[category ?? ''] ?? 'earth'] ?? EARTH
const SIGNATURE = '#A80C31'

const GOLD = '#DBBB7C'
// Pale realm tints (soft tinted style): parchment mixed toward gold, earth and muted, as in
// design/map/render_styles.py. Neighbouring realms get different tints (index from the build script).
const TINTS = ['#F1E2BC', '#EBE0C3', '#E6E1CB', '#F5EAC8', '#DFD0B2']

export interface Borders { year: number; until?: number; note?: string }

function makeStyle(borders?: Borders): StyleSpecification {
  const b = borders ? `${BASE}/basemap/borders/${borders.year}` : ''
  return {
    version: 8,
    sources: {
      land: { type: 'geojson', data: BASE + '/basemap/ne_50m_land.geojson' },
      lakes: { type: 'geojson', data: BASE + '/basemap/ne_50m_lakes.geojson' },
      rivers: { type: 'geojson', data: BASE + '/basemap/ne_50m_rivers_lake_centerlines.geojson' },
      ...(borders ? {
        realms: { type: 'geojson', data: `${b}-realms.geojson` },
        realmLines: { type: 'geojson', data: `${b}-lines.geojson` },
      } : {}),
    },
    layers: [
      { id: 'sea', type: 'background', paint: { 'background-color': SEA } },
      { id: 'land', type: 'fill', source: 'land', paint: { 'fill-color': PARCH } },
      ...(borders ? [
        { id: 'realms', type: 'fill', source: 'realms', paint: {
          'fill-color': ['match', ['get', 'tint'], 0, TINTS[0], 1, TINTS[1], 2, TINTS[2], 3, TINTS[3], TINTS[4]],
          'fill-opacity': 0.45,
        } },
        // The realm around the selected pin turns gold (the map's "Then:" line).
        { id: 'realm-selected', type: 'fill', source: 'realms', filter: ['==', ['get', 'name'], '\u0000'],
          paint: { 'fill-color': GOLD, 'fill-opacity': 0.38 } },
        // Dashed: every old border is approximate.
        { id: 'realm-lines', type: 'line', source: 'realmLines', paint: {
          'line-color': EARTH, 'line-opacity': 0.5, 'line-width': 1, 'line-dasharray': [5, 3.5],
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
function realmLabels(m: MlMap, year: number, isOn: () => boolean) {
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
        show = r.right > 0 && r.left < box.width && r.bottom > 0 && r.top < box.height
          && !taken.some(t => r.left < t.right && r.right > t.left && r.top < t.bottom && r.bottom > t.top)
        if (show) taken.push(r)
      }
      l.el.style.display = show ? '' : 'none'
    }
  }
  fetch(`${BASE}/basemap/borders/${year}-labels.json`).then(r => r.json()).then((data: RealmLabel[]) => {
    labels = data.map(d => {
      const el = document.createElement('div')
      el.className = 'realm-label'
      el.textContent = d.name
      el.setAttribute('aria-hidden', 'true')
      return { data: d, el, marker: new Marker({ element: el }).setLngLat([d.lng, d.lat]).addTo(m) }
    })
    place()
  }).catch(() => {})
  m.on('moveend', place)
  m.on('zoom', place)
  return place
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
        color: pinColor(p.category),
      },
    })),
  }
}

interface Props {
  places: Place[]
  selectedId?: string
  start: { lng: number; lat: number; zoom: number }
  borders?: Borders
  year?: number
  fitTo?: Place[]
  fitKey?: number
  onSelect: (id: string | undefined) => void
}

export default function MapView({ places, selectedId, start, borders, year, fitTo, fitKey, onSelect }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const map = useRef<MlMap | null>(null)
  const ready = useRef(false)
  // Borders only belong to their own era (pack `borders.until`); hidden past it.
  const bordersOn = !!borders && (year === undefined || borders.until === undefined || year <= borders.until)
  const bordersOnRef = useRef(bordersOn)
  bordersOnRef.current = bordersOn
  const placeLabels = useRef<() => void>(() => {})
  const latest = useRef({ places, selectedId })
  latest.current = { places, selectedId }

  useEffect(() => {
    const m = new MlMap({
      container: box.current!,
      style: makeStyle(borders),
      center: [start.lng, start.lat],
      zoom: start.zoom,
      minZoom: 2,
      maxZoom: 11,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
    })
    m.touchZoomRotate.disableRotation()
    m.addControl(new AttributionControl({ compact: true, customAttribution: ['Natural Earth', ...(borders?.note ? [borders.note + ' (GPL-3.0)'] : [])] }), 'top-right') // bottom belongs to the search bar
    if (borders) placeLabels.current = realmLabels(m, borders.year, () => bordersOnRef.current)
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
          'circle-stroke-color': ['get', 'color'],
          'circle-stroke-width': ['case', ['get', 'uncertain'], 2, 0],
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

  // Gold realm under the selected pin.
  useEffect(() => {
    const m = map.current
    if (!m || !borders) return
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
    if (m.isStyleLoaded()) apply(); else m.once('idle', apply)
  }, [places, selectedId, borders, bordersOn])

  useEffect(() => {
    const m = map.current
    if (!m || !borders) return
    const apply = () => {
      for (const id of ['realms', 'realm-selected', 'realm-lines'])
        if (m.getLayer(id)) m.setLayoutProperty(id, 'visibility', bordersOn ? 'visible' : 'none')
      placeLabels.current()
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
