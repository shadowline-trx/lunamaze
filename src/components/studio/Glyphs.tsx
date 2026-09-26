import type { Glyph as GlyphId } from './content';
import s from './studio.module.css';

/**
 * One small animated instrument per product. Drawn in hairline silver; the
 * product's own accent and the motion switch on when its row is hovered,
 * focused, or scrolled into view on touch screens (see `.work` in the CSS).
 */
export default function Glyph({ id }: { readonly id: GlyphId }) {
  return (
    <svg className={s.glyph} data-glyph={id} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <circle className={s.glyphRing} cx="60" cy="60" r="56" />
      {id === 'axiom' && <Axiom />}
      {id === 'kern' && <Kern />}
      {id === 'tether' && <Tether />}
      {id === 'typecrt' && <TypeCrt />}
      {id === 'drift' && <Drift />}
      {id === 'genesis' && <Genesis />}
    </svg>
  );
}

const NODES: ReadonlyArray<readonly [number, number]> = [
  [36, 38], [62, 30], [84, 46], [44, 62], [70, 64], [52, 86], [82, 82],
];
const TANGLE = 'M36 38L70 64L44 62L84 46L52 86L62 30L82 82';
const ORDER = 'M36 38L62 30L84 46L70 64L82 82L52 86L44 62Z';

function Axiom() {
  return (
    <g>
      <path className={s.gTangle} d={TANGLE} />
      <path className={s.gOrder} d={ORDER} pathLength={1} />
      {NODES.map(([x, y], i) => (
        <circle key={i} className={s.gNode} cx={x} cy={y} r="2.6" style={{ animationDelay: `${i * 90}ms` }} />
      ))}
    </g>
  );
}

function Kern() {
  return (
    <g>
      <circle className={s.gOrbit} cx="60" cy="60" r="40" />
      <circle className={s.gOrbitDash} cx="60" cy="60" r="31" />
      <text className={s.gLetter} x="60" y="72" textAnchor="middle">K</text>
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} className={s.gMark} x={31 + i * 5} y="96" width="2.4" height="7" style={{ animationDelay: `${i * 70}ms` }} />
      ))}
    </g>
  );
}

function Tether() {
  const cable = 'M36 66C36 88 58 92 70 80S88 58 86 50';
  return (
    <g>
      <rect className={s.gStroke} x="22" y="36" width="30" height="24" rx="2" />
      <path className={s.gStroke} d="M18 64H56" />
      <rect className={s.gStroke} x="78" y="26" width="18" height="30" rx="3.5" />
      <path className={s.gCable} d={cable} />
      <path className={s.gPulse} d={cable} pathLength={1} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} className={s.gQr} x={29 + (i % 2) * 9} y={41 + Math.floor(i / 2) * 8} width="6" height="6" style={{ animationDelay: `${i * 160}ms` }} />
      ))}
    </g>
  );
}

function TypeCrt() {
  return (
    <g>
      <rect className={s.gStroke} x="24" y="30" width="72" height="54" rx="9" />
      <path className={s.gStroke} d="M50 92H70M60 84V92" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} className={s.gScan} d={`M30 ${36 + i * 5.5}H90`} />
      ))}
      <text className={s.gType} x="34" y="61">typecrt</text>
      <rect className={s.gCaret} x="79" y="52" width="2.4" height="11" />
    </g>
  );
}

function Drift() {
  const tiles: ReadonlyArray<readonly [number, number]> = [
    [32, 32], [52, 32], [72, 32], [32, 52], [72, 52], [32, 72], [52, 72], [72, 72],
  ];
  return (
    <g>
      {tiles.map(([x, y], i) => (
        <rect key={i} className={i === 6 ? s.gTileMove : s.gTile} x={x} y={y} width="16" height="16" rx="2" />
      ))}
      <circle className={s.gDot} cx="60" cy="60" r="2.2" />
    </g>
  );
}

function Genesis() {
  return (
    <g>
      <ellipse className={s.gOrbit} cx="60" cy="60" rx="46" ry="15" transform="rotate(-18 60 60)" />
      <circle className={s.gPlanet} cx="60" cy="60" r="24" />
      <clipPath id="genesis-clip">
        <circle cx="60" cy="60" r="24" />
      </clipPath>
      <g clipPath="url(#genesis-clip)">
        <path className={s.gLand} d="M38 52c6-6 14-2 18 2s10 2 12 8-6 10-12 8-12 2-16-4-4-10-2-14zM72 44c6 0 10 4 8 8s-8 2-10-2 0-6 2-6zM66 74c4-2 10 0 10 4s-6 6-10 4-2-6 0-8z" />
      </g>
      <circle className={s.gMoon} cx="104" cy="46" r="3" />
    </g>
  );
}
