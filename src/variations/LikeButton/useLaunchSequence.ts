import { useEffect, useMemo, useRef, useState } from 'react'
import {
  buildParticles,
  random,
  range,
  CLEANUP_DURATION,
  NUM_OF_PARTICLES,
  NUM_OF_STARS,
  PARTICLE_DELAY,
  ROCKET_END,
  ROCKET_START,
  STAR_BAND,
  STAR_START,
  STAR_STOP,
  SWIRL_CLEANUP,
} from './LikeButton.helpers'
import type { Particle, Star } from './LikeButton.helpers'

type SequenceOptions = {
  particleCount?: number
  starCount?: number
  /** orbit mode: mains fly straight out, companions circle them (no field spin) */
  orbit?: boolean
  /** include the trailing companion dot on each particle (default true) */
  companion?: boolean
  /** swirl mode: a single star spirals in to the center (no ring, no spin) */
  swirl?: boolean
  /** fireworks: each particle gets a random distance, size and color */
  fireworks?: boolean
}

// Owns the launch -> burst -> cleanup timeline. The component just renders
// whatever this returns; every variation can reuse the logic and reskin.
// Counts come in as options so the call site can tune them; the helper
// constants are just the defaults.
export function useLaunchSequence(
  isLiked: boolean,
  options: SequenceOptions = {},
) {
  const {
    particleCount = NUM_OF_PARTICLES,
    starCount = NUM_OF_STARS,
    orbit = false,
    companion = true,
    swirl = false,
    fireworks = false,
  } = options

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [falling, setFalling] = useState(false)
  const [launched, setLaunched] = useState(false)
  const [bursting, setBursting] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  // built once: per-star variety (was set inline by JS in the vanilla version)
  const stars = useMemo<Star[]>(
    () =>
      range(starCount).map((i) => {
        const side = i % 2 ? 1 : -1
        const offset = random(STAR_BAND[0], STAR_BAND[1], true)
        return {
          left: `${50 + side * offset}%`,
          scale: random(0, 1, true),
          angle: random(-40, 40),
          duration: `${random(0.9, 1.2, true).toFixed(2)}s`,
          delay: `-${random(0, 1.2, true).toFixed(2)}s`,
        }
      }),
    [starCount],
  )

  // drive the timeline whenever the like turns on
  useEffect(() => {
    if (!isLiked) return

    const btn = buttonRef.current
    if (!btn) return

    const rim = btn.offsetWidth / 2 + 10
    const count = swirl ? 1 : particleCount
    const built = buildParticles(count, rim, {
      orbit,
      companion,
      swirl,
      fireworks,
    })

    // swirl's single star takes longer to settle than the quick burst
    const cleanupAt = swirl ? SWIRL_CLEANUP : CLEANUP_DURATION

    const timers = [
      window.setTimeout(() => setFalling(true), STAR_START),
      window.setTimeout(() => setFalling(false), STAR_STOP),
      window.setTimeout(() => setLaunched(true), ROCKET_START),
      window.setTimeout(() => setLaunched(false), ROCKET_END),
      window.setTimeout(() => {
        setBursting(true)
        setParticles(built)
      }, PARTICLE_DELAY),
      window.setTimeout(() => {
        setBursting(false)
        setParticles([])
      }, cleanupAt),
    ]

    // clears on unlike, rapid re-toggle, and StrictMode's double-invoke
    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      setFalling(false)
      setLaunched(false)
      setBursting(false)
      setParticles([])
    }
  }, [isLiked, particleCount, orbit, companion, swirl, fireworks])

  return { buttonRef, stars, falling, launched, bursting, particles }
}
