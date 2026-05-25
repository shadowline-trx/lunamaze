import type { JSX } from 'react';

/**
 * Luna Maze "Founder" section.
 *
 * Public-facing identity is the studio alias **Shadowline**; the developer's
 * real name appears small and in brackets directly underneath as the dev
 * credit. There is no social row here — outbound contact is the email CTA on
 * the next section, sourced from the typed content module.
 *
 * Validates: Requirements 1.2, 6.1, 6.2, 12.1, 12.2, 12.3, 12.4.
 */
export default function FounderSection(): JSX.Element {
  return (
    <section
      id="founder"
      className="relative py-24 sm:py-32 px-6 sm:px-8 lg:px-16"
    >
      <div className="max-w-5xl mx-auto">
        <span className="block text-xs uppercase tracking-[0.3em] text-lunamaze-signal mb-4">
          Founder
        </span>
        <div className="grid md:grid-cols-[auto,1fr] gap-10 lg:gap-16 items-start">
          {/* Avatar / monogram — uses the studio alias initial. */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-lunamaze-violet to-lunamaze-bgElevated border border-lunamaze-border flex items-center justify-center text-4xl font-bold text-lunamaze-textPrimary lunamaze-glow-violet">
            S
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-lunamaze-textPrimary">
              Shadowline
            </h2>
            <p className="text-xs text-lunamaze-textDim mt-2 font-mono">
              [Harikrishnan&nbsp;V] · dev name
            </p>
            <p className="text-base text-lunamaze-violetLight mt-4 font-medium">
              Founder, Luna Maze
            </p>
            <p className="text-lg text-lunamaze-textSecondary mt-6 leading-relaxed max-w-2xl">
              Solo builder shipping under the studio alias Shadowline. Luna
              Maze is the home for the work — Axiom is the first product, with
              more in the maze. No team, no investors, no shortcuts. Built
              quietly and iterated in the open.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
