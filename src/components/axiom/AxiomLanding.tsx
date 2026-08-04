'use client';

/**
 * AXIOM — product landing, v3 "Silver Studio" (2026-08-03 rebuild).
 *
 * One continuous cinematic scroll. The protagonist is a WebGL particle field
 * (see ParticleField) that keeps changing what it is — chaos assembles into
 * the AXIOM monogram on load, then a pinned story act morphs it brain →
 * shield → tree, which IS the product story: rewire, sealed, become.
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

import { useEffect, useRef, useState, type ReactNode } from 'react';
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
const PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.axiomapp.app';

const HERO_BADGE = 'ZERO-KNOWLEDGE · WE CANNOT READ YOUR DATA';
const JOURNAL_PLAIN =
  '“I relapsed last night. I don’t want anyone to ever know this.”';
const JOURNAL_CIPHER =
  '9f2e▓a71c░04b8▒d3f6█e92a░77c1▒b0e5▓18d4░f36b█c25e▒a90d░41f7▓8c3a░d5e2▒';
const JOURNAL_CIPHER_ALT =
  '4c8b░e19f▒72d0█a3c6▓f51e░08b9▒d64a█27f3░c90e▓b1d8▒5a4f█e73c░26d9▓f0a1▒';

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
    copy: 'Your brain isn’t broken — it’s plastic. AXIOM maps your recovery in real dopamine phases, so you watch the wiring change week by week.',
  },
  {
    index: '02',
    label: 'PRIVACY',
    word: 'SEALED',
    copy: 'Everything you tell AXIOM is encrypted on your phone with a key only you hold. Our servers store noise we are mathematically unable to read.',
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
  { theirs: 'Your confessions stored readable on their servers.', ours: 'Encrypted on your phone. We hold no key.' },
  { theirs: 'Shame and fear tactics to make you pay.', ours: 'Compassion. A relapse is a reset, never a failure.' },
  { theirs: 'Inflated “join 2 million men” social proof.', ours: 'No inflated numbers. We will not lie to you.' },
  { theirs: 'Locked out the moment you stop paying.', ours: 'A real free core, forever. Panic tools always free.' },
] as const;

const MARQUEE_WORDS = [
  'NO SHAME',
  'NO FAKE COUNTDOWNS',
  'NO DARK PATTERNS',
  'NO SELLING YOUR STORY',
  'ZERO-KNOWLEDGE',
  'HONEST BY DESIGN',
] as const;

type Feature = {
  icon: (p: IconProps) => ReactNode;
  title: string;
  body: string;
  accent: string;
  badge?: 'free' | 'soon';
};

const FEATURES: Feature[] = [
  { icon: Icon.Pulse, title: 'The Rewire Map', body: 'Watch your dopamine recovery unfold in real, neuroscience-based phases. Not a novelty counter — a living picture of your brain healing.', accent: 'text-[#8b7cf7]' },
  { icon: Icon.Life, title: 'Panic toolkit', body: 'Urge timer, grounding, and a breath pacer one tap from anywhere — built for the 90 seconds that decide everything.', accent: 'text-[#ff8f8f]', badge: 'free' },
  { icon: Icon.Journal, title: 'Sealed journal', body: 'Write the whole truth. Every entry is encrypted with your key before it leaves the screen — even we cannot read it.', accent: 'text-[#cdc7ee]' },
  { icon: Icon.Compass, title: 'Pattern engine', body: 'It learns your triggers and risk windows from your own check-ins — and warns you before a relapse, not after.', accent: 'text-[#8b7cf7]' },
  { icon: Icon.Wind, title: 'Breathe', body: 'Ride a craving out in about ninety seconds with guided breathing tuned for urge waves, not spa music.', accent: 'text-[#7fd8ff]' },
  { icon: Icon.Spark, title: 'Daily practice', body: 'A streak, a check-in, a daily brief. Small honest reps that compound instead of willpower.', accent: 'text-[#ffd27a]' },
  { icon: Icon.Buddy, title: 'Recovery buddy', body: 'Invite one person you trust. They see whether you are standing — never your journal, never your data.', accent: 'text-[#7fd8ff]' },
  { icon: Icon.Widget, title: 'Widgets & milestones', body: 'Home-screen widgets that keep the day in sight, and milestone artwork actually worth reaching.', accent: 'text-[#ffd27a]' },
  { icon: Icon.Sound, title: 'Calming soundscapes', body: 'A synthesis engine tuned for urge-surfing — sound sculpted to slow your pulse, not another lo-fi playlist.', accent: 'text-[#7fd8ff]' },
  { icon: Icon.Export, title: 'Your data, your call', body: 'Export everything free. Delete everything forever. Leaving takes one tap — that is the point.', accent: 'text-[#cdc7ee]' },
  { icon: Icon.Shield, title: 'The Shield', body: 'An honest content blocker that is friction, not a cage — and never watches what you browse.', accent: 'text-[#7ef7c2]', badge: 'soon' },
];

const FAQS = [
  {
    q: 'Is the free core actually usable, or a trial in disguise?',
    a: 'It is real and permanent. The streak, daily check-in, breathing, the daily brief, and every panic tool are free forever. The Protocol subscription adds depth — it never takes the core away.',
  },
  {
    q: 'Can anyone at AXIOM read my journal?',
    a: 'No. Your entries are encrypted on your phone with a key we never see. What our servers store is mathematically unreadable to us — there is nothing to leak, sell, or hand over.',
  },
  {
    q: 'What happens when I relapse?',
    a: 'A reset, not a verdict. You log it honestly, the app maps what led there, and your history keeps its value. Shame is not a strategy here.',
  },
  {
    q: 'How long does rewiring actually take?',
    a: 'Honestly: usually longer than the famous ninety days, and different for everyone. Most people feel the flatline lift somewhere in weeks two to six and reach a stable baseline after two to three months. AXIOM maps your arc instead of promising you a date.',
  },
  {
    q: 'Do streak counters even work?',
    a: 'Alone, no — a bare number resets to zero and takes your motivation down with it. That is why AXIOM builds phases, patterns, and triggers around the streak: a reset costs you a day, not your progress.',
  },
  {
    q: 'Do I need an account or my real name?',
    a: 'We never ask for your name. The core works on your phone, and anything you choose to sync — for backup or the buddy system — is sealed with your key before it leaves the device. There is no readable story to attach to anyone.',
  },
  {
    q: 'Is AXIOM on iPhone?',
    a: 'Android is live on Google Play. iOS is in open beta — join from the iOS page and it installs through TestFlight today.',
  },
  {
    q: 'How is this different from the big-name quit apps?',
    a: 'No fake countdowns, no invented member counts, no panic button behind a paywall — and none of your story stored readable in a cloud. Scroll back up to the receipt.',
  },
] as const;

const CURVE_PHASES = [
  { x: 180, y: 300, w: 'DAYS 1–7', t: 'Withdrawal', d: 'The hardest stretch. Urges peak — this is where the panic tools live.' },
  { x: 420, y: 330, w: 'WEEKS 2–3', t: 'The flatline', d: 'Feels like nothing is working. It is. Receptors are resetting.' },
  { x: 660, y: 218, w: 'WEEKS 4–6', t: 'Reconnection', d: 'Energy and focus return. Real things feel good again.' },
  { x: 900, y: 98, w: 'WEEK 8+', t: 'Stability', d: 'New baseline. Urges become rare, quiet, survivable.' },
] as const;

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

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      // Dev/test hook: lets tooling drive the smoothed scroller directly.
      (window as Window & { __axLenis?: Lenis }).__axLenis = lenis;
    }

    // In-page anchors ride the smoothed scroller instead of jumping.
    const onAnchorClick = (e: MouseEvent): void => {
      if (!lenis) return;
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const target = document.querySelector<HTMLElement>(link.getAttribute('href') ?? '');
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -64, duration: 1.5 });
    };
    root.addEventListener('click', onAnchorClick);

    const ctx = gsap.context(() => {
      if (reduce) {
        document.documentElement.removeAttribute('data-ax-boot');
        const st = fieldRef.current?.state;
        if (st) {
          st.progress = 1;
          st.opacity = 0.5;
        }
        return;
      }
      // Hand-off from the parse-time boot guard: inline styles take over the
      // hiding in the same tick the class is dropped, so there is no gap and
      // no flash in either direction.
      gsap.set('[data-intro]', { autoAlpha: 0 });
      gsap.set('[data-reveal]', { autoAlpha: 0, y: 40 });
      document.documentElement.removeAttribute('data-ax-boot');
    }, root);

    let cancelled = false;
    if (!reduce) {
      document.fonts.ready.then(() => {
        if (cancelled) return;
        ctx.add(() => {
          const st = fieldRef.current?.state;
          const mmG = gsap.matchMedia();
          // Dev/test hook alongside __axLenis: observe the field state live.
          (window as Window & { __axField?: typeof st }).__axField = st;

          // ── intro ────────────────────────────────────────────────
          const heroTitle = root.querySelector<HTMLElement>('[data-hero-title]');
          const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
          // The assembly tween lives OUTSIDE the intro timeline so the story
          // pin can kill it: if the user dives deep (nav anchor, fast flick)
          // while it is still playing, it must not keep writing progress
          // back to 1 after the scrub has already rendered a later shape.
          const assembly = st
            ? gsap.fromTo(
                st,
                { progress: 0 },
                { progress: 1, duration: 2.8, ease: 'power2.inOut', delay: 0.2 },
              )
            : null;
          intro.to('[data-nav]', { autoAlpha: 1, duration: 0.9 }, 0.4);
          intro.to('[data-hero-badge]', { autoAlpha: 1, duration: 0.6 }, 0.55);
          intro.to(
            '[data-hero-badge-text]',
            {
              duration: 1.6,
              scrambleText: { text: HERO_BADGE, chars: '▮▯░AXIOM01', speed: 0.55 },
            },
            0.6,
          );
          if (heroTitle) {
            const split = SplitText.create(heroTitle, {
              type: 'lines,chars',
              mask: 'lines',
              linesClass: 'ax-clip-line',
              charsClass: 'ax-char',
            });
            gsap.set(heroTitle, { autoAlpha: 1 });
            intro.from(
              split.chars,
              {
                yPercent: 118,
                duration: 1.15,
                stagger: { amount: 0.55 },
                ease: 'expo.out',
              },
              0.7,
            );
          }
          gsap.set('[data-hero-sub]', { y: 26 });
          intro.to('[data-hero-sub]', { autoAlpha: 1, y: 0, duration: 0.9 }, 1.35);
          intro.fromTo(
            '[data-hero-cta] > *',
            { y: 26, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1 },
            1.5,
          );
          intro.to('[data-hero-trust]', { autoAlpha: 1, duration: 0.8 }, 1.75);
          intro.to('[data-hero-cue]', { autoAlpha: 1, duration: 1 }, 2.1);

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

          // ── story act: pinned morph brain → shield → tree ────────
          const chapters = gsap.utils.toArray<HTMLElement>('[data-chapter]');
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
            const fracs = [0.17, 0.42, 0.67, 0.92];
            const dots = gsap.utils.toArray<SVGCircleElement>('[data-curve-dot]');
            gsap.utils.toArray<HTMLElement>('[data-curve-phase]').forEach((el, i) => {
              const at = Math.max(0, fracs[i] - 0.04);
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
            gsap.from('[data-curve-path]', {
              drawSVG: '0%',
              ease: 'none',
              scrollTrigger: {
                trigger: '[data-arc]',
                start: 'top 70%',
                end: 'bottom 75%',
                scrub: 1,
              },
            });
            gsap.utils.toArray<HTMLElement>('[data-curve-phase]').forEach((el, i) => {
              gsap.fromTo(
                el,
                { autoAlpha: 0, y: 18 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.6,
                  ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 88%' },
                },
              );
            });
          });

          // ── zero-knowledge split demo ────────────────────────────
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
          // The server panel never resolves — it re-scrambles forever.
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

          // ── generic reveals ──────────────────────────────────────
          ScrollTrigger.batch('[data-reveal]', {
            start: 'top 86%',
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.09,
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
        });
      });
    }

    return () => {
      cancelled = true;
      root.removeEventListener('click', onAnchorClick);
      ctx.revert();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return (
    <div ref={rootRef} className="axiom-v3 relative">
      {/* Runs during HTML parse, before first paint: arms the .ax-boot CSS
          guard so intro elements cannot flash before GSAP takes over. */}
      {/* A data attribute, not a class: React hydrates <html>'s className and
          would report a mismatch if we appended to it. */}
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.setAttribute('data-ax-boot','')",
        }}
      />
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

