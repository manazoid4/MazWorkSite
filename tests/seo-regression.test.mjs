import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { audit } from '../scripts/seo-audit.mjs';
import { attributionLine, cleanEnquirySource } from '../app/linkedin-source.ts';

const out = path.join(process.cwd(), 'out');
const page = (name) => readFile(path.join(out, name + '.html'), 'utf8').then((html) => html.replaceAll('<!-- -->', ''));

test('every exported page has one h1, a unique title and description, a correct canonical and working internal links', async () => {
  const { errors } = await audit();
  assert.deepEqual(errors, []);
});

test('Phase 2 landing pages are indexable, in the sitemap, linked from the site map and show shared prices', async () => {
  const sitemap = await readFile(path.join(out, 'sitemap.xml'), 'utf8');
  const siteMap = await page('site-map');
  const expectations = {
    'one-page-website': /£295/,
    'missed-call-text-back': /£99/,
    'website-cost': /From £1,295/,
  };
  for (const [route, price] of Object.entries(expectations)) {
    const html = await page(route);
    assert.match(html, price, `${route} should show its price from app/offers.ts`);
    assert.match(html, new RegExp(`rel="canonical" href="https://www\\.mazworks\\.uk/${route}"`));
    assert.doesNotMatch(html, /noindex/);
    assert.match(sitemap, new RegExp(`https://www\\.mazworks\\.uk/${route}<`));
    assert.match(siteMap, new RegExp(`href="/${route}"`), `${route} should be linked from /site-map`);
    assert.match(html, /href="\/contact\?src=[a-z-]+#contact"/, `${route} should have an enquiry path`);
    assert.doesNotMatch(html, /guarantee(d)? (a )?(top|first|number one)|\bAI\b/i);
  }
});

test('pages do not publish a residential town, address or personal email', async () => {
  for (const route of ['one-page-website', 'missed-call-text-back', 'website-cost', 'website-design']) {
    const html = await page(route);
    assert.doesNotMatch(html, /streetAddress|addressLocality|postalCode/);
    assert.doesNotMatch(html, /@(gmail|outlook|hotmail|yahoo)\./i);
  }
});

test('organic search visits are attributed and the new landing-page sources survive enquiry validation', () => {
  assert.equal(attributionLine('', 'https://www.google.com/'), 'referrer=organic-search');
  assert.equal(attributionLine('', 'https://www.google.co.uk/'), 'referrer=organic-search');
  assert.equal(attributionLine('', 'https://www.bing.com/search?q=x'), 'referrer=organic-search');
  assert.equal(attributionLine('', 'https://example.com/'), '');
  assert.equal(attributionLine('?utm_source=linkedin', 'https://www.google.com/'), 'source=linkedin; referrer=organic-search');
  for (const src of ['website-design', 'website-design-bottom', 'one-page-website', 'missed-call-text-back-bottom', 'website-cost']) {
    assert.equal(cleanEnquirySource(src), src);
  }
  assert.equal(cleanEnquirySource('made-up-source'), '');
});
