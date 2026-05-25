import type { JSX } from 'react';
import type { Product } from '@/content/lunamaze';

/**
 * ProductCard — single tile in the Luna Maze Products grid.
 *
 * Branching root element:
 *   - `live` + `href` defined → an `<a>` with `aria-label="Visit <name>"`.
 *   - otherwise              → a `<div role="group" aria-disabled="true">`
 *     that is non-interactive (no link, dimmed, `cursor-not-allowed`).
 *
 * Card body is rendered identically in both branches via a shared inner
 * JSX block so the surface visuals stay consistent.
 */

interface ProductCardProps {
  readonly product: Product;
}

const CARD_BASE_CLASS =
  'group relative block rounded-2xl border border-lunamaze-border ' +
  'bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm transition-all duration-300';

const CARD_INTERACTIVE_CLASS =
  'hover:border-lunamaze-violet/60 hover:bg-lunamaze-bgElevated/70 ' +
  'hover:-translate-y-1 lunamaze-glow-violet/0 ' +
  'hover:shadow-[0_0_60px_-15px_rgba(123,92,255,0.5)] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'focus-visible:outline-lunamaze-violetLight';

const CARD_DISABLED_CLASS = 'opacity-60 cursor-not-allowed';

const STATUS_PILL_BASE_CLASS =
  'inline-flex items-center text-xs font-medium rounded-full px-3 py-1';

const STATUS_PILL_LIVE_CLASS =
  'bg-lunamaze-violet/15 text-lunamaze-violetLight border border-lunamaze-violet/30';

const STATUS_PILL_COMING_SOON_CLASS =
  'bg-lunamaze-bgElevated text-lunamaze-textDim border border-lunamaze-border';

export default function ProductCard({ product }: ProductCardProps): JSX.Element {
  const isLive = product.status === 'live' && product.href !== undefined;

  const cardClassName = `${CARD_BASE_CLASS} ${
    isLive ? CARD_INTERACTIVE_CLASS : CARD_DISABLED_CLASS
  }`;

  const statusPillClassName = `${STATUS_PILL_BASE_CLASS} ${
    isLive ? STATUS_PILL_LIVE_CLASS : STATUS_PILL_COMING_SOON_CLASS
  }`;

  const cardBody = (
    <>
      <div className="flex items-start justify-between gap-4">
        {product.tag !== undefined ? (
          <span className="text-xs uppercase tracking-[0.2em] text-lunamaze-textDim">
            {product.tag}
          </span>
        ) : (
          <span aria-hidden="true" />
        )}
        <span className={statusPillClassName}>
          {isLive ? 'Live' : 'Coming soon'}
        </span>
      </div>

      <h3 className="text-2xl sm:text-3xl font-semibold text-lunamaze-textPrimary mt-6">
        {product.name}
      </h3>

      <p className="text-base text-lunamaze-textSecondary mt-3 leading-relaxed">
        {product.description}
      </p>

      {isLive && (
        <div className="mt-8 text-sm text-lunamaze-violetLight">
          Open product →
        </div>
      )}
    </>
  );

  if (isLive && product.href !== undefined) {
    return (
      <a
        href={product.href}
        aria-label={`Visit ${product.name}`}
        className={cardClassName}
      >
        {cardBody}
      </a>
    );
  }

  return (
    <div role="group" aria-disabled="true" className={cardClassName}>
      {cardBody}
    </div>
  );
}
