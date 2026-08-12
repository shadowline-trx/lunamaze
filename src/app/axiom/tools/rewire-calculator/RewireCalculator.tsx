'use client';

import type { CSSProperties, JSX } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
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

/* --------------------------------------------------------------------------
   Surface language.

   Cyan is the site's colour for time and progression, so this tool wears it
   end to end — hero aurora, eyebrow, every card edge. The border token
   (#22264A) is effectively invisible on #06081A, which is why the old page
   read as a flat stack of identical rectangles; panels take their edge from
   the accent at low alpha instead, the same way ToolCard does.

   Each tier is deliberately different: the questions panel is quiet, the
   result panel is the loudest thing on the page (band + bloom + gradient
   number), the timeline carries a lit spine, and the CTA leans violet so it
   reads as "the product" rather than "more result".
   -------------------------------------------------------------------------- */
const ACCENT = '#00D2FF';
const ACCENT_ALT = '#7B5CFF';
const ACCENT_RGB = '0, 210, 255';
const ACCENT_ALT_RGB = '123, 92, 255';

/** Accent-edged glass panel. `tint` = accent wash, `edge` = border alpha. */
function panel(tint: number, edge: number): CSSProperties {
  return {
    borderColor: `rgba(${ACCENT_RGB}, ${edge})`,
    background: `linear-gradient(160deg, rgba(${ACCENT_RGB}, ${tint}) 0%, rgba(18, 23, 55, 0.78) 55%)`,
    boxShadow: `0 1px 0 0 rgba(${ACCENT_RGB}, 0.12) inset`,
  };
}

const RESULT_PANEL: CSSProperties = {
  borderColor: `rgba(${ACCENT_RGB}, 0.36)`,
  background: `linear-gradient(160deg, rgba(${ACCENT_RGB}, 0.12) 0%, rgba(18, 23, 55, 0.82) 55%)`,
  boxShadow: `0 1px 0 0 rgba(${ACCENT_RGB}, 0.22) inset, 0 30px 70px -40px rgba(${ACCENT_RGB}, 0.8)`,
};

const CTA_PANEL: CSSProperties = {
  borderColor: `rgba(${ACCENT_ALT_RGB}, 0.34)`,
  background: `linear-gradient(160deg, rgba(${ACCENT_ALT_RGB}, 0.14) 0%, rgba(18, 23, 55, 0.82) 55%)`,
  boxShadow: `0 1px 0 0 rgba(${ACCENT_ALT_RGB}, 0.2) inset`,
};

/** Height of the fixed ProductNav (h-16) plus breathing room, so the revealed
 *  result lands below the header rather than tucked under it. */
const NAV_CLEARANCE_PX = 80;

