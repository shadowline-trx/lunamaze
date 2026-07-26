import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import AuroraField from '@/components/lunamaze/AuroraField';
import ToolCard, { type ToolCardProps } from '@/components/lunamaze/ToolCard';

/**
 * /axiom/tools/ — free tools hub. Every tool is genuinely free, anonymous,
 * and runs client-side.
 *
 * Each tool carries its own accent so the emergency one never looks like the
 * toy one. Colours are semantic, not decorative: violet reads as the diagnostic
 * spine, cyan as time and progression, amber as urgency.
 */

export const metadata: Metadata = {
  title: 'Free Recovery Tools — Anonymous, No Sign-Up | Axiom',
  description:
    'Free, anonymous tools for quitting porn: a 2-minute severity self-test with your Dopamine Age, a rewire timeline calculator, an urge panic button, and a streak wallpaper generator. Everything runs in your browser — nothing is sent or stored.',
  alternates: { canonical: 'https://lunamaze.com/axiom/tools/' },
};

const TOOLS: readonly ToolCardProps[] = [
  {
    href: '/axiom/tools/severity-test/',
    title: 'Severity Self-Test',
    description:
      'How heavy is the habit, honestly? 18 questions, 2 minutes. Get your Compulsion Load score, your Dopamine Age, and a realistic recovery timeline for your band — with no upsell wall in front of the result.',
    meta: ['2 min', 'anonymous', 'runs in your browser'],
    accent: '#7B5CFF',
    accentAlt: '#A48CFF',
  },
  {
    href: '/axiom/tools/rewire-calculator/',
    title: 'Rewire Timeline Calculator',
    description:
      'Three questions about your history, then a day-by-day recovery map stretched to your situation: the loud start, the flatline window, first returns, day 90 and beyond. Ranges, not promises.',
    meta: ['1 min', 'anonymous', 'runs in your browser'],
    accent: '#00D2FF',
    accentAlt: '#7B5CFF',
  },
  {
    href: '/axiom/tools/panic/',
    title: 'Panic Button',
    description:
      'For the moment the urge is up: a breathing pacer, a ten-minute ride-it-out timer, and a grounding sequence. Bookmark it, or send it to a friend who is struggling. No account, no judgment.',
    meta: ['for urge emergencies', 'anonymous', 'works instantly'],
    accent: '#FFD27A',
    accentAlt: '#FF9E7A',
  },
  {
    href: '/axiom/tools/wallpaper/',
    title: 'Streak Wallpaper Generator',
    description:
      'Abstract art for your day count: a lock screen that reminds you what you are building, and shares to any chat without naming the topic. Three styles, PNG download.',
    meta: ['instant', 'anonymous', 'runs in your browser'],
    accent: '#A48CFF',
    accentAlt: '#00D2FF',
  },
];

export default function ToolsHubPage(): JSX.Element {
  return (
    <main className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <ProductNav product="Axiom" />

      <header className="relative overflow-hidden px-6 sm:px-8 lg:px-16 pt-32 pb-14 lunamaze-noise">
        <AuroraField accent="#7B5CFF" accentAlt="#00D2FF" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-lunamaze-violet/40 bg-lunamaze-violet/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-lunamaze-violetLight mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-lunamaze-violetLight" aria-hidden="true" />
            Free tools
          </span>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.02]">
            <span className="lunamaze-text-gradient">Useful. Free. Anonymous.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-lunamaze-textSecondary leading-relaxed max-w-2xl">
            No sign-up, no email gate, no result held hostage. Every tool here runs entirely
            in your browser, and nothing you enter is sent or stored anywhere.
          </p>
        </div>
      </header>

      <section className="relative px-6 sm:px-8 lg:px-16 pb-20">
        <div className="max-w-3xl mx-auto grid gap-6 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-3xl text-sm text-lunamaze-textSecondary">
          Prefer reading first?{' '}
          <Link
            href="/axiom/blog/"
            className="underline decoration-lunamaze-violet/50 underline-offset-4 hover:text-lunamaze-violetLight"
          >
            The Recovery Library
          </Link>{' '}
          covers the honest rewiring timeline, the flatline, and night urges, in 12 languages.
        </p>
      </section>

      <LunaFooter />
    </main>
  );
}
