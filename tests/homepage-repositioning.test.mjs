import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(path.join(root, 'out', 'index.html'), 'utf8');
const main = html.slice(html.indexOf('<main'), html.lastIndexOf('</main>'));
const visibleText = (source) => source
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z#0-9]+;/gi, ' ')
  .replace(/\s+/g, ' ');

 test('homepage leads with the broad business outcome and real founder credibility', async () => {
  const text = visibleText(main);
  assert.match(text, /Less hassle\.\s*Better\s+business\./);
  assert.match(text, /thousands of angry customers/);
  assert.match(visibleText(await readFile(path.join(root, 'out', 'about.html'), 'utf8')), /Computer Science graduate/);
  assert.doesNotMatch(text, /Miss a call and they get a text with a booking link/);
});

test('homepage gives one clear route to the enquiry form', () => {
  const text = visibleText(main);
  assert.match(text, /Get my free preview/);
  assert.match(main, /href="\/contact\?src=home#contact"/);
  assert.match(main, /id="home-enquiry-title"/);
  assert.match(main, /name="problem"/);
});

test('homepage serves both audiences and labels its examples honestly', () => {
  assert.match(main, /href="\/local-businesses"/);
  assert.match(main, /href="\/professional-teams"/);
  assert.match(main, /href="\/work\/jobfilter"/);
  assert.doesNotMatch(main, /scrap-finance-partners/);
  assert.match(visibleText(main), /Help at every part of the customer journey/i);
  assert.doesNotMatch(main, /mw-home-demo|Illustrative workflow|A customer gets in touch/);
  assert.match(visibleText(main), /synthetic data/i);
});
