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
  title: 'AXIOM — Quit Porn App. Your Phone Never Says So.',
  description:
    'Every other quit-porn app is named the accusation. On your home screen this one just says AXIOM. Real porn addiction recovery grounded in neuroscience, a journal that never leaves your phone, one honest price, no account needed to start.',
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
    'private addiction tracker',
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
    title: 'AXIOM — Quit Porn App. Your Phone Never Says So.',
    description:
      'Every other quit-porn app is named the accusation. On your home screen this one just says AXIOM. Real porn addiction recovery grounded in neuroscience, a journal that never leaves your phone, one honest price, no account needed to start.',
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
    title: 'AXIOM — Quit Porn App. Your Phone Never Says So.',
    description:
      'Every other quit-porn app is named the accusation. On your home screen this one just says AXIOM. Real porn addiction recovery grounded in neuroscience, a journal that never leaves your phone, one honest price, no account needed to start.',
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
        'A calm, honest porn-recovery companion grounded in real neuroscience. Private by design: your journal never leaves your phone.',
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
          'Free to install. AXIOM Protocol subscription required to use the app; price shown in your own currency before you buy. The Lighthouse urge tool opens for anyone in a crisis, subscribed or not.',
      },
      featureList: [
        'Private journal that never leaves your phone',
        'Neuroscience-based recovery phases',
        'Lighthouse urge tool, open in a crisis to anyone',
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
          name: 'Is there a free version?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. AXIOM is a paid app: the monthly plan starts with a 7-day free trial for eligible new subscribers, and the exact price is shown in the app before you pay anything. We tried it the other way and it made a worse product: a free tier funded by nagging the people using it. One exception, and it is not a marketing one — if you are in an urge, the Lighthouse opens whether you have paid or not.',
          },
        },
        {
          '@type': 'Question',
          name: 'I installed AXIOM before it was paid. What changed?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Since version 2.6.0 a subscription is needed on every install, including ones from before. Your data stays yours either way: export it or delete it from Settings, with or without a subscription, and the Lighthouse still opens whether you pay or not. Already subscribed on another phone? Tap Sign in or Restore on the membership screen.',
          },
        },
        {
          '@type': 'Question',
          name: 'What if it does not help me?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ask from Settings and we make the next 30 days free. You do not have to explain what happened. It works on paid subscriptions, up to twice in any 12 months, and it adds time rather than refunding money.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can anyone at AXIOM read my journal?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Your journal never leaves your phone. The app does not send it, and our database is built to refuse journal text, trigger names and reset reasons — so there is no journal on our servers to leak, sell, or hand over. If you sign in for backup, only your streak dates and mood scores sync.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens when I relapse?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A reset, not a verdict. You log it honestly, AXIOM asks what happened and what you will do differently, and that plan comes back to you within 72 hours. Your total and your history stay. Shame is not a strategy here.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does rewiring actually take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Honestly: usually longer than the famous ninety days, and different for everyone. Many people describe the flatline lifting somewhere in weeks two to six and things steadying after two to three months. AXIOM will not promise you a date.',
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
            text: 'No account is needed, and your real name is never required. AXIOM works on your phone without signing in. If you choose to sign in for backup, only your streak dates and mood scores sync — your journal never does. A recovery buddy sees whether you are standing, never what you wrote.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is AXIOM on iPhone?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Both. Android is on Google Play and iPhone is on the App Store — same app, same private journal. The price is shown in the app, in your currency.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is this different from legacy quit apps?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No fake countdowns, no invented member counts, no panic button behind a paywall — and no journal sitting in a cloud.',
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
