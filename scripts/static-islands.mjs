#!/usr/bin/env node
/**
 * Post-build: ship selected pages as static HTML plus one small module, with
 * no React runtime and no hydration payload.
 *
 * The studio home is complete as HTML; its only client code is a runtime that
 * adds motion on top (src/components/studio/runtime.ts). Hydrating it anyway
 * costs a phone the React runtime (~150 KB of script) and Next's flight
 * payload, which repeats the page's whole content a second time inside the
 * HTML. For those pages this script:
 *
 * 1. bundles the page's runtime with esbuild into dist/_static/ (hashed names,
 *    split chunks, so the WebGL layer still loads on demand);
 * 2. strips Next's scripts, script preloads and flight payload from the page;
 * 3. appends a tiny loader that starts the runtime once the page has loaded
 *    and painted.
 *
 * Other pages are untouched, and client-side navigations into these pages
 * still work: Next renders them from their .txt payloads and runs the same
 * runtime through its React wrapper.
 *
 * Runs before defer-hydration.mjs in `postbuild`. Idempotent. Fails the build
 * if a page would lose anything it still needs (for example, content Next
 * streamed in with a script).
 */
import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = new URL('../', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const OUT = '_static';
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const MARK = 'data-static-island';

// `entry: null` ships the page with no script at all (everything it does is CSS).
const ISLANDS = [
  { page: 'index.html', entry: 'src/components/studio/runtime-entry.ts' },
  { page: 'tether-adb/index.html', entry: null },
  { page: 'typecrt/index.html', entry: 'src/components/typecrt/runtime-entry.ts' },
];

const result = await build({
  absWorkingDir: ROOT,
  entryPoints: ISLANDS.map((island) => island.entry).filter(Boolean),
  bundle: true,
  splitting: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2020', 'safari15'],
  minify: true,
  legalComments: 'none',
  outdir: join(DIST, OUT),
  entryNames: '[name]-[hash]',
  chunkNames: 'chunk-[hash]',
  metafile: true,
  logLevel: 'warning',
});

const entryOutput = new Map();
for (const [file, meta] of Object.entries(result.metafile.outputs)) {
  if (meta.entryPoint) entryOutput.set(meta.entryPoint, relative(DIST, join(ROOT, file)).split('\\').join('/'));
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const NEXT = `${escape(BASE)}/_next/static/`;
const PATTERNS = [
  // Next's own scripts, including the nomodule polyfill.
  new RegExp(`<script src="${NEXT}[^"]+\\.js"[^>]*></script>`, 'g'),
  new RegExp(`<link rel="(?:preload|modulepreload)" as="script"[^>]*href="${NEXT}[^"]+\\.js"[^>]*/>`, 'g'),
  new RegExp(`<link rel="(?:preload|modulepreload)"[^>]*href="${NEXT}[^"]+\\.js"[^>]*as="script"[^>]*/>`, 'g'),
  // The flight payload that hydration would read.
  /<script>\(self\.__next_f=self\.__next_f\|\|\[\]\)\.push\(\[0\]\)<\/script>/g,
  /<script>self\.__next_f\.push\(\[[\s\S]*?\]\)<\/script>/g,
];

/**
 * Starts the module once the page has loaded and its first contentful paint is
 * on screen, so neither the download nor the start-up work competes with it.
 */
function loader(src) {
  return (
    `<script ${MARK}="">(function(){var d=0,L=document.readyState==="complete",P=0;` +
    `function go(){if(d||!L||!P)return;d=1;setTimeout(function(){var s=document.createElement("script");s.type="module";s.src=${JSON.stringify(src)};document.head.appendChild(s)},0)}` +
    'try{new PerformanceObserver(function(l,o){if(l.getEntriesByName("first-contentful-paint").length){P=1;o.disconnect();go()}}).observe({type:"paint",buffered:true})}catch(e){P=1}' +
    'if(!L)addEventListener("load",function(){L=1;go()},{once:true});else go()})()</script>'
  );
}

let rewritten = 0;
for (const island of ISLANDS) {
  const file = join(DIST, island.page);
  let html = await readFile(file, 'utf8');
  if (html.includes(MARK)) continue;
  const out = island.entry ? entryOutput.get(island.entry) : null;
  if (island.entry && !out) throw new Error(`static-islands: no bundle for ${island.entry}`);

  for (const pattern of PATTERNS) html = html.replace(pattern, '');

  const leftovers = [
    ['flight payload', /__next_f/],
    ['Next script', new RegExp(`<script[^>]+src="${NEXT}`)],
    ['streamed content', /<template id="[BP]:|hidden id="S:|\$RC\(/],
  ].filter(([, re]) => re.test(html));
  if (leftovers.length > 0) {
    throw new Error(`static-islands: ${island.page} still has ${leftovers.map(([name]) => name).join(', ')}`);
  }
  if (!html.includes('</body>')) throw new Error(`static-islands: ${island.page} has no </body>`);

  html = html.replace('</body>', `${out ? loader(`${BASE}/${out}`) : `<script ${MARK}=""></script>`}</body>`);
  await writeFile(file, html);
  rewritten += 1;
}

console.log(`static-islands: ${rewritten} page(s) now ship without React (${[...entryOutput.values()].join(', ')})`);
