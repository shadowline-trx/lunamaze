/**
 * CapabilitiesSection — Luna Maze "What we can deliver" grid.
 *
 * Pure presentational component: receives the capability list via props so
 * tests can drive it with arbitrary inputs. Each card pairs a violet-tinted
 * icon chip with a title and description, all sourced from the typed
 * Capability records.
 */

import type { JSX } from 'react';
import type { Capability } from '@/content/lunamaze';
import { CapabilityIcon } from './icons';

interface CapabilitiesSectionProps {
  readonly items: ReadonlyArray<Capability>;
}

export default function CapabilitiesSection({
  items,
}: CapabilitiesSectionProps): JSX.Element {
  return (
    <section
      id="capabilities"
      className="lunamaze-defer relative py-20 sm:py-32 px-5 sm:px-8 lg:px-16"
    >
      <div className="max-w-6xl mx-auto">
        <span className="block text-xs uppercase tracking-[0.3em] text-lunamaze-signal mb-4">
          Capabilities
        </span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-lunamaze-textPrimary mb-16 max-w-3xl">
          What we can deliver.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-lunamaze-border bg-lunamaze-bgSurface/40 p-7 transition-colors duration-300 hover:border-lunamaze-violet/40 hover:bg-lunamaze-bgSurface/70"
            >
              <div className="w-12 h-12 rounded-xl bg-lunamaze-bgElevated/80 border border-lunamaze-border flex items-center justify-center text-lunamaze-violetLight mb-5">
                <CapabilityIcon name={item.icon} />
              </div>
              <h3 className="text-xl font-semibold text-lunamaze-textPrimary mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-lunamaze-textSecondary leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
