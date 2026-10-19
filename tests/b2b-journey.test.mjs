import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';
import { cleanEnquirySource, isEnquirySource, linkedInHref } from '../app/linkedin-source.ts';
import { attributionLine } from '../app/linkedin-source.ts';

// The LinkedIn → /b2b → assessment → booking journey (19 Oct 2026): the
// assessment arithmetic, the campaign labels that survive each hop, and the
// two built pages a visitor actually lands on.

const load = async (file, requireMap = {}) => {
  const exports = {};
  new Function('exports', 'require', ts.transpileModule(await readFile(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(exports, (name) => requireMap[name]);
  return exports;
};

const offers = await load('app/offers.ts');
const model = await load('app/b2b/assessment/model.ts', { '../../offers': offers });
const booking = await load('app/booking-link.ts', { './site': { BOOKING_URL: 'https://cal.com/mazworks/quick-chat' } });

const worst = {
  enquiries: 'lost', documents: 'scattered', complaints: 'unlogged',
  reporting: 'avoid', followup: 'nothing', repetition: 'high',
};
const joinedUp = {
  enquiries: 'owned', documents: 'portal', complaints: 'system',
  reporting: 'click', followup: 'sequence', repetition: 'low',
};

test('the assessment asks six questions and scores only what applies', () => {
  assert.equal(model.QUESTIONS.length, 6);
  assert.deepEqual(model.QUESTIONS.map((question) => question.id), ['enquiries', 'documents', 'complaints', 'reporting', 'followup', 'repetition']);
  assert.equal(model.isComplete(worst), true);
  assert.equal(model.isComplete({ enquiries: 'lost' }), false);
  assert.equal(model.assess(worst).score, 100);
  assert.equal(model.assess(joinedUp).score, 0);
  assert.equal(model.assess(worst).band.label, 'Firefighting');
  assert.equal(model.assess(joinedUp).band.label, 'Under control');
});

test('hours, the planning assumption and savings are plain arithmetic', () => {
  const result = model.assess(worst);
  assert.equal(result.weeklyHours, 33);
  assert.equal(result.yearHours, 1518);
  assert.equal(result.savedHours, 607); // 1518 × 40%, rounded
  assert.equal(result.savedValue, 24280); // 607h × £40
  assert.deepEqual(model.assess(worst, 50, 50), { ...result, savedHours: 759, savedValue: 37950 });
  assert.equal(model.assess({}).weeklyHours, 0);
  assert.equal(model.assess({}).recommendations.length, 0);
});

test('the first two fixes follow the biggest problem, with a real package and price', () => {
  const result = model.assess(worst);
  assert.equal(result.topArea, 'reporting');
  assert.deepEqual(result.recommendations.map((item) => item.area), ['reporting', 'complaints']);
  assert.equal(result.recommendations[0].name, offers.COMPLAINT_PACKAGES[1].name);
  assert.equal(result.recommendations[0].price, offers.COMPLAINT_PACKAGES[1].price);
  assert.equal(result.recommendations[1].name, offers.COMPLAINT_PACKAGES[0].name);
  assert.equal(result.firstFixes.length, 3);
  assert.ok(result.firstFixes.every((fix) => fix.length > 10));

  const none = model.assess(joinedUp);
  assert.equal(none.topArea, null);
  assert.deepEqual(none.recommendations, []);
  assert.deepEqual(none.firstFixes, []);
});

test('the plain-text summary keeps the score, the sum and the first step', () => {
  const text = model.summarise(worst, 40, 40);
  assert.match(text, /Score 100\/100 \(Firefighting\)/);
  assert.match(text, /33h\/week, 1518h\/year/);
  assert.match(text, /Planning assumption 40%: 607h\/year, about £24,280 at £40\/h/);
  assert.match(text, /Post-Complaints Analysis & Board Reporting/);
  assert.match(text, /First fixes: Agree the five numbers/);
  assert.doesNotMatch(text, /\bAI\b|guarantee|fully compliant/i);
});

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

const out = path.join(process.cwd(), 'out');
const page = async (route) => {
  for (const candidate of [path.join(out, `${route}.html`), path.join(out, route, 'index.html')]) {
    try { return (await readFile(candidate, 'utf8')).replaceAll('<!-- -->', ''); } catch { /* try next shape */ }
  }
  throw new Error(`Missing static page ${route}`);
};

test('the built B2B journey shows both actions and the assessment', async () => {
  const b2b = await page('b2b');
  const assessment = await page('b2b/assessment');
  const sitemap = await readFile(path.join(out, 'sitemap.xml'), 'utf8');

  assert.match(sitemap, /\/b2b\/assessment</);
  assert.match(b2b, /Get a Free Business Assessment/);
  assert.match(b2b, /Book a 15-Minute Call/);
  assert.match(b2b, /href="\/b2b\/assessment\?src=b2b-assessment"/);
  assert.match(b2b, /Your team is losing hours to admin/);
  assert.match(b2b, /No working, no invoice/);
  assert.match(assessment, /Find the admin costing you most/);
  assert.match(assessment, /Six questions/);
  assert.match(assessment, /before you share a contact detail/);
  assert.doesNotMatch((b2b + assessment).replace(/<script[\s\S]*?<\/script>/g, ''), /\bAI\b|ai assistant|ai agent|fully compliant|guaranteed/i);
});
