import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';

// CRO Move 4 (18 Oct): "free demo" becomes "free preview" site-wide, with the honest
// one-line explanation, and the internal package labels lose their jargon. This test
// locks the offer name, the plain labels and the site copy so a future edit cannot
// quietly bring "free demo", "one-day set-up", "Keep It Running" or "Keep It Growing" back.

const root = process.cwd();
const out = path.join(root, 'out');

// Read the live values from the shared copy, exactly as the site renders them.
const modules = {};
for (const name of ['offers', 'site']) {
  const source = await readFile(`app/${name}.ts`, 'utf8');
  modules[name] = {};
  new Function('exports', 'require', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(modules[name], () => modules.site);
}
const { FREE_STEP, CARE_PLANS } = modules.offers;
const { MAIN_CTA } = modules.site;

/** The exact phrases retired on 18 Oct. Case-insensitive, so `Free Demo` is caught too. */
const RETIRED = /free demo|one-day set-?up|keep it running|keep it growing/i;

async function allExportedHtml(dir = out) {
  const pages = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) pages.push(...(await allExportedHtml(full)));
    else if (entry.name.endsWith('.html')) pages.push(full);
  }
  return pages;
}

test('the free first step is named "free preview", not "free demo"', () => {
  assert.equal(FREE_STEP.name, 'Free Preview & Fixed Price');
  assert.equal(FREE_STEP.short, 'free preview and price');
  assert.equal(MAIN_CTA, 'Get my free preview');
});

test('the free preview carries the honest one-line explanation', () => {
  assert.match(FREE_STEP.body, /built from a template on my own test setup/i);
  assert.match(FREE_STEP.body, /not on your apps yet/i);
});

test('the package labels are plain words, not internal speak', () => {
  assert.deepEqual(CARE_PLANS.map((plan) => plan.name), ['Care plan', 'Care plan plus']);
});

test('no exported page uses the retired wording', async () => {
  for (const file of await allExportedHtml()) {
    const html = await readFile(file, 'utf8');
    const match = html.match(RETIRED);
    assert.equal(match, null, `${path.relative(root, file)} still says "${match?.[0]}"`);
  }
});

test('the honest explanation is visible on the homepage, the free-plan page and the FAQ', async () => {
  for (const route of ['free-plan', 'faq']) {
    const html = await readFile(path.join(out, `${route}.html`), 'utf8');
    assert.match(html, /test set-?up/i, `${route} must explain the preview is built on a test setup`);
    assert.match(html, /preview/i, `${route} must name the free preview`);
  }
});
