'use client';

import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import { appStoreUrl, iosBetaUrl, playIsBlockedHere, playStoreUrl } from '@/lib/storeLinks';

type Phase = 'detecting' | 'redirecting' | 'choose';

interface StoreRedirectProps {
  /** Campaign source recorded on the store link, e.g. "reddit". */
  source: string;
}

/**
 * Sends a visitor to the right store for their device while tagging the link
 * with a campaign source, so installs are attributable instead of anonymous.
 *
 * Everyone also gets visible buttons: detection can be wrong, JavaScript can be
 * off, and a redirect that silently fails would strand the visitor on a blank
 * page. The buttons are the real link; the redirect is a convenience.
 */
export default function StoreRedirect({ source }: StoreRedirectProps): JSX.Element {
  const [phase, setPhase] = useState<Phase>('detecting');
  const [playBlocked, setPlayBlocked] = useState(false);

  const play = playStoreUrl(source);
  const apple = appStoreUrl(source);
  const beta = iosBetaUrl();

  useEffect(() => {
    const ua = navigator.userAgent;
    const isApple = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);

    // Play is dark in the US and Australia, which is the bulk of the audience
    // Reddit sends. Auto-redirecting an Android visitor there lands them on a
    // 404 that reads as "the app does not exist", and it fails silently — so
    // those two markets get the page instead of the bounce.
    const blocked = isAndroid && playIsBlockedHere();
    setPlayBlocked(blocked);

    // An Apple visitor with no live iOS listing must not be bounced to Play —
    // they'd land on a store page they cannot install from.
    const target = isApple ? apple : isAndroid && !blocked ? play : null;

    if (target === null) {
      setPhase('choose');
      return;
    }

    setPhase('redirecting');
    window.location.replace(target);
  }, [apple, play]);

  return (
    <div className="max-w-md mx-auto text-center">
      <p className="text-lunamaze-textSecondary leading-relaxed" aria-live="polite">
        {phase === 'redirecting'
          ? 'Opening your app store…'
          : phase === 'choose'
            ? playBlocked
              ? 'Google Play is not serving Axiom in your country yet.'
              : 'Pick your platform:'
            : 'Taking you to Axiom…'}
      </p>

      {phase === 'choose' && playBlocked && (
        // This visitor came to get the app and cannot have it. Saying so and
        // handing over something that works in the same breath beats letting
        // them conclude the app does not exist.
        <p className="mt-3 text-sm text-lunamaze-textDim">
          The tools below need no install and no account.
        </p>
      )}

      {phase === 'choose' && apple === null && beta !== null && !playBlocked && (
        <p className="mt-3 text-sm text-lunamaze-textDim">
          {'iPhone is in review, so it installs through TestFlight for now.'}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {playBlocked ? (
          <>
            <div className="rounded-xl border border-lunamaze-signal/40 bg-lunamaze-bgSurface/60 px-6 py-5 text-left">
              <Link
                href="/axiom/tools/"
                className="font-semibold text-lunamaze-signal underline underline-offset-4 hover:opacity-80"
              >
                Open the free tools
              </Link>
              <p className="mt-2 text-sm text-lunamaze-textDim">
                Severity self-test, rewire timeline, panic button — all in the browser.
              </p>
            </div>

            {/* Kept, demoted and labelled honestly: time-zone detection can be
                wrong, and a misdetected visitor must still reach the store. */}
            <a
              href={play}
              className="text-sm text-lunamaze-textDim underline underline-offset-4 hover:text-lunamaze-signal"
            >
              Open the Play listing anyway
            </a>
          </>
        ) : (
          <a
            href={play}
            className="rounded-xl border border-lunamaze-border bg-lunamaze-bgSurface/60 px-6 py-4 font-semibold hover:border-lunamaze-signal transition-colors"
          >
            Get it on Google Play
          </a>
        )}

        {apple !== null ? (
          <a
            href={apple}
            className="rounded-xl border border-lunamaze-border bg-lunamaze-bgSurface/60 px-6 py-4 font-semibold hover:border-lunamaze-signal transition-colors"
          >
            Download on the App Store
          </a>
        ) : beta !== null ? (
          // Deliberately a visible button rather than an auto-redirect target:
          // TestFlight is a second install, and bouncing someone into it
          // without asking is a worse first impression than saying so.
          //
          // `playBlocked` is only ever true for an Android visitor, so giving
          // the iPhone beta full button weight there would make the loudest
          // thing on the page the one option they cannot take.
          <a
            href={beta}
            className={
              playBlocked
                ? 'text-sm text-lunamaze-textDim underline underline-offset-4 hover:text-lunamaze-signal'
                : 'rounded-xl border border-lunamaze-border bg-lunamaze-bgSurface/60 px-6 py-4 font-semibold transition-colors hover:border-lunamaze-signal'
            }
          >
            {playBlocked ? 'On an iPhone instead? Join the beta' : 'Join the iPhone beta'}
          </a>
        ) : (
          // An Apple visitor cannot act on anything above, so this is the whole
          // page for them. A dead end here spends the site's most valuable
          // traffic for nothing.
          <div className="rounded-xl border border-dashed border-lunamaze-border px-6 py-5 text-left">
            <p className="text-sm text-lunamaze-textDim">
              iPhone version is in review — not available to install yet.
            </p>
            <Link
              href="/axiom/ios/"
              className="mt-3 inline-block text-sm font-semibold text-lunamaze-signal underline underline-offset-4 hover:opacity-80"
            >
              Get told when it lands, and use the free tools meanwhile
            </Link>
          </div>
        )}
      </div>

      {/* Only meaningful when a redirect was actually attempted — and in a
          blocked market it would be a link straight back to the 404. */}
      {!playBlocked && (
        <p className="mt-8 text-sm text-lunamaze-textDim">
          Not redirecting?{' '}
          <a href={play} className="underline hover:text-lunamaze-signal">
            Open the store directly
          </a>
          .
        </p>
      )}
    </div>
  );
}
