import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import { ALL_ARTICLES, articleVersions, getArticle } from '@/content/blog';
import { BLOG_LANGUAGES } from '@/content/blog/types';
import type { BlogArticle, BlogBlock } from '@/content/blog/types';

/**
 * Localized article page: /axiom/blog/{lang}/{slug}/.
 *
 * Every language version of an article shares its slug, which lets this route
 * emit the full hreflang alternate set (plus x-default → English) so search
 * engines serve the right language, and Article + FAQPage JSON-LD so answer
 * engines can cite us. All params are statically generated — required for the
 * GitHub Pages export.
 */

const BASE = 'https://lunamaze.com';

interface ArticleParams {
  lang: string;
  slug: string;
}

export function generateStaticParams(): ArticleParams[] {
  return ALL_ARTICLES.map((a) => ({ lang: a.lang, slug: a.slug }));
}

function articleUrl(a: BlogArticle): string {
  return `${BASE}/axiom/blog/${a.lang}/${a.slug}/`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ArticleParams>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const article = getArticle(lang, slug);
  if (!article) return {};

  const versions = articleVersions(slug);
  const languages: Record<string, string> = {};
  for (const v of versions) {
    languages[v.lang] = articleUrl(v);
  }
  const english = versions.find((v) => v.lang === 'en');
  if (english) {
    languages['x-default'] = articleUrl(english);
  }

  return {
    title: `${article.title} — Axiom`,
    description: article.description,
    alternates: {
      canonical: articleUrl(article),
      languages,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
    },
  };
}

/** Article + FAQPage structured data for search and answer engines. */
function jsonLd(article: BlogArticle): string {
  const faq = article.blocks.find((b) => b.kind === 'faq');
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      inLanguage: article.lang,
      datePublished: article.datePublished,
      dateModified: article.dateModified,
      author: { '@type': 'Organization', name: 'Luna Maze', url: BASE },
      publisher: { '@type': 'Organization', name: 'Luna Maze', url: BASE },
      mainEntityOfPage: articleUrl(article),
    },
  ];
  if (faq && faq.kind === 'faq') {
    graph.push({
      '@type': 'FAQPage',
      inLanguage: article.lang,
      mainEntity: faq.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

function Block({ block }: { block: BlogBlock }): JSX.Element {
  switch (block.kind) {
    case 'p':
      return <p>{block.text}</p>;
    case 'h2':
      return <h2>{block.text}</h2>;
    case 'h3':
      return <h3>{block.text}</h3>;
    case 'list':
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <div className="rounded-xl border border-lunamaze-violet/30 bg-lunamaze-violet/5 px-5 py-4 text-lunamaze-textPrimary">
          {block.text}
        </div>
      );
    case 'callout':
      return (
        <div className="rounded-xl border border-lunamaze-violet/30 bg-lunamaze-violet/5 px-5 py-4">
          <p className="font-semibold text-lunamaze-textPrimary mb-1">{block.title}</p>
          <p className="text-lunamaze-textSecondary">{block.text}</p>
        </div>
      );
    case 'faq':
      return (
        <>
          {block.items.map((item) => (
            <div key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </>
      );
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<ArticleParams>;
}): Promise<JSX.Element> {
  const { lang, slug } = await params;
  const article = getArticle(lang, slug);
  if (!article) notFound();

  const versions = articleVersions(slug);
  const otherVersions = versions.filter((v) => v.lang !== article.lang);

  return (
    <main className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <ProductNav product="Axiom" />
      <script
        type="application/ld+json"
        // Structured data is generated from our own typed content, never user input.
        dangerouslySetInnerHTML={{ __html: jsonLd(article) }}
      />

      <header className="relative overflow-hidden px-6 sm:px-8 lg:px-16 pt-32 pb-12 lunamaze-grid-bg lunamaze-noise">
        <div className="relative z-10 max-w-3xl mx-auto" dir={article.dir}>
          <span className="inline-flex items-center gap-2 rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-lunamaze-signal mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-lunamaze-signal" aria-hidden="true" />
            Axiom
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1]">
            <span className="lunamaze-text-gradient">{article.title}</span>
          </h1>
          <p className="mt-6 text-sm text-lunamaze-textDim">
            {article.datePublished} · {article.readingMinutes} min
          </p>
          {otherVersions.length > 0 && (
            <p className="mt-4 text-sm text-lunamaze-textSecondary" dir="ltr">
              {otherVersions.map((v, i) => (
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
          )}
        </div>
      </header>

      <section className="relative px-6 sm:px-8 lg:px-16 py-12 sm:py-16">
        <article className="lunamaze-prose max-w-3xl mx-auto" dir={article.dir} lang={article.lang}>
          {article.blocks.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </article>

        {/* Soft CTA — honest, one link, no dark patterns. */}
        <aside
          className="max-w-3xl mx-auto mt-14 rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/60 p-8 backdrop-blur-sm"
          dir={article.dir}
        >
          <p className="text-lunamaze-textSecondary leading-relaxed">{article.ctaText}</p>
          <Link
            href="/axiom/"
            className="mt-5 inline-flex items-center rounded-full border border-lunamaze-violet/40 bg-lunamaze-violet/10 px-6 py-3 text-sm font-semibold text-lunamaze-textPrimary hover:bg-lunamaze-violet/20 transition-colors"
          >
            {article.ctaLabel}
          </Link>
        </aside>
      </section>

      <LunaFooter />
    </main>
  );
}
