/**
 * Luna Maze brand contrast pairs.
 *
 * This module is the single source of truth for the foreground/background
 * color combinations used across the Luna Maze studio site. The contrast
 * property test (Property 4) iterates over `contrastPairs` and asserts that
 * each pair satisfies the WCAG AA threshold for its `kind`:
 *   - `normal` text: ratio >= 4.5
 *   - `large`  text: ratio >= 3.0
 *
 * Hex values mirror the `lunamaze` color tokens declared in tailwind.config.js
 * and the contrast table in design.md.
 */

export type ContrastKind = 'normal' | 'large';

export interface ContrastPair {
  readonly id: string;
  readonly fg: string;
  readonly bg: string;
  readonly use: string;
  readonly kind: ContrastKind;
}

export const contrastPairs: ReadonlyArray<ContrastPair> = [
  {
    id: 'text-primary-on-bg-deep',
    fg: '#F2F3FA',
    bg: '#06081A',
    use: 'body text on deepest bg',
    kind: 'normal',
  },
  {
    id: 'text-primary-on-bg-primary',
    fg: '#F2F3FA',
    bg: '#0A0E27',
    use: 'body text',
    kind: 'normal',
  },
  {
    id: 'text-primary-on-bg-surface',
    fg: '#F2F3FA',
    bg: '#121737',
    use: 'card text',
    kind: 'normal',
  },
  {
    id: 'text-secondary-on-bg-primary',
    fg: '#B6B9D2',
    bg: '#0A0E27',
    use: 'secondary text',
    kind: 'normal',
  },
  {
    id: 'signal-on-bg-primary',
    fg: '#FFD27A',
    bg: '#0A0E27',
    use: 'accent / CTA text',
    kind: 'normal',
  },
  {
    id: 'violet-light-on-bg-primary',
    fg: '#A48CFF',
    bg: '#0A0E27',
    use: 'links / CTA',
    kind: 'normal',
  },
];
