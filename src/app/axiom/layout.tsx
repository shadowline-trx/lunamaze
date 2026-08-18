import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Fraunces, Instrument_Sans, JetBrains_Mono } from 'next/font/google';

// Grotesk: Instrument Sans (variable) — the big cinematic display voice and
// the body voice. Display serif: Fraunces italic — the emotional accent
// words only. Mono: the neuroscience/system voice.
const grotesk = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-grotesk',
});
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  style: ['normal', 'italic'],
  axes: ['opsz'],
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lunamaze.com'),
  title: 'AXIOM — Quit Porn App & Neuroscience Rewire Protocol | Zero-Knowledge',
  description:
    'A calm, honest porn addiction recovery companion grounded in neuroscience. Zero-knowledge privacy by design: all journals encrypted on-device. No shame, no paywalled panic tools, no fake countdowns.',
  keywords: [
    'quit porn app',
    'porn addiction recovery',
    'dopamine rewire app',
    'how to stop watching porn',
    'reboot timeline calculator',
    'porn induced erectile dysfunction',
    'compulsive sexual behavior disorder',
    'ICD-11 CSBD 6C72',
    'how to stop gooning',
    'zero-knowledge addiction tracker',
    'best quit porn app android ios',
    'deltaFosB dopamine recovery',
    'porn addiction self test',
    'dopamine detox tracker',
    'private habit tracker',
  ],
  alternates: {
    canonical: 'https://lunamaze.com/axiom/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'AXIOM — Quit Porn App & Neuroscience Rewire Protocol',
    description:
      'An honest, private porn addiction recovery app grounded in neuroplasticity. Zero-knowledge client-side encryption — your data never leaves your phone.',
    type: 'website',
    url: 'https://lunamaze.com/axiom/',
    siteName: 'Luna Maze',
    locale: 'en_US',
    images: [
      {
        url: 'https://lunamaze.com/images/axiom/og.jpg',
        width: 1200,
        height: 630,
        alt: 'AXIOM — Quit Porn App & Neuroscience Rewire Protocol',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AXIOM — Quit Porn App & Neuroscience Rewire Protocol',
    description:
      'An honest, private recovery companion. Zero-knowledge encryption by design — your story never leaves your phone readable.',
    images: ['https://lunamaze.com/images/axiom/og.jpg'],
  },
};

/**
 * Structured data for rich results (MobileApplication, MedicalWebPage, FAQPage, BreadcrumbList).
 */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MobileApplication',
      '@id': 'https://lunamaze.com/axiom/#app',
      name: 'AXIOM',
      alternateName: ['Axiom — Quit Porn Recovery', 'Axiom Habit Tracker'],
      description:
        'A calm, honest porn-recovery companion grounded in real neuroscience. Zero-knowledge encryption: your journal and history never leave your phone readable.',
      url: 'https://lunamaze.com/axiom/',
      image: 'https://lunamaze.com/images/axiom/og.jpg',
      operatingSystem: 'Android, iOS',
      applicationCategory: 'HealthApplication',
      installUrl:
        'https://play.google.com/store/apps/details?id=com.axiomapp.app',
      sameAs: ['https://apps.apple.com/app/id6791180351'],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description:
          'Free core forever (streak, check-ins, breathing, panic tools). Optional AXIOM Protocol subscription unlocks full depth.',
      },
      featureList: [
        'Zero-knowledge encrypted journal',
        'Neuroscience-based recovery phases',
        'Panic urge tools, free forever',
        'Guided somatic breathing',
        'Trigger pattern engine',
      ],
      publisher: { '@id': 'https://lunamaze.com/#org' },
    },
    {
      '@type': 'MedicalWebPage',
      '@id': 'https://lunamaze.com/axiom/#medical',
      name: 'Axiom Neuroscience Recovery Protocol',
      url: 'https://lunamaze.com/axiom/',
      about: [
        {
          '@type': 'MedicalCondition',
          name: 'Compulsive Sexual Behavior Disorder',
          code: {
            '@type': 'MedicalCode',
            code: '6C72',
            codingSystem: 'ICD-11',
          },
        },
      ],
      significantLink: [
        'https://lunamaze.com/axiom/faq/',
        'https://lunamaze.com/axiom/tools/severity-test/',
        'https://lunamaze.com/axiom/tools/rewire-calculator/',
        'https://lunamaze.com/axiom/tools/panic/',
      ],
    },
    {
      '@type': 'Organization',
      '@id': 'https://lunamaze.com/#org',
      name: 'Luna Maze',
      url: 'https://lunamaze.com/',
      logo: 'https://lunamaze.com/images/axiom/logo.webp',
      sameAs: ['https://github.com/shadowline-trx'],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is the free core actually usable, or a trial in disguise?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It is real and permanent. The streak, daily check-in, breathing, the daily brief, and every panic tool are free forever. The Protocol subscription adds depth — it never takes the core away.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can anyone at AXIOM read my journal?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Your entries are encrypted on your phone with a key we never see. What our servers store is mathematically unreadable to us — there is nothing to leak, sell, or hand over.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens when I relapse?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A reset, not a verdict. You log it honestly, the app maps what led there, and your history keeps its value. Shame is not a strategy here.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does rewiring actually take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Honestly: usually longer than the famous ninety days, and different for everyone. Most people feel the flatline lift somewhere in weeks two to six and reach a stable baseline after two to three months. AXIOM maps your arc instead of promising you a date.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do streak counters even work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Alone, no — a bare number resets to zero and takes your motivation down with it. That is why AXIOM builds phases, patterns, and triggers around the streak: a reset costs you a day, not your progress.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need an account or my real name?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We never ask for your name. The core works on your phone, and anything you choose to sync is sealed with your key before it leaves the device. There is no readable story to attach to anyone.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is AXIOM on iPhone?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Both. Android is on Google Play and iPhone is on the App Store — same app, same free core, same sealed journal.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is this different from legacy quit apps?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No fake countdowns, no invented member counts, no panic button behind a paywall — and zero bytes of your recovery story stored unencrypted in a cloud.',
          },
        },
      ],
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
          name: 'AXIOM',
          item: 'https://lunamaze.com/axiom/',
        },
      ],
    },
  ],
};

interface AxiomLayoutProps {
  children: ReactNode;
}

export default function AxiomLayout({ children }: AxiomLayoutProps) {
  return (
    <div
      className={`axiom-root ${grotesk.variable} ${fraunces.variable} ${jetbrains.variable} text-axiom-textPrimary`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {children}
    </div>
  );
}
