# Requirements Document

## Introduction

Luna Maze is the public studio brand site for the parent company that owns Axiom and future products. The site replaces the current Axiom marketing site at the workspace root and relocates Axiom to a `/axiom/` subroute, allowing both surfaces to ship from a single Next.js static export deployed to GitHub Pages on `main`. The Luna Maze landing page must communicate the studio's identity (founder-grade, premium, modern), showcase the current product portfolio, present founder/contact information, and serve as a credible URL for the AWS Activate startup credits application. The site must reuse the existing Next.js 16 + React 19 + TypeScript + Tailwind + Framer Motion + GSAP stack with no new heavy dependencies and must build via `next export` to `dist/`.

## Glossary

- **Luna_Maze_Site**: The public studio landing page rendered at the deployment root path.
- **Axiom_Site**: The existing product marketing site, relocated to the `/axiom/` subroute.
- **Build_System**: The Next.js static export pipeline that produces the `dist/` directory.
- **Deploy_Workflow**: The GitHub Actions workflow that publishes `dist/` to GitHub Pages on pushes to `main`.
- **Brand_Tokens**: Tailwind theme extensions and CSS custom properties under the `lunamaze-*` namespace.
- **AWS_Copy_Doc**: A Markdown document containing the studio description and "what we're building" copy formatted to fit the AWS Activate application textarea limits.
- **Hero_Motif**: The animated visual centerpiece of the Luna Maze hero section (constellation/maze SVG with GSAP timeline).
- **Section**: A top-level region of the Luna Maze landing page (Hero, Studio, Products, Capabilities, Founder, Contact, Footer).
- **Product_Card**: A clickable card in the Products grid representing one product (e.g., Axiom) or a "coming soon" placeholder.
- **Repo_Base_Path**: The URL prefix required when the GitHub Pages deployment is served from a project-page repository (`https://<user>.github.io/<repo>/`).

## Requirements

### Requirement 1: Studio landing page structure

**User Story:** As a visitor evaluating Luna Maze, I want to see a cohesive studio landing page with clearly delineated sections, so that I can understand who Luna Maze is, what they ship, and how to contact them within a single scroll.

#### Acceptance Criteria

1. THE Luna_Maze_Site SHALL render at the root path `/` of the deployed site.
2. THE Luna_Maze_Site SHALL contain the following Sections in this order: Hero, Studio, Products, Capabilities, Founder, Contact, Footer.
3. WHEN a visitor loads the root path, THE Luna_Maze_Site SHALL render every Section listed in criterion 1.2 in a single HTML document with semantic landmark elements (`header`, `main`, `section`, `footer`).
4. THE Luna_Maze_Site SHALL include a top-level navigation bar with anchor links to the Studio, Products, Capabilities, Founder, and Contact Sections.
5. WHEN a visitor activates a navigation anchor link, THE Luna_Maze_Site SHALL scroll the corresponding Section into view.

### Requirement 2: Hero section content and motif

**User Story:** As a visitor, I want the hero section to immediately communicate Luna Maze's identity and visual signature, so that I form a strong first impression within three seconds of arrival.

#### Acceptance Criteria

1. THE Hero Section SHALL display the studio name "Luna Maze", a one-line tagline, a one-paragraph positioning statement, and at least one primary call-to-action button.
2. THE Hero Section SHALL render the Hero_Motif as a decorative SVG element with `aria-hidden="true"`.
3. WHEN the Hero Section mounts in the browser, THE Hero_Motif SHALL begin its entrance animation within 200ms of mount.
4. WHILE a visitor's `prefers-reduced-motion` media query evaluates to `reduce`, THE Hero_Motif SHALL render in a static state without continuous motion.
5. THE Hero Section SHALL render at full viewport height on screens 768px wide and above.

### Requirement 3: Products grid

**User Story:** As a visitor, I want to see the studio's current and upcoming products in a single grid, so that I understand the portfolio at a glance.

#### Acceptance Criteria

