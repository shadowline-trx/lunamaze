import type { MetadataRoute } from 'next';

// Required for `output: 'export'` (static hosting on GitHub Pages).
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://lunamaze.com/sitemap.xml',
    host: 'https://lunamaze.com',
  };
}
