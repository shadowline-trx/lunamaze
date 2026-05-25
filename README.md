# Luna Maze — Studio Site

The public studio brand site for **Luna Maze**, an independent product studio. Built with Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS + Framer Motion + GSAP, statically exported to `dist/`, and deployed to GitHub Pages from `main`.

The current shipping product, **Axiom** (a premium habit tracker for brain recovery), lives at the `/axiom/` subroute and continues to ship from this same repo and build pipeline.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000  → Luna Maze landing
                     # http://localhost:3000/axiom/  → Axiom landing
npm run build        # static export to ./dist/
```

## Routes

| Route       | What renders                                  |
|-------------|-----------------------------------------------|
| `/`         | Luna Maze studio landing                      |
| `/axiom/`   | Axiom product marketing site (preserved as-is)|

## Project structure

```
src/
  app/
    layout.tsx              # Shared root layout (font, lang="en")
    page.tsx                # Luna Maze landing
    globals.css             # Global styles + Luna Maze utilities
    axiom/
      layout.tsx            # Axiom-specific metadata + bg
      page.tsx              # Axiom landing (relocated)
  components/
    lunamaze/               # Luna Maze sections (Hero, Studio, Products, ...)
    *.tsx                   # Existing Axiom components (untouched)
  content/
    lunamaze.ts             # Typed content: copy, products, capabilities, socials
    lunamaze-contrast.ts    # Brand contrast pairs (WCAG AA verified)
public/
  .nojekyll                 # Tells GitHub Pages to skip Jekyll
.github/workflows/
  deploy.yml                # GitHub Actions → GitHub Pages
AWS_APPLICATION.md          # Ready-to-paste AWS Activate copy
.kiro/specs/luna-maze-studio/  # Spec docs (requirements, design, tasks)
```

## Deployment to GitHub Pages

The site deploys automatically on every push to `main` via `.github/workflows/deploy.yml` using the official GitHub-maintained Pages actions (`actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`).

### One-time setup

1. Push the repository to GitHub.
2. Go to **Settings → Pages** and set the source to **GitHub Actions**.
3. If the repo URL is a project page (e.g., `https://<user>.github.io/<repo>/`), set the repo variable `NEXT_PUBLIC_BASE_PATH` in **Settings → Variables → Actions** to the repo path (e.g., `/<repo>`). Leave this variable unset for a user/org page (`<user>.github.io`).
4. Push to `main` — the workflow runs, builds `dist/`, and publishes.

### Base path

`next.config.js` reads `NEXT_PUBLIC_BASE_PATH` from the environment and applies it to both `basePath` and `assetPrefix`. Defaults to empty string locally so `npm run dev` and `npm run build` Just Work without env vars.

## AWS Activate startup credits

Ready-to-paste copy for the [AWS Activate](https://aws.amazon.com/startups/credits) application lives in `AWS_APPLICATION.md`. The "About Luna Maze" and "What we're building" paragraphs there are mirrors of `aboutCopy` and `buildingCopy` in `src/content/lunamaze.ts` — keep them in sync if either changes.

After the first successful deploy, replace `<DEPLOYED_URL>` in `AWS_APPLICATION.md` with the live GitHub Pages URL and submit.

## Specs

- Spec workflow: [`.kiro/specs/luna-maze-studio/`](./.kiro/specs/luna-maze-studio/)
- Requirements: [`requirements.md`](./.kiro/specs/luna-maze-studio/requirements.md)
- Design: [`design.md`](./.kiro/specs/luna-maze-studio/design.md)
- Tasks: [`tasks.md`](./.kiro/specs/luna-maze-studio/tasks.md)

## Stack

- **Next.js 16** (App Router, static export)
- **React 19**
- **TypeScript** (strict, no `any`)
- **Tailwind CSS 3.4** (with `lunamaze-*` and untouched `axiom-*` token namespaces)
- **Framer Motion** (navbar scroll fade)
- **GSAP** + `@gsap/react` (constellation hero motif)

## License

Proprietary — © Luna Maze Studio. All rights reserved.
