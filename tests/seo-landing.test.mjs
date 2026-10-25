import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = path.join(process.cwd(), 'out');

async function readExportedPage(route) {
  for (const file of [path.join(root, route + '.html'), path.join(root, route, 'index.html')]) {
    try { return await readFile(file, 'utf8'); } catch { /* Next static export supports both layouts. */ }
  }
  throw new Error('Missing exported route /' + route);
}

test('website design service page is discoverable with honest local metadata and a working enquiry path', async () => {
  const page = await readExportedPage('website-design');
  const home = await readExportedPage('index');
  const local = await readExportedPage('local-businesses');
  const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');

  assert.match(page, /<title>Website Design in Derbyshire &amp; Nottingham \| Maz Works<\/title>/);
  assert.match(page, /rel="canonical" href="https:\/\/www\.mazworks\.uk\/website-design"/);
  assert.match(page, /<h1[^>]*>Website design for small businesses in Derbyshire and Nottingham\./);
  assert.match(page, /href="\/contact\?src=website-design#contact"/);
  assert.match(page, /From £1,295/);
  assert.match(page, /no one can guarantee|Nobody can guarantee/i);
  assert.match(home, /href="\/website-design"/);
  assert.match(local, /href="\/website-design"/);
  assert.match(sitemap, /https:\/\/www\.mazworks\.uk\/website-design/);
});
