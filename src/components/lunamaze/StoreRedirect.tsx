'use client';

import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import { appStoreUrl, iosBetaUrl, playStoreUrl } from '@/lib/storeLinks';

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

  const play = playStoreUrl(source);
  const apple = appStoreUrl(source);
  const beta = iosBetaUrl();

  useEffect(() => {
    const ua = navigator.userAgent;
    const isApple = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);

    // An Apple visitor with no live iOS listing must not be bounced to Play —
    // they'd land on a store page they cannot install from.
    const target = isApple ? apple : isAndroid ? play : null;

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
            ? 'Pick your platform:'
            : 'Taking you to Axiom…'}
      </p>

      {phase === 'choose' && apple === null && beta !== null && (
        <p className="mt-3 text-sm text-lunamaze-textDim">
          {'iPhone is in review, so it installs through TestFlight for now.'}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <a
          href={play}
          className="rounded-xl border border-lunamaze-border bg-lunamaze-bgSurface/60 px-6 py-4 font-semibold hover:border-lunamaze-signal transition-colors"
        >
          Get it on Google Play
        </a>

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
          <a
            href={beta}
            className="rounded-xl border border-lunamaze-border bg-lunamaze-bgSurface/60 px-6 py-4 font-semibold transition-colors hover:border-lunamaze-signal"
          >
            Join the iPhone beta
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

      <p className="mt-8 text-sm text-lunamaze-textDim">
        Not redirecting?{' '}
        <a href={play} className="underline hover:text-lunamaze-signal">
          Open the store directly
        </a>
        .
      </p>
    </div>
  );
}
