'use client';

/**
 * AXIOM — product landing, v3 "Silver Studio" (2026-08-03 rebuild).
 *
 * One continuous cinematic scroll. The protagonist is a WebGL particle field
 * (see ParticleField) that keeps changing what it is — chaos assembles into
 * the AXIOM monogram on load, then a story act morphs it brain → shield →
 * tree, which IS the product story: rewire, sealed, become.
 *
 * Every pinned set piece is desktop-only, deliberately. Pinning on touch means
 * position:fixed while the browser scrolls on the compositor thread, so the
 * pinned box lags the finger and — being 100svh — sits short of the viewport
 * once the URL bar hides. Each pinned scene therefore has a stacked, unpinned
 * counterpart under `(max-width: 767px)`.
 *
 * Post-story, every section is its own set piece rather than an info grid:
 *   · The Audit    — pinned theater; each category lie appears huge, gets
 *                    struck through, and the truth stamps in under it.
 *   · The Arc      — pinned recovery curve that draws itself while a comet
 *                    rides it; phases light up as it passes.
 *   · Zero-know    — split demo: what you write vs what our servers see;
 *                    the server panel never stops scrambling.
 *   · The Tools    — horizontal gallery scrubbed sideways by scroll.
 *
 * GSAP end-to-end (ScrollTrigger, SplitText, ScrambleText, DrawSVG,
 * MotionPath) with Lenis driven from the GSAP ticker. Everything builds in
 * one gsap.context after fonts load and reverts on unmount. Reduced motion
 * gets a static, complete page.
 */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { internalUrl } from '@/lib/paths';
import { appStoreFirst, appStoreUrl, playIsBlockedHere, playStoreUrl } from '@/lib/storeLinks';
import ParticleField, {
  type ParticleFieldHandle,
} from '@/components/axiom/ParticleField';
import Grain from '@/components/axiom/Grain';

gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  ScrambleTextPlugin,
  TextPlugin,
  DrawSVGPlugin,
  MotionPathPlugin,
);

const MONO = 'ax-mono';
/**
 * Halo for copy that sits directly over the particle field.
 *
 * The tight 6px layer is the one doing the work: the field's points are white
 * and the finale runs it at brightness 1.75, so a soft wide glow alone leaves
 * the glyph edges competing with particles and the line reads as smudged.
 * The wider layers only sink the surrounding area so the block holds together.
 */
const OVER_FIELD =
  '[text-shadow:0_0_6px_rgba(7,7,9,0.98),0_1px_16px_rgba(7,7,9,0.94),0_0_44px_rgba(7,7,9,0.8)]';
/**
 * The Play listing, campaign-tagged.
 *
 * This was a bare hardcoded URL, which quietly cost us every number we had.
 * `playStoreUrl` exists precisely to bake UTM values into the `referrer`
 * parameter that Play Console reads for Acquisition -> Traffic source; a link
 * without it lands in "Organic" and becomes indistinguishable from someone who
 * found the listing by searching the store. So every install this site has
 * ever produced was unattributable, and "is the website converting?" had no
 * answer available — which is the state the site was judged in.
 */
const PLAY_URL = playStoreUrl('site-landing');
/**
 * The App Store listing, campaign-tagged. Falls back to /axiom/ios/ if the ID
 * is ever cleared in storeLinks, so the Apple button is never a dead link.
 */
const APP_STORE_URL = appStoreUrl('site-landing') ?? internalUrl('/axiom/ios/');

/**
 * The right store for the visitor holding the phone.
 *
 * WHY THIS EXISTS. Three of the four highest-traffic CTAs on this page — the
 * nav button, the mobile sticky bar and the footer — were hardcoded to Google
 * Play. An iPhone visitor was followed down the entire page by a button that
 * sent them to a store they cannot install from, and iOS appeared only in two
 * paired badge rows most people never scroll to.
 *
 * That was always wrong. It became severe once US and Australia were verified
 * still 404 on Play (2026-09-06, curl against a control): in those two markets
 * the App Store is the ONLY way to install Axiom, and every prominent button
 * on the page pointed away from it.
 *
 * Renders Play on the server so the static export keeps a real href for
 * crawlers and for JS-off visitors, then corrects on mount:
 *   - Apple devices, and desktops in the US or Australia -> App Store
 *                                (see `appStoreFirst`)
 *   - Android where Play 404s -> App Store is useless to them, so the free
 *                                browser tools, which need no install at all
 *   - everyone else          -> Play, campaign-tagged
 */
function useStoreHref(): { href: string; label: string } {
  const [target, setTarget] = useState<{ href: string; label: string }>({
    href: PLAY_URL,
    label: 'Get the app',
  });

  useEffect(() => {
    if (appStoreFirst()) {
      setTarget({ href: APP_STORE_URL, label: 'Get the app' });
      return;
    }
    if (/Android/i.test(navigator.userAgent) && playIsBlockedHere()) {
      setTarget({ href: internalUrl('/axiom/tools/'), label: 'Open the free tools' });
    }
  }, []);

  return target;
}

/** `appStoreFirst` after mount; false on the server and on the first paint. */
function useAppStoreFirst(): boolean {
  const [first, setFirst] = useState(false);
  useEffect(() => {
    setFirst(appStoreFirst());
  }, []);
  return first;
}

type StoreButtonsVariant = 'hero' | 'shelf' | 'card' | 'finale';

const STORE_BUTTON_CLASSES: Record<StoreButtonsVariant, { primary: string; ghost: string }> = {
  hero: {
    primary: 'ax-btn-primary flex items-center gap-3 px-8 py-4 text-[15px]',
    ghost: 'ax-btn-ghost flex items-center gap-2.5 px-8 py-4 text-[15px]',
  },
  shelf: {
    primary: 'ax-btn-primary flex items-center gap-3 px-7 py-3.5',
    ghost: 'ax-btn-ghost flex items-center gap-2.5 px-7 py-3.5',
  },
  card: {
    primary: 'ax-btn-primary flex items-center justify-center gap-3 py-4',
    ghost: 'ax-btn-ghost flex items-center justify-center gap-2.5 py-4',
  },
  finale: {
    primary: 'ax-btn-primary flex items-center gap-3 px-9 py-4',
    ghost: 'ax-btn-ghost flex items-center gap-2.5 px-9 py-4',
  },
};

/**
 * Both store buttons, every time, with the visitor's own store first and filled.
 *
 * Several CTAs on this page used to offer Google Play alone, the pricing card
 * included, written when iOS was not live yet. The App Store is now the only
 * install route in the US and Australia, so a CTA with one store is a dead end
 * for somebody. Renders only the two links: the caller keeps its own container,
 * because the reveal and magnetic animations select on it. The links are keyed,
 * so reordering after mount moves the same DOM nodes instead of rebuilding them.
 */
function StoreButtons({ variant }: { variant: StoreButtonsVariant }) {
  const appleFirst = useAppStoreFirst();
  const classes = STORE_BUTTON_CLASSES[variant];
  const play = (
    <a
      key="play"
      href={PLAY_URL}
      target="_blank"
      rel="noreferrer"
      data-magnetic
      className={appleFirst ? classes.ghost : classes.primary}
    >
      <Icon.Play className="h-4 w-4" />
      Get AXIOM on Google Play
    </a>
  );
  const apple = (
    <a
      key="apple"
      href={APP_STORE_URL}
      target="_blank"
      rel="noreferrer"
      data-magnetic
      className={appleFirst ? classes.primary : classes.ghost}
    >
      <Icon.Apple className="h-4 w-4" />
      Download on the App Store
    </a>
  );
  return <>{appleFirst ? [apple, play] : [play, apple]}</>;
}

const HERO_BADGE = 'ON YOUR HOME SCREEN, IT JUST SAYS AXIOM';
const JOURNAL_PLAIN =
  '“I relapsed last night. I don’t want anyone to ever know this.”';
// What the SERVER panel shows. It used to be ciphertext under "No key ·
// cannot decrypt", which described end-to-end encryption the app does not
// run: the live backup is readable (streak dates, mood scores) and the
// encrypted backup path has no call sites. What IS true, and stronger, is
// that journal text never reaches the server at all: the app strips it and
// the database refuses it. So the panel shows the absence, still scrambling.
const JOURNAL_CIPHER = '[ empty ]  no journal text is stored here';
const JOURNAL_CIPHER_ALT = '[ empty ]  nothing of it to leak, sell or hand over';

// ── tiny inline glyphs (no emoji as UI) ──────────────────────────────
type IconProps = { className?: string };
const Icon = {
  Shield: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Lock: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Unlock: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10V7a4 4 0 017.7-1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Pulse: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M3 12h4l2-6 4 12 2-6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Wind: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M3 9h11a2.5 2.5 0 10-2.5-2.5M3 15h14a2.5 2.5 0 11-2.5 2.5M3 12h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Compass: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  Spark: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Life: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  Play: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4 3.5l14 8.5-14 8.5v-17z" />
    </svg>
  ),
  X: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  Check: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Journal: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M5 4h11a2 2 0 012 2v14H7a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M5 4v14a2 2 0 002 2M9 8h6M9 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Buddy: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="9" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 20c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15.5 5.6a3 3 0 110 5.8M17.5 14.7c2 .7 3.2 2.4 3.5 5.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Widget: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16.5 13.5v6M13.5 16.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Sound: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 10v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Export: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 4v10M8 10l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Apple: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16 13c0-2.4 2-3.5 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8s-1.8-.8-3-.8C4.9 7.8 3 9.4 3 12.5c0 3.2 2.4 6.6 4 6.6.9 0 1.5-.7 2.7-.7s1.7.7 2.8.7c1.7 0 3.5-3.4 3.5-3.9 0 0-2-.8-2-2.2zM14.5 6.4c.7-.9.6-2.1.6-2.4-.6 0-1.6.4-2.2 1.1-.6.7-.7 1.8-.6 2.2.7.1 1.5-.4 2.2-.9z" />
    </svg>
  ),
};

// ── static section data ──────────────────────────────────────────────
const CHAPTERS = [
  {
    index: '01',
    label: 'NEUROSCIENCE',
    word: 'REWIRE',
    copy: 'Your brain isn’t broken — it’s plastic. AXIOM lays your recovery out in phases, so you can see how far you have come week by week.',
  },
  {
    index: '02',
    label: 'PRIVACY',
    word: 'PRIVATE',
    copy: 'Your journal, your triggers and your reset reasons never leave your phone. Our servers are built to refuse them, so your journal is never there to read.',
  },
  {
    index: '03',
    label: 'IDENTITY',
    word: 'BECOME',
    copy: 'Streaks are scaffolding, not the point. The point is the person on the other side — calmer, sharper, in control.',
  },
] as const;

