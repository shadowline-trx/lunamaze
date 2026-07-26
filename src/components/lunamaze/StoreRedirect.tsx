'use client';

import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { appStoreUrl, playStoreUrl } from '@/lib/storeLinks';

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
        ) : (
          <p className="rounded-xl border border-dashed border-lunamaze-border px-6 py-4 text-sm text-lunamaze-textDim">
            iPhone version is in review — not available to install yet.
          </p>
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
