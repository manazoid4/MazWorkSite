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
  const teams = await page('professional-teams');
  for (const [html, route, source] of [[teams, 'professional-teams', 'professional-teams']]) {
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(html, /id="main-content"/);
    assert.match(html, new RegExp(`rel="canonical" href="https://www\\.mazworks\\.uk/${route}"`));
    assert.match(html, new RegExp(`/contact\\?src=${source}`));
    assert.match(html, /Get my free preview/);
  }
  assert.match(teams, /See what is due, what is late and what keeps going wrong\./);
  assert.match(teams, /See what's happening/);
  assert.match(teams, /Stay on top of the work/);
  assert.match(teams, /Find and fix the cause/);
  assert.match(teams, /Concept demo · made-up data/);
  assert.match(teams, /Synthetic data/);
  assert.match(teams, /Department performance/);
  assert.match(teams, /Deadlines and workload/);
  assert.match(teams, /Complaints are what I know best/);
  assert.match(teams, /cannot guarantee that an SLA will never be missed/);
  assert.match(teams, /\/contact\?src=professional-teams&amp;service=reporting#contact/);
  assert.match(teams, /Closed on time<\/dt><dd>94%<\/dd><span>102 of 108 completed/);
  assert.equal(Math.round(102 / 108 * 100), 94);

  const weeklyFlow = [...teams.matchAll(/aria-label="(\d+) received, (\d+) completed"/g)];
  assert.equal(weeklyFlow.reduce((sum, match) => sum + Number(match[1]), 0), 124);
  assert.equal(weeklyFlow.reduce((sum, match) => sum + Number(match[2]), 0), 108);
  assert.equal(20 + weeklyFlow.reduce((sum, match) => sum + Number(match[1]) - Number(match[2]), 0), 36);
  const workload = teams.match(/class="pt-workload"[\s\S]*?<h4>Open work by owner<\/h4>([\s\S]*?)<\/aside>/)?.[1];
  assert.ok(workload, 'workload breakdown is present');
  assert.equal([...workload.matchAll(/<strong>(\d+)<\/strong>/g)].reduce((sum, match) => sum + Number(match[1]), 0), 36);

  for (const label of ['Complaints Health Check', 'Post-Complaints Analysis &amp; Board Reporting']) assert.match(teams, new RegExp(label));
  assert.match(teams, /Fictional example for Northgate Advisory|invented/);
  assert.match(teams, /\/complaints\/sample\/health-check/);
  assert.match(teams, /\/complaints\/sample\/board-report/);
});
