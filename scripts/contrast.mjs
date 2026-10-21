// node scripts/contrast.mjs [--axe <baseUrl> --routes /,/contact]
import fs from 'node:fs';
import { loadPlaywright, loadAxe, arg } from './lib-playwright.mjs';

const lum = (h) => {
  h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join('');
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
if (Math.abs(ratio('#000', '#fff') - 21) > 0.01) throw new Error('selfcheck failed');
if (process.argv.includes('--selfcheck')) { console.log('selfcheck ok'); process.exit(0); }

const css = fs.readFileSync('app/globals.css', 'utf8');
const v = {};
for (const m of css.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-f]{3,6})\b/gi)) v[m[1]] = m[2];
// [fg, bg]; names starting with -- resolve from CSS vars, otherwise literal hex.
const pairs = [
  ['--ink', '--paper'], ['--ink', '--surface'], ['--muted', '--paper'], ['--muted', '--surface'],
  ['--signal-text', '--paper'], ['--signal-text', '--surface'], ['--ink', '--signal'], ['--surface', '--ink'],
  ['--ok', '--paper'], ['--surface', '--charcoal'], ['--signal', '--charcoal'], ['--signal', '--paper'],
  ['#ffffff', '#c2410c'],
];
for (const k of Object.keys(v)) if (/^--(pop|cream)/.test(k)) pairs.push([k, '--ink'], [k, '--paper']);
let fail = 0;
for (const [f, b] of pairs) {
  const fg = v[f] || f, bg = v[b] || b;
  if (!/^#/.test(fg) || !/^#/.test(bg)) { console.log(`SKIP ${f} on ${b}`); continue; }
  const r = ratio(fg, bg), ok = r >= 4.5;
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${r.toFixed(2)}:1  ${f} ${fg} on ${b} ${bg}  (AA text 4.5, large/UI 3)`);
}
const axeBase = arg('axe');
if (axeBase) {
  const AxeBuilder = loadAxe();
  if (!AxeBuilder) console.log('axe skipped: npm i -D @axe-core/playwright');
  else {
    const AB = AxeBuilder.default || AxeBuilder.AxeBuilder || AxeBuilder;
    const browser = await loadPlaywright().chromium.launch();
    const page = await browser.newPage();
    for (const r of arg('routes', '/').split(',')) {
      await page.goto(axeBase.replace(/\/$/, '') + r, { waitUntil: 'networkidle' });
      const res = await new AB({ page }).analyze();
      console.log(`axe ${r}: ${res.violations.length} violations` + res.violations.map(x => `\n  - ${x.id} (${x.impact}) x${x.nodes.length}`).join(''));
    }
    await browser.close();
  }
}
process.exit(fail ? 1 : 0);
