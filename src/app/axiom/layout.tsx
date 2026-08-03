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
// Only the opsz axis: SOFT was never dialled away from default, and dropping
// it meaningfully shrinks the variable-font payload.
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
  title: 'AXIOM — Quit porn. Rewire your brain. Keep it private.',
  description:
    'A calm, honest recovery companion grounded in real neuroscience. No shame, no fake countdowns, no selling your story. Zero-knowledge by design: your recovery never leaves your phone.',
  keywords: [
    'quit porn',
    'quit porn app',
    'porn recovery',
    'porn addiction help',
    'dopamine detox',
    'rewire brain',
    'reboot',
    'streak tracker',
    'private recovery app',
    'zero-knowledge',
    'no dark patterns',
  ],
  alternates: {
    canonical: '/axiom/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'AXIOM — Quit porn. Rewire your brain. Keep it private.',
    description:
      'An honest, private recovery app. No shame, no dark patterns, and your data never leaves your phone.',
    type: 'website',
    url: 'https://lunamaze.com/axiom/',
    siteName: 'Luna Maze',
    locale: 'en_US',
    images: [
      {
        url: 'https://lunamaze.com/images/axiom/og.jpg',
        width: 1200,
        height: 630,
        alt: 'AXIOM — Quit porn. Rewire your brain. Keep it private.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AXIOM — Quit porn. Rewire your brain. Keep it private.',
    description:
      'An honest, private recovery app. Zero-knowledge by design — your recovery never leaves your phone.',
    images: ['https://lunamaze.com/images/axiom/og.jpg'],
  },
};

/**
 * Structured data for rich results. Honest by policy: no fabricated
 * aggregateRating, no inflated numbers — app identity, pricing model, and
 * publisher only.
 */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MobileApplication',
      '@id': 'https://lunamaze.com/axiom/#app',
      name: 'AXIOM',
      alternateName: 'Axiom — Quit Porn Recovery',
      description:
        'A calm, honest porn-recovery companion grounded in real neuroscience. Zero-knowledge encryption: your journal and history never leave your phone readable.',
      url: 'https://lunamaze.com/axiom/',
      image: 'https://lunamaze.com/images/axiom/og.jpg',
      operatingSystem: 'Android',
      applicationCategory: 'HealthApplication',
      installUrl:
        'https://play.google.com/store/apps/details?id=com.axiomapp.app',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description:
          'Free core forever (streak, check-ins, breathing, panic tools). Optional AXIOM Protocol subscription unlocks the full depth.',
      },
      featureList: [
        'Zero-knowledge encrypted journal',
        'Neuroscience-based recovery phases',
        'Panic tools, free forever',
        'Guided breathing',
        'Trigger pattern engine',
      ],
      publisher: { '@id': 'https://lunamaze.com/#org' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://lunamaze.com/#org',
      name: 'Luna Maze',
      url: 'https://lunamaze.com/',
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
            text: 'Android is live on Google Play. iOS is in open beta — join from the iOS page and it installs through TestFlight today.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is this different from the big-name quit apps?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No fake countdowns, no invented member counts, no panic button behind a paywall — and none of your story stored readable in a cloud.',
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
    // No background colour here on purpose: the page-wide ParticleField stage
    // sits at -z-10, and a non-positioned block's background paints AFTER its
    // negative z-index descendants, so an opaque colour here buries the canvas
    // completely. <body> supplies the base colour.
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
