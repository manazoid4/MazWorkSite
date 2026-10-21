import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const { redirects } = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const bySource = new Map(redirects.map((r) => [r.source, r]));

// Routes removed in the 2026-10 site unity. /receptionist-demo* stays a live page (mic Permissions-Policy is path based).
const REMOVED = [
  '/free-plan', '/start', '/scope-sheet', '/refer', '/video', '/managed-presence', '/missed-calls-calculator',
  '/content-day', '/demos', '/b2b', '/b2b/assessment', '/complaints', '/complaints-improvement', '/audit',
  '/solutions', '/services', '/lab', '/linkedin', '/brag', '/brand-kit',
];
const isRemoved = (path) => REMOVED.some((r) => path === r || path.startsWith(`${r}/`));

test('every removed route has a permanent redirect', () => {
  for (const route of REMOVED) {
    const r = bySource.get(route);
    assert.ok(r, `${route} has no redirect`);
    assert.equal(r.permanent, true, `${route} is not permanent`);
  }
  assert.equal(bySource.size, redirects.length, 'duplicate redirect sources');
});

test('no redirect points at a removed route', () => {
  for (const { source, destination } of redirects) {
    const path = destination.split(/[?#]/)[0] || '/';
    assert.ok(!isRemoved(path), `${source} -> ${destination} is itself removed`);
  }
});
