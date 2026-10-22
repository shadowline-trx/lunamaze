import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Fraunces, Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import '../globals.css';

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
    </div>
  );
}
