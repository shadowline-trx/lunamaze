import type { BlogArticle } from '../blog/types';

import wpmDiffers from './wpm-differs';
import adaptivePractice from './adaptive-practice';

/**
 * The TypeCrt writing library on lunamaze.com.
 *
 * Separate from the Axiom recovery library (`src/content/blog`) but reusing its
 * `BlogArticle` model, because the shape of a long-form article does not change
 * between products and a second copy of it would only drift.
 *
 * English only, deliberately. The Axiom library is translated into twelve
 * languages because its audience searches in their own; typing-test queries are
 * overwhelmingly English and a machine-translated technical article about WPM
 * arithmetic would be worse than no article.
 *
 * Editorial rule for anything added here: these pieces live on lunamaze.com and
 * link out to typecrt.com, so they must earn the click on their own. An article
 * that only makes sense as an advert for the product does not belong — it will
 * not rank, it will not be cited, and it costs the studio domain credibility it
 * cannot easily rebuild.
 */
export const TYPECRT_ARTICLES: ReadonlyArray<BlogArticle> = [
  wpmDiffers,
  adaptivePractice,
];

export function getTypecrtArticle(slug: string): BlogArticle | undefined {
  return TYPECRT_ARTICLES.find((a) => a.slug === slug);
}
