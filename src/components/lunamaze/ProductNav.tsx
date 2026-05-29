import type { JSX } from 'react';
import { internalUrl } from '@/lib/paths';

/**
 * ProductNav — slim fixed header for Luna Maze product sub-pages
 * (e.g. `/typecrt/`, `/drift/`).
 *
 * Unlike `LunaNavbar` (which drives in-page scroll anchors on the studio
 * landing), product pages need a "back to studio" affordance and an optional
 * primary action that points at the live product. This keeps a consistent
 * frosted top bar without re-using anchors that don't exist on these routes.
 *
 * The surface is rendered statically (no scroll-linked motion) so it stays a
 * lightweight server component — the heavy visuals on these pages are the
 * WebGL backgrounds, and there's no need to add another client component to
 * the tree.
 *
 * Accessibility: real `<a>` links throughout, each with a visible
 * `focus-visible` ring per the project's accessibility baseline. An external
 * `cta` opens in a new tab with safe `rel` semantics.
 */

export interface ProductNavProps {
  /** Product wordmark shown on the left, e.g. "TypeCrt". */
  readonly product: string;
  /** Optional primary CTA (usually the live product URL). */
  readonly cta?: {
    readonly label: string;
    readonly href: string;
  };
}

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export default function ProductNav({
  product,
  cta,
}: ProductNavProps): JSX.Element {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-lunamaze-border bg-lunamaze-bgDeep/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href={internalUrl('/')}
            className="inline-flex items-center gap-2 text-sm text-lunamaze-textSecondary hover:text-lunamaze-violetLight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight rounded"
          >
            <span aria-hidden="true">←</span>
            <span>Luna Maze</span>
          </a>
          <span aria-hidden="true" className="text-lunamaze-textDim">
            /
          </span>
          <span className="text-base font-semibold tracking-tight text-lunamaze-textPrimary">
            {product}
          </span>
        </div>

        {cta !== undefined && (
          <a
            href={cta.href}
            className="inline-flex items-center gap-2 rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/60 px-4 py-2 text-xs sm:text-sm font-medium text-lunamaze-textPrimary hover:border-lunamaze-violet/60 hover:text-lunamaze-violetLight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight"
            {...(isExternal(cta.href)
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            <span>{cta.label}</span>
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </nav>
    </header>
  );
}
