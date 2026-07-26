import type { Metadata } from 'next';
import type { JSX } from 'react';
import BuddyInvite from './BuddyInvite';

/**
 * /axiom/buddy/?c=CODE — the landing page a buddy invite link points at.
 *
 * The app already mints a stable 6-character partner code and claims it via
 * `claim_buddy_code`; what was missing was a way to *send* one. Without this
 * page an invite means texting someone "install Axiom and enter XY7K2M", which
 * forces the sender to explain themselves up front — i.e. to confess. That kills
 * the loop, because the people most in need of a partner are the least willing
 * to out themselves.
 *
 * The privacy design lives in the metadata, not the copy. Chat apps render
 * og:title and og:description as a preview card, and *that* card is what would
 * expose the sender in a group thread or on a lock screen. So the preview stays
 * neutral and truthful ("an accountability request" — which is exactly what it
 * is), while the page body is completely honest about what Axiom is and what the
 * recipient is agreeing to. Neutral preview, honest page.
 *
 * noindex because every one of these URLs is a personal invite.
 */

export const metadata: Metadata = {
  title: 'Accountability request',
  description: 'Someone asked you to be their accountability partner.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Accountability request',
    description: 'Someone asked you to be their accountability partner.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Accountability request',
    description: 'Someone asked you to be their accountability partner.',
  },
};

export default function BuddyInvitePage(): JSX.Element {
  return (
    <main className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary px-6 sm:px-8 lg:px-16 py-20 sm:py-28 lunamaze-noise">
      <BuddyInvite />
    </main>
  );
}
