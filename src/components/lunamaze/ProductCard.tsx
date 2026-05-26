import type { JSX } from 'react';
import type { Product, ProductStatus } from '@/content/lunamaze';
import { internalUrl } from '@/lib/paths';

/**
 * ProductCard — single tile in the Luna Maze Products grid.
 *
 * Branching root element by status:
 *   - `live` + `href` defined → an `<a>` with `aria-label="Visit <name>"`.
 *     External `https://` URLs additionally open in a new tab with safe
 *     `rel="noopener noreferrer"`.
 *   - `private-testing` or `coming-soon` (or no href) → a non-interactive
 *     `<div role="group" aria-disabled="true">` with the appropriate pill
 *     and dimmed treatment.
 *
 * The card body is rendered identically across all branches via a shared
 * inner JSX block so the surface visuals stay consistent.
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

const CARD_DISABLED_CLASS = 'opacity-70 cursor-not-allowed';

const STATUS_PILL_BASE_CLASS =
  'inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1';

interface StatusPresentation {
  readonly label: string;
  readonly pillClass: string;
  readonly dotClass: string;
}

function getStatusPresentation(status: ProductStatus): StatusPresentation {
  switch (status) {
    case 'live':
      return {
        label: 'Live',
        pillClass:
          'bg-lunamaze-violet/15 text-lunamaze-violetLight border border-lunamaze-violet/30',
        dotClass: 'bg-lunamaze-violetLight',
      };
    case 'private-testing':
      return {
        label: 'Private testing',
        pillClass:
          'bg-lunamaze-signal/10 text-lunamaze-signal border border-lunamaze-signal/30',
        dotClass: 'bg-lunamaze-signal',
      };
    case 'coming-soon':
      return {
        label: 'Coming soon',
        pillClass:
          'bg-lunamaze-bgElevated text-lunamaze-textDim border border-lunamaze-border',
        dotClass: 'bg-lunamaze-textDim',
      };
  }
}

export default function ProductCard({ product }: ProductCardProps): JSX.Element {
  const isLive = product.status === 'live' && product.href !== undefined;
  const presentation = getStatusPresentation(product.status);

  const cardClassName = `${CARD_BASE_CLASS} ${
    isLive ? CARD_INTERACTIVE_CLASS : CARD_DISABLED_CLASS
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
        <span className={`${STATUS_PILL_BASE_CLASS} ${presentation.pillClass}`}>
          <span
            aria-hidden="true"
            className={`w-1.5 h-1.5 rounded-full ${presentation.dotClass}`}
          />
          {presentation.label}
        </span>
      </div>

      {product.imageHref !== undefined && (
        <div
          className="mt-6 -mx-2 h-32 sm:h-36 rounded-xl overflow-hidden bg-gradient-to-br from-lunamaze-bgElevated/60 to-lunamaze-bgDeep/40 border border-lunamaze-border/60 flex items-center justify-center"
          aria-hidden="true"
        >
          {/* Static-export friendly: plain <img>, basePath-aware src. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={internalUrl(product.imageHref)}
            alt=""
            className="max-h-full max-w-[80%] object-contain drop-shadow-[0_0_24px_rgba(123,92,255,0.35)] transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <h3 className="text-2xl sm:text-3xl font-semibold text-lunamaze-textPrimary mt-6">
        {product.name}
      </h3>

      <p className="text-base text-lunamaze-textSecondary mt-3 leading-relaxed">
        {product.description}
      </p>

      {isLive && product.href !== undefined && (
        <div className="mt-8 text-sm text-lunamaze-violetLight">
          {/^https?:\/\//.test(product.href) ? 'Visit site ↗' : 'Open product →'}
        </div>
      )}
    </>
  );

  if (isLive && product.href !== undefined) {
    const isExternal = /^https?:\/\//.test(product.href);
    return (
      <a
        href={product.href}
        aria-label={`Visit ${product.name}`}
        className={cardClassName}
        {...(isExternal
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
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
