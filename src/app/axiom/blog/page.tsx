import type { Metadata } from 'next';
import Link from 'next/link';
import { articleVersions, englishArticles } from '@/content/blog';
import { BLOG_LANGUAGES, type BlogArticle } from '@/content/blog/types';
import { BLOG_COLLECTIONS } from '@/content/blog/collections';
import { internalUrl } from '@/lib/paths';
import styles from './library.module.css';

export const metadata: Metadata = {
  title: 'Quitting Porn: Practical Guides for Urges, Slips & Daily Plans',
  description: 'Free guides to urge surfing, what to do after a slip, first-week plans, blockers and private tracking. Read by situation, with sources and clear limits.',
  alternates: { canonical: 'https://lunamaze.com/axiom/blog/' },
  openGraph: {
    title: 'The AXIOM Recovery Library',
    description: 'For an urge, a difficult evening, or the morning after. Practical reading with sources.',
    url: 'https://lunamaze.com/axiom/blog/',
    type: 'website',
  },
};

function ArticleRow({ article }: { article: BlogArticle }) {
  const versions = articleVersions(article.slug);
  return <article className={styles.article}>
    <div>
      <h3 className={styles.title}><Link href={`/axiom/blog/en/${article.slug}/`}>{article.title}</Link></h3>
      <p>{article.description}</p>
    </div>
    <div className={styles.time}><span>{article.readingMinutes} min read</span><br /><time dateTime={article.dateModified}>{article.dateModified}</time></div>
    {versions.length > 1 && <nav className={styles.languages} aria-label={`Languages for ${article.title}`}>
      {versions.map((v) => <Link key={v.lang} href={`/axiom/blog/${v.lang}/${v.slug}/`} hrefLang={v.lang}>{BLOG_LANGUAGES[v.lang]?.nativeName ?? v.lang}</Link>)}
    </nav>}
  </article>;
}

export default function BlogIndexPage() {
  const articles = englishArticles();
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const grouped = new Set<string>(BLOG_COLLECTIONS.flatMap((c) => [...c.slugs]));
  const remaining = articles.filter((a) => !grouped.has(a.slug));
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: 'AXIOM Recovery Library', url: 'https://lunamaze.com/axiom/blog/',
    mainEntity: { '@type': 'ItemList', itemListElement: articles.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.title, url: `https://lunamaze.com/axiom/blog/en/${a.slug}/` })) },
  };
  return <div className={styles.library}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <nav className={styles.nav} aria-label="AXIOM">
      <Link href="/axiom/" className={styles.brand}><img src={internalUrl('/images/axiom/logo.webp')} alt="" width={30} height={30} />AXIOM</Link>
      <Link href="/axiom/#tonight">Inside the app ↗</Link>
    </nav>
    <main>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>The recovery library / free to read</p>
        <h1>Quitting porn,<br /><em>one situation at a time.</em></h1>
        <p>An urge at midnight. A slip this morning. A plan you want to keep tonight. Start with the thing in front of you.</p>
        <nav className={styles.choices} aria-label="Find a guide by situation">{BLOG_COLLECTIONS.map((c) => <a key={c.id} href={`#${c.id}`}>{c.label}</a>)}</nav>
      </header>
      <div className={styles.content}>
        {BLOG_COLLECTIONS.map((collection, i) => <section className={styles.collection} key={collection.id} id={collection.id} aria-labelledby={`${collection.id}-heading`}>
          <div className={styles.collectionHead}><span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><div><h2 id={`${collection.id}-heading`}>{collection.label}</h2><p>{collection.description}</p></div></div>
          <div className={styles.articles}>{collection.slugs.map((slug) => { const article = bySlug.get(slug); return article ? <ArticleRow key={slug} article={article} /> : null; })}</div>
        </section>)}
        {remaining.length > 0 && <section className={styles.collection} aria-label="More reading"><div className={styles.articles}>{remaining.map((a) => <ArticleRow key={a.slug} article={a} />)}</div></section>}
        <aside className={styles.pause}><div><h2>Reading can wait. Need a pause?</h2><p>A breath pacer, grounding steps and a timer. No account or install.</p></div><Link href="/axiom/tools/panic/">Open the free Panic Button ↗</Link></aside>
      </div>
    </main>
    <footer className={styles.footer}><p>Published by <Link href="/">Luna Maze</Link>. Sources and reading dates appear with each guide.<br />Educational reading, not a diagnosis or a treatment plan.</p><Link href="/axiom/privacy/">Privacy</Link></footer>
  </div>;
}
