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
  metadataBase: new URL('https://lunamaze.com'),
  title: {
    default: 'Luna Maze — Independent Product Studio',
    template: '%s | Luna Maze',
  },
  description:
    'Luna Maze is an independent product studio building premium tools at the intersection of cognition, focus, and craft. Home of Axiom, Tether ADB, TypeCrt, and Drift.',
  keywords: [
    'Luna Maze',
    'product studio',
    'independent software',
    'Axiom recovery',
    'Tether ADB',
    'TypeCrt',
    'Drift game',
    'zero-knowledge tools',
    'developer tools',
  ],
  authors: [{ name: 'Luna Maze', url: 'https://lunamaze.com' }],
  creator: 'Luna Maze',
  publisher: 'Luna Maze',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Luna Maze — Independent Product Studio',
    description:
      'Premium tools at the intersection of cognition, focus, and craft. Home of Axiom, Tether ADB, TypeCrt, and Drift.',
    url: 'https://lunamaze.com',
    siteName: 'Luna Maze',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/axiom/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Luna Maze — Independent Product Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luna Maze — Independent Product Studio',
    description:
      'Premium tools at the intersection of cognition, focus, and craft. Home of Axiom, Tether ADB, TypeCrt, and Drift.',
    images: ['/images/axiom/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
