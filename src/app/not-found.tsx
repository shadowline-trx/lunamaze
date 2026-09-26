import type { Metadata } from 'next';
import s from './not-found.module.css';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: '/', label: 'Luna Maze' },
  { href: '/axiom/', label: 'Axiom' },
  { href: '/kern/', label: 'Kern' },
  { href: '/tether-adb/', label: 'Tether ADB' },
  { href: '/typecrt/', label: 'TypeCrt' },
  { href: '/drift/', label: 'Drift' },
];

/**
 * Served by GitHub Pages as /404.html, with a real 404 status. System fonts
 * only: this boundary belongs to the root layout, so any next/font imported
 * here would be preloaded on every page of the site.
 */
export default function NotFound() {
  return (
    <main className={s.root}>
      <div className={s.inner}>
        <svg className={s.mark} viewBox="0 0 40 40" aria-hidden="true">
          <path d="M22 3.2A17 17 0 1 0 36.6 27 15 15 0 0 1 22 3.2Z" fill="#7b5cf0" />
          <circle cx="21" cy="20" r="11" fill="none" stroke="#c9c6d6" strokeWidth="1.6" strokeDasharray="12 3 20 3 26 5" strokeLinecap="round" />
          <circle cx="21" cy="20" r="6.5" fill="none" stroke="#c9c6d6" strokeWidth="1.6" strokeDasharray="8 3 14 4 9 3" strokeLinecap="round" />
        </svg>
        <p className={s.kicker}>Error 404 · Dead end</p>
        <h1 className={s.title}>This corridor goes nowhere.</h1>
        <p className={s.lede}>
          The page you were looking for is not in the maze. One of these will take you somewhere real.
        </p>
        <ul className={s.links}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
