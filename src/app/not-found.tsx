import type { Metadata } from 'next';

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
 * Served by GitHub Pages as /404.html, with a real 404 status.
 *
 * This boundary belongs to the root layout, so anything it imports is
 * preloaded on every page of the site. Hence system fonts and styles inlined
 * here, which only render when the 404 itself does.
 */
const CSS = `body { margin: 0; background: #09070f; } .nf-root { min-height: 100svh; display: grid; place-items: center; padding: 48px 20px; background: radial-gradient(60% 60% at 50% 40%, rgba(123, 92, 240, 0.16), transparent 70%), #09070f; color: #ecebf3; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; text-align: center; } .nf-inner { max-width: 640px; } .nf-mark { width: 88px; height: 88px; margin: 0 auto 28px; animation: nf-spin 40s linear infinite; } .nf-kicker { margin: 0; font-size: 0.72rem; letter-spacing: 0.26em; text-transform: uppercase; color: #b3afc4; } .nf-title { margin: 18px 0 0; font-family: 'Bodoni 72', Didot, 'Bodoni MT', Georgia, serif; font-weight: 400; font-size: clamp(3rem, 10vw, 6rem); line-height: 0.92; letter-spacing: -0.03em; } .nf-lede { margin: 22px auto 0; max-width: 44ch; color: #b3afc4; } .nf-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 22px; margin: 34px 0 0; padding: 0; list-style: none; } .nf-links a { color: #f4efe4; text-decoration: none; border-bottom: 1px solid rgba(244, 239, 228, 0.3); padding-bottom: 3px; } .nf-links a:hover { border-color: #f4efe4; } @keyframes nf-spin { to { transform: rotate(360deg); } } @media (prefers-reduced-motion: reduce) { .nf-mark { animation: none; } }`;

export default function NotFound() {
  return (
    <main className="nf-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="nf-inner">
        <svg className="nf-mark" viewBox="0 0 40 40" aria-hidden="true">
          <path d="M22 3.2A17 17 0 1 0 36.6 27 15 15 0 0 1 22 3.2Z" fill="#7b5cf0" />
          <circle cx="21" cy="20" r="11" fill="none" stroke="#c9c6d6" strokeWidth="1.6" strokeDasharray="12 3 20 3 26 5" strokeLinecap="round" />
          <circle cx="21" cy="20" r="6.5" fill="none" stroke="#c9c6d6" strokeWidth="1.6" strokeDasharray="8 3 14 4 9 3" strokeLinecap="round" />
        </svg>
        <p className="nf-kicker">Error 404 · Dead end</p>
        <h1 className="nf-title">This corridor goes nowhere.</h1>
        <p className="nf-lede">
          The page you were looking for is not in the maze. One of these will take you somewhere real.
        </p>
        <ul className="nf-links">
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
