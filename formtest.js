/**
 * End-to-end check of the waitlist form. Not part of the build.
 *
 *   node formtest.js
 *
 * Exists because a signup form that fails silently is worse than no form: the
 * visitor believes they are on the list and the founder believes the list is
 * growing. A curl against the RPC proves the database works, not that the page
 * does — CORS, the publishable key, and the success state are all only
 * exercised by a real browser loading the real built page.
 *
 * It submits a genuinely unique address to production, then reports it so the
 * row can be cleaned up.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const DIST = path.join(__dirname, 'dist');
const PORT = 4322;

function serve() {
  return http
    .createServer((req, res) => {
      const p = decodeURIComponent(req.url.split('?')[0]);
      let file = path.join(DIST, p);
      if (!path.extname(file)) file = path.join(file, 'index.html');
      fs.readFile(file, (err, data) => {
        if (err) {
          res.writeHead(404);
          return res.end('nope');
        }
        res.writeHead(200);
        res.end(data);
      });
    })
    .listen(PORT);
}

(async () => {
  const server = serve();
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932 });

  const failures = [];
  const missing = new Set();
  page.on('response', (r) => {
    if (r.status() === 404) missing.add(r.url());
  });
  page.on('pageerror', (e) => failures.push(`pageerror: ${e.message}`));

  await page.goto(`http://localhost:${PORT}/axiom/ios/`, { waitUntil: 'networkidle0' });

  const probe = `e2e-${Date.now()}@example.com`;

  // --- invalid address must be rejected without a network round trip -------
  await page.type('input[type="email"]', 'nope');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 400));
  const alert = await page.$eval('[role="alert"]', (el) => el.textContent).catch(() => null);
  console.log(alert ? `reject path OK: "${alert}"` : 'reject path FAILED: no alert shown');

  // --- real address must reach Supabase and flip to the success state ------
  await page.$eval('input[type="email"]', (el) => {
    el.value = '';
  });
  await page.type('input[type="email"]', probe);

  const [response] = await Promise.all([
    // Must match the POST, not the CORS preflight: OPTIONS answers 200 and
    // would make a duplicate look different from a new signup when it is not.
    page.waitForResponse(
      (r) => r.url().includes('/rpc/join_waitlist') && r.request().method() === 'POST',
      { timeout: 15000 },
    ),
    page.click('button[type="submit"]'),
  ]);
  console.log(`POST join_waitlist -> ${response.status()}`);

  await page.waitForSelector('[role="status"]', { timeout: 10000 });
  const success = await page.$eval('[role="status"]', (el) => el.textContent.trim());
  console.log(`success state: "${success}"`);

  // --- resubmitting the same address must look identical -------------------
  await page.reload({ waitUntil: 'networkidle0' });
  await page.type('input[type="email"]', probe);
  const [dupe] = await Promise.all([
    // Must match the POST, not the CORS preflight: OPTIONS answers 200 and
    // would make a duplicate look different from a new signup when it is not.
    page.waitForResponse(
      (r) => r.url().includes('/rpc/join_waitlist') && r.request().method() === 'POST',
      { timeout: 15000 },
    ),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForSelector('[role="status"]', { timeout: 10000 });
  console.log(`duplicate -> ${dupe.status()} (must match the first, and show success)`);

  console.log(failures.length ? `PAGE ERRORS: ${failures.join(' | ')}` : 'no page errors');
  console.log(missing.size ? `404s:\n  ${[...missing].join('\n  ')}` : 'no 404s');
  console.log(`cleanup: delete from launch_waitlist where email = '${probe}'`);

  await browser.close();
  server.close();
})();
