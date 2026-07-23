'use client';

import type { JSX } from 'react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/**
 * Urge-emergency page. Job: get the visitor through the next 10–20 minutes
 * without acting. Three instruments: a breathing pacer, a ride-it-out timer,
 * and a 5-4-3-2-1 grounding sequence — plus honest context about what the
 * urge is doing. No sound, no autoplay, no account, no network calls.
 */

type BreathPhase = 'in' | 'hold' | 'out';

const PHASE_SECONDS: Readonly<Record<BreathPhase, number>> = { in: 4, hold: 4, out: 6 };
const PHASE_LABEL: Readonly<Record<BreathPhase, string>> = {
  in: 'Breathe in',
  hold: 'Hold',
  out: 'Breathe out, slowly',
};
const NEXT_PHASE: Readonly<Record<BreathPhase, BreathPhase>> = {
  in: 'hold',
  hold: 'out',
  out: 'in',
};

const RIDE_MINUTES = 10;

export default function PanicButton(): JSX.Element {
  const [breathing, setBreathing] = useState<boolean>(false);
  const [phase, setPhase] = useState<BreathPhase>('in');
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const tickRef = useRef<number | null>(null);

  // Breathing pacer: advance phase on its own schedule while active.
  useEffect(() => {
    if (!breathing) return;
    const id = window.setTimeout(() => setPhase((p) => NEXT_PHASE[p]), PHASE_SECONDS[phase] * 1000);
    return () => window.clearTimeout(id);
  }, [breathing, phase]);

  // Ride-it-out countdown.
  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return;
    tickRef.current = window.setTimeout(() => setSecondsLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => {
      if (tickRef.current !== null) window.clearTimeout(tickRef.current);
    };
  }, [secondsLeft]);

  const timerDone = secondsLeft !== null && secondsLeft <= 0;
  const minutes = secondsLeft !== null ? Math.floor(Math.max(0, secondsLeft) / 60) : 0;
  const seconds = secondsLeft !== null ? Math.max(0, secondsLeft) % 60 : 0;

  const circleScale = breathing ? (phase === 'in' ? 1 : phase === 'hold' ? 1 : 0.6) : 0.6;
  const circleDuration = breathing ? PHASE_SECONDS[phase] : 1;

  return (
    <div className="space-y-6">
      {/* --- What is happening right now --- */}
      <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold leading-snug">
          What you’re feeling is a wave. It crests and passes in 10–20 minutes — whether or not
          you act on it.
        </h2>
        <p className="mt-4 text-lunamaze-textSecondary leading-relaxed">
          That’s not a slogan; it’s how urges physically behave. Your job for the next few
          minutes is not to feel better, not to win an argument with your brain, not to decide
          anything about the rest of your life. It is only this: don’t act while the wave is
          up. Everything below exists to make that easier.
        </p>
        <p className="mt-3 text-sm text-lunamaze-textDim">
          If it’s late at night right now — that’s not a coincidence. Late night stacks
          fatigue, privacy, boredom, and a phone into the same hour. The urge is not stronger
          than it was this afternoon; your defenses are just tired.
        </p>
      </div>

      {/* --- Breathing pacer --- */}
      <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold">1 · Slow the body down</h3>
        <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
          The urge rides on arousal — a revved-up nervous system. Long, slow exhales are the
          fastest manual override you have. Follow the circle for at least six rounds.
        </p>
        <div className="mt-8 flex flex-col items-center">
          <div className="flex h-56 w-56 items-center justify-center">
            <div
              className="flex h-full w-full items-center justify-center rounded-full border border-lunamaze-signal/40 bg-lunamaze-signal/10"
              style={{
                transform: `scale(${circleScale})`,
                transition: `transform ${circleDuration}s ease-in-out`,
              }}
            >
              <span className="text-lg font-semibold text-lunamaze-signal">
                {breathing ? PHASE_LABEL[phase] : 'Ready'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setPhase('in');
              setBreathing((b) => !b);
            }}
            className="mt-6 rounded-xl border border-lunamaze-border px-6 py-3 font-semibold transition-colors hover:border-lunamaze-signal hover:text-lunamaze-signal"
          >
            {breathing ? 'Stop' : 'Start breathing with the circle'}
          </button>
        </div>
      </div>

      {/* --- Ride-it-out timer --- */}
      <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold">2 · Ride out ten minutes</h3>
        <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
          You don’t have to hold out forever — only long enough for the wave to crest. Start
          the timer, put the phone face-down where you can’t comfortably reach it, and do
          anything physical: walk, shower, push-ups, step outside. The timer will be here.
        </p>
        <div className="mt-6 flex flex-col items-center">
          {secondsLeft === null ? (
            <button
              type="button"
              onClick={() => setSecondsLeft(RIDE_MINUTES * 60)}
              className="rounded-xl bg-lunamaze-signal px-8 py-4 font-semibold text-lunamaze-bgDeep transition-opacity hover:opacity-90"
            >
              Start the {RIDE_MINUTES} minutes
            </button>
          ) : timerDone ? (
            <div className="text-center">
              <p className="text-3xl font-extrabold text-lunamaze-signal">You made it.</p>
              <p className="mt-3 text-lunamaze-textSecondary leading-relaxed max-w-md">
                Notice: the wave is lower than when you started, or it will be within minutes.
                You just proved the only thing that matters — waves end, and you can outlast
                one. Every future urge is negotiable now.
              </p>
              <button
                type="button"
                onClick={() => setSecondsLeft(null)}
                className="mt-5 text-sm text-lunamaze-textDim underline underline-offset-4 hover:text-lunamaze-textPrimary"
              >
                Reset
              </button>
            </div>
          ) : (
            <p className="font-mono text-6xl font-bold tabular-nums">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
          )}
        </div>
      </div>

      {/* --- Grounding --- */}
      <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold">3 · Come back to the room</h3>
        <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
          Urges live in imagination; senses live in the room. Slowly, actually do this — don’t
          just read it:
        </p>
        <ul className="mt-5 space-y-3 text-lunamaze-textSecondary">
          <li><span className="font-mono text-lunamaze-signal">5</span> — name five things you can see, out loud or in your head.</li>
          <li><span className="font-mono text-lunamaze-signal">4</span> — four things you can physically feel (feet on floor, air, fabric, chair).</li>
          <li><span className="font-mono text-lunamaze-signal">3</span> — three things you can hear.</li>
          <li><span className="font-mono text-lunamaze-signal">2</span> — two things you can smell.</li>
          <li><span className="font-mono text-lunamaze-signal">1</span> — one thing you’re glad about, however small.</li>
        </ul>
      </div>

      {/* --- If you already slipped --- */}
      <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold">If you already slipped tonight</h3>
        <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
          Then this page has one different job: stop the spiral. The binge that follows a slip
          does far more damage than the slip — and the pull to repeat is strongest in the next
          48 hours. No shame session, no “I already failed anyway.” Log it honestly if you
          track, drink some water, go to sleep. One bad night followed by a normal morning is
          a data point, not a collapse.
        </p>
      </div>

      {/* --- Quiet footer links --- */}
      <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/40 p-8">
        <p className="text-sm text-lunamaze-textSecondary leading-relaxed">
          Bookmark this page — it works offline-fast, needs no account, and you can send the
          link to a friend who’s struggling without either of you saying a word more.
        </p>
        <p className="mt-4 text-sm text-lunamaze-textSecondary">
          When the wave is down:{' '}
          <Link
            href="/axiom/blog/en/night-urges/"
            className="underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-signal"
          >
            why urges peak at night
          </Link>
          {' '}·{' '}
          <Link
            href="/axiom/tools/severity-test/"
            className="underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-signal"
          >
            the 2-minute self-test
          </Link>
          {' '}·{' '}
          <Link
            href="/axiom/"
            className="underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-signal"
          >
            Axiom, the private tracker
          </Link>
        </p>
      </div>
    </div>
  );
}