/** Big day-range readout: gradient text, cyan → violet-light. */
const NUMBER_GRADIENT: CSSProperties = {
  background: `linear-gradient(120deg, ${ACCENT} 0%, #A48CFF 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
};

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

  const answeredCount = INPUTS.filter((q) => answers[q.id] !== null).length;

  const resultRef = useRef<HTMLDivElement | null>(null);
  /** Guards the scroll so it fires once, on the transition from "no result" to
   *  "result" — never again when the visitor edits an answer afterwards, which
   *  would yank the page out from under them mid-read. */
  const hasRevealed = useRef<boolean>(false);

  /**
   * The whole point of the page appears BELOW the question panel. On a desktop
   * the result lands in view; on a phone it renders ~1665px down — two full
   * screens — so answering the third question produced no visible change at
   * all. The visitor taps the last option, sees nothing happen, and leaves.
   * This was the single biggest conversion defect on the tool.
   *
   * Two measured constraints shaped how the scroll is performed:
   *
   * 1. `element.scrollIntoView` does not scroll at all on this site. It gets
   *    called with a correct target and the page stays at 0. An explicit
   *    `window.scrollTo` with the same computed target works every time.
   * 2. A SMOOTH scroll issued from a React effect never starts here either —
   *    scrollY sits at 0 for the full animation window, on this tool and on
   *    the severity test independently. `'instant'` works from both. (Note
   *    `'auto'` is not a synonym for instant: it defers to the CSS
   *    `scroll-behavior`, which is `smooth` globally, so it fails the same way.)
   *
   * So the reveal is an instant jump. It reads as a step transition rather than
   * a scroll, which suits the destination: the result panel is the loudest
   * surface on the page — aurora band, bloom, gradient day-range — so there is
   * no ambiguity about where the visitor has landed or what they are looking at.
   */
  useEffect(() => {
    if (!result || hasRevealed.current) return;
    hasRevealed.current = true;
    // Next frame: the result panel mounts in the same commit that sets
    // `result`, so its geometry isn't measurable until after paint.
    const id = window.requestAnimationFrame(() => {
      const el = resultRef.current;
      if (!el) return;
      window.scrollTo({
        top: window.scrollY + el.getBoundingClientRect().top - NAV_CLEARANCE_PX,
        behavior: 'instant',
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [result]);

  const optionButton = (selected: boolean): string =>
    `ax-press-wide rounded-xl border px-4 py-3.5 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-axiom-calm/70 ${
      selected
        ? 'border-axiom-calm/70 bg-axiom-calm/10 text-axiom-calm shadow-[0_0_24px_-10px_rgba(0,210,255,0.95)]'
        : 'border-axiom-calm/20 bg-lunamaze-bgSurface/50 hover:border-axiom-calm/50 hover:bg-axiom-calm/5'
    }`;

  return (
    <div className="space-y-5">
      <div
        className="relative overflow-hidden rounded-3xl border p-5 backdrop-blur-sm sm:p-9"
        style={panel(0.05, 0.22)}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -left-20 h-64 w-64 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, rgba(${ACCENT_RGB}, 0.2) 0%, transparent 70%)` }}
        />
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Three questions. Your map.</h2>
          <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
            Everything runs in your browser — nothing you select is sent or stored anywhere.
          </p>
          <div className="mt-8 space-y-8">
            {INPUTS.map((q, qi) => (
              <div key={q.id}>
                {/* Numbering the questions is what turns three unlabelled
                    blocks into a flow with a visible end. On a phone only one
                    question is ever on screen, so without it the visitor has
                    no idea how much is left — the commonest reason to abandon
                    a form is not knowing whether it's nearly over. */}
                <p className="font-semibold">
                  <span className="mr-2 font-mono text-sm text-axiom-calm">{qi + 1}/{INPUTS.length}</span>
                  {q.label}
                </p>
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
          {/* Standing in for the result until it exists: the panel is a full
              screen tall on a phone, so without this the last thing under the
              final option row is empty space. */}
          {!result && (
            <p className="mt-8 text-sm text-lunamaze-textDim">
              {answeredCount === 0
                ? 'Answer all three and your map appears here.'
                : `${INPUTS.length - answeredCount} to go — then your map appears.`}
            </p>
          )}
        </div>
      </div>

      {result && (
        <>
          <div
            ref={resultRef}
            className="relative scroll-mt-20 overflow-hidden rounded-3xl border backdrop-blur-sm"
            style={RESULT_PANEL}
          >
            {/* The one loud surface on the page: this is the answer the visitor
                came for, so it gets an aurora band and a bloom of its own. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1"
              style={{
                background: `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT_ALT} 65%, transparent 100%)`,
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 right-[-10%] h-64 w-64 rounded-full blur-3xl"
              style={{ background: `radial-gradient(circle, rgba(${ACCENT_RGB}, 0.3) 0%, transparent 70%)` }}
            />
            <div className="relative p-5 sm:p-9">
              <p className="text-xs uppercase tracking-[0.3em] text-axiom-calm">Your realistic window</p>
              <p
                className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight"
                style={NUMBER_GRADIENT}
              >
                Day {result.normalFrom}–{result.normalTo}
              </p>
              <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
                is when someone with your history most plausibly starts reporting that most days
                feel normal — urges present but negotiable, mood and focus back. It is a range,
                not a promise: nobody can name your exact date, and anyone who does is guessing.
              </p>
              {result.heavy && (
                <p
                  className="mt-5 rounded-2xl border p-5 text-lunamaze-textSecondary leading-relaxed"
                  style={{
                    borderColor: `rgba(${ACCENT_ALT_RGB}, 0.3)`,
                    background: `rgba(${ACCENT_ALT_RGB}, 0.08)`,
                  }}
                >
                  With a history this long or heavy, give the far end of every range extra room —
                  a loop practiced for years does not fully quiet down in ninety days, and needing
                  longer is normal, not a defect. Some of the deepest recoveries on record started
                  exactly where you are.
                </p>
              )}
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-3xl border p-5 backdrop-blur-sm sm:p-9"
            style={panel(0.05, 0.24)}
          >
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Day by day, stretched to your history
            </h3>
            {/* Lit spine: the arc is the point, so the rail carries the accent
                and fades out at the far end instead of being a dead 1px token. */}
            <div className="relative mt-6">
              <span
                aria-hidden="true"
                className="absolute left-0 top-2 bottom-2 w-px"
                style={{
                  background: `linear-gradient(to bottom, rgba(${ACCENT_RGB}, 0.75) 0%, rgba(${ACCENT_ALT_RGB}, 0.5) 55%, rgba(${ACCENT_RGB}, 0.05) 100%)`,
                }}
              />
              <ol className="space-y-7 pl-6">
                {result.milestones.map((m) => (
                  <li key={m.title} className="relative">
                    <span
                      className="absolute -left-[1.81rem] top-1.5 h-2.5 w-2.5 rounded-full"
                      style={{
                        background: ACCENT,
                        boxShadow: `0 0 0 3px rgba(${ACCENT_RGB}, 0.14), 0 0 14px rgba(${ACCENT_RGB}, 0.7)`,
                      }}
                      aria-hidden="true"
                    />
                    <p className="text-sm font-mono text-axiom-calm">
                      {m.from === m.to ? `≈ Day ${m.from}` : `≈ Day ${m.from}–${m.to}`}
                    </p>
                    <h4 className="mt-1 font-semibold">{m.title}</h4>
                    <p className="mt-2 text-sm text-lunamaze-textSecondary leading-relaxed">{m.text}</p>
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-6 text-xs text-lunamaze-textDim">
              Ranges are scaled from commonly reported recovery arcs by a load factor built
              from your three answers (×{result.multiplier.toFixed(2)} here). They describe the
              shape of the process, not a schedule your brain has agreed to.
            </p>
          </div>

          <div
            className="relative overflow-hidden rounded-3xl border backdrop-blur-sm"
            style={CTA_PANEL}
          >
            {/* Violet, not cyan: this block is the product, not another result. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 -right-16 h-64 w-64 rounded-full blur-3xl"
              style={{ background: `radial-gradient(circle, rgba(${ACCENT_ALT_RGB}, 0.3) 0%, transparent 70%)` }}
            />
            <div className="relative p-5 sm:p-9">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Walk the map with company</h3>
              <p className="mt-4 text-lunamaze-textSecondary leading-relaxed">
                Axiom tracks your recovery against this exact arc — including the flatline window
                and your personal danger hour — privately. Nothing you log ever leaves your phone.
              </p>
              {/* `hover:-translate-y-0.5` was the only feedback these two
                  carried, and hover does not exist on the devices that see
                  90% of this page. Stacked full-bleed under `sm` as well —
                  the second label is long enough to wrap into a two-line
                  button sitting beside a one-line button. */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Link
                  href="/axiom/"
                  className="ax-press rounded-xl px-6 py-4 text-center font-semibold text-lunamaze-bgDeep sm:py-3"
                  style={{
                    background: `linear-gradient(120deg, ${ACCENT} 0%, #6FD9FF 100%)`,
                    boxShadow: `0 14px 40px -18px rgba(${ACCENT_RGB}, 0.95)`,
                  }}
                >
                  See how Axiom works
                </Link>
                <Link
                  href="/axiom/tools/severity-test/"
                  className="ax-press rounded-xl border px-6 py-4 text-center font-semibold hover:border-lunamaze-violetLight hover:text-lunamaze-violetLight sm:py-3"
                  style={{ borderColor: `rgba(${ACCENT_ALT_RGB}, 0.45)` }}
                >
                  Not sure how heavy it is? Take the test
                </Link>
              </div>
              <p className="mt-5 text-sm text-lunamaze-textSecondary">
                Deep dives:{' '}
                <Link
                  href="/axiom/blog/en/rewire-timeline/"
                  className="underline decoration-axiom-calm/50 underline-offset-4 hover:text-axiom-calm"
                >
                  the honest timeline
                </Link>
                {' '}·{' '}
                <Link
                  href="/axiom/blog/en/flatline/"
                  className="underline decoration-axiom-calm/50 underline-offset-4 hover:text-axiom-calm"
                >
                  the flatline
                </Link>
                {' '}·{' '}
                <Link
                  href="/axiom/blog/en/night-urges/"
                  className="underline decoration-axiom-calm/50 underline-offset-4 hover:text-axiom-calm"
                >
                  night urges
                </Link>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
