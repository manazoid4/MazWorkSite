import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const exportRoot = path.join(root, 'out');

async function readPage(route) {
  const name = route.replace(/^\//, '');
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

/** Shared nav chrome (phone menu panel, grouped footer) is the same on every page, so page word budgets skip it. */
function stripNavChrome(html) {
  return html
    .replace(/<div class="mw-menu-panel"[\s\S]*?<\/ul><\/div><\/div>/, ' ')
    .replace(/<div class="mw-footer-groups">[\s\S]*?<\/nav><\/div>/, ' ')
    // the trade chooser + signup band (footer-convert.tsx) sits right before the footer brand on every page
    // the footer (trade chooser band, hook, six links) is the same on every page too (15 Oct)
    .replace(/<div class="mw-footer-convert">[\s\S]*?<\/footer>/, ' ');
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replaceAll('&amp;', '&')
    .replaceAll('&nbsp;', ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

test('Touch presents exactly three clear bundles with every base and artwork estimate', async () => {
  const html = await readPage('/3d-printing');

  assert.match(html, /One tap\. One useful next step\./);
  assert.match(html, /Touch One/);
  assert.match(html, /Touch Three/);
  assert.match(html, /Touch \+ Carry/);
  for (const price of ['£29', '£39', '£49', '£59', '£79', '£89']) {
    assert.match(html, new RegExp(price));
  }
  assert.match(html, /one compact stand with one tap point/i);
  assert.match(html, /one stand with three tap points/i);
  assert.match(html, /5 matching tap keyrings/i);
  assert.match(html, /Add your logo or supplied artwork/i);
  assert.match(html, /Optional \+£10/i);
  const formSource = await readFile(path.join(root, 'app', '3d-printing', 'touch-enquiry-form.tsx'), 'utf8');
  assert.match(formSource, /No payment now\. You see the design and final price first\./);
  assert.equal((html.match(/Illustrative sketch/g) || []).length >= 4, true);
});

test('Objects enquiry keeps links optional and builds its estimate from shared pricing', async () => {
  const [html, formSource, enquirySource, configSource, selectionSource] = await Promise.all([
    readPage('/3d-printing'),
    readFile(path.join(root, 'app', '3d-printing', 'touch-enquiry-form.tsx'), 'utf8'),
    readFile(path.join(root, 'app', 'enquiry.ts'), 'utf8'),
    readFile(path.join(root, 'app', '3d-printing', 'touch-config.ts'), 'utf8'),
    readFile(path.join(root, 'app', '3d-printing', 'touch-selection.tsx'), 'utf8'),
  ]);

  for (const field of ['bundle', 'intendedUses', 'artwork', 'businessName', 'name', 'email', 'destinationLinks', 'notes']) {
    assert.match(formSource, new RegExp(field));
  }
  assert.match(formSource, /I want help finding the right links/);
  assert.match(formSource, /Links you already have[\s\S]{0,80}optional/i);
  assert.match(formSource, /Send my enquiry/);
  assert.match(formSource, /sendEnquiry\(/);
  assert.match(enquirySource, /fetch\(FORM_ENDPOINT/);
  assert.match(selectionSource, /getTouchEstimate\(bundleId, artwork\)/);
  assert.match(formSource, /estimated_product_price: `£\$\{estimate\}/);
  assert.match(enquirySource, /response\.ok/);
  assert.match(formSource, /setSubmitState\('error'\)/);
  assert.match(formSource, /submitEnquiry[\s\S]+intendedUses\.length === 0/);
  assert.doesNotMatch(formSource, /required[^>]+destinationLinks|destinationLinks[^>]+required/);
  assert.match(configSource, /artworkAddOnPrice: 10/);
  assert.match(configSource, /basePrice: 29/);
  assert.match(configSource, /basePrice: 49/);
  assert.match(configSource, /basePrice: 79/);
  assert.match(html, /You do not need every link or technical detail ready/i);
});

test('Touch explains real-world limits without turning owner-visible copy into technical documentation', async () => {
  const text = visibleText(await readPage('/3d-printing'));

  for (const phrase of [
    'QR backup',
    'Most modern phones',
    'cases, phone settings and tap position',
    'does not need a battery or charging cable',
    'printed QR code would still show the old link',
    'indoor 3D-printed plastic finish',
    'approve the direction and final price before production starts',
    'Not for a stand that opens pages you already own',
  ]) {
    assert.match(text, new RegExp(phrase, 'i'));
  }
  assert.doesNotMatch(text, /works on every phone|guaranteed reviews|automatic sales|dishwasher safe|waterproof|food[- ]safe/i);
  assert.doesNotMatch(text, /FDM|passive tag|NDEF|antenna|retention method|cavity lock|maintained redirect service/i);
});

test('Objects includes an honest architecture and property use case', async () => {
  const text = visibleText(await readPage('/3d-printing'));
  assert.match(text, /Architecture & property/i);
  assert.match(text, /Simple models and clear drawings/i);
  assert.match(text, /Illustrations made for this page, not client work/i);
  assert.match(text, /Structural, planning or scaffold design drawings stay with your engineer/i);
  assert.match(text, /Send the file and scale; I(?:'|’)?ll confirm feasibility first/i);
  assert.match(text, /Architectural models\?/i);
  assert.doesNotMatch(text, /museum quality|resin quality|precision manufacturing|any scale/i);
});

test('Objects is discoverable from shared chrome, homepage and sitemap while digital services remain', async () => {
  const [home, objects, sitemap, readme] = await Promise.all([
    readPage('/'),
    readPage('/3d-printing'),
    readFile(path.join(exportRoot, 'sitemap.xml'), 'utf8'),
    readFile(path.join(root, 'README.md'), 'utf8'),
  ]);

  // Objects left the homepage in the 27 Sep sales overhaul; since 29 Sep it sits under "Other projects" in the menu and footer.
  const lab = await readPage('/lab');
  assert.match(home, /href="\/3d-printing"[^>]*>Objects/);
  assert.match(lab, /Maz Works Objects/);
  assert.match(lab, /Tap-to-review stands and signs, fixed price from £29/);
  assert.match(home, /Tell me the job/);
  assert.match(home, /£99/);
  assert.match(objects, /href="\/prices"/);
  assert.match(objects, /href="\/lab"/);
  assert.match(objects, /href="\/demos"/);
  assert.match(sitemap, /\/3d-printing/);
  assert.match(readme, /Touch One/);
  assert.match(readme, /manufacturing checks/i);
});

test('Objects page stays short', async () => {
  // Same count as the homepage budget: all text inside <main>, including form labels,
  // header, footer and closed answers. Was about 1,630 before the September cut.
  // Raised 900 -> 1,100 on 27 Sep for the architecture models and drawings section Maz asked for.
  const WORD_BUDGET = 1100;
  const html = stripNavChrome(await readPage('/3d-printing'));
  const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
  const words = main.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  assert.ok(words <= WORD_BUDGET, `/3d-printing has ${words} words; budget is ${WORD_BUDGET}`);
});
