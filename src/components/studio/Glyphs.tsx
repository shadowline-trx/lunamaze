import type { Glyph as GlyphId } from './content';
import s from './studio.module.css';

/**
 * The lab's instrument: a small planet with its moon, drawn in hairline
 * silver. The five products have full rooms instead (see Rooms.tsx).
 */
export default function Glyph({ id }: { readonly id: GlyphId }) {
  if (id !== 'genesis') return null;
  return (
    <svg className={s.glyph} data-glyph={id} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <circle className={s.glyphRing} cx="60" cy="60" r="56" />
      <ellipse className={s.gOrbit} cx="60" cy="60" rx="46" ry="15" transform="rotate(-18 60 60)" />
      <circle className={s.gPlanet} cx="60" cy="60" r="24" />
      <clipPath id="genesis-clip">
        <circle cx="60" cy="60" r="24" />
      </clipPath>
      <g clipPath="url(#genesis-clip)">
        <path
          className={s.gLand}
          d="M38 52c6-6 14-2 18 2s10 2 12 8-6 10-12 8-12 2-16-4-4-10-2-14zM72 44c6 0 10 4 8 8s-8 2-10-2 0-6 2-6zM66 74c4-2 10 0 10 4s-6 6-10 4-2-6 0-8z"
        />
      </g>
      <circle className={s.gMoon} cx="104" cy="46" r="3" />
    </svg>
  );
}
