import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

// Source-level guards for recovered technical audit fixes. They read the source, so they run without a build.
const src = (file) => readFile(file, 'utf8');

test('sitewide title, description and schema match the current positioning', async () => {
  const seo = await src('app/seo.ts');
  assert.doesNotMatch(seo.match(/SITE_TITLE = .*/)[0] + seo.match(/SITE_DESCRIPTION = .*/)[0], /complaint/i);
  const layout = await src('app/layout.tsx');
  assert.match(layout, /'@type': 'WebSite'/);
  assert.doesNotMatch(layout, /ProfilePage/);
});

test('FAQ schema is its own block, not nested in the video Service', async () => {
  const page = await src('app/local-businesses/page.tsx');
  assert.match(page, /const faqSchema = \{[^}]*'@type': 'FAQPage'/);
  assert.doesNotMatch(page, /mainEntity: \{ '@type': 'FAQPage'/);
});

test('every job on /for has Service and FAQ JSON-LD, escaped for script tags', async () => {
  const jobs = await src('app/for/jobs-section.tsx');
  assert.match(jobs, /application\/ld\+json/);
  assert.match(jobs, /'@type': 'Service'/);
  assert.match(jobs, /'@type': 'FAQPage'/);
  assert.match(jobs, /replace\(\/<\/g, .{1,3}u003c/);
});

test('cafes-and-food has a parent customer type, so its /for tile gets a tag', async () => {
  assert.match(await src('app/customer-types.ts'), /niches: \[[^\]]*'cafes-and-food'/);
});

test('the receptionist contact link pre-fills the form', async () => {
  assert.match(await src('app/enquiry.ts'), /params\.get\('package'\) === AFTER_HOURS\.name/);
  assert.match(await src('app/demo-request-form.tsx'), /params\.get\('package'\)\) fill\('problem'/);
});

test('the example metrics and queue table are valid, keyboard-reachable markup', async () => {
  const teams = await src('app/professional-teams/page.tsx');
  assert.doesNotMatch(teams, /<\/dd><span>/);
  assert.match(teams, /className="pt-table-wrap" role="region" aria-label="[^"]+" tabIndex=\{0\}/);
});
