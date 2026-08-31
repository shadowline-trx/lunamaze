import KernProductLanding from '@/components/kern/KernProductLanding';

const KERN_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MobileApplication',
      '@id': 'https://lunamaze.com/kern/#app',
      name: 'Kern',
      url: 'https://lunamaze.com/kern/',
      description:
        'A private native Android launcher with ranked local search, an honest daily ledger, focus sessions, and plain-text pages.',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Android 8.0 and later',
      isAccessibleForFree: true,
      featureList: [
        'Ranked local search for apps, shortcuts, settings, notes, and arithmetic',
        'An on-device daily activity ledger',
        'Focus sessions with regular, strict, and breathe modes',
        'Plain-text pages and daily tasks',
        'On-device learning with clearable history',
        'No account, cloud sync, ads, or analytics',
      ],
      image: 'https://lunamaze.com/images/kern/og.png',
      publisher: {
        '@type': 'Organization',
        '@id': 'https://lunamaze.com/#organization',
        name: 'Luna Maze',
        url: 'https://lunamaze.com/',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Luna Maze',
          item: 'https://lunamaze.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Kern',
          item: 'https://lunamaze.com/kern/',
        },
      ],
    },
  ],
};

export default function KernPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(KERN_JSON_LD) }}
      />
      <KernProductLanding />
    </>
  );
}
