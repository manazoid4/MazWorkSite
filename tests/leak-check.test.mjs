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
  const html = await readPage('/contact');

  assert.match(html, /Free Preview &amp; Fixed Price/);
  assert.doesNotMatch(html, /Customer Journey Review|Booking &amp; Enquiry Check/);
  assert.match(html, /id="free-preview"/);
  assert.match(html, /A free preview and fixed price/);
  assert.match(html, /within 1 working day/i);
  assert.doesNotMatch(html, /5 working days/i);
  assert.match(html, /any UK business/);
  assert.doesNotMatch(html, /Nottingham/);
  assert.match(html, /EXAMPLE|>Example</);
  assert.match(html, /A fictional business/);
  assert.match(html, /This isn&#x27;t worth automating yet|This isn.t worth automating yet/);
  assert.match(html, /A fixed price \(one job starts from £99\)/);
  assert.doesNotMatch(html, /hacked/i);
  assert.match(html, /cal\.com\/mazworks\/quick-chat/);
  assert.match(html, /rel="canonical" href="https:\/\/www\.mazworks\.uk\/contact"/);
});

test('the one contact form keeps the free preview as a visible choice, with the business optional', async () => {
  const html = await readPage('/contact');
  const form = /<form[^>]*id="leak-check-form"[\s\S]*?<\/form>/.exec(html)?.[0] || '';

  assert.ok(form, 'free check form should be present');
  for (const name of ['name', 'email', 'problem', 'business']) {
    assert.match(form, new RegExp(`name="${name}"`));
  }
  assert.match(form, /<input[^>]*name="business"(?![^>]*required)[^>]*>/, 'business is optional');
  assert.match(form, /<textarea[^>]*name="problem"[^>]*required/, 'the job description is required');
  assert.match(form, /name="nextStep" value="A free preview and fixed price"/);
  assert.match(form, />Send enquiry</);
});

test('the contact form reuses the resilient enquiry delivery path', async () => {
  const source = await readFile(path.join(root, 'app', 'demo-request-form.tsx'), 'utf8');

  assert.match(source, /NATIVE_FORM_ENDPOINT/);
  assert.match(source, /sendPlanEnquiry/);
  assert.match(source, /buildRecoveryMailto/);
  assert.match(source, /_honey/);
  assert.match(source, /source/);
  assert.match(source, /role="status"/);
});

test('homepage and shared navigation make the main enquiry easy while preserving the free preview', async () => {
  const home = (await readPage('/')).replace(/&#x27;/g, "'");

  assert.match(home, /class="mw-nav-cta" href="\/contact\?src=nav#contact"[^>]*>Free preview/);
  assert.match(home, /href="\/contact\?src=home#contact">Get my free preview/);
  assert.doesNotMatch(home, /Miss calls while you work|answers them in your business name/);
  assert.doesNotMatch(home, /id="hero-quick-form"|id="leak-check-form"/);
});

test('the main enquiry form stays short and does not require a service choice', async () => {
  const html = await readPage('/contact');
  const formSource = await readFile(new URL('../app/demo-request-form.tsx', import.meta.url), 'utf8');
  const form = /<form[^>]*class="mw-demo-form"[\s\S]*?<\/form>/.exec(html)?.[0] || '';
  assert.ok(form, 'the shared enquiry form is present');
  for (const name of ['name', 'email', 'problem']) assert.match(form, new RegExp(`name="${name}"`));
  assert.match(form, /No service choice needed/);
  assert.match(form, /Optional details/);
  assert.match(form, /name="_honey"/);
  assert.match(form, /role="alert"/);
  assert.match(formSource, /Nothing you typed has been lost/);
});
