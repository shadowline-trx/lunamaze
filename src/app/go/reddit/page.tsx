import type { Metadata } from 'next';
import type { JSX } from 'react';
import StoreRedirect from '@/components/lunamaze/StoreRedirect';

/**
 * /go/reddit/ — the short, countable link that lives in the Reddit profile bio.
 *
 * Sub rules govern posts, not your own profile, so the bio is the one place an
 * app link is always allowed. Routing it through here (instead of pasting a raw
 * store URL) tags every install with `utm_source=reddit`, which is what turns
 * Reddit from an unmeasurable reach channel into one that can be kept or killed
 * on evidence.
 *
 * Deliberately noindex: it is a doorway, not a page, and it should never
 * compete with real content in search results.
 */

export const metadata: Metadata = {
  title: 'Get Axiom',
  description: 'Download Axiom for Android or iOS.',
  robots: { index: false, follow: false },
};

export default function GoRedditPage(): JSX.Element {
  return (
    <main className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary flex items-center justify-center px-6 py-24">
      <div className="w-full">
        <h1 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          <span className="lunamaze-text-gradient">Axiom</span>
        </h1>
        <StoreRedirect source="reddit" />
      </div>
    </main>
  );
}
