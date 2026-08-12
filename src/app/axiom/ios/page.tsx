import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import WaitlistForm from '@/components/lunamaze/WaitlistForm';
import { appStoreUrl, iosBetaUrl } from '@/lib/storeLinks';
import { internalUrl } from '@/lib/paths';

/**
 * /axiom/ios/ — the landing page for iPhone visitors, and the link to hand out
 * anywhere the audience is on Apple. Restyled 2026-08-03 to the v3 "Silver
 * Studio" language of the main landing; a max-conversion page, so it stays
 * static and instant (CSS stage only, no WebGL, no scroll choreography).
 *
 * The order is conversion order: install-now first (TestFlight), the
 * two-install friction stated plainly, what the app is, the free browser
 * tools as a zero-commitment fallback, and the waitlist last.
 *
 * When Apple approves, filling APP_STORE_ID in src/lib/storeLinks.ts flips
 * this page to a plain download page and retires both the beta and the
 * waitlist. Nothing else needs editing.
 */

const CANONICAL = 'https://lunamaze.com/axiom/ios/';

export const metadata: Metadata = {
  title: 'AXIOM for iPhone — download on the App Store',
  description:
    'AXIOM is a private, honest porn-recovery companion for iPhone. Free on the App Store — no account needed, and nothing you log leaves your phone readable.',
  alternates: { canonical: CANONICAL },
};

const MONO = 'ax-mono';

interface Tool {
  readonly href: string;
  readonly name: string;
  readonly line: string;
}

const TOOLS: ReadonlyArray<Tool> = [
  {
    href: '/axiom/tools/panic/',
    name: 'Panic Button',
    line: 'For right now. A pacer, a ride-it-out timer, and a grounding sequence.',
  },
  {
    href: '/axiom/tools/severity-test/',
    name: 'Severity Test',
    line: 'Where the habit actually sits, on a scale that is not a diagnosis.',
  },
  {
    href: '/axiom/tools/rewire-calculator/',
    name: 'Rewire Calculator',
    line: 'The honest timeline, mapped to your dates rather than a stock 90 days.',
  },
  {
    href: '/axiom/tools/wallpaper/',
    name: 'Wallpaper Maker',
    line: 'A lock screen that reminds you without announcing anything to anyone.',
  },
];

const APP_POINTS = [
  'The Rewire Map — your recovery in real dopamine phases',
  'Panic toolkit and guided breathing, never paywalled',
  'A journal sealed with your key — we cannot read it',
  'Your triggers and risk hours, gathered back into one place',
  'Light on day one, as deep as you want later',
] as const;

