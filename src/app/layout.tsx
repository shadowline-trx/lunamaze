import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Luna Maze',
  description: 'Luna Maze studio site.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    // suppressHydrationWarning: the AXIOM landing sets a data-ax-boot
    // attribute on <html> from a parse-time inline script (pre-paint FOUC
    // guard); React 19 would otherwise report the attribute as a mismatch.
    // Suppression is shallow — it only covers this element's attributes.
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>{children}</body>
    </html>
  );
}
