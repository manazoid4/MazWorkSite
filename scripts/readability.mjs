// node scripts/readability.mjs [outDir=out]  -- Flesch-Kincaid grade per built static page.
import fs from 'node:fs';
import path from 'node:path';

export function syllables(w) {
  w = w.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  return Math.max(1, (w.match(/[aeiouy]{1,2}/g) || []).length);
}
export function analyse(text) {
  const sentences = text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => /[a-z]/i.test(s));
  const words = text.match(/[A-Za-z][A-Za-z'-]*/g) || [];
  const syl = words.reduce((a, w) => a + syllables(w), 0);
  const grade = words.length && sentences.length ? 0.39 * (words.length / sentences.length) + 11.8 * (syl / words.length) - 15.59 : 0;
  const long = sentences.filter(s => s.split(/\s+/).length > 25);
  return { grade, words: words.length, long };
}
export function mainText(html) {
  const m = html.match(/<main[\s\S]*?<\/main>/i);
  return (m ? m[0] : html)
    .replace(/<(script|style|nav|footer|header|noscript|svg)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|li|h[1-6]|div|section|tr|br)>/gi, '. ').replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/&[a-z#0-9]+;/g, ' ')
    .replace(/\.(\s*\.)+/g, '.').replace(/\s+/g, ' ');
}
function* walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== '_next') yield* walk(p); } else if (e.name.endsWith('.html')) yield p;
  }
}

if (syllables('cat') !== 1 || syllables('reading') !== 2 || syllables('banana') !== 3) throw new Error('selfcheck failed');
if (process.argv.includes('--selfcheck')) { console.log('selfcheck ok'); process.exit(0); }
const dir = process.argv.slice(2).find(a => !a.startsWith('--')) || 'out';
if (!fs.existsSync(dir)) { console.error(`no ${dir}/ -- run npm run build first`); process.exit(1); }
for (const f of walk(dir)) {
  const a = analyse(mainText(fs.readFileSync(f, 'utf8')));
  console.log(`${path.relative(dir, f)} | FK ${a.grade.toFixed(1)} | ${a.words} words | ${a.long.length} sentences >25w`);
  for (const s of a.long.slice(0, 3)) console.log(`    - ${s.slice(0, 140)}`);
}
