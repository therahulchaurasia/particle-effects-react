// Panel cards: prose + code parts and their scroll windows. Edit `description`/`code` to change panel text. See CLAUDE.md.
import {
  ANIM_TIMELINE as T,
  ROCKET_END,
  EXPLAINER_DURATION,
} from "../variations/LikeButton/LikeButton.helpers"

export type CardSlot = "before" | "in" | "after"

export type CodePart = {
  code: string
  activeStart: number
  activeEnd: number
}

export type Snippet = {
  id: string
  title: string
  description: string
  parts: CodePart[]
  enterAt: number
  exitAt: number
}

export type CardState = {
  slot: CardSlot
  active: boolean[]
}

const HEART_PHASE_END = 320
export const PHASES = [
  { id: "heart", tStart: 0, tEnd: HEART_PHASE_END, weight: 1.1 },
  { id: "rocket", tStart: HEART_PHASE_END, tEnd: ROCKET_END, weight: 1.7 },
  { id: "finale", tStart: ROCKET_END, tEnd: EXPLAINER_DURATION, weight: 1.2 },
] as const

const ROCKET_GROUP_END = ROCKET_END
const FINALE_START = ROCKET_END
const FINALE_END = EXPLAINER_DURATION + 1
const STAGGER = 180
const EXIT_LINGER = 200

export const SNIPPETS: Snippet[] = [
  {
    id: "heart",
    title: "heart · shrink + hide",
    description:
      "When you click we add a .liked class that triggers a scale-down and fade-out of the heart. We use a separate keyframe for each so we can stagger them and keep the heart visible until the rocket rises. The heart is still in the DOM after it disappears, so we can pop it back in at the end.",
    parts: [
      {
        code: `@keyframes heartDisappear {
  to { transform: scale(0.3) translateY(100%); }
}`,
        activeStart: T.heartDisappear.start,
        activeEnd: T.heartDisappear.start + T.heartDisappear.duration,
      },
      {
        code: `@keyframes invisible {
  to { opacity: 0; }
}`,
        activeStart: T.invisible.start,
        activeEnd: HEART_PHASE_END,
      },
    ],
    enterAt: 0,
    exitAt: HEART_PHASE_END,
  },
  {
    id: "starFall",
    title: "stars · speed lines",
    description:
      "Small dots rain on an infinite loop through the whole buildup, each star is given a randomized position, size and timing in JS, then the keyframe just repeats. We use the button width to keep it on the edges and not touch the rocket.",
    parts: [
      {
        code: `@keyframes starFall {
  from { transform: translateY(-6px); }
  to   { transform: translateY(84px); }
}
.starfield.falling .star {
  animation: starFall linear infinite;
}`,
        activeStart: T.starFall.start,
        activeEnd: T.starFall.start + T.starFall.duration,
      },
    ],
    enterAt: T.starFall.start,
    exitAt: T.starFall.start + T.starFall.duration,
  },
  {
    id: "rocketRise",
    title: "rocket · rise",
    description: `The rig (rocket + flames) starts below the button and rises to center on an ease-out, settling into a brief hold. Don't ask me why it doesn't rotate at hold 😅.`,
    parts: [
      {
        code: `@keyframes rocketRise {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); } /* to center */
}`,
        activeStart: T.rocketRise.start,
        activeEnd: T.rocketRise.start + T.rocketRise.duration,
      },
    ],
    enterAt: HEART_PHASE_END,
    exitAt: T.rocketRise.start + T.rocketRise.duration + EXIT_LINGER,
  },
  {
    id: "flames",
    title: "flames · burn",
    description:
      "Two overlapping blobs squash and morph on their own fast loops. Together they read as one flickering plume under the rocket.",
    parts: [
      {
        code: `.rig.launch .flame {
  animation:
    squash 360ms infinite alternate,
    morph  520ms infinite alternate;
}
/* two blobs read as one plume */`,
        activeStart: T.flames.start,
        activeEnd: T.flames.start + T.flames.duration,
      },
    ],
    enterAt: HEART_PHASE_END + STAGGER,
    exitAt: ROCKET_GROUP_END,
  },
  {
    id: "rocketLaunch",
    title: "rocket · launch",
    description:
      "After the hold it dips slightly (the wind-up) then shoots off the top of the frame.",
    parts: [
      {
        code: `@keyframes rocketLaunch {
  0%   { transform: translateY(0); }
  18%  { transform: translateY(10%); }   /* dip */
  100% { transform: translateY(-140%); } /* gone */
}`,
        activeStart: T.rocketLaunch.start,
        activeEnd: T.rocketLaunch.start + T.rocketLaunch.duration,
      },
    ],
    enterAt: HEART_PHASE_END + 2 * STAGGER,
    exitAt: ROCKET_GROUP_END,
  },
  {
    id: "heartPop",
    title: "heart · pop",
    description:
      "As the rocket leaves, the heart springs back from a larger scale than the button and uses a springy linear() easing to settle back into the button.",
    parts: [
      {
        code: `@keyframes heartPop {
  from { transform: scale(3); }
  to   { transform: scale(1); }
}
/* springy linear() easing, fires after burst-delay */`,
        activeStart: T.heartPop.start,
        activeEnd: T.heartPop.start + T.heartPop.duration,
      },
    ],
    enterAt: FINALE_START,
    exitAt: FINALE_END,
  },
  {
    id: "burst",
    title: "particles · burst",
    description:
      "The particles are timed to fire when the heart is springing back from the overshoot. Each particle is given a randomized direction and distance in JS, then the keyframe just animates them out to that position and scales them down to zero.",
    parts: [
      {
        code: `@keyframes disperse {
  40% { transform: translate(cos·d, sin·d); }
  to  { transform: translate(cos·d, sin·d) scale(0); }
}
.particleField.bursting { animation: spin var(--burst) ease-out; }`,
        activeStart: T.burst.start,
        activeEnd: T.burst.start + T.burst.duration,
      },
    ],
    enterAt: FINALE_START + STAGGER,
    exitAt: T.burst.start + T.burst.duration + EXIT_LINGER,
  },
]

export function cardStateAt(s: Snippet, t: number): CardState {
  const slot: CardSlot =
    t < s.enterAt ? "before" : t >= s.exitAt ? "after" : "in"
  const active = s.parts.map((p) => t >= p.activeStart && t <= p.activeEnd)
  return { slot, active }
}
