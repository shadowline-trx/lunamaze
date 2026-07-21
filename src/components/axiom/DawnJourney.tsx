'use client';

/**
 * DawnJourney — the page's midnight → dawn scroll spine.
 *
 * A single fixed background layer whose color is driven by overall scroll
 * progress: near-black at the hero, warming through violet-tinted darks toward
 * a deep indigo pre-dawn by the time you reach the finale (where the section's
 * own dawn gradient + earned green take over). Deliberately SUBTLE — the middle
 * sections must still read crisp and premium; this is a felt descent, not a
 * loud gradient. Reduced-motion users get a static mid value.
 */

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export default function DawnJourney() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const bg = useTransform(
    scrollYProgress,
    [0, 0.5, 0.82, 1],
    ['#08070C', '#0a0714', '#0f0a20', '#171130'],
  );
  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 -z-20"
      style={{ backgroundColor: reduce ? '#0b0816' : bg }}
    />
  );
}
