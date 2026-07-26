/**
 * Screenshot harness for design review. Not part of the build.
 *
 * Usage: node shot.js <url-path> <out.png> [width] [full]
 *   node shot.js /axiom/tools/severity-test/ out.png 430 full
 *
 * Serves ./dist statically so pages are shot exactly as deployed.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const DIST = path.join(__dirname, 'dist');
const PORT = 4321;

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2',
  '.ico': 'image/x-icon', '.txt': 'text/plain',
};

function serve() {
  return http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    let file = path.join(DIST, p);
    if (!path.extname(file)) file = path.join(file, 'index.html');
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); return res.end('nope'); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    });
  }).listen(PORT);
}

(async () => {
  // Pass the route WITHOUT a leading slash: Git Bash rewrites a leading "/"
  // into a Windows path before node ever sees it.
  const [, , raw = '', out = 'out.png', width = '430', full = ''] = process.argv;
  const urlPath = '/' + raw.replace(/^\/+/, '');
  const server = serve();
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({
    width: parseInt(width, 10),
    height: 932,
    deviceScaleFactor: 2,
  });
  await page.goto(`http://localhost:${PORT}${urlPath}`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: out, fullPage: full === 'full' });
  await browser.close();
  server.close();
  console.log('shot', out);
})();
