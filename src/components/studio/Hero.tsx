import { buildMaze, CRESCENT, BLADE } from './maze';
import { CONTACT_EMAIL } from './content';
import Split from './Split';
import s from './studio.module.css';

const maze = buildMaze();
const RINGS = maze.ringWalls;
const LAST = RINGS.length - 1;

export const MAZE_RING = maze.ring;

const BEATS = [
  'Every product begins as a question.',
  'We follow each one all the way to the end.',
  'At the centre, the same answer: your attention, returned.',
];

const PHASES = ['New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full moon'];

/**
 * The opening chapter. The labyrinth draws itself ring by ring, from the outer
 * wall in; then, as the visitor scrolls, a thread of moonlight solves it from
 * the entrance to the keyhole. The corridor it travels floods with light, a
 * rim around the maze fills like a waxing moon, and at the centre the whole
 * labyrinth lights up, ring after ring, from the keyhole out.
 *
 * Everything here renders on the server; the studio runtime drives it and the
 * WebGL layer relights it.
 */
export default function Hero() {
  return (
    <section id="top" className={s.hero} data-hero data-chapter="Prologue" aria-labelledby="hero-title">
      <div className={s.heroStage} data-hero-stage>
        <canvas className={s.heroCanvas} data-hero-canvas aria-hidden="true" />

        <div className={s.mazeFrame} data-maze-frame aria-hidden="true">
          <div className={s.mazeBody} data-maze>
            <svg className={s.mazeSvg} viewBox="-600 -600 1200 1200" focusable="false">
              <defs>
                <linearGradient id="lm-silver" x1="-520" y1="-520" x2="520" y2="520" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#F7F6FB" />
                  <stop offset="0.34" stopColor="#BDB9CD" />
                  <stop offset="0.52" stopColor="#77728C" />
                  <stop offset="0.72" stopColor="#DCD9E6" />
                  <stop offset="1" stopColor="#8A859E" />
                </linearGradient>
                <linearGradient id="lm-violet" x1="-520" y1="-420" x2="380" y2="520" gradientUnits="userSpaceOnUse">
                  <stop offset="0" className={s.crA} />
                  <stop offset="0.45" className={s.crB} />
                  <stop offset="1" className={s.crC} />
                </linearGradient>
                <radialGradient id="lm-bloom">
                  <stop offset="0" stopColor="#FFFBF2" stopOpacity="1" />
                  <stop offset="0.35" stopColor="#F4EFE4" stopOpacity="0.55" />
                  <stop offset="1" className={s.vSoft} stopOpacity="0" />
                </radialGradient>
                <radialGradient id="lm-halo">
                  <stop offset="0.76" className={s.vSoft} stopOpacity="0" />
                  <stop offset="0.83" stopColor="#F4EFE4" stopOpacity="0.5" />
                  <stop offset="0.9" className={s.vSoft} stopOpacity="0.16" />
                  <stop offset="1" className={s.vSoft} stopOpacity="0" />
                </radialGradient>
                {RINGS.map((d, i) => (
                  <path key={i} id={`lm-ring-${i}`} d={d} pathLength={1} data-ring-path />
                ))}
                {/* The whole labyrinth, for the seal and the epilogue. */}
                <g id="lm-walls">
                  {RINGS.map((_, i) => (
                    <use key={i} href={`#lm-ring-${i}`} />
                  ))}
                </g>
                <path id="lm-thread" d={maze.thread} pathLength={1} />
              </defs>

              <g className={s.mazeArt}>
                <path className={s.crescent} d={CRESCENT} fill="url(#lm-violet)" />
                <path className={s.blade} d={BLADE} fill="url(#lm-silver)" />
                <g className={s.walls} strokeWidth={maze.ring * 0.3}>
                  {RINGS.map((_, i) => (
                    <use
                      key={i}
                      href={`#lm-ring-${i}`}
                      className={s.ring}
                      data-dir={i % 2 === 0 ? 'cw' : 'ccw'}
                      style={{ ['--r' as string]: LAST - i }}
                    />
                  ))}
                </g>
              </g>
            </svg>
            {/* Everything that moves with scroll gets its own layer, so the walls
                underneath are painted once and left alone. */}
            <svg className={s.threadSvg} viewBox="-600 -600 1200 1200" focusable="false">
              <circle className={s.halo} r="560" fill="url(#lm-halo)" />
              <circle className={s.rimTrack} r="452" />
              <circle className={s.rimFill} r="452" pathLength={1} />
              <g className={s.litRings} strokeWidth={maze.ring * 0.3}>
                {RINGS.map((_, i) => (
                  <use key={i} href={`#lm-ring-${i}`} className={s.litRing} style={{ ['--k' as string]: i }} />
                ))}
              </g>
              <use className={s.threadFlood} href="#lm-thread" strokeWidth={maze.ring * 0.64} />
              <use className={s.threadGlow} href="#lm-thread" />
              <use className={s.thread} href="#lm-thread" />
              <circle className={s.bloom} r="160" fill="url(#lm-bloom)" />
              <g className={s.threadHead} data-thread-head>
                <circle r="22" className={s.headPing} />
                <circle r="22" className={s.headHalo} />
                <circle r="7" className={s.headCore} />
              </g>
            </svg>
          </div>
        </div>

        <div className={s.letterbox} aria-hidden="true">
          <span />
          <span />
        </div>

        <div className={s.hud} aria-hidden="true">
          <span className={s.hudCorner} data-pos="tl" />
          <span className={s.hudCorner} data-pos="tr" />
          <span className={s.hudCorner} data-pos="bl" />
          <span className={s.hudCorner} data-pos="br" />
          <div className={`${s.hudLeft} ${s.glass}`}>
            <span>Path</span>
            <strong data-hud-path>000</strong>
            <span>%</span>
          </div>
          <div className={`${s.hudRight} ${s.glass}`}>
            <span>Ring</span>
            <strong data-hud-ring>09</strong>
            <span>/ 09</span>
          </div>
          <ol className={s.hudPhases} data-hud-phase="0">
            {PHASES.map((phase) => (
              <li key={phase}>{phase}</li>
            ))}
          </ol>
          <p className={s.hudVertical}>A way through · Nº 00 · Prologue</p>
        </div>

        <div className={s.heroCopy}>
          <h1 id="hero-title" className={s.heroTitle}>
            <span className={s.heroKicker}>
              <i aria-hidden="true" />
              Independent software studio
            </span>
            <span className={s.heroWord}>
              <span>
                <Split text="Luna" />
              </span>{' '}
              <em>
                <Split text="Maze" start={4} />
              </em>
            </span>
          </h1>
          <p className={s.heroTagline}>Quiet software, precisely made.</p>
          <p className={s.heroLede}>
            An independent studio making focused software for the mind, the phone and the desk. Five products so far,
            each designed, engineered and finished by one builder.
          </p>
          <div className={s.heroActions}>
            <a className={s.buttonPrimary} href="#works" data-magnetic data-cursor="Enter">
              <span className={s.buttonLabel}>Enter the maze</span>
              <span className={s.buttonIcon} aria-hidden="true">
                <svg viewBox="0 0 16 16"><path d="M8 2v12M3 9l5 5 5-5" /></svg>
              </span>
            </a>
            <a className={`${s.buttonGhost} ${s.glass}`} href={`mailto:${CONTACT_EMAIL}`} data-magnetic data-glass data-cursor="Write">
              <span className={s.buttonLabel}>Write to us</span>
            </a>
          </div>
        </div>

        <ol className={s.beats} data-beats data-beat="0">
          {BEATS.map((beat) => (
            <li key={beat}>{beat}</li>
          ))}
        </ol>

        <div className={s.scrollCue} aria-hidden="true">
          <span>Scroll to find the way</span>
          <i />
        </div>
      </div>
    </section>
  );
}
