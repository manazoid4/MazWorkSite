import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const { redirects } = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
// Query-matching rules (`has`) share a source with the plain rule; the plain rule is the one the map holds.
const bySource = new Map(redirects.filter((r) => !r.has).map((r) => [r.source, r]));

// Routes removed in the 2026-10 site unity. /receptionist-demo* stays a live page (mic Permissions-Policy is path based).
const REMOVED = [
  '/free-plan', '/start', '/scope-sheet', '/refer', '/video', '/managed-presence', '/missed-calls-calculator',
  '/content-day', '/demos', '/b2b', '/b2b/assessment', '/complaints', '/complaints-improvement', '/audit',
  '/solutions', '/services', '/lab', '/linkedin', '/brag', '/brand-kit',
  // Site reimagination (25 Oct 2026): the MAZos stub and the changelog are merged into /proof.
  '/mazos', '/whats-new',
];
const isRemoved = (path) => REMOVED.some((r) => path === r || path.startsWith(`${r}/`));

test('every removed route has a permanent redirect', () => {
  for (const route of REMOVED) {
    const r = bySource.get(route);
    assert.ok(r, `${route} has no redirect`);
    assert.equal(r.permanent, true, `${route} is not permanent`);
  }
  assert.equal(new Set(redirects.map((r) => r.source + JSON.stringify(r.has ?? ''))).size, redirects.length, 'duplicate redirect sources');
});

test('no redirect points at a removed route', () => {
  for (const { source, destination } of redirects) {
    const path = destination.split(/[?#]/)[0] || '/';
    assert.ok(!isRemoved(path), `${source} -> ${destination} is itself removed`);
  }
});

test('query-carrying redirects come before the generic ones', () => {
  const idx = (source, key) => redirects.findIndex((r) => r.source === source && r.has?.some((h) => h.type === 'query' && h.key === key));
  const generic = (source) => redirects.findIndex((r) => r.source === source && !r.has);
  const cases = [
    ['/start', 'package', '/contact?intent=setup&package=:pkg'],
    ['/free-plan', 'src', '/contact?intent=preview&src=:src'],
    ['/free-plan', 'trade', '/contact?intent=preview&trade=:trade'],
  ];
  for (const [source, key, destination] of cases) {
    const i = idx(source, key);
    assert.ok(i >= 0, `${source}?${key} rule missing`);
    assert.equal(redirects[i].destination, destination);
    assert.ok(i < generic(source), `${source}?${key} rule must precede the generic ${source} rule`);
  }
});

test('merged pages land on the page that now holds their content (25 Oct 2026)', () => {
  assert.equal(bySource.get('/mazos')?.destination, '/proof#built');
  assert.equal(bySource.get('/whats-new')?.destination, '/proof');
});
