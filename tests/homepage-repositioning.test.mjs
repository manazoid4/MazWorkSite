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

test('homepage leads with the recurring-problem idea and real founder credibility', async () => {
  const text = visibleText(main);
  assert.match(text, /Less hassle\. Better business\./);
  assert.match(text, /find the pattern behind the problem/);
  assert.match(text, /five years in finance handling complaints/);
  assert.match(visibleText(await readFile(path.join(root, 'out', 'about.html'), 'utf8')), /Computer Science graduate/);
  assert.doesNotMatch(text, /Miss a call and they get a text with a booking link/);
});

test('homepage gives one clear route to the enquiry form and one to the tools', () => {
  const text = visibleText(main);
  assert.match(text, /Get my free preview/);
  assert.match(main, /href="\/contact\?src=home#contact"/);
  assert.match(main, /href="\/tools"/);
  assert.match(main, /id="home-enquiry-title"/);
  assert.match(main, /name="problem"/);
});

test('homepage covers the four areas, both audiences and labels its examples honestly', () => {
  assert.match(main, /href="\/what-we-do"/);
  assert.match(main, /href="\/local-businesses"/);
  assert.match(main, /href="\/professional-teams"/);
  assert.match(main, /href="https:\/\/jobfilter\.uk\/find-jobs"/);
  assert.doesNotMatch(main, /scrap-finance-partners/);
  const text = visibleText(main);
  assert.match(text, /Internal project/);
  assert.match(text, /Interactive concept demo/);
  assert.match(text, /No real reservation is made/);
  assert.doesNotMatch(main, /mw-home-demo|Illustrative workflow|A customer gets in touch/);
  assert.match(text, /synthetic data/i);
});
