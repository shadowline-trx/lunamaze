import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import { articleVersions, englishArticles } from '@/content/blog';
import { BLOG_LANGUAGES } from '@/content/blog/types';
import type { BlogArticle } from '@/content/blog/types';
import { internalUrl } from '@/lib/paths';

/**
 * Blog index: /axiom/blog/. Lists the English canonicals with links to every
 * language version — the recovery library entry point.
 *
 * Restyled 2026-08-03 to the AXIOM v3 "Silver Studio" language: static CSS
 * stage, minimal fixed nav, quiet ax-card article surfaces with mono meta
 * lines instead of the old per-article aurora strips.
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

const MONO = 'ax-mono';

function ArticleCard({ article }: { article: BlogArticle }): JSX.Element {
  const versions = articleVersions(article.slug);
  const href = `/axiom/blog/en/${article.slug}/`;

  return (
    <article className="ax-card group relative p-7 transition-colors hover:border-[#8b7cf7]/40 sm:p-8">
      <div className={`${MONO} flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.24em]`}>
        <span className="text-[#8b7cf7]">{article.readingMinutes} min read</span>
        <span className="h-px w-6 bg-white/[0.12]" aria-hidden="true" />
        <span className="text-[#8f8ca1]">{article.datePublished}</span>
      </div>

      <h2 className="mt-4 text-xl font-semibold leading-snug text-[#f2f1f7] sm:text-2xl">
        <Link href={href} className="transition-colors group-hover:text-[#cdc7ee]">
          {/* Stretch the anchor over the whole card so the title is not a
              pinpoint tap target on a phone. */}
          <span className="absolute inset-0" aria-hidden="true" />
          {article.title}
        </Link>
      </h2>

      <p className="mt-3 leading-relaxed text-[#a6a3b8]">{article.description}</p>

      <div className="mt-6 flex flex-wrap gap-2 border-t border-white/[0.07] pt-5">
        {versions.map((v) => (
          <Link
            key={v.lang}
            href={`/axiom/blog/${v.lang}/${v.slug}/`}
            hrefLang={v.lang}
            className="relative rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs text-[#9b98ad] transition-colors hover:border-[#8b7cf7]/50 hover:text-[#e8e6f0]"
          >
            {BLOG_LANGUAGES[v.lang]?.nativeName ?? v.lang}
          </Link>
        ))}
      </div>
    </article>
  );
}

export default function BlogIndexPage(): JSX.Element {
  const articles = englishArticles();

  return (
    <div className="axiom-v3 relative min-h-screen">
      {/* Static stage: same look as the main landing, zero JS cost. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 0%, #131318 0%, #0a0a0d 52%, #070709 100%)',
          }}
        />
        <div className="ax-cage absolute inset-0" />
        <div className="ax-shafts" />
      </div>

      {/* Minimal nav */}
      <header
        className="fixed inset-x-0 top-0 z-50"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,13,0.72), transparent)' }}
      >
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/axiom/" className="flex items-center gap-3">
            <img
              src={internalUrl('/images/axiom/logo.webp')}
              alt=""
              width={34}
              height={34}
              className="h-[34px] w-[34px] rounded-xl"
            />
            <span className={`${MONO} text-sm font-medium tracking-[0.34em] text-[#e8e6f0]`}>
              AXIOM
            </span>
          </Link>
          <Link
            href="/axiom/"
            className={`${MONO} text-[11px] uppercase tracking-[0.22em] text-[#9b98ad] transition-colors hover:text-[#e8e6f0]`}
          >
            ← The full story
          </Link>
        </nav>
      </header>

      <main className="relative mx-auto max-w-3xl px-6 pb-28 pt-36">
        {/* Hero */}
        <div
          className={`${MONO} mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-black/30 px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[#9b98ad] backdrop-blur-md`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#8b7cf7] shadow-[0_0_12px_rgba(139,124,247,0.8)]" />
          Recovery Library
        </div>
        <h1 className="text-[clamp(2.4rem,6vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-[#f2f1f7]">
          Honest <span className="ax-serif ax-grad-violet pr-1 font-normal">answers.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#a6a3b8]">
          {
            'No miracle cures, no shame, no selling you a program. Just what actually happens when you quit — and when. Free, in your language.'
          }
        </p>

        {/* The library */}
        <div className="mt-12 space-y-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        <p className="mt-12 text-sm leading-relaxed text-[#a6a3b8]">
          Wondering where you stand?{' '}
          <Link
            href="/axiom/tools/severity-test/"
            className="text-[#c9c6d8] underline decoration-[#8b7cf7]/50 underline-offset-4 transition-colors hover:text-[#e8e6f0]"
          >
            Take the free 2-minute severity self-test
          </Link>{' '}
          — anonymous, runs entirely in your browser.
        </p>
      </main>

      <footer className="relative border-t border-white/[0.06] bg-[#08080a] py-10">
        <p className={`${MONO} text-center text-[11px] uppercase tracking-[0.2em] text-[#8f8ca1]`}>
          A recovery app by{' '}
          <a href={internalUrl('/')} className="text-[#c9c6d8] underline underline-offset-2 transition-colors hover:text-[#e8e6f0]">
            Luna Maze
          </a>
        </p>
      </footer>
    </div>
  );
}
