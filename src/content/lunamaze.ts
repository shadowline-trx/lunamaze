/**
 * Luna Maze shared studio contact data, used by the product pages' footer and
 * the Axiom legal pages and the studio home's public company details.
 */

export interface SocialLink {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly host: 'github' | 'linkedin' | 'twitter' | 'email';
}

export const contactEmail: string = 'hello@lunamaze.com';
export const establishedYear = '2026';
export const studioCountry = 'India';
/** First successful public GitHub Pages deployment, separate from the studio's establishment. */
export const websiteLaunchDate = '2026-05-25';
export const websiteLaunchLabel = '25 May 2026';

export const founderSocials: ReadonlyArray<SocialLink> = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/shadowline-trx',
    host: 'github',
  },
  {
    id: 'email',
    label: 'Email',
    href: `mailto:${contactEmail}`,
    host: 'email',
  },
];
