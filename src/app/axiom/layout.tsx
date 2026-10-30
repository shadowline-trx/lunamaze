import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Fraunces, Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import '../globals.css';
import AxiomMeasurement from '@/components/axiom/AxiomMeasurement';

// Grotesk: Instrument Sans (variable) — the big cinematic display voice and
// the body voice. Display serif: Fraunces italic — the emotional accent
// words only. Mono: the neuroscience/system voice.
const grotesk = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-grotesk',
});
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-display',
  style: ['normal', 'italic'],
  axes: ['opsz'],
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lunamaze.com'),
  // Smart App Banner: Safari on iPhone shows AXIOM's App Store bar on every /axiom page.
  itunes: { appId: '6791180351' },
  title: 'AXIOM — Quit Porn App. Your Phone Never Says So.',
  description:
    'Thirty guided nights, a plan for your hardest hour, and a journal that stays on your phone. Meet AXIOM 2.7.3, the private quit-porn app for iPhone and Android.',
  keywords: [
    'quit porn app',
    'porn addiction recovery',
    'how to stop watching porn',
    'how to stop gooning',
    'private addiction tracker',
    'best quit porn app android ios',
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
      'Thirty guided nights. One task at a time. A reminder when you choose. AXIOM 2.7.3 keeps your journal on your phone.',
    type: 'website',
    url: 'https://lunamaze.com/axiom/',
    siteName: 'Luna Maze',
    locale: 'en_US',
    images: [
      {
        url: 'https://lunamaze.com/images/axiom/og.jpg',
        width: 1200,
        height: 630,
        alt: 'AXIOM, a private quit-porn app for iPhone and Android',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AXIOM — Quit Porn App. Your Phone Never Says So.',
    description:
      'Thirty guided nights. One task at a time. A reminder when you choose. AXIOM 2.7.3 keeps your journal on your phone.',
    images: ['https://lunamaze.com/images/axiom/og.jpg'],
  },
};

// Structured data lives on each page now (the landing's is in ./page.tsx), never here:
// a layout's JSON-LD rides along on every page beneath it.
interface AxiomLayoutProps {
  children: ReactNode;
}

export default function AxiomLayout({ children }: AxiomLayoutProps) {
  return (
    <div
      className={`axiom-root ${grotesk.variable} ${fraunces.variable} ${jetbrains.variable} text-axiom-textPrimary`}
    >
      {children}
      <AxiomMeasurement />
    </div>
  );
}