1. THE Products Section SHALL render a grid of Product_Card elements.
2. THE Products Section SHALL include exactly one Product_Card representing Axiom that links to `/axiom/`.
3. THE Products Section SHALL include at least two placeholder Product_Card elements with the status label "Coming soon".
4. WHEN a visitor activates the Axiom Product_Card, THE Luna_Maze_Site SHALL navigate to `/axiom/`.
5. THE Products Section SHALL display each Product_Card with a name, a short description, and a status indicator (`live`, `coming-soon`).
6. WHILE a Product_Card has status `coming-soon`, THE Product_Card SHALL render as non-interactive (no link, `aria-disabled="true"`).

### Requirement 4: Studio (about) section with AWS-ready copy

**User Story:** As the founder applying for AWS Activate credits, I want the Studio section copy to be ready to lift directly into the AWS Activate application, so that I can submit the form without rewriting.

#### Acceptance Criteria

1. THE Studio Section SHALL render an "About Luna Maze" paragraph between 300 and 500 characters in length (inclusive of spaces, exclusive of HTML markup).
2. THE Studio Section SHALL render a "What we're building" paragraph between 300 and 500 characters in length.
3. THE Build_System SHALL produce an `AWS_APPLICATION.md` file at the repository root containing the same About and What-we're-building paragraphs together with the founder name and the deployed site URL placeholder.
4. THE About and What-we're-building paragraphs SHALL contain the studio name "Luna Maze" at least once each.

### Requirement 5: Capabilities section

**User Story:** As a visitor, I want to know what disciplines and services Luna Maze can deliver, so that I can assess fit for partnerships or hiring.

#### Acceptance Criteria

1. THE Capabilities Section SHALL render between four and six capability items.
2. THE Capabilities Section SHALL render each capability item with a title, a one-sentence description, and an icon glyph.
3. THE Capabilities Section SHALL be reachable via an anchor link with the fragment `#capabilities`.

### Requirement 6: Founder section

**User Story:** As a visitor, I want to see who founded Luna Maze with a credible bio, so that I can trust the studio.

#### Acceptance Criteria

1. THE Founder Section SHALL display the founder name "Harikrishnan V", a role label, a short bio paragraph, and at least one external link (LinkedIn or GitHub).
2. WHEN a visitor activates an external founder link, THE Luna_Maze_Site SHALL open the link in a new browser tab using `target="_blank"` and `rel="noopener noreferrer"`.

### Requirement 7: Contact section

**User Story:** As a visitor or partner, I want a clear way to contact Luna Maze, so that I can start a conversation.

#### Acceptance Criteria

1. THE Contact Section SHALL display at least one contact email rendered as a `mailto:` link.
2. THE Contact Section SHALL display social or platform links for at least two of: GitHub, LinkedIn, X/Twitter.
3. WHEN a visitor activates the email link, THE Luna_Maze_Site SHALL invoke the system mail handler via the `mailto:` protocol.

### Requirement 8: Brand tokens and visual theme

**User Story:** As a brand owner, I want Luna Maze to have its own distinct visual identity separate from Axiom, so that the studio brand is not confused with any single product.

#### Acceptance Criteria

1. THE Brand_Tokens SHALL define color tokens under the `lunamaze-*` namespace including at least: `bgDeep`, `bgPrimary`, `bgSurface`, `violet`, `silver`, `signal`, `textPrimary`, `textSecondary`, `border`.
2. THE Brand_Tokens SHALL coexist with the existing `axiom-*` color tokens without renaming or removing any `axiom-*` token.
3. THE Luna_Maze_Site SHALL apply Brand_Tokens for all foreground and background colors used in Luna Maze Sections.
4. THE Luna_Maze_Site SHALL meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text) for every text-on-background combination rendered in the default state.

### Requirement 9: Routing refactor for Axiom

**User Story:** As a maintainer, I want the existing Axiom marketing site preserved and reachable at `/axiom/`, so that no Axiom content is lost during the Luna Maze rollout.

#### Acceptance Criteria

