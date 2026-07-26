import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import AuroraField from '@/components/lunamaze/AuroraField';
import SeverityTest from './SeverityTest';

/**
 * /axiom/tools/severity-test/ — anonymous severity self-test.
 * Target queries: "am i addicted to porn quiz/test", "porn addiction test",
 * "how bad is my porn habit". The SERP is owned by salesy rehab centers;
 * this page's angle is the opposite: free, anonymous, honest, no upsell wall.
 */

const CANONICAL = 'https://lunamaze.com/axiom/tools/severity-test/';

export const metadata: Metadata = {
  title: 'Am I Addicted to Porn? Free 2-Minute Self-Test (Anonymous, No Sign-Up)',
  description:
    'An honest 18-question self-test: get your Compulsion Load score and Dopamine Age in 2 minutes. Runs entirely in your browser — answers are never sent or stored.',
  alternates: { canonical: CANONICAL },
};

const FAQ = [
  {
    q: 'Is this test really anonymous?',
    a: 'Yes — in the strictest sense. The whole test runs inside your browser: your answers are never transmitted, never stored, and disappear when you close the tab. There is no sign-up, no email gate, and no result held hostage behind a paywall.',
  },
  {
    q: 'Is this a medical diagnosis?',
    a: 'No. It is a structured self-reflection tool. No online quiz can diagnose an addiction — only a qualified clinician can do that. What the score gives you is an honest mirror: how much of the classic compulsion pattern shows up in your own answers. If you are in real distress, talk to a doctor or therapist.',
  },
  {
    q: 'What is a Dopamine Age?',
    a: 'The same score drawn on an age axis — a playful way to talk about the number without naming the topic. A heavily loaded reward system behaves like a tired one, so the heavier your pattern, the "older" your Dopamine Age. It is an illustration, not a medical measurement, and it recovers as you do.',
  },
  {
    q: 'What does my score actually mean?',
    a: 'The score counts how many signature marks of a compulsive loop show up in your answers — loss of control, escalation, mood cost, interference with sleep and life — and how often. Under 25 means little of the pattern is present; 25–49 a real but moderate pattern; 50–74 most of the signature marks; 75+ a loop carrying serious weight. Each band comes with an honest read and a realistic recovery timeline.',
  },
];

function jsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Porn Addiction Severity Self-Test',
        url: CANONICAL,
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description:
          'Free, anonymous 18-question self-test producing a Compulsion Load score and Dopamine Age. Runs entirely client-side.',
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

export default function SeverityTestPage(): JSX.Element {
  return (
    <main className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLd() }}
      />
      <ProductNav product="Axiom" />

      <header className="relative overflow-hidden px-6 sm:px-8 lg:px-16 pt-32 pb-12 lunamaze-noise">
        <AuroraField accent="#7B5CFF" accentAlt="#A48CFF" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-lunamaze-violet/40 bg-lunamaze-violet/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-lunamaze-violetLight mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-lunamaze-violetLight" aria-hidden="true" />
            Free tool · Anonymous
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.03]">
            How heavy is the habit, <span className="lunamaze-text-gradient">honestly?</span>
          </h1>
          <p className="mt-6 text-lg text-lunamaze-textSecondary leading-relaxed">
            {
              'Most "porn addiction tests" online exist to funnel you into a $30,000 program. This one exists to give you an honest number. 18 questions, 2 minutes, no sign-up — and your answers never leave your browser.'
            }
          </p>
        </div>
      </header>

      <section className="relative px-6 sm:px-8 lg:px-16 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <SeverityTest />
        </div>
      </section>

      <section className="relative px-6 sm:px-8 lg:px-16 pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold">Common questions</h2>
          <div className="mt-6 space-y-6">
            {FAQ.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-6 backdrop-blur-sm"
              >
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-lunamaze-textSecondary leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-lunamaze-textSecondary">
            Want the full picture first?{' '}
            <Link
              href="/axiom/blog/"
              className="underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-signal"
            >
              Read the Recovery Library
            </Link>{' '}
            — honest articles on the rewiring timeline, the flatline, and night urges, in 12
            languages.
          </p>
        </div>
      </section>

      <LunaFooter />
    </main>
  );
}
