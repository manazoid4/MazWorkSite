import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

// Source-level guards for the technical audit fixes (23 Oct). They read the
// source, so they run without a build.
const src = (file) => readFile(file, 'utf8');

test('sitewide title, description and schema match the current positioning', async () => {
  const seo = await src('app/seo.ts');
  assert.doesNotMatch(seo.match(/SITE_TITLE = .*/)[0] + seo.match(/SITE_DESCRIPTION = .*/)[0], /complaint/i);
  const layout = await src('app/layout.tsx');
  assert.match(layout, /'@type': 'WebSite'/);
  assert.doesNotMatch(layout, /ProfilePage/);
});

test('page titles do not repeat the brand the layout template adds', async () => {
  for (const file of ['app/proof/page.tsx', 'app/local-businesses/page.tsx']) {
    assert.doesNotMatch((await src(file)).match(/\n  title: .*/)[0], /Maz Works/, file);
  }
});

test('FAQ schema is its own block, not nested in the video Service', async () => {
  const page = await src('app/local-businesses/page.tsx');
  assert.match(page, /const faqSchema = \{[^}]*'@type': 'FAQPage'/);
  assert.doesNotMatch(page, /mainEntity: \{ '@type': 'FAQPage'/);
});

test('every job on /for has Service and FAQ JSON-LD', async () => {
  const jobs = await src('app/for/jobs-section.tsx');
  assert.match(jobs, /application\/ld\+json/);
  assert.match(jobs, /'@type': 'Service'/);
  assert.match(jobs, /'@type': 'FAQPage'/);
});

test('cafes-and-food has a parent customer type, so its /for tile gets a tag', async () => {
  const types = await src('app/customer-types.ts');
  assert.match(types, /niches: \[[^\]]*'cafes-and-food'/);
});

test('the receptionist contact link pre-fills the form', async () => {
  assert.match(await src('app/enquiry.ts'), /params\.get\('package'\) === AFTER_HOURS\.name/);
  assert.match(await src('app/demo-request-form.tsx'), /params\.get\('package'\)\) fill\('problem'/);
});

test('the calculator link points at the real Build fold', async () => {
  assert.match(await src('app/cost-calculator.tsx'), /href="#build"/);
  assert.match(await src('app/price-list.tsx'), /<Fold id="build"/);
});

test('sitemap has no stale 2 Oct dates on redesigned pages', async () => {
  const map = await src('app/sitemap.ts');
  for (const line of map.split('\n').filter((l) => /what-we-do|url: SITE_URL,|\/prices|\/for`/.test(l))) assert.doesNotMatch(line, /2026-10-02/, line);
});
