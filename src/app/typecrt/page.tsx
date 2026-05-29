import type { JSX } from 'react';
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

const TYPECRT_URL = 'https://www.typecrt.in';

interface Feature {
  readonly title: string;
  readonly description: string;
}

const FEATURES: ReadonlyArray<Feature> = [
  {
    title: 'Zero-latency engine',
    description:
      'A smooth caret engine renders every keystroke instantly — no input lag between you and the page.',
  },
  {
    title: '50+ themes',
    description:
      'From amber phosphor to cool terminal greens, switch the entire palette to match your mood.',
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
      <ProductNav product="TypeCrt" cta={{ label: 'Open typecrt.in', href: TYPECRT_URL }} />

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
            A zero-latency typing test with a CRT soul.
          </p>
          <p className="mt-6 text-base sm:text-lg text-lunamaze-textSecondary max-w-2xl mx-auto leading-relaxed">
            Aesthetic, fast, and built in pure TypeScript. 50+ themes, smart
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
            <span>Open typecrt.in</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <LunaFooter />
    </main>
  );
}
