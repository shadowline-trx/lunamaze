import type { Metadata } from 'next';
import LunaNavbar from '@/components/lunamaze/LunaNavbar';
import LunaHero from '@/components/lunamaze/LunaHero';
import StudioSection from '@/components/lunamaze/StudioSection';
import ProductsGrid from '@/components/lunamaze/ProductsGrid';
import CapabilitiesSection from '@/components/lunamaze/CapabilitiesSection';
import FounderSection from '@/components/lunamaze/FounderSection';
import ContactSection from '@/components/lunamaze/ContactSection';
import LunaFooter from '@/components/lunamaze/LunaFooter';
import DotGrid from '@/components/backgrounds/DotGrid';
import { products, capabilities } from '@/content/lunamaze';

export const metadata: Metadata = {
  title: 'Luna Maze — Independent Product Studio',
  description:
    'Luna Maze is an independent product studio building focused software for cognition, Android, writing, play, and everyday speed. Explore Axiom, Tether ADB, TypeCrt, Drift, and Kern.',
  alternates: {
    canonical: 'https://lunamaze.com/',
  },
  openGraph: {
    title: 'Luna Maze — Independent Product Studio',
    description:
      'Focused software for cognition, Android, writing, play, and everyday speed. Explore Axiom, Tether ADB, TypeCrt, Drift, and Kern.',
    url: 'https://lunamaze.com',
    siteName: 'Luna Maze',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://lunamaze.com/images/axiom/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Luna Maze — Independent Product Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luna Maze — Independent Product Studio',
    description:
      'Focused software for cognition, Android, writing, play, and everyday speed. Explore Axiom, Tether ADB, TypeCrt, Drift, and Kern.',
    images: ['https://lunamaze.com/images/axiom/og.jpg'],
  },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://lunamaze.com/#organization',
      name: 'Luna Maze',
      alternateName: ['Luna Maze Studio', 'LunaMaze'],
      url: 'https://lunamaze.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lunamaze.com/images/axiom/logo.png',
        caption: 'Luna Maze Logo',
      },
      description:
        'Luna Maze is an independent product studio building premium tools at the intersection of cognition, focus, and craft.',
      founder: {
        '@type': 'Person',
        name: 'Thehan',
        jobTitle: 'Founder & Principal Engineer',
      },
      sameAs: [
        'https://github.com/shadowline-trx',
      ],
      knowsAbout: [
        'Software Engineering',
        'Mobile Application Architecture',
        'Android Debug Bridge',
        'Cognitive Psychology',
        'Zero-Knowledge Security',
        'Neuroplasticity',
      ],
      owns: [
        {
          '@type': 'MobileApplication',
          '@id': 'https://lunamaze.com/axiom/#app',
          name: 'AXIOM',
          url: 'https://lunamaze.com/axiom/',
          applicationCategory: 'HealthApplication',
          operatingSystem: 'iOS, Android',
          description: 'A calm, honest recovery companion grounded in neuroscience with zero-knowledge privacy.',
        },
        {
          '@type': 'SoftwareApplication',
          '@id': 'https://lunamaze.com/tether-adb/#app',
          name: 'Tether ADB',
          url: 'https://lunamaze.com/tether-adb/',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Windows',
          description: 'An enterprise-grade Android device control center for Windows with wireless QR ADB pairing and screen mirroring.',
        },
        {
          '@type': 'WebApplication',
          '@id': 'https://lunamaze.com/typecrt/#app',
          name: 'TypeCrt',
          url: 'https://lunamaze.com/typecrt/',
          applicationCategory: 'BrowserApplication',
          description: 'Zero-latency CRT-styled typing test with adaptive weak-key training and command palette.',
        },
        {
          '@type': 'SoftwareApplication',
          '@id': 'https://lunamaze.com/drift/#app',
          name: 'Drift',
          url: 'https://lunamaze.com/drift/',
          applicationCategory: 'GameApplication',
          description: 'A handcrafted precision puzzle game exploring focus and calm design.',
        },
        {
          '@type': 'MobileApplication',
          '@id': 'https://lunamaze.com/kern/#app',
          name: 'Kern',
          url: 'https://lunamaze.com/kern/',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Android 8.0 and later',
          description: 'A private native Android launcher with ranked local search, a daily ledger, focus sessions, and plain-text pages.',
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://lunamaze.com/#website',
      url: 'https://lunamaze.com',
      name: 'Luna Maze',
      publisher: {
        '@id': 'https://lunamaze.com/#organization',
      },
      description: 'Independent product studio building premium tools for cognition, focus, and craft.',
    },
  ],
};

export default function LunaMazePage() {
  return (
    <div className="relative min-h-screen bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <LunaNavbar />
      <main>
        <LunaHero />
        <div className="lunamaze-grid-bg lunamaze-noise relative">
          <DotGrid />
          <div className="relative z-10">
            <StudioSection />
            <ProductsGrid products={products} />
            <CapabilitiesSection items={capabilities} />
          </div>
        </div>
        <FounderSection />
        <ContactSection />
      </main>
      <LunaFooter />
    </div>
  );
}
