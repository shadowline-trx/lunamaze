import type { BlogArticle } from './types';

import rewireEn from './rewire-timeline/en';
import rewireHi from './rewire-timeline/hi';
import rewireTa from './rewire-timeline/ta';
import rewireMl from './rewire-timeline/ml';
import rewireId from './rewire-timeline/id';
import rewirePtBr from './rewire-timeline/pt-br';
import rewireEs from './rewire-timeline/es';
import rewireAr from './rewire-timeline/ar';

import flatlineEn from './flatline/en';
import flatlineHi from './flatline/hi';
import flatlineTa from './flatline/ta';
import flatlineMl from './flatline/ml';
import flatlineId from './flatline/id';
import flatlinePtBr from './flatline/pt-br';
import flatlineEs from './flatline/es';
import flatlineAr from './flatline/ar';

/**
 * Central registry of every blog article in every language. Routes, hreflang
 * alternates and the sitemap are all derived from this — adding a language is
 * one import + one array entry.
 */
export const ALL_ARTICLES: ReadonlyArray<BlogArticle> = [
  rewireEn,
  rewireHi,
  rewireTa,
  rewireMl,
  rewireId,
  rewirePtBr,
  rewireEs,
  rewireAr,
  flatlineEn,
  flatlineHi,
  flatlineTa,
  flatlineMl,
  flatlineId,
  flatlinePtBr,
  flatlineEs,
  flatlineAr,
];

/** All language versions of one article, keyed by lang. */
export function articleVersions(slug: string): ReadonlyArray<BlogArticle> {
  return ALL_ARTICLES.filter((a) => a.slug === slug);
}

export function getArticle(lang: string, slug: string): BlogArticle | undefined {
  return ALL_ARTICLES.find((a) => a.lang === lang && a.slug === slug);
}

/** English versions only — used for the index page listing. */
export function englishArticles(): ReadonlyArray<BlogArticle> {
  return ALL_ARTICLES.filter((a) => a.lang === 'en');
}
