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
  App.tsx                          renders the grid of buttons, owns liked state
  index.css                        globals: reset, body, --red, .visually-hidden
  variations/
    LikeButton/
      LikeButton.tsx               markup (calls the hook, renders)
      useLaunchSequence.ts         the launch -> burst -> cleanup timeline
      LikeButton.helpers.ts        pure math, timeline constants, types
      LikeButton.css               component styles + keyframes
```

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
