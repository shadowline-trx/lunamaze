'use client';

/**
 * AXIOM — product landing (full rebuild, 2026-07-19).
 *
 * A cinematic, honest-brand single page for the AXIOM recovery app. The
 * design leans into AXIOM's two real differentiators (validated by market
 * research): radical PRIVACY (zero-knowledge, nothing leaves the device)
 * and radical HONESTY (no fake countdowns, no dark patterns, no inflated
 * numbers). Dark, violet-to-streak palette from the app's own tokens.
 *
 * Self-contained: only depends on framer-motion, the Tailwind `axiom.*`
 * tokens, the global utility classes (glass / gradient-text / glow-*), and
 * the `internalUrl` base-path helper. No external data, no `any` types.
 * Respects prefers-reduced-motion throughout.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import { internalUrl } from '@/lib/paths';
import NeuralField from '@/components/axiom/NeuralField';
import RecoveryPhases from '@/components/axiom/RecoveryPhases';
import SmoothScroll from '@/components/axiom/SmoothScroll';
import Grain from '@/components/axiom/Grain';
import DawnJourney from '@/components/axiom/DawnJourney';

const DISPLAY = 'font-[family-name:var(--font-display)]';
const MONO = 'font-[family-name:var(--font-mono)]';

const PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.axiomapp.app';

// ── shared motion ────────────────────────────────────────────────────
const riseVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={riseVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

// ── living aurora backdrop ───────────────────────────────────────────
function Aurora() {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <motion.div
        className="absolute -top-40 -left-40 h-[38rem] w-[38rem] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(108,92,231,0.35), transparent 70%)' }}
        animate={reduce ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(0,245,160,0.16), transparent 70%)' }}
        animate={reduce ? undefined : { x: [0, -50, 0], y: [0, 50, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 h-[30rem] w-[30rem] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(0,210,255,0.12), transparent 70%)' }}
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

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
  Apple: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16 13c0-2.4 2-3.5 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8s-1.8-.8-3-.8C4.9 7.8 3 9.4 3 12.5c0 3.2 2.4 6.6 4 6.6.9 0 1.5-.7 2.7-.7s1.7.7 2.8.7c1.7 0 3.5-3.4 3.5-3.9 0 0-2-.8-2-2.2zM14.5 6.4c.7-.9.6-2.1.6-2.4-.6 0-1.6.4-2.2 1.1-.6.7-.7 1.8-.6 2.2.7.1 1.5-.4 2.2-.9z" />
    </svg>
  ),
};

// ── navigation ───────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-white/[0.06] bg-[#08070c]/85 py-3 backdrop-blur-xl'
          : 'border-transparent py-5'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <img
            src={internalUrl('/images/axiom/logo.png')}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl"
          />
          <span className="text-lg font-semibold tracking-tight">AXIOM</span>
        </a>
        <div className="hidden items-center gap-8 text-sm text-axiom-textSecondary md:flex">
          <a className="transition-colors hover:text-axiom-textPrimary" href="#difference">The difference</a>
          <a className="transition-colors hover:text-axiom-textPrimary" href="#privacy">Privacy</a>
          <a className="transition-colors hover:text-axiom-textPrimary" href="#protocol">The tools</a>
          <a className="transition-colors hover:text-axiom-textPrimary" href="#pricing">Pricing</a>
        </div>
        <a
          href={PLAY_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-axiom-bgDeep transition-transform hover:-translate-y-0.5"
        >
          Get the app
        </a>
      </nav>
    </header>
  );
}

// ── hero ─────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* The field itself is page-wide and lives at the root; the hero only
          adds a scrim so the headline always clears the brightest filaments. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-axiom-bgDeep/50 via-transparent to-axiom-bgDeep/80" />
      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-axiom-textSecondary backdrop-blur-sm ${MONO}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-axiom-streak glow-streak" />
          Zero-knowledge · we cannot read your data
        </motion.div>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className={`${DISPLAY} text-6xl font-semibold leading-[0.98] tracking-[-0.02em] sm:text-7xl md:text-[5.75rem]`}
        >
          Quit porn.
          <br />
          <span className="gradient-text">Rewire your brain.</span>
          <br />
          Keep it private.
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-axiom-textSecondary"
        >
          A calm, honest recovery companion grounded in real neuroscience. No shame,
          no fake countdowns, no selling your story. Just your streak, your tools,
          and a brain that heals week by week.
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href={PLAY_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-full bg-white px-7 py-3.5 font-semibold text-axiom-bgDeep transition-transform hover:-translate-y-0.5"
          >
            <Icon.Play className="h-4 w-4" />
            Get it on Google Play
          </a>
          {/* Was a dead <span>. An iPhone visitor reaching the hero CTA is the
              best traffic this page gets, and "coming soon" gave them nothing
              to do with that. */}
          <a
            href={internalUrl('/axiom/ios/')}
            className="flex items-center gap-2 rounded-full border border-axiom-border px-7 py-3.5 font-medium text-axiom-textSecondary transition-colors hover:border-axiom-primaryLight hover:text-axiom-textPrimary"
          >
            <Icon.Apple className="h-4 w-4" />
            iOS — notify me
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── the honest difference ────────────────────────────────────────────
function Difference() {
  const rows: { theirs: string; ours: string }[] = [
    { theirs: 'Fake "80% off" countdowns that reset every visit', ours: 'One honest price. No countdown, no lie.' },
    { theirs: 'Your confessions stored on their servers', ours: 'Encrypted on your phone. We hold no key.' },
    { theirs: 'Shame-based fear tactics to make you pay', ours: 'Compassion. Relapse is a reset, never a failure.' },
    { theirs: 'Inflated "join 2 million men" social proof', ours: 'No inflated numbers. We will not lie to you.' },
    { theirs: 'Locked out the moment you stop paying', ours: 'A real free core, forever. Panic tools always free.' },
  ];
  return (
    <section id="difference" className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-axiom-primaryLight">The difference</p>
        <h2 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          The recovery category has a trust problem. We built the opposite.
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-axiom-textSecondary">
          Most apps in this space run dark patterns and cloud-store the most intimate
          data a person can share. One leader recently leaked hundreds of thousands of
          users&apos; private confessions. AXIOM is engineered so that can never happen here.
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.06] md:grid-cols-2">
          {/* The category */}
          <div className="bg-[#0c0a12] p-8">
            <p className={`mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-axiom-reset ${MONO}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-axiom-reset/70" />
              The rest of the category
            </p>
            <ul className="space-y-5">
              {rows.map((r) => (
                <li key={r.theirs} className="flex items-start gap-3.5 text-axiom-textSecondary">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-axiom-reset/20 bg-axiom-reset/10 text-axiom-reset">
                    <Icon.X className="h-3.5 w-3.5" />
                  </span>
                  <span className="leading-relaxed">{r.theirs}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* AXIOM — the winning side, subtly lit */}
          <div className="relative overflow-hidden bg-axiom-bgSurface p-8">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-axiom-streak/[0.07] via-transparent to-transparent" />
            <p className={`relative mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-axiom-streak ${MONO}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-axiom-streak glow-streak" />
              AXIOM
            </p>
            <ul className="relative space-y-5">
              {rows.map((r) => (
                <li key={r.ours} className="flex items-start gap-3.5 text-axiom-textPrimary">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-axiom-streak/25 bg-axiom-streak/10 text-axiom-streak">
                    <Icon.Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="leading-relaxed">{r.ours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ── privacy moat ─────────────────────────────────────────────────────
function Privacy() {
  return (
    <section id="privacy" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]" style={{ background: 'radial-gradient(circle, rgba(0,210,255,0.14), transparent 70%)' }} />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-axiom-border bg-axiom-bgSurface text-axiom-calm glow-primary">
            <Icon.Lock className="h-7 w-7" />
          </span>
          <h2 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
            Your recovery never leaves your phone.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-axiom-textSecondary">
            Your journal, your triggers, your reset reasons are encrypted on your device
            with a key only you hold. Our servers store sealed data we are mathematically
            unable to open. This is not a privacy policy promise. It is how the app is built.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {[
            { t: 'Zero-knowledge', d: 'Sealed end-to-end. No key on our side, ever.' },
            { t: 'No third-party tracking', d: 'No ad SDKs. No selling data. No profiling.' },
            { t: 'Yours to delete', d: 'Wipe everything, any time. Gone means gone.' },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.08}>
              <div className="glass h-full rounded-2xl p-6 text-left">
                <p className="font-semibold text-axiom-textPrimary">{c.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-axiom-textSecondary">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── the tools (bento) ────────────────────────────────────────────────
type Feature = {
  icon: (p: IconProps) => ReactNode;
  title: string;
  body: string;
  accent: string;
  span?: string;
  free?: boolean;
};

function Protocol() {
  const features: Feature[] = [
    { icon: Icon.Pulse, title: 'The Rewire Map', body: 'Watch your dopamine recovery unfold in real, neuroscience-based phases. Not a novelty counter, a living picture of your brain healing.', accent: 'text-axiom-primaryLight', span: 'md:col-span-2' },
    { icon: Icon.Life, title: 'Panic tools', body: 'A one-tap way through the exact moment an urge hits. Free forever.', accent: 'text-axiom-reset', free: true },
    { icon: Icon.Wind, title: 'Breathe', body: 'Ride a craving out in about ninety seconds with guided breathing.', accent: 'text-axiom-calm' },
    { icon: Icon.Compass, title: 'Pattern engine', body: 'It learns your triggers and risk windows from your own check-ins, and warns you before a relapse, not after.', accent: 'text-axiom-primaryLight', span: 'md:col-span-2' },
    { icon: Icon.Spark, title: 'Daily practice', body: 'A streak, a check-in, a brief. Small honest reps that compound instead of willpower.', accent: 'text-axiom-amber' },
    // Spans 2 so the bento closes out on a full row (2+1 / 1+2 / 1+2) with no
    // orphan cell, and the v2.1 headline feature gets the wide slot it earns.
    // `free: false` keeps the honest "Coming soon" badge — the native blocker
    // ships in v2.1, so the page must not imply it is live today.
    { icon: Icon.Shield, title: 'The Shield', body: 'An honest content blocker that is friction, not a cage, and never watches what you browse.', accent: 'text-axiom-streak', span: 'md:col-span-2', free: false },
  ];
  return (
    <section id="protocol" className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-axiom-primaryLight">The tools</p>
        <h2 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Everything you need for the work. Nothing to manipulate you into it.
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.05} className={f.span}>
            <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-white/[0.008] p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-axiom-primary/40">
              {/* Corner bloom (brightens on hover) */}
              <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-axiom-primary/25 opacity-40 blur-[64px] transition-opacity duration-500 group-hover:opacity-90" />
              {/* Oversized ghost of the card's own glyph — fills the dead space,
                  gives each card a distinct silhouette, and warms on hover. */}
              <div
                aria-hidden
                className={`pointer-events-none absolute -bottom-10 -right-8 ${f.accent} opacity-[0.06] transition-all duration-500 group-hover:scale-105 group-hover:opacity-[0.13]`}
              >
                {f.icon({ className: 'h-48 w-48' })}
              </div>
              <span className={`relative inline-grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] ${f.accent} shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]`}>
                {f.icon({ className: 'h-[26px] w-[26px]' })}
              </span>
              <div className="relative mt-7 flex flex-wrap items-center gap-2.5">
                <h3 className="text-[1.4rem] font-semibold tracking-tight text-axiom-textPrimary">{f.title}</h3>
                {f.free && (
                  <span className={`rounded-full border border-axiom-streak/25 bg-axiom-streak/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-axiom-streak ${MONO}`}>
                    Free forever
                  </span>
                )}
                {f.free === false && (
                  <span className={`rounded-full border border-axiom-primary/25 bg-axiom-primary/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-axiom-primaryLight ${MONO}`}>
                    Coming soon
                  </span>
                )}
              </div>
              <p className="relative mt-3.5 max-w-md leading-relaxed text-axiom-textSecondary">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ── honest pricing ───────────────────────────────────────────────────
function Pricing() {
  return (
    <section id="pricing" className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-axiom-primaryLight">Honest pricing</p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            A real free core. A fair way to go deeper.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-axiom-textSecondary">
            The streak, daily check-in, breathing, the daily brief, and the panic tools
            are free and stay free. The Protocol opens the depth: the full pattern engine,
            the recovery programs, deeper stats, and more. Try it free for seven days,
            once, no tricks. Cancel in one tap.
          </p>
          <ul className="mt-7 space-y-3">
            {['No fake urgency, ever', 'Price shown honestly, up front', 'One trial per person, no abuse games', 'Cancel any time, keep your data'].map((t) => (
              <li key={t} className="flex items-center gap-3 text-axiom-textPrimary">
                <span className="text-axiom-streak">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="glass-strong relative overflow-hidden rounded-3xl p-8 glow-primary">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-axiom-primaryLight">The Protocol</p>
                <p className="mt-1 text-axiom-textSecondary">Everything, unlocked.</p>
              </div>
              <span className="rounded-full bg-axiom-streak/15 px-3 py-1 text-xs font-semibold text-axiom-streak">7 days free</span>
            </div>
            <div className="my-7 h-px bg-axiom-border" />
            <div className="space-y-3">
              {['The full pattern engine and risk alerts', 'Recovery programs and deeper practice', 'Complete stats and history', 'Everything in the free core, always'].map((t) => (
                <p key={t} className="flex items-start gap-3 text-axiom-textSecondary">
                  <span className="mt-0.5 text-axiom-primaryLight">✓</span>
                  {t}
                </p>
              ))}
            </div>
            <a
              href={PLAY_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 block rounded-full bg-white py-3.5 text-center font-semibold text-axiom-bgDeep transition-transform hover:-translate-y-0.5"
            >
              Start free on Google Play
            </a>
            <p className="mt-3 text-center text-xs text-axiom-textDim">
              Price shown in the app in your currency. Cancel anytime.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── final CTA ────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-44">
      {/* Dawn: the journey from midnight resolves into sunrise. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#241a4d] via-[#0E0B18] to-transparent" />
        <div
          className="absolute -bottom-48 left-1/2 h-[42rem] w-[64rem] -translate-x-1/2 rounded-full opacity-90 blur-[110px]"
          style={{
            background:
              'radial-gradient(closest-side, rgba(255,158,125,0.34), rgba(108,92,231,0.30) 42%, transparent 74%)',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-axiom-streak/45 to-transparent" />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="text-5xl font-semibold leading-[1.02] tracking-[-0.02em] sm:text-7xl">
            Day one starts{' '}
            <span className="bg-gradient-to-r from-axiom-primaryLight via-[#FF9E7D] to-axiom-streak bg-clip-text text-transparent">
              when you decide.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-axiom-textSecondary">
            Not a habit tracker with a counter and a quote. A private, honest system
            for the person you are becoming.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={PLAY_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-axiom-bgDeep transition-transform hover:-translate-y-0.5"
            >
              <Icon.Play className="h-4 w-4" />
              Get it on Google Play
            </a>
            <a
              href={internalUrl('/axiom/ios/')}
              className="flex items-center gap-2 rounded-full border border-axiom-border px-8 py-4 font-medium text-axiom-textSecondary transition-colors hover:border-axiom-primaryLight hover:text-axiom-textPrimary"
            >
              <Icon.Apple className="h-4 w-4" />
              iOS — notify me
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── footer ───────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-axiom-border bg-axiom-bgDeep">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src={internalUrl('/images/axiom/logo.png')}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-lg"
            />
            <span className="font-semibold">AXIOM</span>
          </div>
          <p className="mt-3 text-sm text-axiom-textDim">
            A recovery app by{' '}
            <a href={internalUrl('/')} className="text-axiom-textSecondary underline underline-offset-2 hover:text-axiom-textPrimary">Luna Maze</a>.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-axiom-textSecondary">
          <a href={internalUrl('/axiom/privacy/')} className="transition-colors hover:text-axiom-textPrimary">Privacy</a>
          <a href={internalUrl('/axiom/terms/')} className="transition-colors hover:text-axiom-textPrimary">Terms</a>
          <a href={PLAY_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-axiom-textPrimary">Google Play</a>
        </div>
      </div>
    </footer>
  );
}

export default function AxiomLanding() {
  return (
    <SmoothScroll>
      {/* Fallback base colour — only visible if WebGL is unavailable. */}
      <DawnJourney />
      {/* The living field, behind the WHOLE page and driven by scroll. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <NeuralField className="h-full w-full" />
      </div>
      <Grain />
      {/* overflow-x-CLIP, not hidden: `hidden` turns this into a scroll
          container, which silently kills `position: sticky` for every
          descendant. `clip` contains the same horizontal overflow without
          that side effect. */}
      <main className="relative min-h-screen overflow-x-clip bg-transparent text-axiom-textPrimary">
        <Nav />
        <Hero />
        <Difference />
        <RecoveryPhases />
        <Privacy />
        <Protocol />
        <Pricing />
        <FinalCTA />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
