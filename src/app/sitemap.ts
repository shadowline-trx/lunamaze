import type { MetadataRoute } from 'next';
import { ALL_ARTICLES } from '@/content/blog';
import { TYPECRT_ARTICLES } from '@/content/typecrt';

// Required for `output: 'export'` (static hosting on GitHub Pages).
export const dynamic = 'force-static';

const BASE = 'https://lunamaze.com';

/**
 * Static sitemap for the Luna Maze site. Kept in sync with the app routes under
 * `src/app`. Uses trailing slashes to match `trailingSlash: true` in next.config.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; lastModified?: Date }> = [
    { path: '/', priority: 1.0, changeFrequency: 'monthly', lastModified: new Date('2026-08-31') },
    { path: '/tether-adb/', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/axiom/', priority: 0.8, changeFrequency: 'monthly' },
    // Weekly while the listing status is in flux; this page's copy changes the
    // day Apple approves.
    { path: '/axiom/ios/', priority: 0.8, changeFrequency: 'weekly' },
    // Weekly until the Play listing is live and the copy settles.
    { path: '/kern/', priority: 0.9, changeFrequency: 'weekly', lastModified: new Date('2026-08-31') },
    { path: '/kern/faq/', priority: 0.8, changeFrequency: 'monthly', lastModified: new Date('2026-08-31') },
    { path: '/typecrt/', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/typecrt/blog/', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/drift/', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/genesis/', priority: 0.8, changeFrequency: 'monthly', lastModified: new Date('2026-09-05') },
    { path: '/axiom/privacy/', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/kern/privacy/', priority: 0.3, changeFrequency: 'yearly', lastModified: new Date('2026-08-29') },
    { path: '/axiom/terms/', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/axiom/blog/', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/axiom/faq/', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/axiom/tools/', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/axiom/tools/severity-test/', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/axiom/tools/rewire-calculator/', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/axiom/tools/panic/', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/axiom/tools/wallpaper/', priority: 0.7, changeFrequency: 'monthly' },
  ];

  // TypeCrt's writing library. English only — see src/content/typecrt/index.ts.
  const typecrtRoutes = TYPECRT_ARTICLES.map((a) => ({
    path: `/typecrt/blog/${a.slug}/`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
    lastModified: new Date(a.dateModified),
  }));

  // Every blog article in every language, derived from the content registry.
  const articleRoutes = ALL_ARTICLES.map((a) => ({
    path: `/axiom/blog/${a.lang}/${a.slug}/`,
    priority: a.lang === 'en' ? 0.7 : 0.6,
    changeFrequency: 'monthly' as const,
    lastModified: new Date(a.dateModified),
  }));

  return [
    ...routes.map((r) => ({
      url: `${BASE}${r.path}`,
      ...(r.lastModified === undefined ? {} : { lastModified: r.lastModified }),
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...articleRoutes.map((r) => ({
      url: `${BASE}${r.path}`,
      lastModified: r.lastModified,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...typecrtRoutes.map((r) => ({
      url: `${BASE}${r.path}`,
      lastModified: r.lastModified,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
  ];
}
