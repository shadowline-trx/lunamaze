'use client';

import type { JSX } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { internalUrl } from '@/lib/paths';

/**
 * A single anchor entry in the Luna Maze navbar.
 *
 * `id` is the section id on the landing page (without the leading `#`),
 * and `label` is what gets rendered in the nav.
 */
export interface NavAnchor {
  readonly id: string;
  readonly label: string;
}

/**
 * Props for {@link LunaNavbar}.
 *
 * The default `anchors` set covers every Luna Maze section in scroll order
 * (`studio`, `products`, `capabilities`, `founder`, `contact`). Callers may
 * override the list — for example, to render a trimmed nav on a sub-page.
 */
export interface LunaNavbarProps {
  readonly anchors?: ReadonlyArray<NavAnchor>;
}

/**
 * The default in-page anchor set used when no `anchors` prop is supplied.
 *
 * Order matches the Luna Maze landing's section order so the nav reads
 * top-to-bottom as the visitor scrolls.
 */
const DEFAULT_ANCHORS: ReadonlyArray<NavAnchor> = [
  { id: 'studio', label: 'Studio' },
  { id: 'products', label: 'Products' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'founder', label: 'Founder' },
  { id: 'contact', label: 'Contact' },
] as const;

/**
 * Sticky top navigation for the Luna Maze studio site.
 *
 * Behavior:
 *   - Renders a fixed `<motion.header>` pinned to the top with anchor links
 *     to each in-page section plus a "Visit Axiom" pill that routes to
 *     `/axiom/`.
 *   - Starts fully transparent so the hero motif reads cleanly behind it.
 *   - As the visitor scrolls past 80px, Framer Motion's `useTransform`
 *     interpolates the background colour from
 *     `rgba(6, 8, 26, 0)` (transparent midnight) to `rgba(6, 8, 26, 0.9)`
 *     (the `lunamaze.bgDeep` token at 90% opacity), and the bottom border
 *     fades from transparent to the `lunamaze.border` token. This keeps
 *     the nav legible once it overlaps content without flashing on rubber
 *     bands.
 *   - The `backdrop-blur-md` utility supplies the frosted-glass effect
 *     once the surface becomes visible.
 *
 * Mobile: the center anchor list is hidden below `md` (no hamburger needed
 * for this MVP — the wordmark and the "Visit Axiom" pill remain).
 *
 * Accessibility:
 *   - Section anchors are real `<a href="#id">` links so keyboard and
 *     screen-reader users get native fragment navigation.
 *   - Every interactive element exposes a visible
 *     `focus-visible:outline-*` ring per the project's accessibility
 *     baseline.
 *
 * Validates: Requirements 1.4, 1.5, 9.5, 12.1, 12.2, 12.3, 12.4.
 */
export default function LunaNavbar({
  anchors = DEFAULT_ANCHORS,
}: LunaNavbarProps = {}): JSX.Element {
  const { scrollY } = useScroll();

  // Interpolate background and border colours directly off scrollY so the
  // visual update happens inside Framer's rAF loop without React re-renders.
  // The 0–80px window matches the height of the navbar plus a small buffer
  // so the fade completes shortly after the hero leaves the viewport.
  const backgroundColor = useTransform(
    scrollY,
    [0, 80],
    ['rgba(6, 8, 26, 0)', 'rgba(6, 8, 26, 0.9)'],
  );
  const borderBottomColor = useTransform(
    scrollY,
    [0, 80],
    ['rgba(34, 38, 74, 0)', 'rgba(34, 38, 74, 1)'],
  );

  return (
    <motion.header
      initial={{ y: 0 }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <motion.div
        style={{ backgroundColor, borderBottomColor }}
        className="border-b backdrop-blur-md"
      >
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 h-16 flex items-center justify-between">
          {/* Left: studio wordmark, anchors back to the top of the page. */}
          <a
            href="#hero"
            className="text-base font-semibold tracking-tight text-lunamaze-textPrimary hover:text-lunamaze-violetLight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight rounded"
          >
            Luna Maze
          </a>

          {/* Center: in-page section anchors (hidden on mobile). */}
          <div className="hidden md:flex items-center gap-8">
            {anchors.map((anchor) => (
              <a
                key={anchor.id}
                href={`#${anchor.id}`}
                className="text-sm text-lunamaze-textSecondary hover:text-lunamaze-textPrimary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight rounded"
              >
                {anchor.label}
              </a>
            ))}
          </div>

          {/* Right: cross-link to the relocated Axiom site. */}
          <a
            href={internalUrl('/axiom/')}
            className="inline-flex items-center gap-2 rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/60 px-4 py-2 text-xs sm:text-sm font-medium text-lunamaze-textPrimary hover:border-lunamaze-violet/60 hover:text-lunamaze-violetLight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight"
          >
            <span>Visit Axiom</span>
            <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </motion.div>
    </motion.header>
  );
}
