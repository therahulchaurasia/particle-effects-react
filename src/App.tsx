import { useState, type CSSProperties } from 'react'
import LikeButton from './variations/LikeButton/LikeButton'

const COLUMNS = 5 // grid width; the list wraps to new rows automatically

// a grid cell = one labelled button + the props that make it that variation
type Cell = {
  key: string
  label: string
  props: {
    color?: string
    spinAngle?: number
    launchAngle?: number
    launchSpread?: number
    orbit?: boolean
    swirl?: boolean
    fireworks?: boolean
    particleCount?: number
    starSymbol?: string
    particleSymbol?: string
    companion?: boolean
  }
}

const VARIATIONS: Cell[] = [
  { key: 'orbit', label: 'orbit', props: { orbit: true } },
  { key: 'random-tilt', label: 'random tilt ±20°', props: { launchSpread: 20 } },
  {
    key: 'stars',
    label: 'stars',
    props: { starSymbol: '⭐', particleSymbol: '⭐', companion: false },
  },
  {
    key: 'fireworks',
    label: 'fireworks',
    // green heart/rocket/flames/plume; particles keep their random colors
    props: { fireworks: true, particleCount: 24, color: '#34d399' },
  },
  { key: 'spin-360', label: '360°', props: { spinAngle: 360 } },
]

// one boxed cell: subtle separation, button up top, label spaced below
const cell: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1.5rem',
  padding: '2.25rem 1rem 1.25rem',
  minHeight: 160,
  border: '1px dashed rgba(255, 255, 255, 0.14)',
  borderRadius: 10,
}
const cellLabel: CSSProperties = { color: '#9ca3af', fontSize: 14 }

function App() {
  const [defaultLiked, setDefaultLiked] = useState(false)

  // one liked flag per variation, by index
  const [liked, setLiked] = useState<boolean[]>(() => VARIATIONS.map(() => false))
  const toggle = (i: number, value: boolean) =>
    setLiked((prev) => prev.map((v, idx) => (idx === i ? value : v)))

  return (
    <div
      className="app"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100vw',
        gap: '3rem',
        padding: '6rem 2rem 3rem',
      }}
    >
      {/* the original, unconfigured button — standalone box on top */}
      <div style={{ ...cell, width: 220 }}>
        <LikeButton isLiked={defaultLiked} handleToggle={setDefaultLiked} />
        <span style={cellLabel}>default</span>
      </div>

      {/* the variations; the grid wraps every COLUMNS cells into a new row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
          gap: '1rem',
          width: '100%',
          maxWidth: 1400,
        }}
      >
        {VARIATIONS.map((variation, i) => (
          <div key={variation.key} style={cell}>
            <LikeButton
              isLiked={liked[i]}
              handleToggle={(value) => toggle(i, value)}
              {...variation.props}
            />
            <span style={cellLabel}>{variation.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
