import type { CSSProperties } from 'react'

// --- pure math / util (replaces lodash) ---
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

// --- heart / particle timeline ---
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

// swirl is a single star, so it runs slower than the quick multi-particle
// burst and the particle is held on screen for the whole spiral
const SWIRL_DURATION = 1300
export const SWIRL_CLEANUP = PARTICLE_DELAY + SWIRL_DURATION

// --- rocket timeline ---
export const ROCKET_START = HEART_HIDE_DELAY
const RISE_DURATION = 600
const ROCKET_HOLD = 800
const LAUNCH_DURATION = 850
export const ROCKET_END =
  ROCKET_START + RISE_DURATION + ROCKET_HOLD + LAUNCH_DURATION

// --- star timeline / settings ---
export const NUM_OF_STARS = 6
export const STAR_BAND: [number, number] = [18, 42]
const STAR_LEAD = 150
export const STAR_START = SHRINK_DURATION - STAR_LEAD
export const STAR_STOP = BURST_DELAY

// --- burst geometry ---
// per-particle variety for the fireworks variation
export const FIREWORK_COLORS = [
  '#f91780',
  '#22d3ee',
  '#a855f7',
  '#f59e0b',
  '#34d399',
  '#60a5fa',
  '#fb7185',
]
const FIREWORK_DISTANCE: [number, number] = [10, 20]
const FIREWORK_SIZE: [number, number] = [4, 11]

// each main particle, plus a trailing companion by default. orbit mode emits
// mains only — they start at center and fly to the rim; their companions are
// CSS moons the component adds. companion: false drops the trailing dot.
// fireworks gives every particle a random distance, size and color.
type BurstOptions = {
  orbit?: boolean
  companion?: boolean
  swirl?: boolean
  fireworks?: boolean
}
export function buildParticles(
  count: number,
  rim: number,
  {
    orbit = false,
    companion = true,
    swirl = false,
    fireworks = false,
  }: BurstOptions = {},
): Particle[] {
  return range(count).flatMap((index) => {
    const angle = (index / count) * 360

    // swirl: a single star, centered, that spirals in from the rim radius
    if (swirl) {
      return [{ angle: 0, distance: rim, x: 0, y: 0, companion: false }]
    }

    if (orbit) {
      return [{ angle, distance: rim, x: 0, y: 0, companion: false }]
    }

    // fireworks: ring start, but a random travel / size / color per particle
    if (fireworks) {
      const [cx, cy] = polarToCartesian(angle, rim)
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

// timeline tokens read by the CSS animations; one source of truth here
export const cssVars: CSSProperties = {
  '--shrink-duration': `${SHRINK_DURATION}ms`,
  '--heart-hide-delay': `${HEART_HIDE_DELAY}ms`,
  '--burst-duration': `${BURST_DURATION}ms`,
  '--pop-duration': `${POP_DURATION}ms`,
  '--burst-delay': `${BURST_DELAY}ms`,
  '--rise-duration': `${RISE_DURATION}ms`,
  '--launch-duration': `${LAUNCH_DURATION}ms`,
  '--launch-delay': `${RISE_DURATION + ROCKET_HOLD}ms`,
  '--swirl-duration': `${SWIRL_DURATION}ms`,
} as CSSProperties

export type Star = {
  left: string
  scale: number // 0..1 variety factor; the component maps it to a size
  angle: number // tilt in degrees (used by emoji stars)
  duration: string
  delay: string
}

export type Particle = {
  angle: number
  distance: number
  x: number
  y: number
  companion: boolean
  size?: number // fireworks: per-particle px size
  color?: string // fireworks: per-particle color
}
