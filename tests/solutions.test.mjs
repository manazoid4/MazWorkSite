import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Maz Works Solutions (11 Oct 2026): six problems, four answers each, every
// price read from app/offers.ts. Reads the static export, so run `npm run build` first.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'out');
const read = async (route) => {
  for (const candidate of [path.join(out, `${route}.html`), path.join(out, route, 'index.html')]) {
    try { return await readFile(candidate, 'utf8'); } catch { /* try the next */ }
  }
  throw new Error(`missing exported page ${route}`);
};
const text = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ');
const src = (file) => readFile(path.join(root, file), 'utf8');
const IDS = ['missed-calls', 'bookings', 'quotes', 'updates', 'reviews', 'joined-up'];

const offersSource = await src('app/offers.ts');
const loadOffers = (source) => {
  const mod = {};
  new Function('exports', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(mod);
  return mod;
};
const FEE_LINE = /export const AFTER_HOURS_SETUP_FEE: number = \d+;/;

test('/solutions renders all six solutions in the HTML, each with the four answers', async () => {
  const html = await read('solutions');
  for (const id of IDS) {
    assert.match(html, new RegExp(`<details class="sol-panel" id="${id}" open=""`), `${id} panel is open in the HTML`);
    assert.match(html, new RegExp(`href="#${id}"`), `${id} reachable by anchor with no JavaScript`);
  }
  const page = text(html);
  for (const q of ['The problem', 'What you get', 'What it costs', 'What happens next']) {
    assert.equal(page.split(q).length - 1, 6, `${q} appears once per solution`);
  }
  assert.equal(page.split('Pay once (you own it)').length - 1, 6);
  assert.equal(page.split('Keeps costing').length - 1, 6);
  assert.match(page, /No VAT added/);
});

test('every £ amount on /solutions and /prices already exists in offers.ts', async () => {
  const allowed = new Set(offersSource.match(/£[\d,]+/g));
  for (const route of ['solutions', 'prices']) {
    const html = await read(route);
    const start = html.indexOf('id="solutions"');
    const region = route === 'prices' ? html.slice(start, html.indexOf('class="pz-folds"')) : html.slice(html.indexOf('<main'), html.lastIndexOf('</main>'));
    assert.ok(start > 0 && region.length > 1000, 'picker region found');
    for (const amount of text(region).match(/£[\d,]+/g) ?? []) {
      assert.ok(allowed.has(amount), `${route}: ${amount} is not an offers.ts price`);
    }
  }
});

test('no price is typed in the new component files', async () => {
  for (const file of ['app/solutions/data.ts', 'app/solutions/solutions-picker.tsx', 'app/solutions/page.tsx', 'app/price-list.tsx']) {
    assert.doesNotMatch((await src(file)).replace(/\/\*[\s\S]*?\*\//g, ''), /£\s?\d/, file);
  }
  const offers = loadOffers(offersSource);
  const data = await src('app/solutions/data.ts');
  for (const read of ['OFFERS', 'AFTER_HOURS', 'CARE_PLAN', 'getExtra']) assert.match(data, new RegExp(`\\b${read}\\b`), `data reads ${read} from offers`);
  assert.equal(offers.OFFERS[0].price, '£99');
});

test('the CTAs are pre-filled with the package and a source tag', async () => {
  const html = await read('solutions');
  const expected = { 'missed-calls': 'Starter%20Automation', bookings: 'Starter%20Automation', quotes: 'Starter%20Automation', updates: 'Starter%20Automation', reviews: 'Starter%20Automation', 'joined-up': 'Business%20System' };
  for (const [id, pkg] of Object.entries(expected)) {
    assert.match(html, new RegExp(`href="/free-plan\\?src=solutions-${id}&amp;package=${pkg}#leak-check-form"`), id);
  }
  assert.match(html, /Get my free preview/);
});

test('picker keeps its choice in the URL hash and steps back through choices', async () => {
  const picker = await src('app/solutions/solutions-picker.tsx');
  assert.match(picker, /history\.pushState/);
  assert.match(picker, /addEventListener\('popstate'/);
  assert.match(picker, /addEventListener\('hashchange'/);
  const data = await src('app/solutions/data.ts');
  for (const id of IDS) assert.match(data, new RegExp(`id: '${id}'`));
  // The business switch changes examples only: it never touches prices.
  assert.match(picker, /examples\[biz\]/);
  assert.doesNotMatch(picker.slice(picker.indexOf('const chooseBiz'), picker.indexOf('return (', picker.indexOf('const chooseBiz'))), /onceHead|keepsHead|once\b/);
});

test('the business-type switch has one example per type per solution, in data', async () => {
  const data = await src('app/solutions/data.ts');
  assert.equal((data.match(/examples: \{/g) ?? []).length, 6);
  for (const biz of ['trade', 'salon', 'garage', 'cafe', 'office']) assert.equal((data.match(new RegExp(`^\\s+${biz}: '`, 'gm')) ?? []).length, 6, biz);
});

test('copy rules: plain words, no AI, no quick fixes, no invented proof', async () => {
  for (const route of ['solutions', 'prices']) {
    const page = text(await read(route));
    assert.doesNotMatch(page, /\bAI\b/, route);
    assert.doesNotMatch(page, /quick fix|website repairs|unlimited/i, route);
    assert.doesNotMatch(page, /testimonial|\d+ (businesses|clients|customers) (use|trust)|\b\d+% (more|fewer|less)/i, route);
  }
});

test('/prices uses the picker in place of the chooser, ways-to-pay strip and by-problem fold, and keeps its anchors', async () => {
  const html = await read('prices');
  assert.match(html, /id="solutions"/);
  assert.doesNotMatch(html, /class="s-chooser"|class="s-ways"|class="s-solutions"|id="by-problem"/);
  for (const anchor of ['systems', 'websites', 'monthly', 'after-hours', 'care']) assert.match(html, new RegExp(`id="${anchor}"`), anchor);
  const offers = loadOffers(offersSource);
  assert.ok(offers.MISSED_CALL_OPTIONS.length === 4, 'missed-call options kept');
  for (const dead of ['CHOOSER', 'WAYS_TO_PAY', 'SAME_PRICE_NOTE']) assert.doesNotMatch(offersSource, new RegExp(`export const ${dead}\\b`), `${dead} deleted`);
});

test('receptionist set-up fee is one switch, live at the approved value, and both states read right', async () => {
  assert.match(offersSource, FEE_LINE);
  const live = loadOffers(offersSource);
  assert.equal(live.AFTER_HOURS_SETUP_FEE, 99, 'branch ships the approved live value');
  assert.equal(live.AFTER_HOURS.setup, '£99 set-up, once');
  const free = loadOffers(offersSource.replace(FEE_LINE, 'export const AFTER_HOURS_SETUP_FEE: number = 0;'));
  assert.equal(free.AFTER_HOURS.setup, 'Set-up included');
  assert.equal(free.AFTER_HOURS.price, live.AFTER_HOURS.price, 'monthly price does not move');
  assert.equal(free.AFTER_HOURS.minutes, 300);
  // Every page reads the switch: no page types its own set-up wording.
  const files = ['app/after-hours-receptionist/page.tsx', 'app/after-hours-receptionist/content.ts', 'app/price-list.tsx', 'app/services/page.tsx', 'app/solutions/data.ts'];
  for (const file of files) assert.doesNotMatch(await src(file), /Set-up included|£99 set-up/, file);
  // Built pages show the live state.
  for (const route of ['after-hours-receptionist', 'services', 'solutions', 'prices']) assert.match(text(await read(route)), /£99 set-up, once/, route);
  assert.doesNotMatch(text(await read('after-hours-receptionist')), /set-up included/i);
});

test('/solutions is in the sitemap, the site map page, the footer groups and carries schema', async () => {
  assert.match(await readFile(path.join(out, 'sitemap.xml'), 'utf8'), /\/solutions</);
  const map = await read('site-map');
  assert.match(map, /href="\/solutions"/);
  const html = await read('solutions');
  assert.match(html, /"@type":"Service"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/[^"]+\/solutions"/);
  assert.match(html, /<title>[^<]*Maz Works<\/title>/);
});

test('the picker never moves focus on load (the skip link must stay hidden), and shows a one-line cost summary', async () => {
  for (const file of ['app/solutions/solutions-picker.tsx', 'app/solutions/page.tsx']) {
    assert.doesNotMatch(await src(file), /\.focus\(|autoFocus/, file);
  }
  const picker = await src('app/solutions/solutions-picker.tsx');
  assert.match(picker, /className="sol-sum"/);
  assert.match(picker, /I run a… \(optional\)/);
  // The business switch must not be caught by the rule that hides unselected panels.
  const css = await src('app/solutions/solutions.css');
  assert.match(css, /\.sol-js > \.sol-item:not\(\.sol-on\) \{ display: none; \}/);
  assert.doesNotMatch(css, /\.sol-js > div:not/);
  assert.match(css, /\.sol-biz button \{ min-height: 44px;/);
  const page = text(await read('solutions'));
  assert.match(page, /£99 once · nothing required monthly/);
  assert.match(page, /from £595 once · nothing required monthly/);
  assert.match(page, /Or calls answered: £79\/month, £99 set-up, once/);
});
