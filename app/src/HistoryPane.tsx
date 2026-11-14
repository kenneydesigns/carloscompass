import { useMemo, useState } from 'react'
import type { Feature, FeatureCollection, Geometry, LineString } from 'geojson'
import { formatAstronomicalYear } from './temporal'
import { defaultTerritoryColor, territoryColors, type HistoricalEvent, type LayerSettings, type TerritoryProperties, type TravelRouteProperties } from './gis'

interface Props {
  year: number
  events: HistoricalEvent[]
  activeEvents: HistoricalEvent[]
  territories: FeatureCollection<Geometry, TerritoryProperties>
  routes: FeatureCollection<LineString, TravelRouteProperties>
  activeRoutes: FeatureCollection<LineString, TravelRouteProperties>
  layers: LayerSettings
  selectedEvent?: HistoricalEvent
  selectedRoute?: Feature<LineString, TravelRouteProperties>
  onChooseEvent: (id: string, year: number) => void
  onChooseRoute: (id: string, year: number) => void
  onClearEvent: () => void
  onClearRoute: () => void
}

function yearsAway(event: HistoricalEvent, year: number) {
  return year < event.startYear ? event.startYear - year : year > event.endYear ? year - event.endYear : 0
}

export default function HistoryPane({ year, events, activeEvents, territories, routes, activeRoutes, layers, selectedEvent, selectedRoute, onChooseEvent, onChooseRoute, onClearEvent, onClearRoute }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const open = mobileOpen || !!selectedEvent || !!selectedRoute
  const realms = useMemo(() => {
    const unique = new Map<string, TerritoryProperties>()
    territories.features.forEach(feature => unique.set(feature.properties.name, feature.properties))
    return [...unique.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [territories])
  const nearestEvent = useMemo(() => [...events].sort((a, b) => yearsAway(a, year) - yearsAway(b, year))[0], [events, year])
  const snapshotYear = territories.features[0]?.properties.snapshotYear
  const orderedEvents = useMemo(() => [...events].sort((a, b) => a.startYear - b.startYear), [events])

  return <>
    <button className="history-toggle" aria-expanded={open} onClick={() => setMobileOpen(value => !value)}>
      {open ? 'Hide history' : 'History'} <span>{formatAstronomicalYear(year)}</span>
    </button>
    <aside className={`history-pane ${open ? 'history-pane-open' : ''}`} aria-label="Historical map information">
      <div className="history-pane-head">
        <div>
          <p className="history-kicker">Historical map guide</p>
          <h2>{formatAstronomicalYear(year)}</h2>
        </div>
        <button className="history-mobile-close" onClick={() => { setMobileOpen(false); if (selectedEvent) onClearEvent(); if (selectedRoute) onClearRoute() }} aria-label="Close history panel">x</button>
      </div>

      {selectedEvent ? <section className="history-selected-event" aria-label="Selected event details">
        <button className="history-back" onClick={onClearEvent}>Back to timeline context</button>
        <p className="history-kicker">{selectedEvent.kind === 'battle' ? 'Battle' : selectedEvent.kind === 'conquest' ? 'Conquest' : 'Biblical event'} | {selectedEvent.confidence}</p>
        <h3>{selectedEvent.title}</h3>
        <p className="history-date">{selectedEvent.dateLabel}</p>
        <p>{selectedEvent.description}</p>
        {!!selectedEvent.scripture.length && <><h4>Scripture</h4><p>{selectedEvent.scripture.join('; ')}</p></>}
        <h4>Historical context</h4>
        <p>{selectedEvent.civilization} | {selectedEvent.people.join(', ')}</p>
        {selectedEvent.mapEffect && <><h4>What changed on the map</h4><p>{selectedEvent.mapEffect}</p></>}
        <p className="history-date">Location precision: {selectedEvent.precision}</p>
        <a href={selectedEvent.source} target="_blank" rel="noreferrer">Open historical source</a>
      </section> : selectedRoute ? <section className="history-selected-route" aria-label="Selected travel route">
        <button className="history-back" onClick={onClearRoute}>Back to timeline context</button>
        <p className="history-kicker">{selectedRoute.properties.routeGroup === 'jesus' ? 'Jesus' : 'Apostolic'} travel route</p>
        <h3>{selectedRoute.properties.name}</h3>
        <p className="history-date">{selectedRoute.properties.dateLabel}</p>
        <p>{selectedRoute.properties.description}</p>
        <h4>Travelers</h4><p>{selectedRoute.properties.travelers}</p>
        <h4>Named stops, in sequence</h4><p>{selectedRoute.properties.stops.join(' -> ')}</p>
        <h4>Scripture</h4><p>{selectedRoute.properties.scripture.join('; ')}</p>
        <h4>Route confidence</h4><p>{selectedRoute.properties.confidence} {selectedRoute.properties.precision}</p>
        {!layers.routes && <p className="history-date">This route is currently hidden by the Travel routes layer toggle.</p>}
        <a href={selectedRoute.properties.source} target="_blank" rel="noreferrer">Open itinerary source</a>
      </section> : <>
        <section className="history-current" aria-label="Current historical context">
          <h3>At this point in time</h3>
          {snapshotYear !== undefined ? <p className="history-date">Territory geometry: approximate snapshot centered on {formatAstronomicalYear(snapshotYear)}.</p>
            : <p className="history-date">No territory polygon is available for this year in the current source set.</p>}
          {activeEvents.length > 0 ? <div className="history-nearby">
            <span className="history-status">Event in this period</span>
            {activeEvents.map(event => <button className="history-event-link" key={event.id} onClick={() => onChooseEvent(event.id, year)}>
              <strong>{event.title}</strong><span>{event.dateLabel}</span><small>{event.mapEffect ?? event.description}</small>
            </button>)}
          </div> : nearestEvent && <div className="history-nearby">
            <span className="history-status">Nearest recorded event | {yearsAway(nearestEvent, year)} {yearsAway(nearestEvent, year) === 1 ? 'year' : 'years'} away</span>
            <button className="history-event-link" onClick={() => onChooseEvent(nearestEvent.id, nearestEvent.startYear)}>
              <strong>{nearestEvent.title}</strong><span>{nearestEvent.dateLabel}</span><small>{nearestEvent.mapEffect ?? nearestEvent.description}</small>
            </button>
          </div>}
        </section>

        <section className="history-legend" aria-label="Boundary color key">
          <h3>Boundary colors</h3>
          {!layers.kingdoms ? <p className="history-date">Kingdom and empire polygons are hidden. Turn on that layer to see their colors.</p>
            : realms.length ? <ul className="history-realm-list">{realms.map(realm => {
              const color = territoryColors[realm.name] ?? defaultTerritoryColor
              return <li key={realm.id}><span className="realm-swatch" style={{ background: color.fill, borderColor: color.stroke }} aria-hidden="true" />
                <span>{realm.name}</span><small>{realm.confidence}</small></li>
            })}</ul> : <p className="history-date">No historical territory polygons are active at this date.</p>}
          <div className="history-symbol-key"><span className="line-swatch" aria-hidden="true" /><span>Dashed border: approximate reconstruction</span></div>
          <div className="history-symbol-key"><span className="event-swatch" aria-hidden="true" /><span>Crimson marker: dated event or battle</span></div>
          <p className="history-date">Semi-transparent fills let the physical geography remain visible beneath political areas.</p>
        </section>
      </>}

      {!selectedRoute && !selectedEvent && <section className="history-route-list" aria-label="Travel routes">
        <h3>Travel routes</h3>
        <p className="history-date">Dashed paths connect places or regions named in scripture. They are illustrative corridors, not exact ancient roads.</p>
        <div className="history-symbol-key"><span className="route-line-swatch route-jesus" aria-hidden="true" /><span>Jesus' route</span></div>
        <div className="history-symbol-key"><span className="route-line-swatch route-apostles" aria-hidden="true" /><span>Apostolic routes</span></div>
        {activeRoutes.features.length > 0 && <span className="history-status">Visible in this period</span>}
        <ol>{routes.features.map(route => {
          const isActive = activeRoutes.features.some(active => active.properties.id === route.properties.id)
          return <li key={route.properties.id}>
            <button className={isActive ? 'history-event-link selected' : 'history-event-link'} onClick={() => onChooseRoute(route.properties.id, route.properties.startYear)}>
              <span className="history-event-date">{route.properties.dateLabel}</span>
              <strong>{route.properties.name}</strong>
              <small>{route.properties.stops.join(' -> ')}</small>
              {isActive && <small>{route.properties.description}</small>}
            </button>
          </li>
        })}</ol>
        {!layers.routes && <p className="history-date">Routes are hidden by the Travel routes layer toggle.</p>}
      </section>}

      {!selectedRoute && <section className="history-milestones" aria-label="Historical transitions">
        <h3>Key events and transitions</h3>
        <p className="history-date">Select an entry to move the timeline and read why political control changed.</p>
        <ol>{orderedEvents.map(event => <li key={event.id}>
          <button className={selectedEvent?.id === event.id ? 'history-event-link selected' : 'history-event-link'} onClick={() => onChooseEvent(event.id, event.startYear)}>
            <span className="history-event-date">{event.dateLabel}</span>
            <strong>{event.title}</strong>
            <small>{event.mapEffect ?? event.description}</small>
          </button>
        </li>)}</ol>
        <p className="history-caveat">A battle can trigger a shift in power, but borders also change through later campaigns, treaties, and succession. These polygons are approximate historical snapshots, not exact front lines.</p>
      </section>}
    </aside>
  </>
}
