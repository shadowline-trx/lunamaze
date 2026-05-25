import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Axiom — Your truth. Daily.',
  description:
    'Premium habit tracker for brain recovery. Build unbreakable streaks, rewire your neural pathways, and reclaim your focus with science-backed missions.',
  keywords: [
    'habit tracker',
    'brain recovery',
    'dopamine detox',
    'productivity',
    'mental health',
    'self improvement',
  ],
  openGraph: {
    title: 'Axiom — Your truth. Daily.',
    description: 'Premium habit tracker for brain recovery.',
    type: 'website',
  },
};

interface AxiomLayoutProps {
  children: ReactNode;
}

export default function AxiomLayout({ children }: AxiomLayoutProps) {
  return <div className="bg-axiom-bgDeep text-axiom-textPrimary">{children}</div>;
}
