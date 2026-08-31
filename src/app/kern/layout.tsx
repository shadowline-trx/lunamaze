import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Fraunces, Jost } from 'next/font/google';

const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
  variable: '--kern-jost',
  weight: ['300', '400', '500'],
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--kern-fraunces',
  weight: ['700', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lunamaze.com'),
  title: 'Kern — Fast, Private Android Launcher',
  description:
    'Kern is a fast, private Android launcher with ranked local search, a daily activity ledger, focus sessions, and plain-text pages one swipe from home.',
  applicationName: 'Kern',
  category: 'technology',
  keywords: [
    'Kern launcher',
    'Android launcher',
    'minimal Android launcher',
    'private Android launcher',
    'fast app launcher',
    'Android home screen replacement',
    'local app search',
  ],
  alternates: {
    canonical: 'https://lunamaze.com/kern/',
  },
  openGraph: {
    title: 'Kern — Use your phone. Do not look at it.',
    description:
      'Ranked local search, an honest daily ledger, focus sessions, and pages one swipe from home. No account and no cloud.',
    type: 'website',
    url: 'https://lunamaze.com/kern/',
    siteName: 'Luna Maze',
    images: [
      {
        url: 'https://lunamaze.com/images/kern/og.png',
        width: 1731,
        height: 909,
        alt: 'Kern — Use your phone. Do not look at it.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kern — Use your phone. Do not look at it.',
    description:
      'Ranked local search, an honest daily ledger, focus sessions, and pages one swipe from home. No account and no cloud.',
    images: ['https://lunamaze.com/images/kern/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

interface KernLayoutProps {
  children: ReactNode;
}

export default function KernLayout({ children }: KernLayoutProps) {
  return (
    <div className={`${jost.variable} ${fraunces.variable}`}>
      {children}
    </div>
  );
}
