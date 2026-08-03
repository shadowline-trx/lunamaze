import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import BuddyInvite from './BuddyInvite';
import { internalUrl } from '@/lib/paths';

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

const MONO = 'ax-mono';

export default function BuddyInvitePage(): JSX.Element {
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
          {/* The recipient has never heard of the app, so the back link
              invites rather than assumes. */}
          <Link
            href="/axiom/"
            className={`${MONO} text-[11px] uppercase tracking-[0.22em] text-[#9b98ad] transition-colors hover:text-[#e8e6f0]`}
          >
            ← What is AXIOM?
          </Link>
        </nav>
      </header>

      <main className="relative mx-auto max-w-3xl px-6 pb-28 pt-36">
        <BuddyInvite />
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
