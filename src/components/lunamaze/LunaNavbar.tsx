'use client';

import type { JSX } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { internalUrl } from '@/lib/paths';

export interface NavAnchor {
  readonly id: string;
  readonly label: string;
}

export interface LunaNavbarProps {
  readonly anchors?: ReadonlyArray<NavAnchor>;
}

const DEFAULT_ANCHORS: ReadonlyArray<NavAnchor> = [
  { id: 'studio', label: 'Studio' },
  { id: 'products', label: 'Products' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'founder', label: 'Founder' },
  { id: 'contact', label: 'Contact' },
] as const;

export default function LunaNavbar({
  anchors = DEFAULT_ANCHORS,
}: LunaNavbarProps = {}): JSX.Element {
  const { scrollY } = useScroll();
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
    <motion.header initial={{ y: 0 }} className="fixed top-0 inset-x-0 z-50">
      <motion.div
        style={{ backgroundColor, borderBottomColor }}
        className="border-b backdrop-blur-md"
      >
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 h-16 flex items-center justify-between">
          <a
            href="#hero"
            className="text-base font-semibold tracking-tight text-lunamaze-textPrimary hover:text-lunamaze-violetLight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight rounded"
          >
            Luna Maze
          </a>

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
