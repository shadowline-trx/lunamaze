import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const title = 'TypeCrt — Zero-latency CRT Typing Test & Terminal Practice';
const description =
  'TypeCrt is an aesthetic, zero-latency typing test inspired by vintage CRT monitors. 50+ themes, adaptive weak-key practice, command palette, smooth caret engine, and deep performance analytics. Built in pure TypeScript. Live at typecrt.in.';
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
    'zero-latency typing',
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
        alt: 'TypeCrt — Zero-latency typing test',
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
    'Aesthetic, zero-latency typing test inspired by CRT terminals with 50+ themes, adaptive weak-key training, and live stats.',
  author: {
    '@type': 'Organization',
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
    <div className="bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {children}
    </div>
  );
}
