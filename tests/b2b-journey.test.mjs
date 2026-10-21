import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
import { cleanEnquirySource, isEnquirySource, linkedInHref } from '../app/linkedin-source.ts';
import { attributionLine } from '../app/linkedin-source.ts';

// Campaign labels that survive each hop to booking. The assessment page and its
// arithmetic were removed in the site-unity pass (/b2b folded into /professional-teams).

const load = async (file, requireMap = {}) => {
  const exports = {};
  new Function('exports', 'require', ts.transpileModule(await readFile(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(exports, (name) => requireMap[name]);
  return exports;
};

const booking = await load('app/booking-link.ts', { './site': { BOOKING_URL: 'https://cal.com/mazworks/quick-chat' } });

test('the assessment is an accepted enquiry source, including its direct fallback', () => {
  assert.equal(isEnquirySource('b2b-assessment'), true);
  assert.equal(cleanEnquirySource('b2b-assessment'), 'b2b-assessment');
  assert.equal(cleanEnquirySource('direct (b2b-assessment)'), 'direct (b2b-assessment)');
  assert.equal(cleanEnquirySource('li-3 → b2b-assessment'), 'li-3 → b2b-assessment');
  assert.equal(cleanEnquirySource('direct (b2b-assessment) → b2b-assessment'), '');
  assert.equal(cleanEnquirySource('b2b-assessment-extra'), '');
});

test('a LinkedIn tag reaches the assessment link, and a plain UTM line survives to booking', () => {
  assert.equal(linkedInHref('/b2b/assessment?src=b2b-assessment', '?src=linkedin-post'), '/b2b/assessment?src=linkedin-post');
  assert.equal(linkedInHref('/b2b/assessment?src=b2b-assessment', ''), '/b2b/assessment?src=b2b-assessment');
  assert.equal(linkedInHref('/b2b/assessment?src=b2b-assessment', '?src=for-trades'), '/b2b/assessment?src=b2b-assessment');

  const line = attributionLine('?utm_source=linkedin&utm_medium=social&utm_campaign=b2b-post-01', 'https://www.linkedin.com/feed/');
  assert.equal(line, 'source=linkedin; medium=social; campaign=b2b-post-01; referrer=linkedin');

  const url = new URL(booking.bookingUrl('/b2b/assessment', 'Business assessment', line, 'b2b'));
  assert.equal(url.origin + url.pathname, 'https://cal.com/mazworks/quick-chat');
  assert.equal(url.searchParams.get('utm_source'), 'linkedin');
  assert.equal(url.searchParams.get('utm_medium'), 'social');
  assert.equal(url.searchParams.get('utm_campaign'), 'b2b-post-01');
  assert.match(url.searchParams.get('notes'), /From \/b2b\/assessment/);
  assert.match(url.searchParams.get('notes'), /Interested in: Business assessment/);
  assert.match(url.searchParams.get('notes'), /Campaign: source=linkedin/);
});

test('booking drops forged labels and falls back to the internal campaign tag', () => {
  const forged = 'source=<script>; medium=ok; campaign=x\nBcc: evil@example.com; content=' + 'x'.repeat(60);
  const url = new URL(booking.bookingUrl('/b2b', '', forged, 'li-3'));
  assert.equal(url.searchParams.get('utm_source'), 'li-3');
  assert.equal(url.searchParams.get('utm_medium'), 'ok');
  assert.equal(url.searchParams.get('utm_campaign'), null);
  assert.equal(url.searchParams.get('utm_content'), null);
  assert.doesNotMatch(url.href, /script|evil|xxxx/i);
  assert.equal(new URL(booking.bookingUrl('/prices', '', '', '')).searchParams.get('utm_source'), null);
});
