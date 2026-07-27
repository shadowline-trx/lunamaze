import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import AuroraField from '@/components/lunamaze/AuroraField';
import { ALL_ARTICLES, articleVersions, getArticle } from '@/content/blog';
import { BLOG_LANGUAGES } from '@/content/blog/types';
import type { BlogArticle, BlogBlock } from '@/content/blog/types';
import { blogAccent } from '@/lib/blogAccents';
import { hexA } from '@/lib/color';

/**
 * Localized article page: /axiom/blog/{lang}/{slug}/.
 *
 * Every language version of an article shares its slug, which lets this route
 * emit the full hreflang alternate set (plus x-default → English) so search
 * engines serve the right language, and Article + FAQPage JSON-LD so answer
 * engines can cite us. All params are statically generated — required for the
 * GitHub Pages export.
 *
 * These are long reads in twelve languages, so the chrome has two hard rules:
 * nothing decorative may cost reading comfort, and no English may leak into a
 * translated page. That is why section ids are positional (`s-3`) rather than
 * slugified — a Tamil or Arabic heading slugifies to nothing useful — and why
 * the one piece of added UI copy, the contents label, ships translated.
 */

const BASE = 'https://lunamaze.com';

/** The only added UI strings. Spoken register, loanwords where that is natural. */
const CONTENTS_LABEL: Readonly<Record<string, string>> = {
  en: 'On this page',
  hi: 'इस पेज पर',
  ta: 'இந்தப் பக்கத்தில்',
  ml: 'ഈ പേജിൽ',
  id: 'Di halaman ini',
  'pt-br': 'Nesta página',
  es: 'En esta página',
  ar: 'في هذه الصفحة',
  fr: 'Sur cette page',
  de: 'Auf dieser Seite',
  ru: 'На этой странице',
  tr: 'Bu sayfada',
};

const LANGUAGES_LABEL: Readonly<Record<string, string>> = {
  en: 'Other languages',
  hi: 'दूसरी भाषाएँ',
  ta: 'பிற மொழிகள்',
  ml: 'മറ്റ് ഭാഷകൾ',
  id: 'Bahasa lain',
  'pt-br': 'Outros idiomas',
  es: 'Otros idiomas',
  ar: 'لغات أخرى',
  fr: 'Autres langues',
  de: 'Andere Sprachen',
  ru: 'Другие языки',
  tr: 'Diğer diller',
};

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

/** Positional heading id — script-agnostic, and stable for deep links. */
function sectionId(index: number): string {
  return `s-${index}`;
}

