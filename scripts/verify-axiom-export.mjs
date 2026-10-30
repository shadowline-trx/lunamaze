import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';

const root = resolve('dist');
const origin = 'https://lunamaze.com';
const newSlugs = ['urge-surfing', 'after-a-slip', 'porn-blocker-vs-recovery-app', 'if-then-plan', 'progress-beyond-streaks', 'first-week'];
const failures = [];
let links = 0;
async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(file);
    else if (file.endsWith('.html')) yield file;
  }
}
async function exists(file) { return stat(file).then((s) => s.isFile()).catch(() => false); }
const pages = [];
for await (const file of files(join(root, 'axiom'))) pages.push(file);
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const path = '/' + relative(root, file).split(sep).join('/').replace(/index\.html$/, '');
  for (const [, raw] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const url = new URL(raw.replaceAll('&amp;', '&'), origin + path);
    if (url.origin !== origin) continue;
    // Genesis is exported by its own CI job after this export.
    if (url.pathname.startsWith('/genesis/')) continue;
    const candidate = resolve(root, '.' + decodeURIComponent(url.pathname));
    if (!candidate.startsWith(root + sep) && candidate !== root) throw new Error('Link escaped export');
    const target = url.pathname.endsWith('/') ? join(candidate, 'index.html') : candidate;
    links++;
    if (!(await exists(target))) failures.push(`${path}: missing ${url.pathname}`);
    else if (url.hash && target.endsWith('.html')) {
      const body = target === file ? html : await readFile(target, 'utf8');
      const id = decodeURIComponent(url.hash.slice(1));
      if (!body.includes(`id="${id}"`)) failures.push(`${path}: missing anchor ${url.pathname}${url.hash}`);
    }
  }
  for (const [, body] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(body); } catch { failures.push(`${path}: invalid JSON-LD`); }
  }
}
for (const path of ['axiom/', 'axiom/blog/', 'axiom/updates/', 'axiom/faq/', 'axiom/terms/', ...newSlugs.map((slug) => `axiom/blog/en/${slug}/`)]) {
  const html = await readFile(join(root, path, 'index.html'), 'utf8');
  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
  assert.equal(canonicals.length, 1, `${path}: one canonical`);
  assert.equal(canonicals[0][1], origin + '/' + path, `${path}: page-specific canonical`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${path}: one H1`);
}
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
for (const slug of newSlugs) assert.ok(sitemap.includes(`/axiom/blog/en/${slug}/`), `${slug}: sitemap entry`);
assert.ok(sitemap.includes('/axiom/updates/'), 'release page in sitemap');
const landing = await readFile(join(root, 'axiom/index.html'), 'utf8');
assert.ok(landing.includes('2.7.3') && landing.includes('night-preview'), 'current product and preview in static HTML');
assert.ok(!landing.includes('Coming soon'), 'no unreleased features offered');
assert.equal(failures.length, 0, failures.join('\n'));
process.stdout.write(`Verified ${pages.length} AXIOM HTML pages, ${links} internal links and anchors, JSON-LD, current-release copy, and new-page canonicals/sitemap entries.\n`);
