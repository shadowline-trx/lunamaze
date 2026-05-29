import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Drift — Precision puzzle game',
  description:
    'Drift is a precision puzzle game from Luna Maze, currently in closed testing on the Google Play Console. A calm, exacting test of timing and control.',
  keywords: [
    'puzzle game',
    'precision game',
    'mobile game',
    'android game',
    'indie game',
  ],
  openGraph: {
    title: 'Drift — Precision puzzle game',
    description:
      'A precision puzzle game from Luna Maze. In closed testing on Google Play.',
    type: 'website',
  },
};

interface DriftLayoutProps {
  children: ReactNode;
}

export default function DriftLayout({ children }: DriftLayoutProps) {
  return (
    <div className="bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      {children}
    </div>
  );
}
