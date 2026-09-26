import { Bodoni_Moda, Geist, Martian_Mono } from 'next/font/google';

/**
 * Studio type system. Bodoni Moda carries optical-size and weight axes, so the
 * same family draws hairline display cuts for the hero, sturdier cuts for small
 * headings, and can shift weight in motion. Geist sets the reading text.
 * Martian Mono, condensed on its width axis, sets the instrument labels: the
 * HUD, chapter names, captions. The upright display face and the sans are
 * preloaded; the italic and the mono arrive after the first paint.
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

export const mono = Martian_Mono({
  subsets: ['latin'],
  display: 'swap',
  axes: ['wdth'],
  preload: false,
  variable: '--studio-mono',
});

export const fontVariables = [display.variable, displayItalic.variable, sans.variable, mono.variable].join(' ');