1. THE Build_System SHALL relocate the existing Axiom landing page to the route `/axiom/`.
2. THE Axiom_Site SHALL render at `/axiom/` with the same Sections, copy, and visuals as the pre-refactor Axiom site.
3. WHEN a visitor navigates to `/axiom/`, THE Axiom_Site SHALL render with all existing Axiom components (`HeroSection`, `FeaturesSection`, `HowItWorksSection`, `PremiumSection`, `CTASection`, `Footer`, `Navbar`, `NeuralOrb`).
4. THE Build_System SHALL NOT delete any file under `src/components/` that is referenced by the Axiom_Site.
5. WHERE the Luna_Maze_Site links to Axiom, THE link target SHALL be `/axiom/`.

### Requirement 10: Static export and deployment

**User Story:** As the project owner, I want the entire site to deploy automatically to GitHub Pages from `main`, so that pushing changes publishes the site without manual steps.

#### Acceptance Criteria

1. THE Build_System SHALL produce a static export in the `dist/` directory using `next build` with `output: 'export'`.
2. THE Build_System SHALL emit a `.nojekyll` file at the root of the `dist/` directory.
3. THE Deploy_Workflow SHALL be defined at `.github/workflows/deploy.yml`.
4. WHEN a commit is pushed to the `main` branch, THE Deploy_Workflow SHALL build the site and publish `dist/` to GitHub Pages.
5. WHERE the deployment target is a GitHub project page, THE Build_System SHALL apply the Repo_Base_Path via the `NEXT_PUBLIC_BASE_PATH` environment variable consumed by `next.config.js`.
6. IF the build step fails, THEN THE Deploy_Workflow SHALL halt before the publish step and return a non-zero exit status.

### Requirement 11: Responsive layout and accessibility

**User Story:** As a visitor on any device, I want the site to render legibly and operate fully on mobile, tablet, and desktop, so that the experience is consistent regardless of viewport.

#### Acceptance Criteria

1. THE Luna_Maze_Site SHALL render without horizontal scrollbars at viewport widths from 320px to 1920px.
2. THE Luna_Maze_Site SHALL provide a visible focus indicator on every interactive element when focused via keyboard.
3. THE Luna_Maze_Site SHALL include a `<title>` element and a `<meta name="description">` element in the document head.
4. THE Luna_Maze_Site SHALL declare `lang="en"` on the root `<html>` element.
5. WHILE a visitor's `prefers-reduced-motion` media query evaluates to `reduce`, THE Luna_Maze_Site SHALL disable continuous-motion animations across all Sections.

### Requirement 12: Type safety and component conventions

**User Story:** As a maintainer, I want the new Luna Maze code to adhere to the project's existing TypeScript and React conventions, so that the codebase remains consistent.

#### Acceptance Criteria

1. THE Luna_Maze_Site source files SHALL declare explicit TypeScript types for every component prop and exported function signature.
2. THE Luna_Maze_Site source files SHALL NOT use the `any` type.
3. THE Luna_Maze_Site SHALL implement every React component as a function component.
4. THE Luna_Maze_Site components SHALL reside under `src/components/lunamaze/`.

### Requirement 13: Dependency stability

**User Story:** As a maintainer, I want the Luna Maze rollout to reuse the existing dependency set, so that the install footprint and audit surface stay stable.

#### Acceptance Criteria

1. THE Build_System SHALL NOT introduce any new runtime npm dependency outside the set already declared in `package.json` at the start of this feature.
2. WHERE a new dev dependency is required to support the Deploy_Workflow, THE dependency SHALL be added with a pinned exact version.

### Requirement 14: SEO and metadata

**User Story:** As a visitor arriving from a search engine or social share, I want accurate page metadata, so that previews and search results display correctly.

#### Acceptance Criteria

1. THE Luna_Maze_Site SHALL declare a page title containing the string "Luna Maze".
2. THE Luna_Maze_Site SHALL declare a meta description between 80 and 160 characters in length.
3. THE Luna_Maze_Site SHALL declare Open Graph meta tags for `og:title`, `og:description`, and `og:type`.
