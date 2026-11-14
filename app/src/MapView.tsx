import { useEffect, useRef } from 'react'
import { AttributionControl, Map as MlMap, Marker, Popup, setWorkerUrl, type GeoJSONSource, type MapLayerMouseEvent, type MapMouseEvent, type StyleSpecification } from 'maplibre-gl'
import { borderForYear, type BorderPeriod } from './borderPeriods'
import type { FeatureCollection, LineString, Position } from 'geojson'
import type { Place } from './data'
import { hasCoords, placeColor, ringFor } from './data'
import type { HistoricalEvent, LayerSettings, TerritoryProperties, TravelRouteProperties } from './gis'
import { formatAstronomicalYear } from './temporal'
import type { Geometry } from 'geojson'

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

export interface Borders { year: number; until?: number; note?: string; periods?: BorderPeriod[] }

function makeStyle(borders?: Borders): StyleSpecification {
  const b = borders ? `${BASE}/basemap/borders/${borders.year}` : ''
  return {
    version: 8,
    sources: {
      land: { type: 'geojson', data: BASE + '/basemap/ne_50m_land.geojson' },
      lakes: { type: 'geojson', data: BASE + '/basemap/ne_50m_lakes.geojson' },
      rivers: { type: 'geojson', data: BASE + '/basemap/ne_50m_rivers_lake_centerlines.geojson' },
      modern: { type: 'geojson', data: BASE + '/basemap/modern-boundaries.geojson' },
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
          'line-color': EARTH, 'line-width': 1, 'line-dasharray': [5, 3.5],
          // Faint when zoomed out (many small realms would crowd the view), full strength from zoom 5.
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 2, 0.15, 5, 0.5],
        } },
      ] as StyleSpecification['layers'] : []),
      { id: 'coast', type: 'line', source: 'land', paint: { 'line-color': RIVER, 'line-width': 0.8, 'line-opacity': 0.6 } },
      { id: 'lakes', type: 'fill', source: 'lakes', paint: { 'fill-color': SEA } },
      { id: 'rivers', type: 'line', source: 'rivers', paint: { 'line-color': RIVER, 'line-width': 1 } },
      { id: 'modern-lines', type: 'line', source: 'modern', layout: { visibility: 'none' }, paint: { 'line-color': '#426b85', 'line-width': 1.2, 'line-dasharray': [2, 2], 'line-opacity': 0.8 } },
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
        show = r.left >= 8 && r.right <= box.width - 8 && r.top >= 8 && r.bottom <= box.height - 8 // whole name on screen
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
        color: placeColor(p),
        ring: ringFor(placeColor(p)),
      },
    })),
  }
}

function routeStopsToGeoJSON(routes: FeatureCollection<LineString, TravelRouteProperties>): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: routes.features.flatMap(route => route.geometry.coordinates.map((position: Position, index) => ({
      type: 'Feature' as const,
      id: `${route.properties.id}-${index}`,
      geometry: { type: 'Point' as const, coordinates: [position[0], position[1]] },
      properties: { id: route.properties.id, routeGroup: route.properties.routeGroup, stop: route.properties.stops[index] ?? '' },
    }))),
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
  view?: { lng: number; lat: number; zoom: number }
  viewKey: number
  playing: boolean
  focusEvents: HistoricalEvent[]
  focusEventId?: string
  historicalTerritories: FeatureCollection<Geometry, TerritoryProperties>
  historicalEvents: HistoricalEvent[]
  historicalRoutes: FeatureCollection<LineString, TravelRouteProperties>
  selectedRouteId?: string
  layers: LayerSettings
  onEvent: (id: string) => void
  onRoute: (id: string) => void
  onSelect: (id: string | undefined) => void
}

