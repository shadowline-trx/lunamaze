/**
 * Luna Maze studio content module.
 *
 * Single source of truth for all copy, products, capabilities, and contact
 * data surfaced on the Luna Maze landing page and in the AWS Activate
 * application document. Every export is fully typed and immutable.
 */

export type ProductStatus =
  | 'live'
  | 'early-access'
  | 'private-testing'
  | 'coming-soon';

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: ProductStatus;
  readonly href?: string;
  readonly tag?: string;
  /** Optional public-relative path to a product visual (logo / mark). */
  readonly imageHref?: string;
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

// aboutCopy: 417 chars (must be in [300, 500] and contain "Luna Maze")
export const aboutCopy: string =
  'Luna Maze is an independent product studio building tools at the intersection of cognition, focus, and craft. Founder-led and considered, we ship premium software for the people doing the deepest work — operators, builders, and quiet professionals who want their tools to feel earned. We choose depth over breadth, longevity over launches, and design every surface as if a single person will live inside it for years.';

// buildingCopy: 480 chars (must be in [300, 500] and contain "Luna Maze")
export const buildingCopy: string =
  "Luna Maze is shipping software for attention, signal, and craft. Axiom — our first app — is a habit tracker for brain recovery, live on Google Play. TypeCrt is our zero-latency typing test (CRT-styled, vanilla TypeScript, 50+ themes, smart practice), live at typecrt.in. Drift, a precision puzzle game, is in closed testing on the Play Console. Solo founder, no investors. We move quietly, on purpose.";

/**
 * Real Google Play listing for the Axiom Android app.
 * Source: provided by the founder. Wire any "Get the app" CTA to this URL.
 */
export const axiomPlayStoreUrl: string =
  'https://play.google.com/store/apps/details?id=com.axiomapp.app&hl=en_IN';

export const products: ReadonlyArray<Product> = [
  {
    id: 'axiom',
    name: 'Axiom',
    description:
      'Habit tracker engineered for brain recovery — build streaks, rewire pathways, reclaim focus. Live on Google Play.',
    status: 'live',
    href: '/axiom/',
    tag: 'Product 01',
    imageHref: '/images/axiom-icon.png',
  },
  {
    id: 'typecrt',
    name: 'TypeCrt',
    description:
      'Aesthetic, zero-latency typing test inspired by CRT terminals. 50+ themes, smart practice on your weak keys, command palette, smooth caret engine, and a 3-tier profile dashboard. Built in pure TypeScript — no framework. Live at typecrt.in.',
    status: 'live',
    href: '/typecrt/',
    tag: 'Product 02',
    imageHref: '/images/typecrt-logo.png',
  },
  {
    id: 'drift',
    name: 'Drift',
    description:
      'A precision puzzle game in closed testing on the Google Play Console — paused mid-build to ship Axiom and TypeCrt first. Returning to it next.',
    status: 'private-testing',
    href: '/drift/',
    tag: 'Product 03',
    imageHref: '/images/drift-mark.svg',
  },
  {
    id: 'tether-adb',
    name: 'Tether ADB',
    description:
      'An enterprise-grade Android device control center for Windows — QR-code wireless ADB pairing, screen mirroring, logcat, shell, and file & app management, with adb and scrcpy bundled. Free download.',
    status: 'live',
    href: '/tether-adb/',
    tag: 'Product 04',
    imageHref: '/images/tether-adb-icon.png',
  },
  {
    id: 'kern',
    name: 'Kern',
    description:
      'A private, native Android launcher built for speed: ranked local search, an honest daily ledger, focus sessions, and pages one swipe from home. Now inviting early-access users.',
    status: 'early-access',
    href: '/kern/',
    tag: 'Product 05',
    imageHref: '/images/kern/icon-512.png',
  },
];

export const capabilities: ReadonlyArray<Capability> = [
  {
    id: 'product-engineering',
    title: 'Product engineering',
    description:
      'End-to-end TypeScript, React, and Next.js builds shipped as resilient static or edge-rendered systems.',
    icon: 'ship',
  },
  {
    id: 'design-systems',
    title: 'Design systems',
    description:
      'Token-driven visual languages that stay coherent from first sketch through tenth product.',
    icon: 'compass',
  },
  {
    id: 'applied-research',
    title: 'Applied research',
    description:
      'Translating findings from cognition, attention, and recovery science into product mechanics that hold up in the wild.',
    icon: 'pulse',
  },
  {
    id: 'deployment-ops',
    title: 'Deployment & ops',
    description:
      'Pragmatic CI/CD on GitHub Actions, AWS, and edge platforms — fast deploys, quiet pagers, observable systems.',
    icon: 'orbit',
  },
  {
    id: 'content-strategy',
    title: 'Content strategy',
    description:
      'Founder-grade narrative and product copy tuned for trust, clarity, and the particular weight of a premium brand.',
    icon: 'graph',
  },
];

export const founderSocials: ReadonlyArray<SocialLink> = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/shadowline-trx',
    host: 'github',
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:lunamaze.dev@gmail.com',
    host: 'email',
  },
];

export const contactEmail: string = 'lunamaze.dev@gmail.com';
