'use client';

/**
 * RecoveryPhases — the science under the streak.
 *
 * Replaces the app-screenshot showcase with something that needs no staged
 * imagery and leans on AXIOM's real story: recovery has a shape, grounded in
 * the science of dopamine, and the app maps your clean days onto it. A single
 * horizontal spine fills as you scroll, with four phase nodes strung along it.
 *
 * Deliberately breaks the page's centered max-w-6xl rhythm: a wide, left-aligned
 * editorial header over a four-across rail. Reduced motion shows the spine
 * already full and drops the reveal; below `lg` the rail stacks and the spine
 * hides (it only reads horizontally).
 */

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const DISPLAY = 'font-[family-name:var(--font-display)]';
const MONO = 'font-[family-name:var(--font-mono)]';

type Phase = {
  range: string;
  title: string;
  body: string;
};

const PHASES: readonly Phase[] = [
  {
    range: 'Days 1–7',
    title: 'The reset',
    body: 'The hardest stretch. Dopamine receptors begin to recover and urges spike hardest. The panic tools are built for exactly this moment.',
  },
  {
    range: 'Weeks 2–4',
    title: 'The fog lifts',
    body: 'Sleep, focus and mood start to steady as your baseline resets. The daily brief keeps you oriented on the harder mornings.',
  },
  {
    range: 'Weeks 4–8',
    title: 'Rewiring',
    body: 'New defaults slowly replace the old loops. The pattern engine learns your risk windows from your own check-ins.',
  },
  {
    range: 'Beyond',
    title: 'A new baseline',
    body: 'Reward sensitivity returns to the ordinary things again. Not white-knuckling every day. Rebuilt.',
  },
];

export default function RecoveryPhases() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'end 65%'],
  });
  // The spine fills left-to-right as the section passes through the viewport.
  const rawFill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const fill = reduce ? 1 : rawFill;

  return (
    <section id="science" className="relative mx-auto max-w-7xl px-6 py-28">
      <div className="max-w-2xl">
        <p className={`mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-axiom-primaryLight ${MONO}`}>
          The science under the streak
        </p>
        <h2 className={`${DISPLAY} text-4xl font-semibold tracking-tight sm:text-5xl`}>
          Your brain on the mend, week by week.
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-axiom-textSecondary">
          Recovery is not willpower running on empty. It is a physical process
          with a shape, and AXIOM maps your clean days onto the real phases of
          dopamine repair so you can see where you are and why this week feels
          the way it does.
        </p>
      </div>

      <div ref={ref} className="relative mt-16 lg:mt-20">
        {/* The spine — horizontal on desktop only. Base track + a gradient
            fill that grows with scroll. */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-[6px] hidden h-px bg-white/[0.08] lg:block"
        />
        <motion.div
          aria-hidden
          style={{ scaleX: fill }}
          className="absolute left-0 right-0 top-[6px] hidden h-px origin-left bg-gradient-to-r from-axiom-primary via-axiom-primaryLight to-axiom-streak lg:block"
        />

        <div className="grid gap-y-12 lg:grid-cols-4 lg:gap-x-10">
          {PHASES.map((phase, i) => (
            <motion.div
              key={phase.range}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Node dot sitting on the spine */}
              <span
                aria-hidden
                className="mb-6 block h-3 w-3 rounded-full bg-axiom-primaryLight shadow-[0_0_0_4px_rgba(108,92,231,0.15),0_0_16px_rgba(108,92,231,0.6)]"
              />
              <p className={`text-[11px] uppercase tracking-[0.2em] text-axiom-textDim ${MONO}`}>
                {phase.range}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-axiom-textPrimary">
                {phase.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-axiom-textSecondary">
                {phase.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Honesty note — on-brand, and keeps the timeline from over-promising. */}
      <p className="mt-14 max-w-2xl text-sm leading-relaxed text-axiom-textDim">
        Recovery is not linear and everyone is different. This is the shape of
        it, not a promise about your week.
      </p>
    </section>
  );
}