// ── navigation ───────────────────────────────────────────────────────
function Nav() {
  return (
    <header
      data-nav
      data-intro
      className="fixed inset-x-0 top-0 z-50"
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
        <div className={`${MONO} hidden items-center gap-9 text-[11px] uppercase tracking-[0.22em] text-[#9b98ad] md:flex`}>
          <a className="transition-colors hover:text-[#e8e6f0]" href="#difference">The audit</a>
          <a className="transition-colors hover:text-[#e8e6f0]" href="#arc">The arc</a>
          <a className="transition-colors hover:text-[#e8e6f0]" href="#privacy">Privacy</a>
          <a className="transition-colors hover:text-[#e8e6f0]" href="#pricing">Pricing</a>
        </div>
        <a
          href={PLAY_URL}
          target="_blank"
          rel="noreferrer"
          className="ax-btn-primary px-5 py-2 text-sm"
          data-magnetic
        >
          Get the app
        </a>
      </nav>
    </header>
  );
}

// ── mobile sticky CTA (appears once the hero scrolls away) ───────────
function StickyCTA() {
  return (
    <div
      data-sticky-cta
      className="fixed inset-x-3 bottom-3 z-50 md:hidden"
      style={{ transform: 'translateY(140%)' }}
    >
      <div className="ax-blur-desk flex items-center gap-3 rounded-2xl border border-white/10 bg-[#101014]/95 p-3 shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
        <img
          src={internalUrl('/images/axiom/logo.webp')}
          alt=""
          width={38}
          height={38}
          className="h-[38px] w-[38px] rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#f2f1f7]">AXIOM — free core forever</p>
          <p className={`${MONO} truncate text-[9px] uppercase tracking-[0.18em] text-[#9b98ad]`}>
            Private · honest · no fake urgency
          </p>
        </div>
        <a
          href={PLAY_URL}
          target="_blank"
          rel="noreferrer"
          className="ax-btn-primary shrink-0 px-5 py-2.5 text-sm"
        >
          Start free
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
          data-intro
          className={`${MONO} ax-blur-desk mb-9 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[#9b98ad]`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#7ef7c2] shadow-[0_0_12px_rgba(126,247,194,0.8)]" />
          <span data-hero-badge-text>{HERO_BADGE}</span>
        </div>
        <h1
          data-hero-title
          data-intro
          className="text-[clamp(3.2rem,9.2vw,8rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-[#f2f1f7]"
        >
          Quit porn.
          <br />
          <span className="ax-serif ax-grad-violet pr-2 font-normal">
            Rewire
          </span>{' '}
          your brain.
          <br />
          Keep it private.
        </h1>
        <p
          data-hero-sub
          data-intro
          className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-[#a6a3b8] [text-shadow:0_1px_18px_rgba(7,7,9,0.9)] sm:text-lg"
        >
          A calm, honest recovery companion grounded in real neuroscience.
          No shame, no fake countdowns, no selling your story.
        </p>
        <div data-hero-cta className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={PLAY_URL}
            target="_blank"
            rel="noreferrer"
            data-magnetic
            className="ax-btn-primary flex items-center gap-3 px-8 py-4 text-[15px]"
          >
            <Icon.Play className="h-4 w-4" />
            Start free on Google Play
          </a>
          <a
            href={internalUrl('/axiom/ios/')}
            data-magnetic
            className="ax-btn-ghost flex items-center gap-2.5 px-8 py-4 text-[15px]"
          >
            <Icon.Apple className="h-4 w-4" />
            iOS — join the beta
          </a>
        </div>
        <p
          data-hero-trust
          data-intro
          className={`${MONO} mt-6 text-[10px] uppercase tracking-[0.22em] text-[#8f8ca1]`}
        >
          Free core forever · No fake urgency · Cancel anytime
        </p>
      </div>
      <div
        data-hero-cue
        data-intro
        className={`${MONO} ax-cue absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#8f8ca1]`}
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

// ── the pinned story act ─────────────────────────────────────────────
function StoryAct() {
  return (
    <section data-story className="relative h-[100svh] overflow-hidden">
      {CHAPTERS.map((ch, i) => (
        <div
          key={ch.word}
          data-chapter
          className="absolute inset-0 flex items-center justify-center opacity-0"
        >
          <span
            data-chapter-word
            className="ax-outline-strong pointer-events-none select-none text-[clamp(4rem,17vw,14rem)] font-semibold leading-none"
          >
            {ch.word}
          </span>
          <div
            data-chapter-meta
            className={`${MONO} absolute top-[16vh] text-[11px] uppercase tracking-[0.3em] text-[#9b98ad] ${
              i === 1 ? 'right-8 text-right md:right-[12vw]' : 'left-8 md:left-[12vw]'
            }`}
          >
            {ch.index} / {ch.label}
          </div>
          <div
            data-chapter-meta
            className={`absolute bottom-[12vh] max-w-md px-8 md:px-0 ${
              i === 1 ? 'left-8 md:left-[12vw]' : 'right-8 text-right md:right-[12vw]'
            }`}
          >
            <p className="text-base leading-relaxed text-[#d8d5e4] [text-shadow:0_1px_18px_rgba(7,7,9,0.9),0_0_44px_rgba(7,7,9,0.7)] md:text-lg">{ch.copy}</p>
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
            <p className={`${MONO} mt-1.5 text-center text-[9px] uppercase tracking-[0.24em] text-[#181622]/60`}>
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
                <span className="shrink-0 text-[#181622]/55">№{i + 1}</span>
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
            <p className={`${MONO} mt-4 text-center text-[9px] uppercase tracking-[0.3em] text-[#181622]/50`}>
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
              — sealed on your device, not ours
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
    <section id="arc" data-arc className="relative bg-[#0c0c10]/90 py-28 md:flex md:h-[100svh] md:flex-col md:justify-center md:py-0">
      <div aria-hidden className="ax-rows absolute inset-0" />
      <span aria-hidden className={`${MONO} ax-ghost-num`}>05</span>
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <Eyebrow>05 — the arc</Eyebrow>
        <h2 data-reveal className="max-w-2xl text-[clamp(2.2rem,5vw,3.9rem)] font-semibold leading-[1.04] text-[#f2f1f7]">
          What healing{' '}
          <span className="ax-serif text-[#cdc7ee]">actually</span> looks like.
        </h2>
        <div className="relative mt-12 md:mt-16">
          <svg viewBox="0 0 1000 400" fill="none" className="w-full" aria-hidden>
            <defs>
              <linearGradient id="ax-curve-grad" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#5a5470" />
                <stop offset="0.45" stopColor="#8b7cf7" />
                <stop offset="1" stopColor="#7ef7c2" />
              </linearGradient>
            </defs>
            <line x1="20" y1="150" x2="980" y2="150" stroke="rgba(232,230,240,0.08)" strokeDasharray="3 7" />
            <text x="24" y="138" className={MONO} fill="rgba(232,230,240,0.22)" fontSize="13" letterSpacing="2">
              BASELINE — WHERE YOU STARTED
            </text>
            <path
              data-curve-path
              d="M20,150 C90,160 130,240 180,300 C220,345 260,332 320,330 C400,328 440,335 520,322 C600,308 660,220 760,150 C830,102 900,96 980,92"
              stroke="url(#ax-curve-grad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {CURVE_PHASES.map((p) => (
              <circle key={p.w} data-curve-dot cx={p.x} cy={p.y} r="5" fill="#0a0a0d" stroke="#e8e6f0" strokeWidth="1.6" />
            ))}
          </svg>
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
        <p data-reveal className={`${MONO} mt-10 text-[11px] uppercase tracking-[0.18em] text-[#8f8ca1] md:mt-32`}>
          Timelines vary by person — this is the typical arc. The app maps yours.
        </p>
      </div>
    </section>
  );
}

// ── zero-knowledge split demo ────────────────────────────────────────
function Privacy() {
  return (
    <section id="privacy" data-seal className="relative overflow-hidden bg-[#0a0a0d]/90 py-32">
      <div aria-hidden className="ax-noise-wall" />
      <span aria-hidden className={`${MONO} ax-ghost-num`}>06</span>
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <Eyebrow>06 — zero-knowledge</Eyebrow>
        <h2 data-reveal className="text-[clamp(2.2rem,5vw,3.9rem)] font-semibold leading-[1.04] text-[#f2f1f7]">
          We can’t read this.{' '}
          <span className="ax-serif text-[#cdc7ee]">That’s the point.</span>
        </h2>
        <div className="mt-16 grid items-stretch gap-6 text-left md:grid-cols-[1fr_auto_1fr]">
          {/* Your phone */}
          <div data-reveal className="ax-card flex flex-col p-8">
            <div className={`${MONO} mb-6 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.22em] text-[#9b98ad]`}>
              <span>Your phone — journal, 23:47</span>
              <span
                data-seal-chip
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#7ef7c2]/25 bg-[#7ef7c2]/10 px-2.5 py-1 text-[#7ef7c2] opacity-0"
              >
                <Icon.Lock className="h-3 w-3" />
                Key stays here
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
              E2EE
            </span>
            <span className="h-16 w-px bg-gradient-to-b from-transparent via-[#8b7cf7]/50 to-transparent" />
          </div>
          {/* Our servers */}
          <div data-reveal className="ax-card flex flex-col p-8" style={{ borderColor: 'rgba(126,247,194,0.12)' }}>
            <div className={`${MONO} mb-6 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.22em] text-[#9b98ad]`}>
              <span>Our servers — the same entry</span>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[#9b98ad]">
                <Icon.Unlock className="h-3 w-3" />
                No key · cannot decrypt
              </span>
            </div>
            {/* Fixed height + hidden overflow: the scramble loop swaps glyphs
                with different fallback widths, and without a hard box the
                reflow shifts the whole document under the user (scroll
                anchoring jumps). */}
            <p data-cipher-text className={`${MONO} h-24 overflow-hidden break-all text-base leading-relaxed text-[#5f5b73] sm:text-lg`}>
              {JOURNAL_CIPHER}
            </p>
          </div>
        </div>
        <p data-reveal className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-[#9b98ad]">
          Your journal, your triggers, your reset reasons — encrypted on your
          device with a key only you hold. What reaches us is noise we are
          mathematically unable to open. Not a policy promise. Architecture.
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {[
            { t: 'Zero-knowledge', d: 'Sealed end-to-end. No key on our side, ever.' },
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
                  {f.badge === 'free' && (
                    <span className={`${MONO} rounded-full border border-[#7ef7c2]/25 bg-[#7ef7c2]/10 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-[#7ef7c2]`}>
                      Free forever
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
            <p className="mt-3 text-2xl font-semibold text-[#f2f1f7]">Start with the free core today.</p>
            <a
              href={PLAY_URL}
              target="_blank"
              rel="noreferrer"
              data-magnetic
              className="ax-btn-primary mt-7 flex items-center gap-3 px-7 py-3.5"
            >
              <Icon.Play className="h-4 w-4" />
              Get AXIOM
            </a>
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
    body: 'Your own triggers, your risk hours, your real arc against the recovery timeline. The daily brief turns your data into tomorrow’s next move.',
    accent: '#8b7cf7',
  },
  {
    tag: 'All the way — full depth',
    title: 'Understand everything.',
    body: 'Recovery programs, complete stats and history, risk alerts, the entire pattern engine. Built for people who want the whole machine, not a mascot.',
    accent: '#7ef7c2',
  },
] as const;

function Depth() {
  return (
    <section className="relative bg-[#0a0a0d]/90 py-32">
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
    <section id="pricing" className="relative overflow-hidden bg-[#0a0a0d]/90 py-32">
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
            A real free core.{' '}
            <span className="ax-serif text-[#cdc7ee]">A fair way deeper.</span>
          </h2>
          <p data-reveal className="mt-6 text-lg leading-relaxed text-[#9b98ad]">
            The streak, daily check-in, breathing, the daily brief, and the
            panic tools are free and stay free. The Protocol opens the depth:
            the full pattern engine, recovery programs, deeper stats, and more.
            Seven days free, once, no tricks. Cancel in one tap.
          </p>
          <ul className="mt-8 space-y-3.5">
            {['No fake urgency, ever', 'Price shown honestly, up front', 'One trial per person, no abuse games', 'Cancel any time, keep your data'].map((t) => (
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
                7 days free
              </span>
            </div>
            <div className="my-8 h-px bg-white/[0.07]" />
            <div className="space-y-3.5">
              {['The full pattern engine and risk alerts', 'Recovery programs and deeper practice', 'Complete stats and history', 'Everything in the free core, always'].map((t) => (
                <p key={t} className="flex items-start gap-3 text-[#9b98ad]">
                  <span className="mt-0.5 text-[#8b7cf7]">✓</span>
                  {t}
                </p>
              ))}
            </div>
            <a
              href={PLAY_URL}
              target="_blank"
              rel="noreferrer"
              data-magnetic
              className="ax-btn-primary mt-9 block py-4 text-center"
            >
              Start free on Google Play
            </a>
            <p className={`${MONO} mt-4 text-center text-[10px] uppercase tracking-[0.16em] text-[#8f8ca1]`}>
              Price shown in-app in your currency · cancel anytime
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
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
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
    <section id="faq" className="relative bg-[#0a0a0d]/90 py-32">
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
        <p data-reveal className="mx-auto mt-7 max-w-xl text-lg text-[#b3b0c4] [text-shadow:0_1px_18px_rgba(7,7,9,0.95),0_0_40px_rgba(7,7,9,0.8)]">
          Not a habit tracker with a counter and a quote. A private, honest
          system for the person you are becoming.
        </p>
        <div data-reveal className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={PLAY_URL}
            target="_blank"
            rel="noreferrer"
            data-magnetic
            className="ax-btn-primary flex items-center gap-3 px-9 py-4"
          >
            <Icon.Play className="h-4 w-4" />
            Start free on Google Play
          </a>
          <a
            href={internalUrl('/axiom/ios/')}
            data-magnetic
            className="ax-btn-ghost flex items-center gap-2.5 px-9 py-4"
          >
            <Icon.Apple className="h-4 w-4" />
            iOS — join the beta
          </a>
        </div>
        <p data-reveal className={`${MONO} mt-8 text-[10px] uppercase tracking-[0.24em] text-[#8f8ca1]`}>
          Free core forever · panic tools never paywalled
        </p>
      </div>
    </section>
  );
}

// ── footer ───────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#08080a] py-14">
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
        </div>
      </div>
    </footer>
  );
}
