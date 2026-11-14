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
        <button className="explore-btn" onClick={() => setExploreOpen(true)}>Explore</button>
      </header>

      <main className="stage">
        <MapView
          places={visible}
          selectedId={selected?.id}
          start={pack.start_view ?? { lng: 0, lat: 20, zoom: 2 }}
          borders={pack.borders}
          onSelect={setSelectedId}
        />

        {applied && chips.length > 0 && (
          <div className="chips">
            {chips.map(c => (
              <button key={c.key + c.value} className="chip" onClick={() => removeChip(c.key, c.value)}
                aria-label={`Remove ${c.value}`}>
                {c.value} <span aria-hidden>×</span>
              </button>
            ))}
          </div>
        )}

        {!applied && !exploreOpen && (
          <button className="nudge" onClick={() => setExploreOpen(true)}>
            Choose what to show on the map <span aria-hidden>→</span>
          </button>
        )}

        {applied && results.length > 0 && (
          <Timeline places={results} year={year} onYear={setYear} raised={!!selected} />
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
          onShow={() => { setApplied(true); setYear(undefined); setExploreOpen(false) }}
          onClear={() => { setQuery(''); setChosen({}); setApplied(false); setSelectedId(undefined) }}
        />
      )}
    </div>
  )
}
