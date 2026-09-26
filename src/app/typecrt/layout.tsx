import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../globals.css';
import { interClass } from '@/lib/interFont';

const title = 'TypeCrt — CRT-Style Typing Test & Adaptive Typing Practice';
const description =
  'TypeCrt is a free typing test styled after vintage CRT monitors: 80 themes, adaptive practice on your weak keys, a command palette and published WPM formulas. Built in vanilla TypeScript. Live at typecrt.com.';
const url = 'https://lunamaze.com/typecrt/';
const ogImage = 'https://lunamaze.com/images/typecrt-logo.png';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'TypeCrt',
    'typing test',
    'typing speed test',
    'CRT typing',
    'monkeytype alternative',
    'wpm test',
    'typing practice',
    'retro terminal typing',
    'adaptive typing practice',
    'average typing speed',
  ],
  authors: [{ name: 'Luna Maze', url: 'https://lunamaze.com' }],
  creator: 'Luna Maze',
  publisher: 'Luna Maze',
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    siteName: 'Luna Maze',
    type: 'website',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'TypeCrt — CRT-style typing test',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage],
  },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://lunamaze.com/typecrt/#app',
  name: 'TypeCrt',
  url: 'https://lunamaze.com/typecrt/',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any modern browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'A typing test styled after CRT terminals, built in vanilla TypeScript, with 80 themes, adaptive weak-key practice and published WPM formulas.',
  sameAs: ['https://typecrt.com'],
  author: {
    '@type': 'Organization',
    '@id': 'https://lunamaze.com/#organization',
    name: 'Luna Maze',
    url: 'https://lunamaze.com',
  },
};

interface TypeCrtLayoutProps {
  children: ReactNode;
}

export default function TypeCrtLayout({
  children,
}: TypeCrtLayoutProps) {
  return (
    <div className={`${interClass} bg-lunamaze-bgDeep text-lunamaze-textPrimary`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {children}
    </div>
  );
}
