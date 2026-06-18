# Particle Like Button

A rocket-launch "like" button, ported from a vanilla JS/CSS prototype to React + TypeScript (Vite).

Clicking the heart shrinks it, rains stars, launches a rocket with flames, pops
the heart back, and bursts particles outward. The button is fully configurable
via props, so each variation is the same component reskinned at the call site.

## Run

```bash
npm install
npm run dev      # dev server
npm run build    # production build -> dist/
```

## Structure

```
src/
  App.tsx                          scroll explainer + the grid of buttons, owns liked state
  index.css                        globals: reset, body, --red, .visually-hidden
  variations/
    LikeButton/
      LikeButton.tsx               markup (calls the hook, renders)
      useLaunchSequence.ts         the launch -> burst -> cleanup timeline
      LikeButton.helpers.ts        pure math, timeline constants (incl. ANIM_TIMELINE), types
      LikeButton.css               component styles + keyframes
  explainer/
    ScrollExplainer.tsx            scroll -> master time `t`; sticky stage + code panel
    ScrubStage.tsx                 the button frozen at frame `t` (mirrors LikeButton markup)
    timeline.ts                    trimmed code snippets + their scroll windows
    ScrollExplainer.css            sticky layout + code-panel states
```

## Scroll explainer

`App.tsx` opens with a scroll-scrubbed teardown of the default button. As you
scroll, the button is pinned and **scrubs** through its ~4s timeline (scroll
position = exact frame, reversible), while a code panel highlights the CSS
animation firing at that moment. It reuses the live `@keyframes` via
`animation-play-state: paused` + a negative `animation-delay` (rendered frame =
`t - start`); all phase timing comes from `ANIM_TIMELINE` in
`LikeButton.helpers.ts`. Respects `prefers-reduced-motion` (static reference, no
pinning).

## Props

| prop            | default          | what it does                                |
| --------------- | ---------------- | ------------------------------------------- |
| `isLiked`       | —                | controlled like state                       |
| `handleToggle`  | —                | `(newValue: boolean) => void`               |
| `color`         | `#f91780`        | overrides the `--red` theme color           |
| `particleCount` | `8`              | particles in the burst                      |
| `starCount`     | `6`              | falling stars                               |
| `spinAngle`     | `60`             | degrees the particle field rotates (signed) |
| `label`         | `Like this post` | visually-hidden accessible label            |

The current `App.tsx` demos `spinAngle` across two rows (60°–360° each
direction).
