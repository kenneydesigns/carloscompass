import { useRef, useState } from 'react'
import type { Place } from './data'
import { formatYear, pack, show } from './data'

// Pin card. On a phone it is a bottom sheet (peek ↔ full, drag the handle);
// from 768 px up the same card is the right-hand side panel (CSS).
export default function Sheet({ place, onClose }: { place: Place; onClose: () => void }) {
  const [full, setFull] = useState(false)
  const [explain, setExplain] = useState(false)
  const startY = useRef<number | null>(null)

  const event = place.events?.[0]
  const cert = place.location?.certainty
  const certText = cert ? pack.certainty?.[cert] : undefined
  const maps = place.location?.lat !== undefined && place.location?.lng !== undefined
    ? `https://www.google.com/maps/search/?api=1&query=${place.location.lat},${place.location.lng}`
    : undefined

  function onPointerDown(e: React.PointerEvent) { startY.current = e.clientY; (e.target as Element).setPointerCapture(e.pointerId) }
  function onPointerUp(e: React.PointerEvent) {
    if (startY.current === null) return
    const dy = e.clientY - startY.current
    startY.current = null
    if (Math.abs(dy) < 8) setFull(f => !f)      // tap toggles
    else if (dy < 0) setFull(true)              // drag up
    else if (full) setFull(false)               // drag down from full
    else onClose()                              // drag down from peek closes
  }

  return (
    <section className={`sheet ${full ? 'full' : ''}`} aria-label="Place details">
      <div className="handle" onPointerDown={onPointerDown} onPointerUp={onPointerUp}
        role="button" tabIndex={0} aria-label={full ? 'Collapse details' : 'Expand details'}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setFull(f => !f)}>
        <span />
      </div>
      <button className="icon-btn sheet-close" onClick={onClose} aria-label="Close details">×</button>

      <div className="card">
        <h1 className="place-name">{show(place.name)}</h1>
        <button className={`certainty ${explain ? 'open' : ''}`} onClick={() => setExplain(x => !x)}
          aria-expanded={explain} title={certText?.explain}>
          {show(certText?.label)}
        </button>
        {explain && <p className="certainty-explain">{show(certText?.explain)}</p>}

        <h2 className="event-title">{show(event?.title)}</h2>
        <p className="event-date">{formatYear(event?.date?.from, event?.date?.approx)}</p>
        <p className="summary">{show(event?.summary)}</p>

        <h3 className="label">In Scripture</h3>
        <ul className="links">
          {(event?.scripture?.length ? event.scripture : [undefined]).map((v, i) => <li key={i}>{show(v)}</li>)}
        </ul>

        <h3 className="label">Sources</h3>
        <ul className="links">
          {/* The event's own sources first, then the place's. */}
          {([...(event?.sources ?? []), ...(place.sources ?? [])].length ? [...(event?.sources ?? []), ...(place.sources ?? [])] : [undefined]).map((s, i) => (
            <li key={i}>{s?.url ? <a href={s.url} target="_blank" rel="noreferrer">{show(s.title)}</a> : show(s?.title)}</li>
          ))}
        </ul>

        {maps && <a className="strong-link" href={maps} target="_blank" rel="noreferrer">View on Google Maps ↗</a>}
        <a className="quiet-link" href={pack.suggest_edit?.phone ? `tel:${pack.suggest_edit.phone}` : undefined}>
          ✎ {show(pack.suggest_edit?.label)} · {show(pack.suggest_edit?.phone)}
        </a>
        <p className="review">✓ Reviewed by {show(place.review?.by)} · {show(place.review?.date)}</p>
      </div>
    </section>
  )
}
