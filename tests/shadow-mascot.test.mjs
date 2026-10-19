import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const exportRoot = path.join(root, 'out');

test('homepage Shadow cameo uses an accessible, genuinely transparent PNG', async () => {
  const html = await readFile(path.join(exportRoot, 'index.html'), 'utf8');
  assert.match(html, /class="s-shadow-cameo"/);
  assert.match(html, /src="\/shadow-mascot\.png"/);
  assert.match(html, /alt="A curled grey cat mascot keeping watch beside the example"/);
  assert.match(html, /Shadow: quality control, mostly naps\./);

  const png = await readFile(path.join(exportRoot, 'shadow-mascot.png'));
  assert.equal(png.subarray(1, 4).toString('ascii'), 'PNG');
  assert.equal(png.readUInt32BE(16), 900);
  assert.equal(png.readUInt32BE(20), 721);
  assert.equal(png[25], 6, 'PNG must use RGBA, not a flattened checkerboard');

  const css = await readFile(path.join(root, 'app/shadow-cameo.css'), 'utf8');
  assert.match(css, /prefers-reduced-motion: reduce/);
});
