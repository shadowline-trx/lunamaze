import { internalUrl } from '@/lib/paths';
import { CONTACT_EMAIL, FAQS, FIGURES, GITHUB_URL, LAB, PRINCIPLES, WORKS, type Work } from './content';
import Glyph from './Glyphs';
import Room from './Rooms';
import Split from './Split';
import s from './studio.module.css';

/* ------------------------------------------------------------ Chapters */

/**
 * A small moon at each chapter head. The page is one night: new moon at the
 * entrance, full moon at the epilogue. `lit` is the illuminated fraction.
 */
function Moon({ lit }: { readonly lit: number }) {
  const R = 8;
  const theta = Math.acos(1 - 2 * lit);
  const rx = Math.abs(R * Math.cos(theta)).toFixed(2);
  const gibbous = theta > Math.PI / 2 ? 1 : 0;
  const d = lit >= 0.999 ? '' : `M0 ${-R}A${R} ${R} 0 0 1 0 ${R}A${rx} ${R} 0 0 ${gibbous} 0 ${-R}Z`;
  return (
    <svg className={s.chapterMoon} viewBox="-10 -10 20 20" aria-hidden="true" focusable="false">
      <circle className={s.cmDark} r={R} />
      {d ? <path className={s.cmLit} d={d} /> : <circle className={s.cmLit} r={R} />}
      <circle className={s.cmRim} r={R} />
    </svg>
  );
}

function ChapterHead({
  numeral,
  name,
  note,
  lit,
}: {
  readonly numeral: string;
  readonly name: string;
  readonly note: string;
  readonly lit: number;
}) {
  return (
    <header className={s.chapter}>
      <div className={s.chapterHead} data-reveal>
        <Moon lit={lit} />
        <span className={s.chapterNo} data-scramble>
          {numeral}
        </span>
        <span className={s.chapterName}>{name}</span>
        <i className={s.chapterRule} aria-hidden="true" />
      </div>
      <p className={s.chapterNote} data-reveal>
        {note}
      </p>
    </header>
  );
}

/* ------------------------------------------------------------ I. Studio */

const MANIFESTO =
  'We make a small number of things, slowly, and we finish them. Tools for the mind, the phone and the desk, each built as if one person will live inside it for years. No growth hacks. No dark patterns. Just the shortest honest path from what you meant to do to having done it.';

