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
} as CSSProperties

export type Star = {
  left: string
  size: string
  duration: string
  delay: string
}

export type Particle = {
  angle: number
  distance: number
  x: number
  y: number
  companion: boolean
}
