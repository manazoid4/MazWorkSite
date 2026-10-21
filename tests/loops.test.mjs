import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// CRO Move 5 (18 Oct 2026): the three loops. A /refer page with a tiered reward
// linked in the menu and footer, a standalone missed-calls calculator whose
// result is gated behind the demo form, and a build-credit line in shipped work.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'out');

const readPage = async (route) => {
  for (const candidate of [path.join(out, `${route}.html`), path.join(out, route.replace(/^\//, ''), 'index.html')]) {
    try { return await readFile(candidate, 'utf8'); } catch { /* try the next shape */ }
  }
  throw new Error(`missing exported page ${route}`);
};
const readSitemap = () => readFile(path.join(out, 'sitemap.xml'), 'utf8');

test('the referral section on /contact names all three tiers', async () => {
  const refer = await readPage('/contact');
  assert.match(refer, /id="refer"/);
  for (const tier of ['£50', '£150', '£300']) assert.ok(refer.includes(tier), `/contact#refer does not name the ${tier} tier`);
});

test('the referral reward keeps the live line, points at /contact#refer, and leaves the tiers to that page', async () => {
  const faq = await readPage('/faq');
  assert.match(faq, /£50 by bank transfer, no limit/, 'keep the referral line the site already published');
  assert.match(faq, /href="\/contact\#refer"/, 'the FAQ must point at the referral page');
  // The tier amounts (£150 is one) live on /refer, so the retired-price guard on
  // /faq stays intact.
  assert.doesNotMatch(faq, /£150/, 'tier amounts belong on /refer, not /faq');
});

test('the missed-calls calculator on /local-businesses gates its result behind the two-field demo form', async () => {
  const calc = await readPage('/local-businesses');
  assert.match(calc, /name="email"/, 'the gate form needs an email field');
  assert.match(calc, /name="name"/, 'the gate form needs a name field');
  assert.match(calc, /formsubmit\.co/, 'the gate must post to the same endpoint as the other forms');
  assert.match(calc, /\?\?\?/, 'the number must be hidden until the visitor asks for it');
  assert.doesNotMatch(calc, /ce-big[^>]*><strong>£/, 'the static page must not reveal the gated figure');
  assert.match(calc, /href="\/contact#refer"/, 'the calculator section points at the referral reward');
});

test('shipped work carries the build credit', async () => {
  const whatWeDo = await readPage('/what-we-do');
  assert.match(await readPage('/contact'), /Built by Maz Works/, '/contact#refer must explain the build credit');
});
