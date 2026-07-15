import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Axiom Terms of Use — Luna Maze',
  description:
    'Subscription terms for Axiom (iOS & Android). Free core, recurring plans billed by Apple or Google, a free trial on the yearly plan, and refunds handled by the stores.',
  alternates: {
    canonical: 'https://lunamaze.com/axiom/terms/',
  },
  openGraph: {
    title: 'Axiom Terms of Use — Luna Maze',
    description:
      'How Axiom subscriptions, billing, cancellation, and refunds work. Free core, recurring plans, store-handled payments.',
    type: 'website',
  },
};

interface TermsLayoutProps {
  children: ReactNode;
}

export default function TermsLayout({ children }: TermsLayoutProps) {
  return (
    <div className="bg-lunamaze-bgDeep text-lunamaze-textPrimary">
      {children}
    </div>
  );
}
