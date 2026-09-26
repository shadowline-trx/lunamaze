import TetherLanding from '@/components/tether/TetherLanding';
import { DOWNLOAD_URL, FAQS, PAGE_URL } from '@/components/tether/content';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Tether ADB',
      operatingSystem: 'Windows 10, Windows 11',
      applicationCategory: 'DeveloperApplication',
      description:
        'Enterprise-grade Android device control center for Windows: QR-code wireless pairing, screen mirroring, logcat, shell, file and app management, and automation. adb and scrcpy bundled.',
      url: PAGE_URL,
      downloadUrl: DOWNLOAD_URL,
      softwareVersion: '0.1.2',
      fileSize: '10MB',
      image: 'https://lunamaze.com/images/tether-adb-og.png',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@type': 'Organization', '@id': 'https://lunamaze.com/#organization', name: 'Luna Maze', url: 'https://lunamaze.com' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

export default function TetherAdbPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TetherLanding />
    </>
  );
}