const DIFF_ROWS = [
  { theirs: 'Fake “80% off” countdowns that reset every visit.', ours: 'One honest price. No countdown, no lie.' },
  { theirs: 'Your confessions stored readable on their servers.', ours: 'Your journal never leaves your phone.' },
  { theirs: 'Shame and fear tactics to make you pay.', ours: 'Compassion. A relapse is a reset, never a failure.' },
  { theirs: 'Inflated “join 2 million men” social proof.', ours: 'No inflated numbers. We will not lie to you.' },
  { theirs: 'Locked out the moment you stop paying.', ours: 'Mid-urge, the Lighthouse opens. Subscriber or not.' },
] as const;

const MARQUEE_WORDS = [
  'NO SHAME',
  'NO FAKE COUNTDOWNS',
  'NO DARK PATTERNS',
  'NO SELLING YOUR STORY',
  'YOUR JOURNAL STAYS HOME',
  'HONEST BY DESIGN',
] as const;

type Feature = {
  icon: (p: IconProps) => ReactNode;
  title: string;
  body: string;
  accent: string;
  badge?: 'urgent' | 'soon';
};

const FEATURES: Feature[] = [
  { icon: Icon.Pulse, title: 'The Rewire Map', body: 'Your recovery laid out in phases, so every week has a shape instead of a bare count. Not a novelty counter — a picture of the road you are on.', accent: 'text-[#8b7cf7]' },
  { icon: Icon.Life, title: 'Panic toolkit', body: 'Urge timer, grounding, and a breath pacer one tap from anywhere — built for the 90 seconds that decide everything.', accent: 'text-[#ff8f8f]', badge: 'urgent' },
  { icon: Icon.Journal, title: 'Private journal', body: 'Write the whole truth. Your entries never leave your phone — they are not on our servers, so nobody there can read them.', accent: 'text-[#cdc7ee]' },
  { icon: Icon.Compass, title: 'Pattern engine', body: 'The triggers and reset times you record come back to you gathered, so you stop guessing about your own week.', accent: 'text-[#8b7cf7]' },
  { icon: Icon.Wind, title: 'Breathe', body: 'Ride a craving out in about ninety seconds with guided breathing tuned for urge waves, not spa music.', accent: 'text-[#7fd8ff]' },
  { icon: Icon.Spark, title: 'Daily practice', body: 'A streak, a check-in, a daily brief. Small honest reps that compound instead of willpower.', accent: 'text-[#ffd27a]' },
  { icon: Icon.Buddy, title: 'Recovery buddy', body: 'Invite one person you trust. They see whether you are standing — never your journal, never your data.', accent: 'text-[#7fd8ff]' },
  { icon: Icon.Widget, title: 'Widgets & milestones', body: 'Home-screen widgets on Android that keep the day in sight, and milestone artwork actually worth reaching.', accent: 'text-[#ffd27a]' },
  { icon: Icon.Sound, title: 'Calming soundscapes', body: 'A synthesis engine tuned for urge-surfing — sound sculpted to slow your pulse, not another lo-fi playlist.', accent: 'text-[#7fd8ff]' },
  { icon: Icon.Export, title: 'Your data, your call', body: 'Export everything. Delete everything forever. Leaving takes one tap, subscribed or not — that is the point.', accent: 'text-[#cdc7ee]' },
  { icon: Icon.Shield, title: 'The Shield', body: 'An honest content blocker that is friction, not a cage — and never watches what you browse.', accent: 'text-[#7ef7c2]', badge: 'soon' },
];

const FAQS = [
  {
    q: 'Is there a free version?',
    a: 'No. AXIOM is a paid app: the monthly plan starts with a 7-day free trial for eligible new subscribers, and the exact price is shown in the app before you pay anything. We tried it the other way and it made a worse product: a free tier funded by nagging the people using it. One exception, and it is not a marketing one — if you are in an urge, the Lighthouse opens whether you have paid or not.',
  },
  {
    q: 'I installed AXIOM before it was paid. What changed?',
    a: 'Since version 2.6.0 a subscription is needed on every install, including ones from before. Your data stays yours either way: export it or delete it from Settings, with or without a subscription, and the Lighthouse still opens whether you pay or not. Already subscribed on another phone? Tap Sign in or Restore on the membership screen.',
  },
  {
    q: 'What if it does not help me?',
    a: 'Ask from Settings and we make the next 30 days free. You do not have to explain what happened. It works on paid subscriptions, up to twice in any 12 months, and it adds time rather than refunding money.',
  },
  {
    q: 'Can anyone at AXIOM read my journal?',
    a: 'No. Your journal never leaves your phone. The app does not send it, and our database is built to refuse journal text, trigger names and reset reasons — so there is no journal on our servers to leak, sell, or hand over. If you sign in for backup, only your streak dates and mood scores sync.',
  },
  {
    q: 'What happens when I relapse?',
    a: 'A reset, not a verdict. You log it honestly, AXIOM asks what happened and what you will do differently, and that plan comes back to you within 72 hours. Your total and your history stay. Shame is not a strategy here.',
  },
  {
    q: 'How long does rewiring actually take?',
    a: 'Honestly: usually longer than the famous ninety days, and different for everyone. Many people describe the flatline lifting somewhere in weeks two to six and things steadying after two to three months. AXIOM will not promise you a date.',
  },
  {
    q: 'Do streak counters even work?',
    a: 'Alone, no — a bare number resets to zero and takes your motivation down with it. That is why AXIOM builds phases, patterns, and triggers around the streak: a reset costs you a day, not your progress.',
  },
  {
    q: 'Do I need an account or my real name?',
    a: 'No account is needed, and your real name is never required. AXIOM works on your phone without signing in. If you choose to sign in for backup, only your streak dates and mood scores sync — your journal never does. A recovery buddy sees whether you are standing, never what you wrote.',
  },
  {
    q: 'Is AXIOM on iPhone?',
    a: 'Both. Android is on Google Play and iPhone is on the App Store — same app, same private journal. The price is shown in the app, in your currency.',
  },
  {
    q: 'How is this different from the big-name quit apps?',
    a: 'No fake countdowns, no invented member counts, no panic button behind a paywall — and no journal sitting in a cloud. Scroll back up to the receipt.',
  },
] as const;

const CURVE_PHASES = [
  { x: 180, y: 300, w: 'DAYS 1–7', t: 'Withdrawal', d: 'The hardest stretch. Urges peak — this is where the panic tools live.' },
  { x: 420, y: 330, w: 'WEEKS 2–3', t: 'The flatline', d: 'Feels like nothing is working. Most people hit this. It passes.' },
  { x: 660, y: 218, w: 'WEEKS 4–6', t: 'Reconnection', d: 'Many people notice energy and focus coming back.' },
  { x: 900, y: 98, w: 'WEEK 8+', t: 'Stability', d: 'For many, urges get rarer, quieter, survivable.' },
] as const;

// The recovery curve itself (viewBox 1000×400). Shared so the stroke, the
// halo behind it and the filled area under it can never drift apart.
const CURVE_D =
  'M20,150 C90,160 130,240 180,300 C220,345 260,332 320,330 C400,328 440,335 520,322 C600,308 660,220 760,150 C830,102 900,96 980,92';
// Where along the draw each phase's dot sits (0–1 of the path).
const CURVE_FRACS = [0.17, 0.42, 0.67, 0.92] as const;

// Label anchors as % of the SVG box (viewBox 1000×400).
const CURVE_LABEL_POS = [
  { left: '18%', top: '80%' },
  { left: '42%', top: '87%' },
  { left: '66%', top: '60%' },
  { left: '84%', top: '31%' },
] as const;

