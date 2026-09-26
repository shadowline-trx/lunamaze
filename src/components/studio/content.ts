/**
 * Studio home content: the single source for the page, its JSON-LD, and the
 * FAQ markup. Every claim here is taken from a product page in this repo; if a
 * product changes, change it there first and mirror it here.
 */

export const SITE = 'https://lunamaze.com';
export const CONTACT_EMAIL = 'lunamaze.dev@gmail.com';
export const GITHUB_URL = 'https://github.com/shadowline-trx';

/** Bump when the home page copy changes; feeds dateModified and the sitemap. */
export const HOME_UPDATED = '2026-09-26';

export type Glyph = 'axiom' | 'kern' | 'tether' | 'typecrt' | 'drift' | 'genesis';

export interface Work {
  readonly id: Glyph;
  readonly numeral: string;
  readonly name: string;
  readonly href: string;
  readonly kind: string;
  readonly platforms: string;
  readonly status: 'Live' | 'Early access' | 'Closed testing' | 'Experiment';
  readonly line: string;
  readonly detail: string;
  /** Accent borrowed from the product's own site, used only on hover. */
  readonly accent: string;
  readonly schemaType: 'MobileApplication' | 'SoftwareApplication' | 'WebApplication' | 'VideoGame';
  readonly category: string;
  readonly os?: string;
}

export const WORKS: ReadonlyArray<Work> = [
  {
    id: 'axiom',
    numeral: 'I',
    name: 'Axiom',
    href: '/axiom/',
    kind: 'Recovery companion',
    platforms: 'iPhone · Android',
    status: 'Live',
    line: 'A calm, private companion for quitting porn, grounded in neuroscience.',
    detail:
      'A 30-day guided program, a daily check-in under a minute, and an urge tool that opens without a subscription. The journal never leaves the phone.',
    accent: '#8B7BFF',
    schemaType: 'MobileApplication',
    category: 'HealthApplication',
    os: 'iOS, Android',
  },
  {
    id: 'kern',
    numeral: 'II',
    name: 'Kern',
    href: '/kern/',
    kind: 'Android launcher',
    platforms: 'Android 8.0+',
    status: 'Early access',
    line: 'A fast, private Android launcher for people who would rather use their phone than look at it.',
    detail:
      'Ranked local search, an honest daily ledger, focus sessions, and plain-text pages one swipe from home. No account, no cloud, no Kern server.',
    accent: '#C26A4E',
    schemaType: 'MobileApplication',
    category: 'UtilitiesApplication',
    os: 'Android 8.0 and later',
  },
  {
    id: 'tether',
    numeral: 'III',
    name: 'Tether ADB',
    href: '/tether-adb/',
    kind: 'Android control for Windows',
    platforms: 'Windows 10 · 11',
    status: 'Live',
    line: 'Wireless ADB by QR code, screen mirroring and full device control, free for Windows.',
    detail:
      'Pair a phone over Wi-Fi by scanning a QR code, mirror it with bundled scrcpy, and work with logcat, the shell, files and apps. Nothing else to install.',
    accent: '#5FD3A6',
    schemaType: 'SoftwareApplication',
    category: 'DeveloperApplication',
    os: 'Windows 10, Windows 11',
  },
  {
    id: 'typecrt',
    numeral: 'IV',
    name: 'TypeCrt',
    href: '/typecrt/',
    kind: 'Typing test',
    platforms: 'Web · typecrt.com',
    status: 'Live',
    line: 'A typing test styled after vintage CRT terminals, with no framework in the way.',
    detail:
      '80 themes, practice that targets your weak keys, a command palette and published WPM formulas, built in vanilla TypeScript. No sign-up wall.',
    accent: '#FFB85C',
    schemaType: 'WebApplication',
    category: 'EducationalApplication',
  },
  {
    id: 'drift',
    numeral: 'V',
    name: 'Drift',
    href: '/drift/',
    kind: 'Puzzle game',
    platforms: 'Android',
    status: 'Closed testing',
    line: 'A precision puzzle game about timing and control.',
    detail:
      'Handcrafted levels that reward exactness over speed, in a quiet palette. In closed testing on Google Play.',
    accent: '#E8C27A',
    schemaType: 'VideoGame',
    category: 'GameApplication',
    os: 'Android',
  },
];

export const LAB: Work = {
  id: 'genesis',
  numeral: 'Lab',
  name: 'Genesis',
  href: '/genesis/',
  kind: 'Terraforming sandbox',
  platforms: 'Browser',
  status: 'Experiment',
  line: 'Build a living planet in your browser.',
  detail: 'Sculpt continents, change the atmosphere, melt the ice caps and seed life. Free, and nothing to install.',
  accent: '#6FB7FF',
  schemaType: 'WebApplication',
  category: 'GameApplication',
};

