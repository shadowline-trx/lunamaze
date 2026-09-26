import type { JSX } from 'react';
import type { Glyph } from './content';
import s from './studio.module.css';

/**
 * One small, animated scene per product: the "room" each product lives in.
 * Pure SVG, drawn on the server. Motion is CSS only and runs while the room is
 * on screen (the studio runtime sets `data-onscreen` on the room).
 */

const W = 400;
const H = 260;

function AxiomRoom() {
  const dots = Array.from({ length: 30 }, (_, i) => i);
  return (
    <>
      <circle className={s.axOrbit} cx="132" cy="130" r="92" pathLength={1} />
      <g className={s.axBreath}>
        <circle className={s.axRing3} cx="132" cy="130" r="70" />
        <circle className={s.axRing2} cx="132" cy="130" r="52" />
        <circle className={s.axCore} cx="132" cy="130" r="34" />
      </g>
      <text className={`${s.scLabel} ${s.axIn}`} x="132" y="134" textAnchor="middle">
        breathe in
      </text>
      <text className={`${s.scLabel} ${s.axOut}`} x="132" y="134" textAnchor="middle">
        breathe out
      </text>
      <text className={s.scMono} x="262" y="70">
        DAY
      </text>
      <text className={s.scNumeral} x="258" y="124">
        12
      </text>
      <text className={s.scSmall} x="262" y="144">
        of a 30-day program
      </text>
      <g>
        {dots.map((i) => (
          <circle
            key={i}
            className={i < 11 ? s.axDone : i === 11 ? s.axToday : s.axTodo}
            cx={266 + (i % 10) * 11.4}
            cy={172 + Math.floor(i / 10) * 11.4}
            r="3.2"
          />
        ))}
      </g>
      <g className={s.scFaint} transform="translate(264 216)">
        <rect x="0" y="5" width="10" height="8" rx="1.5" />
        <path d="M2.5 5V3.5a2.5 2.5 0 0 1 5 0V5" fill="none" />
      </g>
      <text className={s.scSmall} x="281" y="228">
        journal never leaves
      </text>
    </>
  );
}

function KernRoom() {
  const results = ['Tether ADB', 'Telegram', 'Terminal'];
  const week = [52, 38, 61, 44, 30, 47, 38];
  return (
    <>
      <rect className={s.scDevice} x="44" y="14" width="146" height="232" rx="24" />
      <text className={s.scMono} x="62" y="42">
        09:41
      </text>
      <rect className={s.knField} x="58" y="58" width="118" height="28" rx="14" />
      <text className={s.knQuery} x="72" y="76">
        te
      </text>
      <rect className={s.knCaret} x="86" y="66" width="1.6" height="13" />
      {results.map((r, i) => (
        <g key={r} className={s.knResult} style={{ ['--i' as string]: i }}>
          <rect className={i === 0 ? s.knTop : s.knRow} x="58" y={100 + i * 36} width="118" height="28" rx="8" />
          <circle className={s.knIcon} cx="74" cy={114 + i * 36} r="6" />
          <text className={s.scText} x="88" y={118 + i * 36}>
            {r}
          </text>
        </g>
      ))}
      <text className={s.scMono} x="226" y="42">
        TODAY
      </text>
      <text className={s.scNumeral} x="222" y="94">
        38
      </text>
      <text className={s.scSmall} x="290" y="94">
        min on screen
      </text>
      <line className={s.scRule} x1="226" y1="206" x2="372" y2="206" />
      {week.map((v, i) => (
        <rect
          key={i}
          className={i === week.length - 1 ? s.knBarNow : s.knBar}
          style={{ ['--i' as string]: i }}
          x={228 + i * 21}
          y={206 - v * 1.4}
          width="12"
          height={v * 1.4}
          rx="2"
        />
      ))}
      <text className={s.scSmall} x="226" y="226">
        an honest daily ledger
      </text>
    </>
  );
}

// A fixed, readable QR-like pattern: finder squares plus deterministic modules.
const QR = (() => {
  const size = 11;
  const cells: Array<[number, number]> = [];
  let seed = 7;
  const rand = (): number => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const finder = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
      if (!finder && rand() > 0.52) cells.push([x, y]);
    }
  }
  return cells;
})();

