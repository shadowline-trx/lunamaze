'use client';

import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';

/**
 * Rewire timeline calculator. Three inputs → a day-by-day milestone map with
 * every range stretched by a load multiplier derived from the user's history.
 * Entirely client-side: no network calls, no storage.
 *
 * Honesty rules: every number is a range, the copy repeats that nobody can
 * promise a date, and the heavy-profile note says plainly that long training
 * takes longer to unwind.
 */

interface InputQuestion {
  readonly id: 'years' | 'daily' | 'age';
  readonly label: string;
  readonly options: ReadonlyArray<string>;
}

const INPUTS: ReadonlyArray<InputQuestion> = [
  {
    id: 'years',
    label: 'How long has the habit run at roughly its current level?',
    options: ['Under a year', '1–3 years', '3–7 years', 'More than 7 years'],
  },
  {
    id: 'daily',
    label: 'How much of a typical day does it take?',
    options: ['Occasional — not most days', 'Most days, under an hour', 'Daily, 1–2 hours', 'Daily, 2+ hours or multiple sessions'],
  },
  {
    id: 'age',
    label: 'Your age bracket?',
    options: ['Under 20', '20–29', '30–39', '40 or older'],
  },
];

interface Milestone {
  /** Baseline start/end day for a moderate profile; scaled by the multiplier. */
  readonly from: number;
  readonly to: number;
  readonly title: string;
  readonly text: string;
}

const MILESTONES: ReadonlyArray<Milestone> = [
  {
    from: 1,
    to: 5,
    title: 'The loud start',
    text: 'Urges arrive in waves, often at very predictable hours — late night is the classic window. Irritability and restless sleep are common and normal. A wave crests and passes in 10–20 minutes whether you act or not; surviving one on purpose is the single most useful skill of the whole arc.',
  },
  {
    from: 7,
    to: 14,
    title: 'The pattern becomes visible',
    text: 'By now your urges have a shape: a time of day, certain weekdays, certain moods. If you log honestly, this is when your personal danger hour appears in the data — and a scheduled enemy is far easier to beat than a random one.',
  },
  {
    from: 14,
    to: 42,
    title: 'Flatline risk window',
    text: 'Somewhere in this stretch many people hit the flatline: libido near zero, mood gray, motivation flat. It feels like damage. It is the opposite — the trough of recalibration. The one mistake that reliably deepens and extends it is relapsing "to test if everything still works". Do not take the bait.',
  },
  {
    from: 35,
    to: 60,
    title: 'First real returns',
    text: 'The gray lifts in small, unannounced ways: music has color again, mornings feel lighter, real people register as attractive. Most people notice the flatline ended only in hindsight.',
  },
  {
    from: 42,
    to: 84,
    title: 'The quiet stretch — and its trap',
    text: 'Focus holds longer, urges knock instead of sirening. This is also the second most dangerous phase: "I’m basically fixed" precedes a shocking number of relapses around week nine, and the chaser effect — the pull to binge within 48 hours of a single slip — is still fully loaded.',
  },
  {
    from: 90,
    to: 90,
    title: 'Day 90 — a landmark, not a finish line',
    text: 'No study validates 90 days as a universal rewiring period; it is a community convention that survives because it is a reasonable mid-course marker. Lighter histories often feel normal sooner. Heavier ones genuinely need longer — that is physics, not failure.',
  },
  {
    from: 90,
    to: 180,
    title: 'Consolidation',
    text: 'The loud symptoms are mostly gone. The work changes character: not surviving urges, but not re-carving the old path under stress, boredom, insomnia, or loneliness — whatever your original trigger was.',
  },
];

interface CalculatorResult {
  readonly multiplier: number;
  readonly milestones: ReadonlyArray<{ from: number; to: number; title: string; text: string }>;
  readonly normalFrom: number;
  readonly normalTo: number;
  readonly heavy: boolean;
}

function computeResult(years: number, daily: number, age: number): CalculatorResult {
  // Load 0..1 from history; age nudges it slightly (older loops unwind a bit
  // slower on average, but neuroplasticity never goes to zero).
  const load = (years / 3) * 0.45 + (daily / 3) * 0.4 + (age / 3) * 0.15;
  const multiplier = 0.7 + 0.9 * load; // 0.7x (light) … 1.6x (heaviest)

  const scale = (d: number): number => Math.max(1, Math.round(d * multiplier));
  const milestones = MILESTONES.map((m) => ({
    ...m,
    from: scale(m.from),
    to: scale(m.to),
  }));

  return {
    multiplier,
    milestones,
    normalFrom: scale(60),
    normalTo: scale(150),
    heavy: load > 0.66,
  };
}

