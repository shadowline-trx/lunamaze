import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const title = 'Tether ADB — Wireless ADB, Screen Mirror & Device Control for Windows';
const description =
  'Tether ADB is an enterprise-grade Android device manager for Windows. QR-code wireless ADB pairing, screen mirroring, logcat, shell, and file & app management — with adb and scrcpy bundled. Free download.';
const url = 'https://lunamaze.com/tether-adb/';
const ogImage = 'https://lunamaze.com/images/tether-adb-og.png';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'Tether ADB',
    'wireless adb',
    'adb over wifi',
    'adb gui',
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
        alt: 'Tether ADB — wireless ADB and Android device control for Windows',
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

interface TetherAdbLayoutProps {
  children: ReactNode;
}

export default function TetherAdbLayout({ children }: TetherAdbLayoutProps) {
  return <div className="bg-lunamaze-bgDeep text-lunamaze-textPrimary">{children}</div>;
}
