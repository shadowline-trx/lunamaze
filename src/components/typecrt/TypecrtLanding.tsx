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
    key: 'palette',
    title: 'Command palette',
    body: 'Modes, themes and tests are a keystroke away. The whole app can be driven without touching the mouse.',
  },
  {
    key: 'profile',
    title: 'Three-tier profile',
    body: 'Track WPM, accuracy and consistency over time in a layered view of your progress.',
  },
  {
    key: 'formulas',
    title: 'Published formulas',
    body: 'Net WPM, raw WPM, accuracy and consistency are written out in full, so any score can be recomputed by hand.',
  },
];

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
    <div className={`${phosphor.variable} ${plex.variable} ${s.root}`} data-tc data-theme="amber">
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
              <a className={s.secondary} href="#themes">
                See the themes
              </a>
            </div>
          </div>
          <Monitor />
        </section>

        <section id="themes" className={s.themes} aria-labelledby="themes-title">
          <div className={s.sectionHead}>
            <p className={s.label}>01 / Themes</p>
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
            <p className={s.label}>02 / KeyForge</p>
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
          <p className={s.label}>03 / Evidence</p>
          <h2 id="ev-title" className={s.srOnly}>
            What is the average typing speed?
          </h2>
          <p className={s.bigStat}>
            51.56 <span>WPM</span>
          </p>
          <p className={s.statNote}>
            The average typing speed across 168,960 people, from the largest published typing study. TypeCrt’s evidence
            page lists the exact figures, and the claims no research supports.
          </p>
          <a className={s.textLink} href={`${TYPECRT_URL}/docs/research`} target="_blank" rel="noopener">
            Read the evidence base <span aria-hidden="true">↗</span>
          </a>
        </section>

        <section id="docs" className={s.docs} aria-labelledby="docs-title">
          <div className={s.sectionHead}>
            <p className={s.label}>04 / Documentation</p>
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
          <p className={s.label}>05 / Questions</p>
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
      <TypecrtEnhancer passages={DEMO_PASSAGES} />
    </div>
  );
}