export default function RewireCalculator(): JSX.Element {
  const [answers, setAnswers] = useState<Readonly<Record<InputQuestion['id'], number | null>>>({
    years: null,
    daily: null,
    age: null,
  });

  const result = useMemo(() => {
    if (answers.years === null || answers.daily === null || answers.age === null) return null;
    return computeResult(answers.years, answers.daily, answers.age);
  }, [answers]);

  const optionButton = (selected: boolean): string =>
    `rounded-xl border px-4 py-3 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lunamaze-signal ${
      selected
        ? 'border-lunamaze-signal text-lunamaze-signal bg-lunamaze-bgSurface/80'
        : 'border-lunamaze-border bg-lunamaze-bgSurface/60 hover:border-lunamaze-signal'
    }`;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold">Three questions. Your map.</h2>
        <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
          Everything runs in your browser — nothing you select is sent or stored anywhere.
        </p>
        <div className="mt-8 space-y-8">
          {INPUTS.map((q) => (
            <div key={q.id}>
              <p className="font-semibold">{q.label}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {q.options.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    className={optionButton(answers[q.id] === i)}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: i }))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {result && (
        <>
          <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-lunamaze-signal">Your realistic window</p>
            <p className="mt-4 text-3xl sm:text-4xl font-extrabold">
              Day {result.normalFrom}–{result.normalTo}
            </p>
            <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
              is when someone with your history most plausibly starts reporting that most days
              feel normal — urges present but negotiable, mood and focus back. It is a range,
              not a promise: nobody can name your exact date, and anyone who does is guessing.
            </p>
            {result.heavy && (
              <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
                With a history this long or heavy, give the far end of every range extra room —
                a loop practiced for years does not fully quiet down in ninety days, and needing
                longer is normal, not a defect. Some of the deepest recoveries on record started
                exactly where you are.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold">Day by day, stretched to your history</h3>
            <ol className="mt-6 space-y-6 border-l border-lunamaze-border pl-6">
              {result.milestones.map((m) => (
                <li key={m.title} className="relative">
                  <span
                    className="absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full bg-lunamaze-signal"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-mono text-lunamaze-signal">
                    {m.from === m.to ? `≈ Day ${m.from}` : `≈ Day ${m.from}–${m.to}`}
                  </p>
                  <h4 className="mt-1 font-semibold">{m.title}</h4>
                  <p className="mt-2 text-sm text-lunamaze-textSecondary leading-relaxed">{m.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs text-lunamaze-textDim">
              Ranges are scaled from commonly reported recovery arcs by a load factor built
              from your three answers (×{result.multiplier.toFixed(2)} here). They describe the
              shape of the process, not a schedule your brain has agreed to.
            </p>
          </div>

          <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold">Walk the map with company</h3>
            <p className="mt-4 text-lunamaze-textSecondary leading-relaxed">
              Axiom tracks your recovery against this exact arc — including the flatline window
              and your personal danger hour — privately. Nothing you log ever leaves your phone.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/axiom/"
                className="rounded-xl bg-lunamaze-signal px-6 py-3 font-semibold text-lunamaze-bgDeep transition-opacity hover:opacity-90"
              >
                See how Axiom works
              </Link>
              <Link
                href="/axiom/tools/severity-test/"
                className="rounded-xl border border-lunamaze-border px-6 py-3 font-semibold transition-colors hover:border-lunamaze-signal hover:text-lunamaze-signal"
              >
                Not sure how heavy it is? Take the test
              </Link>
            </div>
            <p className="mt-4 text-sm text-lunamaze-textSecondary">
              Deep dives:{' '}
              <Link
                href="/axiom/blog/en/rewire-timeline/"
                className="underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-signal"
              >
                the honest timeline
              </Link>
              {' '}·{' '}
              <Link
                href="/axiom/blog/en/flatline/"
                className="underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-signal"
              >
                the flatline
              </Link>
              {' '}·{' '}
              <Link
                href="/axiom/blog/en/night-urges/"
                className="underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-signal"
              >
                night urges
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
