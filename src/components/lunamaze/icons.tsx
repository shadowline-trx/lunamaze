/**
 * Inline SVG icon glyphs for Luna Maze capabilities.
 *
 * Six discrete glyph components plus a `<CapabilityIcon />` dispatcher keyed
 * by the typed `Capability['icon']` discriminator. Every glyph is a 24x24
 * lineart SVG that strokes with `currentColor` so callers tint via Tailwind
 * text utilities. The root `<svg>` is decorative — semantic meaning is
 * carried by the adjacent text label — so each glyph defaults to
 * `aria-hidden="true"` and `focusable="false"` (callers may override via the
 * spread props).
 */

import type { JSX, SVGProps } from 'react';
import type { Capability } from '@/content/lunamaze';

export type IconName = Capability['icon'];
export type IconProps = SVGProps<SVGSVGElement>;

interface CapabilityIconProps extends IconProps {
  readonly name: IconName;
}

const baseSvgProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
} as const;

export function SparkIcon(props: IconProps): JSX.Element {
  return (
    <svg {...baseSvgProps} {...props}>
      {/* Four-pointed star burst with cross rays */}
      <path d="M12 3 L12 21" />
      <path d="M3 12 L21 12" />
      <path d="M12 7 L14.5 12 L12 17 L9.5 12 Z" />
      <path d="M7 12 L12 9.5 L17 12 L12 14.5 Z" />
    </svg>
  );
}

export function CompassIcon(props: IconProps): JSX.Element {
  return (
    <svg {...baseSvgProps} {...props}>
      {/* Outer rim, north-pointing needle, hub */}
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6 L14.5 13 L12 11.5 L9.5 13 Z" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PulseIcon(props: IconProps): JSX.Element {
  return (
    <svg {...baseSvgProps} {...props}>
      {/* ECG line crossing the horizontal axis */}
      <path d="M3 12 L8 12 L10 7 L13 17 L15 10 L17 12 L21 12" />
    </svg>
  );
}

export function OrbitIcon(props: IconProps): JSX.Element {
  return (
    <svg {...baseSvgProps} {...props}>
      {/* Tilted ellipse with central body and a satellite dot */}
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="4.5"
        transform="rotate(-20 12 12)"
      />
      <circle cx="12" cy="12" r="2.25" />
      <circle cx="20" cy="9" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ShipIcon(props: IconProps): JSX.Element {
  return (
    <svg {...baseSvgProps} {...props}>
      {/* Paper-plane / launch arrow silhouette */}
      <path d="M21 3 L3 10.5 L10 13.5 L13.5 21 Z" />
      <path d="M21 3 L10 13.5" />
    </svg>
  );
}

export function GraphIcon(props: IconProps): JSX.Element {
  return (
    <svg {...baseSvgProps} {...props}>
      {/* Rising line chart in three segments */}
      <path d="M3 17 L9 11 L13 15 L21 6" />
      <path d="M21 6 L21 11" />
      <path d="M21 6 L16 6" />
    </svg>
  );
}

/**
 * Renders the inline SVG glyph that matches the supplied `name`.
 *
 * Switching on a typed discriminator gives the call sites a single component
 * surface (no per-icon imports) while keeping the bundle tree-shakeable —
 * each glyph is still a top-level export from this module.
 */
export function CapabilityIcon({
  name,
  ...rest
}: CapabilityIconProps): JSX.Element {
  switch (name) {
    case 'spark':
      return <SparkIcon {...rest} />;
    case 'compass':
      return <CompassIcon {...rest} />;
    case 'pulse':
      return <PulseIcon {...rest} />;
    case 'orbit':
      return <OrbitIcon {...rest} />;
    case 'ship':
      return <ShipIcon {...rest} />;
    case 'graph':
      return <GraphIcon {...rest} />;
  }
}
