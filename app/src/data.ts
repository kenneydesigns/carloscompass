import { parse } from 'yaml'

// Everything the UI shows comes from the pack's files. No sample content lives in the code
// (CLAUDE.md "no mock data"): an empty field renders as the placeholder below.
export const MISSING = 'FFFF FFFF FFFF'

export type Certainty = 'confirmed' | 'probable' | 'uncertain'

export interface Source { id?: string; kind?: string; title?: string; url?: string }
export interface PlaceEvent {
  title?: string
  date?: { from?: number; to?: number; approx?: boolean }
  summary?: string
  scripture?: string[]
  sources?: Source[]
}
export interface Place {
  id: string
  name?: string
  category?: string
  location?: { lat?: number; lng?: number; certainty?: Certainty }
  events?: PlaceEvent[]
  tags?: Record<string, string[] | string>
  sources?: Source[]
  review?: { by?: string; date?: string }
}
export interface Pack {
  name?: string
  certainty?: Partial<Record<Certainty, { label?: string; explain?: string }>>
  suggest_edit?: { label?: string; phone?: string }
  links?: { story?: string; donate?: string }
  start_view?: { lng: number; lat: number; zoom: number }
  borders?: { year: number; note?: string }
}

const packFiles = import.meta.glob('../../packs/bible-catholic/pack.yaml', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>
const placeFiles = import.meta.glob('../../packs/bible-catholic/places/*.yaml', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>

export const pack: Pack = parse(Object.values(packFiles)[0] ?? '') ?? {}

// Only reviewed places reach the built site (vision.md "Own database, not live AI").
// The local dev server also shows unreviewed drafts so the team can test them; their review
// line then reads as the missing-data placeholder.
export const places: Place[] = Object.values(placeFiles)
  .map(text => parse(text) as Place)
  .filter(p => p && p.id && (import.meta.env.DEV || p.review?.by))

/** Text for a field, or the placeholder when the data has nothing. */
export function show(value: unknown): string {
  if (value === undefined || value === null) return MISSING
  const s = String(value).trim()
  return s === '' ? MISSING : s
}

export function hasCoords(p: Place): boolean {
  return typeof p.location?.lat === 'number' && typeof p.location?.lng === 'number'
}

/** Earliest event year for a place (used by the timeline), or undefined. */
export function firstYear(p: Place): number | undefined {
  const years = (p.events ?? []).map(e => e.date?.from).filter((y): y is number => typeof y === 'number')
  return years.length ? Math.min(...years) : undefined
}

export function formatYear(y: number | undefined, approx = false): string {
  if (y === undefined) return MISSING
  const label = y < 0 ? `${-y} BC` : `${y} AD`
  return approx ? `c. ${label}` : label
}

/** Filter groups built from the data itself; a group with no values is never shown. */
export function filterGroups(list: Place[]): { key: string; values: string[] }[] {
  const groups = new Map<string, Set<string>>()
  for (const p of list) {
    for (const [key, raw] of Object.entries(p.tags ?? {})) {
      const vals = Array.isArray(raw) ? raw : [raw]
      for (const v of vals) if (v) (groups.get(key) ?? groups.set(key, new Set()).get(key)!).add(v)
    }
  }
  return [...groups].filter(([, v]) => v.size).map(([key, v]) => ({ key, values: [...v].sort() }))
}

/** Simple browser-side search over place names and event titles. */
export function matches(p: Place, query: string, chosen: Record<string, string[]>): boolean {
  const q = query.trim().toLowerCase()
  if (q) {
    const hay = [p.name, ...(p.events ?? []).map(e => e.title)].filter(Boolean).join(' ').toLowerCase()
    if (!hay.includes(q)) return false
  }
  // "or" within a group, "and" across groups
  for (const [key, wanted] of Object.entries(chosen)) {
    if (!wanted.length) continue
    const raw = p.tags?.[key]
    const have = Array.isArray(raw) ? raw : raw ? [raw] : []
    if (!wanted.some(w => have.includes(w))) return false
  }
  return true
}
