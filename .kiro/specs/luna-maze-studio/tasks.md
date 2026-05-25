# Implementation Plan: Luna Maze Studio Site

Convert the feature design into a series of prompts for a code-generation LLM that will implement each step with incremental progress. Make sure that each prompt builds on the previous prompts, and ends with wiring things together. There should be no hanging or orphaned code that isn't integrated into a previous step. Focus ONLY on tasks that involve writing, modifying, or testing code.

## Overview

The implementation proceeds in five arcs:
1. Routing refactor — relocate Axiom to `/axiom/` without changing its content.
2. Brand foundations — Tailwind tokens, global styles, content data layer.
3. Luna Maze sections — hero, studio, products, capabilities, founder, contact, footer.
4. Page composition + metadata — root `page.tsx`, navbar, layout split.
5. Build + deploy + content artifacts — GitHub Actions workflow, AWS application doc, README, smoke checks.

Sub-tasks marked with `*` are optional test tasks.

## Tasks

- [ ] 1. Set up testing scaffolding and project conventions
  - [ ]* 1.1 Add Vitest + Testing Library + fast-check + jsdom as dev dependencies (pinned exact versions)
    - Update `package.json` `devDependencies` with `vitest`, `@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `fast-check` — each pinned to an exact version (no `^` or `~`)
    - Add `"test": "vitest run"` and `"test:watch": "vitest"` scripts
    - Create `vitest.config.ts` with `environment: 'jsdom'` and a `setupFiles` entry pointing at `tests/setup.ts`
    - Create `tests/setup.ts` that imports `@testing-library/jest-dom` and registers a `matchMedia` polyfill helper for reduced-motion mocking
    - _Requirements: 13.1, 13.2_

- [x] 2. Refactor routing — relocate Axiom to `/axiom/`
  - [x] 2.1 Move existing Axiom landing to `src/app/axiom/`
    - Create `src/app/axiom/page.tsx` containing the contents currently in `src/app/page.tsx` (preserving all `@/components/...` imports)
    - Create `src/app/axiom/layout.tsx` that owns the Axiom-specific `<Metadata>` (current title/description) and applies `bg-axiom-bgDeep text-axiom-textPrimary` classes to its body wrapper
    - Strip Axiom-specific metadata from `src/app/layout.tsx`, leaving only the shared root layout (Inter font, `<html lang="en">`, neutral `<body>` wrapper)
    - Verify `next build` produces `dist/axiom/index.html` containing the Axiom landing
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ]* 2.2 Smoke test: Axiom build artifact exists and contains expected markers
    - Add a Vitest test that runs after `next build` (or reads the existing `dist/axiom/index.html` if pre-built) and asserts the file exists and includes the string `"Axiom"`
    - _Requirements: 9.1, 9.2_

- [x] 3. Establish Luna Maze brand foundations
  - [x] 3.1 Extend Tailwind theme with `lunamaze-*` color tokens
    - Add a `lunamaze` color object to `tailwind.config.js` with keys `bgDeep`, `bgPrimary`, `bgSurface`, `bgElevated`, `violet`, `violetLight`, `silver`, `signal`, `textPrimary`, `textSecondary`, `textDim`, `border` using the hex values defined in the design document
    - Leave the existing `axiom` color object unchanged
    - _Requirements: 8.1, 8.2_

  - [x] 3.2 Add Luna Maze global styles
    - In `src/app/globals.css`, add a `.lunamaze-grid-bg` utility producing the hero/maze grid backdrop and a `.lunamaze-noise` overlay utility, both gated to only apply within `.lunamaze` scope
    - Add a global `@media (prefers-reduced-motion: reduce)` block that disables `animation` on elements bearing the existing `animate-*` utilities used by Luna Maze sections
    - _Requirements: 8.3, 11.5_

  - [x] 3.3 Create the typed Luna Maze content module
    - Create `src/content/lunamaze.ts` exporting `Product`, `Capability`, `SocialLink` types and the constants `aboutCopy`, `buildingCopy`, `products`, `capabilities`, `founderSocials`, `contactEmail`
    - Draft `aboutCopy` and `buildingCopy` so each is between 300 and 500 characters and each contains the literal string `"Luna Maze"`
    - Seed `products` with the Axiom entry (`href: '/axiom/'`, `status: 'live'`) and at least two `coming-soon` placeholders
    - Seed `capabilities` with five entries covering disciplines such as product engineering, design systems, applied research, deployment/ops, and content strategy
    - Seed `founderSocials` with at least GitHub and LinkedIn entries plus an email entry; set `contactEmail`
    - _Requirements: 3.2, 3.3, 4.1, 4.2, 4.4, 5.1, 5.2, 6.1, 7.1, 7.2, 12.1, 12.2_

  - [x] 3.4 Create the brand contrast set used by the contrast property
    - Create `src/content/lunamaze-contrast.ts` exporting a `ContrastPair` type and a `contrastPairs` array containing every documented `(foreground, background, kind: 'normal' | 'large')` pair from the design document's contrast table
    - _Requirements: 8.4_

  - [ ]* 3.5 Property test for Luna Maze brand contrast
    - **Property 4: Brand token color pairs satisfy WCAG AA contrast**
    - **Validates: Requirements 8.4**
    - Use fast-check to iterate over each entry in `contrastPairs` (deterministically, since the set is fixed) and assert WCAG ratio ≥ 4.5 for `normal`, ≥ 3.0 for `large`. Implement the contrast computation locally; do not pull a new runtime dependency
    - _Requirements: 8.4_

  - [ ]* 3.6 Unit tests for content invariants (paragraph length, brand mention, product seed)
    - Assert `aboutCopy.length` and `buildingCopy.length` are both within `[300, 500]`
    - Assert both copies contain `"Luna Maze"`
    - Assert exactly one product has `id === 'axiom'`, `status === 'live'`, and `href === '/axiom/'`
    - Assert at least two products have `status === 'coming-soon'`
    - _Requirements: 3.2, 3.3, 4.1, 4.2, 4.4_

- [x] 4. Checkpoint — foundations
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Build the Luna Maze hero
  - [x] 5.1 Implement the `LunaConstellation` SVG motif
    - Create `src/components/lunamaze/LunaConstellation.tsx` rendering the SVG (radial gradient backdrop via Tailwind, maze polylines, 24 constellation nodes, connecting lines)
    - Set `aria-hidden="true"` on the root `<svg>`
    - Write all initial node positions and stroke values directly in the SVG markup so the static fallback is correct without JS
    - Use `useGSAP` from `@gsap/react` to drive the entrance timeline; short-circuit when `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
    - _Requirements: 2.2, 2.3, 2.4, 11.5, 12.1, 12.2, 12.3, 12.4_

  - [x] 5.2 Implement `LunaHero`
    - Create `src/components/lunamaze/LunaHero.tsx` composing the title "Luna Maze", a one-line tagline, a one-paragraph intro, a primary CTA anchored to `#contact`, and a secondary anchor to `#products`
    - Embed `<LunaConstellation />` as a decorative background
    - Apply `min-h-screen md:min-h-screen` to satisfy full-viewport on ≥768px
    - _Requirements: 2.1, 2.2, 2.5, 12.1, 12.2, 12.3, 12.4_

  - [ ]* 5.3 Property test for reduced motion in the hero
    - **Property 5: Reduced motion is respected**
    - **Validates: Requirements 2.4, 11.5**
    - Mock `window.matchMedia` to return `{ matches: true }` for `(prefers-reduced-motion: reduce)`. Render `<LunaHero />` and assert no element carries `animate-float`, `animate-pulse-glow`, `animate-orbit`, or `animate-orbit-reverse`. Use fast-check to also vary the mock's behavior across multiple invocations to guard against caching bugs
    - _Requirements: 2.4, 11.5_

  - [ ]* 5.4 Unit tests for hero content
    - Assert `<LunaHero />` renders the studio name, tagline, intro, and at least one button or CTA link with an `href` of `#contact`
    - Assert the SVG motif has `aria-hidden="true"`
    - _Requirements: 2.1, 2.2_

