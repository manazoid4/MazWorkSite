import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

// Site by customer type (plan v3, 2 Oct): four type pages, named recipes, calculator presets,
// explainer animations with stills, the drafted free plan and the scope sheet.
const root = process.cwd();
const exportRoot = path.join(root, 'out');
const modules = {};
const load = (name) => {
  if (modules[name]) return modules[name];
  const source = ts.transpileModule(require(name), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  modules[name] = {};
  new Function('exports', 'require', source)(modules[name], (dep) => load(dep.replace(/^\.\.?\//, '').replace(/^free-plan\//, 'free-plan/')));
  return modules[name];
};
const sources = {};
async function readSource(name) { sources[name] ??= await fs.readFile(path.join(root, 'app', `${name}.ts`), 'utf8'); return sources[name]; }
function require(name) { if (!sources[name]) throw new Error(`load ${name} first`); return sources[name]; }
for (const name of ['reply-time', 'site', 'offers', 'systems', 'customer-types', 'free-plan/draft']) {
  if (name === 'reply-time') { sources[name] = (await fs.readFile(path.join(root, 'app', 'reply-time.js'), 'utf8')); continue; }
  await readSource(name);
}
// site.ts re-exports from ./reply-time.js; map that path onto the loaded JS source.
const resolve = (dep) => dep.replace('./reply-time.js', 'reply-time').replace(/^\.\.?\//, '');
const run = (name) => {
  if (modules[name]) return modules[name];
  const text = sources[name] ?? sources[name.replace('.js', '')];
  const out = ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  modules[name] = {};
  new Function('exports', 'require', out)(modules[name], (dep) => run(resolve(dep)));
  return modules[name];
};
const offers = run('offers');
const types = run('customer-types');
const draft = run('free-plan/draft');

async function readPage(route) {
  const name = route === '/' ? 'index' : route.replace(/^\//, '');
  for (const candidate of [path.join(exportRoot, `${name}.html`), path.join(exportRoot, name, 'index.html')]) {
    try { return (await fs.readFile(candidate, 'utf8')).replaceAll('<!-- -->', ''); } catch { /* try the other shape */ }
  }
  throw new Error(`Missing static page for ${route}`);
}

test('four customer types, each with pains, recipes, a calculator preset and real menu jobs', () => {
  assert.deepEqual(types.CUSTOMER_TYPES.map((t) => t.id), ['trades', 'appointments', 'creators', 'offices']);
  for (const type of types.CUSTOMER_TYPES) {
    assert.ok(type.pains.length >= 4, `${type.id} pains`);
    assert.equal(type.recipes.length, 3, `${type.id} recipes`);
    for (const row of type.pains) if (row.starter) offers.getMenuJob(row.starter);
    for (const id of type.menu) offers.getMenuJob(id);
    for (const recipe of type.recipes) for (const id of recipe.jobs) offers.getMenuJob(id);
    assert.ok(type.calculator.perWeek > 0 && type.calculator.share > 0 && type.calculator.value > 0, `${type.id} preset`);
  }
});

test('each type page is short: pains → fix, three priced recipes, a labelled demo business and one main button (polish, 2 Oct)', async () => {
  for (const type of types.CUSTOMER_TYPES) {
    const html = await readPage(`/for/${type.id}`);
    assert.match(html, /Your problem, and the task that fixes it/, `${type.id}: pains`);
    assert.match(html, /Three ways in/, `${type.id}: recipes`);
    for (const recipe of type.recipes) assert.ok(html.includes(recipe.name.replace(/&/g, '&amp;')), `${type.id}: ${recipe.name}`);
    assert.match(html, /Demo business, not a client/, `${type.id}: labelled demo business`);
    // Next steps, tweaks, own-vs-rent and the calculator are said once, on /prices.
    for (const moved of [/class="ex ex-steps"/, /class="ex ex-tweaks"/, /id="own-vs-rent"/]) assert.doesNotMatch(html, moved, `${type.id}: ${moved} belongs on /prices`);
    assert.match(html, /href="\/prices"/, `${type.id}: link to the details`);
    assert.match(html, new RegExp(`href="/free-plan\\?src=for-${type.id}&amp;trade=${type.id}#leak-check-form">Get my free demo<`), `${type.id}: main button`);
    assert.doesNotMatch(html, /quick fix/i, `${type.id}: banned wording`);
    assert.doesNotMatch(html, /\bAI\b/, `${type.id}: no AI copy`);
    assert.match(html, new RegExp(`<link rel="canonical" href="[^"]*/for/${type.id}"`), `${type.id}: canonical`);
  }
  const creators = await readPage('/for/creators');
  assert.match(creators, /Starter for creators/);
  assert.match(creators, /Comment to get it/, 'creators page shows the keyword-DM scene');
});

test('the homepage asks "What do you run?" and reaches every type page and the ladder in one tap', async () => {
  const html = await readPage('/');
  assert.match(html, /What do you run\?/);
  for (const type of types.CUSTOMER_TYPES) assert.match(html, new RegExp(`href="/for/${type.id}"`));
  assert.match(html, /href="\/prices"/);
  assert.match(html, /href="#check">Get my free demo</);
  assert.doesNotMatch(html, /href="\/brand-kit"/, 'creators link goes to /for/creators now');
  const hub = await readPage('/for');
  for (const type of types.CUSTOMER_TYPES) assert.match(hub, new RegExp(`href="/for/${type.id}"`));
  const sitemap = await fs.readFile(path.join(exportRoot, 'sitemap.xml'), 'utf8');
  for (const type of types.CUSTOMER_TYPES) assert.match(sitemap, new RegExp(`/for/${type.id}<`));
  assert.doesNotMatch(sitemap, /\/brand-kit</);
  const moved = await readPage('/brand-kit');
  assert.match(moved, /noindex/);
  assert.match(moved, /href="\/for\/creators"/);
});

test('every explainer animation has a reduced-motion still', async () => {
  const css = await fs.readFile(path.join(root, 'app', 'explainers.css'), 'utf8');
  const animated = (css.match(/animation:/g) || []).length;
  assert.ok(animated >= 4, 'explainers animate');
  assert.ok(css.includes('prefers-reduced-motion: no-preference'), 'motion only when allowed');
  assert.doesNotMatch(css.replace(/@media [^{]*prefers-reduced-motion: no-preference\)[\s\S]*?\r?\n}\r?\n/g, ''), /animation:/, 'no animation runs outside the no-preference block');
  const prices = await readPage('/prices');
  // Conversion fixes (2 Oct): the tiles-join animation was removed (unreadable mid-animation; the value line says it).
  assert.doesNotMatch(prices, /class="ex ex-tiles"/);
});

test('the drafted free plan quotes only prices from offers.ts and picks the right rung', () => {
  const starter = draft.draftFreePlan({ name: 'Sam Example', trade: 'trades', problem: 'Missed calls' });
  assert.equal(starter.offer.id, 'starter');
  assert.match(starter.text, /Starter Automation: missed-call text-back \(£149\)/);
  assert.match(starter.text, /Guarantee:/);
  assert.match(starter.text, /Day 0: free demo and fixed price/);
  assert.doesNotMatch(starter.text, /£195|£795|£2,950/);

  const system = draft.draftFreePlan({ name: 'Sam', trade: 'trades', problem: 'Missed calls\nChasing quotes\nGetting more reviews' });
  assert.equal(system.offer.id, 'business-system');
  assert.match(system.text, /Business System: calls, quotes and reviews \(From £595\)/);

  const creator = draft.draftFreePlan({ name: 'Jo', trade: 'creators', systems: 'keyword-dm' });
  assert.equal(creator.offer.id, 'creator-starter');

  const asked = draft.draftFreePlan({ name: 'Jo', trade: 'salons-and-beauty', package: 'Business System' });
  assert.equal(asked.offer.id, 'business-system');
  assert.match(asked.text, /Business System: booking, reminders and rebooking/);

  const unknown = draft.draftFreePlan({ name: '', trade: '', problem: 'something odd' });
  assert.equal(unknown.offer.id, 'starter');
  assert.match(unknown.text, /^Hi there,/);
});

test('the free plan form sends the draft and the enquiry email shows it', async () => {
  const form = await fs.readFile(path.join(root, 'app', 'free-plan', 'leak-check-form.tsx'), 'utf8');
  assert.match(form, /draftFreePlan\(/);
  assert.match(form, /draft: `\$\{draft\.subject\}/);
  const api = await fs.readFile(path.join(root, 'api', 'enquiry.js'), 'utf8');
  assert.match(api, /Draft reply \(approve, tweak, send\)/);
  assert.match(api, /'draft'\]/);
  assert.match(api, /HUBSPOT_TOKEN/);
  assert.match(api, /FOLLOW_UP_EMAILS/);
});

test('scope sheet and buy-now intake pages export, noindexed, reading from offers.ts', async () => {
  const scope = await readPage('/scope-sheet');
  assert.match(scope, /noindex/);
  assert.match(scope, /Loading your scope sheet/);
  const start = await readPage('/start');
  assert.match(start, /noindex/);
  assert.match(start, /id="leak-check-form"/);
  assert.match(start, /Day 0/);
  const sheet = await fs.readFile(path.join(root, 'app', 'scope-sheet', 'scope-sheet.tsx'), 'utf8');
  assert.doesNotMatch(sheet, /£\s?\d/, 'scope sheet hard-codes no prices');
});

test('sales check: a plumber, a salon owner and a creator reach "Get my free demo" in two taps knowing the price', async () => {
  const home = await readPage('/');
  for (const [type, recipe] of [['trades', 'missed-call text-back'], ['appointments', 'reminders that cut no-shows'], ['creators', 'comment a word, get your guide']]) {
    // Tap 1: the tile on the homepage, which already shows a recipe and its price.
    const tile = new RegExp(`<a href="/for/${type}">[\\s\\S]*?<em>[^<]*${recipe}[^<]*£\\d+</em>`, 'i');
    assert.match(home, tile, `${type}: tile shows recipe and price`);
    // Tap 2: the main button on the type page.
    const page = await readPage(`/for/${type}`);
    assert.match(page, /Get my free demo</, `${type}: free plan button`);
    assert.match(page, /£149/, `${type}: starter price visible`);
  }
});
