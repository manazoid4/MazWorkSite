import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const exportRoot = path.join(root, 'out');

// Homepage word budget (visible words in <main>, form labels and closed disclosure copy included).
// Raised 650 -> 820 on 26 Sep for the confirmed care options, clearer FAQs and Business Leak Check.
// 780 -> 820 on 26 Sep: new pricing adds a free Leak Check and a Full Rebuild card.
// 820 -> 1100 on 26 Sep (Offer v5): Journey Receipt example, Tell Maz section and referral line added.
// 1100 -> 1050 on 26 Sep: audit pass removed the duplicate problem chooser.
// 1050 -> 1250 on 27 Sep (sales overhaul): the free-check form and a labelled example report now
// live on the homepage; the second enquiry form, project list and newsletter moved off it.
// 1250 -> 1400 on 27 Sep (Offer v7): priced optional extras and the care plan added to the homepage.
// 1400 -> 1600 on 27 Sep (Offer v8): each add-on now says in plain words what the customer gets (Maz's request).
// 1600 -> 1900 on 27 Sep (Offer v9): ManyPets-style comparison table, promises and "what's not included" list.
// 1900 -> 1600 on 28 Sep: comparison table and all twelve add-ons moved to /prices; the homepage sells one first step.
// 1600 -> 1850 on 30 Sep: Maz asked to keep the "What changes in your day" explainers (six short storyboards).
// 30 Sep 2026, approved brief v2: five focused homepage sections.
const WORD_BUDGET = 1300;
// Same count as the homepage: all text inside <main>, including header, footer and closed answers.
const CASE_STUDY_WORD_BUDGET = 320;

/** Shared nav chrome (phone menu panel, grouped footer) is the same on every page, so page word budgets skip it. */
function stripNavChrome(html) {
  return html
    .replace(/<div class="mw-menu-panel"[\s\S]*?<\/ul><\/div><\/div>/, ' ')
    .replace(/<div class="mw-footer-groups">[\s\S]*?<\/nav><\/div>/, ' ')
    // the trade chooser + signup band (footer-convert.tsx) sits right before the footer brand on every page
    // the footer (trade chooser band, hook, six links) is the same on every page too (15 Oct)
    .replace(/<div class="mw-footer-convert">[\s\S]*?<\/footer>/, ' ');
}

