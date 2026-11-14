import { Fragment, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { MISSING, aboutImage, aboutText } from './data'

// About page: a full-screen scrolling story over the map (vision.md "About and Donate pages").
// The words and pictures come only from the pack's about.md, written by a person; the engine just
// lays them out and fades each part in as it scrolls into view. Format is described at the top of
// about.md: "---" between sections, "# "/"## " headings, "> " quotes with a "— " line for who said
// it, ![alt](about/file.jpg "credit") pictures, *italic*, **bold**, [links](url).
// Layout rules (engine, not content): the first section is the opening screen; a section that is
// only a quote is set large on navy.

type Img = { alt: string; src: string; credit?: string }
type Block =
  | { kind: 'h1' | 'h2' | 'p'; text: string }
  | { kind: 'quote'; text: string; cite?: string }
  | { kind: 'images'; images: Img[] }

const IMG = /^!\[([^\]]*)\]\(\s*(\S+?)(?:\s+"([^"]*)")?\s*\)$/

function parseSection(md: string): Block[] {
  const out: Block[] = []
  for (const chunk of md.split(/\n\s*\n/)) {
    const lines = chunk.split('\n').map(l => l.trim()).filter(Boolean)
    if (!lines.length) continue
    if (lines.every(l => IMG.test(l))) {
      const images = lines.map(l => {
        const [, alt, src, credit] = l.match(IMG)!
        return { alt, src, credit }
      })
      out.push({ kind: 'images', images })
    } else if (lines[0].startsWith('> ')) {
      const quote = lines.filter(l => l.startsWith('>')).map(l => l.replace(/^>\s?/, '')).join(' ')
      const cite = lines.find(l => /^[—–-]\s/.test(l))?.replace(/^[—–-]\s/, '')
      out.push({ kind: 'quote', text: quote, cite })
    } else if (lines[0].startsWith('# ')) {
      out.push({ kind: 'h1', text: lines.join(' ').slice(2) })
    } else if (lines[0].startsWith('## ')) {
      out.push({ kind: 'h2', text: lines.join(' ').slice(3) })
    } else {
      out.push({ kind: 'p', text: lines.join(' ') })
    }
  }
  return out
}

function sections(md: string): Block[][] {
  return md
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/^\s*---\s*$/m)
    .map(parseSection)
    .filter(s => s.length > 0)
}

/** *italic*, **bold** and [text](url) inside a line. Links to other sites open in a new tab. */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1]) out.push(<strong key={m.index}>{m[1]}</strong>)
    else if (m[2]) out.push(<em key={m.index}>{m[2]}</em>)
    else {
      const external = /^https?:/.test(m[4])
      out.push(
        <a key={m.index} href={m[4]} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {m[3]}
        </a>,
      )
    }
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function BlockView({ b, i }: { b: Block; i: number }) {
  const style = { '--i': i } as CSSProperties
  switch (b.kind) {
    case 'h1': return <h1 className="reveal" style={style}>{inline(b.text)}</h1>
    case 'h2': return <h2 className="reveal" style={style}>{inline(b.text)}</h2>
    case 'p': return <p className="reveal" style={style}>{inline(b.text)}</p>
    case 'quote':
      return (
        <figure className="story-quote reveal" style={style}>
          <blockquote>{inline(b.text)}</blockquote>
          {b.cite && <figcaption>{inline(b.cite)}</figcaption>}
        </figure>
      )
    case 'images':
      return (
        <div className={`story-images n${b.images.length}`}>
          {b.images.map((img, k) => {
            const src = aboutImage(img.src)
            return (
              <figure key={k} className="reveal" style={{ '--i': i + k } as CSSProperties}>
                {src ? <img src={src} alt={img.alt} loading="lazy" /> : <div className="story-missing">{MISSING}</div>}
                <figcaption>{img.credit ? `Photo: ${img.credit}` : MISSING}</figcaption>
              </figure>
            )
          })}
        </div>
      )
  }
}

export default function About({ onClose }: { onClose: () => void }) {
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Fade each part in the first time it scrolls into view.
  useEffect(() => {
    const root = scroller.current
    if (!root) return
    const els = root.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return }
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }, { root, threshold: 0.15 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  const content = sections(aboutText)
  const isQuoteOnly = (s: Block[]) => s.length === 1 && s[0].kind === 'quote'

  return (
    <div className="story" ref={scroller} role="dialog" aria-modal="true" aria-label="About">
      <button className="story-close" onClick={onClose} aria-label="Close About">×</button>
      {content.length === 0 ? (
        <section className="story-section"><p>{MISSING}</p></section>
      ) : (
        content.map((s, k) => (
          <section key={k}
            className={`story-section ${k === 0 ? 'story-hero' : ''} ${k > 0 && isQuoteOnly(s) ? 'story-dark' : ''}`}>
            <div className="story-inner">
              {s.map((b, i) => <Fragment key={i}><BlockView b={b} i={i} /></Fragment>)}
            </div>
            {k === 0 && <div className="story-cue" aria-hidden="true">Scroll<span>⌄</span></div>}
          </section>
        ))
      )}
      <section className="story-section story-end">
        <button className="primary" onClick={onClose}>Back to the map</button>
      </section>
    </div>
  )
}