export default function MapView({ places, selectedId, start, borders, year, fitTo, fitKey, view, viewKey, playing, focusEvents, focusEventId, onSelect, historicalTerritories, historicalEvents, historicalRoutes, selectedRouteId, layers, onEvent, onRoute }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const map = useRef<MlMap | null>(null)
  const ready = useRef(false)
  const playbackCamera = useRef({ wasPlaying: false, focusedEventId: '', focusedRouteKey: '' })
  // Borders only belong to their own era (pack `borders.until`); hidden past it.
  const period = borders ? borderForYear(borders.periods ?? [], year ?? borders.year) : undefined
  const bordersOn = !!period
  const bordersOnRef = useRef(bordersOn && period?.year === 100)
  bordersOnRef.current = bordersOn && period?.year === 100
  const placeLabels = useRef<() => void>(() => {})
  const latest = useRef({ places, selectedId })
  latest.current = { places, selectedId }
  const latestGis = useRef({ historicalTerritories, historicalEvents, historicalRoutes, layers })
  latestGis.current = { historicalTerritories, historicalEvents, historicalRoutes, layers }
  const eventData = (list: HistoricalEvent[]): FeatureCollection => ({ type: 'FeatureCollection', features: list.map(e => ({ type: 'Feature', id: e.id, geometry: { type: 'Point', coordinates: e.coordinates }, properties: { id: e.id } })) })
  const updateGis = (m: MlMap) => {
    const g = latestGis.current
    ;(m.getSource('history-territories') as GeoJSONSource | undefined)?.setData(g.historicalTerritories)
    ;(m.getSource('history-events') as GeoJSONSource | undefined)?.setData(eventData(g.historicalEvents))
    ;(m.getSource('history-routes') as GeoJSONSource | undefined)?.setData(g.historicalRoutes)
    ;(m.getSource('history-route-stops') as GeoJSONSource | undefined)?.setData(routeStopsToGeoJSON(g.historicalRoutes))
    for (const id of ['lakes', 'rivers']) if (m.getLayer(id)) m.setLayoutProperty(id, 'visibility', g.layers.physical ? 'visible' : 'none')
    for (const id of ['history-route-lines', 'history-route-hit', 'history-route-stops']) if (m.getLayer(id)) m.setLayoutProperty(id, 'visibility', g.layers.routes ? 'visible' : 'none')
    if (m.getLayer('modern-lines')) m.setLayoutProperty('modern-lines', 'visibility', g.layers.modern ? 'visible' : 'none')
  }

  useEffect(() => {
    // Zoom out until the whole world's width fits the screen (the world is 512 px wide at zoom 0),
    // so a phone can see all of it, not just Europe (Joseph, 2026-11-13). Never tighter than before (2).
    const worldFits = () => Math.min(2, Math.log2(box.current!.clientWidth / 512))
    const m = new MlMap({
      container: box.current!,
      style: makeStyle(borders),
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
    m.addControl(new AttributionControl({ compact: true, customAttribution: ['Historical borders: Andr&#233; Ourednik, historical-basemaps (GPL-3.0)'] }), 'top-right')
    if (borders) placeLabels.current = realmLabels(m, borders.year, () => bordersOnRef.current)
    // Start the credits folded into the (i) button so they never sit under the bottom controls.
    m.once('load', () => m.getContainer().querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show'))
    m.on('load', () => {
      m.addSource('history-territories', { type: 'geojson', data: latestGis.current.historicalTerritories })
      m.addLayer({ id: 'history-fills', type: 'fill', source: 'history-territories', paint: {
        'fill-color': ['match', ['get', 'name'], 'Egypt', '#d3a65c', 'Assyria', '#a45d45', 'Babylonia', '#91699e', 'Achaemenid Empire', '#ab7050', 'Kingdom of David and Solomon', '#c59a35', 'Seleucid Kingdom', '#58889f', 'Ptolemaic Kingdom', '#4d8c83', 'Nabatean Kingdom', '#b1814d', 'Roman Republic', '#b45161', 'Roman Empire', '#a84457', '#718a73'], 'fill-opacity': .32,
      } }, 'coast')
      m.addLayer({ id: 'history-lines', type: 'line', source: 'history-territories', paint: { 'line-color': ['match', ['get', 'name'], 'Egypt', '#936923', 'Assyria', '#853b2b', 'Babylonia', '#674676', 'Achaemenid Empire', '#854327', 'Kingdom of David and Solomon', '#886913', 'Seleucid Kingdom', '#2e627b', 'Ptolemaic Kingdom', '#2d665e', 'Nabatean Kingdom', '#76532b', 'Roman Republic', '#7f2d3b', 'Roman Empire', '#87283d', '#47614a'], 'line-width': 1.4, 'line-dasharray': [4, 3], 'line-opacity': .75 } }, 'coast')
      m.addSource('history-routes', { type: 'geojson', data: latestGis.current.historicalRoutes })
      m.addLayer({ id: 'history-route-lines', type: 'line', source: 'history-routes', paint: {
        'line-color': ['match', ['get', 'routeGroup'], 'jesus', '#a80c31', '#287681'],
        'line-width': 3.2, 'line-dasharray': [2, 1.4], 'line-opacity': .9,
      } }, 'coast')
      m.addLayer({ id: 'history-route-hit', type: 'line', source: 'history-routes', paint: { 'line-color': '#000', 'line-width': 18, 'line-opacity': 0 } }, 'coast')
      m.addSource('history-route-stops', { type: 'geojson', data: routeStopsToGeoJSON(latestGis.current.historicalRoutes) })
      m.addLayer({ id: 'history-route-stops', type: 'circle', source: 'history-route-stops', paint: {
        'circle-radius': 4, 'circle-color': ['match', ['get', 'routeGroup'], 'jesus', '#a80c31', '#287681'],
        'circle-stroke-color': '#fff', 'circle-stroke-width': 1.4,
      } }, 'coast')
      m.on('click', 'history-route-hit', (e: MapLayerMouseEvent) => {
        if (m.queryRenderedFeatures(e.point, { layers: ['history-event-hit', 'pin-hit'].filter(id => !!m.getLayer(id)) }).length) return
        e.preventDefault()
        onRoute(e.features?.[0]?.properties?.id as string)
      })
      m.on('mouseenter', 'history-route-hit', () => (m.getCanvas().style.cursor = 'pointer'))
      m.on('mouseleave', 'history-route-hit', () => (m.getCanvas().style.cursor = ''))
      m.addSource('history-events', { type: 'geojson', data: eventData(latestGis.current.historicalEvents) })
      m.addLayer({ id: 'history-event-pins', type: 'circle', source: 'history-events', paint: { 'circle-radius': 8, 'circle-color': '#a80c31', 'circle-stroke-color': '#fff', 'circle-stroke-width': 2 } })
      m.addLayer({ id: 'history-event-hit', type: 'circle', source: 'history-events', paint: { 'circle-radius': 22, 'circle-color': '#000', 'circle-opacity': 0 } })
      m.on('click', 'history-event-hit', (e: MapLayerMouseEvent) => { e.preventDefault(); onEvent(e.features?.[0]?.properties?.id as string) })
      m.on('click', 'history-fills', (e: MapLayerMouseEvent) => {
        if (m.queryRenderedFeatures(e.point, { layers: ['history-event-hit', 'pin-hit'].filter(id => !!m.getLayer(id)) }).length) return
        const p = e.features?.[0]?.properties
        if (!p) return
        e.preventDefault()
        new Popup().setLngLat(e.lngLat).setText(`${p.name} — approximate reconstruction around ${formatAstronomicalYear(Number(p.snapshotYear))}.`).addTo(m)
      })
      updateGis(m)
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
      m.moveLayer('history-event-pins')
      m.moveLayer('history-event-hit')
      m.on('click', 'pin-hit', (e: MapLayerMouseEvent) => {
        const eventHit = m.queryRenderedFeatures(e.point, { layers: ['history-event-hit'] })[0]
        if (eventHit) { e.preventDefault(); onEvent(eventHit.properties?.id as string); return }
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

  useEffect(() => { if (map.current && ready.current) updateGis(map.current) }, [historicalTerritories, historicalEvents, historicalRoutes, layers])

  useEffect(() => {
    if (!viewKey || !view || !map.current) return
    map.current.flyTo({ center: [view.lng, view.lat], zoom: view.zoom, duration: 1000, essential: true })
  }, [viewKey, view])

  // During playback, keep the historical theater in view and fly to each dated event once.
  // Paused timeline scrubbing does not move the camera; an explicitly selected event does.
  useEffect(() => {
    const m = map.current
    if (!m || !ready.current) return
    const camera = playbackCamera.current
    const flyToEvent = (event: HistoricalEvent) => {
      const regional = /region|battlefield/i.test(event.precision)
      m.flyTo({
        center: event.coordinates,
        zoom: regional ? 5.1 : 6.2,
        duration: 1400,
        essential: true,
        curve: 1.35,
      })
      camera.focusedEventId = event.id
      camera.focusedRouteKey = ''
    }
    const fitRoutes = (routes: FeatureCollection<LineString, TravelRouteProperties>) => {
      const positions = routes.features.flatMap(route => route.geometry.coordinates)
      if (!positions.length) return
      const lngs = positions.map(position => position[0]), lats = positions.map(position => position[1])
      const phone = !window.matchMedia('(min-width: 768px)').matches
      m.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], {
        padding: phone ? { top: 90, bottom: 210, left: 36, right: 36 } : { top: 80, bottom: 210, left: 64, right: 384 },
        maxZoom: 6.2,
        duration: 1400,
      })
      camera.focusedRouteKey = routes.features.map(route => route.properties.id).sort().join('|')
      camera.focusedEventId = ''
    }

    if (focusEventId) {
      const selectedEvent = focusEvents.find(event => event.id === focusEventId)
      if (selectedEvent && camera.focusedEventId !== selectedEvent.id) flyToEvent(selectedEvent)
    }
    if (selectedRouteId) {
      const selectedRoute = historicalRoutes.features.filter(route => route.properties.id === selectedRouteId)
      const routeKey = selectedRoute.map(route => route.properties.id).join('|')
      if (selectedRoute.length && camera.focusedRouteKey !== routeKey) fitRoutes({ ...historicalRoutes, features: selectedRoute })
    }

    if (!playing) {
      camera.wasPlaying = false
      if (!focusEventId) camera.focusedEventId = ''
      if (!selectedRouteId) camera.focusedRouteKey = ''
      return
    }

    const eventAtYear = focusEvents.find(event => year !== undefined && year >= event.startYear && year <= event.endYear)
    const routeKey = historicalRoutes.features.map(route => route.properties.id).sort().join('|')
    if (!camera.wasPlaying) {
      camera.wasPlaying = true
      if (eventAtYear) {
        if (camera.focusedEventId !== eventAtYear.id) flyToEvent(eventAtYear)
      } else if (historicalRoutes.features.length) {
        if (camera.focusedRouteKey !== routeKey) fitRoutes(historicalRoutes)
      } else {
        m.flyTo({ center: [38, 34], zoom: 4.1, duration: 1400, essential: true, curve: 1.35 })
        camera.focusedEventId = ''
        camera.focusedRouteKey = ''
      }
      return
    }

    if (eventAtYear && camera.focusedEventId !== eventAtYear.id) flyToEvent(eventAtYear)
    else if (!eventAtYear && historicalRoutes.features.length && camera.focusedRouteKey !== routeKey) fitRoutes(historicalRoutes)
    else if (!eventAtYear && !historicalRoutes.features.length) {
      camera.focusedEventId = ''
      camera.focusedRouteKey = ''
    }
  }, [playing, year, focusEvents, focusEventId, historicalRoutes, selectedRouteId])

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

  // Fade old boundaries away before replacing their geometry, then draw the new snapshot in.
  // A short debounce avoids loading every snapshot when a user drags quickly.
  useEffect(() => {
    const m = map.current
    if (!m || !borders) return
    let cancelled = false
    let swap: number | undefined
    const start = window.setTimeout(() => {
      const apply = () => {
        if (cancelled || !m.getLayer('realms')) return
        m.setPaintProperty('realms', 'fill-opacity-transition', { duration: 300 })
        m.setPaintProperty('realm-lines', 'line-opacity-transition', { duration: 300 })
        m.setPaintProperty('realms', 'fill-opacity', 0)
        m.setPaintProperty('realm-selected', 'fill-opacity', 0)
        m.setPaintProperty('realm-lines', 'line-opacity', 0)
        // The only prebuilt realm labels belong to the 100 AD dataset.
        bordersOnRef.current = false
        placeLabels.current()
        swap = window.setTimeout(() => {
          if (cancelled || !period) return
          const prefix = `${BASE}/basemap/borders/${period.file}`
          ;(m.getSource('realms') as GeoJSONSource).setData(`${prefix}-realms.geojson`)
          ;(m.getSource('realmLines') as GeoJSONSource).setData(`${prefix}-lines.geojson`)
          m.setFilter('realm-selected', ['==', ['get', 'name'], '\u0000'])
          m.setPaintProperty('realms', 'fill-opacity', 0.45)
          m.setPaintProperty('realm-selected', 'fill-opacity', 0.38)
          m.setPaintProperty('realm-lines', 'line-opacity', ['interpolate', ['linear'], ['zoom'], 2, 0.15, 5, 0.5])
          bordersOnRef.current = period.year === 100
          placeLabels.current()
        }, 320)
      }
      if (m.isStyleLoaded()) apply(); else m.once('idle', apply)
    }, 150)
    return () => { cancelled = true; clearTimeout(start); if (swap) clearTimeout(swap) }
  }, [borders, period])

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
      padding: phone ? { top: 48, bottom: 200, left: 32, right: 32 } : { top: 64, bottom: 200, left: 64, right: 384 },
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
