import type { MetadataRoute } from 'next';

// Required for `output: 'export'` (static hosting on GitHub Pages).
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Applebot',
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot',
        ],
        allow: '/',
      },
      {
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended',
          'Applebot-Extended',
          'Amazonbot',
          'cohere-ai',
          'Bytespider',
          'CCBot',
        ],
        allow: '/',
      },
    ],
    sitemap: 'https://lunamaze.com/sitemap.xml',
    host: 'https://lunamaze.com',
  };
}
