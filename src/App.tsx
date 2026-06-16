import { useState } from 'react'
import LikeButton from './variations/LikeButton/LikeButton'

type Variant = {
  key: string
  label: string
  // anything LikeButton accepts beyond isLiked/handleToggle
  props: {
    spinAngle?: number
    particleSymbol?: string
    starSymbol?: string
  }
}

const SPIN_ANGLES = [60, 120, 180, 240, 300, 360]

// each row is a list of button variants; state mirrors this shape
const ROWS: Variant[][] = [
  SPIN_ANGLES.map((a) => ({
    key: `cw-${a}`,
    label: `${a}°`,
    props: { spinAngle: a },
  })),
  SPIN_ANGLES.map((a) => ({
    key: `ccw-${a}`,
    label: `${-a}°`,
    props: { spinAngle: -a },
  })),
  [
    { key: 'star-burst', label: 'star burst', props: { particleSymbol: '⭐' } },
    { key: 'star-rain', label: 'star rain', props: { starSymbol: '⭐' } },
  ],
]

function App() {
  const [liked, setLiked] = useState<boolean[][]>(() =>
    ROWS.map((row) => row.map(() => false)),
  )

  const toggle = (row: number, col: number, value: boolean) =>
    setLiked((prev) =>
      prev.map((r, ri) =>
        ri === row ? r.map((v, ci) => (ci === col ? value : v)) : r,
      ),
    )

  return (
    <div
      className="app"
      style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
    >
      {ROWS.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: '2rem' }}>
          {row.map((variant, ci) => (
            <div
              key={variant.key}
              style={{ display: 'grid', placeItems: 'center', gap: '0.5rem' }}
            >
              <LikeButton
                isLiked={liked[ri][ci]}
                handleToggle={(value) => toggle(ri, ci, value)}
                {...variant.props}
              />
              <span style={{ color: '#9ca3af', fontSize: 14 }}>
                {variant.label}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default App
