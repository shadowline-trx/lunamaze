import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Fraunces, JetBrains_Mono } from 'next/font/google';

// Display: Fraunces (variable optical-size serif) — warm, editorial, the
// compassionate "honest premium" voice. Mono: the neuroscience/system voice.
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  axes: ['opsz', 'SOFT'],
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'AXIOM — Quit porn. Rewire your brain. Keep it private.',
  description:
    'A calm, honest recovery companion grounded in real neuroscience. No shame, no fake countdowns, no selling your story. Zero-knowledge by design: your recovery never leaves your phone.',
  keywords: [
    'quit porn',
    'porn recovery',
    'dopamine detox',
    'rewire brain',
    'reboot',
    'streak tracker',
    'private',
    'zero-knowledge',
    'no dark patterns',
  ],
  openGraph: {
    title: 'AXIOM — Quit porn. Rewire your brain. Keep it private.',
    description:
      'An honest, private recovery app. No shame, no dark patterns, and your data never leaves your phone.',
    type: 'website',
  },
};

interface AxiomLayoutProps {
  children: ReactNode;
}

export default function AxiomLayout({ children }: AxiomLayoutProps) {
  return (
    // No background colour here on purpose: the page-wide NeuralField canvas
    // sits at -z-10, and a non-positioned block's background paints AFTER its
    // negative z-index descendants, so an opaque colour here buries the shader
    // completely. <body> supplies the base colour; DawnJourney the fallback.
    <div
      className={`axiom-root ${fraunces.variable} ${jetbrains.variable} text-axiom-textPrimary`}
    >
      {children}
    </div>
  );
}
