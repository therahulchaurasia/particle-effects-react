# Project notes

React 19 + TypeScript + Vite. A rocket-launch "like" button, plus a scroll-driven
explainer that teaches how the default button is built. Font: Poppins (loaded in
`index.html`). Theme color `--red` in `index.css`.

## Page layout (`src/App.tsx`)

Three labeled sections (small left-aligned `.sectionLabel` headers, see
`index.css`):

1. the default `LikeButton` (hero, centered in `.sectionBody`)
2. `<ScrollExplainer />` — the breakdown
3. the variations grid (`.variationsGrid`, 5 cols → 3 → 2 responsive)

## The button (`src/variations/LikeButton/`)

- `LikeButton.tsx` — controlled (`isLiked` / `handleToggle`); props reskin it
  (color, counts, `orbit`/`fireworks`/`spinAngle`/symbols, etc.).
- `useLaunchSequence.ts` — owns the launch→burst→cleanup timeline with
  `setTimeout`; JS only flips class flags (`falling`/`launched`/`bursting`), CSS
  `@keyframes` in `LikeButton.css` do all motion.
- `LikeButton.helpers.ts` — **single source of truth for all timing**. Raw ms
  constants → `cssVars` (the `--*-duration`/`--*-delay` custom props the CSS reads)
  → `ANIM_TIMELINE` (`{start,duration}` per animation, consumed by the explainer) →
  `EXPLAINER_DURATION`. Also pure math (`random`, `range`, `polarToCartesian`,
  `buildParticles`). **Don't hardcode timing anywhere else — derive from here.**

## The explainer (`src/explainer/`)

Goal: scrubbing the page scroll scrubs the button through its ~4s timeline while a
panel of code cards highlights whatever animation is firing.

### Scrub mechanism (key idea)
The button frame is driven by a single CSS custom property `--t` (ms on the master
timeline). Each animated element uses `animation-play-state: paused` +
`animation-delay: calc((start - var(--t)) * 1ms)`, so the rendered frame is
`(--t - start)`. Reuses the live `@keyframes` (no rewrite); works cross-browser
(unlike `animation-timeline: scroll()`).

### `ScrollExplainer.tsx`
- `progressToTime()` maps scroll progress → `t` **piecewise** across `PHASES`
  (heart / rocket / finale, with `weight`s). This keeps the panel and button in
  sync (both read the same phase boundaries) while giving the short heart phase
  enough scroll room. Keep PHASES boundaries == the cards' enter/exit boundaries.
- Perf: the scroll handler writes `--t` straight to the section's DOM each frame
  (no React render). React only re-renders when the `Snapshot` signature changes —
  i.e. a gate flips or a card crosses a slot/highlight boundary (a few times total).
  `--t` is **DOM-managed in scrub mode** (kept out of React's inline style so
  re-renders don't clobber it); in static mode it's pinned via inline style.
- `Snapshot` = four gate booleans (`falling`/`launched`/`showBurst`/`heartShown`)
  passed to `ScrubStage`, plus per-card `CardState`.
- Static mode (`prefers-reduced-motion` OR `max-width: 760px`): no pin, no scrub —
  a plain scrollable list of all cards. This is why mobile isn't scroll-jacked.

### `ScrubStage.tsx`
- **Mirrors `LikeButton.tsx` markup** and reuses `LikeButton.css` classes/keyframes.
  Keep this markup in sync if the button's structure changes.
- Unlike the live button, every element is mounted at once and frozen by `--t`.
- Gotchas:
  - Heart is driven by its **own inline animation**, not the shared
    `.particleButton.liked > svg` rule: that rule animates opacity from two
    animations (`invisible` → 0, then `heartPop` → 1); frozen by the scrub,
    `invisible`'s `forwards` fill wins and the pop never reveals. So the stage
    scrubs only the heart transforms and drives opacity via the `heartShown` prop;
    `heartPop` uses fill `forwards` so it doesn't preview `scale(3)` early.
    `HEART_POP_EASE` is duplicated from `LikeButton.css` (the springy `linear()`).
  - Rig: the `launched` gate removes the launch animation after `ROCKET_END` so the
    rig falls back to base (below the clip) and the plume doesn't linger.
  - Particles mount only when `showBurst` (before the burst, `disperse` frame 0
    would show them piled at center).
  - The round `.scrubClip` clips rocket/stars (rise in / launch out); the heart is a
    sibling layer clipped to the same window so its pop reads as a heart, not a disc.

### `timeline.ts`
- `SNIPPETS` = the panel cards. A card has a `description` (prose) and `parts[]`;
  each part is a `code` snippet with its own `[activeStart, activeEnd]` highlight
  window, but the whole card shares one `enterAt`/`exitAt` (parts slide in/out
  together). The heart card has two parts (shrink + hide).
- `cardStateAt(card, t)` → `slot` (`before` parked right / `in` slot / `after` slid
  back right) + per-part `active` flags.
- **To change the explanation text → edit `description`. To change shown CSS → edit
  `code`.** `STAGGER` spaces cards within a phase; `EXIT_LINGER` lets a card that
  finishes early (rocket rise, burst) leave before its phase-mates.

### `ScrollExplainer.css`
- `.explainer` is a tall (420vh) scroll track; `.explainerSticky` pins for the
  scrub. Cards slide via `max-height` + `opacity` + `translateX` on `.snippet`
  (`--in` = in slot). `.snippet--in { max-height: 480px }` is a cap — **bump it if a
  card's content clips.** Per-part highlight = `.snippetCodeBox--active`.
  `.explainer--static` is the mobile/reduced-motion plain-list mode.
