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
  'group relative block rounded-2xl border border-lunamaze-border/80 ' +
  'bg-lunamaze-bgSurface/80 p-8 backdrop-blur-md ' +
  'shadow-[0_12px_48px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.04] ' +
  'transition-all duration-300';

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
    case 'early-access':
      return {
        label: 'Early access',
        pillClass:
          'bg-lunamaze-signal/10 text-lunamaze-signal border border-lunamaze-signal/30',
        dotClass: 'bg-lunamaze-signal',
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
  // A card is interactive whenever it has a destination — this now includes
  // in-development products (e.g. Drift) that have a dedicated teaser page,
  // not just `live` ones. The status pill still communicates real status.
  const isInteractive = product.href !== undefined;
  const presentation = getStatusPresentation(product.status);

  const cardClassName = `${CARD_BASE_CLASS} ${
    isInteractive ? CARD_INTERACTIVE_CLASS : CARD_DISABLED_CLASS
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
        (() => {
          // Raster icons (PNG/JPG) ship with baked-in dark/textured squares,
          // so they need blend + edge feathering to dissolve the box. Vector
          // marks (SVG) are already transparent and must stay crisp/untinted.
          const isRaster = /\.(png|jpe?g|webp)$/i.test(product.imageHref);
          return (
            <div
              className="relative mt-6 -mx-2 h-32 sm:h-36 rounded-2xl overflow-hidden flex items-center justify-center"
              aria-hidden="true"
            >
              {/* Soft radial plate that lifts the mark without a hard frame. */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 45%, rgba(123,92,255,0.18) 0%, rgba(123,92,255,0.06) 38%, rgba(10,14,39,0) 72%)',
                }}
              />
              {/* Static-export friendly: plain <img>, basePath-aware src. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={internalUrl(product.imageHref)}
                alt=""
                className="relative max-h-[78%] max-w-[72%] object-contain transition-transform duration-500 group-hover:scale-[1.05]"
                style={
                  isRaster
                    ? {
                        // `screen` drops flat dark backgrounds; the radial
                        // mask feathers any remaining hard edges into the card.
                        mixBlendMode: 'screen',
                        WebkitMaskImage:
                          'radial-gradient(circle at 50% 50%, #000 58%, rgba(0,0,0,0) 86%)',
                        maskImage:
                          'radial-gradient(circle at 50% 50%, #000 58%, rgba(0,0,0,0) 86%)',
                        filter: 'drop-shadow(0 0 22px rgba(123,92,255,0.35))',
                      }
                    : {
                        filter: 'drop-shadow(0 0 22px rgba(123,92,255,0.35))',
                      }
                }
                loading="lazy"
                decoding="async"
              />
            </div>
          );
        })()
      )}

      <h3 className="text-2xl sm:text-3xl font-semibold text-lunamaze-textPrimary mt-6">
        {product.name}
      </h3>

      <p className="text-base text-lunamaze-textSecondary mt-3 leading-relaxed">
        {product.description}
      </p>

      {isInteractive && product.href !== undefined && (
        <div className="mt-8 text-sm text-lunamaze-violetLight">
          {/^https?:\/\//.test(product.href) ? 'Visit site ↗' : 'Open product →'}
        </div>
      )}
    </>
  );

  if (isInteractive && product.href !== undefined) {
    const isExternal = /^https?:\/\//.test(product.href);
    return (
      <a
        href={isExternal ? product.href : internalUrl(product.href)}
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
