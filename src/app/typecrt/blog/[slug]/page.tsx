import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import { TYPECRT_ARTICLES, getTypecrtArticle } from '@/content/typecrt';
import type { BlogBlock } from '@/content/blog/types';
import { hexA } from '@/lib/color';

/**
 * TypeCrt article page: /typecrt/blog/{slug}/.
 *
 * Deliberately simpler than the Axiom article route, which carries twelve
 * languages, hreflang alternates and translated chrome. This library is English
 * only (see src/content/typecrt/index.ts for why), so none of that machinery
 * would be doing any work here — it would just be a second copy to keep in
 * sync.
 *
 * Emits Article + FAQPage JSON-LD. The FAQ blocks are the point of that: these
 * pieces exist partly to be quoted by answer engines, and a question-and-answer
 * pair with a traceable source is the most quotable unit there is.
 */

const BASE = 'https://lunamaze.com';
const TYPECRT_URL = 'https://typecrt.com';

/** Phosphor green, matching the TypeCrt product page's CRT palette. */
const ACCENT = '#7CE38B';

export function generateStaticParams(): Array<{ slug: string }> {
  return TYPECRT_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getTypecrtArticle(slug);
  if (!article) return {};

  const url = `${BASE}/typecrt/blog/${article.slug}/`;
  return {
    title: `${article.title} | TypeCrt`,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description: article.description,
      siteName: 'Luna Maze',
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  };
}

/** Positional ids so the contents list never depends on heading text. */
function sectionId(index: number): string {
  return `s-${index}`;
}

function Block({ block, index }: { block: BlogBlock; index: number }): JSX.Element {
  switch (block.kind) {
    case 'p':
      return <p>{block.text}</p>;
    case 'h2':
      return <h2 id={sectionId(index)}>{block.text}</h2>;
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
        <blockquote
          className="my-8 border-s-2 ps-6 font-mono text-base leading-relaxed text-lunamaze-textPrimary sm:text-lg"
          style={{ borderColor: hexA(ACCENT, 0.55) }}
        >
          {block.text}
        </blockquote>
      );
    case 'callout':
      return (
        <div
          className="my-8 rounded-2xl border px-6 py-5"
          style={{
            borderColor: hexA(ACCENT, 0.28),
            background: `linear-gradient(150deg, ${hexA(ACCENT, 0.1)} 0%, rgba(18,23,55,0.5) 60%)`,
          }}
        >
          <p className="mb-1 font-semibold text-lunamaze-textPrimary">{block.title}</p>
          <p className="text-lunamaze-textSecondary">{block.text}</p>
        </div>
      );
    case 'faq':
      return (
        <div className="mt-6 space-y-3">
          {block.items.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/50 px-6 py-5"
            >
              <h3 className="!mt-0 font-semibold text-lunamaze-textPrimary">{item.q}</h3>
              <p className="mt-2 text-lunamaze-textSecondary">{item.a}</p>
            </div>
          ))}
        </div>
      );
    case 'sources':
      return (
        <div className="mt-8 rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/40 px-6 py-5">
          <p className="mb-2 font-semibold text-lunamaze-textPrimary">Sources</p>
          <ul className="space-y-1 text-sm">
            {block.items.map((item) => (
              <li key={item.url}>
                <a
                  href={item.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-lunamaze-textSecondary underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-signal"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
  }
}

export default async function TypecrtArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<JSX.Element> {
  const { slug } = await params;
  const article = getTypecrtArticle(slug);
  if (!article) notFound();

  const url = `${BASE}/typecrt/blog/${article.slug}/`;
  const headings = article.blocks
    .map((block, index) => ({ block, index }))
    .filter((entry) => entry.block.kind === 'h2');

  const faq = article.blocks.find((b) => b.kind === 'faq');

  const graph: Array<Record<string, unknown>> = [
    {
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      datePublished: article.datePublished,
      dateModified: article.dateModified,
      inLanguage: 'en',
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: { '@type': 'Organization', name: 'Luna Maze', url: BASE },
      publisher: { '@type': 'Organization', name: 'Luna Maze', url: BASE },
      about: { '@type': 'WebApplication', name: 'TypeCrt', url: TYPECRT_URL },
    },
  ];
  if (faq && faq.kind === 'faq') {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faq.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
  }

  return (
    <main className="relative min-h-screen bg-lunamaze-bgBase">
      <ProductNav product="TypeCrt" cta={{ label: 'Open typecrt.com', href: TYPECRT_URL }} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
        }}
      />

      <article className="mx-auto max-w-3xl px-6 pb-24 pt-28 sm:pt-32">
        <nav className="mb-8 font-mono text-xs text-lunamaze-textSecondary">
          <Link href="/typecrt/" className="hover:text-lunamaze-signal">
            TypeCrt
          </Link>
          <span className="px-2">/</span>
          <Link href="/typecrt/blog/" className="hover:text-lunamaze-signal">
            Writing
          </Link>
        </nav>

        <h1 className="text-3xl font-semibold leading-tight text-lunamaze-textPrimary sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg text-lunamaze-textSecondary">{article.description}</p>
        <p className="mt-6 font-mono text-xs text-lunamaze-textSecondary">
          <time dateTime={article.datePublished}>
            {new Date(article.datePublished).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
          <span className="px-2">·</span>
          {article.readingMinutes} min read
        </p>

        {headings.length > 2 && (
          <nav className="mt-10 rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/40 px-6 py-5">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-lunamaze-textSecondary">
              On this page
            </p>
            <ul className="space-y-1 text-sm">
              {headings.map(({ block, index }) => (
                <li key={index}>
                  <a
                    href={`#${sectionId(index)}`}
                    className="text-lunamaze-textSecondary underline decoration-lunamaze-border underline-offset-4 hover:text-lunamaze-signal"
                  >
                    {block.kind === 'h2' ? block.text : ''}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="prose prose-invert mt-10 max-w-none prose-headings:text-lunamaze-textPrimary prose-p:text-lunamaze-textSecondary prose-li:text-lunamaze-textSecondary prose-strong:text-lunamaze-textPrimary">
          {article.blocks.map((block, index) => (
            <Block key={index} block={block} index={index} />
          ))}
        </div>

        <div
          className="mt-14 rounded-2xl border px-6 py-6"
          style={{
            borderColor: hexA(ACCENT, 0.3),
            background: `linear-gradient(150deg, ${hexA(ACCENT, 0.12)} 0%, rgba(18,23,55,0.5) 60%)`,
          }}
        >
          <p className="text-lunamaze-textSecondary">{article.ctaText}</p>
          <a
            href={TYPECRT_URL}
            className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-mono text-sm font-semibold text-lunamaze-bgBase"
            style={{ background: ACCENT }}
          >
            {article.ctaLabel} →
          </a>
        </div>
      </article>

      <LunaFooter />
    </main>
  );
}
