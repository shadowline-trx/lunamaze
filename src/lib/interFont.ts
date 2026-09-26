import { Inter } from 'next/font/google';

/**
 * The product pages' shared UI face. It used to be applied to <body> by the
 * root layout; each product layout now applies it to its own wrapper so the
 * studio home, which has its own type system, does not download it.
 *
 * `optional`, not preloaded. A preload would leak onto every Axiom page too
 * (Next folds the product next/font faces into one shared stylesheet), and a
 * late `swap` reflows the hero blocks (layout shift). With `optional` the page
 * uses Inter when it is ready on first render, otherwise the size-matched
 * fallback, and never swaps mid-read. From the second page on it is cached.
 */
export const inter = Inter({
  subsets: ['latin'],
  display: 'optional',
  preload: false,
  variable: '--font-inter',
});

export const interClass = `${inter.className} ${inter.variable}`;
