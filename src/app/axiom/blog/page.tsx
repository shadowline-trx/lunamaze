import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import AuroraField from '@/components/lunamaze/AuroraField';
import { articleVersions, englishArticles } from '@/content/blog';
import { BLOG_LANGUAGES } from '@/content/blog/types';
import type { BlogArticle } from '@/content/blog/types';
import { blogAccent } from '@/lib/blogAccents';
import { hexA } from '@/lib/color';

/**
 * Blog index: /axiom/blog/. Lists the English canonicals with links to every
 * language version — the recovery library entry point.
 *
 * The language links look like chrome but are load-bearing: they are the crawl
 * path to every translated article, so they stay as real anchors even though
 * twelve of them per card is a lot of ink. Styling them as small chips keeps
 * them scannable without letting them shout over the article itself.
 */

export const metadata: Metadata = {
  title: 'Axiom Recovery Library — honest answers, no hype',
  description:
    'Plain, honest articles about quitting porn and rebuilding your dopamine system: real timelines, the flatline, urges, relapse — in 12 languages.',
  alternates: { canonical: 'https://lunamaze.com/axiom/blog/' },
};

function ArticleCard({ article }: { article: BlogArticle }): JSX.Element {
  const { accent, accentAlt } = blogAccent(article.slug);
  const versions = articleVersions(article.slug);
  const href = `/axiom/blog/en/${article.slug}/`;

  return (
    <article
      className="group relative overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1"
      style={{
        borderColor: hexA(accent, 0.26),
        background: `linear-gradient(160deg, ${hexA(accent, 0.08)} 0%, rgba(18,23,55,0.72) 45%)`,
        boxShadow: `0 1px 0 0 ${hexA(accent, 0.12)} inset`,
      }}
    >
      {/* Same aurora recipe as the tools hub, at library scale: a hard-edged
          gradient carries the colour, blurred blooms only add light on top. */}
      <div className="relative h-16 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(115deg, ${hexA(accent, 0.9)} 0%, ${hexA(accentAlt, 0.65)} 45%, ${hexA(accent, 0.14)} 100%)`,
          }}
        />
        <div
          className="absolute -top-10 left-[-5%] h-24 w-[55%] rounded-full blur-2xl transition-transform duration-500 group-hover:translate-x-5"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-9 right-[-5%] h-20 w-[45%] rounded-full blur-2xl transition-transform duration-500 group-hover:-translate-x-5"
          style={{ background: `radial-gradient(circle, ${hexA(accentAlt, 0.85)} 0%, transparent 70%)` }}
        />
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-b from-transparent to-[#101534]" />
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: hexA(accent, 0.5) }} />
      </div>

      <div className="p-7 pt-5 sm:p-8 sm:pt-6">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="uppercase tracking-[0.22em]" style={{ color: accent }}>
            {article.readingMinutes} min read
          </span>
          <span className="h-px w-6" style={{ background: hexA(accent, 0.4) }} aria-hidden="true" />
          <span className="text-lunamaze-textDim">{article.datePublished}</span>
        </div>

        <h2 className="mt-4 text-xl sm:text-2xl font-bold leading-snug">
          <Link href={href} className="transition-colors group-hover:text-white">
            {/* Stretch the anchor over the whole card so the title is not a
                pinpoint tap target on a phone. */}
            <span className="absolute inset-0" aria-hidden="true" />
            {article.title}
          </Link>
        </h2>

        <p className="mt-3 text-lunamaze-textSecondary leading-relaxed">{article.description}</p>

        <div
          className="mt-6 flex flex-wrap gap-2 border-t pt-5"
          style={{ borderColor: hexA(accent, 0.16) }}
        >
          {versions.map((v) => (
            <Link
              key={v.lang}
              href={`/axiom/blog/${v.lang}/${v.slug}/`}
              hrefLang={v.lang}
              className="relative rounded-full px-3 py-1 text-xs text-lunamaze-textSecondary transition-colors hover:text-lunamaze-textPrimary"
              style={{
                border: `1px solid ${hexA(accent, 0.2)}`,
                background: hexA(accent, 0.06),
              }}
            >
              {BLOG_LANGUAGES[v.lang]?.nativeName ?? v.lang}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function BlogIndexPage(): JSX.Element {
  const articles = englishArticles();

  return (
    <main className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <ProductNav product="Axiom" />

      <header className="relative overflow-hidden px-6 sm:px-8 lg:px-16 pt-32 pb-14 lunamaze-noise">
        <AuroraField accent="#7B5CFF" accentAlt="#00D2FF" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-lunamaze-violet/40 bg-lunamaze-violet/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-lunamaze-violetLight mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-lunamaze-violetLight" aria-hidden="true" />
            Recovery Library
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.03]">
            <span className="lunamaze-text-gradient">Honest answers.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-lunamaze-textSecondary leading-relaxed max-w-2xl">
            {
              'No miracle cures, no shame, no selling you a program. Just what actually happens when you quit — and when. Free, in your language.'
            }
          </p>
        </div>
      </header>

      <section className="relative px-6 sm:px-8 lg:px-16 pb-20">
        <div className="max-w-3xl mx-auto space-y-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}

          <p className="pt-4 text-sm text-lunamaze-textSecondary">
            Wondering where you stand?{' '}
            <Link
              href="/axiom/tools/severity-test/"
              className="underline decoration-lunamaze-violet/50 underline-offset-4 hover:text-lunamaze-violetLight"
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
