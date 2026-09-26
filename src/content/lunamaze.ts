/**
 * Luna Maze shared studio contact data, used by the product pages' footer and
 * the Axiom legal pages. The studio home keeps its own copy and product list
 * in `src/components/studio/content.ts`.
 */

export interface SocialLink {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly host: 'github' | 'linkedin' | 'twitter' | 'email';
}

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
    href: 'mailto:lunamaze.dev@gmail.com',
    host: 'email',
  },
];

export const contactEmail: string = 'lunamaze.dev@gmail.com';
