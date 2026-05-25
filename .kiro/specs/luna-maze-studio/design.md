# Design Document: Luna Maze Studio Site

## Overview

Luna Maze is the parent studio brand site that replaces the Axiom marketing site at the deployment root and relocates Axiom to `/axiom/`. The implementation reuses the existing Next.js 16 + React 19 + TypeScript + Tailwind + Framer Motion + GSAP stack and ships as a single static export to GitHub Pages on `main`. No new runtime dependencies are introduced. Luna Maze components live under a dedicated `src/components/lunamaze/` namespace, brand tokens extend the existing Tailwind theme alongside the untouched `axiom-*` palette, and a GitHub Actions workflow handles deployment using the official GitHub Pages actions.

## Goals & Non-Goals

**Goals**
- Stand up a founder-grade studio landing page suitable for sharing with AWS Activate and prospective partners.
- Preserve the existing Axiom site verbatim at `/axiom/` with zero feature regression.
- Ship via static export to GitHub Pages from the `main` branch with a one-step push-to-deploy workflow.
- Encode AWS application copy as first-class content artifacts so the founder can lift them directly into the Activate form.

**Non-Goals**
- Building a CMS or dynamic content pipeline.
- Server-side rendering, API routes, or runtime backend.
- Migrating Axiom's design language; Axiom retains its current visual identity.
- Adding analytics, A/B testing, or marketing automation.

## Architecture

### Routing strategy

The Next.js App Router supports nested route segments via folders under `src/app/`. We adopt the following layout:

```
src/app/
  layout.tsx              # Shared root layout (font, lang="en", metadata defaults)
  page.tsx                # Luna Maze landing (NEW — replaces current Axiom landing)
  axiom/
    layout.tsx            # Axiom-specific metadata + body styles (lifted from current root)
    page.tsx              # Axiom landing (relocated, content unchanged)
```

The current root `src/app/page.tsx` renders the Axiom landing. We move that file's contents to `src/app/axiom/page.tsx` (with the `NeuralOrb` import paths preserved) and write a new Luna Maze `page.tsx` at the root. The current `layout.tsx` is split: a slim shared root layout owns `<html lang>`, font wiring, and shared metadata defaults; an Axiom-specific layout under `src/app/axiom/layout.tsx` owns the Axiom title, description, and `bg-axiom-bgDeep` body class. The Luna Maze page declares its own metadata via the App Router's `metadata` export.

This keeps Axiom's components in `src/components/` untouched and isolates new Luna Maze components in `src/components/lunamaze/`.

### Static export and base path

The existing `next.config.js` already sets `output: 'export'` and `distDir: 'dist'`. We extend it to read an optional `NEXT_PUBLIC_BASE_PATH` environment variable so a project-page deployment (`https://<user>.github.io/<repo>/`) can pass the repo name as the base path without code changes:

```javascript
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: { root: __dirname },
};
```

`trailingSlash: true` ensures GitHub Pages serves `dist/axiom/index.html` for `/axiom/` URLs without an extra rewrite. A `public/.nojekyll` file (committed) instructs GitHub Pages to skip Jekyll processing so that `_next/` assets are served correctly; Next.js copies everything under `public/` into `dist/` during export.

### Component architecture

```
src/components/
  lunamaze/
    LunaNavbar.tsx           # Top nav with anchor links to Luna Maze sections
    LunaHero.tsx             # Hero section with constellation/maze SVG motif + GSAP timeline
    LunaConstellation.tsx    # Standalone SVG motif component (consumed by LunaHero)
    StudioSection.tsx        # About + What we're building paragraphs
    ProductsGrid.tsx         # Products grid (Axiom + coming-soon placeholders)
    ProductCard.tsx          # Single product card
    CapabilitiesSection.tsx  # Capabilities grid
    FounderSection.tsx       # Founder bio + external links
    ContactSection.tsx       # Email + social links
    LunaFooter.tsx           # Studio footer
  ScrollReveal.tsx           # REUSED from existing Axiom components
  ...existing Axiom components (unchanged)
src/content/
  lunamaze.ts                # Typed data: products, capabilities, copy strings, social links
```

All components are React function components with explicit prop types. `ScrollReveal` is reused from the existing Axiom codebase to keep entrance animations consistent with the project's pattern. No new runtime npm dependencies are introduced.

### Brand tokens

Tailwind's theme is extended with a `lunamaze` color namespace alongside the existing `axiom` namespace:

