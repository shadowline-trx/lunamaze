import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import ProductNav from '@/components/lunamaze/ProductNav';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import { TYPECRT_ARTICLES } from '@/content/typecrt';

/**
 * Index of the TypeCrt writing library: /typecrt/blog/.
 *
 * Sorted newest first and derived entirely from the content registry, so
 * publishing is one file plus one import.
 */

const BASE = 'https://lunamaze.com';
const TYPECRT_URL = 'https://typecrt.com';

export const metadata: Metadata = {
  title: 'TypeCrt Writing — Typing Speed, Measurement and Practice | Luna Maze',
  description:
    'Long-form writing on how typing speed is measured, why two tests disagree, and what adaptive practice actually does. Sourced, checkable, no filler.',
  alternates: { canonical: `${BASE}/typecrt/blog/` },
  openGraph: {
    type: 'website',
    url: `${BASE}/typecrt/blog/`,
    title: 'TypeCrt Writing',
    description:
      'How typing speed is measured, why two tests disagree, and what adaptive practice actually does.',
    siteName: 'Luna Maze',
  },
};

export default function TypecrtBlogIndex(): JSX.Element {
  const articles = [...TYPECRT_ARTICLES].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished)
  );

  return (
    <main className="relative min-h-screen bg-lunamaze-bgBase">
      <ProductNav product="TypeCrt" cta={{ label: 'Open typecrt.com', href: TYPECRT_URL }} />

      <section className="mx-auto max-w-3xl px-6 pb-24 pt-28 sm:pt-32">
        <nav className="mb-8 font-mono text-xs text-lunamaze-textSecondary">
          <Link href="/typecrt/" className="hover:text-lunamaze-signal">
            TypeCrt
          </Link>
          <span className="px-2">/</span>
          <span className="text-lunamaze-textPrimary">Writing</span>
        </nav>

        <h1 className="text-3xl font-semibold leading-tight text-lunamaze-textPrimary sm:text-4xl">
          Writing about typing
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-lunamaze-textSecondary">
          How the numbers are actually calculated, why two tests disagree about you, and what
          adaptive practice does and does not do. Every factual claim carries its source.
        </p>

        <div className="mt-12 space-y-4">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/typecrt/blog/${a.slug}/`}
              className="block rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/40 px-6 py-6 transition-colors hover:border-lunamaze-signal/50"
            >
              <h2 className="text-xl font-semibold text-lunamaze-textPrimary">{a.title}</h2>
              <p className="mt-2 text-lunamaze-textSecondary">{a.description}</p>
              <p className="mt-4 font-mono text-xs text-lunamaze-textSecondary">
                <time dateTime={a.datePublished}>
                  {new Date(a.datePublished).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
                <span className="px-2">·</span>
                {a.readingMinutes} min read
              </p>
            </Link>
          ))}
        </div>
      </section>

      <LunaFooter />
    </main>
  );
}
