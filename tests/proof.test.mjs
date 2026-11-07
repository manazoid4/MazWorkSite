import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

// Portfolio scope (7 Nov): only JobFilter, the live client site and Nod,
// with Nod clearly labelled in development. No invented client results or quotes.
const exportRoot = path.join(process.cwd(), 'out');

async function readPage(route) {
  const name = route === '/' ? 'index' : route.replace(/^\//, '');
  for (const candidate of [
    path.join(exportRoot, `${name}.html`),
    path.join(exportRoot, name, 'index.html'),
  ]) {
    try {
      return (await readFile(candidate, 'utf8')).replaceAll('<!-- -->', '');
    } catch {
      // Support both Next.js static-export path shapes.
    }
  }
  throw new Error(`Missing static page for ${route}`);
}

test('/proof is live, short, shows real work and has no founding offer', async () => {
  const html = await readPage('/proof');

  assert.match(html, /A few things worth showing\./);
  for (const label of ['Real client work', 'Internal project']) assert.match(html, new RegExp(label), label);
  for (const name of ['JobFilter', 'Scrap Finance Partners', 'Currently building: Nod']) assert.match(html, new RegExp(name), name);
  assert.match(html, /early hardware build, not a finished product/);
  assert.doesNotMatch(html, /OpenFlowKit|Agent Nudge|Khutba\.io|MAZ Pocket|Maz Works Objects/);
  assert.doesNotMatch(html, /founding|founder’s discount/i);
  assert.match(html, /href="\/contact[^"]*">Get my free preview</);
});

test('/proof makes no invented proof claims', async () => {
  const html = await readPage('/proof');
  for (const invented of [
    /\b\d+ (clients|businesses|customers) (use|trust|rely)/i,
    /\b\d+% (more|fewer|less|faster|higher)/i,
    /award[- ]winning/i,
    /trusted by \d+/i,
  ]) {
    assert.doesNotMatch(html, invented, `invented proof on /proof: ${invented}`);
  }
});

test('/proof is reachable: linked from the footer, homepage and sitemap', async () => {
  const sitemap = await readFile(path.join(exportRoot, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /\/proof</);
  const home = await readPage('/');
  assert.match(home, /href="\/proof"/);
  const footerSnippet = home.slice(home.indexOf('mw-footer-links'));
  assert.match(footerSnippet, /href="\/proof">My work</);
});
