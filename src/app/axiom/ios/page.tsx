import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import AuroraField from '@/components/lunamaze/AuroraField';
import WaitlistForm from '@/components/lunamaze/WaitlistForm';
import { appStoreUrl, iosBetaUrl } from '@/lib/storeLinks';

/**
 * /axiom/ios/ — the landing page for iPhone visitors, and the link to hand out
 * anywhere the audience is on Apple.
 *
 * It exists because every iOS surface on this site used to be a full stop: the
 * store redirect and the buddy invite both told an iPhone visitor the app was in
 * review and then offered them nothing. Those are the most valuable visitors the
 * site gets and they were being spent for free.
 *
 * The order changed once the TestFlight public link went live. A visitor who can
 * install the app today should be offered that first — the waitlist was only
 * ever a consolation for having nothing to give them. It now sits underneath,
 * for people who will not install a second app to get a first one.
 *
 * When Apple approves, filling APP_STORE_ID in src/lib/storeLinks.ts flips this
 * page to a plain download page and retires both the beta and the waitlist.
 * Nothing else needs editing.
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
  const beta = iosBetaUrl();

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
            {apple !== null
              ? 'iPhone — available now'
              : beta !== null
                ? 'iPhone — open beta'
                : 'iPhone — in review'}
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.03] tracking-tight sm:text-6xl">
            {beta !== null && apple === null ? (
              <>
                Axiom is on iPhone.{' '}
                <span className="lunamaze-text-gradient">Early, but real.</span>
              </>
            ) : (
              <>
                Axiom is coming to{' '}
                <span className="lunamaze-text-gradient">iPhone.</span>
              </>
            )}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-lunamaze-textSecondary">
            {beta !== null && apple === null
              ? 'A recovery tracker that keeps your history on your phone rather than on our servers. The App Store listing is still with Apple, but the build is finished and you can install it today through TestFlight.'
              : 'A recovery tracker that keeps your history on your phone rather than on our servers. It has been on Android for a while. The iPhone build is with Apple now.'}
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

          {beta !== null && apple === null ? (
            <div className="rounded-2xl border border-lunamaze-violetLight/30 bg-lunamaze-violet/[0.07] p-6 backdrop-blur-sm sm:p-8">
              <h2 className="text-xl font-bold">Install it now, through TestFlight</h2>
              <p className="mt-3 leading-relaxed text-lunamaze-textSecondary">
                {
                  'This is the finished build — the same one sitting with Apple for review, not an early alpha. It is free, it needs no account, and nothing you log in it leaves your phone.'
                }
              </p>
              <a
                href={beta}
                className="mt-5 inline-block rounded-xl bg-lunamaze-signal px-6 py-3 font-semibold text-lunamaze-bgDeep transition-opacity hover:opacity-90"
              >
                Join the beta on TestFlight
              </a>
              {/* The friction is real and stating it costs nothing. Someone who
                  finds out about the second install only after tapping is more
                  annoyed than someone who was told. */}
              <p className="mt-4 text-xs leading-relaxed text-lunamaze-textDim">
                TestFlight is Apple&apos;s own beta app, so this takes two installs rather than
                one. Beta builds expire after 90 days; when the App Store listing goes live you
                move across and keep your history. Apple does not share your name or email with
                us when you join by link.
              </p>
            </div>
          ) : null}

          <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-6 backdrop-blur-sm sm:p-8">
            <h2 className="text-xl font-bold">
              {beta !== null && apple === null
                ? 'Not ready to install anything?'
                : 'These already work on your iPhone'}
            </h2>
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
              heading={
                beta !== null ? 'Or wait for the App Store version' : 'Tell me when it lands'
              }
              blurb={
                beta !== null
                  ? 'If you would rather not install a beta, that is fair. Leave an email and you get one message the day the App Store listing goes live.'
                  : 'Apple review takes as long as it takes. Leave an email and you get one message the day it goes live — no countdown, no reminders in between.'
              }
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
