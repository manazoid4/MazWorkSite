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

test('What I Do shows the four service areas and prices points back to it', async () => {
  const [what, prices] = await Promise.all([page('what-we-do'), page('prices')]);
  for (const area of ['A website that does its job', 'Enquiries answered and followed up', 'Bookings and everyday running', 'A small tool built for one job']) {
    assert.match(what, new RegExp(area));
  }
  assert.ok(prices.includes('href="/what-we-do"'), '/prices points at /what-we-do instead of repeating the areas');
  for (const id of ['websites', 'enquiries', 'booking', 'custom-tools', 'side', 'why']) assert.match(what, new RegExp(`id="${id}"`));
  for (const href of ['/prices#websites', '/after-hours-receptionist', '/professional-teams', '/local-businesses', '/3d-printing', '/tools']) assert.ok(what.includes(`href="${href}"`), href);
  assert.match(what, /Photo to quote/);
  assert.doesNotMatch(what, /\bAI\b/);
  for (const href of ['#websites', '#systems', '#extras', '/professional-teams#complaints']) assert.ok(prices.includes(`href="${href}"`), href);
  assert.match(prices, /id="systems"/);
  assert.match(prices, /id="websites"/);
  assert.match(prices, /id="after-hours"/);
  assert.match(prices, /id="care"/);
  assert.match(prices, /Dashboards, reporting and complaints improvement are quoted to scope/);
  assert.match(prices, /Need care or maintenance\?/);
  assert.match(prices, /See options/);
  assert.match(what, /See it working before you pay/);
  assert.match(what, /I never need your passwords/);
});
