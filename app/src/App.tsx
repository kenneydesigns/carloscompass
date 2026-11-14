import { useMemo, useState } from 'react'
import MapView from './MapView'
import Explore from './Explore'
import Sheet from './Sheet'
import Timeline from './Timeline'
import { firstYear, matches, pack, places } from './data'

export default function App() {
  const [exploreOpen, setExploreOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [chosen, setChosen] = useState<Record<string, string[]>>({})
  const [applied, setApplied] = useState(false) // nothing on the map until the user chooses
  const [selectedId, setSelectedId] = useState<string>()
  const [year, setYear] = useState<number>()
  const [fitKey, setFitKey] = useState(0) // bumps each time Show is pressed, so the map fits the results

  const results = useMemo(
    () => (applied ? places.filter(p => matches(p, query, chosen)) : []),
    [applied, query, chosen],
  )
  // Timeline: places stay hidden until one of their events is reached.
  const visible = useMemo(
    () => (year === undefined ? results : results.filter(p => (firstYear(p) ?? Infinity) <= year)),
    [results, year],
  )
  const selected = visible.find(p => p.id === selectedId)
  // The year the map is showing: the scrubber's, or the latest result's when it hasn't moved.
  const shownYear = useMemo(() => {
    if (year !== undefined) return year
    const ys = results.map(firstYear).filter((y): y is number => y !== undefined)
    return ys.length ? Math.max(...ys) : undefined
  }, [year, results])
  const chips = [
    ...(query.trim() ? [{ key: '__q', value: query.trim() }] : []),
    ...Object.entries(chosen).flatMap(([key, vals]) => vals.map(value => ({ key, value }))),
  ]

  function removeChip(key: string, value: string) {
    if (key === '__q') setQuery('')
    else setChosen(c => ({ ...c, [key]: c[key].filter(v => v !== value) }))
  }

  return (
    <div className="app">
      <header className="topbar">
        <img className="logo" src="/brand/carlo-compass-lockup-horizontal-parchment.svg" alt={pack.name ?? ''} />
        <nav className="toplinks">
          <a href={pack.links?.story}>Story</a>
          <a href={pack.links?.donate}>Donate</a>
        </nav>
      </header>

      <main className="stage">
        <MapView
          places={visible}
          selectedId={selected?.id}
          start={pack.start_view ?? { lng: 0, lat: 20, zoom: 2 }}
          borders={pack.borders}
          year={shownYear}
          fitTo={results}
          fitKey={fitKey}
          onSelect={setSelectedId}
        />

        {applied && results.length > 0 && (
          <Timeline places={results} year={year} onYear={setYear} raised={!!selected} />
        )}

        {/* The one search box, at the bottom where a thumb reaches it (Joseph, 2026-11-13). Tapping it
            opens Explore; what is showing appears as removable tags inside it. */}
        {!exploreOpen && (
          <div className={`searchbar ${selected ? 'card-open' : ''}`}
            // Anywhere in the bar opens Explore, except a tag (tapping a tag removes it).
            onClick={e => !(e.target as Element).closest('.chip') && setExploreOpen(true)}>
            <button className="search-open" onClick={() => setExploreOpen(true)}
              aria-label={applied && chips.length ? 'Search or explore' : undefined}>
              <svg className="search-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
                <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              {!(applied && chips.length) && <span>Search or explore</span>}
            </button>
            {applied && chips.length > 0 && (
              <div className="bar-chips">
                {chips.map(c => (
                  <button key={c.key + c.value} className="chip" onClick={() => removeChip(c.key, c.value)}
                    aria-label={`Remove ${c.value}`}>
                    {c.value} <span aria-hidden>×</span>
                  </button>
                ))}
              </div>
            )}
            {/* Always-reachable way to add more, even when the tags fill the bar. */}
            {applied && chips.length > 0 && (
              <button className="bar-add" onClick={() => setExploreOpen(true)} aria-label="Add to the map">+</button>
            )}
          </div>
        )}

        {selected && <Sheet place={selected} onClose={() => setSelectedId(undefined)} />}
      </main>

      {exploreOpen && (
        <Explore
          query={query}
          chosen={chosen}
          onQuery={setQuery}
          onChosen={setChosen}
          onClose={() => setExploreOpen(false)}
          onShow={() => { setApplied(true); setYear(undefined); setSelectedId(undefined); setFitKey(k => k + 1); setExploreOpen(false) }}
          onClear={() => { setQuery(''); setChosen({}); setApplied(false); setSelectedId(undefined) }}
        />
      )}
    </div>
  )
}
