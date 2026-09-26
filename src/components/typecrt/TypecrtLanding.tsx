import type { CSSProperties } from 'react';
import { internalUrl } from '@/lib/paths';
import { TYPECRT_ARTICLES } from '@/content/typecrt';
import type { FaqItem } from '@/components/lunamaze/ProductFaq';
import TypecrtEnhancer from './TypecrtEnhancer';
import { phosphor, plex } from './fonts';
import s from './typecrt.module.css';

export const TYPECRT_URL = 'https://typecrt.com';

export const DEMO_PASSAGES = [
  'small keys make large sentences when the hands learn to listen',
  'every keystroke is a tiny decision made faster than thought',
  'slow is smooth and smooth becomes fast on a quiet keyboard',
];

const THEMES = [
  { id: 'amber', label: 'Amber phosphor' },
  { id: 'green', label: 'Green phosphor' },
  { id: 'ice', label: 'Cold terminal' },
  { id: 'paper', label: 'Paper' },
] as const;

const FEATURES = [
  {
    key: 'core',
    title: 'No framework in the way',
    body: 'Built in vanilla TypeScript with no framework and no virtual DOM, so a keystroke updates the character it belongs to and nothing else.',
  },
  {
    key: 'themes',
    title: '80 themes',
    body: 'From amber phosphor to cool terminal greens, switch the entire palette to match your mood. Every one of them is documented.',
  },
  {
    key: 'practice',
    title: 'Smart practice',
    body: 'KeyForge watches the keys you miss and builds targeted drills, so your weak spots get the repetitions.',
  },
  {
    key: 'results',
    title: 'Results worth reading',
    body: 'A per-word breakdown, burst-speed charts and a keystroke heatmap show where a test was won and where it slipped.',
  },
  {
    key: 'feel',
    title: 'Sound and caret',
    body: 'Mechanical keyboard sounds, and a caret drawn as a line, underline, block or outline, moving as smoothly as you like.',
  },
  {
    key: 'palette',
    title: 'Command palette',
    body: 'Modes, themes and tests are a keystroke away. The whole app can be driven without touching the mouse.',
  },
  {
    key: 'board',
    title: 'An honest leaderboard',
    body: 'English 15, 30 and 60-second tests are ranked, with what the ranking screens for, and what it cannot verify, published.',
  },
  {
    key: 'formulas',
    title: 'Published formulas',
    body: 'Net WPM, raw WPM, accuracy and consistency are written out in full, so any score can be recomputed by hand.',
  },
];

/** From typecrt.com/docs/modes. */
const MODES = [
  { id: 'time', name: 'time', detail: '15 · 30 · 60 · 120 s', body: 'The clock decides when you stop. The format published benchmarks and employer tests use; take 60 seconds for a number that means something.' },
  { id: 'words', name: 'words', detail: '10 · 25 · 50 · 100', body: 'A fixed amount of text, so two attempts face the same workload. The fairest way to compare yourself with yourself.' },
  { id: 'quote', name: 'quote', detail: 'real sentences', body: 'Punctuation, capitals and natural rhythm. Usually a little slower than words; if it is much slower, shift and punctuation are your bottleneck.' },
  { id: 'zen', name: 'zen', detail: 'no end', body: 'No timer, no count. Text keeps coming until you stop, for warming up or typing without a score to have feelings about.' },
  { id: 'custom', name: 'custom', detail: 'your text', body: 'Paste your own passage: code, medical terms, the names you keep misspelling, or the exact text an exam uses.' },
  { id: 'forge', name: 'forge', detail: 'adaptive', body: 'Not a test. Words weighted toward your weakest keys, with letters unlocking one at a time. Harder on purpose, so its scores stand apart.' },
] as const;

/**
 * Typing speed distribution for the evidence chart: a normal curve with the
 * published mean (51.56 WPM) and standard deviation (20.2) from Dhakal et al.,
 * CHI 2018, drawn over 0..130 WPM.
 */