function mainWordCount(html) {
  html = stripNavChrome(html);
  const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
  return main.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

async function readPage(route) {
  const name = route === '/' ? 'index' : route.replace(/^\//, '');
  const candidates = [
    path.join(exportRoot, `${name}.html`),
    path.join(exportRoot, name, 'index.html'),
  ];
  for (const candidate of candidates) {
    try {
      return (await readFile(candidate, 'utf8')).replaceAll('<!-- -->', '');
    } catch {
      // Support both Next.js static-export path shapes.
    }
  }
  throw new Error(`Missing static page for ${route}`);
}

async function internalTargetExists(urlPath) {
  const cleanPath = urlPath.split(/[?#]/, 1)[0];
  const relativePath = cleanPath.replace(/^\//, '');
  const candidates = cleanPath === '/'
    ? [path.join(exportRoot, 'index.html')]
    : path.extname(cleanPath)
      ? [path.join(exportRoot, relativePath)]
      : [path.join(exportRoot, `${relativePath}.html`), path.join(exportRoot, relativePath, 'index.html')];
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return true;
    } catch {
      // Try the next exported path shape.
    }
  }
  return false;
}

test('homepage makes the shared customer-side purpose clear without reducing the work to a cheap task', async () => {
  const html = await readPage('/');
  const visible = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ');
  assert.match(visible, /Less hassle\. Better business\./);
  assert.match(html, /win customers, look after them better and solve the problems holding them back/);
  assert.match(html, /Get customers/);
  assert.match(html, /Serve customers/);
  assert.match(html, /Keep &amp; improve/);
  assert.match(html, /I run a local business/);
  assert.match(html, /I work in a professional team/);
  for (const smallTime of [/website fix/i, /small fixes/i, /quick fix/i, /Enquiry Repair/, /fix what’s broken/i, /Maz Works is new/i]) {
    assert.doesNotMatch(html, smallTime, `homepage reads as small-time: ${smallTime}`);
  }
  assert.match(html, /Tell me what.s not working/);
  for (const filler of [/Inspect the work before reading more claims/, /Operations thinking/, /What gets measured/, /£150/, /Quick Win/, /£19\/month/, /founding/i, /hacked/i, /class="mw-builds"/]) {
    assert.doesNotMatch(html, filler);
  }
});

test('the homepage offers one simple enquiry action and preserves the separate preview route', async () => {
  const page = await readPage('/');
  assert.match(page, /id="footer-signup"/, 'the mailing list remains available in the footer');
  const html = stripNavChrome(page);
  assert.doesNotMatch(html, /id="hero-quick-form"|id="leak-check-form"/);
  assert.match(html, /href="\/contact\?src=home#contact"/);
  assert.match(html, /href="\/free-plan\?src=home"/);
});

test('the fixed terms remain on /prices and the homepage keeps its founder and price links', async () => {
  const html = await readPage('/');
  const prices = await readPage('/prices');
  const strip = prices.match(/<ul class="s-promises"[\s\S]*?<\/ul>/)?.[0];
  assert.ok(strip, 'terms live on /prices');
  for (const item of [/One fixed price/, /No contracts/]) assert.match(strip, item);
  assert.match(html, /href="\/prices"/);
  assert.match(html, /I’m Manazir. I plan it and build it myself/);
  assert.match(html, /src="\/maz\.webp"/, 'founder photo remains part of the personal studio identity');
});

test('trade guides remain reachable and the homepage labels its illustrative workflow', async () => {
  const html = await readPage('/');
  // Trade guides are one tap away in the shared menu and footer; the /for hub lists all six.
  for (const guide of ['salons-and-beauty', 'dog-groomers', 'garages', 'cafes-and-food', 'clinics-and-therapists', 'architects']) {
    assert.match(await readPage('/for'), new RegExp(`href="/for/${guide}"`));
  }
  assert.match(html, /Illustrative workflow/);
  assert.match(html, /A customer gets in touch/);
  assert.match(html, /They get a clear next step/);
  assert.doesNotMatch(html, /Missed-call text-back, Starter Automation £99/);
});

test('what-we-do shows why Maz Works, with no fictional example report', async () => {
  const html = await readPage('/what-we-do');
  assert.match(html, /id="why"/);
  assert.match(html, /See it working before you pay/);
  assert.doesNotMatch(html, /A fictional business/);
});

test('homepage has one set of service routes, not a duplicate problem chooser', async () => {
  const html = await readPage('/');
  assert.doesNotMatch(html, /class="mw-leak-check"/);
});

test('homepage proof is limited to real, honestly labelled work', async () => {
  const html = await readPage('/');
  assert.match(html, /JobFilter/);
  assert.match(html, /Maz Works product · software/);
  assert.match(html, /live tool that helps small firms/);
  assert.match(html, /Scrap Finance Partners/);
  assert.match(html, /A website designed and built for a specialist finance firm/);
  assert.match(html, /href="\/lab"/);
  for (const name of ['Agent Nudge', 'OpenFlowKit', 'Khutba', 'MAZ Pocket', 'tap-to-review']) {
    assert.doesNotMatch(html, new RegExp(name), `${name} belongs on /lab, not the homepage`);
  }
  assert.doesNotMatch(html, /paid (client|contract|engagement)|client paid|testimonial/i);

  const lab = await readPage('/lab');
  for (const name of ['JobFilter', 'Scrap Finance Partners', 'Agent Nudge', 'OpenFlowKit', 'Khutba.io', 'MAZ Pocket', 'In progress', 'Ask about this build']) {
    assert.match(lab, new RegExp(name));
  }
  assert.doesNotMatch(lab, /href="https:\/\/github.com\/manazoid4\/maz-pocket"/);
});

test('homepage explains the shared purpose, three buckets and two customer routes without leading on price', async () => {
  const html = await readPage('/');
  const visible = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ');
  assert.match(html, /Making businesses better, one problem at a time/);
  assert.match(visible, /Less hassle\. Better business\./);
  for (const bucket of ['Get customers', 'Serve customers', 'Keep &amp; improve']) assert.match(html, new RegExp(bucket, 'i'));
  assert.match(html, /href="\/local-businesses"/);
  assert.match(html, /href="\/professional-teams"/);
  assert.match(html, /Tell me what.s not working/);
  assert.doesNotMatch(visible, /£99|£149|£595/, 'homepage does not lead with a low package price');
  assert.match(html, /Real projects\. Clearly labelled\./);
  assert.match(html, /Maz Works product/);
  assert.match(html, /Client work/);
  const prices = await readPage('/prices');
  for (const [name, price] of [['Starter Automation', '£99'], ['Business System', 'From £595'], ['Custom Software', 'From £2,450']]) {
    assert.match(prices, new RegExp(name));
    assert.match(prices, new RegExp(price, 'i'));
  }
  assert.match(prices, /id="websites"/, 'websites and sales pages are on /prices');
  // The full comparison and add-ons stay on /prices, so the homepage remains focused.
  assert.doesNotMatch(html, /id="compare"/);
  assert.doesNotMatch(html, /Team training/);
  assert.match(html, /href="\/prices"/);
  assert.match(prices, /Care plan[\s\S]{0,30}£39\/month/);
  assert.doesNotMatch(html, /\bAI\b/, 'AI is used behind the scenes, never advertised (Maz, 27 Sep)');
  // Offer v11 (2 Oct): £149, £595, £2,450 and £39/month are the live prices; £19/month, the £395 Brand Kit and unlimited changes are retired.
  for (const retired of [/£150/, /£395/, /£249/, /Quick Win/, /£19\/month/, /founding/i, /Contact Setup/, /Enquiry Check/, /Customer Journey Review/, /From £495/, /From £950/, /From £1,500/, /£1,250/, /Custom Software &amp; Websites/, /unlimited changes/i]) {
    assert.doesNotMatch(html, retired, `retired offer still on homepage: ${retired}`);
  }
  assert.doesNotMatch(html, /href="\/quick-win"/);

  const pricesAgain = await readPage('/prices');
  for (const [name, price] of [['Starter Automation', '£99'], ['Business System', 'From £595'], ['Custom Software', 'From £2,450'], ['Starter for creators', '£79'], ['Launch Page', '£295'], ['Website', 'From £1,295']]) {
    assert.match(pricesAgain, new RegExp(name));
    assert.match(pricesAgain, new RegExp(price));
  }
  for (const id of ['systems', 'creators', 'websites', 'ladder', 'automation-menu', 'always-included', 'own-vs-rent', 'set-ups']) assert.match(pricesAgain, new RegExp(`id="${id}"`));
  assert.match(pricesAgain, /What’s included, and what isn’t/, 'every package shows what it excludes');
  for (const id of ['compare', 'extras']) assert.match(pricesAgain, new RegExp(`id="${id}"`));
  assert.match(pricesAgain, /What’s not included/);
  assert.match(prices, /Google listing tidy[\s\S]{0,300}£29/);
  assert.match(prices, /Extra website page[\s\S]{0,300}£295/);
  assert.match(prices, /Team training[\s\S]{0,300}£95/);
  assert.match(prices, /Care plan[\s\S]{0,30}£39\/month/);
  assert.match(prices, /Care plan plus[\s\S]{0,30}£149\/month/);
  assert.match(prices, /\/free-plan\?package=Starter%20Automation#leak-check-form/);
  assert.doesNotMatch(prices, /\bAI\b/);
  assert.match(prices, /\/free-plan\?package=Team%20training#leak-check-form/, 'every add-on can pre-fill the free plan form');
  assert.match(prices, /<title>Maz Works prices for websites, systems and support/);
  assert.match(prices, /Every Maz Works price in one place/);

  const contact = await readPage('/contact');
  assert.match(contact, /Tell me what needs to work better/);
  assert.match(contact, /usually reply within 1 working day/i);
  assert.match(contact, /Book a 15-minute call/);
  assert.match(contact, /Email info@mazworks\.uk/);
  const contactMainStart = contact.indexOf('<main');
  const contactFormStart = contact.indexOf('<form', contactMainStart);
  const contactLead = contact.slice(contactMainStart, contactFormStart);
  assert.doesNotMatch(contactLead, /£\s?\d/, 'no price catalogue before the form');
  assert.doesNotMatch(contactLead, /Get my free preview/, 'the contact page does not divert visitors before the form');
  assert.match(contact, /<input(?=[^>]*name="name")(?=[^>]*required)[^>]*>/);
  assert.match(contact, /<input(?=[^>]*name="email")(?=[^>]*required)[^>]*>/);
  assert.match(contact, /<textarea(?=[^>]*name="problem")(?=[^>]*required)[^>]*>/);
});

test('the free plan form lets owners tap their problem, and only the no-JavaScript route asks for an auto-reply', async () => {
  for (const route of ['/free-plan']) {
    const html = await readPage(route);
    assert.match(html, /name="_autoresponse" value="Thanks, I&#x27;ve got your message\. [^"]*within 1 working day/, `${route} form sends no instant confirmation`);
    for (const pick of ['Missed calls', 'Slow replies to enquiries', 'No-shows', 'Chasing quotes']) {
      assert.match(html, new RegExp(`<button type="button" aria-pressed="false"[^>]*>${pick}</button>`), `${route} missing quick pick ${pick}`);
    }
  }
  const source = await readFile(path.join(root, 'app', 'free-plan', 'leak-check-form.tsx'), 'utf8');
  // FormSubmit ignores _autoresponse on AJAX, so the in-page route must neither send it nor promise an email.
  assert.doesNotMatch(source, /_autoresponse: AUTO_REPLY/);
  assert.doesNotMatch(source, /confirmation is on its way/i);
  assert.match(source, /KNOWN_PACKAGES\.includes\(name\)/, '?package= only accepts real package and add-on names');
});

test('the free-check reply promise is 1 working day everywhere (Maz confirmed 27 Sep)', async () => {
  for (const route of ['/', '/free-plan', '/contact', '/faq']) {
    const html = await readPage(route);
    assert.doesNotMatch(html, /5 working days/, `${route} still promises 5 working days`);
    assert.doesNotMatch(html, /2 working days/, `${route} still promises 2 working days`);
  }
  assert.match(await readPage('/'), /within 1 working day/);
});

test('homepage shows the full customer journey without becoming a service catalogue', async () => {
 const html = await readPage('/');
 for (const id of ['customer-buckets','doors-title','proof-title','about-title','home-close-title']) assert.match(html,new RegExp(`id="${id}"`));
 assert.ok((stripNavChrome(html).match(/<section /g)||[]).length <= 8);
 const detail=await readPage('/what-we-do');
 for(const copy of ['How I set it up','Built on what you already use','I never need your passwords','What you own at the end','What I need from you']) assert.ok(detail.includes(copy));
 const words=mainWordCount(html);assert.ok(words<=WORD_BUDGET,`homepage has ${words} words; budget ${WORD_BUDGET}`);
});

test('public contact uses the branded address while form delivery stays stable', async () => {
  const html = await readPage('/');
  const siteSource = await readFile(path.join(root, 'app', 'site.ts'), 'utf8');
  const enquirySource = await readFile(path.join(root, 'app', 'enquiry.ts'), 'utf8');
  assert.match(html, /info@mazworks\.uk/);
  assert.match(siteSource, /CONTACT_EMAIL = 'info@mazworks\.uk'/);
  assert.match(enquirySource, /FORM_DELIVERY_EMAIL/);
});

test('contact request submits in-page instead of depending on the visitor email app', async () => {
  const html = await readPage('/contact');
  const formSource = await readFile(path.join(root, 'app', 'demo-request-form.tsx'), 'utf8');
  const enquirySource = await readFile(path.join(root, 'app', 'enquiry.ts'), 'utf8');
  const vercelConfig = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
  const csp = vercelConfig.headers[0].headers.find((header) => header.key === 'Content-Security-Policy')?.value || '';

  assert.match(html, /Send enquiry/);
  assert.match(html, /name="name"/);
  assert.match(html, /name="email"/);
  assert.match(html, /name="business"/);
  assert.match(html, /name="problem"/);
  assert.match(html, /name="service"/);
  assert.match(html, /name="nextStep"/);
  assert.match(html, /A 15-minute call/);
  assert.match(html, /sent directly from this form/i);
  assert.match(enquirySource, /https:\/\/formsubmit\.co\/ajax\//);
  assert.match(enquirySource, /fetch\(FORM_ENDPOINT/);
  assert.match(formSource, /role="status"/);
  assert.match(formSource, /_honey/);
  assert.doesNotMatch(formSource, /window\.location\.href\s*=\s*`mailto:/);
  assert.match(csp, /connect-src 'self' https:\/\/formsubmit\.co/);
});

test('metadata and accessible navigation are present on public pages', async () => {
  for (const route of ['/', '/mazos', '/work/jobfilter', '/work/scrap-finance-partners']) {
    const html = await readPage(route);
    assert.match(html, /href="#main-content">Skip to main content/);
    const target = /<([a-z]+)\b(?=[^>]*\bid="main-content")(?=[^>]*\btabindex="-1")[^>]*>/i.exec(html);
    assert.ok(target, `${route} skip target must be programmatically focusable`);
    assert.match(html, /rel="canonical"/);
    assert.match(html, /property="og:image"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
  }
});

test('same-page navigation points to existing homepage sections', async () => {
  const html = await readPage('/');
  const fragments = [...html.matchAll(/href="\/#([^"]+)"/g)].map((match) => match[1]);
  for (const fragment of fragments) {
    assert.match(html, new RegExp(`id="${fragment}"`), `Missing homepage target #${fragment}`);
  }
});

test('internal links and assets resolve inside the static export', async () => {
  for (const route of ['/', '/mazos', '/work/jobfilter', '/work/scrap-finance-partners']) {
    const html = await readPage(route);
    const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
    for (const reference of references) {
      if (/^(?:https?:|mailto:|data:|#)/.test(reference)) continue;
      const normalized = reference.startsWith('/#') ? '/' : reference;
      assert.equal(await internalTargetExists(normalized), true, `${route} has missing target ${reference}`);
    }
  }
});

test('flagship case studies remain available and use the expanded positioning', async () => {
  const jobfilter = await readPage('/work/jobfilter');
  assert.match(jobfilter, /JobFilter case study/);
  assert.match(jobfilter, /help(s)? small building firms find public contracts/i);
  assert.match(jobfilter, /Trade-fit checks/);
  assert.match(jobfilter, /does not guarantee/i);

  const scrap = await readPage('/work/scrap-finance-partners');
  assert.match(scrap, /Scrap Finance Partners case study/);
  assert.match(scrap, /client website/i);
  assert.doesNotMatch(scrap, /paid (client|contract|engagement)|client paid/i);
  assert.doesNotMatch(scrap, /outreach|client area|lead workspace|github\.com\/manazoid4\/scrap-finance-partners/i);

  const sitemap = await readFile(path.join(exportRoot, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /\/work\/jobfilter/);
  assert.match(sitemap, /\/work\/scrap-finance-partners/);
});

test('case studies stay short', async () => {
  for (const route of ['/work/jobfilter', '/work/scrap-finance-partners']) {
    const words = mainWordCount(await readPage(route));
    assert.ok(words <= CASE_STUDY_WORD_BUDGET, `${route} has ${words} words; budget is ${CASE_STUDY_WORD_BUDGET}`);
  }
});

test('legacy MazOS route stays out of homepage discovery and sitemap', async () => {
  const home = await readPage('/');
  const moved = await readPage('/mazos');
  const sitemap = await readFile(path.join(exportRoot, 'sitemap.xml'), 'utf8');
  assert.doesNotMatch(home, /href="\/mazos"/);
  assert.doesNotMatch(sitemap, /<loc>[^<]+\/mazos(?:\/)?<\/loc>/);
  assert.match(moved, /This page has moved/);
  assert.match(moved, /noindex/);
});

test('structured data reflects Maz Works founder and broad service positioning', async () => {
  const html = await readPage('/');
  const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(ldMatch, 'Homepage is missing JSON-LD');
  const data = JSON.parse(ldMatch[1]);
  const graph = data['@graph'];
  const person = graph.find((node) => node['@type'] === 'Person');
  assert.equal(person.name, 'Manazir Hussain');
  assert.equal(person.jobTitle, 'Founder and Software Builder');
  assert.ok(person.sameAs.includes('https://github.com/manazoid4'));
  assert.ok(person.sameAs.includes('https://www.linkedin.com/company/maz-works'));
  const business = graph.find((node) => [].concat(node['@type']).includes('ProfessionalService'));
  assert.ok(business, 'homepage needs ProfessionalService structured data for local search');
  assert.equal(business.address.addressLocality, undefined, 'never publish Maz\'s town');
  assert.equal(business.areaServed.name, 'United Kingdom');
  assert.equal(business.makesOffer[0].price, '0');
  assert.deepEqual(business.makesOffer.slice(1).map((offer) => offer.priceSpecification.minPrice), [99, 595, 2450, 79, 295, 1295]);
  for (const term of ['customers', 'booking', 'enquiry', 'Google Business Profile', 'websites', 'rebuilds', 'complaints reporting', 'automation', 'software']) {
    assert.ok(business.description.toLowerCase().includes(term.toLowerCase()), `structured data missing ${term}`);
  }
});

test('Vercel Analytics remains bundled into the static export', async () => {
  const chunksDir = path.join(exportRoot, '_next', 'static', 'chunks');
  const files = await readdir(chunksDir);
  let found = false;
  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    const contents = await readFile(path.join(chunksDir, file), 'utf8');
    if (contents.includes('_vercel/insights/script.js')) {
      found = true;
      break;
    }
  }
  assert.ok(found, 'No static chunk references the Vercel Analytics script endpoint');
});

test('runtime and static-host hardening stay explicit', async () => {
  const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  const vercelConfig = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
  assert.equal(packageJson.engines.node, '24.14.1');
  assert.equal(packageJson.engines.npm, '11.11.0');
  assert.equal(packageJson.scripts.start, 'node scripts/serve-static.mjs');

  const headerNames = new Set(vercelConfig.headers[0].headers.map((header) => header.key));
  // Permissions-Policy: microphone blocked everywhere, except the talk-to-it demo, which needs it for this site only.
  const policies = vercelConfig.headers.flatMap((rule) => rule.headers.filter((header) => header.key === 'Permissions-Policy').map((header) => [rule.source, header.value]));
  assert.deepEqual(policies, [
    ['/((?!receptionist-demo).*)', 'camera=(), geolocation=(), microphone=()'],
    ['/receptionist-demo(.*)', 'camera=(), geolocation=(), microphone=(self)'],
  ]);
  for (const name of [
    'Content-Security-Policy',
    'Referrer-Policy',
    'X-Content-Type-Options',
    'X-Frame-Options',
  ]) {
    assert.equal(headerNames.has(name), true, `Missing static-host header ${name}`);
  }
});

test('project memory keeps the Maz Works Knowledge Vault identity canonical', async () => {
  const [readme, handoff] = await Promise.all([
    readFile(path.join(root, 'README.md'), 'utf8'),
    readFile(path.join(root, 'docs', 'archive', 'HANDOFF.md'), 'utf8'),
  ]);

  assert.match(readme, /Maz Works Knowledge Vault/);
  assert.match(handoff, /Maz Works Knowledge Vault/);
  assert.match(handoff, /JobFilter is one project inside it/);
});

/** Reads the canonical site origin from source so the tests cannot drift from it. */
async function siteUrl() {
  const source = await readFile(path.join(root, 'app', 'site.ts'), 'utf8');
  const match = source.match(/SITE_URL\s*=\s*'([^']+)'/);
  assert.ok(match, 'could not read SITE_URL from app/site.ts');
  return match[1];
}

test('every indexable exported page is listed in the sitemap', async () => {
  const SITE_URL = await siteUrl();
  const sitemap = await readFile(path.join(exportRoot, 'sitemap.xml'), 'utf8');
  const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));

  const notRoutes = new Set(['/404', '/_not-found']);

  const pages = await readdir(exportRoot, { recursive: true, withFileTypes: true });
  const routes = pages
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => {
      const relative = path.relative(exportRoot, path.join(entry.parentPath ?? entry.path, entry.name)).split(path.sep).join('/');
      const route = `/${relative.replace(/\.html$/, '').replace(/\/index$/, '')}`;
      return route === '/index' ? '/' : route;
    })
    .filter((route) => !notRoutes.has(route));

  assert.ok(routes.length > 0, 'found no exported pages to check');

  const missing = [];
  for (const route of routes) {
    const html = await readPage(route);
    if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
    const url = route === '/' ? SITE_URL : `${SITE_URL}${route}`;
    if (!listed.has(url)) missing.push(route);
  }

  assert.deepEqual(missing, [], `indexable pages missing from the sitemap: ${missing.join(', ')}`);
});

test('every sitemap entry points at a page that was actually exported', async () => {
  const SITE_URL = await siteUrl();
  const sitemap = await readFile(path.join(exportRoot, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  const broken = [];
  for (const url of urls) {
    assert.ok(url.startsWith(SITE_URL), `sitemap entry is off-site: ${url}`);
    const route = url.slice(SITE_URL.length) || '/';
    if (!(await internalTargetExists(route))) broken.push(route);
  }

  assert.deepEqual(broken, [], `sitemap points at missing pages: ${broken.join(', ')}`);
});

test('retired Quick Win page redirects to /prices and is never linked', async () => {
  const vercel = JSON.parse(await readFile(path.join(exportRoot, '..', 'vercel.json'), 'utf8'));
  assert.ok(vercel.redirects.some((r) => r.source === '/quick-win' && r.destination === '/prices' && r.permanent), 'missing /quick-win → /prices redirect');
  const home = await readPage('/');
  assert.doesNotMatch(home, /href="\/quick-win"/);
  const sitemap = await readFile(path.join(exportRoot, 'sitemap.xml'), 'utf8');
  assert.doesNotMatch(sitemap, /quick-win/);
});

test('retired offer terms are gone from every public page', async () => {
  const routes = [
    '/', '/free-plan', '/faq',
    '/for/heating-and-plumbing', '/for/salons-and-beauty', '/for/dog-groomers', '/for/garages', '/for/cafes-and-food', '/for/clinics-and-therapists',
  ];
  // £795 was the retired Growth System; from 27 Sep (Offer v8) it is the Business System price.
  // Offer v11: £595 is the Business System (Launch Page £295 from v13); the old £395 Brand Kit, £19/month and unlimited changes are retired.
  const retired = [/£150 fixed/, /Quick Win/, /£19\/month/, /founding/i, /hacked/i, /£395/, /£249/, /Enquiry Repair/, /Enquiry Check/, /Contact Setup/, /unlimited changes/i, /Custom Software &amp; Websites/, /pay the rest/i];
  for (const route of routes) {
    const html = await readPage(route);
    for (const pattern of retired) {
      assert.doesNotMatch(html, pattern, `${route} still mentions a retired term matching ${pattern}`);
    }
  }
});

test('the guarantee, no-VAT and referral lines appear where Maz\'s decisions require them', async () => {
  const home = await readPage('/');
  const faq = await readPage('/faq');
  assert.match(home, /Not VAT-registered/);
  // The referral offer lives in the FAQ (homepage kept under 600 words, 2 Oct).
  assert.match(faq, /Not VAT-registered/);
  assert.match(faq, /£50 by bank transfer, no limit/);
  assert.doesNotMatch(faq, /deposit|final payment|pay the rest/i, 'no payment-split wording (Maz, 1 Oct)');
});

// 30 Sep: the free preview is real now, but only after a call (date agreed on the call).
// Case study bodies still lead to the free plan form; the shared nav may link /demos.
test('case studies route to a plan and fixed price, not a blanket free live demo', async () => {
  for (const route of ['/work/jobfilter', '/work/scrap-finance-partners']) {
    const html = (await readPage(route)).replace(/\/demos.{0,40}?Bigger build demos/g, '');
    assert.doesNotMatch(html, /free live demo/i, `${route} still offers a free live demo`);
    assert.match(html, /\/free-plan\?src=case-[a-z-]+#leak-check-form/, `${route} should lead to the free plan form`);
  }
});

// SHA-256 of personal details that must never ship (Maz's town, county and personal email).
// Stored as hashes so this public test does not publish the details it guards against.
const PERSONAL_DETAIL_HASHES = new Set([
  '686728388e144cc2771391a70ec335299917343cfd49fbcecdf2b3a8d08b7420',
  '71be3b9635b8c45ea65075e9a6e76eefdaab4f1647bc2de8ff74de48697e2cff',
  '7e6bd5d79d7f62f11b4d090f1b2ccd941018523ab009674c15dc452dc6e3252f',
]);

test('no public page or shipped script leaks Maz\'s personal details', async () => {
  const files = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (/\.(html|js|txt|xml|json)$/.test(entry.name)) files.push(full);
    }
  }
  await walk(exportRoot);
  const leaks = [];
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    const tokens = new Set(text.toLowerCase().match(/[a-z0-9._%+-]+@[a-z0-9.-]+|[a-z]{4,12}/g) || []);
    if ([...tokens].some((token) => PERSONAL_DETAIL_HASHES.has(createHash('sha256').update(token).digest('hex')))) {
      leaks.push(path.relative(exportRoot, file));
    }
  }
  assert.deepEqual(leaks, [], `personal details found in: ${leaks.join(', ')}`);
});

test('every main page is one tap from the key routes, and the trade guides have a hub', async () => {
  // Navigation audit, 27 Sep: guides were only linked from inside the quote form
  // and phones only saw "Free quote". Now every page carries the same map.
  for (const route of ['/', '/free-plan', '/contact', '/faq', '/lab', '/3d-printing', '/for', '/for/architects']) {
    const html = await readPage(route);
    // 15 Oct (Maz: footer minimal): the long footer list went; trade guides and architecture models stay one tap away via /for and /site-map.
    for (const href of ['/prices', '/for', '/3d-printing', '/faq', '/free-plan', '/site-map']) {
      // The free-plan link may carry ?src=… and #leak-check-form (9 Oct: nav and footer land on the form).
      const linked = html.includes(`href="${href}"`) || (href === '/free-plan' && html.includes('href="/free-plan?'));
      assert.ok(linked, `${route} is missing a link to ${href}`);
    }
    assert.match(html, /class="mw-menu-button"[^>]*aria-expanded="false"/, `${route} has no phone menu button`);
  }
  const hub = await readPage('/for');
  for (const guide of ['salons-and-beauty', 'dog-groomers', 'garages', 'cafes-and-food', 'clinics-and-therapists', 'architects']) {
    assert.match(hub, new RegExp(`href="/for/${guide}"`));
  }
  const guide = await readPage('/for/architects');
  assert.match(guide, /"@type":"BreadcrumbList"/);
  assert.match(guide, /Illustrations made for this page, not client work/);
  const sitemap = await readFile(path.join(exportRoot, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /mazworks\.uk\/for</);
});

test('architecture drawings exist and are labelled illustrative', async () => {
  for (const name of ['scaffold-elevation', 'floor-plan', 'massing-model', 'site-plan']) {
    const svg = await readFile(path.join(root, 'public', 'architecture', `${name}.svg`), 'utf8');
    assert.match(svg, /ILLUSTRATIVE ONLY/, `${name}.svg is not labelled illustrative`);
  }
});

test('six wayfinding helps big sites use are in place', async () => {
  const home = await readPage('/');
  assert.ok(home.includes('href="/for"'), 'the shared menu links to the audience guide hub');
  const audienceHub = await readPage('/for');
  for (const id of ['trades', 'appointments', 'creators', 'offices']) assert.ok(audienceHub.includes(`/for/${id}`));
  // The human site map lists every trade guide and case study.
  const map = await readPage('/site-map');
  for (const href of ['/for/architects', '/for/garages', '/work/jobfilter', '/free-plan', '/whats-new']) assert.ok(map.includes(`href="${href}"`), `site map missing ${href}`);
  // 3. What's new stays reachable from the site map; the footer links the site map (29 Sep: off the main nav).
  const news = await readPage('/whats-new');
  assert.match(news, /Pick your kind of business/, 'what’s new shows the latest real update');
  assert.ok(home.includes('href="/site-map"'));
  assert.ok(!home.includes('href="/whats-new"'), 'What’s new is for buyers only once rewritten; kept off the nav for now');
  // 4. A helpful not-found page.
  const nf = await readFile(path.join(exportRoot, '404.html'), 'utf8');
  assert.match(nf, /That page has moved or never existed/);
  assert.ok(nf.includes('href="/site-map"') && nf.includes('href="/for"'));
  // 5. Back to top.
  assert.match(home, /class="mw-back-top" href="#main-content"/);
  // Pricing is one tap away in the shared menu without taking up a primary link.
  const guide = await readPage('/prices');
  const header = guide.slice(guide.indexOf('<header'), guide.indexOf('</header>'));
  assert.match(header, /href="\/prices"/);
});

test('bucket movement is optional, gentle and disabled for reduced motion', async () => {
  const html = await readPage('/');
  assert.match(html, /class="mw-bucket-art is-(?:find|serve|improve)"/);
  assert.match(html, /Illustrative workflow/);
  assert.doesNotMatch(html, /style="[^"]*opacity:\s*0/, 'no content may be hidden in the static HTML');
  const css = await readFile(path.join(root, 'app', 'three-buckets.css'), 'utf8');
  assert.match(css, /\.mw-bucket-card:hover \.mw-bucket-art/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?animation: none/);
});

test('the bucket illustration interaction survives CSS minification', async () => {
  const cssDir = path.join(exportRoot, '_next', 'static', 'chunks');
  const files = (await readdir(cssDir)).filter((name) => name.endsWith('.css'));
  const css = (await Promise.all(files.map((name) => readFile(path.join(cssDir, name), 'utf8')))).join('\n');
  assert.match(css, /animation:[^;}]*mw-bucket-settle/, 'bucket response animation keeps its short duration');
});

// 2 Oct: the site collects personal details, so it needs a privacy notice; and every job needs written terms.
test('terms and privacy pages exist, are linked from every footer and match the price list', async () => {
  const [home, terms, privacy, leak, sitemap] = await Promise.all([readPage('/'), readPage('/terms'), readPage('/privacy'), readPage('/free-plan'), readFile(path.join(exportRoot, 'sitemap.xml'), 'utf8')]);
  for (const href of ['/terms', '/privacy']) {
    assert.match(home, new RegExp(`href="${href}"`), `footer links ${href}`);
    assert.match(sitemap, new RegExp(`${href}</loc>`));
  }
  assert.match(terms, /The quote is the agreement/);
  assert.match(terms, /the date moves by the same number of days/);
  assert.match(terms, /Care plan is £39\/month/);
  assert.match(terms, /limited to the price you paid/);
  assert.doesNotMatch(terms, /unlimited|deposit|pay the rest/i);
  for (const processor of ['Resend', 'FormSubmit', 'HubSpot', 'Cal.com', 'Vercel', 'Supabase', 'ico.org.uk']) assert.match(privacy, new RegExp(processor));
  assert.match(leak, /href="\/privacy"[^>]*>How I use your details/);
});

test('free previews are fenced to bigger jobs; small jobs get a written plan', async () => {
  const demos = await readPage('/demos');
  assert.match(demos, /Smaller jobs go straight from the free preview to a fixed price/);
});
