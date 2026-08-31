import type { JSX } from 'react';
import { contactEmail, founderSocials } from '@/content/lunamaze';

/**
 * Luna Maze "Contact" section.
 *
 * Renders a centered hero block with a primary `mailto:` CTA built from
 * `contactEmail` and a row of pill-shaped social platform links sourced from
 * `founderSocials` (filtered to non-email hosts — the email already lives in
 * the primary CTA).
 *
 * External social links carry `target="_blank"` and
 * `rel="noopener noreferrer"` to satisfy the external link safety property.
 *
 * Validates: Requirements 1.2, 7.1, 7.2, 7.3, 12.1, 12.2, 12.3, 12.4.
 */
export default function ContactSection(): JSX.Element {
  // Filter out the email entry — the email is already the primary CTA above
  // the social row, so listing it again would duplicate the affordance. The
  // remaining entries are external https links that must open in a new tab
  // with safe rel semantics, enforced on the per-anchor attributes below.
  const socials = founderSocials.filter((s) => s.host !== 'email');

  return (
    <section id="contact" className="relative py-24 sm:py-32 px-6 sm:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto text-center">
        <span className="block text-xs uppercase tracking-[0.3em] text-lunamaze-signal mb-4">Contact</span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-lunamaze-textPrimary mb-6">
          Let&apos;s talk.
        </h2>
        <p className="text-lg text-lunamaze-textSecondary max-w-2xl mx-auto mb-10">
          Partnerships, press, or product collaborations — write to the studio and we&apos;ll get back within two business days.
        </p>
        <a
          href={`mailto:${contactEmail}`}
          className="inline-flex items-center gap-3 rounded-full bg-lunamaze-violet px-8 py-4 text-base font-semibold text-lunamaze-bgDeep transition-all duration-300 hover:bg-lunamaze-violetLight hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight lunamaze-glow-violet"
        >
          <span>{contactEmail}</span>
          <span aria-hidden="true">→</span>
        </a>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          {socials.map((s) => (
            <a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-lunamaze-border bg-lunamaze-bgSurface/60 px-5 py-2 text-sm text-lunamaze-textPrimary hover:border-lunamaze-violet/60 hover:text-lunamaze-violetLight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunamaze-violetLight"
            >
              <span>{s.label}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
