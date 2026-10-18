import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Content Day (18 Oct 2026): a published flat day rate, borrowed from
// commercial-photography pricing, aimed at what Maz Works does. Price from
// offers.ts only; honest limits; wired into the nav and sitemap.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'out');
const read = async (route) => {
  for (const candidate of [path.join(out, `${route}.html`), path.join(out, route, 'index.html')]) {
    try { return await readFile(candidate, 'utf8'); } catch { /* try the next */ }
  }
  throw new Error(`missing exported page ${route}`);
};
const text = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ');

test('the Content Day price and day rate live only in offers.ts', async () => {
  const offers = await readFile(path.join(root, 'app', 'offers.ts'), 'utf8');
  assert.match(offers, /name: 'Content Day'/);
  assert.match(offers, /price: '£300'/);
  assert.match(offers, /day: 300/);
  assert.match(offers, /CONTENT_DAY_BUNDLE/);
  for (const file of ['app/content-day/page.tsx']) {
    assert.doesNotMatch(await readFile(path.join(root, file), 'utf8'), /£\s?\d/, file);
  }
});

test('the Content Day page shows the day, the bundle, the process and the plain limits', async () => {
  const html = await read('content-day');
  const page = text(html);
  assert.match(page, /£300/, 'the day rate shows');
  assert.match(page, /£595/, 'the day plus a Launch Page shows');
  assert.match(page, /Content Day/);
  assert.match(page, /How the day runs/);
  assert.match(page, /Private gallery/i);
  assert.match(page, /What you can do with the photos/);
  assert.match(page, /Not included/);
  assert.match(page, /What owners ask about a Content Day/);
  assert.match(html, /href="\/contact\?service=content-day#contact"/);
  assert.match(html, /href="\/prices"/);
  assert.match(html, /href="\/free-plan\?src=content-day"/);
});

test('the Content Day page stays honest: no AI, no invented proof, no promises', async () => {
  const page = text(await read('content-day'));
  assert.doesNotMatch(page, /\bAI\b/);
  assert.doesNotMatch(page, /unlimited/i);
  assert.doesNotMatch(page, /free trial|7-day pilot/i);
  assert.doesNotMatch(page, /testimonial|\d+ (businesses|clients|customers) (use|trust)/i);
  assert.doesNotMatch(page, /guarantee[sd]? (leads|rankings|enquiries|bookings)/i);
});

test('the Content Day is wired into the nav and the sitemap', async () => {
  const nav = await readFile(path.join(root, 'app', 'nav.ts'), 'utf8');
  assert.match(nav, /href: '\/content-day'/);
  const sitemap = await readFile(path.join(out, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /\/content-day</);
});