function Block({
  block,
  index,
  accent,
}: {
  block: BlogBlock;
  index: number;
  accent: string;
}): JSX.Element {
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
      /* A pull quote, not a notice box: bigger, quieter, one accent rule. */
      return (
        <blockquote
          className="my-8 border-s-2 ps-6 text-lg leading-relaxed text-lunamaze-textPrimary sm:text-xl"
          style={{ borderColor: hexA(accent, 0.55) }}
        >
          {block.text}
        </blockquote>
      );
    case 'callout':
      return (
        <div
          className="my-8 rounded-2xl border px-6 py-5"
          style={{
            borderColor: hexA(accent, 0.28),
            background: `linear-gradient(150deg, ${hexA(accent, 0.1)} 0%, rgba(18,23,55,0.5) 60%)`,
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
                  rel="noopener noreferrer nofollow"
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

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<ArticleParams>;
}): Promise<JSX.Element> {
  const { lang, slug } = await params;
  const article = getArticle(lang, slug);
  if (!article) notFound();

  const { accent, accentAlt } = blogAccent(article.slug);
  const versions = articleVersions(slug);
  const otherVersions = versions.filter((v) => v.lang !== article.lang);

  /* Contents, from the h2s themselves. Below three sections a list of jump
     links is longer than the thing it indexes, so it is not worth the space. */
  const sections = article.blocks
    .map((block, index) => ({ block, index }))
    .filter((entry): entry is { block: Extract<BlogBlock, { kind: 'h2' }>; index: number } =>
      entry.block.kind === 'h2',
    );
  const showContents = sections.length >= 3;
  const contentsLabel = CONTENTS_LABEL[article.lang] ?? CONTENTS_LABEL.en;
  const languagesLabel = LANGUAGES_LABEL[article.lang] ?? LANGUAGES_LABEL.en;

  return (
    <main className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <ProductNav product="Axiom" />
      <script
        type="application/ld+json"
        // Structured data is generated from our own typed content, never user input.
        dangerouslySetInnerHTML={{ __html: jsonLd(article) }}
      />

      <header className="relative overflow-hidden px-6 sm:px-8 lg:px-16 pt-32 pb-10 lunamaze-noise">
        <AuroraField accent={accent} accentAlt={accentAlt} />
        <div className="relative z-10 max-w-[42rem] mx-auto" dir={article.dir}>
          <span
            className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em]"
            style={{
              border: `1px solid ${hexA(accent, 0.4)}`,
              background: hexA(accent, 0.1),
              color: accent,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: accent }}
              aria-hidden="true"
            />
            Axiom
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] text-balance">
            <span className="lunamaze-text-gradient">{article.title}</span>
          </h1>
          {/* No standfirst here: the article's own opening paragraph is styled
              as the lede, and repeating the meta description above it just
              pushed the actual writing below the fold. */}
          <p className="mt-6 flex flex-wrap items-center gap-3 text-xs" dir="ltr">
            <span className="uppercase tracking-[0.22em]" style={{ color: accent }}>
              {article.readingMinutes} min read
            </span>
            <span className="h-px w-6" style={{ background: hexA(accent, 0.4) }} aria-hidden="true" />
            <span className="text-lunamaze-textDim">{article.datePublished}</span>
          </p>

          {/* Stays above the fold on purpose: ProductNav has no route back to
              the library, so this is the only escape hatch for someone who was
              sent a link in a language they do not read. Collapsed, because
              eleven chips cost three rows of the screen that should be showing
              the article — and <details> keeps every alternate in the DOM for
              crawlers without any JavaScript. */}
          {otherVersions.length > 0 && (
            <details className="group mt-5">
              <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-xs text-lunamaze-textDim transition-colors hover:text-lunamaze-textSecondary [&::-webkit-details-marker]:hidden">
                <span
                  className="transition-transform duration-200 group-open:rotate-90"
                  aria-hidden="true"
                >
                  ›
                </span>
                {languagesLabel}
              </summary>
              <nav className="mt-3 flex flex-wrap gap-2" dir="ltr">
                {otherVersions.map((v) => (
                  <Link
                    key={v.lang}
                    href={`/axiom/blog/${v.lang}/${v.slug}/`}
                    hrefLang={v.lang}
                    className="rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/50 px-3 py-1 text-xs text-lunamaze-textDim transition-colors hover:border-lunamaze-textDim hover:text-lunamaze-textPrimary"
                  >
                    {BLOG_LANGUAGES[v.lang]?.nativeName ?? v.lang}
                  </Link>
                ))}
              </nav>
            </details>
          )}
        </div>
      </header>

      <section className="relative px-6 sm:px-8 lg:px-16 pb-16 pt-8 sm:pt-10">
        {showContents && (
          <nav
            aria-label={contentsLabel}
            className="max-w-[42rem] mx-auto mb-12 rounded-2xl border p-6"
            style={{
              borderColor: hexA(accent, 0.22),
              background: `linear-gradient(150deg, ${hexA(accent, 0.07)} 0%, rgba(18,23,55,0.4) 60%)`,
            }}
            dir={article.dir}
          >
            <p
              className="mb-3 text-xs uppercase tracking-[0.22em]"
              style={{ color: accent }}
            >
              {contentsLabel}
            </p>
            <ol className="space-y-2 text-sm">
              {sections.map((entry, n) => (
                <li key={entry.index} className="flex gap-3">
                  <span className="text-lunamaze-textDim tabular-nums" aria-hidden="true">
                    {String(n + 1).padStart(2, '0')}
                  </span>
                  <a
                    href={`#${sectionId(entry.index)}`}
                    className="text-lunamaze-textSecondary underline decoration-transparent underline-offset-4 transition-colors hover:text-lunamaze-textPrimary hover:decoration-current"
                  >
                    {entry.block.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <article
          className="lunamaze-prose max-w-[42rem] mx-auto"
          dir={article.dir}
          lang={article.lang}
        >
          {article.blocks.map((block, index) => (
            <Block key={index} block={block} index={index} accent={accent} />
          ))}
        </article>

        {/* Soft CTA — honest, one link, no dark patterns. */}
        <aside
          className="max-w-[42rem] mx-auto mt-14 rounded-2xl border p-8"
          style={{
            borderColor: hexA(accent, 0.26),
            background: `linear-gradient(160deg, ${hexA(accent, 0.09)} 0%, rgba(18,23,55,0.6) 50%)`,
          }}
          dir={article.dir}
        >
          <p className="text-lunamaze-textSecondary leading-relaxed">{article.ctaText}</p>
          <Link
            href="/axiom/"
            className="mt-5 inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-lunamaze-textPrimary transition-colors"
            style={{
              border: `1px solid ${hexA(accent, 0.45)}`,
              background: hexA(accent, 0.14),
            }}
          >
            {article.ctaLabel}
          </Link>
        </aside>
      </section>

      <LunaFooter />
    </main>
  );
}