function TetherRoom() {
  return (
    <>
      <rect className={s.scDevice} x="22" y="36" width="194" height="150" rx="10" />
      <line className={s.scRule} x1="22" y1="58" x2="216" y2="58" />
      <circle className={s.scFaintFill} cx="36" cy="47" r="3" />
      <circle className={s.scFaintFill} cx="47" cy="47" r="3" />
      <circle className={s.scFaintFill} cx="58" cy="47" r="3" />
      <text className={s.scMono} x="72" y="50">
        TETHER ADB
      </text>
      <g transform="translate(46 74)">
        <rect className={s.tqBack} x="-6" y="-6" width="100" height="100" rx="6" />
        {[
          [0, 0],
          [64, 0],
          [0, 64],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect className={s.tqFinder} x={x + 2} y={y + 2} width="20" height="20" rx="3" />
            <rect className={s.tqDot} x={x + 8} y={y + 8} width="8" height="8" rx="1" />
          </g>
        ))}
        {QR.map(([x, y]) => (
          <rect key={`${x}.${y}`} className={s.tqDot} x={x * 8 + 1} y={y * 8 + 1} width="6" height="6" rx="1" />
        ))}
        <rect className={s.tqScan} x="-4" y="0" width="96" height="2" />
      </g>
      <text className={s.scSmall} x="152" y="104">
        scan to
      </text>
      <text className={s.scSmall} x="152" y="118">
        pair
      </text>
      <path className={s.tqLink} d="M216 112C252 112 262 132 296 132" pathLength={1} />
      <path className={s.tqPulse} d="M216 112C252 112 262 132 296 132" pathLength={1} />
      <rect className={s.scDevice} x="296" y="52" width="80" height="160" rx="16" />
      <rect className={s.tqScreen} x="304" y="68" width="64" height="128" rx="6" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} className={s.tqLine} style={{ ['--i' as string]: i }} x="312" y={80 + i * 20} width={i % 2 ? 36 : 48} height="8" rx="3" />
      ))}
      <circle className={s.tqLive} cx="30" cy="226" r="4" />
      <text className={s.scText} x="42" y="230">
        192.168.1.24:5555 · paired, mirroring
      </text>
    </>
  );
}

const PASSAGE = 'the quick brown fox jumps';
const KEYS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const WEAK = new Set(['e', 'r', 'n', 'b', 'o']);

function TypecrtRoom() {
  return (
    <>
      <defs>
        <pattern id="lm-scan" width="4" height="3" patternUnits="userSpaceOnUse">
          <rect width="4" height="1" fill="rgba(0, 0, 0, 0.38)" />
        </pattern>
      </defs>
      <rect className={s.tcBezel} x="18" y="16" width="244" height="190" rx="20" />
      <rect className={s.tcScreen} x="34" y="30" width="212" height="152" rx="14" />
      <rect className={s.tcLines} x="34" y="30" width="212" height="152" rx="14" />
      <text className={s.tcDim} x="50" y="60">
        {'> typecrt --words 25'}
      </text>
      <text className={s.tcType} x="50" y="96">
        {PASSAGE}
      </text>
      <rect className={s.tcCaret} x="50" y="84" width="7" height="15" />
      <text className={s.tcDim} x="50" y="160">
        92 wpm · 98% acc · 0:17
      </text>
      <rect className={s.tcRoll} x="34" y="30" width="212" height="18" />
      <path className={s.scDeviceFill} d="M120 206h40l8 26h-56z" />
      <rect className={s.scDevice} x="96" y="232" width="88" height="8" rx="4" />
      <text className={s.scMono} x="282" y="70">
        WEAK KEYS
      </text>
      {KEYS.map((row, r) =>
        row.split('').map((k, i) => (
          <g key={`${r}${k}`}>
            <rect
              className={WEAK.has(k) ? s.tcHot : s.tcKey}
              style={{ ['--i' as string]: r * 10 + i }}
              x={282 + i * 10.4 + r * 4}
              y={84 + r * 12}
              width="9"
              height="10"
              rx="2"
            />
          </g>
        )),
      )}
      <text className={s.scSmall} x="282" y="142">
        practice adapts to
      </text>
      <text className={s.scSmall} x="282" y="156">
        the keys you miss
      </text>
      <text className={s.scSmall} x="282" y="196">
        80 themes
      </text>
      <text className={s.scSmall} x="282" y="210">
        published formulas
      </text>
    </>
  );
}

function DriftRoom() {
  const tiles = Array.from({ length: 24 }, (_, i) => i);
  return (
    <>
      {tiles.map((i) => (
        <rect key={i} className={s.drTile} x={40 + (i % 8) * 42} y={34 + Math.floor(i / 8) * 42} width="36" height="36" rx="6" />
      ))}
      <rect className={s.drTarget} x="292" y="76" width="36" height="36" rx="6" />
      <line className={s.drTrack} x1="82" y1="94" x2="310" y2="94" />
      <g className={s.drPiece}>
        <rect x="40" y="76" width="36" height="36" rx="6" />
      </g>
      <text className={s.scMono} x="40" y="186">
        LEVEL 17
      </text>
      <text className={s.scSmall} x="112" y="186">
        stop on the mark
      </text>
      <rect className={s.drMeter} x="40" y="204" width="320" height="10" rx="5" />
      <rect className={s.drWindow} x="244" y="204" width="34" height="10" rx="5" />
      <rect className={s.drNeedle} x="40" y="198" width="2.4" height="22" rx="1.2" />
      <text className={s.drPerfect} x="360" y="186" textAnchor="end">
        perfect
      </text>
    </>
  );
}

const SCENES: Partial<Record<Glyph, () => JSX.Element>> = {
  axiom: AxiomRoom,
  kern: KernRoom,
  tether: TetherRoom,
  typecrt: TypecrtRoom,
  drift: DriftRoom,
};

export default function Room({ id }: { readonly id: Glyph }) {
  const Scene = SCENES[id];
  if (!Scene) return null;
  return (
    <svg className={s.scene} data-scene={id} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      <Scene />
    </svg>
  );
}
