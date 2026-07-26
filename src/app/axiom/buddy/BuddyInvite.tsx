'use client';

import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { appStoreUrl, playStoreUrl } from '@/lib/storeLinks';

const CODE_PATTERN = /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/;

/**
 * Reads the buddy code from `?c=` and renders the invite.
 *
 * The code is read from `window.location.search` rather than `useSearchParams`
 * so the page stays a plain static export with no Suspense boundary — there is
 * no server to read the query string on this host anyway.
 */
export default function BuddyInvite(): JSX.Element {
  const [code, setCode] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('c') ?? '';
    const normalized = raw.trim().toUpperCase();
    setCode(CODE_PATTERN.test(normalized) ? normalized : null);
    setReady(true);
  }, []);

  const play = playStoreUrl('buddy');
  const apple = appStoreUrl('buddy');

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1]">
        Someone asked you to be their{' '}
        <span className="lunamaze-text-gradient">accountability partner</span>.
      </h1>

      <p className="mt-6 text-lg sm:text-xl text-lunamaze-textSecondary leading-relaxed">
        That&apos;s the whole ask. They&apos;re trying to break a habit, and people who
        tell someone are far more likely to stick with it than people who go it alone.
        They picked you.
      </p>

      {/* Code panel — the one thing this page exists to hand over. */}
      <section className="mt-10 rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
        {!ready ? (
          <p className="text-lunamaze-textDim">Loading your invite…</p>
        ) : code !== null ? (
          <>
            <p className="text-sm uppercase tracking-[0.3em] text-lunamaze-signal">
              Their partner code
            </p>
            <p
              className="mt-3 font-mono text-4xl sm:text-5xl font-bold tracking-[0.2em] select-all break-all"
              aria-label={`Partner code ${code.split('').join(' ')}`}
            >
              {code}
            </p>
            <p className="mt-4 text-sm text-lunamaze-textDim">
              Install Axiom, open <span className="text-lunamaze-textSecondary">Partner</span>,
              and enter this code. Takes about a minute.
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold">This link is missing its code.</p>
            <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
              Ask the person who sent it to share the link again — it should end with
              a six-character code. You can also install Axiom first and enter their
              code by hand.
            </p>
          </>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">What you&apos;re actually agreeing to</h2>
        <ul className="mt-5 space-y-4 text-lunamaze-textSecondary leading-relaxed">
          <li>
            <span className="text-lunamaze-textPrimary font-semibold">You get a ping.</span>{' '}
            When they&apos;re struggling, or when they hit a milestone, you&apos;ll know.
            You can reply. That is the entire feature.
          </li>
          <li>
            <span className="text-lunamaze-textPrimary font-semibold">
              You don&apos;t get a dashboard.
            </span>{' '}
            You can&apos;t see what they log, when they slipped, or what they wrote. There
            is no feed of their bad days. Nobody appointed you a supervisor.
          </li>
          <li>
            <span className="text-lunamaze-textPrimary font-semibold">
              You can say no, or stop later.
            </span>{' '}
            Ignoring this link is a completely fine answer, and they won&apos;t be told
            you opened it.
          </li>
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/40 p-8">
        <h2 className="text-xl font-bold">Why an app that hides things from you</h2>
        <p className="mt-4 text-lunamaze-textSecondary leading-relaxed">
          Axiom is a recovery tracker built so that almost nothing leaves your friend&apos;s
          phone — we can&apos;t read their entries either. The point of a partner isn&apos;t
          surveillance, it&apos;s that someone knows. Being watched makes people hide; being
          known makes them stay.
        </p>
        <p className="mt-4 text-sm text-lunamaze-textDim">
          Free to install. The partner feature costs nothing.
        </p>
      </section>

      <div className="mt-10 flex flex-col gap-3">
        <a
          href={play}
          className="rounded-xl border border-lunamaze-border bg-lunamaze-bgSurface/60 px-6 py-4 text-center font-semibold hover:border-lunamaze-signal transition-colors"
        >
          Get Axiom on Google Play
        </a>
        {apple !== null ? (
          <a
            href={apple}
            className="rounded-xl border border-lunamaze-border bg-lunamaze-bgSurface/60 px-6 py-4 text-center font-semibold hover:border-lunamaze-signal transition-colors"
          >
            Download Axiom on the App Store
          </a>
        ) : (
          <p className="rounded-xl border border-dashed border-lunamaze-border px-6 py-4 text-center text-sm text-lunamaze-textDim">
            iPhone version is in review — not available to install yet.
          </p>
        )}
      </div>

      <p className="mt-10 text-sm text-lunamaze-textDim leading-relaxed">
        Not sure what to say back? &ldquo;Yeah, I&apos;m in&rdquo; is enough. You don&apos;t
        need to have advice, and you don&apos;t need to ask what it&apos;s about.
      </p>
    </div>
  );
}