```javascript
// tailwind.config.js (extension)
colors: {
  axiom: { /* unchanged */ },
  lunamaze: {
    bgDeep:        '#06081A',  // deepest midnight
    bgPrimary:     '#0A0E27',  // page background
    bgSurface:     '#121737',  // card surface
    bgElevated:    '#1A2150',  // elevated surface
    violet:        '#7B5CFF',  // electric violet (primary brand)
    violetLight:   '#A48CFF',
    silver:        '#C7CCE0',  // lunar silver (secondary text / accents)
    signal:        '#FFD27A',  // warm signal gold (highlights, CTA accent)
    textPrimary:   '#F2F3FA',
    textSecondary: '#B6B9D2',
    textDim:       '#6E72A0',
    border:        '#22264A',
  },
},
```

Contrast pairs that the Luna Maze pages rely on (verified against WCAG AA in the property check):

| Foreground | Background | Use | Required ratio |
|---|---|---|---|
| `lunamaze.textPrimary` `#F2F3FA` | `lunamaze.bgDeep` `#06081A` | body text | ≥ 4.5:1 |
| `lunamaze.textPrimary` `#F2F3FA` | `lunamaze.bgPrimary` `#0A0E27` | body text | ≥ 4.5:1 |
| `lunamaze.textPrimary` `#F2F3FA` | `lunamaze.bgSurface` `#121737` | card text | ≥ 4.5:1 |
| `lunamaze.textSecondary` `#B6B9D2` | `lunamaze.bgPrimary` `#0A0E27` | secondary text | ≥ 4.5:1 |
| `lunamaze.signal` `#FFD27A` | `lunamaze.bgPrimary` `#0A0E27` | accent/CTA text | ≥ 4.5:1 |
| `lunamaze.violetLight` `#A48CFF` | `lunamaze.bgPrimary` `#0A0E27` | links/CTA | ≥ 4.5:1 |

Additional CSS custom properties may be declared in `src/app/globals.css` if a component requires runtime computed access, but Tailwind utility classes are the primary surface.

### Hero motif: SVG constellation/maze

The hero centerpiece is a single SVG element (`<LunaConstellation />`) — not a `<canvas>` — for three reasons: (a) static export bundles it inline with no extra fetch, (b) SVG is screen-reader-suppressible via `aria-hidden`, (c) GSAP can animate SVG attributes directly via the existing `@gsap/react` integration. The component renders:

- A radial backdrop using a Tailwind gradient (no SVG needed).
- A maze-like polyline grid drawn via SVG `<path>` elements.
- A constellation of `<circle>` nodes positioned at maze intersections.
- Connecting `<line>` segments rendered with a low opacity by default.

GSAP timeline on mount (within a `useGSAP` hook):
1. Fade in the polyline grid by stroke-dashoffset.
2. Stagger-pop the constellation nodes (scale 0 → 1).
3. Trace the connecting lines using stroke-dasharray.
4. Idle loop: a slow opacity pulse on a subset of nodes (driven by `opacity` only — no transform churn).

A media-query check via `window.matchMedia('(prefers-reduced-motion: reduce)')` short-circuits the timeline and renders the SVG in its final, static state when reduced motion is preferred. The hero element uses `min-h-screen md:min-h-screen` to satisfy the full-viewport requirement on tablet and above.

### Content data layer

```typescript
// src/content/lunamaze.ts
export type ProductStatus = 'live' | 'coming-soon';

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: ProductStatus;
  readonly href?: string; // present iff status === 'live'
  readonly tag?: string;  // optional category label
}

export interface Capability {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: 'spark' | 'compass' | 'pulse' | 'orbit' | 'ship' | 'graph';
}

export interface SocialLink {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly host: 'github' | 'linkedin' | 'twitter' | 'email';
}

export const aboutCopy: string;             // 300–500 chars, mentions "Luna Maze"
export const buildingCopy: string;          // 300–500 chars, mentions "Luna Maze"
export const products: ReadonlyArray<Product>;
export const capabilities: ReadonlyArray<Capability>;
export const founderSocials: ReadonlyArray<SocialLink>;
export const contactEmail: string;
```

This single typed module is the source of truth for everything that surfaces in Luna Maze sections and the AWS application document.

### AWS application document

A repo-root `AWS_APPLICATION.md` is generated by hand from the same constants. It contains:

```markdown
# Luna Maze — AWS Activate Application Copy

## Founder
Harikrishnan V — Founder, Luna Maze

## Site URL
<DEPLOYED_URL>

## About Luna Maze (paste into "Tell us about your startup")
{{aboutCopy}}

## What we're building
{{buildingCopy}}
```

