import { internalUrl } from '@/lib/paths';
import { CONTACT_EMAIL, GITHUB_URL, LAB, WORKS } from './content';
import s from './studio.module.css';

function Mark() {
  return (
    <svg className={s.mark} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path className={s.markMoon} d="M22 3.2A17 17 0 1 0 36.6 27 15 15 0 0 1 22 3.2Z" />
      <circle className={s.markRing} cx="21" cy="20" r="11" strokeDasharray="12 3 20 3 26 5" />
      <circle className={s.markRing} cx="21" cy="20" r="6.5" strokeDasharray="8 3 14 4 9 3" />
      <circle className={s.markCore} cx="21" cy="20" r="1.8" />
    </svg>
  );
}

/**
 * The opening loader: the emblem draws itself, a counter runs to 100, and the
 * screen parts like a curtain onto the labyrinth. Pure CSS, about a second
 * and a half, shown once per session and never with reduced motion (the boot
 * script in page.tsx sets `data-intro-seen` to skip it).
 */
export function Loader() {
  return (
    <div className={s.loader} aria-hidden="true">
      <span className={s.loaderHalf} data-half="top" />
      <span className={s.loaderHalf} data-half="bottom" />
      <span className={s.loaderCore}>
        <svg className={s.loaderMark} viewBox="0 0 40 40">
          <path className={s.loaderMoon} d="M22 3.2A17 17 0 1 0 36.6 27 15 15 0 0 1 22 3.2Z" pathLength={1} />
          <circle className={s.loaderRing} cx="21" cy="20" r="11" pathLength={1} />
          <circle className={s.loaderRing} cx="21" cy="20" r="6.5" pathLength={1} />
          <circle className={s.loaderCore2} cx="21" cy="20" r="1.8" />
        </svg>
        <span className={s.loaderWord}>Luna Maze</span>
        <span className={s.loaderCount}>
          <span className={s.loaderNum} />
          <i className={s.loaderBar} />
          <span>Finding the way</span>
        </span>
      </span>
    </div>
  );
}

const THEME_NAMES = ['Moonlight', 'Blood moon', 'Blue moon'];

export function Nav() {
  return (
    <header className={s.nav} data-nav>
      <a className={s.skip} href="#studio">
        Skip to content
      </a>
      <a className={s.brand} href="#top" aria-label="Luna Maze, back to the top">
        <Mark />
        <span className={s.brandWord}>Luna Maze</span>
      </a>
      <p className={s.navChapter} aria-hidden="true">
        <span data-nav-chapter>Prologue</span>
      </p>
      <nav className={`${s.navLinks} ${s.glass}`} aria-label="Sections" data-glass>
        <a href="#works" data-cursor="Go">
          Works
        </a>
        <a href="#faq" data-cursor="Go">
          Questions
        </a>
        <button
          type="button"
          className={s.themeToggle}
          data-theme-toggle
          data-cursor="Theme"
          aria-label={`Colour theme: ${THEME_NAMES[0]}. Change theme`}
        >
          <span className={s.themeDots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={s.themeName} data-theme-name aria-hidden="true">
            {THEME_NAMES[0]}
          </span>
        </button>
        <a className={s.navContact} href="#contact" aria-label="Contact" data-magnetic>
          <svg className={s.moon} viewBox="0 0 24 24" aria-hidden="true">
            <clipPath id="lm-moon-clip">
              <circle cx="12" cy="12" r="8" />
            </clipPath>
            <circle className={s.moonLit} cx="12" cy="12" r="8" />
            <g clipPath="url(#lm-moon-clip)">
              <circle className={s.moonShade} cx="12" cy="12" r="8.4" />
            </g>
            <circle className={s.moonRim} cx="12" cy="12" r="8" />
          </svg>
          <span>Contact</span>
        </a>
      </nav>
    </header>
  );
}

const RESOURCES = [
  { label: 'Axiom FAQ', href: '/axiom/faq/' },
  { label: 'Axiom research library', href: '/axiom/blog/' },
  { label: 'Axiom free tools', href: '/axiom/tools/' },
  { label: 'Kern FAQ', href: '/kern/faq/' },
  { label: 'TypeCrt blog', href: '/typecrt/blog/' },
];

const LEGAL = [
  { label: 'Axiom privacy', href: '/axiom/privacy/' },
  { label: 'Axiom terms', href: '/axiom/terms/' },
  { label: 'Kern privacy', href: '/kern/privacy/' },
];

export function Credits() {
  return (
    <footer className={s.credits} aria-label="Credits">
      <p className={s.creditsLead}>A Luna Maze production</p>
      <dl className={s.creditsRoll}>
        <div>
          <dt>Designed, engineered and written by</dt>
          <dd>Shadowline</dd>
        </div>
        <div>
          <dt>Products</dt>
          <dd>
            {WORKS.map((w) => (
              <a key={w.id} href={internalUrl(w.href)}>
                {w.name}
              </a>
            ))}
          </dd>
        </div>
        <div>
          <dt>From the lab</dt>
          <dd>
            <a href={internalUrl(LAB.href)}>{LAB.name}</a>
          </dd>
        </div>
        <div>
          <dt>Further reading</dt>
          <dd>
            {RESOURCES.map((r) => (
              <a key={r.href} href={internalUrl(r.href)}>
                {r.label}
              </a>
            ))}
          </dd>
        </div>
        <div>
          <dt>Fine print</dt>
          <dd>
            {LEGAL.map((r) => (
              <a key={r.href} href={internalUrl(r.href)}>
                {r.label}
              </a>
            ))}
          </dd>
        </div>
        <div>
          <dt>Correspondence</dt>
          <dd>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer me">
              GitHub
            </a>
          </dd>
        </div>
      </dl>
      <div className={s.creditsEnd}>
        <span>© {new Date().getFullYear()} Luna Maze. All rights reserved.</span>
        <a href="#top" data-cursor="Up">
          Back to the entrance <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}