export interface Principle {
  readonly title: string;
  readonly body: string;
}

export const PRINCIPLES: ReadonlyArray<Principle> = [
  {
    title: 'Private by architecture',
    body: 'Where a product can work without a server, it does. Kern has no server at all. Axiom keeps the journal on the phone and its database refuses to store it.',
  },
  {
    title: 'Fast is a feature',
    body: 'TypeCrt answers keystrokes with no framework in the way. Kern ranks results before your thumb changes its mind. Speed is designed in, not tuned in later.',
  },
  {
    title: 'Honest by default',
    body: 'Plain prices, real trials, no countdown timers, no invented numbers. Axiom’s urge tool opens for anyone, even on the purchase screen.',
  },
  {
    title: 'Made to last',
    body: 'Fewer products, finished properly and kept improving. Each one is designed as if a single person will live inside it for years.',
  },
];

export interface Figure {
  readonly value: number;
  readonly label: string;
  readonly note: string;
}

export const FIGURES: ReadonlyArray<Figure> = [
  { value: 5, label: 'Products', note: 'Axiom, Kern, Tether ADB, TypeCrt, Drift' },
  { value: 4, label: 'Platforms', note: 'iPhone, Android, Windows, the web' },
  { value: 12, label: 'Languages', note: 'Axiom’s research library' },
  { value: 1, label: 'Builder', note: 'Designed and engineered by Shadowline' },
  { value: 0, label: 'Investors', note: 'Independent, on purpose' },
];

export interface Faq {
  readonly q: string;
  readonly a: string;
}

export const FAQS: ReadonlyArray<Faq> = [
  {
    q: 'What is Luna Maze?',
    a: 'Luna Maze is an independent software studio at lunamaze.com. It designs and builds focused products for the mind, the phone and the desk: Axiom (a private recovery companion for iPhone and Android), Kern (a private Android launcher), Tether ADB (wireless ADB and device control for Windows), TypeCrt (a CRT-style typing test) and Drift (a precision puzzle game).',
  },
  {
    q: 'Who founded Luna Maze?',
    a: 'Luna Maze was founded and is run by Shadowline, a solo developer who designs, engineers and writes every product. The studio has no investors and no outside team.',
  },
  {
    q: 'Is Luna Maze related to the band of the same name?',
    a: 'No. Luna Maze at lunamaze.com is a software studio. It is not connected to other projects that share the name, such as the music group Luna Maze.',
  },
  {
    q: 'What does Luna Maze make?',
    a: 'Five products and one experiment. Axiom helps people quit porn with a 30-day program and a journal that stays on the phone. Kern replaces the Android home screen with fast local search and an honest daily record. Tether ADB pairs Android phones to Windows over Wi-Fi by QR code and mirrors the screen. TypeCrt is a CRT-style typing test with adaptive practice. Drift is a puzzle game in closed testing. Genesis is a free terraforming sandbox that runs in the browser.',
  },
  {
    q: 'Is Axiom free?',
    a: 'Axiom is a paid app. The monthly plan starts with a 7-day free trial for eligible new subscribers; the annual plan has no trial. The Lighthouse urge tool and data export and deletion stay open without a subscription, and no account is needed to subscribe.',
  },
  {
    q: 'Is Tether ADB free?',
    a: 'Yes. Tether ADB is a free download for Windows 10 and 11 (64-bit). It bundles adb and scrcpy, so wireless QR pairing, screen mirroring, logcat, the shell and file management work with nothing else to install.',
  },
  {
    q: 'Does Kern collect my data?',
    a: 'No. Kern has no account, sign-in, cloud sync, analytics SDK, ad network or tracking, and there is no Kern server. Search ranking and daily records are calculated on the phone and stay there.',
  },
  {
    q: 'Where can I use TypeCrt?',
    a: 'TypeCrt runs in the browser at typecrt.com. Open it and start typing; there is no sign-up wall. It offers 80 themes, practice that targets weak keys, a keyboard command palette and published formulas for every score.',
  },
  {
    q: 'When will Drift be released?',
    a: 'Drift is in closed testing on Google Play. It was paused so Axiom and TypeCrt could ship first, and it is next in line. There is no public release date yet; you can ask for test access by email.',
  },
  {
    q: 'How does Luna Maze approach privacy?',
    a: 'Each product is built so that the most sensitive data never needs to leave the device. Kern has no server. Axiom keeps journal text, trigger names and reset reasons on the phone; optional sign-in backs up only streak dates and mood scores. The detailed policies are published for each product.',
  },
  {
    q: 'How can I contact Luna Maze?',
    a: `Email ${CONTACT_EMAIL}. The studio answers partnership, press and product questions, usually within two business days.`,
  },
];
