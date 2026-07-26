import type { JSX } from 'react';
import Link from 'next/link';

/**
 * A tool in the hub, with a face of its own.
 *
 * The hub previously rendered four identical text cards, so the panic button
 * (an emergency) looked exactly like the wallpaper generator (a toy). Function
 * should be visible before the words are read, so every tool now carries its
 * own accent and its own generated aurora band. Nothing here is an image file:
 * the band is layered gradients, so it costs no bytes and no requests.
 *
 * Borders were the other half of the problem. #22264A on #06081A is effectively
 * invisible, which made every surface read as flat. These borders use the accent
 * at low alpha so the card actually has an edge.
 */

export interface ToolCardProps {
  href: string;
  title: string;
  description: string;
  /** Short facts shown as pills, e.g. ['2 min', 'anonymous']. */
  meta: readonly string[];
  /** Drives the band, the border and the glow. */
  accent: string;
  accentAlt: string;
}

export default function ToolCard({
  href,
  title,
  description,
  meta,
  accent,
  accentAlt,
}: ToolCardProps): JSX.Element {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1"
      style={{
        borderColor: hexA(accent, 0.28),
        background: `linear-gradient(160deg, ${hexA(accent, 0.09)} 0%, rgba(18,23,55,0.75) 45%)`,
        boxShadow: `0 1px 0 0 ${hexA(accent, 0.14)} inset`,
      }}
    >
      {/* Aurora band: the card's face.
          Round 1 of this was blurred blobs at low alpha, which desaturated into
          grey smudges (the amber one read as dirty beige). Saturation needs a
          hard-edged gradient underneath doing the colour work, with the blurred
          blooms only adding light on top. */}
      <div className="relative h-24 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(115deg, ${hexA(accent, 0.95)} 0%, ${hexA(accentAlt, 0.7)} 45%, ${hexA(accent, 0.18)} 100%)`,
          }}
        />
        <div
          className="absolute -top-14 left-[-5%] h-32 w-[55%] rounded-full blur-2xl transition-transform duration-500 group-hover:translate-x-5"
          style={{ background: `radial-gradient(circle, rgba(255,255,255,0.55) 0%, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-12 right-[-5%] h-28 w-[45%] rounded-full blur-2xl transition-transform duration-500 group-hover:-translate-x-5"
          style={{ background: `radial-gradient(circle, ${hexA(accentAlt, 0.9)} 0%, transparent 70%)` }}
        />
        {/* Short fade only at the very bottom, so the colour survives. */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-[#101534]" />
        {/* Bright hairline gives the band a crisp edge instead of a smudge. */}
        <div
          className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: hexA(accent, 0.55) }}
        />
      </div>

      <div className="relative p-7 pt-4 sm:p-8 sm:pt-5">
        <h2 className="text-xl font-bold leading-snug sm:text-2xl">
          <span className="transition-colors group-hover:text-white">{title}</span>
        </h2>
        <p className="mt-3 leading-relaxed text-lunamaze-textSecondary">{description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {meta.map((m) => (
            <span
              key={m}
              className="rounded-full px-3 py-1 text-xs tracking-wide text-lunamaze-textSecondary"
              style={{
                border: `1px solid ${hexA(accent, 0.22)}`,
                background: hexA(accent, 0.07),
              }}
            >
              {m}
            </span>
          ))}
          <span
            className="ml-auto text-sm font-semibold transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: accent }}
          >
            Open →
          </span>
        </div>
      </div>
    </Link>
  );
}

function hexA(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
