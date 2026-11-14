import type { HistoricalEvent } from './gis'
export default function EventPanel({ event, onClose }: { event: HistoricalEvent; onClose: () => void }) {
  return <aside className="event-panel" aria-label="Event details">
    <button className="icon-btn event-close" onClick={onClose} aria-label="Close event">×</button>
    <p className="history-kicker">Biblical event · {event.confidence}</p>
    <h2>{event.title}</h2><p className="event-date">{event.dateLabel}</p>
    <p>{event.description}</p><h3>In Scripture</h3>
    <p>{event.scripture.join('; ')}</p><h3>Historical context</h3>
    <p>{event.civilization} · {event.people.join(', ')}</p>
    <p>Location precision: {event.precision}</p>
    <a href={event.source} target="_blank" rel="noreferrer">Read the source ↗</a>
    <p className="review draft">Draft — not yet reviewed by a person</p>
  </aside>
}
