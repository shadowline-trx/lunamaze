/**
 * Internal-route URL helper that respects the build-time base path.
 *
 * Next.js auto-prefixes the configured `basePath` for `<Link>` and `<Image>`,
 * but raw `<a href="/...">` tags rendered into the static export do NOT get
 * the prefix. When the site is deployed under a sub-path (e.g.
 * `https://<user>.github.io/<repo>/`), a hand-written `<a href="/axiom/">`
 * would resolve against the host root and 404.
 *
 * This helper joins `NEXT_PUBLIC_BASE_PATH` with the supplied app-relative
 * path so every internal link works whether the site is served at `/` or at
 * `/<repo>/`. The env var is read at build time and inlined into the static
 * HTML — there is no runtime lookup.
 *
 * Usage:
 *   <a href={internalUrl('/axiom/')}>Axiom</a>
 *   // basePath empty  → "/axiom/"
 *   // basePath "/lunamaze" → "/lunamaze/axiom/"
 */
const RAW_BASE_PATH: string = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * Normalize an env-supplied base path: strip any trailing slash and prepend
 * a leading slash if it was supplied without one. Empty string stays empty.
 */
function normalizeBasePath(raw: string): string {
  if (raw === '') return '';
  const withLeading = raw.startsWith('/') ? raw : `/${raw}`;
  return withLeading.endsWith('/') ? withLeading.slice(0, -1) : withLeading;
}

export const BASE_PATH: string = normalizeBasePath(RAW_BASE_PATH);

export function internalUrl(path: string): string {
  if (path === '' || path === '/') {
    return BASE_PATH === '' ? '/' : `${BASE_PATH}/`;
  }
  const withLeading = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${withLeading}`;
}
