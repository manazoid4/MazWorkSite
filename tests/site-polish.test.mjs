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

test('one main action: every primary button says "Get my free preview"', async () => {
  const banned = /Free demo|Get my free demo|Send me this plan|Ask for this system|Free preview and price|Get my free preview and price|Get my free preview for this|Book a call for your free preview|Get my free preview instead|Get my free plan/;
  for (const route of ['index', 'prices', 'free-plan', 'demos', 'linkedin', 'what-we-do', ...TYPES.map((t) => `for/${t}`)]) {
    const html = await read(route);
    assert.doesNotMatch(html, banned, `${route} still has an old button label`);
    const signals = [...html.matchAll(/class="[^"]*button-signal[^"]*"[^>]*>([^<]*)</g)].map((m) => m[1].trim()).filter(Boolean);
    for (const label of signals) assert.equal(label, 'Get my free preview', `${route}: primary button "${label}"`);
  }
});

test('the free preview is a secondary link, never the main button', async () => {
  for (const route of ['index', 'demos', 'linkedin', 'prices']) {
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
  for (const route of ['index', 'prices', 'free-plan', ...TYPES.map((t) => `for/${t}`)]) {
    const t = text(await read(route));
    assert.doesNotMatch(t, /quick ?fix|quick win|website repair/i, route);
    assert.doesNotMatch(t, /\bAI\b/, route);
  }
  const sitemap = await readFile(path.join(out, 'sitemap.xml'), 'utf8');
  for (const hidden of ['rotareason', 'maz-core', 'maz-pocket-ai', 'quick-win']) assert.doesNotMatch(sitemap, new RegExp(hidden));
  const updates = await read('whats-new');
  assert.ok((updates.match(/class="mw-update-card/g) ?? updates.match(/<article/g) ?? []).length <= 3, 'whats-new shows at most 3 updates');
});

test('outreach templates: no prices, no names, every route links a /for page with a src tag', async () => {
  const doc = await readFile(path.join(root, 'docs', 'maz-works', 'OUTREACH-TEMPLATES.md'), 'utf8');
  assert.doesNotMatch(doc, /£/);
  for (const type of TYPES) assert.match(doc, new RegExp(`/for/${type}\\?src=`));
  for (const slot of ['[Owner]', '[Business]', '[Evidence]', '[Package]', '[Link]']) assert.ok(doc.includes(slot), slot);
  assert.match(doc, /Companies House/);
  assert.match(doc, /Exactly one follow-up/);
});
