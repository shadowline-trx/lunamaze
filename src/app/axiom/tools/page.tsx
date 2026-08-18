import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import { internalUrl } from '@/lib/paths';

/**
 * /axiom/tools/ — free tools hub. Every tool is genuinely free, anonymous,
 * and runs client-side.
 *
 * Restyled 2026-08-03 to the AXIOM v3 "Silver Studio" language: static CSS
 * stage, minimal fixed nav, quiet ax-card surfaces with mono meta lines. The
 * per-tool aurora accents of the old hub are gone on purpose — on the silver
 * stage the tools read as one instrument set, and the panic tool earns its
 * urgency from its copy, not its colour.
 */

export const metadata: Metadata = {
  title: 'Free Recovery Tools — Anonymous, No Sign-Up | Axiom',
  description:
    'Free, anonymous tools for quitting porn: a 2-minute severity self-test with your Dopamine Age, a rewire timeline calculator, an urge panic button, and a streak wallpaper generator. Everything runs in your browser — nothing is sent or stored.',
  alternates: { canonical: 'https://lunamaze.com/axiom/tools/' },
};

const MONO = 'ax-mono';

interface Tool {
  readonly href: string;
  readonly title: string;
  readonly description: string;
  readonly meta: ReadonlyArray<string>;
}

const TOOLS: ReadonlyArray<Tool> = [
  {
    href: '/axiom/tools/severity-test/',
    title: 'Severity Self-Test',
    description:
      'How heavy is the habit, honestly? 18 questions, 2 minutes. Get your Compulsion Load score, your Dopamine Age, and a realistic recovery timeline for your band — with no upsell wall in front of the result.',
    meta: ['2 min', 'anonymous', 'runs in your browser'],
  },
  {
    href: '/axiom/tools/rewire-calculator/',
    title: 'Rewire Timeline Calculator',
    description:
      'Three questions about your history, then a day-by-day recovery map stretched to your situation: the loud start, the flatline window, first returns, day 90 and beyond. Ranges, not promises.',
    meta: ['1 min', 'anonymous', 'runs in your browser'],
  },
  {
    href: '/axiom/tools/panic/',
    title: 'Panic Button',
    description:
      'For the moment the urge is up: a breathing pacer, a ten-minute ride-it-out timer, and a grounding sequence. Bookmark it, or send it to a friend who is struggling. No account, no judgment.',
    meta: ['for urge emergencies', 'anonymous', 'works instantly'],
  },
  {
    href: '/axiom/tools/wallpaper/',
    title: 'Streak Wallpaper Generator',
    description:
      'Abstract art for your day count: a lock screen that reminds you what you are building, and shares to any chat without naming the topic. Three styles, PNG download.',
    meta: ['instant', 'anonymous', 'runs in your browser'],
  },
];

export default function ToolsHubPage(): JSX.Element {
  return (
    <div className="axiom-v3 relative min-h-screen">
      {/* Static stage: same look as the main landing, zero JS cost. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 0%, #131318 0%, #0a0a0d 52%, #070709 100%)',
          }}
        />
        <div className="ax-cage absolute inset-0" />
        <div className="ax-shafts" />
      </div>

      {/* Minimal nav */}
      <header
        className="fixed inset-x-0 top-0 z-50"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,13,0.72), transparent)' }}
      >
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/axiom/" className="flex items-center gap-3">
            <img
              src={internalUrl('/images/axiom/logo.webp')}
              alt=""
              width={34}
              height={34}
              className="h-[34px] w-[34px] rounded-xl"
            />
            <span className={`${MONO} text-sm font-medium tracking-[0.34em] text-[#e8e6f0]`}>
              AXIOM
            </span>
          </Link>
          <Link
            href="/axiom/"
            className={`${MONO} text-[11px] uppercase tracking-[0.22em] text-[#9b98ad] transition-colors hover:text-[#e8e6f0]`}
          >
            ← The full story
          </Link>
        </nav>
      </header>

      <main className="relative mx-auto max-w-3xl px-4 pb-28 pt-28 sm:px-6 sm:pt-36">
        {/* Hero */}
        <div
          className={`${MONO} mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-black/30 px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[#9b98ad] backdrop-blur-md`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#7ef7c2] shadow-[0_0_12px_rgba(126,247,194,0.8)]" />
          Free tools
        </div>
        <h1 className="text-[clamp(2.4rem,6vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-[#f2f1f7]">
          Useful. Free.
          <br />
          <span className="ax-serif ax-grad-violet pr-1 font-normal">Anonymous.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#a6a3b8]">
          No sign-up, no email gate, no result held hostage. Every tool here runs entirely
          in your browser, and nothing you enter is sent or stored anywhere.
        </p>

        {/* The tools */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-6">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="ax-card group block h-full p-7 transition-colors hover:border-[#8b7cf7]/50"
            >
              <h2 className="text-lg font-semibold text-[#f2f1f7] transition-colors group-hover:text-[#cdc7ee]">
                {tool.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#a6a3b8]">
                {tool.description}
              </p>
              <p className={`${MONO} mt-5 text-[10px] uppercase tracking-[0.18em] text-[#8f8ca1]`}>
                {tool.meta.join(' · ')}
              </p>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-sm leading-relaxed text-[#a6a3b8]">
          Have questions about the science, timelines, or privacy? Read our{' '}
          <Link
            href="/axiom/faq/"
            className="text-[#c9c6d8] underline decoration-[#8b7cf7]/50 underline-offset-4 transition-colors hover:text-[#e8e6f0]"
          >
            Evidence-Based FAQ
          </Link>{' '}
          or explore{' '}
          <Link
            href="/axiom/blog/"
            className="text-[#c9c6d8] underline decoration-[#8b7cf7]/50 underline-offset-4 transition-colors hover:text-[#e8e6f0]"
          >
            The Recovery Library
          </Link>{' '}
          for deep dives on the rewiring timeline, flatline, and night urges.
        </p>
      </main>

      <footer className="relative border-t border-white/[0.06] bg-[#08080a] py-10">
        <p className={`${MONO} text-center text-[11px] uppercase tracking-[0.2em] text-[#8f8ca1]`}>
          A recovery app by{' '}
          <a href={internalUrl('/')} className="text-[#c9c6d8] underline underline-offset-2 transition-colors hover:text-[#e8e6f0]">
            Luna Maze
          </a>
        </p>
      </footer>
    </div>
  );
}
