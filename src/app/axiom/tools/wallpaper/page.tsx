import type { Metadata } from 'next';
import type { JSX } from 'react';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import AuroraField from '@/components/lunamaze/AuroraField';
import WallpaperGenerator from './WallpaperGenerator';

/**
 * /axiom/tools/wallpaper/ — free streak wallpaper generator. Target queries:
 * "streak wallpaper", "day counter wallpaper". The artifact is topic-silent
 * by design: it shows only a day count, so it shares anywhere.
 */

const CANONICAL = 'https://lunamaze.com/axiom/tools/wallpaper/';

export const metadata: Metadata = {
  title: 'Free Streak Wallpaper Generator — Abstract Art for Your Day Count',
  description:
    'Turn your streak into an abstract phone wallpaper: pick your day count and style, download the PNG. Topic-silent by design — generated entirely in your browser.',
  alternates: { canonical: CANONICAL },
};

function jsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Streak Wallpaper Generator',
    url: CANONICAL,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Free generator that renders an abstract phone wallpaper from a day count. Runs entirely client-side.',
  });
}

export default function WallpaperPage(): JSX.Element {
  return (
    <main className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLd() }}
      />
      <ProductNav product="Axiom" />

      <header className="relative overflow-hidden px-6 sm:px-8 lg:px-16 pt-32 pb-10 lunamaze-noise">
        <AuroraField accent="#A48CFF" accentAlt="#00D2FF" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-lunamaze-violetLight/40 bg-lunamaze-violetLight/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-lunamaze-violetLight mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-lunamaze-violetLight" aria-hidden="true" />
            Free tool · Anonymous
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.03]">
            Your streak, as <span className="lunamaze-text-gradient">art.</span>
          </h1>
          <p className="mt-6 text-lg text-lunamaze-textSecondary leading-relaxed max-w-2xl">
            {
              'A lock screen that quietly reminds you what you’re building — and shares to any chat without saying a word about what the number counts. Pick your day, pick a style, download.'
            }
          </p>
        </div>
      </header>

      <section className="relative px-6 sm:px-8 lg:px-16 pb-20">
        <div className="max-w-4xl mx-auto">
          <WallpaperGenerator />
        </div>
      </section>

      <LunaFooter />
    </main>
  );
}
