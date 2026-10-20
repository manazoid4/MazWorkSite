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

 test('homepage leads with the broad business outcome and real founder credibility', () => {
  const text = visibleText(main);
  assert.match(text, /Less hassle\.\s*Better business\./);
  assert.match(text, /Computer Science graduate/);
  assert.match(text, /five years/);
  assert.doesNotMatch(text, /Miss a call and they get a text with a booking link/);
});

test('homepage gives one clear route to the enquiry form', () => {
  const text = visibleText(main);
  assert.match(text, /Tell me what.s not working/);
  assert.match(main, /href="\/contact\?src=home#contact"/);
  assert.match(main, /href="\/contact\?src=home-close#contact"/);
});

test('homepage serves both audiences and labels its examples honestly', () => {
  assert.match(main, /href="\/local-businesses"/);
  assert.match(main, /href="\/professional-teams"/);
  assert.match(main, /href="\/work\/jobfilter"/);
  assert.match(main, /href="\/work\/scrap-finance-partners"/);
  assert.match(visibleText(main), /illustrative workflow/i);
  assert.match(visibleText(main), /synthetic data/i);
});
