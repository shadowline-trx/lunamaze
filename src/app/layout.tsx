import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import Script from 'next/script';
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

/**
 * `viewportFit: 'cover'` is what makes `env(safe-area-inset-*)` resolve to
 * anything other than 0 — without it the sticky action bars on the tools
 * pages would sit underneath the iPhone home indicator. `maximumScale` and
 * `userScalable` are deliberately left at their defaults: capping zoom is an
 * accessibility failure, and `touch-action: manipulation` already removes the
 * tap latency that capping zoom is usually (wrongly) reached for.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#050510',
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WW8NXCDK0E"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WW8NXCDK0E');
          `}
        </Script>
      </head>
      <body className={`${inter.className} min-h-screen`}>{children}</body>
    </html>
  );
}
