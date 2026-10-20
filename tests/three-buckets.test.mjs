import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const buckets = await readFile(new URL('../app/three-buckets.tsx', import.meta.url), 'utf8');
const prices = await readFile(new URL('../app/prices/page.tsx', import.meta.url), 'utf8');
const priceList = await readFile(new URL('../app/price-list.tsx', import.meta.url), 'utf8');

test('the shared third bucket consistently describes feedback, reporting and improvement', () => {
  assert.match(buckets, /purpose: 'Use feedback and reporting to understand what needs to improve\.'/);
  assert.match(buckets, /examples: \['Dashboards, KPIs and deadlines', 'Customer feedback and complaints', 'Improvement actions'\]/);
  assert.match(buckets, /href: '\/professional-teams'/);
  assert.match(buckets, /Reporting and improvement: quoted to scope/);
  assert.doesNotMatch(buckets, /CARE_PLANS|Care \$\{/);
});

test('prices links the third bucket to professional improvement and labels optional maintenance separately', () => {
  assert.match(prices, /<li id="keep-improve"><strong>Keep &amp; Improve<\/strong>[\s\S]*?Dashboards, reporting and complaints improvement: quoted to scope\.[\s\S]*?href="\/professional-teams"/);
  assert.match(prices, /Need care or maintenance\?[\s\S]*?href="#extras">See options/);
  assert.match(priceList, /<Fold id="extras" title="Small set-ups, add-ons and care">/);
  assert.match(priceList, /<div className="s-extras-care" id="care">/);
});

test('the shared bucket support link sits after the bucket list and reaches optional maintenance', () => {
  const listEnd = buckets.indexOf('</ol>');
  const support = buckets.indexOf('See optional care and maintenance support');
  assert.ok(listEnd >= 0 && support > listEnd);
  assert.match(buckets, /href="\/prices#extras"/);
});
