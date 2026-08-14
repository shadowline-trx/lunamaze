import type { JSX } from 'react';
import Link from 'next/link';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import GradientBlinds from '@/components/backgrounds/GradientBlinds';

/**
 * TypeCrt product page.
 *
 * A focused single-product page for Luna Maze's CRT-styled typing test. The
 * hero sits over an animated `GradientBlinds` WebGL backdrop (phosphor green →
 * amber) that evokes a CRT monitor, followed by a feature grid and a CTA to
 * the live site. Layout, tokens, and accessibility conventions mirror the
 * Luna Maze landing sections.
 */

const TYPECRT_URL = 'https://typecrt.com';

interface Feature {
  readonly title: string;
  readonly description: string;
}

interface Resource {
  readonly title: string;
  readonly description: string;
  readonly href: string;
}

/**
 * Deep links into TypeCrt's documentation and research rather than only the
 * home page. Each of these is a page that answers a question on its own, so
 * they are worth surfacing directly instead of hiding behind a single CTA.
 */
const RESOURCES: ReadonlyArray<Resource> = [
  {
    title: 'The evidence base',
    description:
      'Exact figures from the two largest published typing studies — including the average speed of 51.56 WPM across 168,960 people, and the common claims no research supports.',
    href: `${TYPECRT_URL}/docs/research`,
  },
  {
    title: 'Learn to type',
    description:
      'The beginner path: start on a handful of keys and add the next one when the last one sticks.',
    href: `${TYPECRT_URL}/learn-to-type`,
  },
  {
    title: 'How KeyForge works',
    description:
      'The confidence formula behind adaptive practice, the letter unlock order, and how drill words are generated.',
    href: `${TYPECRT_URL}/docs/keyforge`,
  },
  {
    title: 'Metrics and formulas',
    description:
      'Net WPM, raw WPM, accuracy and consistency written out in full, so any score can be recomputed by hand.',
    href: `${TYPECRT_URL}/docs/metrics`,
  },
];

const FEATURES: ReadonlyArray<Feature> = [
  {
    title: 'No framework in the way',
    description:
      'Built in vanilla TypeScript with no framework and no virtual DOM, so a keystroke updates the character it belongs to and nothing else.',
  },
  {
    title: '80 themes',
    description:
      'From amber phosphor to cool terminal greens, switch the entire palette to match your mood — every one of them documented.',
  },
  {
    title: 'Smart practice',
    description:
      'TypeCrt watches the keys you miss and builds targeted drills so your weak spots get the reps.',
  },
  {
    title: 'Command palette',
    description:
      'Everything is a keystroke away — change modes, themes, and tests without touching the mouse.',
  },
  {
    title: '3-tier profile dashboard',
    description:
      'Track WPM, accuracy, and consistency over time with a layered view of your progress.',
  },
  {
    title: 'Pure TypeScript',
    description:
      'No framework, no bloat. Built from scratch in vanilla TypeScript for a fast, durable core.',
  },
];

