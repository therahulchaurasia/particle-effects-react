// The button frozen at scroll frame `--t` (paused animations + calc'd delays); mirrors LikeButton markup. See CLAUDE.md.
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import '../variations/LikeButton/LikeButton.css'
import {
  ANIM_TIMELINE as T,
  buildParticles,
  cssVars,
  NUM_OF_STARS,
  random,
  range,
  STAR_BAND,
  type Particle,
  type Star,
} from '../variations/LikeButton/LikeButton.helpers'

type ScrubStageProps = {
  falling: boolean
  launched: boolean
  showBurst: boolean
  heartShown: boolean
}

const HEART_POP_EASE =
  'linear(0, 0.029 1.3%, 0.119 2.8%, 0.659 8.7%, 0.871 11.6%, 1.009 14.6%, ' +
  '1.052 16.2%, 1.078 17.9%, 1.088 19.7%, 1.085 21.7%, 1.014 31.4%, ' +
  '0.993 38%, 1.001 57.6%, 1)'

function scrub(...starts: number[]): CSSProperties {
  return {
    animationPlayState: 'paused',
    animationDelay: starts
      .map((s) => `calc((${s} - var(--t, 0)) * 1ms)`)
      .join(', '),
  } as CSSProperties
}

function ScrubStage({
  falling,
  launched,
  showBurst,
  heartShown,
}: ScrubStageProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [rim, setRim] = useState(46)

  useLayoutEffect(() => {
    const el = buttonRef.current
    if (el) setRim(el.offsetWidth / 2 + 10)
  }, [])

  const stars = useMemo<Star[]>(
    () =>
      range(NUM_OF_STARS).map((i) => {
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
    [],
  )

  const particles = useMemo<Particle[]>(() => buildParticles(8, rim), [rim])

  const wrapperStyle = {
    ...cssVars,
    '--spin-angle': '60deg',
  } as CSSProperties

  return (
    <div className="particleWrapper" style={wrapperStyle}>
      <div ref={buttonRef} className="scrubClip" aria-hidden="true">
        <div className={`starfield${falling ? ' falling' : ''}`}>
          {stars.map((star, i) => (
            <span
              key={i}
              className="star"
              style={{
                left: star.left,
                width: `${2 + star.scale}px`,
                height: `${2 + star.scale}px`,
                animationDuration: star.duration,
                animationDelay: star.delay,
              }}
            >
            </span>
          ))}
        </div>

        <div
          className={`rig${launched ? ' launch' : ''}`}
          style={
            launched
              ? scrub(T.rocketRise.start, T.rocketLaunch.start)
              : undefined
          }
        >
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

        <svg
          className="scrubHeart"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          style={
            {
              animationName: 'heartDisappear, heartPop',
              animationDuration: `${T.heartDisappear.duration}ms, ${T.heartPop.duration}ms`,
              animationTimingFunction: `ease-in, ${HEART_POP_EASE}`,
              animationFillMode: 'both, forwards',
              ...scrub(T.heartDisappear.start, T.heartPop.start),
              opacity: heartShown ? 1 : 0,
            } as CSSProperties
          }
        >
          <path
            d="M3.68546 5.43796C8.61936 1.29159 11.8685 7.4309 12.0406 7.4309C12.2126 7.43091 15.4617 1.29159 20.3956 5.43796C26.8941 10.8991 13.5 21.8215 12.0406 21.8215C10.5811 21.8215 -2.81297 10.8991 3.68546 5.43796Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showBurst && (
        <div className="particleField bursting" style={scrub(T.burst.start)}>
          {particles.map((p, i) => (
            <span
              key={i}
              className={`particle${p.companion ? ' companion' : ''}`}
              style={
                {
                  '--angle': `${p.angle}deg`,
                  '--distance': `${p.distance}px`,
                  left: `calc(50% + ${p.x}px)`,
                  top: `calc(50% + ${p.y}px)`,
                  ...scrub(T.burst.start),
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ScrubStage
