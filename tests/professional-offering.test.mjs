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

test('professional team routes export clear, factual pages with the agreed enquiry paths', async () => {
  const [teams, complaints] = await Promise.all([page('professional-teams'), page('complaints-improvement')]);
  for (const [html, route, source] of [[teams, 'professional-teams', 'professional-teams'], [complaints, 'complaints-improvement', 'complaints-improvement']]) {
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(html, /id="main-content"/);
    assert.match(html, new RegExp(`rel="canonical" href="https://www\\.mazworks\\.uk/${route}"`));
    assert.match(html, new RegExp(`/contact\\?src=${source}`));
    assert.match(html, /Tell me what's not working/);
  }
  for (const label of ['Complaints Health Check', 'Reporting &amp; Oversight', 'Improvement &amp; Implementation']) assert.match(complaints, new RegExp(label));
  assert.match(complaints, /Quoted to scope/);
  assert.deepEqual([...complaints.matchAll(/<p class="b2b-price">([^<]+)<\/p>/g)].map((match) => match[1]), ['Quoted to scope', 'Quoted to scope', 'Quoted to scope']);
  assert.match(complaints, /Fictional example for Northgate Advisory/);
  assert.match(complaints, /Synthetic data disclaimer/);
  assert.match(complaints, /scope and the quality, completeness and consistency of the anonymised data/i);
  assert.match(complaints, /\/complaints\/sample\/health-check/);
  assert.match(complaints, /\/complaints\/sample\/board-report/);
});