This file lives at the repo root so it's discoverable next to `README.md` without rebuilding.

### Deployment workflow

`.github/workflows/deploy.yml` uses official GitHub-maintained actions:

```yaml
name: Deploy Luna Maze
on:
  push: { branches: [main] }
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_BASE_PATH: ${{ vars.NEXT_PUBLIC_BASE_PATH }}
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

The repo variable `NEXT_PUBLIC_BASE_PATH` is set in repo Settings → Variables when the deployment is a project-page (e.g., `/luna-maze-studio`); for a user/org page (`<user>.github.io`) it stays unset and the build emits root-relative URLs. The `build` job exits non-zero on any step failure, satisfying the halt-before-publish requirement.

## Components and Interfaces

### `LunaMazePage` (root `src/app/page.tsx`)

Composes the Luna Maze sections in order. Declares `metadata` for the page (title, description, OG tags). Wraps content in `<main>` with semantic landmarks.

### `LunaNavbar`

```typescript
interface LunaNavbarProps { readonly anchors?: ReadonlyArray<{ id: string; label: string }>; }
```

Renders a sticky top bar with anchor links to `#studio`, `#products`, `#capabilities`, `#founder`, `#contact`. Uses Framer Motion for a subtle on-scroll background fade.

### `LunaHero`

```typescript
interface LunaHeroProps { readonly title?: string; readonly tagline?: string; readonly intro?: string; }
```

Renders the hero with the constellation motif, a `Get in touch` primary CTA (anchors to `#contact`), and a `See products` secondary link (anchors to `#products`). Reduced-motion respected.

### `LunaConstellation`

```typescript
interface LunaConstellationProps {
  readonly nodeCount?: number;       // default 24
  readonly className?: string;
}
```

Pure presentational SVG. No props from upstream other than appearance hooks. `aria-hidden="true"` always.

### `StudioSection`

Reads `aboutCopy` and `buildingCopy` from the content module. Renders two paragraphs side-by-side on desktop, stacked on mobile.

### `ProductsGrid` and `ProductCard`

```typescript
interface ProductsGridProps { readonly products: ReadonlyArray<Product>; }
interface ProductCardProps  { readonly product: Product; }
```

`ProductCard` renders a `<a>` element when `product.status === 'live'` and `product.href` is defined; otherwise a `<div role="group" aria-disabled="true">`. Status labels are rendered as a small pill.

### `CapabilitiesSection`

```typescript
interface CapabilitiesSectionProps { readonly items: ReadonlyArray<Capability>; }
```

Renders a 2×3 grid (or 2×2 / 3×2 depending on count). Icons are inline SVGs keyed by `Capability.icon`.

### `FounderSection`

Static content driven by `founderSocials`. Every external link uses `target="_blank" rel="noopener noreferrer"`.

### `ContactSection`

Renders `mailto:` link from `contactEmail` and the social links from `founderSocials` (filtered for non-`email` hosts).

### `LunaFooter`

Studio name, copyright, link to `/axiom/`, and the same socials as `ContactSection` in compact form.

## Data Models

```typescript
type ProductStatus = 'live' | 'coming-soon';

interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: ProductStatus;
  readonly href?: string;
  readonly tag?: string;
}

interface Capability {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: 'spark' | 'compass' | 'pulse' | 'orbit' | 'ship' | 'graph';
}

interface SocialLink {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly host: 'github' | 'linkedin' | 'twitter' | 'email';
}
```

Initial seed data:

```typescript
export const products: ReadonlyArray<Product> = [
  { id: 'axiom',     name: 'Axiom',     description: 'Premium habit tracker for brain recovery — build streaks, rewire pathways, reclaim focus.', status: 'live', href: '/axiom/', tag: 'Product 01' },
  { id: 'project-2', name: 'In the maze', description: 'Our next product is being mapped. Charting routes through ambient cognition.',           status: 'coming-soon', tag: 'Product 02' },
  { id: 'project-3', name: 'Signal',     description: 'A research thread becoming a product. Coming when it''s ready, not before.',                status: 'coming-soon', tag: 'Product 03' },
];
```

## Error Handling

This is a static, content-only site with no runtime data fetching, no forms, and no user input. The error surface is therefore narrow:

