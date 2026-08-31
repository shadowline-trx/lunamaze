'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const LazyLunaConstellation = dynamic(() => import('./LunaConstellation'), {
  ssr: false,
});
const LazyDotGrid = dynamic(() => import('@/components/backgrounds/DotGrid'), {
  ssr: false,
});

interface LunaHeroProps {
  readonly title?: string;
  readonly tagline?: string;
  readonly intro?: string;
}

const DEFAULT_TITLE = 'Luna Maze';
const DEFAULT_TAGLINE = 'A studio for the work that lasts.';
const DEFAULT_INTRO =
  'Independent product studio building premium tools at the intersection of cognition, focus, and craft. Founder-led, considered, and quiet on purpose.';

/**
 * Luna Maze hero section.
 *
 * Full-viewport landing canvas (≥ md breakpoint) that pairs an animated
 * `<LunaConstellation />` motif behind the content with a centered
 * foreground stack: an "Independent Product Studio" eyebrow badge, the
 * gradient studio title, a one-line tagline, a positioning paragraph,
 * and a primary `#contact` CTA plus a secondary `#products` link.
 *
 * Composition notes:
 *   - The constellation is absolutely positioned in a `z-0` background
 *     layer so it never intercepts pointer events on the foreground.
 *   - A radial-gradient overlay deepens the edges of the section to
 *     keep the title legible against the constellation.
 *   - The foreground stack lives in a `z-10` container that tops out at
 *     `max-w-5xl` so headlines never sprawl on ultrawide viewports.
 *   - A subtle scroll indicator sits at the bottom edge.
 *
 * Client component because the background `<LunaConstellation />`
 * relies on GSAP hooks that must mount in the browser.
 */
export default function LunaHero({
  title = DEFAULT_TITLE,
  tagline = DEFAULT_TAGLINE,
  intro = DEFAULT_INTRO,
}: LunaHeroProps): JSX.Element {
  const [showInteractiveBackground, setShowInteractiveBackground] =
    useState(false);

  useEffect(() => {
    const query = window.matchMedia(
      '(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    const sync = (): void => setShowInteractiveBackground(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return (
    <section
      id="hero"
      className="lunamaze-grid-bg relative min-h-[100svh] flex items-center justify-center overflow-hidden px-5 pb-24 pt-28 sm:px-8 sm:pb-28 sm:pt-32 lg:px-16"
    >
      {showInteractiveBackground && (
        <>
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            <LazyDotGrid gap={38} dotRadius={1.2} influence={140} />
          </div>
          <div className="absolute inset-0 z-0 opacity-90 pointer-events-none">
            <LazyLunaConstellation
              nodeCount={20}
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </>
      )}

      {/* Subtle radial overlay to deepen edges */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(10,14,39,0) 0%, rgba(6,8,26,0.85) 75%, rgba(6,8,26,1) 100%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/75 px-3.5 py-2 text-[0.65rem] uppercase tracking-[0.24em] text-lunamaze-violetLight sm:px-4 sm:text-xs sm:tracking-[0.3em] mb-7 sm:mb-8">
          <span
            className="w-1.5 h-1.5 rounded-full bg-lunamaze-signal"
            aria-hidden="true"
          />
          Independent Product Studio
        </span>

        <h1 className="text-[clamp(3rem,15vw,4.5rem)] sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.02]">
          <span className="lunamaze-text-gradient">{title}</span>
        </h1>

        <p className="mt-5 sm:mt-6 text-lg sm:text-2xl text-lunamaze-textPrimary font-medium max-w-3xl mx-auto">
          {tagline}
        </p>

        <p className="mt-6 text-base sm:text-lg text-lunamaze-textSecondary max-w-2xl mx-auto leading-relaxed">
          {intro}
        </p>

        <div className="mt-9 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
          <a
            href="#contact"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-lunamaze-violet px-8 py-3 text-base font-semibold text-lunamaze-bgDeep transition-all duration-300 hover:bg-lunamaze-violetLight motion-safe:hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight lunamaze-glow-violet"
          >
            <span>Get in touch</span>
            <span aria-hidden="true">→</span>
          </a>
          <a
            href="#products"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/70 px-8 py-3 text-base font-semibold text-lunamaze-textPrimary sm:backdrop-blur-sm transition-all duration-300 hover:border-lunamaze-violet/60 hover:bg-lunamaze-bgElevated/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight"
          >
            See products
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <div className="w-6 h-10 rounded-full border-2 border-lunamaze-border flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-lunamaze-violetLight animate-bounce" />
        </div>
      </div>
    </section>
  );
}
