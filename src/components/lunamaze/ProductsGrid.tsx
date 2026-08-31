import type { JSX } from 'react';
import type { Product } from '@/content/lunamaze';
import ProductCard from './ProductCard';

/**
 * ProductsGrid — Luna Maze "Products" section.
 *
 * Composes the studio's product portfolio as a responsive grid of
 * `<ProductCard />` tiles. Layout is driven entirely by Tailwind utilities;
 * card-level interactivity (live anchor vs. coming-soon group) lives in
 * `ProductCard` so this component stays a pure layout shell.
 *
 * Structure:
 *   - `<section id="products">` so the navbar's `#products` anchor lands here.
 *   - A single `max-w-6xl mx-auto` container holds the eyebrow, headline,
 *     intro copy, and the card grid on a shared horizontal rhythm.
 *   - One column on mobile, two on `sm:`, three on `lg:`.
 */

interface ProductsGridProps {
  readonly products: ReadonlyArray<Product>;
}

export default function ProductsGrid({
  products,
}: ProductsGridProps): JSX.Element {
  return (
    <section
      id="products"
      className="lunamaze-defer relative py-20 sm:py-32 px-5 sm:px-8 lg:px-16"
    >
      <div className="max-w-6xl mx-auto">
        <span className="block text-xs uppercase tracking-[0.3em] text-lunamaze-signal mb-4">
          Products
        </span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-lunamaze-textPrimary mb-4 max-w-3xl">
          What we ship.
        </h2>
        <p className="text-base sm:text-lg text-lunamaze-textSecondary max-w-2xl mb-10 sm:mb-16 leading-relaxed">
          Five independent products across recovery, Android, writing, play, and the home screen. Each one is built to earn its place in your day.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