export default function TypeCrtPage(): JSX.Element {
  return (
    <main className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <ProductNav product="TypeCrt" cta={{ label: 'Open typecrt.com', href: TYPECRT_URL }} />

      {/* Hero over the CRT blinds backdrop. */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 sm:px-8 lg:px-16">
        <GradientBlinds />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(6,8,26,0) 0%, rgba(6,8,26,0.82) 72%, rgba(6,8,26,1) 100%)',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-lunamaze-violetLight mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-lunamaze-signal" aria-hidden="true" />
            Product 02 · Live
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05]">
            <span className="lunamaze-text-gradient">TypeCrt</span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-lunamaze-textPrimary font-medium max-w-2xl mx-auto">
            A typing test with a CRT soul.
          </p>
          <p className="mt-6 text-base sm:text-lg text-lunamaze-textSecondary max-w-2xl mx-auto leading-relaxed">
            Aesthetic and built in pure TypeScript. 80 themes, smart
            practice on your weak keys, a command palette, and a profile
            dashboard that tracks every gain.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={TYPECRT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-lunamaze-violet px-8 py-4 text-base font-semibold text-lunamaze-bgDeep transition-all duration-300 hover:bg-lunamaze-violetLight hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight lunamaze-glow-violet"
            >
              <span>Try TypeCrt</span>
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-3 rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/40 px-8 py-4 text-base font-semibold text-lunamaze-textPrimary backdrop-blur-sm transition-all duration-300 hover:border-lunamaze-violet/60 hover:bg-lunamaze-bgElevated/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight"
            >
              See features
            </a>
          </div>
        </div>
      </section>

      {/* Feature grid. */}
      <section
        id="features"
        className="relative py-24 sm:py-32 px-6 sm:px-8 lg:px-16 lunamaze-grid-bg lunamaze-noise"
      >
        <div className="relative z-10 max-w-6xl mx-auto">
          <span className="block text-xs uppercase tracking-[0.3em] text-lunamaze-signal mb-4">
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-lunamaze-textPrimary mb-4 max-w-3xl">
            Built for the people who live in the keyboard.
          </h2>
          <p className="text-lg text-lunamaze-textSecondary max-w-2xl mb-16">
            Every detail is tuned for speed and feel — the kind of tool you keep
            open in a tab all day.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm transition-all duration-300 hover:border-lunamaze-violet/60 hover:bg-lunamaze-bgElevated/70 hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold text-lunamaze-textPrimary mb-3">
                  {feature.title}
                </h3>
                <p className="text-base text-lunamaze-textSecondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation deep links. */}
      <section className="relative py-24 sm:py-32 px-6 sm:px-8 lg:px-16">
        <div className="relative z-10 max-w-6xl mx-auto">
          <span className="block text-xs uppercase tracking-[0.3em] text-lunamaze-signal mb-4">
            Documentation
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-lunamaze-textPrimary mb-4 max-w-3xl">
            Nothing here has to be taken on trust.
          </h2>
          <p className="text-lg text-lunamaze-textSecondary max-w-2xl mb-16">
            Every formula is published, every claim about typing in general is
            traced to a peer-reviewed source, and the claims we could not source
            are listed as unsupported rather than quietly repeated.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {RESOURCES.map((resource) => (
              <a
                key={resource.href}
                href={resource.href}
                target="_blank"
                rel="noopener"
                className="group rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm transition-all duration-300 hover:border-lunamaze-violet/60 hover:bg-lunamaze-bgElevated/70 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight"
              >
                <h3 className="text-xl font-semibold text-lunamaze-textPrimary mb-3">
                  {resource.title}
                  <span
                    aria-hidden="true"
                    className="ml-2 inline-block text-lunamaze-violetLight transition-transform duration-300 group-hover:translate-x-1"
                  >
                    ↗
                  </span>
                </h3>
                <p className="text-base text-lunamaze-textSecondary leading-relaxed">
                  {resource.description}
                </p>
              </a>
            ))}
          </div>

          {/* The writing library lives on this domain rather than the product's,
              so it needs a link from here — otherwise the only route to it is
              the sitemap, and no link equity ever reaches it from the page that
              has any. */}
          <div className="mt-10">
            <Link
              href="/typecrt/blog/"
              className="inline-flex items-center gap-2 text-lunamaze-textSecondary underline decoration-lunamaze-border underline-offset-4 transition-colors hover:text-lunamaze-signal"
            >
              Long-form writing on measuring typing speed
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA. */}
      <section className="relative py-24 sm:py-32 px-6 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-lunamaze-textPrimary mb-6">
            Find your real speed.
          </h2>
          <p className="text-lg text-lunamaze-textSecondary max-w-2xl mx-auto mb-10">
            No sign-up wall, no clutter. Open it and start typing.
          </p>
          <a
            href={TYPECRT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-lunamaze-violet px-8 py-4 text-base font-semibold text-lunamaze-bgDeep transition-all duration-300 hover:bg-lunamaze-violetLight hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight lunamaze-glow-violet"
          >
            <span>Open typecrt.com</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <LunaFooter />
    </main>
  );
}
