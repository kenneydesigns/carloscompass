import { useEffect, useMemo, useState } from 'react'
import MapView from './MapView'
import Explore from './Explore'
import About from './About'
import Sheet from './Sheet'
import Timeline from './Timeline'
import LayerControls from './LayerControls'
import HistoryPane from './HistoryPane'
import { collectionColor, firstYear, matches, pack, places } from './data'
import { historicalEvents, territories, travelRoutes, defaultLayers, type LayerSettings } from './gis'
import { activeAt, advanceYear, formatAstronomicalYear, fromLegacyYear, toLegacyYear, MAX_YEAR } from './temporal'
import { periodAt } from './history'

export default function App() {
  const [exploreOpen, setExploreOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [chosen, setChosen] = useState<Record<string, string[]>>({})
  const [applied, setApplied] = useState(false)
  const [selectedId, setSelectedId] = useState<string>()
  const [eventId, setEventId] = useState<string>()
  const [routeId, setRouteId] = useState<string>()
  const [year, setYear] = useState(30)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(25)
  const [layers, setLayers] = useState<LayerSettings>(defaultLayers)
  const [fitKey, setFitKey] = useState(0)
  const [view, setView] = useState<'land' | 'city'>('land')
  const [viewKey, setViewKey] = useState(0)
  const [aboutOpen, setAboutOpen] = useState(() => window.location.hash === '#about')
  useEffect(() => {
    const onHash = () => { const open = window.location.hash === '#about'; setAboutOpen(open); if (open) setExploreOpen(false) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => {
      const stops = [
        ...historicalEvents.flatMap(event => [event.startYear, event.endYear]),
        ...travelRoutes.features.flatMap(route => [route.properties.startYear, route.properties.endYear]),
      ]
      const next = advanceYear(year, speed, stops)
      setYear(next)
      if (next === MAX_YEAR) setPlaying(false)
    }, 500)
    return () => window.clearTimeout(timer)
  }, [playing, speed, year])
  function closeAbout() {
    if (window.location.hash === '#about') history.replaceState(null, '', window.location.pathname + window.location.search)
    setAboutOpen(false)
  }
  const results = useMemo(() => applied ? places.filter(p => matches(p, query, chosen)) : places.filter(p => ['jerusalem', 'bethlehem', 'nazareth', 'capernaum'].includes(p.id)), [applied, query, chosen])
  const visible = useMemo(() => layers.cities ? results.filter(p => { const y = firstYear(p); return y !== undefined && fromLegacyYear(y) <= year }) : [], [results, year, layers.cities])
  const selected = visible.find(p => p.id === selectedId)
  const activeTerritories = useMemo(() => ({ ...territories, features: layers.kingdoms ? territories.features.filter(f => activeAt(f.properties, year)) : [] }), [year, layers.kingdoms])
  const activeEvents = useMemo(() => layers.events ? historicalEvents.filter(e => activeAt(e, year)) : [], [year, layers.events])
  const activeRoutes = useMemo(() => ({ ...travelRoutes, features: layers.routes ? travelRoutes.features.filter(route => activeAt(route.properties, year)) : [] }), [year, layers.routes])
  const selectedEvent = historicalEvents.find(e => e.id === eventId && activeAt(e, year))
  const selectedRoute = travelRoutes.features.find(route => route.properties.id === routeId && activeAt(route.properties, year))
  const snapshot = activeTerritories.features[0]?.properties.snapshotYear
  const city = pack.city_view
  const cityPeriod = periodAt(city?.periods ?? [], toLegacyYear(year))
  const chips = [ ...(query.trim() ? [{ key: '__q', value: query.trim() }] : []), ...Object.entries(chosen).flatMap(([key, vals]) => vals.map(value => ({ key, value }))) ]
  function changeView(target: 'land' | 'city') { setView(target); setViewKey(k => k + 1); setSelectedId(undefined); setEventId(undefined); setRouteId(undefined) }
  function removeChip(key: string, value: string) { if (key === '__q') setQuery(''); else setChosen(c => ({ ...c, [key]: c[key].filter(v => v !== value) })) }
  return <div className="app">
    <header className="topbar">
      <img className="logo" src="/brand/carlo-compass-lockup-horizontal-parchment.svg" alt={pack.name ?? ''} />
      <nav className="toplinks"><a href="#about">About</a><a className="toplink-donate" href={pack.links?.donate}>Donate</a></nav>
    </header>
    <main className="stage">
      <MapView places={visible} selectedId={selected?.id} start={pack.start_view ?? { lng: 0, lat: 20, zoom: 2 }}
        fitTo={results} fitKey={fitKey} view={view === 'city' && city ? city : pack.start_view} viewKey={viewKey}
        year={year} playing={playing} focusEvents={historicalEvents} focusEventId={selectedEvent?.id}
        onSelect={id => { setSelectedId(id); setEventId(undefined); setRouteId(undefined) }}
        historicalTerritories={activeTerritories} historicalEvents={activeEvents} layers={layers}
        historicalRoutes={activeRoutes} selectedRouteId={selectedRoute?.properties.id}
        onEvent={id => { setEventId(id); setSelectedId(undefined); setRouteId(undefined) }}
        onRoute={id => { setRouteId(id); setEventId(undefined); setSelectedId(undefined) }} />
      <LayerControls layers={layers} onChange={setLayers} />
      <Timeline year={year} onYear={setYear} raised={!!selected} playing={playing} onPlaying={setPlaying} speed={speed} onSpeed={setSpeed} />
      {!selected && <HistoryPane year={year} events={historicalEvents} activeEvents={activeEvents} territories={activeTerritories} layers={layers}
        routes={travelRoutes} activeRoutes={activeRoutes} selectedRoute={selectedRoute} selectedEvent={selectedEvent}
        onChooseEvent={(id, eventYear) => { setPlaying(false); setYear(eventYear); setEventId(id); setSelectedId(undefined); setRouteId(undefined) }}
        onChooseRoute={(id, routeYear) => { setPlaying(false); setYear(routeYear); setRouteId(id); setEventId(undefined); setSelectedId(undefined) }}
        onClearEvent={() => setEventId(undefined)} onClearRoute={() => setRouteId(undefined)} />}
      <div className="map-context">
        {city && <div className="view-switch" aria-label="Map view"><button aria-pressed={view === 'land'} onClick={() => changeView('land')}>The land</button><button aria-pressed={view === 'city'} onClick={() => changeView('city')}>{city.name}</button></div>}
        {view === 'city' ? <section className="history-card" aria-label={`${city?.name} through time`}>
          <div className="history-kicker">{city?.name} through time</div>
          {cityPeriod ? <><h2>{cityPeriod.title}</h2><div className="history-date">{cityPeriod.subtitle}</div><p>{cityPeriod.summary}</p>{cityPeriod.source && <a href={cityPeriod.source} target="_blank" rel="noreferrer">Read the history</a>}</> : <><h2>History beyond this collection</h2><p>Move the timeline to explore an available period.</p></>}
          <p className="history-note">City walls and 3D reconstructions are not yet available.</p>
        </section> : <div className="border-status">{!layers.kingdoms ? 'Historical territories hidden' : snapshot !== undefined ? `Approximate borders: snapshot ${formatAstronomicalYear(snapshot)}` : 'Historical borders unavailable for this date'} · <a href="https://github.com/aourednik/historical-basemaps" target="_blank" rel="noreferrer">Source</a></div>}
      </div>
      {!exploreOpen && <div className={`searchbar ${selected ? 'card-open' : ''}`} onClick={e => !(e.target as Element).closest('.chip') && setExploreOpen(true)}>
        <button className="search-open" onClick={() => setExploreOpen(true)} aria-label="Search or explore"><svg className="search-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>{!(applied && chips.length) && <span>Search or explore</span>}</button>
        {applied && chips.length > 0 && <div className="bar-chips">{chips.map(c => <button key={c.key + c.value} className="chip" onClick={() => removeChip(c.key, c.value)} aria-label={`Remove ${c.value}`}>{collectionColor(c.value) && <span className="dot" style={{ background: collectionColor(c.value) }} aria-hidden />}{c.value} <span aria-hidden>x</span></button>)}</div>}
        {applied && chips.length > 0 && <button className="bar-add" onClick={() => setExploreOpen(true)} aria-label="Add to the map">+</button>}
      </div>}
      {selected && <Sheet place={selected} onClose={() => setSelectedId(undefined)} />}
    </main>
    {aboutOpen && <About onClose={closeAbout} />}
    {exploreOpen && <Explore query={query} chosen={chosen} onQuery={setQuery} onChosen={setChosen} onClose={() => setExploreOpen(false)}
      onShow={() => { setApplied(true); setPlaying(false); setSelectedId(undefined); setEventId(undefined); setRouteId(undefined); setView('land'); setFitKey(k => k + 1); setExploreOpen(false) }}
      onClear={() => { setQuery(''); setChosen({}); setApplied(false); setSelectedId(undefined); setEventId(undefined); setRouteId(undefined) }} />}
  </div>
}
