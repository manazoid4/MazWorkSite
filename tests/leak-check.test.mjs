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

test('homepage and shared navigation send the free first step to the dedicated page', async () => {
  const home = await readPage('/');

  // The homepage carries the check form itself; shared navigation points at the dedicated page.
  assert.match(home, /id="check"/);
  assert.match(home, /id="leak-check-form"/);
  // CRO Move 3 (18 Oct): the hero two-field start posts where /free-plan posts.
  assert.match(home, /id="hero-quick-form"/);
  assert.match(home, /action="https:\/\/formsubmit\.co\/cdecd22760836a83422b51da0a853f94"/);
  assert.match(home, /href="\/free-plan\?src=nav#leak-check-form">Free preview</);
  // One name for the free first step everywhere (29 Sep, renamed 18 Oct): "free preview", never "leak check" in visible copy.
  assert.doesNotMatch(home.replace(/<[^>]+>/g, ' '), /leak check/i);
  assert.doesNotMatch(home, /\?service=leak-check#contact/);
});

test('CRO Move 3: the hero start asks email before name and posts where /free-plan posts', async () => {
  const home = await readPage('/');
  const form = /<form[^>]*id="hero-quick-form"[\s\S]*?<\/form>/.exec(home)?.[0] || '';
  assert.ok(form, 'the hero two-field start should be present');
  assert.match(form, /method="post"/);
  assert.match(form, /action="https:\/\/formsubmit\.co\/cdecd22760836a83422b51da0a853f94"/, 'the hero posts to the same place as /free-plan');
  // Email first, then name (audit Move 3): the shorter ask leads with the reply address.
  assert.ok(form.indexOf('name="email"') < form.indexOf('name="name"'), 'email comes before name');
  // /api/enquiry rejects a body without a non-empty problem and a known service; the hero supplies both hidden.
  assert.match(form, /name="problem" value="[^"]+"/);
  assert.match(form, /name="service" value="Free Preview &amp; Fixed Price"/);
  assert.match(form, /name="_honey"/);
  assert.match(form, />Get my free preview</);
  // No personal phone number is ever published in the public hero.
  assert.doesNotMatch(form, /(?:\+44|\b0\d{3,4}\s?\d{6,7}\b)/);
  const source = await readFile(path.join(root, 'app', 'hero-quick-form.tsx'), 'utf8');
  assert.match(source, /sendPlanEnquiry/);
  assert.match(source, /crypto\.randomUUID\(\)/);
  assert.match(source, /id="hero-quick-form"/);
});
