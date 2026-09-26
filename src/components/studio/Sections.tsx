import { internalUrl } from '@/lib/paths';
import { CONTACT_EMAIL, FAQS, FIGURES, GITHUB_URL, LAB, PRINCIPLES, WORKS, type Work } from './content';
import Glyph from './Glyphs';
import s from './studio.module.css';

function ChapterHead({ numeral, name }: { readonly numeral: string; readonly name: string }) {
  return (
    <div className={s.chapterHead} data-reveal>
      <span className={s.chapterNo} data-scramble>
        {numeral}
      </span>
      <span className={s.chapterName}>{name}</span>
      <i className={s.chapterRule} aria-hidden="true" />
    </div>
  );
}

const MANIFESTO =
  'We make a small number of things, slowly, and we finish them. Tools for the mind, the phone and the desk, each built as if one person will live inside it for years. No growth hacks. No dark patterns. Just the shortest honest path from what you meant to do to having done it.';

export function Manifesto() {
  const words = MANIFESTO.split(' ');
  return (
    <section id="studio" className={s.manifesto} data-chapter="I · The studio" aria-labelledby="studio-title">
      <ChapterHead numeral="I" name="The studio" />
      <h2 id="studio-title" className={s.manifestoTitle} data-reveal>
        A studio for the work that lasts.
      </h2>
      <p className={s.manifestoBody}>
        {words.map((word, i) => (
          <span key={i} className={s.mWord} style={{ ['--i' as string]: i }}>
            {word}{' '}
          </span>
        ))}
      </p>
      <dl className={s.manifestoFacts}>
        <div data-reveal>
          <dt>Founded and run by</dt>
          <dd>Shadowline</dd>
        </div>
        <div data-reveal>
          <dt>Funding</dt>
          <dd>Independent. No investors.</dd>
        </div>
        <div data-reveal>
          <dt>Makes</dt>
          <dd>Apps for iPhone, Android, Windows and the web</dd>
        </div>
      </dl>
    </section>
  );
}

function WorkRow({ work, index }: { readonly work: Work; readonly index: number }) {
  return (
    <li className={s.workItem} data-reveal style={{ ['--accent' as string]: work.accent, ['--d' as string]: `${index * 60}ms` }}>
      <a className={s.work} href={internalUrl(work.href)} data-cursor="Enter" data-work>
        <span className={s.workNo}>{work.numeral}</span>
        <span className={s.workMain}>
          <span className={s.workMeta}>
            <span>{work.kind}</span>
            <span className={s.workStatus} data-status={work.status}>
              <i aria-hidden="true" />
              {work.status}
            </span>
          </span>
          <h3 className={s.workName}>{work.name}</h3>
          <span className={s.workLine}>{work.line}</span>
          <span className={s.workDetail}>{work.detail}</span>
          <span className={s.workPlatforms}>{work.platforms}</span>
        </span>
        <span className={`${s.workGlyph} ${s.glass}`} data-glass>
          <Glyph id={work.id} />
        </span>
        <span className={s.workArrow} aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 19L19 5M8 5h11v11" /></svg>
        </span>
      </a>
    </li>
  );
}

export function Works() {
  return (
    <section id="works" className={s.works} data-chapter="II · The works" aria-labelledby="works-title">
      <ChapterHead numeral="II" name="The works" />
      <div className={s.worksIntro}>
        <h2 id="works-title" className={s.sectionTitle} data-reveal>
          Five rooms in the maze.
        </h2>
        <p className={s.sectionLede} data-reveal>
          Each product is its own room with its own light: a recovery companion, a launcher, a developer tool, a
          typing test and a game. They share one rule. Nothing ships until the craft is right.
        </p>
      </div>
      <ol className={s.workList}>
        {WORKS.map((work, i) => (
          <WorkRow key={work.id} work={work} index={i} />
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
          <span className={s.workArrow} aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 19L19 5M8 5h11v11" /></svg>
          </span>
        </a>
      </div>
    </section>
  );
}

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
      <ChapterHead numeral="III" name="The method" />
      <h2 id="method-title" className={s.sectionTitle} data-reveal>
        How the studio builds.
      </h2>
      <ol className={s.methodList}>
        {PRINCIPLES.map((p, i) => (
          <li key={p.title} className={s.methodItem} data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
            <MethodMark kind={METHOD_MARKS[i]} />
            <span className={s.methodIndex}>0{i + 1}</span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Ledger() {
  return (
    <section id="ledger" className={s.ledger} data-chapter="IV · The ledger" aria-labelledby="ledger-title">
      <ChapterHead numeral="IV" name="The ledger" />
      <h2 id="ledger-title" className={s.srOnly}>
        Luna Maze in numbers
      </h2>
      <ul className={s.figures}>
        {FIGURES.map((f, i) => (
          <li key={f.label} className={s.figure} data-reveal style={{ ['--d' as string]: `${i * 70}ms` }}>
            <strong data-count={f.value}>{f.value}</strong>
            <span className={s.figureLabel}>{f.label}</span>
            <span className={s.figureNote}>{f.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Maker() {
  return (
    <section id="maker" className={s.maker} data-chapter="V · The maker" aria-labelledby="maker-title">
      <ChapterHead numeral="V" name="The maker" />
      <div className={s.makerGrid}>
        <div className={s.makerSeal} data-reveal data-loop aria-hidden="true">
          <svg viewBox="-600 -600 1200 1200">
            <use href="#lm-walls" className={s.sealWalls} strokeWidth="14" />
          </svg>
          <span className={s.sealLetter}>S</span>
        </div>
        <div>
          <h2 id="maker-title" className={s.sectionTitle} data-reveal>
            Made by <em>Shadowline</em>.
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

export function Questions() {
  return (
    <section id="faq" className={s.questions} data-chapter="VI · Questions" aria-labelledby="faq-title">
      <ChapterHead numeral="VI" name="Questions" />
      <div className={s.questionsGrid}>
        <div className={s.questionsIntro}>
          <h2 id="faq-title" className={s.sectionTitle} data-reveal>
            Questions, answered plainly.
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
                <span className={`${s.faqIcon} ${s.glass}`} aria-hidden="true" />
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

export function Finale() {
  return (
    <section id="contact" className={s.finale} data-chapter="Epilogue" data-finale aria-labelledby="contact-title">
      <div className={s.finaleMaze} data-finale-maze data-loop aria-hidden="true">
        <svg viewBox="-600 -600 1200 1200">
          <use href="#lm-walls" className={s.finaleWalls} strokeWidth="12" />
          <use href="#lm-thread" className={s.finaleThread} />
          <circle className={s.finaleMoon} r="120" fill="url(#lm-bloom)" />
        </svg>
      </div>
      <p className={s.finaleKicker} data-reveal>
        Epilogue · Full moon
      </p>
      <h2 id="contact-title" className={s.finaleTitle} data-reveal>
        Find your <em>way in</em>.
      </h2>
      <p className={s.finaleLede} data-reveal>
        Partnerships, press, or a question about a product. Write to the studio and expect a reply within two business
        days.
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
