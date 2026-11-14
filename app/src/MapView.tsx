import { useEffect, useRef } from 'react'
import { AttributionControl, Map as MlMap, setWorkerUrl, type GeoJSONSource, type MapLayerMouseEvent, type MapMouseEvent, type StyleSpecification } from 'maplibre-gl'
import type { FeatureCollection } from 'geojson'
import type { Place } from './data'
import { hasCoords } from './data'

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

const style: StyleSpecification = {
  version: 8,
  sources: {
    land: { type: 'geojson', data: BASE + '/basemap/ne_50m_land.geojson' },
    lakes: { type: 'geojson', data: BASE + '/basemap/ne_50m_lakes.geojson' },
    rivers: { type: 'geojson', data: BASE + '/basemap/ne_50m_rivers_lake_centerlines.geojson' },
  },
  layers: [
    { id: 'sea', type: 'background', paint: { 'background-color': SEA } },
    { id: 'land', type: 'fill', source: 'land', paint: { 'fill-color': PARCH } },
    { id: 'coast', type: 'line', source: 'land', paint: { 'line-color': RIVER, 'line-width': 0.8, 'line-opacity': 0.6 } },
    { id: 'lakes', type: 'fill', source: 'lakes', paint: { 'fill-color': SEA } },
    { id: 'rivers', type: 'line', source: 'rivers', paint: { 'line-color': RIVER, 'line-width': 1 } },
  ],
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
      },
    })),
  }
}

interface Props {
  places: Place[]
  selectedId?: string
  start: { lng: number; lat: number; zoom: number }
  onSelect: (id: string | undefined) => void
}

export default function MapView({ places, selectedId, start, onSelect }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const map = useRef<MlMap | null>(null)
  const ready = useRef(false)
  const latest = useRef({ places, selectedId })
  latest.current = { places, selectedId }

  useEffect(() => {
    const m = new MlMap({
      container: box.current!,
      style,
      center: [start.lng, start.lat],
      zoom: start.zoom,
      minZoom: 2,
      maxZoom: 11,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
    })
    m.touchZoomRotate.disableRotation()
    m.addControl(new AttributionControl({ compact: true, customAttribution: 'Natural Earth' }))
    m.on('load', () => {
      m.addSource('places', { type: 'geojson', data: toGeoJSON(latest.current.places, latest.current.selectedId) })
      // Pin look (brand.md): 12 px earth dot; uncertain = hollow; selected = 16 px crimson, white ring.
      m.addLayer({
        id: 'pins', type: 'circle', source: 'places',
        filter: ['!', ['get', 'selected']],
        paint: {
          'circle-radius': 6,
          'circle-color': ['case', ['get', 'uncertain'], 'rgba(0,0,0,0)', EARTH],
          'circle-stroke-color': EARTH,
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

  return <div ref={box} className="map" aria-label="Map" role="region" />
}
