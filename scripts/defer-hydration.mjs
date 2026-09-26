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
 * Runs automatically after `npm run build` (npm's postbuild hook). Idempotent:
 * a page that already carries the loader is left alone.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

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
for await (const file of htmlFiles(DIST)) {
  const html = await readFile(file, 'utf8');
  if (html.includes(MARK)) continue;
  const scripts = [];
  let out = html.replace(SCRIPT, (_, src, idAttr) => {
    const id = /id="([^"]*)"/.exec(idAttr)?.[1] ?? '';
    scripts.push(id ? [src, id] : [src]);
    return '';
  });
  if (scripts.length === 0) continue;
  out = out.replace(PRELOAD, '');
  if (!out.includes('</body>')) continue;
  out = out.replace('</body>', `${loader(scripts)}</body>`);
  await writeFile(file, out);
  changed += 1;
}
console.log(`defer-hydration: rewrote ${changed} page(s)`);
