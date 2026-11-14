import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from 'react'
import { MISSING, aboutImage } from './data'

// Story pages (About, Get involved): a full-screen scrolling page over the map, under the top bar
// (vision.md "About and Donate pages"). The words and pictures come only from the pack's Markdown
// files (about.md, involved.md), written by a person; the engine just lays them out. Format is
// described at the top of about.md.
// Scroll effects (engine, not content), all tied to the scroll position, no animation library:
// - sections are panels that stick and the next one slides up over them;
// - the opening line shrinks and dims as the next panel covers it;
// - paragraphs (outside picture sections) and big quotes light up word by word;
// - a "~ " line runs along a wave and slides sideways;
// - a section's pictures stay pinned beside its text and change as the text goes by;
// - everything else fades up once when it comes into view.
// A section of only quotes is set large on navy; two or more sit side by side (stacked on phones). Reduced-motion users get a still page.

type Img = { alt: string; src: string; credit?: string }
type Block =
  | { kind: 'h1' | 'h2' | 'p' | 'curve'; text: string }
  | { kind: 'quote'; text: string; cite?: string }
  | { kind: 'images'; images: Img[] }
  | { kind: 'list'; items: string[] }
  | { kind: 'button'; text: string; href: string }

const IMG = /^!\[([^\]]*)\]\(\s*(\S+?)(?:\s+"([^"]*)")?\s*\)$/

function parseSection(md: string): Block[] {
  const out: Block[] = []
  for (const chunk of md.split(/\n\s*\n/)) {
    const lines = chunk.split('\n').map(l => l.trim()).filter(Boolean)
    if (!lines.length) continue
    if (lines.every(l => IMG.test(l))) {
      out.push({ kind: 'images', images: lines.map(l => { const [, alt, src, credit] = l.match(IMG)!; return { alt, src, credit } }) })
    } else if (lines[0].startsWith('> ')) {
      const quote = lines.filter(l => l.startsWith('>')).map(l => l.replace(/^>\s?/, '')).join(' ')
      const cite = lines.find(l => /^[—–-]\s/.test(l))?.replace(/^[—–-]\s/, '')
      out.push({ kind: 'quote', text: quote, cite })
    } else if (lines[0].startsWith('# ')) out.push({ kind: 'h1', text: lines.join(' ').slice(2) })
    else if (lines[0].startsWith('## ')) out.push({ kind: 'h2', text: lines.join(' ').slice(3) })
    else if (lines[0].startsWith('~ ')) out.push({ kind: 'curve', text: lines.join(' ').slice(2) })
    else if (lines.every(l => l.startsWith('- '))) out.push({ kind: 'list', items: lines.map(l => l.slice(2)) })
    else if (/^\[[^\]]+\]\([^)\s]+\)$/.test(lines.join(' '))) {
      const [, text, href] = lines.join(' ').match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)!
      out.push({ kind: 'button', text, href })
    }
    else out.push({ kind: 'p', text: lines.join(' ') })
  }
  return out
}

function sections(md: string): Block[][] {
  return md.replace(/<!--[\s\S]*?-->/g, '').split(/^\s*---\s*$/m).map(parseSection).filter(s => s.length > 0)
}

/** *italic*, **bold** and [text](url) inside a line. Links to other sites open in a new tab. */
function inline(text: string, words = false): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g
  // In a word-by-word paragraph every word is its own span, so it can light up on its own.
  const split = (t: string, key: string) =>
    words ? t.split(/(\s+)/).map((w, i) => (/^\s*$/.test(w) ? w : <span key={key + i} className="w">{w}</span>)) : [t]
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(...split(text.slice(last, m.index), 't' + m.index))
    if (m[1]) out.push(<strong key={m.index}>{split(m[1], 'b' + m.index)}</strong>)
    else if (m[2]) out.push(<em key={m.index}>{split(m[2], 'i' + m.index)}</em>)
    else {
      const external = /^https?:/.test(m[4])
      out.push(
        <a key={m.index} href={m[4]} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {split(m[3], 'a' + m.index)}
        </a>,
      )
    }
    last = re.lastIndex
  }
  if (last < text.length) out.push(...split(text.slice(last), 'e'))
  return out
}

const delay = (i: number) => ({ '--i': i }) as CSSProperties

function Curve({ text }: { text: string }) {
  // One phrase repeated along a gentle wave; the scroll handler slides it via startOffset.
  const id = 'curve' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const line = Array(4).fill(text).join('  ·  ')
  return (
    <div className="story-curve" aria-label={text} role="img">
      <svg viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
        <path id={id} d="M -200 150 C 150 20, 450 20, 650 110 S 1100 220, 1400 60" fill="none" />
        <text><textPath href={'#' + id} startOffset="0%">{line}</textPath></text>
      </svg>
    </div>
  )
}