// ── page ─────────────────────────────────────────────────────────────
export default function AxiomLanding() {
  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<ParticleFieldHandle>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;

    // Phones are not scrolled the way a trackpad is. A real thumb goes
    // flick → lift → touch → flick, and every one of those lift/touch cycles
    // shows or hides the browser's URL bar. That resizes the viewport, and by
    // default ScrollTrigger treats a viewport resize as a reason to refresh —
    // recalculating every trigger's start/end in the middle of the gesture,
    // which reads as jitter and as the page not answering the finger. Scroll
    // at a constant speed and the bar never moves, so it behaves like desktop:
    // exactly the symptom that pointed here. Ignoring mobile resizes keeps the
    // measurements taken at load, which is what the whole page is built on.
    ScrollTrigger.config({ ignoreMobileResize: true });

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    // Desktop only, deliberately. A phone already has momentum scrolling tuned
    // by the OS, and it is what the thumb expects; layering a JS lerp over it
    // is the single most common reason a site "scrolls weird on mobile."
    // Every serious Lenis integration gates it this way — the library's own
    // touch-sync option is off by default for the same reason.
    if (!reduce && fine) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      // Dev/test hook: lets tooling drive the smoothed scroller directly.
      (window as Window & { __axLenis?: Lenis }).__axLenis = lenis;
    }

    // In-page anchors ride the smoothed scroller on desktop. Without Lenis
    // (touch) they fall back to the browser's own smooth scroll, which is the
    // same thing the OS gives every other site.
    const onAnchorClick = (e: MouseEvent): void => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const target = document.querySelector<HTMLElement>(link.getAttribute('href') ?? '');
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -64, duration: 1.5 });
        return;
      }
      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    };
    root.addEventListener('click', onAnchorClick);

    const ctx = gsap.context(() => {
      if (reduce) {
        // Nothing below this branch runs, so anything the animations would
        // have revealed has to be shown outright. These blocks start at
        // opacity-0 in markup and are otherwise invisible for the entire
        // visit — that silently costs a reduced-motion reader the three story
        // chapters and the whole AXIOM terms list, not just some polish.
        gsap.set(
          '[data-chapter], [data-term-line], [data-void], [data-honest-stamp], [data-seal-chip]',
          { autoAlpha: 1 },
        );
        const st = fieldRef.current?.state;
        if (st) {
          st.progress = 1;
          st.opacity = 0.5;
        }
        return;
      }
      // Scripts arrive after first paint, so the visitor may already be
      // reading. Only blocks still below the fold are hidden for their reveal;
      // anything on screen now stays put rather than blinking out.
      const belowFold = gsap.utils
        .toArray<HTMLElement>('[data-reveal]')
        .filter((el) => el.getBoundingClientRect().top > window.innerHeight);
      gsap.set(belowFold, { autoAlpha: 0, y: 40 });
    }, root);

    let cancelled = false;
    const observers: Array<() => void> = [];
    if (!reduce) {
      document.fonts.ready.then(async () => {
        if (cancelled) return;
        // The scroll choreography is built in page order, a chunk at a time,
        // with a yield between chunks so no single task holds the main thread
        // for long. Each chunk joins the same gsap.context, so unmount still
        // reverts everything; creation order (which pins rely on) is unchanged.
        const st = fieldRef.current?.state;
        let mmG!: ReturnType<typeof gsap.matchMedia>;
        let chapters: HTMLElement[] = [];
        const chunk = async (build: () => void): Promise<void> => {
          if (cancelled) return;
          ctx.add(build);
          await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
        };

        await chunk(() => {
          mmG = gsap.matchMedia();
          // Dev/test hook alongside __axLenis: observe the field state live.
          (window as Window & { __axField?: typeof st }).__axField = st;

          // ── intro: the field assembles ─────────────────────────────
          // The assembly tween is standalone so the story pin can kill it: if
          // the user dives deep (nav anchor, fast flick) while it is still
          // playing, it must not keep writing progress back to 1 after the
          // scrub has already rendered a later shape.
          const assembly = st
            ? gsap.fromTo(
                st,
                { progress: 0 },
                { progress: 1, duration: 2.8, ease: 'power2.inOut', delay: 0.2 },
              )
            : null;
          // The hero copy, badge, buttons and nav animate in with CSS from the
          // first paint (see .ax-in in globals.css), so they are readable before
          // any script runs and hydration never hides them again. Only the
          // field's assembly, above, is scripted.

          gsap.to('[data-hero-content]', {
            yPercent: -16,
            autoAlpha: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-hero]',
              start: 'top top',
              end: '78% top',
              scrub: true,
            },
          });

          // ── story act: morph brain → shield → tree ───────────────
          chapters = gsap.utils.toArray<HTMLElement>('[data-chapter]');
          mmG.add('(min-width: 768px)', () => {
            const story = gsap.timeline({
              scrollTrigger: {
                trigger: '[data-story]',
                start: 'top top',
                end: '+=340%',
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                onEnter: () => assembly?.kill(),
                onLeave: () => assembly?.kill(),
              },
            });
            chapters.forEach((ch, i) => {
              const word = ch.querySelector<HTMLElement>('[data-chapter-word]');
              const at = i;
              if (st) {
                story.to(
                  st,
                  { progress: 2 + i, duration: 0.5, ease: 'power1.inOut' },
                  at + 0.02,
                );
              }
              story.fromTo(
                ch,
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: 0.14 },
                i === 0 ? 0.02 : at + 0.08,
              );
              if (word) {
                story.fromTo(
                  word,
                  { scale: 1.06, letterSpacing: '0.28em' },
                  { scale: 1, letterSpacing: '0.06em', duration: 0.5, ease: 'power2.out' },
                  at + 0.06,
                );
              }
              const meta = ch.querySelectorAll<HTMLElement>('[data-chapter-meta]');
              story.fromTo(
                meta,
                { y: 34, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.2, stagger: 0.05 },
                i === 0 ? 0.08 : at + 0.14,
              );
              story.to(
                ch,
                { autoAlpha: 0, y: -46, duration: 0.15 },
                i === chapters.length - 1 ? at + 0.92 : at + 0.8,
              );
            });
          });

          // Touch: no pin (see StoryAct). The three chapters are real panels
          // that scroll past on their own, so the only scrubbed thing is the
          // particle morph — driven by ONE timeline across the whole section
          // rather than a tween per chapter, because independent scrubs all
          // write the same `progress` property and fight each other outside
          // their own ranges.
          mmG.add('(max-width: 767px)', () => {
            if (st) {
              const morph = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                  // 'top bottom' → 'bottom bottom' over a 300svh section makes
                  // exactly one timeline unit per chapter, so unit N is the
                  // moment chapter N fills the screen. That alignment is the
                  // whole trick: the shape is finished by the time its chapter
                  // is readable, without the page ever having to stop.
                  trigger: '[data-story]',
                  start: 'top bottom',
                  end: 'bottom bottom',
                  // Direct, not smoothed. A numeric scrub keeps easing toward
                  // the scroll position after the gesture ends, so a flick
                  // leaves the field still morphing under a stopped thumb —
                  // the exact "not responding" feel. Tied 1:1 to scroll, the
                  // shape is always wherever the finger left it.
                  scrub: true,
                  onEnter: () => assembly?.kill(),
                },
              });
              // Each morph runs over the 60svh before its chapter lands, then
              // the shape sits still while that chapter is on screen.
              morph.to(st, { progress: 2, duration: 0.6 }, 0.35);
              morph.to(st, { progress: 3, duration: 0.6 }, 1.35);
              morph.to(st, { progress: 4, duration: 0.6 }, 2.35);
              morph.to({}, { duration: 0.05 }, 2.95);
            }
            chapters.forEach((ch) => {
              const word = ch.querySelector<HTMLElement>('[data-chapter-word]');
              const meta = ch.querySelectorAll<HTMLElement>('[data-chapter-meta]');
              const stage = ch.firstElementChild;
              const reveal = gsap.timeline({
                scrollTrigger: {
                  trigger: ch,
                  // Time-based and eased, deliberately NOT scrubbed: a scrub
                  // ties the reveal to scroll position, which flattens the
                  // easing into plain linear motion and reads as the text
                  // sliding up rather than performing.
                  // (fastScrollEnd is deliberately absent too: by design it
                  // snaps straight to the end state on a quick flick, which is
                  // what made everything appear with no animation at all.)
                  // 55%, not 80%: the panel's content sits at its top edge, so
                  // the trigger percentage IS where on the screen the scene is
                  // when it starts performing. At 80% it played out down in the
                  // last fifth of the display and had finished long before it
                  // reached its resting place — so all you saw was a finished
                  // block of text sliding up. At 55% it comes alive on the way
                  // in and settles as the chapter fills the screen. With no
                  // hold anywhere on the page, this entrance is the only thing
                  // carrying the act, so it has to land in the readable half.
                  start: 'top 55%',
                  toggleActions: 'play none none reverse',
                },
              });
              reveal.fromTo(ch, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0);
              if (word) {
                reveal.fromTo(
                  word,
                  { scale: 1.06, letterSpacing: '0.22em' },
                  { scale: 1, letterSpacing: '0.05em', duration: 0.9, ease: 'power2.out' },
                  0,
                );
              }
              reveal.fromTo(
                meta,
                { y: 26, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.1 },
                0.12,
              );
              // Departure dissolves instead of sliding off, which crossfades it
              // against the next chapter arriving underneath. Scrubbed on
              // purpose here — a fade-out has to track the scroll or a chapter
              // can be left half-lit above the fold. Applied to the inner
              // stage, not the panel, so it cannot fight the reveal's autoAlpha.
              // Starts only once the chapter is well past centre: a 100svh
              // panel is composed for a short window, so fading any earlier
              // takes it away while it is still the thing being read.
              if (stage) {
                gsap.to(stage, {
                  autoAlpha: 0,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: ch,
                    start: 'bottom 58%',
                    end: 'bottom 6%',
                    scrub: true,
                  },
                });
              }
            });
          });

          // Field stays lit through the marquee, dims as the audit begins.
          // On phones it dims to effectively-off: below the field's 0.075
          // render threshold, the GPU goes idle through the whole reading
          // stretch and wakes again for the finale.
          if (st) {
            gsap.fromTo(
              st,
              { opacity: 1 },
              {
                opacity: window.matchMedia('(pointer: coarse)').matches ? 0.05 : 0.16,
                ease: 'none',
                scrollTrigger: {
                  trigger: '[data-audit-intro]',
                  start: 'top 90%',
                  end: 'top 25%',
                  scrub: true,
                },
              },
            );
          }

        });
        await chunk(() => {
          // ── marquee ──────────────────────────────────────────────
          gsap.to('[data-marquee-track]', {
            xPercent: -50,
            ease: 'none',
            duration: 36,
            repeat: -1,
          });

          // ── the audit: their receipt vs our terms ────────────────
          const receiptLines = gsap.utils.toArray<HTMLElement>('[data-receipt-line]');
          const termLines = gsap.utils.toArray<HTMLElement>('[data-term-line]');
          const strikes = gsap.utils.toArray<HTMLElement>('[data-receipt-strike]');
          mmG.add('(min-width: 768px)', () => {
            const audit = gsap.timeline({
              scrollTrigger: {
                trigger: '[data-audit]',
                start: 'top top',
                end: `+=${receiptLines.length * 55 + 130}%`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
              },
            });
            audit.fromTo(
              '[data-receipt]',
              { y: 110, autoAlpha: 0, rotate: -7 },
              { y: 0, autoAlpha: 1, rotate: -2, duration: 0.42, ease: 'power2.out' },
              0,
            );
            audit.fromTo(
              '[data-terms]',
              { y: 110, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.42, ease: 'power2.out' },
              0.12,
            );
            receiptLines.forEach((line, i) => {
              const at = 0.62 + i * 0.5;
              audit.from(
                strikes[i].querySelectorAll('path'),
                { drawSVG: '0%', duration: 0.16, stagger: 0.03, ease: 'power2.inOut' },
                at,
              );
              audit.to(line, { opacity: 0.42, duration: 0.1 }, at + 0.08);
              audit.fromTo(
                termLines[i],
                { autoAlpha: 0, x: 30 },
                { autoAlpha: 1, x: 0, duration: 0.2, ease: 'power2.out' },
                at + 0.12,
              );
            });
            const seal = 0.62 + receiptLines.length * 0.5 + 0.18;
            audit.fromTo(
              '[data-void]',
              { autoAlpha: 0, scale: 2.1 },
              { autoAlpha: 1, scale: 1, duration: 0.16, ease: 'power4.in' },
              seal,
            );
            audit.to('[data-receipt]', { rotate: -2.8, y: 6, duration: 0.06 }, seal + 0.14);
            audit.fromTo(
              '[data-honest-stamp]',
              { autoAlpha: 0, scale: 1.7, rotate: 14 },
              { autoAlpha: 1, scale: 1, rotate: 6, duration: 0.14, ease: 'power4.in' },
              seal + 0.24,
            );
            audit.to({}, { duration: 0.3 }); // hold the finished scene
          });
          mmG.add('(max-width: 767px)', () => {
            gsap.set(['[data-terms]', '[data-receipt]'], { autoAlpha: 1 });
            receiptLines.forEach((line, i) => {
              gsap
                .timeline({ scrollTrigger: { trigger: line, start: 'top 78%' } })
                .from(strikes[i].querySelectorAll('path'), {
                  drawSVG: '0%',
                  duration: 0.45,
                  stagger: 0.08,
                  ease: 'power2.inOut',
                })
                .to(line, { opacity: 0.42, duration: 0.25 }, 0.2);
            });
            termLines.forEach((line) => {
              gsap.fromTo(
                line,
                { autoAlpha: 0, x: 26 },
                {
                  autoAlpha: 1,
                  x: 0,
                  duration: 0.55,
                  ease: 'power2.out',
                  scrollTrigger: { trigger: line, start: 'top 82%' },
                },
              );
            });
            gsap.fromTo(
              '[data-void]',
              { autoAlpha: 0, scale: 1.8 },
              {
                autoAlpha: 1,
                scale: 1,
                duration: 0.35,
                ease: 'power4.in',
                scrollTrigger: { trigger: '[data-receipt]', start: 'bottom 62%' },
              },
            );
            gsap.fromTo(
              '[data-honest-stamp]',
              { autoAlpha: 0, scale: 1.5, rotate: 14 },
              {
                autoAlpha: 1,
                scale: 1,
                rotate: 6,
                duration: 0.35,
                ease: 'power4.in',
                scrollTrigger: { trigger: '[data-terms]', start: 'top 55%' },
              },
            );
          });

        });
        await chunk(() => {
          // ── the arc: pinned curve + comet (desktop) ──────────────
          mmG.add('(min-width: 768px)', () => {
            const arc = gsap.timeline({
              scrollTrigger: {
                trigger: '[data-arc]',
                start: 'top top',
                end: '+=220%',
                pin: true,
                scrub: 1,
                anticipatePin: 1,
              },
            });
            arc.from('[data-curve-path]', { drawSVG: '0%', ease: 'none', duration: 1 }, 0);
            arc.to(
              '[data-comet]',
              {
                motionPath: {
                  path: '[data-curve-path]',
                  align: '[data-curve-path]',
                  alignOrigin: [0.5, 0.5],
                },
                ease: 'none',
                duration: 1,
              },
              0,
            );
            const dots = gsap.utils.toArray<SVGCircleElement>('[data-curve-dot]');
            gsap.utils.toArray<HTMLElement>('[data-curve-phase]').forEach((el, i) => {
              const at = Math.max(0, CURVE_FRACS[i] - 0.04);
              arc.fromTo(
                el,
                { autoAlpha: 0, y: 16 },
                { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' },
                at,
              );
              if (dots[i]) {
                arc.fromTo(
                  dots[i],
                  { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' },
                  { autoAlpha: 1, scale: 1, duration: 0.04, ease: 'back.out(3)' },
                  at,
                );
              }
            });
            arc.to({}, { duration: 0.12 }); // settle beat before unpin
          });
          mmG.add('(max-width: 767px)', () => {
            // The draw used to be mapped to the WHOLE section, but the chart
            // only occupies its first slice — so the curve was still being
            // drawn long after it had left the top of the screen, and was
            // never seen finished. Map it to the chart's own approach to
            // centre instead: it completes exactly as the chart settles into
            // the middle of the display.
            const arcM = gsap.timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: '[data-curve-stage]',
                start: 'top 88%',
                end: 'center 48%',
                scrub: true,
              },
            });
            // Frame first, then the line drawn onto it — the axis is the thing
            // the curve is being measured against, so it cannot arrive after.
            arcM.fromTo('[data-curve-axis]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.14 }, 0);
            arcM.from('[data-curve-path]', { drawSVG: '0%', duration: 1 }, 0);
            gsap.utils.toArray<SVGCircleElement>('[data-curve-dot]').forEach((dot, i) => {
              arcM.fromTo(
                dot,
                { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' },
                { autoAlpha: 1, scale: 1, duration: 0.05, ease: 'back.out(3)' },
                Math.max(0, CURVE_FRACS[i] - 0.04),
              );
            });
            // Phase cards read as a list below the chart; scrubbed to the card
            // itself so a fast flick still shows them animating in.
            gsap.utils.toArray<HTMLElement>('[data-curve-phase]').forEach((el) => {
              gsap.fromTo(
                el,
                { autoAlpha: 0, y: 18 },
                {
                  autoAlpha: 1,
                  y: 0,
                  ease: 'none',
                  scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 68%', scrub: true },
                },
              );
            });
          });

        });
        await chunk(() => {
          // ── stays-on-your-phone split demo ───────────────────────
          const sealTl = gsap.timeline({
            scrollTrigger: { trigger: '[data-seal]', start: 'top 62%' },
          });
          sealTl.fromTo(
            '[data-plain-text]',
            { text: '' },
            {
              duration: 2.2,
              scrambleText: {
                text: JOURNAL_PLAIN,
                chars: '▮▯░▒01',
                revealDelay: 0.3,
                speed: 0.4,
              },
            },
          );
          sealTl.fromTo(
            '[data-seal-chip]',
            { autoAlpha: 0, scale: 0.8 },
            { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' },
            1.9,
          );
          // The server panel never settles — it re-scrambles between two
          // statements of the same absence, forever.
          gsap
            .timeline({ repeat: -1, repeatDelay: 1.4 })
            .to('[data-cipher-text]', {
              duration: 2.6,
              ease: 'none',
              scrambleText: { text: JOURNAL_CIPHER_ALT, chars: '9f2eab▓░▒█c01d47', speed: 0.25 },
            })
            .to(
              '[data-cipher-text]',
              {
                duration: 2.6,
                ease: 'none',
                scrambleText: { text: JOURNAL_CIPHER, chars: '9f2eab▓░▒█c01d47', speed: 0.25 },
              },
              '+=1.4',
            );

          // ── the tools: horizontal gallery (desktop) ──────────────
          mmG.add('(min-width: 768px)', () => {
            const track = root.querySelector<HTMLElement>('[data-tools-track]');
            if (!track) return;
            const dist = (): number =>
              Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.08);
            gsap.to(track, {
              x: () => -dist(),
              ease: 'none',
              scrollTrigger: {
                trigger: '[data-tools]',
                start: 'top top',
                end: () => `+=${dist()}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1,
              },
            });
          });

        });
        await chunk(() => {
          // ── generic reveals ──────────────────────────────────────
          ScrollTrigger.batch('[data-reveal]', {
            // Touch fires later and moves quicker. At 86% the element has only
            // just cleared the bottom edge, so on a phone a thumb flick can
            // carry it right across the screen while the reveal is still
            // playing — you never see it arrive. Waiting until it is properly
            // in view puts the animation where it can actually be read.
            start: fine ? 'top 86%' : 'top 78%',
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration: fine ? 0.9 : 0.6,
                stagger: fine ? 0.09 : 0.06,
                ease: 'power3.out',
                overwrite: true,
              }),
          });
          gsap.utils.toArray<HTMLElement>('.ax-rule').forEach((el) => {
            gsap.fromTo(
              el,
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 1.2,
                ease: 'power3.inOut',
                scrollTrigger: { trigger: el, start: 'top 88%' },
              },
            );
          });

          // ── dawn finale ──────────────────────────────────────────
          if (st) {
            gsap.to(st, {
              brightness: 1.75,
              opacity: 0.85,
              ease: 'none',
              scrollTrigger: {
                trigger: '[data-finale]',
                start: 'top 80%',
                end: 'bottom bottom',
                scrub: true,
              },
            });
          }
          gsap.fromTo(
            '[data-dawn]',
            { autoAlpha: 0, yPercent: 20 },
            {
              autoAlpha: 1,
              yPercent: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: '[data-finale]',
                start: 'top 85%',
                end: 'center center',
                scrub: true,
              },
            },
          );
          const finaleTitle = root.querySelector<HTMLElement>('[data-finale-title]');
          if (finaleTitle) {
            const fsplit = SplitText.create(finaleTitle, {
              type: 'lines,chars',
              mask: 'lines',
              linesClass: 'ax-clip-line',
              charsClass: 'ax-char',
            });
            gsap.from(fsplit.chars, {
              yPercent: 118,
              duration: 1.1,
              stagger: { amount: 0.4 },
              ease: 'expo.out',
              scrollTrigger: { trigger: finaleTitle, start: 'top 78%' },
            });
          }

          // ── journey progress hairline ────────────────────────────
          gsap.to('[data-progress-bar]', {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
          });

          // ── mobile sticky CTA slides in once the hero is gone ────
          gsap.to('[data-sticky-cta]', {
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '[data-story]',
              start: 'top 55%',
              toggleActions: 'play none none reverse',
              // One call to action on screen at a time: the nav button steps
              // aside on phones while the sticky bar is up.
              onToggle: (self) => document.querySelector('[data-nav]')?.toggleAttribute('data-sticky-on', self.isActive),
            },
          });

          // ── magnetic CTAs (desktop pointer only) ─────────────────
          if (fine) {
            gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((el) => {
              const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
              const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });
              const onMove = (e: PointerEvent): void => {
                const r = el.getBoundingClientRect();
                xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
                yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
              };
              const onLeave = (): void => {
                xTo(0);
                yTo(0);
              };
              el.addEventListener('pointermove', onMove);
              el.addEventListener('pointerleave', onLeave);
            });
          }

          ScrollTrigger.refresh();

          // The last chapters skip rendering until they near the viewport
          // (.ax-cv). When one renders at its real height, triggers below it
          // (the finale) have moved: refresh once the sizes settle.
          let refreshTimer = 0;
          const resized = new ResizeObserver(() => {
            window.clearTimeout(refreshTimer);
            refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
          });
          root.querySelectorAll('.ax-cv').forEach((el) => resized.observe(el));
          observers.push(() => {
            window.clearTimeout(refreshTimer);
            resized.disconnect();
          });
        });
      });
    }

    return () => {
      cancelled = true;
      observers.forEach((stop) => stop());
      root.removeEventListener('click', onAnchorClick);
      ctx.revert();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return (
    <div ref={rootRef} className="axiom-v3 relative">
      {/* ── fixed stage: gradients, cage grid, shafts, particles ── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 0%, #131318 0%, #0a0a0d 52%, #070709 100%)',
          }}
        />
        <div className="ax-cage absolute inset-0" />
        <div className="ax-shafts" />
        <ParticleField ref={fieldRef} className="absolute inset-0 h-full w-full" />
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: 'linear-gradient(to top, rgba(7,7,9,0.9), transparent)' }}
        />
      </div>
      <Grain />

      <main className="relative overflow-x-clip">
        {/* Journey hairline — how far into the rewire you've scrolled. */}
        <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
          <div
            data-progress-bar
            className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#8b7cf7] via-[#a99df8] to-[#7ef7c2] opacity-80"
          />
        </div>
        <Nav />
        <StickyCTA />
        <Hero />
        <StoryAct />
        <Marquee />
        <div data-postlude>
          <AuditIntro />
          <Audit />
          <Arc />
          <Privacy />
          <Tools />
          <Depth />
          <Pricing />
          <Faq />
          <Finale />
          <Footer />
        </div>
      </main>
    </div>
  );
}

/** One word of the hero headline, rising in on its own delay. */
function HeroWord({ i, className, children }: { i: number; className?: string; children: ReactNode }) {
  return (
    <span className={`ax-word ${className ?? ''}`} style={{ '--ax-i': i } as CSSProperties}>
      {children}
    </span>
  );
}

// ── navigation ───────────────────────────────────────────────────────
function Nav() {
  const store = useStoreHref();
  return (
    <header
      data-nav
      className="ax-in fixed inset-x-0 top-0 z-50"
      style={{
        background: 'linear-gradient(to bottom, rgba(10,10,13,0.72), transparent)',
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="#top" className="flex items-center gap-3">
          <img
            src={internalUrl('/images/axiom/logo.webp')}
            alt=""
            width={34}
            height={34}
            className="h-[34px] w-[34px] rounded-xl"
          />
          <span className={`${MONO} text-sm font-medium tracking-[0.34em] text-[#e8e6f0]`}>
            AXIOM
          </span>
        </a>
        <div className={`${MONO} ax-glass hidden items-center gap-9 rounded-full px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-[#9b98ad] md:flex`}>
          <a className="transition-colors hover:text-[#e8e6f0]" href="#difference">The audit</a>
          <a className="transition-colors hover:text-[#e8e6f0]" href="#arc">The arc</a>
          <a className="transition-colors hover:text-[#e8e6f0]" href="#privacy">Discretion</a>
          <a className="transition-colors hover:text-[#e8e6f0]" href="#pricing">Pricing</a>
        </div>
        <a
          href={store.href}
          target="_blank"
          rel="noreferrer"
          className="ax-btn-primary ax-nav-cta px-5 py-2 text-sm"
          data-magnetic
        >
          {store.label}
        </a>
      </nav>
    </header>
  );
}

// ── mobile sticky CTA (appears once the hero scrolls away) ───────────
function StickyCTA() {
  const store = useStoreHref();
  return (
    <div
      data-sticky-cta
      className="fixed inset-x-3 bottom-3 z-50 md:hidden"
      style={{ transform: 'translateY(140%)' }}
    >
      <div className="ax-glass flex items-center gap-3 rounded-2xl p-3">
        <img
          src={internalUrl('/images/axiom/logo.webp')}
          alt=""
          width={38}
          height={38}
          className="h-[38px] w-[38px] rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-[#f2f1f7]">Quit porn, quietly.</p>
          <p className={`${MONO} truncate text-[10px] uppercase tracking-[0.12em] text-[#7ef7c2]`}>
            7 days free on monthly
          </p>
        </div>
        <a
          href={store.href}
          target="_blank"
          rel="noreferrer"
          className="ax-btn-primary shrink-0 px-5 py-2.5 text-sm"
        >
          Get AXIOM
        </a>
      </div>
    </div>
  );
}

// ── hero ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section data-hero id="top" className="relative flex min-h-[100svh] items-center justify-center">
      {/* Soft scrim so copy always clears the densest filaments. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 52% 42% at 50% 56%, rgba(7,7,9,0.62), rgba(7,7,9,0.25) 55%, transparent 75%)',
        }}
      />
      <div
        data-hero-content
        className="relative z-10 mx-auto max-w-5xl px-6 pb-16 pt-28 text-center"
      >
        <div
          data-hero-badge
          style={{ '--ax-d': '0.15s' } as CSSProperties}
          className={`${MONO} ax-in ax-glass mb-9 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[#9b98ad]`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#7ef7c2] shadow-[0_0_12px_rgba(126,247,194,0.8)]" />
          <span data-hero-badge-text>{HERO_BADGE}</span>
        </div>
        <h1
          data-hero-title
          className="text-[clamp(3.2rem,9.2vw,8rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-[#f2f1f7]"
        >
          {/* Words rise one by one, in CSS, so the headline paints at once. */}
          <HeroWord i={0}>Quit</HeroWord> <HeroWord i={1}>porn.</HeroWord>
          <br />
          <HeroWord i={2}>Your</HeroWord> <HeroWord i={3}>phone</HeroWord>{' '}
          <HeroWord i={4} className="ax-serif ax-grad-violet pr-2 font-normal">
            never
          </HeroWord>{' '}
          <HeroWord i={5}>says</HeroWord> <HeroWord i={6}>so.</HeroWord>
        </h1>
        <p
          data-hero-sub
          style={{ '--ax-d': '0.55s' } as CSSProperties}
          className={`ax-in mx-auto mt-8 max-w-xl text-base leading-relaxed text-[#a6a3b8] ${OVER_FIELD} sm:text-lg`}
        >
          Every other app for this is named the accusation. On your home
          screen, this one says AXIOM. Its notifications say “Daily brief”.
          The recovery work underneath is real and grounded in neuroscience,
          and your journal never leaves your phone.
        </p>
        <div
          data-hero-cta
          style={{ '--ax-d': '0.7s' } as CSSProperties}
          className="ax-in mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <StoreButtons variant="hero" />
        </div>
        <p
          data-hero-trust
          style={{ '--ax-d': '0.85s' } as CSSProperties}
          className={`${MONO} ax-in mt-6 text-[10px] uppercase tracking-[0.22em] text-[#8f8ca1]`}
        >
          7-day free trial on monthly · Cancel anytime · Journal stays on your phone
        </p>
        <p
          style={{ '--ax-d': '1s' } as CSSProperties}
          className={`ax-in mt-4 text-sm text-[#a6a3b8] ${OVER_FIELD}`}
        >
          Not ready to install?{' '}
          <a
            href={internalUrl('/axiom/tools/panic/')}
            className="text-[#e8e6f0] underline decoration-[#8b7cf7] decoration-1 underline-offset-4 transition-colors hover:text-white"
          >
            Use the free Panic Button now
          </a>
        </p>
      </div>
      <div
        data-hero-cue
        style={{ '--ax-d': '1.1s' } as CSSProperties}
        className={`${MONO} ax-in ax-cue absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#8f8ca1]`}
      >
        Scroll — the rewire begins
        <span className="block h-10 w-px overflow-hidden bg-white/10">
          <span className="block h-4 w-px animate-[cueDrop_1.8s_ease-in-out_infinite] bg-[#e8e6f0]/70" />
        </span>
      </div>
      <style>{`@keyframes cueDrop { 0% { transform: translateY(-16px); } 60%, 100% { transform: translateY(40px); } }`}</style>
    </section>
  );
}

// ── the story act (pinned on desktop, stacked panels on touch) ───────
function StoryAct() {
  return (
    // Desktop pins this section and cross-fades the three chapters in place.
    //
    // Touch does NOT hold the page — not with a pin, and not with CSS sticky
    // either. Both were tried and both feel broken on a phone for the same
    // reason: a thumb scrolls in flicks of 800–1500px, so any hold means you
    // flick and nothing moves. That reads as the page being stuck, not as a
    // cinematic beat. This is why pinned scroll scenes are a desktop-only
    // convention across the industry — on a phone the chapters are three
    // ordinary full-height sections in normal document flow, and the drama
    // comes from what animates on ENTRY, never from stopping the scroll.
    <section data-story className="relative md:h-[100svh] md:overflow-hidden">
      {CHAPTERS.map((ch, i) => (
        <div
          key={ch.word}
          data-chapter
          className="relative opacity-0 md:absolute md:inset-0 md:block"
        >
          <div
            // Composition matches desktop: label top, outline word over the
            // particle shape, copy at the bottom clear of the sticky CTA.
            // min-h rather than h so a long chapter grows instead of clipping.
            className="flex min-h-[80svh] flex-col items-center justify-between gap-6 px-7 pb-[13svh] pt-[11svh] text-center md:block md:min-h-0 md:gap-0 md:p-0 md:text-left"
          >
            <div
              data-chapter-meta
              className={`${MONO} text-[11px] uppercase tracking-[0.3em] text-[#9b98ad] md:absolute md:top-[16vh] ${
                i === 1 ? 'md:right-[12vw] md:text-right' : 'md:left-[12vw]'
              }`}
            >
              {ch.index} / {ch.label}
            </div>
            <span
              data-chapter-word
              className="ax-outline-strong pointer-events-none select-none text-[clamp(4rem,17vw,14rem)] font-semibold leading-none md:absolute md:inset-0 md:flex md:items-center md:justify-center"
            >
              {ch.word}
            </span>
            <div
              data-chapter-meta
              className={`max-w-md md:absolute md:bottom-[12vh] ${
                i === 1 ? 'md:left-[12vw] md:text-left' : 'md:right-[12vw] md:text-right'
              }`}
            >
              <p className={`text-base leading-relaxed text-[#d8d5e4] ${OVER_FIELD} md:text-lg`}>{ch.copy}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

// ── marquee ──────────────────────────────────────────────────────────
function Marquee() {
  const strip = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div className="ax-blur-desk relative overflow-hidden border-y border-white/[0.06] bg-[#0a0a0d]/85 py-5">
      <div data-marquee-track className={`${MONO} flex w-max items-center gap-10 text-[12px] uppercase tracking-[0.3em] text-[#8f8ca1]`}>
        {strip.map((w, i) => (
          <span key={`${w}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
            {w}
            <span className="text-[#8b7cf7]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── section chrome helpers ───────────────────────────────────────────
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p data-reveal className={`${MONO} mb-5 text-[11px] uppercase tracking-[0.3em] text-[#8b7cf7]`}>
      {children}
    </p>
  );
}

// ── the audit: intro + pinned lie/truth theater ──────────────────────
function AuditIntro() {
  return (
    <section id="difference" data-audit-intro className="relative bg-[#0a0a0d]/90 py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Eyebrow>04 — the audit</Eyebrow>
        <h2 data-reveal className="max-w-3xl text-[clamp(2.2rem,5vw,3.9rem)] font-semibold leading-[1.04] text-[#f2f1f7]">
          This category has a trust problem.{' '}
          <span className="ax-serif text-[#cdc7ee]">We built the opposite.</span>
        </h2>
        <p data-reveal className="mt-6 max-w-2xl text-lg leading-relaxed text-[#9b98ad]">
          Most apps in this space run dark patterns and cloud-store the most
          intimate data a person can share. One market leader recently leaked
          hundreds of thousands of private confessions. Here is their receipt
          — and our terms.
        </p>
      </div>
    </section>
  );
}

// Thermal-receipt zigzag edges (top and bottom teeth).
const RECEIPT_CLIP = ((): string => {
  const teeth = 26;
  const depth = 1.4;
  const top: string[] = [];
  const bottom: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    const x = ((i / teeth) * 100).toFixed(2);
    top.push(`${x}% ${i % 2 === 0 ? 0 : depth}%`);
    bottom.push(`${(100 - (i / teeth) * 100).toFixed(2)}% ${i % 2 === 0 ? 100 : 100 - depth}%`);
  }
  return `polygon(${top.join(',')},${bottom.join(',')})`;
})();

function Audit() {
  return (
    <section data-audit className="relative overflow-hidden bg-[#0a0a0d]/90 py-24 md:h-[100svh] md:py-0">
      <span aria-hidden className={`${MONO} ax-ghost-num`}>04</span>
      <div className="flex h-full items-center justify-center px-6">
        <div className="grid w-full max-w-5xl items-center gap-12 md:grid-cols-2 md:gap-14">
          {/* Their receipt — the only light object on the whole page. */}
          <div
            data-receipt
            className="relative mx-auto w-full max-w-[430px] -rotate-2 bg-[#efece3] px-8 pb-9 pt-10 text-[#181622] shadow-[0_36px_90px_rgba(0,0,0,0.6)]"
            style={{ clipPath: RECEIPT_CLIP }}
          >
            <p className={`${MONO} text-center text-[13px] font-bold uppercase tracking-[0.3em]`}>
              The Category
            </p>
            <p className={`${MONO} mt-1.5 text-center text-[9px] uppercase tracking-[0.24em] text-[#181622]/75`}>
              Recovery apps inc · open 24/7 · every visit
            </p>
            <div className="my-5 border-t-2 border-dashed border-[#181622]/25" />
            {DIFF_ROWS.map((row, i) => (
              <div
                key={row.theirs}
                data-receipt-line
                className={`${MONO} relative flex items-baseline justify-between gap-4 py-2.5 text-[11.5px] uppercase leading-relaxed tracking-[0.06em]`}
              >
                <span className="max-w-[290px]">{row.theirs}</span>
                <span className="shrink-0 text-[#181622]/70">№{i + 1}</span>
                {/* Hand-drawn marker strike: a wavy double stroke, not a rule. */}
                <svg
                  data-receipt-strike
                  viewBox="0 0 300 14"
                  preserveAspectRatio="none"
                  aria-hidden
                  className="absolute left-[-1%] top-1/2 h-[12px] w-[102%] -translate-y-1/2"
                  style={{ transform: `translateY(-50%) rotate(${i % 2 === 0 ? -0.9 : 0.7}deg)` }}
                >
                  <path
                    d="M3,8 C34,5 58,10 92,7 C126,4 150,10 184,7 C218,4 244,10 297,6"
                    fill="none"
                    stroke="#c0392b"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14,10 C60,8 96,11 148,9 C200,7 236,10 282,9"
                    fill="none"
                    stroke="#c0392b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.65"
                  />
                </svg>
              </div>
            ))}
            <div className="my-5 border-t-2 border-dashed border-[#181622]/25" />
            <div className={`${MONO} flex items-baseline justify-between text-[13px] font-bold uppercase tracking-[0.12em]`}>
              <span>Total charged</span>
              <span>Your trust</span>
            </div>
            <p className={`${MONO} mt-4 text-center text-[9px] uppercase tracking-[0.3em] text-[#181622]/75`}>
              ✱ no refunds ✱
            </p>
            {/* VOID stamp slams in at the end of the act. */}
            <div data-void className="pointer-events-none absolute inset-0 grid place-items-center opacity-0">
              <span
                className={`${MONO} -rotate-12 border-[5px] border-[#c0392b] px-8 py-2.5 text-5xl font-bold tracking-[0.3em] text-[#c0392b]`}
                style={{ boxShadow: 'inset 0 0 0 2px #efece3, 0 0 0 2px #efece3' }}
              >
                VOID
              </span>
            </div>
          </div>
          {/* Our terms. */}
          <div data-terms className="ax-card relative p-8 md:p-9">
            <p className={`${MONO} text-[11px] uppercase tracking-[0.3em] text-[#8b7cf7]`}>
              The AXIOM terms
            </p>
            <p className="mt-2 text-[15px] text-[#9b98ad]">Plain, and permanent.</p>
            <div className="mt-6">
              {DIFF_ROWS.map((row) => (
                <div
                  key={row.ours}
                  data-term-line
                  className="flex items-start gap-3.5 border-b border-white/[0.06] py-3.5 opacity-0"
                >
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[#7ef7c2]/30 bg-[#7ef7c2]/10 text-[#7ef7c2]">
                    <Icon.Check className="h-3 w-3" />
                  </span>
                  <span className="leading-relaxed text-[#e8e6f0]">{row.ours}</span>
                </div>
              ))}
            </div>
            <p className={`${MONO} mt-6 text-[10px] uppercase tracking-[0.24em] text-[#8f8ca1]`}>
              — kept on your device, not ours
            </p>
            <div
              data-honest-stamp
              className={`${MONO} pointer-events-none absolute -right-3 -top-4 rotate-6 rounded border-2 border-[#7ef7c2]/70 bg-[#0a0a0d]/80 px-3.5 py-2 text-[10px] uppercase tracking-[0.26em] text-[#7ef7c2] opacity-0`}
            >
              Honest by design
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── the arc: pinned recovery curve + comet ───────────────────────────
function Arc() {
  return (
    // md:pt-16 keeps the eyebrow out from under the fixed nav: the pinned
    // section centres its content, and at 100svh the content is tall enough
    // that centring parked the eyebrow behind the header.
    <section id="arc" data-arc className="relative bg-[#0c0c10]/90 py-28 md:flex md:h-[100svh] md:flex-col md:justify-center md:pb-0 md:pt-16">
      <div aria-hidden className="ax-rows absolute inset-0" />
      <span aria-hidden className={`${MONO} ax-ghost-num`}>05</span>
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <Eyebrow>05 — the arc</Eyebrow>
        <h2 data-reveal className="max-w-2xl text-[clamp(2.2rem,5vw,3.9rem)] font-semibold leading-[1.04] text-[#f2f1f7]">
          What healing{' '}
          <span className="ax-serif text-[#cdc7ee]">actually</span> looks like.
        </h2>
        <div className="relative mt-12 md:mt-16">
          {/* On touch the chart gets its own centred moment instead of being
              squeezed under the heading, and the draw is timed to finish as it
              settles here. Desktop is unchanged: block, no min-height. */}
          <div data-curve-stage className="flex min-h-[38svh] items-center md:block md:min-h-0">
            <div className="relative w-full">
              <svg viewBox="0 0 1000 400" fill="none" className="w-full" aria-hidden>
                <defs>
                  <linearGradient id="ax-curve-grad" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#5a5470" />
                    <stop offset="0.45" stopColor="#8b7cf7" />
                    <stop offset="1" stopColor="#7ef7c2" />
                  </linearGradient>
                </defs>
                {/* Every stroke is non-scaling: the viewBox is 1000 wide but
                    renders ~350px on a phone, so an authored strokeWidth of 3
                    was arriving as a 1px hairline. */}
                <line
                  x1="20"
                  y1="150"
                  x2="980"
                  y2="150"
                  stroke="rgba(232,230,240,0.13)"
                  strokeDasharray="2 8"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Time axis — touch only. On desktop the four phase cards are
                    absolutely positioned over this exact band (see
                    CURVE_LABEL_POS) and each already carries its own week, so
                    the curve is read against them. On a phone those cards
                    collapse to a list underneath and the chart was left as a
                    line floating in space with nothing to measure it by. */}
                <g data-curve-axis className="md:hidden">
                  <line
                    x1="20"
                    y1="370"
                    x2="980"
                    y2="370"
                    stroke="rgba(232,230,240,0.16)"
                    vectorEffect="non-scaling-stroke"
                  />
                  {CURVE_PHASES.map((p) => (
                    <line
                      key={`tick-${p.w}`}
                      x1={p.x}
                      y1="364"
                      x2={p.x}
                      y2="376"
                      stroke="rgba(232,230,240,0.36)"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </g>
                <path
                  data-curve-path
                  d={CURVE_D}
                  stroke="url(#ax-curve-grad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                {CURVE_PHASES.map((p) => (
                  <circle
                    key={p.w}
                    data-curve-dot
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="#0c0c10"
                    stroke="#e8e6f0"
                    strokeWidth="1.6"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
              {/* HTML, not <text>: inside the viewBox this scaled down to a
                  ~4px smudge on a phone. */}
              <span
                aria-hidden
                className={`${MONO} pointer-events-none absolute left-0 text-[9px] uppercase tracking-[0.22em] text-[#8f8ca1] sm:text-[10px]`}
                style={{ top: '37.5%', transform: 'translateY(-165%)' }}
              >
                Baseline — where you started
              </span>
              {/* Week labels for the axis above. Same reason as the baseline
                  caption: <text> inside a 1000-unit viewBox rendered at ~350px
                  is unreadable. Positioned by the phase's own x so the label,
                  the tick and the dot are guaranteed to line up. */}
              <div data-curve-axis aria-hidden className="md:hidden">
                {CURVE_PHASES.map((p) => (
                  <span
                    key={`wk-${p.w}`}
                    className={`${MONO} pointer-events-none absolute whitespace-nowrap text-[8px] uppercase tracking-[0.16em] text-[#8f8ca1]`}
                    style={{ left: `${p.x / 10}%`, top: '95%', transform: 'translateX(-50%)' }}
                  >
                    {p.w}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* The comet that rides the curve (desktop pin). */}
          <div
            data-comet
            className="absolute left-0 top-0 hidden h-3 w-3 rounded-full bg-[#f2f1f7] md:block"
            style={{ boxShadow: '0 0 18px 4px rgba(200,190,255,0.55), 0 0 60px 14px rgba(139,124,247,0.35)' }}
          />
          {/* Phase labels: absolute over the svg on desktop, grid on mobile. */}
          <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 md:static md:mt-0 md:block">
            {CURVE_PHASES.map((p, i) => (
              <div
                key={p.w}
                data-curve-phase
                className="md:absolute md:w-52 md:-translate-x-1/2"
                style={{ left: CURVE_LABEL_POS[i].left, top: CURVE_LABEL_POS[i].top }}
              >
                <p className={`${MONO} text-[10px] uppercase tracking-[0.26em] text-[#8b7cf7]`}>{p.w}</p>
                <p className="mt-1.5 text-lg font-semibold text-[#e8e6f0]">{p.t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#9b98ad]">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
        <p data-reveal className={`${MONO} mt-10 text-[11px] uppercase tracking-[0.18em] text-[#8f8ca1] md:mt-24`}>
          Timelines vary by person — this is the typical arc. The app maps yours.
        </p>
      </div>
    </section>
  );
}

// ── stays-on-your-phone split demo ───────────────────────────────────
function Privacy() {
  return (
    <section id="privacy" data-seal className="relative overflow-hidden bg-[#0a0a0d]/90 py-32">
      <div aria-hidden className="ax-noise-wall" />
      <span aria-hidden className={`${MONO} ax-ghost-num`}>06</span>
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <Eyebrow>06 — stays on your phone</Eyebrow>
        <h2 data-reveal className="text-[clamp(2.2rem,5vw,3.9rem)] font-semibold leading-[1.04] text-[#f2f1f7]">
          We never get this.{' '}
          <span className="ax-serif text-[#cdc7ee]">That’s the point.</span>
        </h2>
        <div className="mt-16 grid items-stretch gap-6 text-left md:grid-cols-[1fr_auto_1fr]">
          {/* Your phone */}
          <div data-reveal className="ax-card flex flex-col p-8">
            {/* Stacked below sm: the label and the status pill are both long,
                and side by side on a 390px card the label was squeezed into a
                four-line column against the pill. */}
            <div className={`${MONO} mb-6 flex flex-col items-start gap-2.5 text-[10px] uppercase tracking-[0.22em] text-[#9b98ad] sm:flex-row sm:items-center sm:justify-between sm:gap-3`}>
              <span>Your phone — journal, 23:47</span>
              <span
                data-seal-chip
                className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#7ef7c2]/25 bg-[#7ef7c2]/10 px-2.5 py-1 text-[#7ef7c2] opacity-0"
              >
                <Icon.Lock className="h-3 w-3" />
                Stays here
              </span>
            </div>
            <p data-plain-text className={`${MONO} h-24 overflow-hidden text-base leading-relaxed text-[#c9c6d8] sm:text-lg`}>
              {JOURNAL_PLAIN}
            </p>
          </div>
          {/* The seal between the worlds */}
          <div className="hidden flex-col items-center justify-center gap-3 px-2 md:flex" aria-hidden>
            <span className="h-16 w-px bg-gradient-to-b from-transparent via-[#8b7cf7]/50 to-transparent" />
            <span className={`${MONO} rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-[#9b98ad]`}>
              Never sent
            </span>
            <span className="h-16 w-px bg-gradient-to-b from-transparent via-[#8b7cf7]/50 to-transparent" />
          </div>
          {/* Our servers */}
          <div data-reveal className="ax-card flex flex-col p-8" style={{ borderColor: 'rgba(126,247,194,0.12)' }}>
            {/* Stacked below sm: the label and the status pill are both long,
                and side by side on a 390px card the label was squeezed into a
                four-line column against the pill. */}
            <div className={`${MONO} mb-6 flex flex-col items-start gap-2.5 text-[10px] uppercase tracking-[0.22em] text-[#9b98ad] sm:flex-row sm:items-center sm:justify-between sm:gap-3`}>
              <span>Our servers — the same entry</span>
              <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[#9b98ad]">
                <Icon.Unlock className="h-3 w-3" />
                Refused · never stored
              </span>
            </div>
            {/* Fixed height + hidden overflow: the scramble loop swaps glyphs
                with different fallback widths, and without a hard box the
                reflow shifts the whole document under the user (scroll
                anchoring jumps). */}
            <p data-cipher-text className={`${MONO} h-24 overflow-hidden break-words text-base leading-relaxed text-[#5f5b73] sm:text-lg`}>
              {JOURNAL_CIPHER}
            </p>
          </div>
        </div>
        <p data-reveal className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-[#9b98ad]">
          Your journal, your triggers, your reset reasons — they stay on your
          phone. The app never sends them, and our database is built to refuse
          them if anything ever tried. Not a policy promise. Architecture.
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {[
            { t: 'Never on our servers', d: 'Journal text, triggers and reset reasons are refused at the database. Sign in, and backup holds only streak dates and mood scores.' },
            { t: 'No third-party tracking', d: 'No ad SDKs. No selling data. No profiling.' },
            { t: 'Yours to delete', d: 'Wipe everything, any time. Gone means gone.' },
          ].map((c) => (
            <div key={c.t} data-reveal className="ax-card p-6 text-left">
              <p className="font-semibold text-[#e8e6f0]">{c.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#9b98ad]">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── the tools: horizontal gallery ────────────────────────────────────
function Tools() {
  return (
    <section id="tools" data-tools className="relative overflow-hidden bg-[#0c0c10]/90 py-28 md:flex md:h-[100svh] md:flex-col md:justify-center md:py-0">
      <div aria-hidden className="ax-dots absolute inset-0" />
      <span aria-hidden className={`${MONO} ax-ghost-num`}>07</span>
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <Eyebrow>07 — the tools</Eyebrow>
        <h2 data-reveal className="max-w-2xl text-[clamp(2.2rem,5vw,3.9rem)] font-semibold leading-[1.04] text-[#f2f1f7]">
          Everything for the work.{' '}
          <span className="ax-serif text-[#cdc7ee]">Nothing to manipulate you.</span>
        </h2>
      </div>
      <div
        data-tools-track
        className="mt-12 flex w-full flex-col gap-6 px-6 md:mt-16 md:w-max md:flex-row md:flex-nowrap md:gap-7 md:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] md:pr-[16vw]"
      >
        {FEATURES.map((f, i) => (
          <div key={f.title} data-reveal className="md:w-[420px] md:shrink-0">
            <div className="group ax-card relative flex h-full flex-col overflow-hidden p-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 md:min-h-[340px]">
              <span
                aria-hidden
                className={`${MONO} ax-outline pointer-events-none absolute -top-3 right-4 text-[5.5rem] font-semibold leading-none opacity-60`}
              >
                0{i + 1}
              </span>
              <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-[#8b7cf7]/20 opacity-30 blur-[64px] transition-opacity duration-500 group-hover:opacity-80" />
              <div
                aria-hidden
                className={`pointer-events-none absolute -bottom-10 -right-8 ${f.accent} opacity-[0.05] transition-all duration-500 group-hover:scale-105 group-hover:opacity-[0.12]`}
              >
                {f.icon({ className: 'h-48 w-48' })}
              </div>
              <span className={`relative inline-grid h-[52px] w-[52px] place-items-center rounded-2xl border border-white/10 bg-white/[0.04] ${f.accent}`}>
                {f.icon({ className: 'h-6 w-6' })}
              </span>
              <div className="relative mt-auto pt-16">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-[1.35rem] font-semibold tracking-tight text-[#f2f1f7]">{f.title}</h3>
                  {f.badge === 'urgent' && (
                    <span className={`${MONO} rounded-full border border-[#7ef7c2]/25 bg-[#7ef7c2]/10 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-[#7ef7c2]`}>
                      Always opens
                    </span>
                  )}
                  {f.badge === 'soon' && (
                    <span className={`${MONO} rounded-full border border-[#8b7cf7]/25 bg-[#8b7cf7]/10 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-[#a99df8]`}>
                      Coming soon
                    </span>
                  )}
                </div>
                <p className="mt-3.5 leading-relaxed text-[#9b98ad]">{f.body}</p>
              </div>
            </div>
          </div>
        ))}
        {/* End card: CTA close-out for the gallery. */}
        <div data-reveal className="md:flex md:w-[420px] md:shrink-0 md:items-stretch">
          <div className="ax-card relative flex h-full w-full flex-col items-start justify-center overflow-hidden p-8 md:min-h-[340px]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8b7cf7]/[0.10] to-transparent" />
            <p className={`${MONO} text-[10px] uppercase tracking-[0.26em] text-[#8b7cf7]`}>All of it, in your pocket</p>
            <p className="mt-3 text-2xl font-semibold text-[#f2f1f7]">Start today.</p>
            <div className="mt-7 flex flex-col items-start gap-3">
              <StoreButtons variant="shelf" />
            </div>
          </div>
        </div>
      </div>
      <p className={`${MONO} mx-auto mt-10 hidden w-full max-w-6xl px-6 text-[10px] uppercase tracking-[0.24em] text-[#8f8ca1] md:block`}>
        Scroll — the shelf slides ⟶
      </p>
    </section>
  );
}

// ── built for depth ──────────────────────────────────────────────────
const DEPTH_TIERS = [
  {
    tag: 'Day one — stay light',
    title: 'Two minutes, no theory.',
    body: 'Open the app, check in, breathe. The streak and the panic toolkit carry you through the first hard week — nothing to configure, nothing to study.',
    accent: '#7fd8ff',
  },
  {
    tag: 'Weeks in — go deeper',
    title: 'Your patterns surface.',
    body: 'Your own triggers and reset times, your real arc against the recovery timeline. The plan you wrote after a reset comes back to you within 72 hours.',
    accent: '#8b7cf7',
  },
  {
    tag: 'All the way — full depth',
    title: 'Understand everything.',
    body: 'The 30-day guided program, complete stats and history, every trigger you have logged. Built for people who want the whole machine, not a mascot.',
    accent: '#7ef7c2',
  },
] as const;

function Depth() {
  return (
    <section className="ax-cv relative bg-[#0a0a0d]/90 py-32">
      <span aria-hidden className={`${MONO} ax-ghost-num`}>08</span>
      <div className="relative mx-auto max-w-6xl px-6">
        <Eyebrow>08 — built for depth</Eyebrow>
        <h2 data-reveal className="max-w-3xl text-[clamp(2.2rem,5vw,3.9rem)] font-semibold leading-[1.04] text-[#f2f1f7]">
          Light when you start.{' '}
          <span className="ax-serif text-[#cdc7ee]">Deep when you’re ready.</span>
        </h2>
        <p data-reveal className="mt-6 max-w-2xl text-lg leading-relaxed text-[#a6a3b8]">
          Most apps pick one user: the beginner who needs simplicity, or the
          veteran who wants every variable. AXIOM is layered — the surface
          stays calm, and the depth is there the day you go looking for it.
        </p>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {DEPTH_TIERS.map((t, i) => (
            <div key={t.tag} data-reveal>
              <div className="ax-card relative h-full overflow-hidden p-8">
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{ background: `linear-gradient(to right, transparent, ${t.accent}66, transparent)` }}
                />
                <p className={`${MONO} text-[10px] uppercase tracking-[0.26em]`} style={{ color: t.accent }}>
                  {t.tag}
                </p>
                <p className="mt-4 text-xl font-semibold text-[#f2f1f7]">{t.title}</p>
                <p className="mt-3 leading-relaxed text-[#a6a3b8]">{t.body}</p>
                <span
                  aria-hidden
                  className={`${MONO} ax-outline pointer-events-none absolute -bottom-4 right-4 select-none text-[4.5rem] font-semibold opacity-60`}
                >
                  {'I'.repeat(i + 1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── honest pricing ───────────────────────────────────────────────────
function Pricing() {
  return (
    <section id="pricing" className="ax-cv relative overflow-hidden bg-[#0a0a0d]/90 py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="ax-ring h-[46rem] w-[46rem]" style={{ right: '-14rem', top: '-10rem' }} />
        <span className="ax-ring h-[34rem] w-[34rem]" style={{ right: '-8rem', top: '-4rem' }} />
        <span className="ax-ring h-[22rem] w-[22rem]" style={{ right: '-2rem', top: '2rem' }} />
      </div>
      <span aria-hidden className={`${MONO} ax-ghost-num`}>09</span>
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2">
        <div>
          <Eyebrow>09 — honest pricing</Eyebrow>
          <h2 data-reveal className="text-[clamp(2.2rem,5vw,3.9rem)] font-semibold leading-[1.04] text-[#f2f1f7]">
            One price.{' '}
            <span className="ax-serif text-[#cdc7ee]">Shown before you pay.</span>
          </h2>
          <p data-reveal className="mt-6 text-lg leading-relaxed text-[#9b98ad]">
            AXIOM is a paid app, and the monthly plan starts with a 7-day free
            trial. You get the whole of it — the streak, the daily check-in,
            breathing, the daily brief, the 30-day program, the full history.
            There is no tier above the one you bought and nothing inside is
            still selling to you. Cancel any time and your data leaves with
            you.
          </p>
          <ul className="mt-8 space-y-3.5">
            {['No fake urgency, ever', 'Price shown honestly, up front', 'No upsell inside the app you bought', 'Cancel any time, keep your data'].map((t) => (
              <li key={t} data-reveal className="flex items-center gap-3.5 text-[#e8e6f0]">
                <span className="grid h-5 w-5 place-items-center rounded-full border border-[#7ef7c2]/25 bg-[#7ef7c2]/10 text-[#7ef7c2]">
                  <Icon.Check className="h-3 w-3" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal>
          <div className="ax-card relative overflow-hidden p-9" style={{ boxShadow: '0 0 80px rgba(139,124,247,0.10)' }}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b7cf7]/60 to-transparent" />
            <div className="flex items-baseline justify-between">
              <div>
                <p className={`${MONO} text-[11px] uppercase tracking-[0.26em] text-[#8b7cf7]`}>The Protocol</p>
                <p className="mt-2 text-[#9b98ad]">Everything, unlocked.</p>
              </div>
              <span className={`${MONO} rounded-full border border-[#7ef7c2]/25 bg-[#7ef7c2]/10 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[#7ef7c2]`}>
                One tier
              </span>
            </div>
            <div className="my-8 h-px bg-white/[0.07]" />
            <div className="space-y-3.5">
              {['A 30-day guided program, one read and one task a day', 'The plan you write after a reset, handed back within 72 hours', 'Your check-ins, triggers and full history', 'The Lighthouse, open even to non-subscribers'].map((t) => (
                <p key={t} className="flex items-start gap-3 text-[#9b98ad]">
                  <span className="mt-0.5 text-[#8b7cf7]">✓</span>
                  {t}
                </p>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3">
              <StoreButtons variant="card" />
            </div>
            <p className={`${MONO} mt-4 text-center text-[10px] uppercase tracking-[0.16em] text-[#8f8ca1]`}>
              7-day free trial on monthly for new subscribers · cancel anytime
            </p>
            <p className="mt-5 text-center text-sm leading-relaxed text-[#9b98ad]">
              A paid month did not help? Ask in Settings and the next 30 days are free.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── straight answers (FAQ) ───────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div data-reveal className="border-b border-white/[0.07]">
      {/* A row in a bordered stack presses with a background tint, not a scale:
          scaling would pull the row away from the divider lines above and
          below it. The tint is untransitioned on the way in so it lands on
          pointer-down, and fades on release. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="-mx-4 flex w-[calc(100%+2rem)] items-center justify-between gap-6 rounded-lg px-4 py-6 text-left transition-colors duration-300 active:bg-white/[0.045] active:duration-0"
      >
        <span className="text-base font-semibold text-[#e8e6f0] sm:text-lg">{q}</span>
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 text-lg text-[#9b98ad] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? 'rotate-45 border-[#8b7cf7]/50 text-[#a99df8]' : ''
          }`}
          aria-hidden
        >
          +
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-6 leading-relaxed text-[#a6a3b8]">{a}</p>
        </div>
      </div>
    </div>
  );
}

function Faq() {
  return (
    <section id="faq" className="ax-cv relative bg-[#0a0a0d]/90 py-32">
      <span aria-hidden className={`${MONO} ax-ghost-num`}>10</span>
      <div className="relative mx-auto max-w-3xl px-6">
        <Eyebrow>10 — asked straight, answered straight</Eyebrow>
        <h2 data-reveal className="text-[clamp(2.2rem,5vw,3.9rem)] font-semibold leading-[1.04] text-[#f2f1f7]">
          Before <span className="ax-serif text-[#cdc7ee]">day one.</span>
        </h2>
        <div className="mt-12">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
        <p data-reveal className="mt-8 text-[15px] text-[#9b98ad]">
          Something else on your mind? The{' '}
          <a href={internalUrl('/axiom/tools/')} className="text-[#cdc7ee] underline underline-offset-2 transition-colors hover:text-[#e8e6f0]">
            free tools
          </a>{' '}
          need no install, and no account.
        </p>
      </div>
    </section>
  );
}

// ── dawn finale ──────────────────────────────────────────────────────
function Finale() {
  return (
    <section data-finale className="relative overflow-hidden py-52">
      <div aria-hidden data-dawn className="pointer-events-none absolute inset-0">
        <div
          className="absolute -bottom-56 left-1/2 h-[46rem] w-[70rem] -translate-x-1/2 rounded-full blur-[110px]"
          style={{
            background:
              'radial-gradient(closest-side, rgba(255,158,125,0.30), rgba(139,124,247,0.26) 45%, transparent 75%)',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7ef7c2]/40 to-transparent" />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <h2
          data-finale-title
          className="text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[1.0] tracking-[-0.03em] text-[#f2f1f7]"
        >
          Day one starts
          <br />
          <span className="ax-serif ax-grad-dawn pr-2 font-normal">
            when you decide.
          </span>
        </h2>
        <p data-reveal className={`mx-auto mt-7 max-w-xl text-lg text-[#c2bfd2] ${OVER_FIELD}`}>
          Not a habit tracker with a counter and a quote. A private, honest
          system for the person you are becoming.
        </p>
        <div data-reveal className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <StoreButtons variant="finale" />
        </div>
        <p
          data-reveal
          className={`${MONO} mt-8 text-[10px] uppercase tracking-[0.24em] text-[#a8a5b8] ${OVER_FIELD}`}
        >
          One honest price · the Lighthouse always opens
        </p>
      </div>
    </section>
  );
}

// ── footer ───────────────────────────────────────────────────────────
function Footer() {
  return (
    // pb-32 below sm: the mobile sticky CTA bar is fixed over the last ~80px
    // of the viewport, and at py-14 it sat on top of the footer's bottom row.
    <footer className="relative border-t border-white/[0.06] bg-[#08080a] pb-32 pt-14 sm:pb-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={internalUrl('/images/axiom/logo.webp')}
              alt=""
              width={26}
              height={26}
              className="h-[26px] w-[26px] rounded-lg"
            />
            <span className={`${MONO} text-xs tracking-[0.3em] text-[#e8e6f0]`}>AXIOM</span>
          </div>
          <p className="mt-3 text-sm text-[#8f8ca1]">
            A recovery app by{' '}
            <a href={internalUrl('/')} className="text-[#c9c6d8] underline underline-offset-2 transition-colors hover:text-[#e8e6f0]">
              Luna Maze
            </a>
            .
          </p>
        </div>
        <div className={`${MONO} flex flex-wrap gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.2em] text-[#9b98ad]`}>
          <a href={internalUrl('/axiom/tools/')} className="transition-colors hover:text-[#e8e6f0]">Free tools</a>
          <a href={internalUrl('/axiom/blog/')} className="transition-colors hover:text-[#e8e6f0]">Blog</a>
          <a href={internalUrl('/axiom/privacy/')} className="transition-colors hover:text-[#e8e6f0]">Privacy</a>
          <a href={internalUrl('/axiom/terms/')} className="transition-colors hover:text-[#e8e6f0]">Terms</a>
          <a href={PLAY_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-[#e8e6f0]">Google Play</a>
          <a href={APP_STORE_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-[#e8e6f0]">App Store</a>
        </div>
      </div>
    </footer>
  );
}
