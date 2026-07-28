'use client';

import { useId, useState } from 'react';
import type { FormEvent, JSX } from 'react';
import { joinWaitlist, type WaitlistPlatform } from '@/lib/waitlist';

type Phase = 'idle' | 'sending' | 'done' | 'error';

interface WaitlistFormProps {
  /** Recorded with the signup so we learn which surface actually converts. */
  source: string;
  platform: WaitlistPlatform;
  heading?: string;
  blurb?: string;
  /** Drops the outer card, for use inside a panel that already has a border. */
  bare?: boolean;
}

/**
 * Email capture for "tell me when it's out".
 *
 * This is the only place the site asks for anything, which is why the fine
 * print is not decorative. Everything else here runs in the browser and keeps
 * nothing, and a form that quietly broke that pattern would read as a bait and
 * switch on the one claim the product is built around. So the promise is stated
 * in full, next to the field, before the button.
 *
 * The line about the subject line is a real constraint, not reassurance: the
 * list is single opt-in, so it can always contain an address someone else typed,
 * and an email that names this category arriving in the wrong inbox is a
 * genuine harm. The send has to stay category-neutral to keep that promise.
 */
export default function WaitlistForm({
  source,
  platform,
  heading = 'Get told when iPhone lands',
  blurb = 'Axiom is in review with Apple. Leave an email and you get one message the day it goes live.',
  bare = false,
}: WaitlistFormProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState('');
  // Bots fill every field they find. A human never sees this one.
  const [trap, setTrap] = useState('');
  const fieldId = useId();
  const errorId = `${fieldId}-error`;

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (phase === 'sending') return;

    // Silently succeed for the honeypot: telling a bot it failed teaches it.
    if (trap !== '') {
      setPhase('done');
      return;
    }

    setPhase('sending');
    setError('');

    const result = await joinWaitlist({ email, source, platform });
    if (result.ok) {
      setPhase('done');
      setEmail('');
      return;
    }
    setError(result.message);
    setPhase('error');
  }

  const shell = bare
    ? ''
    : 'rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-6 sm:p-8 backdrop-blur-sm';

  if (phase === 'done') {
    return (
      <div className={shell}>
        <p
          className="flex items-start gap-3 text-lunamaze-textPrimary"
          role="status"
          aria-live="polite"
        >
          <span aria-hidden="true" className="mt-0.5 text-lunamaze-signal">
            ✓
          </span>
          <span>
            <span className="font-semibold">You are on the list.</span>{' '}
            <span className="text-lunamaze-textSecondary">
              One email the day it goes live, and nothing after that.
            </span>
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className={shell}>
      <h3 className="text-lg font-bold sm:text-xl">{heading}</h3>
      <p className="mt-3 leading-relaxed text-lunamaze-textSecondary">{blurb}</p>

      {/* `relative` anchors the off-screen honeypot to the form rather than to
          whatever happens to be positioned further up the page. */}
      <form onSubmit={onSubmit} className="relative mt-5" noValidate>
        <label htmlFor={fieldId} className="sr-only">
          Email address
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id={fieldId}
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={phase === 'sending'}
            aria-invalid={phase === 'error'}
            aria-describedby={phase === 'error' ? errorId : undefined}
            className="min-w-0 flex-1 rounded-xl border border-lunamaze-border bg-lunamaze-bgDeep/60 px-4 py-3 text-lunamaze-textPrimary placeholder:text-lunamaze-textDim focus:border-lunamaze-signal focus:outline-none disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={phase === 'sending'}
            className="rounded-xl bg-lunamaze-signal px-6 py-3 font-semibold text-lunamaze-bgDeep transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {phase === 'sending' ? 'Adding…' : 'Notify me'}
          </button>
        </div>

        {/* Off-screen rather than display:none — some bots skip hidden inputs. */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor={`${fieldId}-company`}>Company</label>
          <input
            id={`${fieldId}-company`}
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
          />
        </div>

        {phase === 'error' && (
          <p id={errorId} role="alert" className="mt-3 text-sm text-lunamaze-signal">
            {error}
          </p>
        )}

        <p className="mt-4 text-xs leading-relaxed text-lunamaze-textDim">
          One email, then nothing. No newsletter, and the list is never sold or shared. The
          subject line will not say what the app is for. Unsubscribe from the message itself.
        </p>
      </form>
    </div>
  );
}
