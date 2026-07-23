'use client';

import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';

/**
 * Anonymous severity self-test. Everything runs client-side: no network
 * calls, no storage, no analytics events tied to answers. The result axis is
 * deliberately dual: an honest "Compulsion Load /100" for the person, and a
 * playful "Dopamine Age" that is shareable without naming the topic.
 *
 * This is a self-reflection tool, NOT a diagnostic instrument — the copy
 * says so explicitly, and no band ever claims a diagnosis.
 */

const FREQUENCY_OPTIONS = ['Never', 'Rarely', 'Often', 'Almost always'] as const;

interface CoreQuestion {
  readonly id: string;
  readonly text: string;
}

const CORE_QUESTIONS: ReadonlyArray<CoreQuestion> = [
  { id: 'longer', text: 'I end up watching longer than I intended.' },
  { id: 'failed-stops', text: 'I’ve promised myself to stop or cut down — and it didn’t hold.' },
  { id: 'escalation', text: 'I need more extreme or more novel material than I used to for the same effect.' },
  { id: 'novelty-loop', text: 'I keep browsing for the “perfect” video instead of finishing — tabs pile up.' },
  { id: 'sleep', text: 'I lose sleep to late-night sessions.' },
  { id: 'coping', text: 'It’s the first thing I reach for when I’m stressed, bored, or lonely.' },
  { id: 'salience', text: 'I think about it during the day, or quietly plan my schedule around private time.' },
  { id: 'dulling', text: 'Real-life attraction or intimacy feels duller than it used to.' },
  { id: 'chaser', text: 'Within a day or two of a session, I feel a strong pull to go back.' },
  { id: 'risky', text: 'I’ve used it in places or situations where I really shouldn’t (work, school, near others).' },
  { id: 'shame', text: 'Afterwards I feel shame, or a flat gray mood.' },
  { id: 'hiding', text: 'I hide the evidence — clearing history, private tabs, deleted apps.' },
  { id: 'focus', text: 'My focus or motivation for work or study has suffered because of it.' },
  { id: 'displacement', text: 'I’ve skipped or cut short real plans — people, gym, sleep — for it.' },
  { id: 'restless', text: 'When I try to stop, the urge feels physically restless — hard to sit still.' },
  { id: 'creep', text: 'Sessions have crept earlier into my day, or become more frequent.' },
];

interface ProfileQuestion {
  readonly id: string;
  readonly text: string;
  readonly options: ReadonlyArray<string>;
}

const PROFILE_QUESTIONS: ReadonlyArray<ProfileQuestion> = [
  {
    id: 'years',
    text: 'How long has the habit been at roughly its current level?',
    options: ['Under a year', '1–3 years', '3–7 years', 'More than 7 years'],
  },
  {
    id: 'daily',
    text: 'On a typical day it uses up…',
    options: ['Under 20 minutes', '20–60 minutes', '1–2 hours', 'More than 2 hours'],
  },
];

const TOTAL_STEPS = CORE_QUESTIONS.length + PROFILE_QUESTIONS.length;

interface Band {
  readonly name: string;
  readonly range: string;
  readonly read: string;
  readonly timelineNote: string;
}

function bandFor(score: number): Band {
  if (score < 25) {
    return {
      name: 'Light load',
      range: '0–24',
      read:
        'Your answers don’t show the classic compulsion pattern. The habit exists, but it doesn’t appear to be running your schedule, your sleep, or your mood. That’s genuinely good news — and the easiest time to change course is exactly now, before the loop deepens. The main thing to watch is drift: escalation and time-creep are gradual, and almost nobody notices the slope while they’re on it.',
      timelineNote:
        'If you quit at this level, most people report a fairly mild arc — expect some restlessness in the first two weeks, possibly a brief flat patch, and a comparatively quick return to baseline.',
    };
  }
  if (score < 50) {
    return {
      name: 'Moderate load',
      range: '25–49',
      read:
        'There’s a real pattern here: some loss of control, some mood or schedule cost, and probably a familiar time of day when it happens. This is the range where most people live for years — it’s uncomfortable enough to think about, but not painful enough to force a decision. The honest read: it rarely stays flat. Habits with a reward loop this strong tend to drift up, not down, unless something changes.',
      timelineNote:
        'Quitting from this level usually means a noisy first two weeks, a real chance of a flatline (a gray, zero-libido stretch around weeks 2–6 that is a healing sign, not damage), and clear improvement by weeks 6–12.',
    };
  }
  if (score < 75) {
    return {
      name: 'Heavy load',
      range: '50–74',
      read:
        'Your answers show most of the signature marks of a compulsive loop: failed attempts to stop, escalation, mood cost, and real interference with sleep, focus, or people. That’s not a character verdict — it’s what a heavily trained reward loop looks like from the inside, and it’s the exact profile that most of the recovery playbook was written for. The single most important thing to know at this level: willpower-only attempts have a terrible track record. Structure — tracking the pattern, changing the phone’s bedtime, telling one person — is what actually moves this band.',
      timelineNote:
        'From this level, expect the full arc: a loud first two weeks, a likely flatline in weeks 2–6 (plan for it — it’s the stage that convinces people they’re broken), steady returns in weeks 6–12, and consolidation over months 3–6. Heavier training simply takes longer to unwind. That’s physics, not failure.',
    };
  }
  return {
    name: 'Severe load',
    range: '75–100',
    read:
      'Your answers indicate the loop is carrying a lot of weight in your life right now — control, escalation, mood, sleep, and real-world costs all showing at once. Two things are true at the same time: this level is genuinely hard to change alone, and people at exactly this level recover constantly. What separates the ones who make it is rarely willpower — it’s structure and honesty: a tracked pattern, a changed environment, and at least one human being who knows. If any part of this is tangled with depression, anxiety, or thoughts of harming yourself, talking to a doctor or therapist isn’t a detour from recovery — it’s part of it.',
    timelineNote:
      'From this level the arc is real but longer: a loud, uncomfortable first stretch, a deep flatline that can arrive in weeks 2–6 and outstay its welcome, then genuine recovery through months 2–6 and beyond. Long, heavy training can take a year to fully quiet down. Every week of it counts, whether or not it feels like it.',
  };
}