export default function IosPage(): JSX.Element {
  const apple = appStoreUrl('ios-page');
  const beta = iosBetaUrl();
  const liveNow = apple !== null;
  const betaNow = beta !== null && apple === null;

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
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
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

      <main className="relative mx-auto max-w-3xl px-6 pb-28 pt-36">
        {/* Hero */}
        <div
          className={`${MONO} mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-black/30 px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[#9b98ad] backdrop-blur-md`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#7ef7c2] shadow-[0_0_12px_rgba(126,247,194,0.8)]" />
          {liveNow ? 'iPhone — available now' : betaNow ? 'iPhone — open beta' : 'iPhone — in review'}
        </div>
        <h1 className="text-[clamp(2.6rem,7vw,4.6rem)] font-semibold leading-[1.0] tracking-[-0.03em] text-[#f2f1f7]">
          {betaNow ? (
            <>
              AXIOM is on iPhone.
              <br />
              <span className="ax-serif ax-grad-violet pr-1 font-normal">Install it today.</span>
            </>
          ) : (
            <>
              AXIOM is coming
              <br />
              <span className="ax-serif ax-grad-violet pr-1 font-normal">to iPhone.</span>
            </>
          )}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#a6a3b8]">
          {betaNow
            ? 'A private, honest recovery companion that keeps your history on your phone — not on our servers. The App Store listing is still with Apple, but the build is finished and you can install it right now through TestFlight.'
            : 'A private, honest recovery companion that keeps your history on your phone — not on our servers. It has been on Android for a while; the iPhone build is with Apple now.'}
        </p>

        {/* Primary action */}
        {liveNow ? (
          <div className="ax-card mt-12 p-8" style={{ boxShadow: '0 0 80px rgba(139,124,247,0.10)' }}>
            <p className={`${MONO} text-[11px] uppercase tracking-[0.26em] text-[#8b7cf7]`}>It is live</p>
            <p className="mt-3 leading-relaxed text-[#a6a3b8]">
              Free to install, and free to use without an account.
            </p>
            <a href={apple} className="ax-btn-primary mt-6 inline-block px-8 py-4">
              Download on the App Store
            </a>
          </div>
        ) : null}

        {betaNow ? (
          <div className="ax-card relative mt-12 overflow-hidden p-8" style={{ boxShadow: '0 0 80px rgba(139,124,247,0.10)' }}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b7cf7]/60 to-transparent" />
            <p className={`${MONO} text-[11px] uppercase tracking-[0.26em] text-[#8b7cf7]`}>
              Install it now — through TestFlight
            </p>
            <p className="mt-3 max-w-xl leading-relaxed text-[#c9c6d8]">
              This is the finished build — the same one sitting with Apple for
              review, not an early alpha. It is free, it needs no account, and
              nothing you log in it leaves your phone.
            </p>
            <a href={beta ?? '#'} className="ax-btn-primary mt-7 inline-block px-8 py-4">
              Join the beta on TestFlight
            </a>
            <p className={`${MONO} mt-5 text-[10px] uppercase tracking-[0.18em] text-[#8f8ca1]`}>
              Free · no account · sealed on device
            </p>
            {/* The friction is real and stating it costs nothing. */}
            <div className="mt-7 border-t border-white/[0.07] pt-6">
              <p className={`${MONO} mb-4 text-[10px] uppercase tracking-[0.24em] text-[#9b98ad]`}>
                How it works — about 90 seconds
              </p>
              <ol className="space-y-2.5 text-[15px] leading-relaxed text-[#a6a3b8]">
                <li>
                  <span className="text-[#e8e6f0]">1.</span> Install TestFlight — Apple’s own beta
                  app — from the App Store.
                </li>
                <li>
                  <span className="text-[#e8e6f0]">2.</span> Tap the button above and accept the
                  invite. Apple shares nothing about you with us.
                </li>
                <li>
                  <span className="text-[#e8e6f0]">3.</span> When the App Store listing goes live,
                  you move across and keep your history.
                </li>
              </ol>
            </div>
          </div>
        ) : null}

        {/* What you'd be installing */}
        <div className="ax-card mt-8 p-8">
          <p className={`${MONO} text-[11px] uppercase tracking-[0.26em] text-[#8b7cf7]`}>
            What you would be installing
          </p>
          <ul className="mt-5 space-y-3">
            {APP_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3.5 text-[#c9c6d8]">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[#7ef7c2]/25 bg-[#7ef7c2]/10">
                  <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 text-[#7ef7c2]" aria-hidden>
                    <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-[#8f8ca1]">
            Free to use. There is a paid tier, and the things that matter most
            on a bad night are not behind it.
          </p>
        </div>

        {/* Zero-commitment fallback */}
        <div className="ax-card mt-8 p-8">
          <p className={`${MONO} text-[11px] uppercase tracking-[0.26em] text-[#8b7cf7]`}>
            {betaNow ? 'Not ready to install anything?' : 'These already work on your iPhone'}
          </p>
          <p className="mt-3 max-w-xl leading-relaxed text-[#a6a3b8]">
            No install, no account, no sign-up. They run inside this browser
            tab and send nothing anywhere — you can turn off your connection
            and they still work.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="group block h-full rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 transition-colors hover:border-[#8b7cf7]/50 hover:bg-white/[0.04]"
                >
                  <span className="font-semibold text-[#e8e6f0] transition-colors group-hover:text-[#cdc7ee]">
                    {tool.name}
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-[#9b98ad]">
                    {tool.line}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Waitlist */}
        {apple === null ? (
          <div className="mt-8">
            <WaitlistForm
              source="ios-page"
              platform="ios"
              heading={betaNow ? 'Or wait for the App Store version' : 'Tell me when it lands'}
              blurb={
                betaNow
                  ? 'If you would rather not install a beta, that is fair. Leave an email and you get one message the day the App Store listing goes live.'
                  : 'Apple review takes as long as it takes. Leave an email and you get one message the day it goes live — no countdown, no reminders in between.'
              }
            />
          </div>
        ) : null}

        {/* Cross links */}
        <p className={`${MONO} mt-10 text-[11px] uppercase tracking-[0.2em] text-[#8f8ca1]`}>
          <Link href="/axiom/" className="underline underline-offset-4 transition-colors hover:text-[#e8e6f0]">
            See how it works
          </Link>
          {'  ·  '}
          <Link href="/axiom/privacy/" className="underline underline-offset-4 transition-colors hover:text-[#e8e6f0]">
            What we do and do not collect
          </Link>
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
