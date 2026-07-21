# AXIOM — Website Art Direction ("The Rewiring")

Award-tier (Awwwards SOTD / FWA) art direction for the AXIOM marketing site.
Stack: Next.js 16 static-export · Tailwind · framer-motion · GSAP · raw WebGL
(`src/components/backgrounds/webgl.ts` — a real GLSL fragment-shader engine).
Deploy: GitHub Pages (apex needs empty `NEXT_PUBLIC_BASE_PATH`).

---

## The concept — ONE metaphor, executed everywhere

**"The Rewiring."** Your brain is a constellation of neural pathways. Addiction is
a tangled, ember-hot compulsion loop. Recovery is *rewiring* it — over the scroll,
in front of the visitor — from chaos into a calm, luminous, ordered lattice.

The site does not *describe* the product's promise. It *performs* it: as you scroll,
the brain reorganizes and the world goes from midnight → dawn.

> Award sites win on ONE metaphor executed with total discipline (Igloo = the cube).
> This is ours. Everything — type, motion, color, copy — serves the rewiring.

---

## The signature hero moment (spend 40% of effort here)

A full-screen **WebGL neural constellation**: thousands of GPU points connected by
faint synapse lines. On load it is dense, chaotic, warm-ember near the cursor,
breathing on a ~4s rhythm (tied to the app's Breathe screen). As the visitor scrolls
the site's spine, the network **reorganizes** — nodes migrate, lines re-route, the
palette cools **ember-red → violet → mint-green**, and the tangle resolves into a
serene, ordered, breathing lattice. The scroll literally rewires the brain on screen.

Feasible in `webgl.ts` (points in a vertex shader + additive lines; curl-noise drift;
`iTime`/`iMouse` already provided). Mobile: fewer points + frozen/low-motion fallback.

---

## The system

**Typography (all free, self-hosted `woff2`, Latin subset, `font-display:swap`):**
- Display / hero: **Fraunces** (variable — optical-size + soft axes; warm, editorial,
  compassionate — the honest-premium voice).
- Body / UI: **Geist** (machined neutrality).
- Mono accent (labels, numerals, node names, the "system/neuroscience" voice):
  **Geist Mono**.
- Scale: 1.25 modular ratio; body line-height 1.6, display 0.95-1.05; 8px spacing grid;
  hero type `clamp()` to ~12-16vw (a signature award move). Off-white text `#EDEAF5`
  (never pure #FFF).

**Palette (violet-tinted near-blacks, never neutral gray):**
- Base: `#08070C` → `#0E0B18`.
- Violet spine: `#6C5CE7`, glow `#8B7BFF`.
- Streak-green `#00F5A0` — the REWARD color; used sparingly, only at
  progress/dawn/resolution beats so it feels *earned*.
- The Dawn gradient (the emotional climax): indigo `#1A1440` → violet `#6C5CE7` →
  rose-gold `#FF9E7D` → mint horizon `#00F5A0`. This gradient IS the brand story.
- Secondary text muted `#8983A3`.

**Motion — choreography, not decoration (90% stillness, 10% breathtaking):**
- Smooth scroll: **Lenis**, synced to GSAP ticker (ScrollTrigger reads Lenis).
- Section storytelling: **GSAP ScrollTrigger** pinned + `scrub:1` timelines.
- Background hue **color-grades on scroll** (a uniform tween) — the darkness→dawn arc.
- Text reveal: line-masks (`overflow:hidden`, `y:110%→0`, staggered).
- Images/panels: animated `clip-path: inset()` reveals.
- Jewelry: custom blend-mode cursor (desktop only), magnetic buttons, framer-motion
  spring micro-motion on cards/CTAs, a crafted **preloader → hero handoff**.
- **The "expensive" easings (never default ease-in-out):**
  - UI/entrances: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out), 0.4-0.6s.
  - Reveals: `cubic-bezier(0.65, 0, 0.35, 1)`.
  - Tactile: framer spring `stiffness ~120, damping ~18`. Nothing bounces unless it's
    a deliberate personality beat.
- **Grain overlay** at 3-6% over everything — the single layer that reads "film," not
  "web."

---

## The narrative arc (scroll = the rewiring, midnight → dawn)

1. **Preloader** — real asset-load counter; a single ember node pulses; on complete it
   ignites and the constellation blooms into the hero. Sets the whole tone.
2. **Hero — "Rewire your brain."** The chaotic ember constellation, breathing. Kinetic
   headline (Fraunces, huge). One line of honest copy. Two CTAs (Play / iOS soon). A
   quiet mono line: `zero-knowledge · we cannot read your data`.
3. **The problem (still dark)** — the honest manifesto: the category's dark patterns and
   the Quittr-style breach, stated plainly. Background at its coldest/darkest. Green
   absent.
4. **The rewiring begins** — pinned scroll section where the constellation visibly
   reorganizes; copy on neuroplasticity, honest and grounded. Hue warms ember→violet.
5. **The privacy vault (Concept 3 as a chapter)** — the world goes silent/sealed; "your
   recovery never leaves your phone," zero-knowledge explained. Architectural, weighty.
6. **The tools** — bento of the real features (Rewire Map, Panic free-forever, Breathe,
   Pattern engine, the Shield), each a small tactile spring-card.
7. **Dawn (the payoff)** — the full dawn gradient arrives; the lattice is calm and
   ordered; green appears for the first time, *earned*. Honest pricing (7-day trial,
   once, no tricks).
8. **Final CTA + footer** — "Day one starts when you decide." Luna Maze wordmark,
   privacy/terms.

---

## Build order (ship in this sequence; resist a 2nd hero effect)

1. **Foundation (direction-agnostic, do first):** Lenis + GSAP ticker sync; the type
   system (Fraunces/Geist/Geist Mono self-hosted); palette tokens; the easing set; grain
   overlay; a `useReducedMotion` gate wired everywhere. → *already reads premium.*
2. **The hero signature moment** — the neural-constellation shader + scroll-reorganize.
   40% of the effort. This is what gets awarded.
3. **Scroll choreography** — pinned section reveals, line-mask text, color-grade uniform,
   magnetic buttons, custom cursor, preloader.
4. **Polish** — spring micro-motion, section color grading, reduced-motion + mobile
   fallbacks, performance pass.

---

## Guardrails (non-negotiable for an award + a11y)

- Honor `prefers-reduced-motion` everywhere (static gradient + instant reveals fallback).
- Lazy-init WebGL (after first paint / idle); IntersectionObserver pause; DPR cap ~1.5-2;
  `cancelAnimationFrame` on unmount. (webgl.ts already does most of this.)
- Mobile: fewer/no particles, CSS-gradient or static fallback; never ship 20k points to a
  phone. Detect via `pointer:coarse` + `hardwareConcurrency`.
- Budget: LCP < 2.5s; subset fonts (~30-60KB total); grain as one tiled 128px asset.
- Static-export: all WebGL/scroll client-only (`'use client'`, guard `window`);
  base-path-aware asset URLs so `/fonts/*` `/textures/*` resolve on Pages.
- Copy stays honest, gender-neutral, no em-dashes, no fake metrics.

---

## Reference bar (steal one thing from each)

Active Theory (load-as-narrative) · Resn (cursor-reactive canvas) · Basement (grain +
mono over near-black) · Darkroom/Lenis (inertia scroll + rhythm) · Locomotive (section
color grading) · Igloo Inc (one hero object you scroll through) · Unseen (clip-mask
reveals) · Dennis Snellenberg (preloader→hero, magnetic buttons, cursor) · Robin Noguier
(RGB-shift image distortion) · Aristide Benoist (overlay page transitions) · Emil Kowalski
(easing discipline) · Rauno (micro-interaction fidelity) · Linear/Vercel (dark restraint,
mesh glow, negative space) · Family (spring physics) · Arc (humanizing texture) ·
Oura/Whoop/Eight Sleep (dark data-as-glow) · Calm/Headspace (define AGAINST — be the
premium, dark, cinematic, honest anti-Calm).

_Alternatives considered: "Dawn After Darkness" (one gradient-sky shader — most feasible,
folded in as the color arc) and "The Private Vault" (privacy-as-hero — folded in as
chapter 5). The Rewiring wins as the spine: most ownable, uniquely AXIOM, and it
visualizes the product's actual promise._
