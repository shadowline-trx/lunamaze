import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import { articleVersions, englishArticles } from '@/content/blog';
import { BLOG_LANGUAGES } from '@/content/blog/types';

/**
 * Blog index: /axiom/blog/. Lists the English canonicals with links to every
 * language version — the recovery library entry point.
 */

export const metadata: Metadata = {
  title: 'Axiom Recovery Library — honest answers, no hype',
  description:
    'Plain, honest articles about quitting porn and rebuilding your dopamine system: real timelines, the flatline, urges, relapse — in 8 languages.',
  alternates: { canonical: 'https://lunamaze.com/axiom/blog/' },
};

export default function BlogIndexPage(): JSX.Element {
  const articles = englishArticles();

  return (
    <main className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <ProductNav product="Axiom" />

      <header className="relative overflow-hidden px-6 sm:px-8 lg:px-16 pt-32 pb-16 lunamaze-grid-bg lunamaze-noise">
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-lunamaze-signal mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-lunamaze-signal" aria-hidden="true" />
            Recovery Library
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">
            <span className="lunamaze-text-gradient">Honest answers.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-lunamaze-textSecondary leading-relaxed">
            {
              'No miracle cures, no shame, no selling you a program. Just what actually happens when you quit — and when. Free, in your language.'
            }
          </p>
        </div>
      </header>

      <section className="relative px-6 sm:px-8 lg:px-16 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto space-y-6">
          {articles.map((article) => {
            const versions = articleVersions(article.slug);
            return (
              <article
                key={article.slug}
                className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm"
              >
                <h2 className="text-xl sm:text-2xl font-bold leading-snug">
                  <Link
                    href={`/axiom/blog/en/${article.slug}/`}
                    className="hover:text-lunamaze-signal transition-colors"
                  >
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">
                  {article.description}
                </p>
                <p className="mt-4 text-sm text-lunamaze-textDim">
                  {article.datePublished} · {article.readingMinutes} min
                </p>
                <p className="mt-4 text-sm text-lunamaze-textSecondary">
                  {versions.map((v, i) => (
                    <span key={v.lang}>
                      {i > 0 && ' · '}
                      <Link
                        href={`/axiom/blog/${v.lang}/${v.slug}/`}
                        hrefLang={v.lang}
                        className="underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-textPrimary"
                      >
                        {BLOG_LANGUAGES[v.lang]?.nativeName ?? v.lang}
                      </Link>
                    </span>
                  ))}
                </p>
              </article>
            );
          })}

          <p className="text-sm text-lunamaze-textSecondary">
            Wondering where you stand?{' '}
            <Link
              href="/axiom/tools/severity-test/"
              className="underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-signal"
            >
              Take the free 2-minute severity self-test
            </Link>{' '}
            — anonymous, runs entirely in your browser.
          </p>
        </div>
      </section>

      <LunaFooter />
    </main>
  );
}
