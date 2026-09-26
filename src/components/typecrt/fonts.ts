import { IBM_Plex_Mono, VT323 } from 'next/font/google';

/**
 * TypeCrt's type: VT323 is the phosphor display face (a single, small file),
 * IBM Plex Mono carries UI and reading text. Both are declared here rather
 * than in a layout so they stay scoped to the TypeCrt landing page.
 */
export const phosphor = VT323({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--tc-phosphor',
});

export const plex = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--tc-plex',
});
