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

test('/refer is live, names all three tiers, and is discoverable from the menu, the footer and the sitemap', async () => {
  const refer = await readPage('/refer');
  for (const tier of ['£50', '£150', '£300']) assert.ok(refer.includes(tier), `/refer does not name the ${tier} tier`);

  const home = await readPage('/');
  assert.match(home, /href="\/refer"/, 'the menu must link /refer');
  const footer = home.slice(home.indexOf('mw-footer-links'));
  assert.match(footer, /href="\/refer">/, 'the footer must link /refer');

  assert.match(await readSitemap(), /\/refer<\/loc>/, '/refer must be in the sitemap');
});

test('the referral reward keeps the live line, points at /refer, and leaves the tiers to that page', async () => {
  const faq = await readPage('/faq');
  assert.match(faq, /£50 by bank transfer, no limit/, 'keep the referral line the site already published');
  assert.match(faq, /href="\/refer"/, 'the FAQ must point at the referral page');
  // The tier amounts (£150 is one) live on /refer, so the retired-price guard on
  // /faq stays intact.
  assert.doesNotMatch(faq, /£150/, 'tier amounts belong on /refer, not /faq');
});

test('/missed-calls-calculator is live, in the sitemap, and gates its result behind the two-field demo form', async () => {
  const calc = await readPage('/missed-calls-calculator');
  assert.match(calc, /name="email"/, 'the gate form needs an email field');
  assert.match(calc, /name="name"/, 'the gate form needs a name field');
  assert.match(calc, /formsubmit\.co/, 'the gate must post to the same endpoint as the other forms');
  assert.match(calc, /\?\?\?/, 'the number must be hidden until the visitor asks for it');
  assert.doesNotMatch(calc, /ce-big[^>]*><strong>£/, 'the static page must not reveal the gated figure');

  assert.match(await readSitemap(), /\/missed-calls-calculator<\/loc>/, 'the calculator must be in the sitemap');
  assert.match(await readPage('/refer'), /\/missed-calls-calculator/, '/refer should point at the calculator');
});

test('shipped work carries the build credit', async () => {
  const whatWeDo = await readPage('/what-we-do');
  assert.match(whatWeDo, /Built by Maz Works/, 'the example plan (a shipped artefact) must carry the credit');
  assert.match(await readPage('/refer'), /Built by Maz Works/, '/refer must explain the build credit');
});
