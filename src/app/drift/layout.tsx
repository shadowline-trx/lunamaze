import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const title = 'Drift — Handcrafted Precision Puzzle Game';
const description =
  'Drift is a handcrafted precision puzzle game from Luna Maze, currently in closed testing on the Google Play Console. A calm, exacting exploration of momentum, timing, and control.';
const url = 'https://lunamaze.com/drift/';
const ogImage = 'https://lunamaze.com/images/axiom/og.jpg';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'Drift',
    'puzzle game',
    'precision puzzle game',
    'indie mobile game',
    'calm puzzle game',
    'android puzzle game',
    'Luna Maze game',
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
        alt: 'Drift — Precision puzzle game from Luna Maze',
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
  '@type': 'VideoGame',
  '@id': 'https://lunamaze.com/drift/#game',
  name: 'Drift',
  url: 'https://lunamaze.com/drift/',
  genre: ['Puzzle', 'Precision', 'Indie'],
  gamePlatform: ['Android', 'iOS'],
  applicationCategory: 'GameApplication',
  description:
    'A handcrafted precision puzzle game exploring momentum, spatial anticipation, and calm aesthetics.',
  author: {
    '@type': 'Organization',
    name: 'Luna Maze',
    url: 'https://lunamaze.com',
  },
};

interface DriftLayoutProps {
  children: ReactNode;
}

export default function DriftLayout({ children }: DriftLayoutProps) {
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
