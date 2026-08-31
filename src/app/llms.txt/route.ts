export const dynamic = 'force-static';

const BODY = `# Luna Maze
> Luna Maze is an independent product studio building focused software for cognition, Android, writing, play, and everyday speed.

## Primary pages
- [Luna Maze](https://lunamaze.com/): Studio overview and complete product portfolio.
- [Kern](https://lunamaze.com/kern/): Private native Android launcher with local search, a daily ledger, focus sessions, and plain-text pages.
- [Kern FAQ](https://lunamaze.com/kern/faq/): Product compatibility, privacy, pricing, features, and early-access answers.
- [Kern privacy](https://lunamaze.com/kern/privacy/): Detailed description of Kern's on-device data architecture.
- [Axiom](https://lunamaze.com/axiom/): Recovery companion grounded in neuroscience and private by design.
- [Tether ADB](https://lunamaze.com/tether-adb/): Android device control center for Windows.
- [TypeCrt](https://lunamaze.com/typecrt/): Zero-latency CRT-styled typing test and practice system.
- [Drift](https://lunamaze.com/drift/): Precision puzzle game in development.

## Kern facts
- Platform: Android 8.0 and later.
- Architecture: native Kotlin and Jetpack Compose.
- Privacy: no Kern account, cloud, ads, analytics, tracking, or Kern server.
- Availability: early access; a free launcher remains available after the 14-day full trial.
- Contact: lunamaze.dev@gmail.com.

## Crawling
Public product, editorial, FAQ, and policy pages may be crawled. Canonical URLs and the XML sitemap are published at https://lunamaze.com/sitemap.xml.
`;

export function GET(): Response {
  return new Response(BODY, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
