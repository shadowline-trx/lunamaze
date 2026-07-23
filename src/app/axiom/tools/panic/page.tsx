import type { Metadata } from 'next';
import type { JSX } from 'react';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import PanicButton from './PanicButton';

/**
 * /axiom/tools/panic/ — urge-emergency page. Target queries: "urge to relapse
 * right now", "how to stop an urge", "panic button porn urge". Captures the
 * single highest-intent moment in the niche; deliberately serves first and
 * sells almost nothing.
 */

const CANONICAL = 'https://lunamaze.com/axiom/tools/panic/';

export const metadata: Metadata = {
  title: 'Panic Button — Get Through the Next 10 Minutes (Free, No Account)',
  description:
    'An urge is a wave: it crests and passes in 10–20 minutes. A breathing pacer, a ride-it-out timer, and a grounding sequence — free, anonymous, nothing leaves your browser.',
  alternates: { canonical: CANONICAL },
};

function jsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Urge Panic Button',
    url: CANONICAL,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Free urge-emergency page: breathing pacer, 10-minute ride-it-out timer, and 5-4-3-2-1 grounding. Runs entirely client-side, no account.',
  });
}

export default function PanicPage(): JSX.Element {
  return (
    <main className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLd() }}
      />
      <ProductNav product="Axiom" />

      <header className="relative overflow-hidden px-6 sm:px-8 lg:px-16 pt-32 pb-10 lunamaze-grid-bg lunamaze-noise">
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-lunamaze-signal mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-lunamaze-signal" aria-hidden="true" />
            Urge emergency
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
            You’re here. <span className="lunamaze-text-gradient">That was the hard part.</span>
          </h1>
          <p className="mt-6 text-lg text-lunamaze-textSecondary leading-relaxed">
            {
              'Opening this page instead of the other tab is already a decision in the right direction. Nothing here needs an account, nothing is tracked, and nothing you do on this page leaves your browser.'
            }
          </p>
        </div>
      </header>

      <section className="relative px-6 sm:px-8 lg:px-16 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto">
          <PanicButton />
        </div>
      </section>

      <LunaFooter />
    </main>
  );
}