function Section({ blocks, index }: { blocks: Block[]; index: number }) {
  const images = blocks.flatMap(b => (b.kind === 'images' ? b.images : []))
  const text = blocks.filter(b => b.kind !== 'images')
  const firstP = text.findIndex(b => b.kind === 'p')
  const headed = text.some(b => b.kind === 'h1' || b.kind === 'h2')
  const hero = index === 0
  const dark = !hero && text.length > 0 && text.every(b => b.kind === 'quote')
  const quotes = dark ? text.length : 0

  const body = text.map((b, i) => {
    switch (b.kind) {
      case 'h1': return <h1 key={i} className="hero-title">{inline(b.text)}</h1>
      case 'h2': return <h2 key={i} className="reveal" style={delay(i)}>{inline(b.text)}</h2>
      case 'curve': return <Curve key={i} text={b.text} />
      case 'p':
        // Outside picture sections, paragraphs light up word by word; a section with no heading
        // opens with its first paragraph set large.
        return images.length
          ? <p key={i} className="reveal" style={delay(i)}>{inline(b.text)}</p>
          : <p key={i} className={`story-words ${i === firstP && !headed ? 'story-lead' : ''}`}>{inline(b.text, true)}</p>
      case 'list':
        return <ul key={i} className="story-list reveal" style={delay(i)}>{b.items.map((t, k) => <li key={k}>{inline(t)}</li>)}</ul>
      case 'button':
        return <p key={i} className="reveal" style={delay(i)}><a className="primary story-button" href={b.href}>{b.text}</a></p>
      case 'quote':
        return (
          <figure key={i} className="story-quote reveal" style={delay(i)}>
            <blockquote>{inline(b.text, dark)}</blockquote>
            {b.cite && <figcaption>{inline(b.cite)}</figcaption>}
          </figure>
        )
      default: return null
    }
  })

  const cls = ['story-section', hero && 'story-hero', dark && 'story-dark', images.length && 'story-pinned']
    .filter(Boolean).join(' ')

  return (
    <section className={cls} style={{ zIndex: index + 1 }}>
      {images.length ? (
        <div className="pin-wrap" style={{ '--n': images.length } as CSSProperties}>
          <div className="pin-media">
            {images.map((img, k) => {
              const src = aboutImage(img.src)
              return (
                <figure key={k} className={k === 0 ? 'on' : ''}>
                  {src ? <img src={src} alt={img.alt} /> : <div className="story-missing">{MISSING}</div>}
                  <figcaption>{img.credit ? `Photo: ${img.credit}` : MISSING}</figcaption>
                </figure>
              )
            })}
            <div className="pin-dots" aria-hidden="true">{images.map((_, k) => <span key={k} className={k === 0 ? 'on' : ''} />)}</div>
          </div>
          <div className="pin-text">{body}</div>
        </div>
      ) : (
        <div className={`story-inner ${quotes > 1 ? 'story-quote-row' : ''}`}>{body}</div>
      )}
      {hero && <div className="story-cue" aria-hidden="true">Scroll<span>⌄</span></div>}
    </section>
  )
}

const clamp = (n: number) => Math.min(1, Math.max(0, n))

export default function StoryPage({ text, label, onClose }: { text: string; label: string; onClose: () => void }) {
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const root = scroller.current
    if (!root) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Fade-ups: once, when they come into view.
    const reveals = root.querySelectorAll('.reveal')
    const io = 'IntersectionObserver' in window && !still
      ? new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io?.unobserve(e.target) }
      }), { root, threshold: 0.15 })
      : null
    reveals.forEach(el => (io ? io.observe(el) : el.classList.add('in')))

    const sectionsEls = [...root.querySelectorAll<HTMLElement>('.story-section')]
    const leads = [...root.querySelectorAll<HTMLElement>('.story-words, .story-dark blockquote')]
      .map(el => ({ el, words: [...el.querySelectorAll<HTMLElement>('.w')] }))
    const curves = [...root.querySelectorAll<HTMLElement>('.story-curve')]
      .map(el => ({ el, tp: el.querySelector('textPath')! }))
    const pins = [...root.querySelectorAll<HTMLElement>('.pin-wrap')].map(el => ({
      el, figs: [...el.querySelectorAll<HTMLElement>('.pin-media figure')], dots: [...el.querySelectorAll<HTMLElement>('.pin-dots span')],
    }))
    const hero = root.querySelector<HTMLElement>('.story-hero')

    // Each panel sticks once its bottom reaches the bottom of the screen, so tall panels are
    // read in full before the next one slides over them.
    function layout() {
      const vh = root!.clientHeight
      sectionsEls.forEach(s => { s.style.top = `${Math.min(0, vh - s.offsetHeight)}px` })
    }

    let frame = 0
    function update() {
      frame = 0
      const vh = root!.clientHeight
      if (hero) hero.style.setProperty('--p', String(clamp(root!.scrollTop / vh)))
      for (const { el, words } of leads) {
        const r = el.getBoundingClientRect()
        const p = still ? 1 : clamp((vh * 0.95 - r.top) / (vh * 0.4))
        const lit = Math.round(p * words.length)
        words.forEach((w, i) => w.classList.toggle('lit', i < lit))
      }
      for (const { el, tp } of curves) {
        const r = el.getBoundingClientRect()
        const p = clamp((vh - r.top) / (vh + r.height))
        tp.setAttribute('startOffset', `${(still ? -10 : -30 + p * 30).toFixed(2)}%`)
      }
      for (const { el, figs, dots } of pins) {
        const r = el.getBoundingClientRect()
        const p = clamp((vh * 0.5 - r.top) / Math.max(1, r.height - vh * 0.5))
        const on = Math.min(figs.length - 1, Math.floor(p * figs.length))
        figs.forEach((f, i) => f.classList.toggle('on', i === on))
        dots.forEach((d, i) => d.classList.toggle('on', i === on))
      }
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    const onResize = () => { layout(); onScroll() }

    layout(); update()
    root.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    // Pictures change panel heights as they load.
    root.querySelectorAll('img').forEach(img => img.addEventListener('load', onResize))
    return () => {
      io?.disconnect()
      cancelAnimationFrame(frame)
      root.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [text])

  const content = sections(text)

  return (
    <div className="story" ref={scroller} role="dialog" aria-modal="true" aria-label={label}>
      {content.length === 0
        ? <section className="story-section"><p>{MISSING}</p></section>
        : content.map((s, k) => <Section key={k} blocks={s} index={k} />)}
      <section className="story-section story-end" style={{ zIndex: content.length + 1 }}>
        <button className="primary" onClick={onClose}>Back to the map</button>
      </section>
    </div>
  )
}
