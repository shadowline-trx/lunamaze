import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
// Product sections import ./globals.css from their own layouts; the studio
// home ships only its own stylesheet and type.

export const metadata: Metadata = {
  metadataBase: new URL('https://lunamaze.com'),
  title: {
    default: 'Luna Maze — Independent Software Studio',
    template: '%s | Luna Maze',
  },
  description:
    'Luna Maze is an independent software studio making Axiom, Kern, Tether ADB, TypeCrt and Drift: focused, private software for the mind, the phone and the desk.',
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
    'privacy-first tools',
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
    title: 'Luna Maze — Independent Software Studio',
    description:
      'Focused, private software for the mind, the phone and the desk. Home of Axiom, Kern, Tether ADB, TypeCrt and Drift.',
    url: 'https://lunamaze.com',
    siteName: 'Luna Maze',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og/lunamaze-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Luna Maze: a silver labyrinth inside a violet crescent moon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luna Maze — Independent Software Studio',
    description:
      'Focused, private software for the mind, the phone and the desk. Home of Axiom, Kern, Tether ADB, TypeCrt and Drift.',
    images: ['/images/og/lunamaze-og.jpg'],
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
  themeColor: '#09070f',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
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
