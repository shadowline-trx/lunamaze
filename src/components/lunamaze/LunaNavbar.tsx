import type { JSX } from 'react';
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

/**
 * CSS-only navigation keeps the home page cinematic without loading the
 * Framer Motion runtime merely to tint a header while scrolling.
 */
export default function LunaNavbar({
  anchors = DEFAULT_ANCHORS,
}: LunaNavbarProps = {}): JSX.Element {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="lunamaze-nav-surface border-b">
        <nav
          className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 h-16 flex items-center justify-between"
          aria-label="Primary navigation"
        >
          <a
            href="#hero"
            className="inline-flex min-h-12 items-center text-base font-semibold tracking-tight text-lunamaze-textPrimary hover:text-lunamaze-violetLight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight rounded"
          >
            Luna Maze
          </a>

          <div className="hidden md:flex items-center gap-7 lg:gap-8">
            {anchors.map((anchor) => (
              <a
                key={anchor.id}
                href={`#${anchor.id}`}
                className="inline-flex min-h-12 items-center text-sm text-lunamaze-textSecondary hover:text-lunamaze-textPrimary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight rounded"
              >
                {anchor.label}
              </a>
            ))}
          </div>

          <a
            href={internalUrl('/kern/')}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/75 px-4 text-xs sm:text-sm font-medium text-lunamaze-textPrimary hover:border-lunamaze-signal/60 hover:text-lunamaze-signal transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight"
          >
            <span className="sm:hidden">Kern</span>
            <span className="hidden sm:inline">Explore Kern</span>
            <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
