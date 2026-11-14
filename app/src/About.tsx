import { useEffect } from 'react'
import { MISSING, aboutText } from './data'

// About page: a full-screen parchment page over the map (vision.md "About and Donate pages").
// The words come only from the pack's about.md, written by a person; the engine just lays them out.
// Paragraphs are separated by a blank line; a line starting with "# " is a heading;
// <!-- notes --> are for editors and never shown.
function blocks(md: string): { heading: boolean; text: string }[] {
  return md
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/\n\s*\n/)
    .map(b => b.trim().replace(/\s*\n\s*/g, ' '))
    .filter(Boolean)
    .map(b => (b.startsWith('# ') ? { heading: true, text: b.slice(2) } : { heading: false, text: b }))
}

export default function About({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const content = blocks(aboutText)

  return (
    <div className="scrim" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="explore about" role="dialog" aria-modal="true" aria-labelledby="about-title">
        <div className="explore-head">
          <h2 id="about-title">About</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="explore-body about-body">
          {content.length === 0
            ? <p>{MISSING}</p>
            : content.map((b, i) => (b.heading ? <h3 key={i}>{b.text}</h3> : <p key={i}>{b.text}</p>))}
        </div>
      </div>
    </div>
  )
}
