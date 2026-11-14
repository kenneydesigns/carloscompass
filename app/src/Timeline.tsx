import type { BorderYear, Place } from './data'
import { borderSpanLabel, borderYearFor, firstYear, formatYear, yearSpan } from './data'

// Live timeline scrubber. Range fits the current results; the whole track is draggable and the
// native range input gives keyboard and touch support for free.
export default function Timeline({ places, year, onYear, raised, borders }: {
  places: Place[]; year?: number; onYear: (y: number | undefined) => void; raised: boolean
  borders?: BorderYear[]
}) {
  const years = places.map(firstYear).filter((y): y is number => y !== undefined)
  if (!years.length) return null
  const min = Math.min(...years)
  const max = Math.max(...years)
  if (min === max) return null
  const value = year ?? max
  const pct = ((value - min) / (max - min)) * 100
  // "c." when an event dated to that year is marked approximate, matching the card.
  const approx = (y: number) => places.some(p => (p.events ?? []).some(e => e.date?.from === y && e.date?.approx))
  const label = (y: number) => formatYear(y, approx(y))
  // What the person is looking at: the borders' period and the whole timeline's length.
  const b = borderYearFor(borders, value)
  const span = yearSpan(min, max)
  const scope = [b && borderSpanLabel(b), `${span.toLocaleString('en-US')} ${span === 1 ? 'year' : 'years'}`]
    .filter(Boolean).join(' · ')

  return (
    <div className={`timeline ${raised ? 'raised' : ''}`}>
      <div className="timeline-row">
        <span>{label(min)}</span>
        <strong>{label(value)}</strong>
        <span>{label(max)}</span>
      </div>
      <div className="timeline-scope">{scope}</div>
      <input
        type="range" min={min} max={max} step={1} value={value}
        onChange={e => onYear(Number(e.target.value))}
        style={{ ['--pct' as string]: `${pct}%` }}
        aria-label="Move through time"
        aria-valuetext={label(value)}
      />
    </div>
  )
}
