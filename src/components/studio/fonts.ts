import { Bodoni_Moda, Geist, Geist_Mono } from 'next/font/google';

/**
 * Studio type system. Bodoni Moda carries the optical-size axis, so the same
 * family draws hairline display cuts for the hero and sturdier text cuts for
 * small headings. The upright display face and the sans are preloaded: the
 * first screen's title and paragraph paint with them.
 */
export const display = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal'],
  axes: ['opsz'],
  variable: '--studio-display',
});

export const displayItalic = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap',
  style: ['italic'],
  axes: ['opsz'],
  preload: false,
  variable: '--studio-display-italic',
});

export const sans = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--studio-sans',
});

export const mono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--studio-mono',
});

export const fontVariables = [display.variable, displayItalic.variable, sans.variable, mono.variable].join(' ');
