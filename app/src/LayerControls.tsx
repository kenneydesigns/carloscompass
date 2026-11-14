import { useState } from 'react'
import type { LayerKey, LayerSettings } from './gis'

const options: [LayerKey, string][] = [
  ['kingdoms', 'Kingdoms and empires'], ['cities', 'Cities and settlements'],
  ['routes', 'Travel routes'], ['events', 'Biblical events'],
  ['physical', 'Rivers and lakes'], ['modern', 'Modern boundaries'],
]

export default function LayerControls({ layers, onChange }: { layers: LayerSettings; onChange: (settings: LayerSettings) => void }) {
  const [open, setOpen] = useState(false)
  return <div className="layer-control">
    <button className="layer-trigger" aria-expanded={open} onClick={() => setOpen(v => !v)}>Layers {open ? '-' : '+'}</button>
    {open && <div className="layer-panel">
      {options.map(([key, label]) => <label key={key}>
        <input type="checkbox" checked={layers[key]} onChange={e => onChange({ ...layers, [key]: e.target.checked })} />
        {label}{key === 'routes' && <small> schematic</small>}
      </label>)}
      <p>Ancient borders are approximate snapshots; gaps mean data is unavailable.</p>
    </div>}
  </div>
}
