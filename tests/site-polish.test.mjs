import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'out');
const read = async (route) => {
  for (const candidate of [path.join(out, `${route}.html`), path.join(out, route, 'index.html')]) {
    try { return await readFile(candidate, 'utf8'); } catch { /* try the next */ }
  }
  throw new Error(`missing exported page ${route}`);
};
const text = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ');
const mainWithoutFooter = (html) => {
  const main = html.slice(html.indexOf('<main'), html.lastIndexOf('</main>'));
  return main.replace(/<footer[\s\S]*?<\/footer>/, '');
};
const words = (html) => text(mainWithoutFooter(html)).split(/\s+/).filter(Boolean).length;
const TYPES = ['trades', 'appointments', 'creators', 'offices'];

test('the main customer journey uses one clear enquiry action', async () => {
  for (const route of ['index', 'what-we-do', 'local-businesses', 'professional-teams', 'prices', 'contact']) {
    const html = await read(route);
    assert.match(html, /Get my free preview/, `${route} must offer the shared enquiry action`);
    assert.match(html, /href="\/contact[^\"]*#contact/, `${route} must make the general enquiry form reachable`);
  }
  const home = await read('index');
  assert.match(home, /class="mw-nav-cta" href="\/contact\?src=nav#contact/);
  const preview = await read('contact');
  assert.match(preview, /A free preview and fixed price/);
  assert.match(preview, /Free Preview &amp; Fixed Price/);
});

test('the free preview is a secondary link, never the main button', async () => {
  for (const route of ['index', 'after-hours-receptionist', 'prices']) {
    const html = await read(route);
    assert.doesNotMatch(html, /button-signal[^"]*"[^>]*href="https:\/\/cal\.com/, `${route}: demo booking is a main button`);
    assert.doesNotMatch(html, /href="https:\/\/cal\.com[^"]*"[^>]*class="[^"]*button-signal/, `${route}: demo booking is a main button`);
  }
});

// 600 -> 680 on 18 Oct: Maz asked for his own two-paragraph bio on the landing page.
test('page lengths: homepage under 680 words, type pages short (5 blocks), /prices folded', async () => {
  assert.ok(words(await read('index')) < 680, `homepage has ${words(await read('index'))} words`);
  for (const type of TYPES) {
    const html = await read(`for/${type}`);
    const sections = (mainWithoutFooter(html).match(/<section /g) ?? []).length;
    assert.ok(sections <= 5, `/for/${type} has ${sections} sections`);
    assert.ok(words(html) < 1000, `/for/${type} has ${words(html)} words`); // 11 Oct trade sprint: the hero phone became a step-through industry example (all four steps, owner card, limits) plus a short "in your week" block (was 800, before that 550)
    assert.match(html, /Demo business, not a client/);
    assert.match(html, /href="\/prices"/, `/for/${type} must link to the details on /prices`);
    for (const moved of ['s-calculator', 'cost-calculator', 'builder-trade', 'Own it or rent it']) assert.ok(!html.includes(moved), `/for/${type} still shows ${moved}`);
  }
  const prices = await read('prices');
  assert.ok((prices.match(/<details class="s-fold"/g) ?? []).length >= 6, 'details on /prices are folded');
  // Drop every folded block (package specs and the folds), counting nesting so each goes whole.
  let visible = prices;
  for (let start = visible.indexOf('<details'); start !== -1; start = visible.indexOf('<details')) {
    let depth = 0;
    const tags = /<details\b|<\/details>/g;
    tags.lastIndex = start;
    let end = start;
    for (let m = tags.exec(visible); m; m = tags.exec(visible)) {
      depth += m[0] === '</details>' ? -1 : 1;
      if (depth === 0) { end = m.index + m[0].length; break; }
    }
    visible = visible.slice(0, start) + visible.slice(end);
  }
  assert.ok(words(visible) < 1100, `/prices shows ${words(visible)} words before any fold is opened`);
});

test('positioning: no quick-fix wording, no AI in the offer, /rotareason out of the sitemap', async () => {
  for (const route of ['index', 'prices', 'contact', ...TYPES.map((t) => `for/${t}`)]) {
    const t = text(await read(route));
    assert.doesNotMatch(t, /quick ?fix|quick win|website repair/i, route);
    // Never sell AI (Maz, 27 Sep). Since 1 Nov the homepage may say AI is tested before use; product-style AI copy stays banned everywhere.
    assert.doesNotMatch(t, /AI[- ](assistant|agent|powered|receptionist|chatbot)/i, route);
    if (route !== 'index') assert.doesNotMatch(t, /\bAI\b/, route);
  }
  const home = text(await read('index'));
  for (const sentence of home.split(/(?<=[.?!])\s+/).filter((x) => /\bAI\b/.test(x))) {
    assert.match(sentence, /test|check|rules|research|model/i, `homepage AI mention must be about testing: ${sentence}`);
  }
  const sitemap = await readFile(path.join(out, 'sitemap.xml'), 'utf8');
  for (const hidden of ['rotareason', 'maz-core', 'maz-pocket-ai', 'quick-win']) assert.doesNotMatch(sitemap, new RegExp(hidden));
});

test('outreach templates: no prices, no names, every route links a /for page with a src tag', async () => {
  const doc = await readFile(path.join(root, 'docs', 'maz-works', 'OUTREACH-TEMPLATES.md'), 'utf8');
  assert.doesNotMatch(doc, /£/);
  for (const type of TYPES) assert.match(doc, new RegExp(`/for/${type}\\?src=`));
  for (const slot of ['[Owner]', '[Business]', '[Evidence]', '[Package]', '[Link]']) assert.ok(doc.includes(slot), slot);
  assert.match(doc, /Companies House/);
  assert.match(doc, /Exactly one follow-up/);
});
