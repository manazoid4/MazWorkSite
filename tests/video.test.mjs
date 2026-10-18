import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = async (...p) => readFile(path.join(root, ...p), 'utf8');
const html = async (route) => {
  for (const f of [path.join(root, 'out', `${route}.html`), path.join(root, 'out', route, 'index.html')]) {
    try { return await readFile(f, 'utf8'); } catch { /* next */ }
  }
  throw new Error(`missing exported page ${route}`);
};
const text = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ');

// Mirror of videoQuote in offers.ts, read from source so the test cannot drift from the constants.
const offers = await read('app', 'offers.ts');
const price = (k) => Number(offers.match(new RegExp(`${k}: (\\d+)`))[1]);
const P = { half: price('halfDay'), full: price('fullDay'), edits: price('editBundle'), pct: price('bundleDiscountPercent') };

test('video prices are the approved ones and live only in offers.ts', async () => {
  assert.deepEqual(P, { half: 150, full: 250, edits: 200, pct: 20 });
  for (const f of ['app/video/page.tsx', 'app/video/video-selector.tsx']) {
    const src = await read(...f.split('/'));
    assert.doesNotMatch(src.replace(/\\u00a3|£\$\{/g, ''), /£\s?\d/, `${f} hard-codes a price`);
  }
});

test('bundle maths: 20% off the edits only, never the filming, no stacking', () => {
  const edits = P.edits, saving = Math.round(edits * P.pct / 100);
  assert.equal(saving, 40);
  assert.equal(edits - saving, 160);
  assert.equal(P.half + edits - saving, 310);
  assert.equal(P.full + edits - saving, 410);
  assert.equal(P.half, 150, 'filming is never discounted');
});

test('the video page shows packages, savings, scope and honest placeholders', async () => {
  const h = await html('video'); const t = text(h);
  for (const s of [/£150/, /£250/, /£200/, /£160/, /£310/, /£410/, /Half-Day Content Shoot/, /Full-Day Content Shoot/, /4 Promotional Videos/, /Apply for a Portfolio Project/, /Real examples are coming/, /UK-wide/]) assert.match(t, s);
  assert.match(h, /href="\/contact\?service=video#contact"/);
  assert.match(h, /href="https:\/\/wa\.me\/447544965187/);
  assert.match(h, /application\/ld\+json/);
});

test('the video page stays honest and keeps the location private', async () => {
  const t = text(await html('video'));
  assert.doesNotMatch(t, /\bAI\b|unlimited footage|testimonial|Derbyshire|Nottingham|Pixel|\bhire[ds]?\b|rent(ed)? (the |our )?cameras?/i);
  assert.doesNotMatch(t, /guarantee/i);
});

test('video is wired into the nav, sitemap and enquiry form; old Content Day link redirects by page', async () => {
  assert.match(await read('app', 'nav.ts'), /href: '\/video'/);
  assert.match(await read('app', 'enquiry.ts'), /id: 'video'[\s\S]*id: 'portfolio-project'/);
  assert.match(await readFile(path.join(root, 'out', 'sitemap.xml'), 'utf8'), /\/video</);
  assert.match(await html('content-day'), /href="\/video"/);
});
