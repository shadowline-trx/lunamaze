import type { BlogArticle } from './types';

import rewireEn from './rewire-timeline/en';
import rewireHi from './rewire-timeline/hi';
import rewireTa from './rewire-timeline/ta';
import rewireMl from './rewire-timeline/ml';
import rewireId from './rewire-timeline/id';
import rewirePtBr from './rewire-timeline/pt-br';
import rewireEs from './rewire-timeline/es';
import rewireAr from './rewire-timeline/ar';
import rewireFr from './rewire-timeline/fr';
import rewireDe from './rewire-timeline/de';
import rewireRu from './rewire-timeline/ru';
import rewireTr from './rewire-timeline/tr';

import flatlineEn from './flatline/en';
import flatlineHi from './flatline/hi';
import flatlineTa from './flatline/ta';
import flatlineMl from './flatline/ml';
import flatlineId from './flatline/id';
import flatlinePtBr from './flatline/pt-br';
import flatlineEs from './flatline/es';
import flatlineAr from './flatline/ar';
import flatlineFr from './flatline/fr';
import flatlineDe from './flatline/de';
import flatlineRu from './flatline/ru';
import flatlineTr from './flatline/tr';

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
  rewireFr,
  rewireDe,
  rewireRu,
  rewireTr,
  flatlineEn,
  flatlineHi,
  flatlineTa,
  flatlineMl,
  flatlineId,
  flatlinePtBr,
  flatlineEs,
  flatlineAr,
  flatlineFr,
  flatlineDe,
  flatlineRu,
  flatlineTr,
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
