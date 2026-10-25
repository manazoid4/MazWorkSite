import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

// Reimagination (25 Oct 2026): six primary links, one button, every kept page still reachable, merged pages redirect.
const out = path.join(process.cwd(), 'out');
const read = (file) => readFile(path.join(out, file), 'utf8');
const PRIMARY = [['/what-we-do', 'What I do'], ['/proof', 'My work'], ['/prices', 'Prices'], ['/tools', 'Tools and demos'], ['/about', 'About'], ['/contact', 'Contact']];

test('the header has exactly six labelled links in order, plus the Free preview button', async () => {
  const html = await read('index.html');
  const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'));
  const links = [...header.matchAll(/<a class="mw-nav-link"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map((m) => [m[1], m[2]]);
  assert.deepEqual(links, PRIMARY);
  assert.match(header, /class="mw-nav-cta" href="\/contact\?src=nav#contact">Free preview</);
});

test('the phone menu and footer carry the six links, and the kept pages stay reachable from the menu', async () => {
  const html = await read('index.html');
  const menu = html.slice(html.indexOf('class="mw-menu-panel"'), html.indexOf('</ul>', html.indexOf('class="mw-menu-panel"')));
  for (const [href] of [...PRIMARY, ['/for'], ['/faq'], ['/site-map']]) assert.ok(menu.includes(`href="${href}"`), `menu has ${href}`);
  const footer = html.slice(html.indexOf('<footer'), html.indexOf('</footer>'));
  for (const [href, label] of PRIMARY) assert.ok(footer.includes(`href="${href}">${label}<`), `footer has ${label}`);
});

test('the hidden pages are linked from /what-we-do or the site map, not the header', async () => {
  const what = await read('what-we-do.html');
  const map = await read('site-map.html');
  for (const href of ['/local-businesses', '/professional-teams', '/for', '/3d-printing']) assert.ok(what.includes(`href="${href}"`), `what-we-do links ${href}`);
  for (const href of ['/local-businesses', '/professional-teams', '/after-hours-receptionist', '/free-membership', '/tools', '/tools/restaurant-tables']) assert.ok(map.includes(`href="${href}"`), `site map links ${href}`);
});

test('the sitemap lists the tools hub and the restaurant demo, and not the retired pages', async () => {
  const sitemap = await read('sitemap.xml');
  for (const route of ['/tools', '/tools/restaurant-tables', '/what-we-do', '/proof', '/prices', '/about', '/contact', '/local-businesses', '/professional-teams', '/after-hours-receptionist']) {
    assert.match(sitemap, new RegExp(`<loc>https://www\\.mazworks\\.uk${route}</loc>`), route);
  }
  for (const gone of ['/whats-new', '/mazos', '/rotareason', '/maz-core', '/maz-pocket-ai', '/receptionist-demo']) assert.doesNotMatch(sitemap, new RegExp(`${gone}</loc>`), gone);
});

test('every main page sets a title of 60 characters or fewer and a description of 155 or fewer', async () => {
  for (const file of ['what-we-do', 'prices', 'proof', 'about', 'contact', 'faq', 'local-businesses', 'professional-teams', 'after-hours-receptionist', 'for']) {
    const html = await read(`${file}.html`);
    const title = /<title>([^<]*)<\/title>/.exec(html)?.[1].replace(/&amp;/g, '&').replace(/&#x27;/g, "'");
    const description = /<meta name="description" content="([^"]*)"/.exec(html)?.[1].replace(/&amp;/g, '&').replace(/&#x27;/g, "'");
    assert.ok(title && title.length <= 60, `${file}: title ${title?.length} "${title}"`);
    assert.ok(description && description.length <= 155, `${file}: description ${description?.length}`);
    assert.match(html, new RegExp(`rel="canonical" href="https://www\\.mazworks\\.uk/${file}"`), `${file}: canonical`);
  }
});
