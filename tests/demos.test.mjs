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

// 22 Oct audit: the bigger-build section left /after-hours-receptionist so the page sells only the receptionist.
test('the receptionist page no longer carries the bigger-build section', async () => {
  const page = await readPage('/after-hours-receptionist');
  assert.doesNotMatch(page, /id="bigger-builds"|Bigger build\?/);
});

test('changes after go-live are fenced so they never become free new work', async () => {
  // Said once, on /prices (polish, 2 Oct).
  const demos = await readPage('/prices');
  assert.match(demos, /Priced first, so it stays fair/);
  assert.match(demos, /A new page, task or feature: I price it first/);
  assert.match(demos, /fixed free for 90 days/);
  assert.match(demos, /up to two rounds/);
});

test('demos page builds credibility without fabricated client counts or invented proof', async () => {
  const demos = await readPage('/after-hours-receptionist');
  assert.doesNotMatch(demos, /\b\d+\+? clients\b|trusted by|hundreds of|dozens of|five-star clients|client logos/i);
  assert.doesNotMatch(demos, /20 seconds|type your business name/i, 'the old self-serve demo is gone');
});