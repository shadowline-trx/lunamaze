import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import AuroraField from '@/components/lunamaze/AuroraField';
import WaitlistForm from '@/components/lunamaze/WaitlistForm';
import { appStoreUrl } from '@/lib/storeLinks';

/**
 * /axiom/ios/ — the landing page for iPhone visitors, and the link to hand out
 * anywhere the audience is on Apple.
 *
 * It exists because every iOS surface on this site used to be a full stop: the
 * store redirect and the buddy invite both told an iPhone visitor the app was in
 * review and then offered them nothing. Those are the most valuable visitors the
 * site gets and they were being spent for free.
 *
 * The order here is deliberate. Tools first, waitlist second. Someone who cannot
 * install anything should still leave with something that worked, and an email
 * ask reads very differently after that than before it.
 *
 * When Apple approves, filling APP_STORE_ID in src/lib/storeLinks.ts flips this
 * page from a waitlist to a download page. Nothing else needs editing.
 */

const CANONICAL = 'https://lunamaze.com/axiom/ios/';

export const metadata: Metadata = {
  title: 'Axiom for iPhone — Coming to the App Store',
  description:
    'Axiom is a private dopamine-recovery tracker coming to iPhone. Get one email the day it lands, and use the free browser tools meanwhile — no account, nothing leaves your device.',
  alternates: { canonical: CANONICAL },
};

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

export default function IosPage(): JSX.Element {
  const apple = appStoreUrl('ios-page');

  return (
    <main className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <ProductNav product="Axiom" />

      <header className="lunamaze-noise relative overflow-hidden px-6 pb-10 pt-32 sm:px-8 lg:px-16">
        <AuroraField accent="#7B5CFF" accentAlt="#00D2FF" intensity={0.9} />
        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-lunamaze-violetLight/40 bg-lunamaze-violet/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-lunamaze-violetLight">
            <span
              className="h-1.5 w-1.5 rounded-full bg-lunamaze-violetLight"
              aria-hidden="true"
            />
            {apple === null ? 'iPhone — in review' : 'iPhone — available now'}
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.03] tracking-tight sm:text-6xl">
            Axiom is coming to{' '}
            <span className="lunamaze-text-gradient">iPhone.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-lunamaze-textSecondary">
            {
              'A recovery tracker that keeps your history on your phone rather than on our servers. It has been on Android for a while. The iPhone build is with Apple now.'
            }
          </p>
        </div>
      </header>

      <section className="relative px-6 pb-16 pt-2 sm:px-8 sm:pb-20 lg:px-16">
        <div className="mx-auto max-w-3xl space-y-8">
          {apple !== null ? (
            <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-6 backdrop-blur-sm sm:p-8">
              <h2 className="text-xl font-bold">It is live.</h2>
              <p className="mt-3 leading-relaxed text-lunamaze-textSecondary">
                Free to install, and free to use without an account.
              </p>
              <a
                href={apple}
                className="mt-5 inline-block rounded-xl bg-lunamaze-signal px-6 py-3 font-semibold text-lunamaze-bgDeep transition-opacity hover:opacity-90"
              >
                Download on the App Store
              </a>
            </div>
          ) : null}

          <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-6 backdrop-blur-sm sm:p-8">
            <h2 className="text-xl font-bold">These already work on your iPhone</h2>
            <p className="mt-3 leading-relaxed text-lunamaze-textSecondary">
              No install, no account, no sign-up. They run inside this browser tab and send
              nothing anywhere — you can turn off your connection and they still work.
            </p>
            <ul className="mt-6 space-y-3">
              {TOOLS.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="group block rounded-xl border border-lunamaze-border bg-lunamaze-bgDeep/40 px-5 py-4 transition-colors hover:border-lunamaze-signal"
                  >
                    <span className="font-semibold transition-colors group-hover:text-lunamaze-signal">
                      {tool.name}
                    </span>
                    <span className="mt-1 block text-sm text-lunamaze-textSecondary">
                      {tool.line}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {apple === null ? (
            <WaitlistForm
              source="ios-page"
              platform="ios"
              heading="Tell me when it lands"
              blurb="Apple review takes as long as it takes. Leave an email and you get one message the day it goes live — no countdown, no reminders in between."
            />
          ) : null}

          <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/40 p-6 sm:p-8">
            <h2 className="text-xl font-bold">What you would be installing</h2>
            <p className="mt-4 leading-relaxed text-lunamaze-textSecondary">
              {
                'Axiom tracks the pattern rather than just the day count: when your urges actually cluster, what your own danger hour is, and where you sit against the real recovery timeline instead of the stock ninety days. Your entries stay on the device. We cannot read them, which also means we cannot lose them in somebody else’s breach.'
              }
            </p>
            <p className="mt-4 text-sm leading-relaxed text-lunamaze-textDim">
              Free to use. There is a paid tier, and the things that matter most on a bad night
              are not behind it.
            </p>
            <p className="mt-5 text-sm">
              <Link
                href="/axiom/"
                className="underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-signal"
              >
                See how it works
              </Link>
              {' · '}
              <Link
                href="/axiom/privacy/"
                className="underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-signal"
              >
                What we do and do not collect
              </Link>
            </p>
          </div>
        </div>
      </section>

      <LunaFooter />
    </main>
  );
}
