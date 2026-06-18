// Page: three labeled sections — hero button, explainer, variations grid. See CLAUDE.md.
import { useState, type CSSProperties } from "react"
import LikeButton from "./variations/LikeButton/LikeButton"
import ScrollExplainer from "./explainer/ScrollExplainer"

type Cell = {
  key: string
  label: string
  props: {
    color?: string
    spinAngle?: number
    launchAngle?: number
    launchSpread?: number
    orbit?: boolean
    fireworks?: boolean
    particleCount?: number
    starSymbol?: string
    particleSymbol?: string
    companion?: boolean
  }
}

const VARIATIONS: Cell[] = [
  { key: "orbit", label: "orbit", props: { orbit: true } },
  {
    key: "random-tilt",
    label: "random tilt ±20°",
    props: { launchSpread: 20 },
  },
  {
    key: "stars",
    label: "stars",
    props: { starSymbol: "⭐", particleSymbol: "⭐", companion: false },
  },
  {
    key: "Colorful",
    label: "Colorful",
    props: { fireworks: true, particleCount: 24 },
  },
  { key: "spin-360", label: "360°", props: { spinAngle: 360 } },
]

const cell: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1.5rem",
  padding: "2.25rem 1rem 1.25rem",
  minHeight: 160,
  border: "1px dashed rgba(255, 255, 255, 0.14)",
  borderRadius: 10,
}
const cellLabel: CSSProperties = { color: "#9ca3af", fontSize: 14 }

function App() {
  const [defaultLiked, setDefaultLiked] = useState(false)
  const [liked, setLiked] = useState<boolean[]>(() =>
    VARIATIONS.map(() => false),
  )
  const toggle = (i: number, value: boolean) =>
    setLiked((prev) => prev.map((v, idx) => (idx === i ? value : v)))

  return (
    <div
      className="app"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        gap: "2.5rem",
        padding: "5rem 1.5rem 4rem",
      }}
    >
      <section className="pageSection">
        <h2 className="sectionLabel">
          For those who want to try out the button
        </h2>
        <div className="sectionBody">
          <div style={{ transform: "scale(1.4)", margin: "0.75rem 0 1.25rem" }}>
            <LikeButton isLiked={defaultLiked} handleToggle={setDefaultLiked} />
          </div>
        </div>
      </section>

      <section className="pageSection">
        <h2 className="sectionLabel">
          For those who want to try out fun variations
        </h2>
        <div className="variationsGrid">
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
      </section>

      <section className="pageSection">
        <div className="sectionHead">
          <h2 className="sectionLabel">
            For those who want to see the breakdown
          </h2>
          <span className="desktopNote">Best viewed on a desktop device</span>
        </div>
        <ScrollExplainer />
      </section>

      <footer className="pageFooter">
        Breakdown by yours truly —{" "}
        <a
          className="footerLink"
          href="https://x.com/rahul_twtss"
          target="_blank"
          rel="noopener noreferrer"
        >
          @rahul_twtss
        </a>
      </footer>
    </div>
  )
}

export default App
