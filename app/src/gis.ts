import type { Feature, FeatureCollection, Geometry, LineString } from 'geojson'
import type { TimedFeature } from './temporal'

export type LayerKey = 'kingdoms' | 'cities' | 'routes' | 'events' | 'physical' | 'modern'
export type LayerSettings = Record<LayerKey, boolean>
export interface TerritoryProperties extends TimedFeature {
  id: string; name: string; snapshotYear: number; confidence: string; source: string
}
export interface TerritoryColor { fill: string; stroke: string }
export const territoryColors: Record<string, TerritoryColor> = {
  Egypt: { fill: '#d3a65c', stroke: '#936923' },
  Assyria: { fill: '#a45d45', stroke: '#853b2b' },
  Babylonia: { fill: '#91699e', stroke: '#674676' },
  'Achaemenid Empire': { fill: '#ab7050', stroke: '#854327' },
  'Kingdom of David and Solomon': { fill: '#c59a35', stroke: '#886913' },
  'Seleucid Kingdom': { fill: '#58889f', stroke: '#2e627b' },
  'Ptolemaic Kingdom': { fill: '#4d8c83', stroke: '#2d665e' },
  'Nabatean Kingdom': { fill: '#b1814d', stroke: '#76532b' },
  'Roman Republic': { fill: '#b45161', stroke: '#7f2d3b' },
  'Roman Empire': { fill: '#a84457', stroke: '#87283d' },
}
export const defaultTerritoryColor: TerritoryColor = { fill: '#718a73', stroke: '#47614a' }
export interface HistoricalEvent {
  id: string; title: string; startYear: number; endYear: number; dateLabel: string
  coordinates: [number, number]; description: string; scripture: string[]; people: string[]
  civilization: string; confidence: string; precision: string; source: string
  kind?: 'battle' | 'conquest' | 'biblical'; mapEffect?: string
}
export interface TravelRouteProperties extends TimedFeature {
  id: string; name: string; routeGroup: 'jesus' | 'apostles'; dateLabel: string
  travelers: string; stops: string[]; scripture: string[]; description: string
  confidence: string; precision: string; source: string
}
export type TravelRoute = Feature<LineString, TravelRouteProperties>
const geographyFiles = import.meta.glob('../../packs/bible-catholic/geography/territories.geojson', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const eventFiles = import.meta.glob('../../packs/bible-catholic/geography/events.json', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const routeFiles = import.meta.glob('../../packs/bible-catholic/geography/routes.geojson', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
export const territories = JSON.parse(Object.values(geographyFiles)[0] ?? '{"type":"FeatureCollection","features":[]}') as FeatureCollection<Geometry, TerritoryProperties>
export const historicalEvents = JSON.parse(Object.values(eventFiles)[0] ?? '[]') as HistoricalEvent[]
export const travelRoutes = JSON.parse(Object.values(routeFiles)[0] ?? '{"type":"FeatureCollection","features":[]}') as FeatureCollection<LineString, TravelRouteProperties>
export const defaultLayers: LayerSettings = { kingdoms: true, cities: true, routes: true, events: true, physical: true, modern: false }
