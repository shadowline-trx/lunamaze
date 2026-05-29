/**
 * One-off icon optimizer for the Luna Maze product cards.
 *
 * The source product icons shipped at full resolution (≈950px wide, 200–360KB)
 * but render at roughly 110px in the cards. This downscales them to a
 * retina-safe size and recompresses, writing optimized copies alongside the
 * originals. Run with: `node scripts/optimize-icons.mjs`.
 *
 * Backups of the originals are written with a `.orig` suffix the first time
 * so the source art is never lost.
 */
import sharp from 'sharp';
import { readFile, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, '..', 'public', 'images');

/** Max rendered size is ~110px; 320px keeps it crisp at 2–3x DPR. */
const MAX_DIMENSION = 320;

const targets = ['axiom-icon.png', 'typecrt-logo.png'];

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

for (const name of targets) {
  const file = join(imagesDir, name);
  const backup = `${file}.orig`;

  if (!(await exists(backup))) {
    await writeFile(backup, await readFile(file));
  }

  const input = await readFile(backup);
  const before = input.length;

  const output = await sharp(input)
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9, quality: 82, effort: 10 })
    .toBuffer();

  await writeFile(file, output);
  const after = output.length;
  const pct = (((before - after) / before) * 100).toFixed(1);
  console.log(
    `${name}: ${(before / 1024).toFixed(1)}KB -> ${(after / 1024).toFixed(1)}KB (-${pct}%)`,
  );
}
