import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const out = path.join(root, 'out');

async function readPage(route) {
  const name = route.replace(/^\//, '');
  for (const candidate of [path.join(out, `${name}.html`), path.join(out, name, 'index.html')]) {
    try { return (await readFile(candidate, 'utf8')).replaceAll('<!-- -->', ''); } catch {}
  }
  throw new Error(`Missing static page for ${route}`);
}

// 30 Sep (Maz): the free preview comes after a call, arrives by a date agreed on
// the call, and is followed by the full plan. Offer v10 (2 Oct): then 30 days of
// tweaks and a 90-day fix promise, never "unlimited changes".
test('the bigger-build demos page explains the call-first route and books a call', async () => {
  const [home, demos, sitemap] = await Promise.all([readPage('/'), readPage('/demos'), readFile(path.join(out, 'sitemap.xml'), 'utf8')]);
  assert.match(home, /href="\/demos"[^>]*>[^<]*bigger build demos/i);
  assert.match(demos, /Book a 15-minute call/);
  assert.match(demos, /date (we agree|you get it|agreed on the call)/i);
  assert.match(demos, /Nothing to pay yet/);
  assert.match(demos, /href="https:\/\/cal\.com\/mazworks\/quick-chat\?utm_source=demos"/);
  assert.match(demos, /30 days of tweaks/);
  assert.doesNotMatch(demos, /unlimited/i);
  assert.match(sitemap, /\/demos/);
});

test('changes after go-live are fenced so they never become free new work', async () => {
  // Said once, on /prices (polish, 2 Oct); /demos links there.
  assert.match(await readPage('/demos'), /href="\/prices#next"/);
  const demos = await readPage('/prices');
  assert.match(demos, /Priced first, so it stays fair/);
  assert.match(demos, /A new page, task or feature: I price it first/);
  assert.match(demos, /fixed free for 90 days/);
  assert.match(demos, /up to two rounds/);
});

test('demos page builds credibility without fabricated client counts or invented proof', async () => {
  const demos = await readPage('/demos');
  assert.doesNotMatch(demos, /\b\d+\+? clients\b|trusted by|hundreds of|dozens of|five-star clients|client logos/i);
  assert.doesNotMatch(demos, /20 seconds|type your business name/i, 'the old self-serve demo is gone');
});