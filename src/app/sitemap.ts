import type { MetadataRoute } from 'next';

// Required for `output: 'export'` (static hosting on GitHub Pages).
export const dynamic = 'force-static';

const BASE = 'https://lunamaze.com';

/**
 * Static sitemap for the Luna Maze site. Kept in sync with the app routes under
 * `src/app`. Uses trailing slashes to match `trailingSlash: true` in next.config.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
    { path: '/', priority: 1.0, changeFrequency: 'monthly' },
    { path: '/adbhub/', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/axiom/', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/typecrt/', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/drift/', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/axiom/privacy/', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/axiom/terms/', priority: 0.3, changeFrequency: 'yearly' },
  ];

  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
