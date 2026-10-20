import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const exportRoot = path.join(root, 'out');

test('the removed homepage workflow no longer renders Shadow; the transparent asset stays valid', async () => {
  const html = await readFile(path.join(exportRoot, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /class="s-shadow-cameo"|shadow-mascot\.png|Shadow: quality control/);

  const png = await readFile(path.join(exportRoot, 'shadow-mascot.png'));
  assert.equal(png.subarray(1, 4).toString('ascii'), 'PNG');
  assert.equal(png.readUInt32BE(16), 900);
  assert.equal(png.readUInt32BE(20), 721);
  assert.equal(png[25], 6, 'PNG must use RGBA, not a flattened checkerboard');

  const css = await readFile(path.join(root, 'app/shadow-cameo.css'), 'utf8');
  assert.match(css, /prefers-reduced-motion: reduce/);
});