- [x] 6. Build the Studio (about) section
  - [x] 6.1 Implement `StudioSection`
    - Create `src/components/lunamaze/StudioSection.tsx` reading `aboutCopy` and `buildingCopy` from `src/content/lunamaze.ts` and rendering them as two paragraphs under headings "About Luna Maze" and "What we're building"
    - Wrap the section in `<section id="studio">`
    - Reuse `ScrollReveal` for entrance animation
    - _Requirements: 1.2, 4.1, 4.2, 4.4, 12.1, 12.2, 12.3, 12.4_

  - [ ]* 6.2 Unit test: studio section renders both paragraphs with bounded lengths
    - Render `<StudioSection />`, assert two paragraphs are present, each with text length between 300 and 500
    - _Requirements: 4.1, 4.2_

- [x] 7. Build the Products grid
  - [x] 7.1 Implement `ProductCard`
    - Create `src/components/lunamaze/ProductCard.tsx` with prop `product: Product`
    - When `product.status === 'live'` and `product.href` is defined, render an `<a href={product.href}>` with the card content
    - When `product.status === 'coming-soon'`, render a `<div role="group" aria-disabled="true">` with the card content
    - Render the product name, description, optional `tag`, and a status pill
    - _Requirements: 3.5, 3.6, 12.1, 12.2, 12.3, 12.4_

  - [x] 7.2 Implement `ProductsGrid`
    - Create `src/components/lunamaze/ProductsGrid.tsx` with prop `products: ReadonlyArray<Product>`
    - Render a responsive grid of `<ProductCard />` instances
    - Wrap in `<section id="products">`
    - _Requirements: 1.2, 3.1, 3.2, 3.3, 3.4_

  - [ ]* 7.3 Property test for the products grid invariant
    - **Property 1: Products grid renders one well-formed card per product**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.5, 3.6**
    - Use fast-check to generate non-empty arrays of `Product` values (mixing `live` and `coming-soon`). For each generated array, render `<ProductsGrid products={products} />` and assert the count of rendered cards equals `products.length`, each `live` card is an anchor with `href === product.href`, each `coming-soon` card has `aria-disabled="true"` and is not an anchor, and each card displays the product `name` and `description`
    - Run a minimum of 100 iterations
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6_

  - [ ]* 7.4 Unit test: Axiom card targets `/axiom/`
    - Assert the rendered Axiom card's anchor `href` ends with `/axiom/`
    - _Requirements: 3.4, 9.5_

