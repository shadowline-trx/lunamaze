import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import AuroraField from '@/components/lunamaze/AuroraField';
import RewireCalculator from './RewireCalculator';

/**
 * /axiom/tools/rewire-calculator/ — interactive rewire timeline calculator.
 * Target queries: "porn reboot timeline calculator", "how long to reboot",
 * "rewire timeline". Competitors farm this topic with static blog posts;
 * an interactive, history-adjusted map beats them.
 *
 * Visual identity: cyan is the site's colour for time and progression, so this
 * page carries it end to end — the hero aurora, the eyebrow, the card edges.
 * The old grid-bg hero plus #22264A borders rendered as a flat wall of
 * identical rectangles; the accent borders below give every surface a real
 * edge on #06081A, which the token border never had.
 */

const CANONICAL = 'https://lunamaze.com/axiom/tools/rewire-calculator/';

export const metadata: Metadata = {
  title: 'Rewire Timeline Calculator — Your Day-by-Day Reboot Map (Free, Anonymous)',
  description:
    'Three questions about your history → a day-by-day recovery map: the loud phase, the flatline window, first returns, day 90 and beyond. Runs entirely in your browser.',
  alternates: { canonical: CANONICAL },
};

const FAQ = [
  {
    q: 'How accurate is this calculator?',
    a: 'It is honest rather than precise. The ranges are scaled from commonly reported recovery arcs using a load factor built from your history — length, intensity, and age. No calculator, course, or app can name your exact date, because recovery depends on sleep, stress, and brain-lottery factors nobody fully understands. What this map gives you is the reliable part: the shape and order of the stages, stretched to your situation.',
  },
  {
    q: 'Why does my timeline show a "flatline risk window"?',
    a: 'Because the flatline — a stretch of near-zero libido and gray mood a few weeks in — is the stage that ends more recovery attempts than urges do, almost always because nobody warned the person it was coming. It is the trough of recalibration, not damage, and it ends. Knowing the window in advance is most of the defense.',
  },
  {
    q: 'Is the 90-day reboot scientifically proven?',
    a: 'No controlled study validates 90 days as a universal rewiring period. It began as a community convention and survives because it is a reasonable mid-course landmark. Lighter users often feel normal sooner; heavy long-term users often need considerably longer. The calculator treats day 90 as a marker on the road, never as the destination.',
  },
  {
    q: 'What happens to my timeline if I relapse?',
    a: 'A single slip does not erase weeks of recalibration — the pathways you weakened do not rebuild from one event. What genuinely sets people back is the shame-driven binge spiral afterwards, and the chaser effect makes the following 48 hours the real danger. One slip, logged honestly and followed by a normal day, moves your map far less than you fear.',
  },
];

function jsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Rewire Timeline Calculator',
        url: CANONICAL,
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description:
          'Free, anonymous calculator that turns your habit history into a day-by-day recovery milestone map. Runs entirely client-side.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  });
}

/** Page accent = cyan (time / progression), matching this tool's hub card. */
const ACCENT_RGB = '0, 210, 255';

export default function RewireCalculatorPage(): JSX.Element {
  return (
    <main className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLd() }}
      />
      <ProductNav product="Axiom" />

      <header className="relative overflow-hidden px-6 sm:px-8 lg:px-16 pt-32 pb-10 lunamaze-noise">
        <AuroraField accent="#00D2FF" accentAlt="#7B5CFF" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-axiom-calm/40 bg-axiom-calm/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-axiom-calm mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-axiom-calm" aria-hidden="true" />
            Free tool · Anonymous
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.03]">
            Your rewiring timeline, <span className="lunamaze-text-gradient">day by day.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-lunamaze-textSecondary leading-relaxed max-w-2xl">
            {
              'The recovery arc has a known shape — the loud start, the flatline, the returns — but its length depends on your history. Answer three questions and get the map stretched to yours. No promises, no sign-up, and nothing you select leaves your browser.'
            }
          </p>
        </div>
      </header>

      <section className="relative px-6 sm:px-8 lg:px-16 pt-4 pb-14 sm:pt-6 sm:pb-16">
        <div className="max-w-3xl mx-auto">
          <RewireCalculator />
        </div>
      </section>

      <section className="relative px-6 sm:px-8 lg:px-16 pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Common questions</h2>
          <span
            aria-hidden="true"
            className="mt-4 block h-px w-24"
            style={{ background: `linear-gradient(90deg, rgba(${ACCENT_RGB}, 0.8), transparent)` }}
          />
          <div className="mt-6 space-y-4">
            {FAQ.map((f) => (
              <div
                key={f.q}
                className="relative overflow-hidden rounded-3xl border p-6 sm:p-7 backdrop-blur-sm"
                style={{
                  borderColor: `rgba(${ACCENT_RGB}, 0.22)`,
                  background: `linear-gradient(150deg, rgba(${ACCENT_RGB}, 0.06) 0%, rgba(18, 23, 55, 0.7) 55%)`,
                }}
              >
                {/* Vertical hairline instead of another top band: the FAQ should
                    read as a quieter tier than the result cards above. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-px"
                  style={{
                    background: `linear-gradient(to bottom, transparent, rgba(${ACCENT_RGB}, 0.55), transparent)`,
                  }}
                />
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-lunamaze-textSecondary leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-lunamaze-textSecondary">
            The full written version, with sources and the honest caveats:{' '}
            <Link
              href="/axiom/blog/en/rewire-timeline/"
              className="underline decoration-axiom-calm/50 underline-offset-4 hover:text-axiom-calm"
            >
              How long does it take to rewire your brain?
            </Link>
          </p>
        </div>
      </section>

      <LunaFooter />
    </main>
  );
}
