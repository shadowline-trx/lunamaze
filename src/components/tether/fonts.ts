import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';

/**
 * Tether ADB's type: Space Grotesk for everything read, JetBrains Mono for
 * everything that would appear in a terminal. Preloaded per page by
 * scripts/defer-hydration.mjs rather than by next/font, which would preload
 * them on every product page.
 */
export const display = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--tether-display',
});

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--tether-mono',
});

export const tetherFonts = `${display.variable} ${mono.variable}`;
