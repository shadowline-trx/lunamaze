#!/usr/bin/env node
/**
 * Post-build: start Next's client scripts after the first frame, not before it.
 *
 * Every page in this static export is complete as HTML: text, links, FAQs
 * (<details>), navigation. Next still emits its runtime as async <script> tags
 * in <head>, so on a slow phone those ~150 KB download alongside the page's CSS
 * and fonts, and execute mid-parse, delaying the first contentful paint and
 * the largest one. This rewrites each exported page so the same scripts are
 * appended, unchanged and still async, once the page has loaded and painted.
 * Hydration then happens a moment later; nothing a visitor can see changes.
 *
 * It also adds font preloads per section. Next can only preload next/font faces
 * for every product page at once (it folds the sections' font stylesheets
 * into the one they share), so section fonts are declared with
 * `preload: false` and preloaded here, only on the pages that paint with them.
 * The files are found in each page's own built CSS, so a font update that
 * changes a hashed filename cannot leave a stale preload behind.
 *
 * Runs automatically after `npm run build` (npm's postbuild hook). Idempotent:
 * a page that already carries the loader is left alone.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, posix, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const MARK = 'data-deferred-hydration';

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Genesis is a separate app copied in after this step.
      if (entry.name === 'genesis' || entry.name === '_next') continue;
      yield* htmlFiles(path);
    } else if (entry.name.endsWith('.html')) {
      yield path;
    }
  }
}

/**
 * Faces each section's first screen is set in: [family, style, weight?]. The
 * weight tells same-named families apart: Kern's static Fraunces (700) is not
 * Axiom's variable one (100 900), though both sit in the shared stylesheet.
 */
const FONT_PRELOADS = [
  { prefix: 'axiom/', faces: [['Instrument Sans', 'normal']] },
  // The landing headline's accent word is set in Fraunces italic.
  { prefix: 'axiom/index.html', faces: [['Fraunces', 'italic', '100 900']] },
  { prefix: 'kern/', faces: [['Jost', 'normal'], ['Fraunces', 'normal', '700']] },
];

const cssCache = new Map();
async function readCss(href) {
  if (!cssCache.has(href)) cssCache.set(href, await readFile(join(DIST, href), 'utf8').catch(() => ''));
  return cssCache.get(href);
}

/** Latin-subset woff2 URLs for the given faces, from the page's stylesheets. */
async function fontUrls(html, faces) {
  const urls = new Set();
  for (const [, href] of html.matchAll(/<link rel="stylesheet" href="([^"]+\.css)"/g)) {
    const css = await readCss(href);
    for (const [block] of css.matchAll(/@font-face\{[^}]*\}/g)) {
      const family = /font-family:\s*"?([^";]+?)"?\s*;/.exec(block)?.[1];
      const style = /font-style:\s*(\w+)/.exec(block)?.[1] ?? 'normal';
      const weight = /font-weight:\s*([^;}]+)/.exec(block)?.[1]?.trim() ?? '';
      const range = /unicode-range:([^;}]+)/.exec(block)?.[1] ?? '';
      const src = /url\(([^)]+\.woff2)\)/.exec(block)?.[1];
      if (!src || !/U\+\?\?|U\+0000-00FF/i.test(range)) continue;
      if (!faces.some(([f, st, w]) => f === family && st === style && (!w || w === weight))) continue;
      urls.add(posix.join(posix.dirname(href), src.replace(/^["']|["']$/g, '')));
    }
  }
  return [...urls];
}

const SCRIPT = /<script src="(\/_next\/static\/[^"]+\.js)"((?: id="[^"]*")?) async=""><\/script>/g;
const PRELOAD = /<link rel="preload" as="script" fetchPriority="low" href="\/_next\/static\/[^"]+\.js"\/>/g;

function loader(scripts) {
  const list = JSON.stringify(scripts);
  return (
    `<script ${MARK}="">(function(){var s=${list};` +
    'function go(){for(var i=0;i<s.length;i++){var e=document.createElement("script");e.src=s[i][0];e.async=true;if(s[i][1])e.id=s[i][1];document.body.appendChild(e)}}' +
    'function after(){requestAnimationFrame(function(){setTimeout(go,0)})}' +
    'if(document.readyState==="complete")after();else addEventListener("load",after,{once:true})})()</script>'
  );
}

let changed = 0;
let preloaded = 0;
for await (const file of htmlFiles(DIST)) {
  const html = await readFile(file, 'utf8');
  if (html.includes(MARK)) continue;
  const page = relative(DIST, file).split('\\').join('/');
  const faces = FONT_PRELOADS.filter((f) => page.startsWith(f.prefix)).flatMap((f) => f.faces);
  const fonts = faces.length > 0 ? await fontUrls(html, faces) : [];
  const scripts = [];
  let out = html.replace(SCRIPT, (_, src, idAttr) => {
    const id = /id="([^"]*)"/.exec(idAttr)?.[1] ?? '';
    scripts.push(id ? [src, id] : [src]);
    return '';
  });
  if (scripts.length === 0) continue;
  out = out.replace(PRELOAD, '');
  if (!out.includes('</body>')) continue;
  if (fonts.length > 0) {
    const links = fonts.map((u) => `<link rel="preload" href="${u}" as="font" type="font/woff2" crossorigin=""/>`).join('');
    out = out.replace('<link rel="stylesheet"', `${links}<link rel="stylesheet"`);
    preloaded += 1;
  }
  out = out.replace('</body>', `${loader(scripts)}</body>`);
  await writeFile(file, out);
  changed += 1;
}
console.log(`defer-hydration: rewrote ${changed} page(s), added section font preloads to ${preloaded}`);
