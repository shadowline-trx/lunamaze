import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Axiom Privacy Policy — Luna Maze',
  description:
    'How Luna Maze handles your data in Axiom. Local-first, no tracking, no ads — privacy by design.',
  alternates: {
    canonical: 'https://lunamaze.com/axiom/privacy/',
  },
  openGraph: {
    title: 'Axiom Privacy Policy — Luna Maze',
    description:
      'Local-first, no tracking, no ads. How Luna Maze handles your data in Axiom.',
    type: 'website',
  },
};

interface PrivacyLayoutProps {
  children: ReactNode;
}

export default function PrivacyLayout({ children }: PrivacyLayoutProps) {
  return (
    <div className="bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      {children}
    </div>
  );
}