const CURVE = (() => {
  const mean = 51.56;
  const sd = 20.2;
  const w = 600;
  const h = 180;
  const pts: string[] = [];
  for (let x = 0; x <= 130; x += 2) {
    const y = Math.exp(-0.5 * ((x - mean) / sd) ** 2);
    pts.push(`${((x / 130) * w).toFixed(1)} ${(h - y * (h - 16)).toFixed(1)}`);
  }
  return { line: `M${pts.join('L')}`, area: `M0 ${h}L${pts.join('L')}L${w} ${h}Z`, x: (v: number) => (v / 130) * w };
})();

const RESOURCES = [
  {
    title: 'The evidence base',
    body: 'Exact figures from the two largest published typing studies, and the common claims no research supports.',
    href: `${TYPECRT_URL}/docs/research`,
  },
  {
    title: 'Learn to type',
    body: 'The beginner path: start on a handful of keys and add the next one when the last one sticks.',
    href: `${TYPECRT_URL}/learn-to-type`,
  },
  {
    title: 'How KeyForge works',
    body: 'The confidence formula behind adaptive practice, the letter unlock order, and how drill words are generated.',
    href: `${TYPECRT_URL}/docs/keyforge`,
  },
  {
    title: 'Metrics and formulas',
    body: 'Net WPM, raw WPM, accuracy and consistency written out in full.',
    href: `${TYPECRT_URL}/docs/metrics`,
  },
];

const KEY_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
/** Illustrative weak-key heat, 0..1. Not anyone's real data. */
const HEAT: Record<string, number> = { q: 0.3, p: 0.55, b: 0.8, y: 0.45, x: 0.35, z: 0.65, v: 0.5, j: 0.25, k: 0.2, m: 0.3 };

function ModeArt({ id }: { readonly id: (typeof MODES)[number]['id'] }) {
  switch (id) {
    case 'time':
      return (
        <span className={s.artTime}>
          <b>60</b>
          <i />
        </span>
      );
    case 'words':
      return (
        <span className={s.artWords}>
          <b>
            <span className={s.countUp} />
            /25
          </b>
          <i />
        </span>
      );
    case 'quote':
      return <span className={s.artQuote}>“The quick, the calm—and the exact.”</span>;
    case 'zen':
      return (
        <span className={s.artZen}>
          <span>as long as you like as long as you like as long as you like as long as you like </span>
        </span>
      );
    case 'custom':
      return (
        <span className={s.artCustom}>
          <span>const pace = words / minutes;</span>
          <span>return pace.toFixed(2);</span>
        </span>
      );
    case 'forge':
      return (
        <span className={s.artForge}>
          {['b', 'z', 'p', 'v', 'y', 'q'].map((k, i) => (
            <i key={k} style={{ '--i': i } as CSSProperties}>
              {k}
            </i>
          ))}
        </span>
      );
  }
}

function Monitor() {
  const passage = DEMO_PASSAGES[0];
  return (
    <div className={s.monitor} data-monitor>
      <div className={s.bezel}>
        <div className={s.screen} data-screen>
          <div className={s.screenInner}>
            <p className={s.prompt} aria-hidden="true">
              <span>typecrt</span> ~ test --words 11
            </p>
            <p className={s.passage} data-passage>
              {passage.split(' ').map((word, w, words) => {
                const offset = words.slice(0, w).reduce((n, x) => n + x.length + 1, 0);
                return (
                  <span key={w}>
                    <span className={s.word}>
                      {word.split('').map((ch, i) => (
                        <span key={i} className={s.ch} data-caret={offset + i === 0 ? '' : undefined}>
                          {ch}
                        </span>
                      ))}
                    </span>
                    {w < words.length - 1 && <span className={s.ch}> </span>}
                  </span>
                );
              })}
            </p>
            <div className={s.stats}>
              <span aria-hidden="true">
                wpm <strong data-stat="wpm">00</strong>
              </span>
              <span aria-hidden="true">
                acc <strong data-stat="acc">100</strong>%
              </span>
              <span aria-hidden="true">
                time <strong data-stat="time">0.0</strong>s
              </span>
              <button type="button" className={s.mode} data-mode>
                demo · click to type
              </button>
            </div>
            <div className={s.result} data-result role="status" aria-live="polite" />
          </div>
          <span className={s.scan} aria-hidden="true" />
          <span className={s.glare} aria-hidden="true" />
        </div>
        <textarea className={s.sink} data-sink aria-label="Typing input for the demo" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
        <div className={s.bezelFoot} aria-hidden="true">
          <span className={s.badge}>TYPECRT</span>
          <span className={s.led} />
        </div>
      </div>
      <div className={s.stand} aria-hidden="true" />
    </div>
  );
}

