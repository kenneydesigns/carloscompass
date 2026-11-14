import type { Place } from './data'
import { firstYear, formatYear } from './data'

// Live timeline scrubber. Range fits the current results; the whole track is draggable and the
// native range input gives keyboard and touch support for free.
export default function Timeline({ places, year, onYear, raised }: {
  places: Place[]; year?: number; onYear: (y: number | undefined) => void; raised: boolean
}) {
  const years = places.map(firstYear).filter((y): y is number => y !== undefined)
  if (!years.length) return null
  const min = Math.min(...years)
  const max = Math.max(...years)
  if (min === max) return null
  const value = year ?? max
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className={`timeline ${raised ? 'raised' : ''}`}>
      <div className="timeline-row">
        <span>{formatYear(min)}</span>
        <strong>{formatYear(value)}</strong>
        <span>{formatYear(max)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={1} value={value}
        onChange={e => onYear(Number(e.target.value))}
        style={{ ['--pct' as string]: `${pct}%` }}
        aria-label="Move through time"
        aria-valuetext={formatYear(value)}
      />
    </div>
  )
}