- [x] 8. Build the Capabilities section
  - [x] 8.1 Implement `CapabilitiesSection` and icon glyphs
    - Create `src/components/lunamaze/CapabilitiesSection.tsx` with prop `items: ReadonlyArray<Capability>`
    - Implement six inline SVG icon glyphs keyed by the `icon` discriminator (`spark`, `compass`, `pulse`, `orbit`, `ship`, `graph`) inside `src/components/lunamaze/icons.tsx`
    - Wrap in `<section id="capabilities">`
    - _Requirements: 1.2, 5.1, 5.2, 5.3, 12.1, 12.2, 12.3, 12.4_

  - [ ]* 8.2 Property test for the capabilities grid invariant
    - **Property 2: Capabilities section renders one well-formed item per capability**
    - **Validates: Requirements 5.1, 5.2**
    - Use fast-check to generate `Capability[]` arrays with length in `[4, 6]`. Render `<CapabilitiesSection items={items} />` and assert the rendered item count equals `items.length`, each item renders a non-empty title, a non-empty description, and an icon SVG element
    - Run a minimum of 100 iterations
    - _Requirements: 5.1, 5.2_

- [x] 9. Build the Founder section
  - [x] 9.1 Implement `FounderSection`
    - Create `src/components/lunamaze/FounderSection.tsx` rendering the founder name "Harikrishnan V", a role label, a short bio, and the external links from `founderSocials` (excluding the email entry)
    - Every external `<a>` carries `target="_blank"` and `rel="noopener noreferrer"`
    - Wrap in `<section id="founder">`
    - _Requirements: 1.2, 6.1, 6.2, 12.1, 12.2, 12.3, 12.4_

  - [ ]* 9.2 Property test for external link safety
    - **Property 3: External founder links are safe**
    - **Validates: Requirements 6.2**
    - Render `<FounderSection />`, query every `<a>` whose `href` matches `^https?://`, and assert each has `target === "_blank"` and `rel` containing both `noopener` and `noreferrer` tokens. Use fast-check to vary the `founderSocials` input via a test-only render path that accepts the list as a prop
    - Run a minimum of 100 iterations
    - _Requirements: 6.2_

- [x] 10. Build the Contact section and Footer
  - [x] 10.1 Implement `ContactSection`
    - Create `src/components/lunamaze/ContactSection.tsx` rendering a `mailto:` link from `contactEmail` and the social links from `founderSocials` (filtered to `host !== 'email'`)
    - Wrap in `<section id="contact">`
    - _Requirements: 1.2, 7.1, 7.2, 7.3, 12.1, 12.2, 12.3, 12.4_

  - [x] 10.2 Implement `LunaFooter`
    - Create `src/components/lunamaze/LunaFooter.tsx` rendering the studio name, copyright with current year, a link to `/axiom/`, and a compact social row
    - _Requirements: 1.2, 9.5, 12.1, 12.2, 12.3, 12.4_

  - [ ]* 10.3 Unit test: contact section has at least one mailto and two non-email socials
    - _Requirements: 7.1, 7.2_

