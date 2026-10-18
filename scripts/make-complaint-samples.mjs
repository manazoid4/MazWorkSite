/**
 * Regenerates the downloadable sample PDFs in public/samples/complaints/ by printing the two
 * sample report pages (/complaints/sample/health-check and /complaints/sample/board-report),
 * which render from the same fictional data as /complaints (app/complaints/sample-data.ts).
 * Playwright is not a project dependency. Install it outside the repo and point at it:
 *   PLAYWRIGHT=/path/to/node_modules/playwright-core BASE=http://localhost:3000 node scripts/make-complaint-samples.mjs
 * BASE must serve the built site (npm run build && npm start). Everything produced is invented data.
 */
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright-core');
const data = await import(pathToFileURL(path.resolve('app/complaints/sample-data.ts')).href);
const { SAMPLE_BUSINESS } = data;
const out = path.resolve('public/samples/complaints');
await mkdir(out, { recursive: true });

// PDFs from the printable pages
const base = process.env.BASE || 'http://localhost:3000';
const browser = await chromium.launch();
for (const [route, file] of [['/complaints/sample/health-check', 'sample-health-check-report.pdf'], ['/complaints/sample/board-report', 'sample-board-report.pdf']]) {
  const page = await browser.newPage();
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.pdf({ path: path.join(out, file), format: 'A4', printBackground: true, margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' } });
  await page.close();
  console.log('wrote', file);
}
await browser.close();
await writeFile(path.join(out, 'README.txt'), `Sample files for ${SAMPLE_BUSINESS}. Invented data. Regenerate with scripts/make-complaint-samples.mjs.\n`);
