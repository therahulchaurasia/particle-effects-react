// Drives the scroll scrub: maps scroll → `--t`, re-renders only on discrete state changes, lays out stage + code panel. See CLAUDE.md.
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import './ScrollExplainer.css'
import ScrubStage from './ScrubStage'
import { PHASES, SNIPPETS, cardStateAt, type CardState } from './timeline'
import {
  ANIM_TIMELINE as T,
  EXPLAINER_DURATION,
  ROCKET_END,
  STAR_START,
  STAR_STOP,
} from '../variations/LikeButton/LikeButton.helpers'

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n))

type Snapshot = {
  falling: boolean
  launched: boolean
  showBurst: boolean
  heartShown: boolean
  states: CardState[]
}
function snapshotAt(t: number): Snapshot {
  return {
    falling: t >= STAR_START && t <= STAR_STOP,
    launched: t < ROCKET_END,
    showBurst: t >= T.burst.start,
    heartShown: t < T.invisible.start,
    states: SNIPPETS.map((s) => cardStateAt(s, t)),
  }
}
const signature = (s: Snapshot) =>
  `${s.falling}${s.launched}${s.showBurst}${s.heartShown}` +
  s.states.map((c) => c.slot + c.active.map((a) => (a ? 1 : 0)).join('')).join('|')

// piecewise so each phase gets its own slice of scroll while `t` stays continuous
const TOTAL_WEIGHT = PHASES.reduce((sum, p) => sum + p.weight, 0)
function progressToTime(p: number): number {
  let acc = 0
  for (let i = 0; i < PHASES.length; i++) {
    const frac = PHASES[i].weight / TOTAL_WEIGHT
    if (p < acc + frac || i === PHASES.length - 1) {
      const local = clamp((p - acc) / frac, 0, 1)
      const { tStart, tEnd } = PHASES[i]
      return tStart + local * (tEnd - tStart)
    }
    acc += frac
  }
  return EXPLAINER_DURATION
}

// reduced motion OR small screens get the static list (no pin, no scroll-jack)
const STATIC_QUERY = '(prefers-reduced-motion: reduce), (max-width: 760px)'
function useStaticMode(): boolean {
  const [staticMode, setStaticMode] = useState(
    () => window.matchMedia(STATIC_QUERY).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(STATIC_QUERY)
    const onChange = () => setStaticMode(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return staticMode
}

const STATIC_SNAPSHOT: Snapshot = {
  ...snapshotAt(EXPLAINER_DURATION),
  states: SNIPPETS.map((s) => ({
    slot: 'in' as const,
    active: s.parts.map(() => false),
  })),
}

function ScrollExplainer() {
  const sectionRef = useRef<HTMLElement>(null)
  const lastSig = useRef('')
  const staticMode = useStaticMode()
  const [snap, setSnap] = useState<Snapshot>(() => snapshotAt(0))

  useEffect(() => {
    if (staticMode) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = sectionRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const scrollable = rect.height - window.innerHeight
        const p = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0
        const t = progressToTime(p)
        el.style.setProperty('--t', String(Math.round(t)))
        const next = snapshotAt(t)
        const sig = signature(next)
        if (sig !== lastSig.current) {
          lastSig.current = sig
          setSnap(next)
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [staticMode])

  const view = staticMode ? STATIC_SNAPSHOT : snap

  // scrub mode keeps `--t` out of React's style (DOM-owned); static pins it here
  const sectionStyle = staticMode
    ? ({ '--t': EXPLAINER_DURATION } as CSSProperties)
    : undefined

  return (
    <section
      ref={sectionRef}
      className={`explainer${staticMode ? ' explainer--static' : ''}`}
      style={sectionStyle}
      aria-label="How the like button animation works"
    >
      <div className="explainerSticky">
        <div className="explainerInner">
          <div className="explainerStageCol">
            <div className="explainerStage">
              <ScrubStage
                falling={view.falling}
                launched={view.launched}
                showBurst={view.showBurst}
                heartShown={view.heartShown}
              />
            </div>
          </div>

          <ol className="explainerPanel" aria-hidden="true">
            {SNIPPETS.map((s, i) => (
              <li key={s.id} className={`snippet snippet--${view.states[i].slot}`}>
                <div className="snippetMain">
                  <span className="snippetTitle">{s.title}</span>
                  <p className="snippetDesc">{s.description}</p>
                  {s.parts.map((part, j) => (
                    <div
                      key={j}
                      className={`snippetCodeBox${
                        view.states[i].active[j] ? ' snippetCodeBox--active' : ''
                      }`}
                    >
                      <pre className="snippetCode">
                        <code>{part.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default ScrollExplainer
