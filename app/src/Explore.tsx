import { useEffect, useRef } from 'react'
import { collectionColor, filterGroups, matches, pack, places } from './data'

interface Props {
  query: string
  chosen: Record<string, string[]>
  onQuery: (q: string) => void
  onChosen: (c: Record<string, string[]>) => void
  onClose: () => void
  onShow: () => void
  onClear: () => void
}

// Explore overlay, opened from the search bar at the bottom: the only search on the site. Groups appear only when the data has values
// for them (pre-build decision), so with no reviewed places it is just the search box.
export default function Explore({ query, chosen, onQuery, onChosen, onClose, onShow, onClear }: Props) {
  const groups = filterGroups(places)
  const count = places.filter(p => matches(p, query, chosen)).length
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function toggle(key: string, value: string) {
    const cur = chosen[key] ?? []
    onChosen({ ...chosen, [key]: cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value] })
  }

  return (
    <div className="scrim" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="explore" role="dialog" aria-modal="true" aria-labelledby="explore-title" ref={panel}>
        <div className="explore-head">
          <h2 id="explore-title">Explore the map</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="explore-body">
          <label className="search">
            <span className="visually-hidden">Search places, people or events</span>
            <input
              type="search"
              value={query}
              onChange={e => onQuery(e.target.value)}
              placeholder="Search places, people or events"
              enterKeyHint="search"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && count > 0 && onShow()}
            />
          </label>

          {groups.map(g => (
            <fieldset key={g.key} className="group">
              <legend>{g.label}</legend>
              {g.values.map(v => (
                <label key={v} className="check">
                  <input type="checkbox" checked={(chosen[g.key] ?? []).includes(v)} onChange={() => toggle(g.key, v)} />
                  {collectionColor(v) && <span className="dot" style={{ background: collectionColor(v) }} aria-hidden />}
                  <span>{v}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </div>

        <div className="explore-foot">
          <button className="link-btn" onClick={onClear}>Clear all</button>
          <button className="primary" disabled={count === 0} onClick={onShow}>
            {count === 0 ? 'No places match' : `Show ${count} on map`}
          </button>
        </div>

        {/* Phone: Story · Donate live here instead of a menu (pre-build decision). */}
        <nav className="explore-links">
          <a href={pack.links?.story}>Story</a>
          <span aria-hidden>·</span>
          <a href={pack.links?.donate}>Donate</a>
        </nav>
      </div>
    </div>
  )
}
