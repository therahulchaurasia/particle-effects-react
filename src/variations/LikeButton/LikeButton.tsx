import type { CSSProperties } from 'react'
import './LikeButton.css'
import { cssVars } from './LikeButton.helpers'
import { useLaunchSequence } from './useLaunchSequence'

type LikeButtonProps = {
  isLiked: boolean
  handleToggle: (newValue: boolean) => void
  /** overrides the --red theme color */
  color?: string
  particleCount?: number
  starCount?: number
  /** degrees the particle field rotates during the burst */
  spinAngle?: number
  /** glyph to render as each burst particle instead of the default dot */
  particleSymbol?: string
  /** glyph to render as each falling star instead of the default dot */
  starSymbol?: string
  label?: string
}

function LikeButton({
  isLiked,
  handleToggle,
  color,
  particleCount,
  starCount,
  spinAngle = 60,
  particleSymbol,
  starSymbol,
  label = 'Like this post',
}: LikeButtonProps) {
  const { buttonRef, stars, falling, launched, bursting, particles } =
    useLaunchSequence(isLiked, { particleCount, starCount })

  // feed the prop into the same var the CSS already reads
  const style: CSSProperties = color
    ? ({ ...cssVars, '--red': color } as CSSProperties)
    : cssVars

  return (
    <div className="particleWrapper" style={style}>
      <button
        ref={buttonRef}
        type="button"
        aria-pressed={isLiked}
        className={`particleButton${isLiked ? ' liked' : ''}`}
        onClick={() => handleToggle(!isLiked)}
      >
        <div className={`starfield${falling ? ' falling' : ''}`}>
          {stars.map((star, i) => (
            <span
              key={i}
              className={`star${starSymbol ? ' star--symbol' : ''}`}
              style={{
                left: star.left,
                // dot uses its random px size; emoji is sized by font-size
                ...(starSymbol
                  ? null
                  : { width: star.size, height: star.size }),
                animationDuration: star.duration,
                animationDelay: star.delay,
              }}
            >
              {starSymbol}
            </span>
          ))}
        </div>
        <div className={`rig${launched ? ' launch' : ''}`}>
          <svg
            className="rocket"
            viewBox="0 0 236 437"
            fill="none"
            aria-hidden="true"
            stroke="var(--red)"
            strokeWidth="24.1078"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              className="rocket-body"
              d="M55.241 402.031C55.241 402.031 53.5788 347.985 55.241 286.531C57.2064 213.874 59.3881 129.888 59.6025 102.834C59.9981 52.8984 111.984 11.9813 121.167 12.054C130.351 12.1268 181.185 44.1003 180.712 103.794C180.462 135.311 180.461 216.275 180.508 286.531C180.551 349.339 180.508 402.031 180.508 402.031L117.53 402.031L55.241 402.031Z"
            />
            <path
              className="rocket-fin rocket-fin--left"
              d="M55.241 402.031C55.241 402.031 12.5303 429.031 12.5303 424.031C12.5302 419.031 11.4585 346.531 12.5303 342.531C13.602 338.531 55.241 286.531 55.241 286.531"
            />
            <path
              className="rocket-fin rocket-fin--right"
              d="M180.508 402.031C223.03 428.031 223.03 424.031 223.03 342.531C223.03 338.531 180.508 286.531 180.508 286.531"
            />
          </svg>
          <div className="flame"></div>
          <div className="flame flame--alt"></div>
          <div className="blob">
            <svg
              viewBox="0 0 1226 1164"
              fill="none"
              aria-hidden="true"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M649.938 12.9999C638.938 0.999999 628.938 0 615.938 0C602.938 0 585.938 6.49981 577.938 19C569.938 31.5002 573.438 55.4996 562.938 64.9998C552.438 74.5 541.438 83.9998 536.938 96.5C532.438 109 519.438 110 513.438 122.5C507.438 135 474.438 163.5 458.438 167.5C442.438 171.5 330.17 230.307 301.938 232C273.706 233.693 30.4379 313.5 7.43789 442C-15.5621 570.5 18.4379 863 59.4379 917.5C100.438 972 250.437 1206 684.938 1157C1119.44 1108 1162.94 952 1183.44 899C1203.94 846 1266.94 545 1183.44 380.5C1099.94 216 1079.44 227.5 993.438 230C907.438 232.5 845.938 200 808.438 199C770.938 198 747.938 142 721.438 135C694.938 128 686.939 140.5 672.438 131.5C657.938 122.5 661.939 98.9998 656.438 87.4998C650.938 75.9998 655.938 63.4996 659.438 51.4998C662.938 39.5 660.938 24.9998 649.938 12.9999Z"
                fill="var(--red)"
              />
            </svg>
          </div>
        </div>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3.68546 5.43796C8.61936 1.29159 11.8685 7.4309 12.0406 7.4309C12.2126 7.43091 15.4617 1.29159 20.3956 5.43796C26.8941 10.8991 13.5 21.8215 12.0406 21.8215C10.5811 21.8215 -2.81297 10.8991 3.68546 5.43796Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="visually-hidden">{label}</span>
      </button>
      <div
        className={`particleField${bursting ? ' bursting' : ''}`}
        style={{ '--spin-angle': `${spinAngle}deg` } as CSSProperties}
      >
        {particles.map((p, i) => (
          <span
            key={i}
            className={`particle${p.companion ? ' companion' : ''}${
              particleSymbol ? ' particle--symbol' : ''
            }`}
            style={
              {
                '--angle': `${p.angle}deg`,
                '--distance': `${p.distance}px`,
                left: `calc(50% + ${p.x}px)`,
                top: `calc(50% + ${p.y}px)`,
              } as CSSProperties
            }
          >
            {particleSymbol}
          </span>
        ))}
      </div>
    </div>
  )
}

export default LikeButton