/**
 * Dopamine Age: a deliberately playful, explicitly non-scientific rendering
 * of the same score on an age axis — the shareable number that doesn't
 * confess anything. 18 at zero load, capped at 80.
 */
function dopamineAge(score: number, yearsIdx: number, dailyIdx: number): number {
  const raw = 18 + score * 0.5 + yearsIdx * 3 + dailyIdx * 3;
  return Math.min(80, Math.round(raw));
}

export default function SeverityTest(): JSX.Element {
  const [step, setStep] = useState<number>(-1); // -1 = intro screen
  const [coreAnswers, setCoreAnswers] = useState<ReadonlyArray<number | null>>(
    CORE_QUESTIONS.map(() => null),
  );
  const [profileAnswers, setProfileAnswers] = useState<ReadonlyArray<number | null>>(
    PROFILE_QUESTIONS.map(() => null),
  );
  const [copied, setCopied] = useState<boolean>(false);

  const answeredAll =
    coreAnswers.every((a) => a !== null) && profileAnswers.every((a) => a !== null);

  const result = useMemo(() => {
    if (!answeredAll) return null;
    const sum = coreAnswers.reduce<number>((acc, a) => acc + (a ?? 0), 0);
    const score = Math.round((sum / (CORE_QUESTIONS.length * 3)) * 100);
    const yearsIdx = profileAnswers[0] ?? 0;
    const dailyIdx = profileAnswers[1] ?? 0;
    return {
      score,
      band: bandFor(score),
      age: dopamineAge(score, yearsIdx, dailyIdx),
      longHabit: yearsIdx >= 2,
    };
  }, [answeredAll, coreAnswers, profileAnswers]);

  const showResult = step >= TOTAL_STEPS && result !== null;

  function answerCore(index: number, value: number): void {
    setCoreAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
    setStep((s) => s + 1);
  }

  function answerProfile(index: number, value: number): void {
    setProfileAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
    setStep((s) => s + 1);
  }

  function restart(): void {
    setStep(-1);
    setCoreAnswers(CORE_QUESTIONS.map(() => null));
    setProfileAnswers(PROFILE_QUESTIONS.map(() => null));
    setCopied(false);
  }

  async function share(): Promise<void> {
    if (!result) return;
    const text = `My Dopamine Age is ${result.age} (reward-system load ${result.score}/100). Find yours — free, anonymous, 2 minutes: https://lunamaze.com/axiom/tools/severity-test/`;
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // User cancelled the share sheet, or clipboard was denied — nothing to do.
    }
  }

  const optionButton =
    'w-full rounded-xl border border-lunamaze-border bg-lunamaze-bgSurface/60 px-5 py-4 text-left text-base transition-colors hover:border-lunamaze-signal hover:text-lunamaze-signal focus:outline-none focus-visible:ring-2 focus-visible:ring-lunamaze-signal';

  // ---------- Intro ----------
  if (step === -1) {
    return (
      <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold">18 questions. About 2 minutes.</h2>
        <p className="mt-4 text-lunamaze-textSecondary leading-relaxed">
          Answer honestly — nobody is watching. This page runs entirely in your browser:
          your answers are never sent anywhere, never stored, and disappear when you close
          the tab.
        </p>
        <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
          You’ll get a Compulsion Load score out of 100, your Dopamine Age, and an honest
          read of what the number does — and doesn’t — mean.
        </p>
        <button
          type="button"
          onClick={() => setStep(0)}
          className="mt-8 rounded-xl bg-lunamaze-signal px-8 py-4 font-semibold text-lunamaze-bgDeep transition-opacity hover:opacity-90"
        >
          Start the test
        </button>
        <p className="mt-6 text-xs text-lunamaze-textDim">
          A self-reflection tool, not a medical diagnosis. If you’re in real distress,
          talk to a doctor or therapist — that’s not a detour from recovery, it’s part
          of it.
        </p>
      </div>
    );
  }

  // ---------- Result ----------
  if (showResult && result) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-lunamaze-signal">Your result</p>
          <div className="mt-6 flex flex-wrap gap-10">
            <div>
              <p className="text-5xl font-extrabold">{result.score}<span className="text-2xl text-lunamaze-textDim">/100</span></p>
              <p className="mt-2 text-sm text-lunamaze-textSecondary">Compulsion Load</p>
            </div>
            <div>
              <p className="text-5xl font-extrabold">{result.age}</p>
              <p className="mt-2 text-sm text-lunamaze-textSecondary">Dopamine Age</p>
            </div>
          </div>
          <p className="mt-6 inline-block rounded-full border border-lunamaze-border px-4 py-1.5 text-sm text-lunamaze-textPrimary">
            {result.band.name} · band {result.band.range}
          </p>
          <p className="mt-6 text-lunamaze-textSecondary leading-relaxed">{result.band.read}</p>
          <p className="mt-4 text-xs text-lunamaze-textDim">
            Dopamine Age is an illustration of the same score on an age axis — a way to talk
            about the number without naming the topic. It is not a medical measurement, and
            neither score is a diagnosis.
          </p>
        </div>

        <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold">What your timeline likely looks like</h3>
          <p className="mt-4 text-lunamaze-textSecondary leading-relaxed">{result.band.timelineNote}</p>
          {result.longHabit && (
            <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
              Because the habit has run for years, give the far end of every range extra
              room — a loop practiced that long doesn’t fully quiet down in ninety days,
              and that’s normal, not a defect.
            </p>
          )}
          <p className="mt-4 text-sm text-lunamaze-textSecondary">
            The full stage-by-stage map, including the flatline nobody warns you about:{' '}
            <Link
              href="/axiom/blog/en/rewire-timeline/"
              className="underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-signal"
            >
              the honest rewiring timeline
            </Link>
            {' '}·{' '}
            <Link
              href="/axiom/blog/en/night-urges/"
              className="underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-signal"
            >
              why urges peak at night
            </Link>
          </p>
        </div>

        <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold">If you want to act on this</h3>
          <p className="mt-4 text-lunamaze-textSecondary leading-relaxed">
            Axiom is our recovery companion: it tracks your pattern (including your personal
            danger hour), maps your progress against the honest timeline, and keeps everything
            on your phone — nothing you log ever leaves it.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/axiom/"
              className="rounded-xl bg-lunamaze-signal px-6 py-3 font-semibold text-lunamaze-bgDeep transition-opacity hover:opacity-90"
            >
              See how Axiom works
            </Link>
            <button
              type="button"
              onClick={() => void share()}
              className="rounded-xl border border-lunamaze-border px-6 py-3 font-semibold transition-colors hover:border-lunamaze-signal hover:text-lunamaze-signal"
            >
              {copied ? 'Copied!' : 'Share your Dopamine Age'}
            </button>
            <button
              type="button"
              onClick={restart}
              className="text-sm text-lunamaze-textDim underline underline-offset-4 hover:text-lunamaze-textPrimary"
            >
              Retake
            </button>
          </div>
          <p className="mt-4 text-xs text-lunamaze-textDim">
            The share text mentions only your Dopamine Age — not this topic.
          </p>
        </div>
      </div>
    );
  }

  // ---------- Questions ----------
  const isCore = step < CORE_QUESTIONS.length;
  const profileIdx = step - CORE_QUESTIONS.length;
  const questionText = isCore
    ? CORE_QUESTIONS[step].text
    : PROFILE_QUESTIONS[profileIdx].text;
  const options: ReadonlyArray<string> = isCore
    ? FREQUENCY_OPTIONS
    : PROFILE_QUESTIONS[profileIdx].options;

  return (
    <div className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-lunamaze-textDim">
        <span>
          {step + 1} / {TOTAL_STEPS}
        </span>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="underline underline-offset-4 hover:text-lunamaze-textPrimary"
          >
            Back
          </button>
        )}
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-lunamaze-border">
        <div
          className="h-full rounded-full bg-lunamaze-signal transition-all"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
      <p className="mt-8 text-xl font-semibold leading-snug">{questionText}</p>
      <div className="mt-6 space-y-3">
        {options.map((label, i) => (
          <button
            key={label}
            type="button"
            className={optionButton}
            onClick={() => (isCore ? answerCore(step, i) : answerProfile(profileIdx, i))}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
