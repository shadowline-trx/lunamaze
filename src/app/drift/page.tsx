import type { JSX } from 'react';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import Beams from '@/components/backgrounds/Beams';

/**
 * Drift product page.
 *
 * A teaser page for Luna Maze's in-development precision puzzle game. The hero
 * sits over an animated `Beams` WebGL backdrop (violet → gold light streaks)
 * that suggests motion and precision. Because Drift is in closed testing (not
 * publicly downloadable yet), the page is honest about status and offers a
 * "request access" mailto rather than a fake store link.
 *
 * Layout, tokens, and accessibility conventions mirror the Luna Maze landing.
 */

const CONTACT_EMAIL = 'lunamaze.dev@gmail.com';
const ACCESS_MAILTO = `mailto:${CONTACT_EMAIL}?subject=Drift%20closed%20test%20access`;

interface Pillar {
  readonly title: string;
  readonly description: string;
}

const PILLARS: ReadonlyArray<Pillar> = [
  {
    title: 'Precision over speed',
    description:
      'Every level rewards control and timing, not frantic tapping. The challenge is in the exactness.',
  },
  {
    title: 'Calm by design',
    description:
      'A quiet palette and unhurried pacing make Drift a place to focus, not a slot machine for your attention.',
  },
  {
    title: 'Handcrafted levels',
    description:
      'Each puzzle is authored and tuned by hand — no procedural filler, no padding.',
  },
];

export default function DriftPage(): JSX.Element {
  return (
    <main className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <ProductNav product="Drift" cta={{ label: 'Request test access', href: ACCESS_MAILTO }} />

      {/* Hero over the beams backdrop. */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 sm:px-8 lg:px-16">
        <Beams />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(6,8,26,0) 0%, rgba(6,8,26,0.8) 72%, rgba(6,8,26,1) 100%)',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-lunamaze-signal mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-lunamaze-signal" aria-hidden="true" />
            Product 03 · Closed testing
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05]">
            <span className="lunamaze-text-gradient">Drift</span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-lunamaze-textPrimary font-medium max-w-2xl mx-auto">
            A precision puzzle game about timing and control.
          </p>
          <p className="mt-6 text-base sm:text-lg text-lunamaze-textSecondary max-w-2xl mx-auto leading-relaxed">
            Drift is in closed testing on the Google Play Console — paused
            mid-build while we shipped Axiom and TypeCrt first. We&apos;re
            returning to it next. Want an early look?
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={ACCESS_MAILTO}
              className="inline-flex items-center gap-3 rounded-full bg-lunamaze-violet px-8 py-4 text-base font-semibold text-lunamaze-bgDeep transition-all duration-300 hover:bg-lunamaze-violetLight hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight lunamaze-glow-violet"
            >
              <span>Request test access</span>
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-3 rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/40 px-8 py-4 text-base font-semibold text-lunamaze-textPrimary backdrop-blur-sm transition-all duration-300 hover:border-lunamaze-violet/60 hover:bg-lunamaze-bgElevated/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* Design pillars. */}
      <section
        id="about"
        className="relative py-24 sm:py-32 px-6 sm:px-8 lg:px-16 lunamaze-grid-bg lunamaze-noise"
      >
        <div className="relative z-10 max-w-6xl mx-auto">
          <span className="block text-xs uppercase tracking-[0.3em] text-lunamaze-signal mb-4">
            The idea
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-lunamaze-textPrimary mb-4 max-w-3xl">
            A puzzle game that respects your attention.
          </h2>
          <p className="text-lg text-lunamaze-textSecondary max-w-2xl mb-16">
            Drift is built on the same studio principles as everything else
            from Luna Maze — depth over noise, craft over churn.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm transition-all duration-300 hover:border-lunamaze-violet/60 hover:bg-lunamaze-bgElevated/70 hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold text-lunamaze-textPrimary mb-3">
                  {pillar.title}
                </h3>
                <p className="text-base text-lunamaze-textSecondary leading-relaxed">
                  {pillar.description}
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
            Be first into the maze.
          </h2>
          <p className="text-lg text-lunamaze-textSecondary max-w-2xl mx-auto mb-10">
            Closed testing slots are limited. Drop the studio a line and
            we&apos;ll add you to the next build.
          </p>
          <a
            href={ACCESS_MAILTO}
            className="inline-flex items-center gap-3 rounded-full bg-lunamaze-violet px-8 py-4 text-base font-semibold text-lunamaze-bgDeep transition-all duration-300 hover:bg-lunamaze-violetLight hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight lunamaze-glow-violet"
          >
            <span>Request test access</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <LunaFooter />
    </main>
  );
}
