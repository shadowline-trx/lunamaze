import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'TypeCrt — Zero-latency typing test',
  description:
    'TypeCrt is an aesthetic, zero-latency typing test inspired by CRT terminals. 50+ themes, smart practice on your weak keys, a command palette, a smooth caret engine, and a 3-tier profile dashboard. Built in pure TypeScript. Live at typecrt.in.',
  keywords: [
    'typing test',
    'typing speed',
    'CRT',
    'monkeytype alternative',
    'wpm',
    'typing practice',
  ],
  openGraph: {
    title: 'TypeCrt — Zero-latency typing test',
    description:
      'CRT-styled typing test. 50+ themes, smart practice, command palette. Built in pure TypeScript.',
    type: 'website',
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
      {children}
    </div>
  );
}
