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
  title: 'Kern — A launcher for people who would rather use their phone than look at it',
  description:
    'A private Android launcher with two-keystroke search, an honest daily ledger, and notes one swipe from home.',
  alternates: {
    canonical: 'https://lunamaze.com/kern/',
  },
  openGraph: {
    title: 'Kern — Use your phone. Do not look at it.',
    description:
      'Two-keystroke search, an honest daily ledger, and notes one swipe from home. No account and no cloud.',
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
      'Two-keystroke search, an honest daily ledger, and notes one swipe from home. No account and no cloud.',
    images: ['https://lunamaze.com/images/kern/og.png'],
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
