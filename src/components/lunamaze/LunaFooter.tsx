import type { JSX } from 'react';
import { founderSocials } from '@/content/lunamaze';
import { internalUrl } from '@/lib/paths';

/**
 * Computed once at module evaluation time so server render and client
 * hydration agree on the same year. The Luna Maze site ships as a static
 * export, so this value is fixed at build time and there is no SSR/CSR
 * drift risk.
 */
const YEAR: number = new Date().getFullYear();

/**
 * Luna Maze studio footer.
 *
 * Closes every Luna Maze page with the studio wordmark, a current-year
 * copyright line, a small navigation row pointing at the relocated Axiom
 * site and the in-page Studio, Products, and Contact sections, and a
 * compact row of external social links sourced from the `founderSocials`
 * content module (with the email entry filtered out, since the contact
 * section already owns the mailto CTA).
 *
 * External social links carry `target="_blank"` and
 * `rel="noopener noreferrer"` to satisfy the external link safety
 * requirement.
 *
 * Validates: Requirements 1.2, 9.5, 12.1, 12.2, 12.3, 12.4.
 */
export default function LunaFooter(): JSX.Element {
  return (
    <footer className="relative border-t border-lunamaze-border bg-lunamaze-bgDeep px-6 sm:px-8 lg:px-16 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <a
            href={internalUrl('/')}
            className="text-lg font-semibold text-lunamaze-textPrimary tracking-tight"
          >
            Luna Maze
          </a>
          <p className="text-sm text-lunamaze-textDim mt-2">
            © {YEAR} Luna Maze Studio. All rights reserved.
          </p>
        </div>
        <nav
          className="flex flex-wrap items-center gap-6 text-sm"
          aria-label="Footer"
        >
          <a
            href={internalUrl('/axiom/')}
            className="text-lunamaze-textSecondary hover:text-lunamaze-violetLight transition-colors duration-200"
          >
            Axiom
          </a>
          <a
            href={internalUrl('/genesis/')}
            className="text-lunamaze-textSecondary hover:text-lunamaze-violetLight transition-colors duration-200"
          >
            Genesis
          </a>
          <a
            href="#studio"
            className="text-lunamaze-textSecondary hover:text-lunamaze-violetLight transition-colors duration-200"
          >
            Studio
          </a>
          <a
            href="#products"
            className="text-lunamaze-textSecondary hover:text-lunamaze-violetLight transition-colors duration-200"
          >
            Products
          </a>
          <a
            href="#contact"
            className="text-lunamaze-textSecondary hover:text-lunamaze-violetLight transition-colors duration-200"
          >
            Contact
          </a>
          <a
            href={internalUrl('/axiom/privacy/')}
            className="text-lunamaze-textSecondary hover:text-lunamaze-violetLight transition-colors duration-200"
          >
            Privacy
          </a>
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          {founderSocials
            .filter((s) => s.host !== 'email')
            .map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.2em] text-lunamaze-textDim hover:text-lunamaze-violetLight transition-colors duration-200"
              >
                {s.label}
              </a>
            ))}
        </div>
      </div>
    </footer>
  );
}
