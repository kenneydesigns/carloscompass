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
  links?: { involved?: string }
  explore_filters?: { key: string; label?: string }[]
  pin_colors?: Record<string, string>   // collection (tag value) -> brand color role
  start_view?: { lng: number; lat: number; zoom: number }
  borders?: { year: number; until?: number; note?: string }
}

const packFiles = import.meta.glob('../../packs/bible-catholic/pack.yaml', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>
const aboutFiles = import.meta.glob('../../packs/bible-catholic/about.md', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>
const placeFiles = import.meta.glob('../../packs/bible-catholic/places/*.yaml', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>

export const pack: Pack = parse(Object.values(packFiles)[0] ?? '') ?? {}
/** The pack's About page text (Markdown-ish, written by a person), or '' when the pack has none. */
export const aboutText: string = Object.values(aboutFiles)[0] ?? ''
const involvedFiles = import.meta.glob('../../packs/bible-catholic/involved.md', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>
/** The pack's "Get involved" page text (same format as about.md), or '' when the pack has none. */
export const involvedText: string = Object.values(involvedFiles)[0] ?? ''
// Pictures for the About page live in the pack's about/ folder; about.md names them as "about/<file>".
const aboutImageFiles = import.meta.glob('../../packs/bible-catholic/about/*.{jpg,jpeg,png,webp}', {
  query: '?url', import: 'default', eager: true,
}) as Record<string, string>
/** URL for a picture named in about.md (e.g. "about/church.jpg"), or undefined if the pack has no such file. */
export const aboutImage = (name: string): string | undefined =>
  Object.entries(aboutImageFiles).find(([path]) => path.endsWith('/' + name))?.[1]

// Drafts show too, everywhere, but each card says plainly that it is not reviewed yet
// (Joseph, 2026-11-13, for the hackathon demo; see vision.md "Drafts on the live site").
export const places: Place[] = Object.values(placeFiles)
  .map(text => parse(text) as Place)
  .filter(p => p && p.id)

export const isReviewed = (p: Place) => !!p.review?.by

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

/** Filter groups built from the data itself; a group with no values is never shown.
 *  When the pack lists `explore_filters`, only those groups appear, in that order, with its labels. */
export function filterGroups(list: Place[]): { key: string; label: string; values: string[] }[] {
  const groups = new Map<string, Set<string>>()
  for (const p of list) {
    for (const [key, raw] of Object.entries(p.tags ?? {})) {
      const vals = Array.isArray(raw) ? raw : [raw]
      for (const v of vals) if (v) (groups.get(key) ?? groups.set(key, new Set()).get(key)!).add(v)
    }
  }
  const all = [...groups].filter(([, v]) => v.size).map(([key, v]) => ({ key, label: key, values: [...v].sort() }))
  const wanted = pack.explore_filters
  if (!wanted?.length) return all
  return wanted.flatMap(w => all.filter(g => g.key === w.key).map(g => ({ ...g, label: w.label ?? g.key })))
}

/** Simple browser-side search over place names and event titles. */
export function matches(p: Place, query: string, chosen: Record<string, string[]>): boolean {
  const q = query.trim().toLowerCase()
  if (q) {
    const hay = [p.name, ...(p.events ?? []).map(e => e.title)].filter(Boolean).join(' ').toLowerCase()
    if (!hay.includes(q)) return false
  }
  // "or" everywhere: every Explore heading is a collection of pins, so ticking boxes under two
  // headings shows both (Joseph, 2026-11-13, when "Historical events" joined "Collections").
  const picks = Object.entries(chosen).filter(([, wanted]) => wanted.length)
  if (!picks.length) return true
  return picks.some(([key, wanted]) => {
    const raw = p.tags?.[key]
    const have = Array.isArray(raw) ? raw : raw ? [raw] : []
    return wanted.some(w => have.includes(w))
  })
}

// Brand color roles a pack may name for its pins (brand.md); anything else falls back to earth.
const ROLES: Record<string, string> = { earth: '#71421D', ink: '#002747', muted: '#5C6B7A', 'gold-text': '#8A6420', gold: '#DBBB7C' }
/** Ring for a light pin color so it reads on parchment (gold gets gold-text). */
export const ringFor = (color: string) => (color === ROLES.gold ? ROLES['gold-text'] : color)

/** Color for one collection value (e.g. "Life of Jesus"), or undefined if the pack gives none. */
export function collectionColor(value: string): string | undefined {
  const role = pack.pin_colors?.[value]
  return role ? ROLES[role] ?? ROLES.earth : undefined
}

/** Pin color for a place: the first of its tag values the pack colors, else earth. */
export function placeColor(p: Place): string {
  for (const raw of Object.values(p.tags ?? {}))
    for (const v of Array.isArray(raw) ? raw : [raw]) {
      const c = v && collectionColor(v)
      if (c) return c
    }
  return ROLES.earth
}
