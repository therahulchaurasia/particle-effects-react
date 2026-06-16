import { useState } from 'react'
import LikeButton from './variations/LikeButton/LikeButton'

const SPIN_ANGLES = [60, 120, 180, 240, 300, 360]
// row 0 spins clockwise, row 1 the opposite way (negative degrees)
const ROWS = [SPIN_ANGLES, SPIN_ANGLES.map((a) => -a)]

function App() {
  // one liked-flag per button: liked[row][col]
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
          {row.map((angle, ci) => (
            <div
              key={angle}
              style={{ display: 'grid', placeItems: 'center', gap: '0.5rem' }}
            >
              <LikeButton
                isLiked={liked[ri][ci]}
                handleToggle={(value) => toggle(ri, ci, value)}
                spinAngle={angle}
              />
              <span style={{ color: '#9ca3af', fontSize: 14 }}>{angle}°</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default App
