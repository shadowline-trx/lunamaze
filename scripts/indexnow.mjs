#!/usr/bin/env node
/**
 * Tell IndexNow search engines (Bing, and through it Copilot; also Yandex,
 * Seznam, Naver and others) that the site's URLs were just redeployed.
 * Google does not use IndexNow; it reads the sitemap submitted in Search
 * Console.
 *
 * Reads the live sitemap after a deploy, so it only ever submits URLs that
 * exist. The key file is public/6f890e78297b47b2b8da468e2197df31.txt.
 * Never fails the build: a submission problem is logged and ignored.
 */
const HOST = 'lunamaze.com';
const KEY = '6f890e78297b47b2b8da468e2197df31';

async function main() {
  const res = await fetch(`https://${HOST}/sitemap.xml`, { headers: { 'cache-control': 'no-cache' } });
  if (!res.ok) throw new Error(`sitemap ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urls.length === 0) throw new Error('sitemap had no URLs');
  const submit = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
  });
  console.log(`IndexNow: submitted ${urls.length} URLs, status ${submit.status}`);
}

main().catch((error) => {
  console.log(`IndexNow: skipped (${error.message})`);
});