export default function TypecrtLanding({ faq }: { readonly faq: ReadonlyArray<FaqItem> }) {
  return (
    <div
      className={`${phosphor.variable} ${plex.variable} ${s.root}`}
      data-tc
      data-theme="amber"
      data-passages={JSON.stringify(DEMO_PASSAGES)}
      data-cls-ok={s.ok}
      data-cls-bad={s.bad}
      data-cls-word={s.word}
      data-cls-ch={s.ch}
    >
      <header className={s.nav}>
        <a className={s.brand} href="#top" aria-label="TypeCrt, back to the top">
          <span className={s.brandCursor} aria-hidden="true" />
          TypeCrt
        </a>
        <nav className={s.navLinks} aria-label="TypeCrt sections">
          <a href="#themes">Themes</a>
          <a href="#keyforge">KeyForge</a>
          <a href="#docs">Docs</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className={s.navCta} href={TYPECRT_URL} target="_blank" rel="noopener noreferrer">
          Open typecrt.com <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        <section id="top" className={s.hero} aria-labelledby="tc-title">
          <div className={s.heroCopy}>
            <p className={s.kicker}>
              <span className={s.dot} aria-hidden="true" /> Typing test · live at typecrt.com
            </p>
            <h1 id="tc-title" className={s.title}>
              TypeCrt<span className={s.titleCaret} aria-hidden="true" />
            </h1>
            <p className={s.tagline}>A typing test with a CRT soul.</p>
            <p className={s.lede}>
              TypeCrt is a free typing test styled after vintage CRT terminals, made by the independent studio Luna
              Maze. It is built in vanilla TypeScript, with 80 themes, practice that finds your weak keys, a command
              palette and formulas published in full.
            </p>
            <div className={s.actions}>
              <a className={s.primary} href={TYPECRT_URL} target="_blank" rel="noopener noreferrer">
                Start typing <span aria-hidden="true">↗</span>
              </a>
              <a className={s.secondary} href="#modes">
                See the modes
              </a>
            </div>
            <ul className={s.pledges}>
              <li>No account</li>
              <li>No ads</li>
              <li>No paid tier</li>
            </ul>
          </div>
          <Monitor />
        </section>

        <section id="modes" className={s.modes} aria-labelledby="modes-title">
          <div className={s.sectionHead}>
            <p className={s.label}>01 / Modes</p>
            <h2 id="modes-title" className={s.h2}>
              Five ways to take a test. One way to get faster.
            </h2>
            <p className={s.body}>
              They are not interchangeable, and picking the wrong one is the most common reason a score looks wrong.
              Sprint modes measure you on representative English; Forge trains you on text skewed toward your weak keys.
            </p>
          </div>
          <ul className={s.modeGrid}>
            {MODES.map((m, i) => (
              <li key={m.id} className={s.modeCard} data-mode-card={m.id} data-reveal style={{ '--d': `${i * 70}ms` } as CSSProperties}>
                <div className={s.modeArt} aria-hidden="true">
                  <ModeArt id={m.id} />
                </div>
                <p className={s.modeName}>
                  <span>$</span> {m.name} <em>{m.detail}</em>
                </p>
                <p className={s.modeBody}>{m.body}</p>
              </li>
            ))}
          </ul>
          <a className={s.textLink} href={`${TYPECRT_URL}/docs/modes`} target="_blank" rel="noopener">
            Which mode to use, and why <span aria-hidden="true">↗</span>
          </a>
        </section>

        <section id="themes" className={s.themes} aria-labelledby="themes-title">
          <div className={s.sectionHead}>
            <p className={s.label}>02 / Themes</p>
            <h2 id="themes-title" className={s.h2}>
              Eighty moods. Four to try here.
            </h2>
            <p className={s.body}>
              TypeCrt ships 80 documented themes. Pick one of these four and the whole page, monitor included, takes
              its colour.
            </p>
          </div>
          <div className={s.swatches} role="radiogroup" aria-label="Page theme">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={t.id === 'amber'}
                className={s.swatch}
                data-set-theme={t.id}
                style={{ '--sw': `var(--sw-${t.id})` } as CSSProperties}
              >
                <span className={s.swatchScreen} data-swatch={t.id} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className={s.swatchName}>{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={s.man} aria-labelledby="man-title">
          <div className={s.manHead} aria-hidden="true">
            <span>TYPECRT(1)</span>
            <span>Luna Maze Manual</span>
            <span>TYPECRT(1)</span>
          </div>
          <h2 id="man-title" className={s.manSection}>
            NAME
          </h2>
          <p className={s.manText}>typecrt — a typing test with a CRT soul, for people who live in the keyboard.</p>
          <h2 className={s.manSection}>FEATURES</h2>
          <dl className={s.manList}>
            {FEATURES.map((f) => (
              <div key={f.key} data-reveal>
                <dt>{f.title}</dt>
                <dd>{f.body}</dd>
              </div>
            ))}
          </dl>
          <h2 className={s.manSection}>SEE ALSO</h2>
          <p className={s.manText}>
            <a href={`${TYPECRT_URL}/docs/metrics`} target="_blank" rel="noopener">
              metrics(7)
            </a>
            ,{' '}
            <a href={`${TYPECRT_URL}/docs/keyforge`} target="_blank" rel="noopener">
              keyforge(7)
            </a>
            ,{' '}
            <a href={`${TYPECRT_URL}/docs/research`} target="_blank" rel="noopener">
              research(7)
            </a>
          </p>
        </section>

        <section id="keyforge" className={s.keyforge} aria-labelledby="kf-title">
          <div className={s.sectionHead}>
            <p className={s.label}>03 / KeyForge</p>
            <h2 id="kf-title" className={s.h2}>
              Practice aimed at the keys that slow you down.
            </h2>
            <p className={s.body}>
              KeyForge watches which keys you miss and builds drills around them, so weak spots get the repetitions
              instead of the keys you already know. The confidence formula, the order letters unlock and how drill
              words are generated are all documented.
            </p>
            <a className={s.textLink} href={`${TYPECRT_URL}/docs/keyforge`} target="_blank" rel="noopener">
              How KeyForge works <span aria-hidden="true">↗</span>
            </a>
          </div>
          <figure className={s.keyboard}>
            <div className={s.keys} aria-hidden="true">
              {KEY_ROWS.map((row, r) => (
                <div key={row} className={s.keyRow} style={{ '--row': r } as CSSProperties}>
                  {row.split('').map((k, i) => (
                    <span
                      key={k}
                      className={s.key}
                      style={{ '--heat': HEAT[k] ?? 0, '--i': i + r * 10 } as CSSProperties}
                    >
                      {k}
                    </span>
                  ))}
                </div>
              ))}
              <div className={s.keyRow}>
                <span className={`${s.key} ${s.space}`} />
              </div>
            </div>
            <figcaption className={s.caption}>Illustration: warmer keys are missed more often and get drilled first.</figcaption>
          </figure>
        </section>

        <section className={s.evidence} aria-labelledby="ev-title">
          <p className={s.label}>04 / Evidence</p>
          <h2 id="ev-title" className={s.srOnly}>
            What is the average typing speed?
          </h2>
          <p className={s.bigStat}>
            51.56 <span>WPM</span>
          </p>
          <p className={s.statNote}>
            The average typing speed across 168,960 people, from the largest published typing study (Dhakal et al., CHI
            2018). Not the 40 WPM that is usually repeated.
          </p>
          <figure className={s.curve} data-reveal>
            <svg viewBox="0 0 600 212" role="img" aria-label="Typing speed distribution: the slowest 10% type under about 26 WPM, the average is 51.56 WPM, the fastest 10% type over about 78 WPM.">
              <defs>
                <clipPath id="tc-slow">
                  <rect x="0" y="0" width={CURVE.x(26)} height="180" />
                </clipPath>
                <clipPath id="tc-fast">
                  <rect x={CURVE.x(78)} y="0" width="600" height="180" />
                </clipPath>
              </defs>
              <path className={s.curveArea} d={CURVE.area} />
              <path className={s.curveTail} d={CURVE.area} clipPath="url(#tc-slow)" />
              <path className={s.curveTail} d={CURVE.area} clipPath="url(#tc-fast)" />
              <path className={s.curveLine} d={CURVE.line} pathLength={1} />
              <line className={s.curveBase} x1="0" y1="180" x2="600" y2="180" />
              <line className={s.curveMean} x1={CURVE.x(51.56)} y1="10" x2={CURVE.x(51.56)} y2="180" />
              <text className={s.curveText} x={CURVE.x(26) - 6} y="200" textAnchor="end">
                slowest 10% · under ~26
              </text>
              <text className={s.curveTextMean} x={CURVE.x(51.56)} y="200" textAnchor="middle">
                51.56
              </text>
              <text className={s.curveText} x={CURVE.x(78) + 6} y="200">
                fastest 10% · over ~78
              </text>
            </svg>
            <figcaption>Where do you land? A 60-second time test gives a number you can compare.</figcaption>
          </figure>
          <div className={s.evActions}>
            <a className={s.primary} href={TYPECRT_URL} target="_blank" rel="noopener noreferrer">
              Take the 60-second test <span aria-hidden="true">↗</span>
            </a>
            <a className={s.textLink} href={`${TYPECRT_URL}/docs/research`} target="_blank" rel="noopener">
              Read the evidence base <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section id="docs" className={s.docs} aria-labelledby="docs-title">
          <div className={s.sectionHead}>
            <p className={s.label}>05 / Documentation</p>
            <h2 id="docs-title" className={s.h2}>
              Nothing here has to be taken on trust.
            </h2>
            <p className={s.body}>
              Every formula is published, every claim about typing in general is traced to a peer-reviewed source, and
              the claims that could not be sourced are listed as unsupported rather than quietly repeated.
            </p>
          </div>
          <ul className={s.docList}>
            {RESOURCES.map((r) => (
              <li key={r.href} data-reveal>
                <a href={r.href} target="_blank" rel="noopener">
                  <span className={s.docPath}>{r.href.replace('https://', '')}</span>
                  <strong>{r.title}</strong>
                  <span>{r.body}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className={s.library}>
            <p className={s.label}>From the writing library</p>
            <ul>
              {TYPECRT_ARTICLES.map((a) => (
                <li key={a.slug}>
                  <a href={internalUrl(`/typecrt/blog/${a.slug}/`)}>
                    <strong>{a.title}</strong>
                    <span>{a.description}</span>
                  </a>
                </li>
              ))}
            </ul>
            <a className={s.textLink} href={internalUrl('/typecrt/blog/')}>
              All articles <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section id="faq" className={s.faq} aria-labelledby="faq-title">
          <p className={s.label}>06 / Questions</p>
          <h2 id="faq-title" className={s.h2}>
            TypeCrt questions
          </h2>
          <div className={s.faqList}>
            {faq.map((f, i) => (
              <details key={f.q} name="tc-faq" open={i === 0}>
                <summary>
                  <h3>{f.q}</h3>
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={s.cta} aria-labelledby="cta-title">
          <h2 id="cta-title" className={s.ctaTitle}>
            Find your real speed.
          </h2>
          <p className={s.body}>No sign-up wall, no clutter. Open it and start typing.</p>
          <a className={s.primary} href={TYPECRT_URL} target="_blank" rel="noopener noreferrer">
            Open typecrt.com <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>

      <footer className={s.footer}>
        <span>
          TypeCrt is made by{' '}
          <a href={internalUrl('/')}>Luna Maze</a>, an independent software studio.
        </span>
        <span className={s.footerLinks}>
          <a href={internalUrl('/typecrt/blog/')}>Writing</a>
          <a href={TYPECRT_URL} target="_blank" rel="noopener noreferrer">
            typecrt.com
          </a>
          <a href={internalUrl('/')}>Other products</a>
        </span>
      </footer>
      <TypecrtEnhancer />
    </div>
  );
}
