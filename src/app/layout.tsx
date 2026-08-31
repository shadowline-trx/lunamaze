import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
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
    'Luna Maze is an independent product studio building focused software for cognition, Android, writing, play, and everyday speed. Home of Axiom, Tether ADB, TypeCrt, Drift, and Kern.',
  keywords: [
    'Luna Maze',
    'product studio',
    'independent software',
    'Axiom recovery',
    'Tether ADB',
    'TypeCrt',
    'Drift game',
    'Kern Android launcher',
    'minimal Android launcher',
    'zero-knowledge tools',
    'developer tools',
  ],
  authors: [{ name: 'Luna Maze', url: 'https://lunamaze.com' }],
  creator: 'Luna Maze',
  publisher: 'Luna Maze',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Luna Maze — Independent Product Studio',
    description:
      'Focused software for cognition, Android, writing, play, and everyday speed. Home of Axiom, Tether ADB, TypeCrt, Drift, and Kern.',
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
      'Focused software for cognition, Android, writing, play, and everyday speed. Home of Axiom, Tether ADB, TypeCrt, Drift, and Kern.',
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                let loaded = false;
                const loadAnalytics = () => {
                  if (loaded) return;
                  loaded = true;
                  window.dataLayer = window.dataLayer || [];
                  window.gtag = function(){window.dataLayer.push(arguments);};
                  window.gtag('js', new Date());
                  window.gtag('config', 'G-WW8NXCDK0E');
                  const script = document.createElement('script');
                  script.async = true;
                  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-WW8NXCDK0E';
                  document.head.appendChild(script);
                };
                ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach((event) =>
                  window.addEventListener(event, loadAnalytics, { once: true, passive: true })
                );
                window.setTimeout(loadAnalytics, 15000);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