- **Build failures**: surfaced by `next build` with a non-zero exit code; the GitHub Actions workflow halts before the publish step.
- **Missing environment variable** (`NEXT_PUBLIC_BASE_PATH`): defaults to empty string in `next.config.js`; deployment still succeeds for a user-page repo.
- **Hero animation failure** (e.g., GSAP fails to load): the SVG renders in its final static state because all initial values are written into the SVG markup, not applied via JS. The animation is a progressive enhancement.
- **Reduced-motion preference**: detected via `matchMedia` on mount; falls back to static rendering.
- **Missing image assets**: every visual element in Luna Maze sections is rendered as inline SVG or CSS — no raster image dependencies on the critical path.

## Testing Strategy

The Luna Maze rollout combines:
- **Smoke checks** for build artifacts and configuration files.
- **Example-based unit tests** for static content, metadata, and section structure.
- **Property-based tests** for the universal invariants identified in the prework (products grid, capabilities grid, link safety, contrast, reduced motion).
- **Static analysis** (`tsc --noEmit`) for type safety, supplemented by an `eslint --no-eslintrc` rule pass (project default) to flag `any`.

A single test runner is required. We adopt **Vitest + React Testing Library + fast-check** (all dev dependencies, pinned exact versions per Requirement 13.2):
- `vitest` — test runner with native ESM and TS support.
- `@testing-library/react` and `@testing-library/jest-dom` — DOM assertions.
- `fast-check` — property-based test inputs.
- `jsdom` — DOM environment for component rendering.

Property tests run a minimum of 100 iterations per property.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Products grid renders one well-formed card per product

For any non-empty array of `Product` values, when `<ProductsGrid products={products} />` is rendered, the rendered DOM contains exactly `products.length` Product_Card elements; each card displays the product's `name` and `description`; each card with `status === 'live'` renders as a navigable anchor whose `href` equals the product's `href`; and each card with `status === 'coming-soon'` renders as a non-anchor element with `aria-disabled="true"`.

**Validates: Requirements 3.1, 3.2, 3.3, 3.5, 3.6**

### Property 2: Capabilities section renders one well-formed item per capability

For any array of `Capability` values with length between 4 and 6 inclusive, when `<CapabilitiesSection items={capabilities} />` is rendered, the rendered DOM contains exactly `capabilities.length` capability items; each item displays the capability's non-empty `title` and non-empty `description`; and each item renders an icon glyph element corresponding to the capability's `icon` discriminator.

**Validates: Requirements 5.1, 5.2**

### Property 3: External founder links are safe

For any external link rendered in `<FounderSection />` whose `href` begins with `http://` or `https://`, the anchor element has `target="_blank"` and a `rel` attribute that contains both the tokens `noopener` and `noreferrer`.

**Validates: Requirements 6.2**

### Property 4: Brand token color pairs satisfy WCAG AA contrast

For every documented `(foreground, background)` pair in the Luna Maze brand contrast set declared in `src/content/lunamaze-contrast.ts`, the computed sRGB contrast ratio between the two colors is greater than or equal to 4.5 for pairs marked `normal` and greater than or equal to 3.0 for pairs marked `large`.

**Validates: Requirements 8.4**

### Property 5: Reduced motion is respected

For any rendered Luna Maze section, when `window.matchMedia('(prefers-reduced-motion: reduce)')` returns `matches: true`, the rendered DOM contains no element with continuous-motion CSS class (`animate-float`, `animate-pulse-glow`, `animate-orbit`, `animate-orbit-reverse`) and no Framer Motion node carries an `initial`/`animate` pair that drives a continuous loop.

**Validates: Requirements 2.4, 11.5**

## Deployment Plan

1. Push the branch with the Luna Maze implementation.
2. Open repo Settings → Pages and set the source to "GitHub Actions".
3. If the repo is a project-page repo (i.e., URL is `<user>.github.io/<repo>/`), set repo variable `NEXT_PUBLIC_BASE_PATH` to `/<repo>` in Settings → Variables → Actions.
4. Merge to `main`. The workflow runs, builds `dist/`, and deploys to GitHub Pages.
5. Verify `https://<user>.github.io/[<repo>/]` renders Luna Maze and `…/axiom/` renders Axiom.
6. Paste the live URL into the AWS Activate application; copy the `aboutCopy` and `buildingCopy` strings from `AWS_APPLICATION.md` into the appropriate textareas.

## Open Questions Deferred to Implementation

- Final wording of `aboutCopy` and `buildingCopy` (will be drafted during the content task and validated against the 300–500 character bound).
- Exact icon glyph set for capabilities (six discriminators reserved; final SVG paths chosen during implementation).
- Whether to include a thin "press / partnerships" footer line — defer until founder review.
