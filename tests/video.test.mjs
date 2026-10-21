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
  for (const f of ['app/local-businesses/page.tsx', 'app/local-businesses/video-selector.tsx']) {
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
  const h = await html('local-businesses'); const t = text(h);
  for (const s of [/£150/, /£250/, /£200/, /£160/, /£310/, /£410/, /Half-Day Content Shoot/, /Full-Day Content Shoot/, /4 Promotional Videos/, /Apply for a Portfolio Project/, /UK-wide/]) assert.match(t, s);
  assert.match(h, /href="\/contact\?service=video#contact"/);
  assert.match(h, /href="https:\/\/wa\.me\/447544965187/);
  assert.match(h, /application\/ld\+json/);
});

test('the video page stays honest and keeps the location private', async () => {
  const t = text(await html('local-businesses'));
  assert.doesNotMatch(t, /\bAI\b|unlimited footage|testimonial|Derbyshire|Nottingham|Pixel|\bhire[ds]?\b|rent(ed)? (the |our )?cameras?/i);
  assert.doesNotMatch(t, /guarantee/i);
});

test('video is folded into /local-businesses and the enquiry form; old /video and /content-day redirect there', async () => {
  assert.match(await read('app', 'enquiry.ts'), /id: 'video'[\s\S]*id: 'portfolio-project'/);
  assert.match(await html('local-businesses'), /id="video"/);
  const redirects = JSON.parse(await read('docs', 'plans', 'redirects-b2.json'));
  for (const old of ['/video', '/content-day']) assert.equal(redirects.find((row) => row.source === old)?.destination, '/local-businesses#video');
});
