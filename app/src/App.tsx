import { useEffect, useMemo, useState } from 'react'
import MapView from './MapView'
import Explore from './Explore'
import StoryPage from './About'
import Sheet from './Sheet'
import Timeline from './Timeline'
import { aboutText, collectionColor, firstYear, involvedText, matches, pack, places } from './data'

export default function App() {
  const [exploreOpen, setExploreOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [chosen, setChosen] = useState<Record<string, string[]>>({})
  const [applied, setApplied] = useState(false) // nothing on the map until the user chooses
  const [selectedId, setSelectedId] = useState<string>()
  const [year, setYear] = useState<number>()
  const [fitKey, setFitKey] = useState(0) // bumps each time Show is pressed, so the map fits the results
  // Story pages open at #about / #involved, so links work from anywhere, can be shared, and Back closes them.
  const pageFromHash = () => (['#about', '#involved'].includes(window.location.hash) ? window.location.hash.slice(1) : undefined)
  const [page, setPage] = useState<string | undefined>(pageFromHash)
  useEffect(() => {
    const onHash = () => {
      const open = pageFromHash()
      setPage(open)
      if (open) setExploreOpen(false)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  function closePage() {
    if (pageFromHash()) history.replaceState(null, '', window.location.pathname + window.location.search)
    setPage(undefined)
  }

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
      {/* The top bar stays on the story pages too (Joseph, 2026-11-14): Map goes back, and Get involved
          shows on phones there as well, since the Explore footer that holds it on phones is not reachable. */}
      <header className="topbar">
        <a href="#" className="logo-link" aria-label={page ? 'Back to the map' : undefined}
          onClick={e => { e.preventDefault(); closePage() }}>
          <img className="logo" src="/brand/carlo-compass-lockup-horizontal-parchment.svg" alt={pack.name ?? ''} />
        </a>
        <nav className={`toplinks ${page ? 'page-open' : ''}`}>
          {page && <a href="#" onClick={e => { e.preventDefault(); closePage() }}>Map</a>}
          {page !== 'about' && <a href="#about">About</a>}
          {page !== 'involved' && <a className="toplink-involved" href={pack.links?.involved}>Get involved</a>}
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
          <Timeline places={results} year={year} onYear={setYear} raised={!!selected} borders={pack.borders} />
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
                    {collectionColor(c.value) && <span className="dot" style={{ background: collectionColor(c.value) }} aria-hidden />}
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

      {page && (
        <StoryPage key={page} text={page === 'about' ? aboutText : involvedText}
          label={page === 'about' ? 'About' : 'Get involved'} onClose={closePage} />
      )}

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
