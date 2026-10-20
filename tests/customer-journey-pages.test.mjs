import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const out = path.join(process.cwd(), 'out');
async function page(route) {
  for (const file of [`${route}/index.html`, `${route}.html`]) {
    try { return await readFile(path.join(out, file), 'utf8'); } catch { /* Try Next's other static export shape. */ }
  }
  throw new Error(`Missing static page: ${route}`);
}

test('What I Do and prices use the three customer journey buckets', async () => {
  const [what, prices] = await Promise.all([page('what-we-do'), page('prices')]);
  for (const bucket of ['Get Customers', 'Serve Customers', 'Keep &amp; Improve']) {
    assert.match(what, new RegExp(bucket, 'i'));
    assert.match(prices, new RegExp(bucket, 'i'));
  }
  for (const id of ['get-customers', 'serve-customers', 'keep-improve']) assert.match(what, new RegExp(`id="${id}"`));
  for (const href of ['/prices#websites', '/prices#systems', '/prices#keep-improve', '/prices#extras', '/complaints-improvement', '/proof']) assert.ok(what.includes(`href="${href}"`), href);
  for (const href of ['#websites', '#systems', '#extras', '/complaints-improvement']) assert.ok(prices.includes(`href="${href}"`), href);
  assert.match(prices, /id="systems"/);
  assert.match(prices, /id="websites"/);
  assert.match(prices, /id="after-hours"/);
  assert.match(prices, /id="care"/);
  assert.match(prices, /Dashboards, reporting and complaints improvement: quoted to scope\./);
  assert.match(prices, /Need care or maintenance\?/);
  assert.match(prices, /See options/);
  assert.match(what, /See it working before you pay/);
  assert.match(what, /I never need your passwords/);
});
