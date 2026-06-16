import { useEffect, useMemo, useRef, useState } from 'react'
import {
  polarToCartesian,
  random,
  range,
  COMPANION_ANGLE,
  COMPANION_GAP,
  CLEANUP_DURATION,
  NUM_OF_PARTICLES,
  NUM_OF_STARS,
  PARTICLE_DELAY,
  PARTICLE_DISTANCE,
  ROCKET_END,
  ROCKET_START,
  STAR_BAND,
  STAR_START,
  STAR_STOP,
} from './LikeButton.helpers'
import type { Particle, Star } from './LikeButton.helpers'

type SequenceOptions = {
  particleCount?: number
  starCount?: number
}

// Owns the launch -> burst -> cleanup timeline. The component just renders
// whatever this returns; every variation can reuse the logic and reskin.
// Counts come in as options so the call site can tune them; the helper
// constants are just the defaults.
export function useLaunchSequence(
  isLiked: boolean,
  options: SequenceOptions = {},
) {
  const { particleCount = NUM_OF_PARTICLES, starCount = NUM_OF_STARS } = options

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
        const size = random(2, 3, true)
        return {
          left: `${50 + side * offset}%`,
          size: `${size}px`,
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
    const built = range(particleCount).flatMap<Particle>((index) => {
      const angle = (index / particleCount) * 360
      const [x, y] = polarToCartesian(angle, rim)
      const [cx, cy] = polarToCartesian(
        angle + COMPANION_ANGLE,
        rim + COMPANION_GAP,
      )
      return [
        { angle, distance: PARTICLE_DISTANCE, x, y, companion: false },
        { angle, distance: PARTICLE_DISTANCE, x: cx, y: cy, companion: true },
      ]
    })

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
      }, CLEANUP_DURATION),
    ]

    // clears on unlike, rapid re-toggle, and StrictMode's double-invoke
    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      setFalling(false)
      setLaunched(false)
      setBursting(false)
      setParticles([])
    }
  }, [isLiked, particleCount])

  return { buttonRef, stars, falling, launched, bursting, particles }
}
