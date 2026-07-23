import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';

/**
 * /axiom/tools/ — free tools hub. Every tool is genuinely free, anonymous,
 * and runs client-side; the hub grows as tools ship (severity test first,
 * rewire calculator and panic button next).
 */

export const metadata: Metadata = {
  title: 'Free Recovery Tools — Anonymous, No Sign-Up | Axiom',
  description:
    'Free, anonymous tools for quitting porn: a 2-minute severity self-test with your Dopamine Age, and more coming. Everything runs in your browser — nothing is sent or stored.',
  alternates: { canonical: 'https://lunamaze.com/axiom/tools/' },
};

export default function ToolsHubPage(): JSX.Element {
  return (
    <main className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <ProductNav product="Axiom" />

      <header className="relative overflow-hidden px-6 sm:px-8 lg:px-16 pt-32 pb-16 lunamaze-grid-bg lunamaze-noise">
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-lunamaze-signal mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-lunamaze-signal" aria-hidden="true" />
            Free tools
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">
            <span className="lunamaze-text-gradient">Useful. Free. Anonymous.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-lunamaze-textSecondary leading-relaxed">
            {
              'No sign-up, no email gate, no result held hostage. Every tool here runs entirely in your browser — nothing you enter is sent or stored anywhere.'
            }
          </p>
        </div>
      </header>

      <section className="relative px-6 sm:px-8 lg:px-16 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <article className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold leading-snug">
              <Link
                href="/axiom/tools/severity-test/"
                className="hover:text-lunamaze-signal transition-colors"
              >
                Severity Self-Test
              </Link>
            </h2>
            <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
              How heavy is the habit, honestly? 18 questions, 2 minutes. Get your Compulsion
              Load score, your Dopamine Age, and a realistic recovery timeline for your band —
              with no upsell wall in front of the result.
            </p>
            <p className="mt-4 text-sm text-lunamaze-textDim">2 min · anonymous · runs in your browser</p>
          </article>

          <article className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold leading-snug">
              <Link
                href="/axiom/tools/rewire-calculator/"
                className="hover:text-lunamaze-signal transition-colors"
              >
                Rewire Timeline Calculator
              </Link>
            </h2>
            <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
              Three questions about your history → a day-by-day recovery map stretched to your
              situation: the loud start, the flatline window, first returns, day 90 and beyond.
              Ranges, not promises.
            </p>
            <p className="mt-4 text-sm text-lunamaze-textDim">1 min · anonymous · runs in your browser</p>
          </article>

          <article className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold leading-snug">
              <Link
                href="/axiom/tools/panic/"
                className="hover:text-lunamaze-signal transition-colors"
              >
                Panic Button
              </Link>
            </h2>
            <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
              For the moment the urge is up: a breathing pacer, a ten-minute ride-it-out timer,
              and a grounding sequence. Bookmark it, or send it to a friend who’s struggling —
              no account, no judgment.
            </p>
            <p className="mt-4 text-sm text-lunamaze-textDim">for urge emergencies · anonymous · works instantly</p>
          </article>

          <article className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/40 p-8">
            <h2 className="text-xl font-bold leading-snug text-lunamaze-textSecondary">
              Coming next
            </h2>
            <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
              A streak wallpaper generator — abstract art for your day count that shares to any
              chat without naming the topic. Same rules: free, anonymous, in-browser.
            </p>
          </article>

          <p className="text-sm text-lunamaze-textSecondary">
            Prefer reading first?{' '}
            <Link
              href="/axiom/blog/"
              className="underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-signal"
            >
              The Recovery Library
            </Link>{' '}
            covers the honest rewiring timeline, the flatline, and night urges — in 12 languages.
          </p>
        </div>
      </section>

      <LunaFooter />
    </main>
  );
}
