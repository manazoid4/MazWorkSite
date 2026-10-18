import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

// CRO Move 2 (18 Oct): the proof gap. No real quotes exist yet, so the rule is
// honesty: show the work you can open, say plainly what is not here, and offer
// the Founding Client deal. This locks that rule so no later edit invents proof.
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

test('/proof is live, honest about the gap, and offers the Founding Client deal', async () => {
  const html = await readPage('/proof');

  assert.match(html, /Proof: what’s real, and what isn’t\./);
  // The real, openable work.
  assert.match(html, /JobFilter/);
  assert.match(html, /Scrap Finance Partners/);
  // The gap is named, not papered over.
  assert.match(html, /no published client quotes yet/i);
  assert.match(html, /I would rather show you none than make one up/i);
  // The Founding Client deal: bounded, in writing, with an opt-out.
  assert.match(html, /Founding Client offer/);
  assert.match(html, /founder’s discount/i);
  assert.match(html, /agreed in writing in your scope sheet/i);
  assert.match(html, /You can say no to any of the three/i);
  // The guardrail is stated and the main action is the free plan.
  assert.match(html, /Never invent a client, a logo, a result or a number\./);
  assert.match(html, /href="\/free-plan#leak-check-form">Get my free demo</);
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
  assert.match(footerSnippet, /href="\/proof">Proof</);
});
