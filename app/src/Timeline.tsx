import { MAX_YEAR, MIN_YEAR, formatAstronomicalYear } from './temporal'

const eras = [
  { label: 'Patriarchs (traditional)', year: -1799 },
  { label: 'Exodus (date disputed)', year: -1249 },
  { label: 'United Monarchy (approx.)', year: -999 },
  { label: 'Divided Kingdoms (approx.)', year: -899 },
  { label: 'Exile', year: -585 },
  { label: 'Persian Period', year: -499 },
  { label: 'Hellenistic Period', year: -299 },
  { label: 'Roman Period', year: 30 },
]
export default function Timeline({ year, onYear, raised, playing, onPlaying, speed, onSpeed }: {
  year: number; onYear: (y: number) => void; raised: boolean; playing: boolean
  onPlaying: (value: boolean) => void; speed: number; onSpeed: (speed: number) => void
}) {
  const pct = ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100
  return <div className={`timeline ${raised ? 'raised' : ''}`}>
    <div className="timeline-row"><span>2000 BC</span><strong>{formatAstronomicalYear(year)}</strong><span>100 AD</span></div>
    <input type="range" min={MIN_YEAR} max={MAX_YEAR} step={1} value={year}
      onChange={e => { onPlaying(false); onYear(Number(e.target.value)) }}
      style={{ ['--pct' as string]: `${pct}%` }} aria-label="Move through time" aria-valuetext={formatAstronomicalYear(year)} />
    <div className="timeline-actions">
      <button onClick={() => { if (!playing && year >= MAX_YEAR) onYear(MIN_YEAR); onPlaying(!playing) }}>{playing ? 'Pause' : 'Play'}</button>
      <label>Speed <select value={speed} onChange={e => onSpeed(Number(e.target.value))} aria-label="Playback speed"><option value={10}>Slow</option><option value={25}>Medium</option><option value={100}>Fast</option></select></label>
      <label className="era-select"><span className="visually-hidden">Jump to era</span><select value="" onChange={e => { onPlaying(false); onYear(Number(e.target.value)) }}><option value="" disabled>Jump to an era</option>{eras.map(era => <option key={era.label} value={era.year}>{era.label}</option>)}</select></label>
    </div>
  </div>
}
