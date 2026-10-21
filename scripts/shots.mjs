// node scripts/shots.mjs --base <url> --routes /,/what-we-do --widths 375,768,1440 --out <dir>
import fs from 'node:fs';
import path from 'node:path';
import { loadPlaywright, arg } from './lib-playwright.mjs';

const base = arg('base', 'http://127.0.0.1:3000').replace(/\/$/, '');
const routes = arg('routes', '/').split(',');
const widths = arg('widths', '375,768,1440').split(',').map(Number);
const out = arg('out', 'shots');
const slug = (r) => r.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'home';

if (slug('/') !== 'home' || slug('/a/b/') !== 'a-b') throw new Error('selfcheck failed');
if (process.argv.includes('--selfcheck')) { console.log('selfcheck ok'); process.exit(0); }

fs.mkdirSync(out, { recursive: true });
const { chromium } = loadPlaywright();
const browser = await chromium.launch();
let fail = 0, n = 0;
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  for (const r of routes) {
    const file = path.join(out, `${slug(r)}-${w}.png`);
    try {
      const res = await page.goto(base + r, { waitUntil: 'networkidle', timeout: 45000 });
      const sw = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
      // Scroll through once so scroll-reveal sections are shown before the full-page capture.
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); await new Promise((r) => setTimeout(r, 400)); });
      await page.screenshot({ path: file, fullPage: true });
      const bad = (res && res.status() >= 400) ? `HTTP ${res.status()}` : sw[0] > sw[1] ? `h-scroll ${sw[0]}>${sw[1]}` : '';
      console.log(`${bad ? 'FAIL' : 'PASS'} ${file}${bad ? ' ' + bad : ''}`);
      if (bad) fail++;
    } catch (e) { console.log(`FAIL ${file} ${e.message.split('\n')[0]}`); fail++; }
    n++;
  }
  await ctx.close();
}
await browser.close();
console.log(`${n - fail}/${n} passed`);
process.exit(fail ? 1 : 0);
