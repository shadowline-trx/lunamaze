'use client';

import type { CSSProperties, JSX } from 'react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/**
 * Urge-emergency page. Job: get the visitor through the next 10–20 minutes
 * without acting. Three instruments: a breathing pacer, a ride-it-out timer,
 * and a 5-4-3-2-1 grounding sequence — plus honest context about what the
 * urge is doing. No sound, no autoplay, no account, no network calls.
 *
 * Surfaces: the page previously stacked five identical panels bordered in
 * #22264A, which on #06081A is effectively invisible — everything read flat and
 * interchangeable. Panels now take their edge from the page accent at low alpha
 * (the same approach as ToolCard), and the three instruments carry a left rail
 * so they read as one numbered sequence instead of five equal boxes.
 *
 * Nothing added here moves on its own. This page is opened mid-crisis, so the
 * only motion in it remains the breathing circle the visitor starts themselves.
 */

/** Amber = urgency that stays warm; ember marks the after-a-slip panel. */
const ACCENT = '#FFD27A';
const ACCENT_ALT = '#FF9E7A';

/** #RRGGBB + alpha → rgba(). Module-private in ToolCard/AuroraField too; this
 *  client component shouldn't import unrelated modules for four lines of maths. */
function hexA(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Accent-edged panel: a real border, an accent-tinted wash, a hairline lift. */
function panel(accent: string, tint: number, edge: number): CSSProperties {
  return {
    borderColor: hexA(accent, edge),
    background: `linear-gradient(160deg, ${hexA(accent, tint)} 0%, rgba(18,23,55,0.72) 45%)`,
    boxShadow: `0 1px 0 0 ${hexA(accent, 0.12)} inset`,
  };
}

/** Vertical accent rail that binds the three instrument panels into a sequence. */
function StepRail(): JSX.Element {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-y-7 left-0 w-[3px] rounded-full"
      style={{
        background: `linear-gradient(180deg, ${hexA(ACCENT, 0.85)} 0%, ${hexA(ACCENT_ALT, 0.4)} 55%, transparent 100%)`,
      }}
    />
  );
}

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
      <div
        className="relative overflow-hidden rounded-3xl border p-5 backdrop-blur-sm sm:p-10"
        style={panel(ACCENT, 0.1, 0.32)}
      >
        {/* Lit top edge: the one panel that should read as the headline. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${hexA(ACCENT, 0.75)} 28%, ${hexA(ACCENT_ALT, 0.5)} 72%, transparent 100%)`,
          }}
        />
        <h2 className="text-2xl font-bold leading-snug sm:text-[1.75rem]">
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
      <div
        className="relative overflow-hidden rounded-3xl border p-5 backdrop-blur-sm sm:p-8"
        style={panel(ACCENT, 0.06, 0.24)}
      >
        <StepRail />
        <h3 className="text-xl font-bold">1 · Slow the body down</h3>
        <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
          The urge rides on arousal — a revved-up nervous system. Long, slow exhales are the
          fastest manual override you have. Follow the circle for at least six rounds.
        </p>
        <div className="mt-8 flex flex-col items-center">
          <div className="relative flex h-56 w-56 items-center justify-center">
            {/* Static halo. It gives the pacer depth without adding motion:
                only the circle itself moves, and only when the visitor starts it. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[-18%] rounded-full blur-2xl"
              style={{
                background: `radial-gradient(circle, ${hexA(ACCENT, 0.16)} 0%, ${hexA(ACCENT_ALT, 0.07)} 45%, transparent 72%)`,
              }}
            />
            <div
              className="relative flex h-full w-full items-center justify-center rounded-full border"
              style={{
                borderColor: hexA(ACCENT, 0.45),
                background: `radial-gradient(circle at 50% 35%, ${hexA(ACCENT, 0.18)} 0%, ${hexA(ACCENT, 0.07)} 55%, rgba(18,23,55,0.55) 100%)`,
                boxShadow: `0 0 40px -12px ${hexA(ACCENT, 0.55)}, 0 1px 0 0 ${hexA(ACCENT, 0.25)} inset`,
                transform: `scale(${circleScale})`,
                transition: `transform ${circleDuration}s ease-in-out`,
              }}
            >
              <span className="text-lg font-semibold text-lunamaze-signal">
                {breathing ? PHASE_LABEL[phase] : 'Ready'}
              </span>
            </div>
          </div>
          {/* Full-bleed on phones. This page is opened one-handed, in the dark,
              by someone who is not aiming carefully — every instrument control
              here is a whole-thumb target rather than a centred pill. */}
          <button
            type="button"
            onClick={() => {
              setPhase('in');
              setBreathing((b) => !b);
            }}
            className="ax-press mt-6 w-full rounded-2xl border border-lunamaze-signal/30 bg-lunamaze-signal/[0.06] px-6 py-4 font-semibold hover:border-lunamaze-signal/70 hover:text-lunamaze-signal sm:w-auto sm:py-3"
          >
            {breathing ? 'Stop' : 'Start breathing with the circle'}
          </button>
        </div>
      </div>

      {/* --- Ride-it-out timer --- */}
      <div
        className="relative overflow-hidden rounded-3xl border p-5 backdrop-blur-sm sm:p-8"
        style={panel(ACCENT, 0.06, 0.24)}
      >
        <StepRail />
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
              className="ax-press w-full rounded-2xl bg-lunamaze-signal px-8 py-4 font-semibold text-lunamaze-bgDeep sm:w-auto"
              style={{ boxShadow: `0 10px 40px -14px ${hexA(ACCENT, 0.9)}` }}
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
                className="ax-tap mt-5 text-sm text-lunamaze-textDim underline underline-offset-4 hover:text-lunamaze-textPrimary"
              >
                Reset
              </button>
            </div>
          ) : (
            <div
              className="w-full rounded-3xl border px-6 py-5 text-center sm:w-auto sm:px-10 sm:py-6"
              style={{
                borderColor: hexA(ACCENT, 0.3),
                background: `radial-gradient(circle at 50% 0%, ${hexA(ACCENT, 0.12)} 0%, rgba(10,14,39,0.6) 70%)`,
              }}
            >
              <p className="font-mono text-5xl font-bold tabular-nums sm:text-6xl">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- Grounding --- */}
      <div
        className="relative overflow-hidden rounded-3xl border p-5 backdrop-blur-sm sm:p-8"
        style={panel(ACCENT, 0.06, 0.24)}
      >
        <StepRail />
        <h3 className="text-xl font-bold">3 · Come back to the room</h3>
        <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
          Urges live in imagination; senses live in the room. Slowly, actually do this — don’t
          just read it:
        </p>
        <ul className="mt-5 space-y-3.5 leading-relaxed text-lunamaze-textSecondary">
          <li><span className="mr-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md border border-lunamaze-signal/40 bg-lunamaze-signal/10 align-middle font-mono text-sm text-lunamaze-signal">5</span> — name five things you can see, out loud or in your head.</li>
          <li><span className="mr-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md border border-lunamaze-signal/40 bg-lunamaze-signal/10 align-middle font-mono text-sm text-lunamaze-signal">4</span> — four things you can physically feel (feet on floor, air, fabric, chair).</li>
          <li><span className="mr-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md border border-lunamaze-signal/40 bg-lunamaze-signal/10 align-middle font-mono text-sm text-lunamaze-signal">3</span> — three things you can hear.</li>
          <li><span className="mr-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md border border-lunamaze-signal/40 bg-lunamaze-signal/10 align-middle font-mono text-sm text-lunamaze-signal">2</span> — two things you can smell.</li>
          <li><span className="mr-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md border border-lunamaze-signal/40 bg-lunamaze-signal/10 align-middle font-mono text-sm text-lunamaze-signal">1</span> — one thing you’re glad about, however small.</li>
        </ul>
      </div>

      {/* --- If you already slipped ---
          Ember rather than amber, and no step rail: this is a different mode,
          not a fourth instrument. */}
      <div
        className="relative overflow-hidden rounded-3xl border p-5 backdrop-blur-sm sm:p-8"
        style={panel(ACCENT_ALT, 0.08, 0.26)}
      >
        <h3 className="text-xl font-bold">If you already slipped tonight</h3>
        <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
          Then this page has one different job: stop the spiral. The binge that follows a slip
          does far more damage than the slip — and the pull to repeat is strongest in the next
          48 hours. No shame session, no “I already failed anyway.” Log it honestly if you
          track, drink some water, go to sleep. One bad night followed by a normal morning is
          a data point, not a collapse.
        </p>
      </div>

      {/* --- Quiet footer links: the one surface that should recede. --- */}
      <div
        className="rounded-3xl border bg-lunamaze-bgSurface/40 p-5 sm:p-8"
        style={{ borderColor: hexA(ACCENT, 0.16) }}
      >
        <p className="text-sm text-lunamaze-textSecondary leading-relaxed">
          Bookmark this page — it works offline-fast, needs no account, and you can send the
          link to a friend who’s struggling without either of you saying a word more.
        </p>
        <p className="mt-4 text-sm text-lunamaze-textSecondary">
          When the wave is down:{' '}
          <Link
            href="/axiom/blog/en/night-urges/"
            className="underline decoration-lunamaze-signal/40 underline-offset-4 hover:text-lunamaze-signal"
          >
            why urges peak at night
          </Link>
          {' '}·{' '}
          <Link
            href="/axiom/tools/severity-test/"
            className="underline decoration-lunamaze-signal/40 underline-offset-4 hover:text-lunamaze-signal"
          >
            the 2-minute self-test
          </Link>
          {' '}·{' '}
          <Link
            href="/axiom/"
            className="underline decoration-lunamaze-signal/40 underline-offset-4 hover:text-lunamaze-signal"
          >
            Axiom, the private tracker
          </Link>
        </p>
      </div>
    </div>
  );
}
