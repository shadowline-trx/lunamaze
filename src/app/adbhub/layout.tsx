import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const title = 'ADB Hub — Android Device Control for Windows (Wired & Wireless)';
const description =
  'ADB Hub is an enterprise-grade Android device manager for Windows. QR-code wireless pairing, screen mirroring, logcat, shell, and file & app management — with adb and scrcpy bundled. Free download.';
const url = 'https://lunamaze.com/adbhub/';
const ogImage = 'https://lunamaze.com/images/adbhub-og.png';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'ADB Hub',
    'adb gui',
    'wireless adb',
    'adb over wifi',
    'qr code adb pairing',
    'scrcpy gui',
    'android screen mirror windows',
    'android device manager',
    'logcat viewer',
    'android debug bridge gui',
    'wireless debugging',
    'adb file manager',
  ],
  authors: [{ name: 'Luna Maze', url: 'https://lunamaze.com' }],
  creator: 'Luna Maze',
  publisher: 'Luna Maze',
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    siteName: 'Luna Maze',
    type: 'website',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'ADB Hub — Android device control for Windows',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage],
  },
  category: 'technology',
};

interface AdbHubLayoutProps {
  children: ReactNode;
}

export default function AdbHubLayout({ children }: AdbHubLayoutProps) {
  return <div className="bg-lunamaze-bgDeep text-lunamaze-textPrimary">{children}</div>;
}