- [x] 11. Build the Luna Maze Navbar and compose the page
  - [x] 11.1 Implement `LunaNavbar`
    - Create `src/components/lunamaze/LunaNavbar.tsx` with anchor links to `#studio`, `#products`, `#capabilities`, `#founder`, `#contact`
    - Add a "Visit Axiom" link to `/axiom/`
    - Use Framer Motion for an on-scroll background fade
    - _Requirements: 1.4, 1.5, 9.5, 12.1, 12.2, 12.3, 12.4_

  - [x] 11.2 Compose the Luna Maze landing at root `src/app/page.tsx`
    - Replace `src/app/page.tsx` content (after the Axiom relocation in task 2.1) with a Luna Maze composition: `<LunaNavbar />`, `<LunaHero />`, `<StudioSection />`, `<ProductsGrid products={products} />`, `<CapabilitiesSection items={capabilities} />`, `<FounderSection />`, `<ContactSection />`, `<LunaFooter />`
    - Use a `<main>` element with semantic landmarks
    - Export `metadata` declaring title containing "Luna Maze", a meta description between 80 and 160 characters, and Open Graph tags (`og:title`, `og:description`, `og:type`)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 11.3, 11.4, 14.1, 14.2, 14.3_

  - [ ]* 11.3 Unit tests for landing structure and metadata
    - Render `<LunaMazePage />`; assert sections appear in order `studio`, `products`, `capabilities`, `founder`, `contact`
    - Assert nav anchors point to ids that exist on the page (universal: every `nav a[href^="#"]` fragment matches a section id)
    - Read the built `dist/index.html` (or rely on Next's metadata test util) and assert title contains "Luna Maze", description length is in `[80, 160]`, and OG tags are present
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 11.3, 14.1, 14.2, 14.3_

- [x] 12. Checkpoint — Luna Maze sections wired
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Configure static export base path and `.nojekyll`
  - [x] 13.1 Extend `next.config.js` for GitHub Pages
    - Update `next.config.js` to read `NEXT_PUBLIC_BASE_PATH` and apply `basePath` plus `assetPrefix` (with `assetPrefix: \`${basePath}/\`` when basePath is non-empty)
    - Set `trailingSlash: true`
    - Keep `output: 'export'`, `distDir: 'dist'`, `images.unoptimized: true`, and the existing `turbopack.root` entry
    - _Requirements: 10.1, 10.5_

  - [x] 13.2 Add `public/.nojekyll`
    - Create an empty file at `public/.nojekyll` so Next.js copies it into `dist/.nojekyll` during export
    - _Requirements: 10.2_

- [x] 14. Add the GitHub Actions deploy workflow
  - [x] 14.1 Create `.github/workflows/deploy.yml`
    - Trigger: `push` to `main` and `workflow_dispatch`
    - Permissions: `contents: read`, `pages: write`, `id-token: write`
    - Concurrency: `group: pages, cancel-in-progress: true`
    - `build` job: checkout, setup-node@v4 with Node 20 and npm cache, `npm ci`, `npm run build` with `NEXT_PUBLIC_BASE_PATH: ${{ vars.NEXT_PUBLIC_BASE_PATH }}`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3` with `path: dist`
    - `deploy` job: depends on `build`, environment `github-pages`, uses `actions/deploy-pages@v4`
    - _Requirements: 10.3, 10.4, 10.6_

  - [ ]* 14.2 Workflow lint check (smoke)
    - Add a script `scripts/lint-workflow.mjs` that parses `.github/workflows/deploy.yml` with the existing `yaml` parser if present (otherwise this sub-task can be skipped) and asserts presence of the build job, the deploy job, the required permissions, and the `actions/deploy-pages@v4` step
    - _Requirements: 10.3, 10.4, 10.6_

- [x] 15. Author AWS application copy artifact and README
  - [x] 15.1 Generate `AWS_APPLICATION.md` at the repo root
    - Create `AWS_APPLICATION.md` containing the founder name, a `<DEPLOYED_URL>` placeholder, and the `aboutCopy` and `buildingCopy` strings under labelled headings ready to paste into the AWS Activate textareas
    - Both paragraphs must match the strings exported from `src/content/lunamaze.ts`
    - _Requirements: 4.3_

  - [x] 15.2 Update `README.md`
    - Add a "Luna Maze studio site" section explaining: project intent, local dev (`npm run dev`), build (`npm run build` → `dist/`), the GitHub Pages workflow, the `NEXT_PUBLIC_BASE_PATH` variable, and where to find the AWS application copy
    - Document the `/axiom/` subroute
    - _Requirements: 4.3, 9.1, 10.3, 10.5_

  - [ ]* 15.3 Unit test: AWS application document drift check
    - Read `AWS_APPLICATION.md`, parse the About and What-we're-building sections, assert each equals the corresponding constant exported from `src/content/lunamaze.ts`
    - Assert the document contains "Harikrishnan V" and a URL placeholder marker
    - _Requirements: 4.3_

- [x] 16. Final checkpoint — full build and verification
  - [x] 16.1 Run the production build
    - Run `npm run build` and confirm it exits successfully
    - Confirm `dist/index.html` (Luna Maze) and `dist/axiom/index.html` (Axiom) both exist
    - Confirm `dist/.nojekyll` exists
    - _Requirements: 9.1, 9.2, 10.1, 10.2_

  - [ ]* 16.2 Run the full automated test suite
    - Run `npm test` and confirm all unit + property tests pass
    - _Requirements: 12.1, 12.2_

  - [x] 16.3 Type check pass
    - Run `npx tsc --noEmit` and confirm zero errors
    - _Requirements: 12.1, 12.2_

  - [x] 16.4 Final checkpoint — Ensure all tests pass
    - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery.
- Each task references the specific requirement clauses it implements for traceability.
- Property tests (3.5, 5.3, 7.3, 8.2, 9.2) each map to a single property in the design's Correctness Properties section and run at least 100 iterations.
- This workflow only produces planning and design artifacts. Implementation begins when you open `tasks.md` and click "Start task" on each item.

## Task Dependency Graph

```
1 (test scaffolding)
   └── used by every "*" sub-task

2 (Axiom relocation)
   └── 4 (checkpoint)

3 (brand foundations: tokens, styles, content, contrast set)
   ├── 3.1 → 3.2, 5.1, 5.2, 6.1, 7.1, 7.2, 8.1, 9.1, 10.1, 10.2, 11.1, 11.2
   ├── 3.3 → 6.1, 7.1, 7.2, 8.1, 9.1, 10.1, 10.2, 11.2, 15.1, 15.3
   └── 3.4 → 3.5

4 (checkpoint after foundations) ← depends on 2, 3

5 (hero) ← depends on 3.1, 3.2, 3.3
   ├── 5.1 → 5.2
   └── 5.2 → 11.2

6 (studio section) ← depends on 3.3
   └── 6.1 → 11.2

7 (products grid) ← depends on 3.3
   ├── 7.1 → 7.2
   └── 7.2 → 11.2, 7.3, 7.4

8 (capabilities) ← depends on 3.3
   └── 8.1 → 11.2, 8.2

9 (founder) ← depends on 3.3
   └── 9.1 → 11.2, 9.2

10 (contact + footer) ← depends on 3.3
   ├── 10.1 → 11.2
   └── 10.2 → 11.2

11 (navbar + page composition) ← depends on 5, 6, 7, 8, 9, 10
   ├── 11.1 → 11.2
   └── 11.2 → 12, 13, 14, 15, 16

12 (checkpoint after sections wired) ← depends on 11

13 (next.config + .nojekyll) ← depends on 11.2
   ├── 13.1 → 14.1, 16.1
   └── 13.2 → 16.1

14 (GitHub Actions deploy workflow) ← depends on 13
   └── 14.1 → 16 (final checkpoint)

15 (AWS application doc + README) ← depends on 3.3, 11.2
   ├── 15.1 → 15.3, 16.4
   └── 15.2 → 16.4

16 (final checkpoint: build, tests, type-check) ← depends on 13, 14, 15
   ├── 16.1 → 16.4
   ├── 16.2 → 16.4
   └── 16.3 → 16.4
```

**Critical path:** 1 → 2 → 3 → 5/6/7/8/9/10 (parallel) → 11 → 13 → 14 → 15 → 16.

Tasks 5–10 can be implemented in parallel once 3 (brand foundations) lands. Tasks 13, 14, and 15 can be implemented in parallel after 11.2 (page composition) lands.

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2", "3"] },
    { "wave": 3, "tasks": ["4"] },
    { "wave": 4, "tasks": ["5", "6", "7", "8", "9", "10"] },
    { "wave": 5, "tasks": ["11"] },
    { "wave": 6, "tasks": ["12"] },
    { "wave": 7, "tasks": ["13", "14", "15"] },
    { "wave": 8, "tasks": ["16"] }
  ]
}
```