export function Manifesto() {
  const words = MANIFESTO.split(' ');
  return (
    <section id="studio" className={s.manifesto} data-chapter="I · The studio" aria-labelledby="studio-title">
      <ChapterHead numeral="I" name="The studio" lit={0.12} note="In which a studio decides to make fewer things, and to finish them." />
      <div className={s.manifestoGrid}>
        <h2 id="studio-title" className={s.manifestoTitle} data-reveal data-split>
          <Split text="A studio for the work" />{' '}
          <em>
            <Split text="that lasts" start={17} />
          </em>
          <Split text="." start={26} />
        </h2>
        <p className={s.manifestoBody} data-manifesto>
          {words.map((word, i) => (
            <span key={i} className={s.mWord} style={{ ['--i' as string]: i }}>
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
      <dl className={s.manifestoFacts}>
        <div data-reveal>
          <dt>Founded and run by</dt>
          <dd>Shadowline</dd>
        </div>
        <div data-reveal style={{ ['--d' as string]: '90ms' }}>
          <dt>Funding</dt>
          <dd>Independent. No investors.</dd>
        </div>
        <div data-reveal style={{ ['--d' as string]: '180ms' }}>
          <dt>Makes</dt>
          <dd>Apps for iPhone, Android, Windows and the web</dd>
        </div>
      </dl>
    </section>
  );
}

/* ------------------------------------------------------------- II. Works */

function RoomCard({ work, index }: { readonly work: Work; readonly index: number }) {
  return (
    <li className={s.roomItem} data-reveal data-loop style={{ ['--accent' as string]: work.accent }}>
      <a className={s.room} href={internalUrl(work.href)} data-cursor="Enter" data-work>
        <span className={s.roomText}>
          <span className={s.roomTop}>
            <span className={s.roomNo}>Room {work.numeral}</span>
            <span className={s.workStatus} data-status={work.status}>
              <i aria-hidden="true" />
              {work.status}
            </span>
          </span>
          <h3 className={s.roomName}>{work.name}</h3>
          <span className={s.roomKind}>{work.kind}</span>
          <span className={s.roomLine}>{work.line}</span>
          <span className={s.roomDetail}>{work.detail}</span>
          <span className={s.roomFoot}>
            <span className={s.roomPlatforms}>{work.platforms}</span>
            <span className={s.roomCta}>
              Enter {work.name}
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19L19 5M8 5h11v11" /></svg>
            </span>
          </span>
        </span>
        <span className={s.roomWindow} data-glass>
          <Room id={work.id} />
          <span className={s.roomSwitch} aria-hidden="true" />
        </span>
      </a>
      <span className={s.srOnly}>{index + 1} of {WORKS.length}</span>
    </li>
  );
}

export function Works() {
  return (
    <section id="works" className={s.works} data-chapter="II · The works" aria-labelledby="works-title">
      <ChapterHead numeral="II" name="The works" lit={0.28} note="In which we walk through five rooms, each with its own light." />
      <div className={s.worksIntro}>
        <h2 id="works-title" className={s.sectionTitle} data-reveal data-split>
          <Split text="Five rooms in the maze." />
        </h2>
        <p className={s.sectionLede} data-reveal>
          A recovery companion, a launcher, a developer tool, a typing test and a game. Different rooms, one rule:
          nothing ships until the craft is right.
        </p>
      </div>
      <ol className={s.roomList}>
        {WORKS.map((work, i) => (
          <RoomCard key={work.id} work={work} index={i} />
        ))}
      </ol>
      <div className={s.lab} data-reveal style={{ ['--accent' as string]: LAB.accent }}>
        <span className={s.labTag}>From the lab</span>
        <a className={s.labLink} href={internalUrl(LAB.href)} data-cursor="Play">
          <span className={s.labGlyph}>
            <Glyph id="genesis" />
          </span>
          <span>
            <strong>{LAB.name}</strong>
            <span>
              {LAB.line} {LAB.detail}
            </span>
          </span>
          <span className={s.labArrow} aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 19L19 5M8 5h11v11" /></svg>
          </span>
        </a>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Reel */

const REEL_A = ['Axiom', 'Kern', 'Tether ADB', 'TypeCrt', 'Drift', 'Genesis'];
const REEL_B = ['quiet', 'precise', 'private', 'fast', 'honest', 'finished'];

/** Kinetic type band between chapters. Decorative; it skews with scroll speed. */
export function Reel() {
  const row = (words: ReadonlyArray<string>, outline: boolean) => (
    <div className={`${s.reelRow} ${outline ? s.reelOutline : ''}`}>
      {[0, 1].map((copy) => (
        <span key={copy} className={s.reelTrack}>
          {words.map((w) => (
            <span key={w} className={s.reelWord}>
              {w}
              <i />
            </span>
          ))}
        </span>
      ))}
    </div>
  );
  return (
    <div className={s.reel} data-loop data-reel aria-hidden="true">
      {row(REEL_A, false)}
      {row(REEL_B, true)}
    </div>
  );
}

/* ------------------------------------------------------------ III. Method */

const METHOD_MARKS = ['lock', 'bolt', 'scale', 'ring'] as const;

function MethodMark({ kind }: { readonly kind: (typeof METHOD_MARKS)[number] }) {
  return (
    <svg className={s.methodMark} data-mark={kind} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      {kind === 'lock' && (
        <g>
          <rect x="16" y="28" width="32" height="24" rx="3" />
          <path className={s.mShackle} d="M22 28v-7a10 10 0 0 1 20 0v7" />
          <circle cx="32" cy="40" r="2.5" />
        </g>
      )}
      {kind === 'bolt' && (
        <g>
          <path className={s.mBolt} d="M36 8L18 36h13l-4 20 19-30H33z" pathLength={1} />
        </g>
      )}
      {kind === 'scale' && (
        <g className={s.mBeam}>
          <path d="M32 12v40M20 52h24M12 22h40" />
          <path d="M12 22l-6 14h12zM52 22l-6 14h12z" />
        </g>
      )}
      {kind === 'ring' && (
        <g>
          <circle cx="32" cy="32" r="20" />
          <circle className={s.mOrbit} cx="32" cy="32" r="26" pathLength={1} />
          <circle className={s.mSat} cx="32" cy="6" r="2.5" />
        </g>
      )}
    </svg>
  );
}

export function Method() {
  return (
    <section id="method" className={s.method} data-chapter="III · The method" aria-labelledby="method-title">
      <ChapterHead numeral="III" name="The method" lit={0.45} note="In which four doors are opened, and the rules behind them written down." />
      <h2 id="method-title" className={s.sectionTitle} data-reveal data-split>
        <Split text="How the studio builds." />
      </h2>
      <ol className={s.methodList}>
        {PRINCIPLES.map((p, i) => (
          <li key={p.title} className={s.methodItem} data-reveal style={{ ['--d' as string]: `${i * 140}ms` }}>
            <span className={s.methodIndex}>Door 0{i + 1}</span>
            <MethodMark kind={METHOD_MARKS[i]} />
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------ IV. Ledger */

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

/** A number set on odometer wheels; they roll to their value on arrival. */
function Odometer({ value }: { readonly value: number }) {
  return (
    <strong className={s.odometer}>
      <span className={s.srOnly}>{value}</span>
      <span className={s.odoWheels} aria-hidden="true">
        {String(value)
          .split('')
          .map((ch, i, all) => {
            const n = Number(ch);
            // A zero rolls a full turn and lands on the second 0.
            const target = n === 0 ? 10 : n;
            return (
              <span
                key={i}
                className={s.odoWheel}
                style={{ ['--n' as string]: target, ['--w' as string]: all.length - 1 - i }}
              >
                <span className={s.odoStrip}>
                  {DIGITS.map((d, k) => (
                    <span key={k}>{d}</span>
                  ))}
                </span>
              </span>
            );
          })}
      </span>
    </strong>
  );
}

export function Ledger() {
  return (
    <section id="ledger" className={s.ledger} data-chapter="IV · The ledger" aria-labelledby="ledger-title">
      <ChapterHead numeral="IV" name="The ledger" lit={0.6} note="In which everything is counted, honestly, including the zeros." />
      <h2 id="ledger-title" className={s.srOnly}>
        Luna Maze in numbers
      </h2>
      <ul className={s.figures}>
        {FIGURES.map((f, i) => (
          <li key={f.label} className={s.figure} data-reveal style={{ ['--d' as string]: `${i * 110}ms` }}>
            <Odometer value={f.value} />
            <span className={s.figureLabel}>{f.label}</span>
            <span className={s.figureNote}>{f.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------- V. Maker */

const SEAL_RINGS = 9;

export function Maker() {
  return (
    <section id="maker" className={s.maker} data-chapter="V · The maker" aria-labelledby="maker-title">
      <ChapterHead numeral="V" name="The maker" lit={0.76} note="In which the builder signs the work, with a name and nothing more." />
      <div className={s.makerGrid}>
        <div className={s.makerSeal} data-reveal data-loop aria-hidden="true">
          <svg viewBox="-600 -600 1200 1200">
            <g className={s.sealWalls} strokeWidth="14">
              {Array.from({ length: SEAL_RINGS }, (_, i) => (
                <use key={i} href={`#lm-ring-${i}`} className={s.sealRing} style={{ ['--r' as string]: i }} />
              ))}
            </g>
          </svg>
          <span className={s.sealLetter}>S</span>
        </div>
        <div>
          <h2 id="maker-title" className={s.sectionTitle} data-reveal data-split>
            <Split text="Made by" />{' '}
            <em>
              <Split text="Shadowline" start={6} />
            </em>
            <Split text="." start={16} />
          </h2>
          <p className={s.sectionLede} data-reveal>
            Luna Maze is one person working under the name Shadowline: designer, engineer and writer of every product
            here. No team, no investors, no shortcuts. The work is built quietly and improved in the open.
          </p>
          <a className={s.textLink} href={GITHUB_URL} target="_blank" rel="noopener noreferrer me" data-reveal>
            Shadowline on GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- VI. Questions */

export function Questions() {
  return (
    <section id="faq" className={s.questions} data-chapter="VI · Questions" aria-labelledby="faq-title">
      <ChapterHead numeral="VI" name="Questions" lit={0.9} note="In which the obvious questions get plain answers." />
      <div className={s.questionsGrid}>
        <div className={s.questionsIntro}>
          <h2 id="faq-title" className={s.sectionTitle} data-reveal data-split>
            <Split text="Questions, answered plainly." />
          </h2>
          <p className={s.sectionLede} data-reveal>
            About the studio and its products. Anything else, write to{' '}
            <a className={s.inlineLink} href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
        <div className={s.faqList}>
          {FAQS.map((f, i) => (
            <details key={f.q} className={s.faq} name="studio-faq" open={i === 0} data-reveal>
              <summary>
                <h3>{f.q}</h3>
                <span className={s.faqIcon} aria-hidden="true" />
              </summary>
              <div className={s.faqBody}>
                <p>{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Epilogue */

// A fixed sky for the epilogue: positions and timings from a small LCG, so
// every build draws the same stars.
const STARS = (() => {
  let seed = 11;
  const rand = (): number => {
    seed = (seed * 48271) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: 34 }, () => ({
    x: (rand() * 100).toFixed(1),
    y: (rand() * 100).toFixed(1),
    size: (1 + rand() * 1.8).toFixed(1),
    delay: (rand() * -6).toFixed(2),
    dur: (3 + rand() * 4).toFixed(2),
  }));
})();

export function Finale() {
  return (
    <section id="contact" className={s.finale} data-chapter="Epilogue" data-finale aria-labelledby="contact-title">
      <div className={s.sky} data-loop aria-hidden="true">
        {STARS.map((star, i) => (
          <i
            key={i}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.dur}s`,
            }}
          />
        ))}
      </div>
      <div className={s.finaleMaze} data-finale-maze data-loop aria-hidden="true">
        <svg viewBox="-600 -600 1200 1200">
          <use href="#lm-walls" className={s.finaleWalls} strokeWidth="12" />
          <use href="#lm-thread" className={s.finaleThread} />
          <circle className={s.finaleMoon} r="120" fill="url(#lm-bloom)" />
        </svg>
      </div>
      <p className={s.finaleKicker} data-reveal>
        <Moon lit={1} />
        Epilogue · Full moon
      </p>
      <h2 id="contact-title" className={s.finaleTitle} data-reveal data-split>
        <Split text="Find your" />{' '}
        <em>
          <Split text="way in" start={8} />
        </em>
        <Split text="." start={13} />
      </h2>
      <p className={s.finaleLede} data-reveal>
        In which you write, and someone answers. Partnerships, press, or a question about a product: expect a reply
        within two business days.
      </p>
      <a className={s.finaleMail} href={`mailto:${CONTACT_EMAIL}`} data-magnetic data-cursor="Write" data-reveal>
        <span>{CONTACT_EMAIL}</span>
        <i className={s.glass} aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 19L19 5M8 5h11v11" /></svg>
        </i>
      </a>
    </section>
  );
}
