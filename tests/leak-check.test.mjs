import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const exportRoot = path.join(root, 'out');

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

test('the Free Preview & Fixed Price has a dedicated shareable acquisition page', async () => {
  const html = await readPage('/free-plan');

  assert.match(html, /Free Preview &amp; Fixed Price/);
  assert.doesNotMatch(html, /Customer Journey Review|Booking &amp; Enquiry Check/);
  assert.match(html, /Tap what fits, then tell me where to send your demo\. No call needed\./);
  assert.match(html, /within 1 working day/i);
  assert.doesNotMatch(html, /5 working days/i);
  assert.match(html, /any UK business/);
  assert.doesNotMatch(html, /Nottingham/);
  assert.match(html, /EXAMPLE|>Example</);
  assert.match(html, /A fictional business/);
  assert.match(html, /This isn&#x27;t worth automating yet|This isn.t worth automating yet/);
  assert.match(html, /A fixed price, starting from £99/);
  assert.doesNotMatch(html, /hacked/i);
  assert.match(html, /cal\.com\/mazworks\/quick-chat/);
  assert.match(html, /rel="canonical" href="https:\/\/www\.mazworks\.uk\/free-plan"/);
});

test('the free plan form puts the problem taps first, with typing and the website optional', async () => {
  const html = await readPage('/free-plan');
  const form = /<form[^>]*id="leak-check-form"[\s\S]*?<\/form>/.exec(html)?.[0] || '';

  assert.ok(form, 'free check form should be present');
  for (const name of ['name', 'email', 'problem', 'website']) {
    assert.match(form, new RegExp(`name="${name}"`));
  }
  assert.match(form, /<input[^>]*name="website"(?![^>]*required)[^>]*>/, 'website is optional');
  // Chips need JavaScript, so the static HTML keeps the text box required for no-JS visitors;
  // the source drops it once hydrated, when a tap is enough.
  assert.match(form, /<textarea[^>]*name="problem"[^>]*required/, 'no-JS visitors must still describe the job');
  const source = await readFile(path.join(root, 'app', 'free-plan', 'leak-check-form.tsx'), 'utf8');
  assert.match(source, /required=\{!hydrated\}/);
  assert.ok(form.indexOf('mw-quick-picks') < form.indexOf('name="name"'), 'problem taps come before name and email');
  assert.doesNotMatch(form, /name="business"|name="nextStep"/);
  assert.match(form, />Get my free preview</);
});

test('the Leak Check reuses the resilient enquiry delivery path', async () => {
  const source = await readFile(path.join(root, 'app', 'free-plan', 'leak-check-form.tsx'), 'utf8');

  assert.match(source, /NATIVE_FORM_ENDPOINT/);
  assert.match(source, /sendPlanEnquiry/);
  assert.match(source, /buildRecoveryMailto/);
  assert.match(source, /_honey/);
  assert.match(source, /source/);
  assert.match(source, /role="status"/);
});

test('homepage routes its main CTA to the still-working dedicated preview form', async () => {
  const home = await readPage('/');
  const plan = await readPage('/free-plan');
  assert.match(home, /href="\/free-plan\?src=home-hero#leak-check-form"/);
  assert.match(home, /href="\/free-plan\?src=home-header#leak-check-form"/);
  assert.doesNotMatch(home, /id="hero-quick-form"|id="leak-check-form"/);
  assert.match(plan, /id="leak-check-form"/);
  assert.match(plan, /action="https:\/\/formsubmit\.co\/cdecd22760836a83422b51da0a853f94"/);
  assert.doesNotMatch(home.replace(/<[^>]+>/g, ' '), /leak check/i);
});

test('the dedicated free preview page retains resilient customer intake', async () => {
  const plan = await readPage('/free-plan');
  assert.match(plan, /id="leak-check-form"/);
  assert.match(plan, /method="post"/);
  assert.match(plan, /name="email"/);
  assert.match(plan, /name="name"/);
  assert.match(plan, /name="problem"/);
  assert.match(plan, /name="service"/);
  assert.match(plan, /name="_honey"/);
  const source = await readFile(path.join(root, 'app', 'free-plan', 'leak-check-form.tsx'), 'utf8');
  assert.match(source, /sendPlanEnquiry/);
  assert.match(source, /crypto\.randomUUID\(\)/);
});
