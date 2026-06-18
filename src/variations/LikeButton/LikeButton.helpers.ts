// Timing + geometry constants and pure helpers; single source of truth for all timing. See CLAUDE.md.
import type { CSSProperties } from 'react'

export function random(min: number, max: number, float = false): number {
  const n = Math.random() * (max - min) + min
  return float ? n : Math.round(n)
}

export function range(length: number): number[] {
  return Array.from({ length }, (_, i) => i)
}

function degreesToRadians(angle: number): number {
  return (angle * Math.PI) / 180
}

export function polarToCartesian(
  angle: number,
  distance: number,
): [number, number] {
  const r = degreesToRadians(angle)
  return [Math.cos(r) * distance, Math.sin(r) * distance]
}

export const NUM_OF_PARTICLES = 8
export const PARTICLE_DISTANCE = 20
export const COMPANION_GAP = -8
export const COMPANION_ANGLE = 6

const SHRINK_DURATION = 300
const HEART_HIDE_DELAY = 250
const HOLD = 2200
const BURST_DURATION = 1000
const POP_DURATION = 1500
const BURST_LEAD = POP_DURATION * 0.17
const BURST_DELAY = SHRINK_DURATION + HOLD
export const PARTICLE_DELAY = BURST_DELAY + BURST_LEAD
export const CLEANUP_DURATION = PARTICLE_DELAY + BURST_DURATION

export const ROCKET_START = HEART_HIDE_DELAY
const RISE_DURATION = 600
const ROCKET_HOLD = 800
const LAUNCH_DURATION = 850
export const ROCKET_END =
  ROCKET_START + RISE_DURATION + ROCKET_HOLD + LAUNCH_DURATION

export const NUM_OF_STARS = 6
export const STAR_BAND: [number, number] = [18, 42]
const STAR_LEAD = 150
export const STAR_START = SHRINK_DURATION - STAR_LEAD
export const STAR_STOP = BURST_DELAY

export const FIREWORK_COLORS = [
  '#f91780',
  '#22d3ee',
  '#a855f7',
  '#f59e0b',
  '#34d399',
  '#60a5fa',
  '#fb7185',
]
const FIREWORK_DISTANCE: [number, number] = [15, 20]
const FIREWORK_SIZE: [number, number] = [9, 12]
const FIREWORK_START_RADIUS: [number, number] = [0.3, 1] // fraction of the rim

type BurstOptions = {
  orbit?: boolean
  companion?: boolean
  fireworks?: boolean
}
export function buildParticles(
  count: number,
  rim: number,
  {
    orbit = false,
    companion = true,
    fireworks = false,
  }: BurstOptions = {},
): Particle[] {
  return range(count).flatMap((index) => {
    const angle = (index / count) * 360

    if (orbit) {
      return [{ angle, distance: rim, x: 0, y: 0, companion: false }]
    }

    if (fireworks) {
      const startRadius =
        rim * random(FIREWORK_START_RADIUS[0], FIREWORK_START_RADIUS[1], true)
      const [cx, cy] = polarToCartesian(angle, startRadius)
      return [
        {
          angle,
          distance: random(FIREWORK_DISTANCE[0], FIREWORK_DISTANCE[1]),
          x: cx,
          y: cy,
          companion: false,
          size: random(FIREWORK_SIZE[0], FIREWORK_SIZE[1]),
          color: FIREWORK_COLORS[random(0, FIREWORK_COLORS.length - 1)],
        },
      ]
    }

    const [x, y] = polarToCartesian(angle, rim)
    const main: Particle = { angle, distance: PARTICLE_DISTANCE, x, y, companion: false }
    if (!companion) return [main]

    const [cx, cy] = polarToCartesian(angle + COMPANION_ANGLE, rim + COMPANION_GAP)
    return [main, { angle, distance: PARTICLE_DISTANCE, x: cx, y: cy, companion: true }]
  })
}

// per-animation { start, duration } on the master timeline, consumed by the explainer
const ROCKET_LAUNCH_START = ROCKET_START + RISE_DURATION + ROCKET_HOLD
export const ANIM_TIMELINE = {
  heartDisappear: { start: 0, duration: SHRINK_DURATION },
  invisible: { start: HEART_HIDE_DELAY, duration: 0 },
  heartPop: { start: BURST_DELAY, duration: POP_DURATION },
  rocketRise: { start: ROCKET_START, duration: RISE_DURATION },
  rocketLaunch: { start: ROCKET_LAUNCH_START, duration: LAUNCH_DURATION },
  flames: { start: ROCKET_START, duration: ROCKET_END - ROCKET_START },
  starFall: { start: STAR_START, duration: STAR_STOP - STAR_START },
  burst: { start: PARTICLE_DELAY, duration: BURST_DURATION },
} as const

export const EXPLAINER_DURATION = Math.max(
  CLEANUP_DURATION,
  BURST_DELAY + POP_DURATION,
)

// timeline tokens the CSS @keyframes read
export const cssVars: CSSProperties = {
  '--shrink-duration': `${SHRINK_DURATION}ms`,
  '--heart-hide-delay': `${HEART_HIDE_DELAY}ms`,
  '--burst-duration': `${BURST_DURATION}ms`,
  '--pop-duration': `${POP_DURATION}ms`,
  '--burst-delay': `${BURST_DELAY}ms`,
  '--rise-duration': `${RISE_DURATION}ms`,
  '--launch-duration': `${LAUNCH_DURATION}ms`,
  '--launch-delay': `${RISE_DURATION + ROCKET_HOLD}ms`,
} as CSSProperties

export type Star = {
  left: string
  scale: number
  angle: number
  duration: string
  delay: string
}

export type Particle = {
  angle: number
  distance: number
  x: number
  y: number
  companion: boolean
  size?: number
  color?: string
}
