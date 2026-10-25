import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import path from 'node:path';

// /tools hub and the restaurant table picker, checked in the static export (run `npm run build` first).
const out = path.join(process.cwd(), 'out');
const read = async (route) => {
  for (const file of [`${route}.html`, `${route}/index.html`]) {
    try { return (await fs.readFile(path.join(out, file), 'utf8')).replaceAll('<!-- -->', ''); } catch { /* try the next export shape */ }
  }
  throw new Error(`Missing static page for ${route}`);
};
const visible = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ');

test('/tools has metadata, a canonical URL and links every demo it describes', async () => {
  const html = await read('/tools');
  assert.match(html, /<title>Tools and demos \| Maz Works<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.mazworks\.uk\/tools"/);
  assert.match(html, /<meta name="description" content="[^"]{60,}"/);
  for (const href of ['/tools/restaurant-tables', '/local-businesses#missed-calls-calculator', '/receptionist-demo', '/work/jobfilter', '/work/scrap-finance-partners', '/3d-printing']) {
    assert.ok(html.includes(`href="${href}"`), `/tools links ${href}`);
  }
});

test('/tools labels every entry honestly and never presents a concept as client work', async () => {
  const html = await read('/tools');
  const text = visible(html);
  for (const label of [/real client work/i, /internal project/i, /interactive concept demo/i]) assert.match(text, label);
  // Each list row carries exactly one label, and the only client-work row is the real client site.
  const rows = [...html.matchAll(/<li class="tl-row">([\s\S]*?)<\/li>/g)].map((m) => m[1]);
  assert.ok(rows.length >= 5);
  for (const row of rows) assert.equal((row.match(/class="rx-tag"/g) || []).length, 1);
  const clientRows = rows.filter((row) => /data-kind="client"/.test(row));
  assert.equal(clientRows.length, 1);
  assert.match(clientRows[0], /Scrap Finance Partners/);
  for (const row of rows.filter((r) => /Missed-calls|receptionist|Objects/.test(r))) assert.match(row, /data-kind="concept"/);
  assert.doesNotMatch(text, /testimonial|paid (client|contract)|client paid/i);
});

test('the table picker page carries the exact demo notice, metadata and an accessible plan', async () => {
  const html = await read('/tools/restaurant-tables');
  const text = visible(html);
  assert.ok(text.includes('Interactive demo — no real reservation is made.'));
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.mazworks\.uk\/tools\/restaurant-tables"/);
  assert.match(html, /<title>Restaurant table picker demo \| Maz Works<\/title>/);
  const buttons = [...html.matchAll(/<button type="button" class="rt-table[^"]*"[^>]*>/g)].map((m) => m[0]);
  assert.equal(buttons.length, 8, 'eight selectable tables');
  for (const tag of buttons) {
    assert.match(tag, /aria-pressed="false"/);
    assert.match(tag, /aria-label="Table [A-Z]\d, seats [246], (Window|Main floor|Terrace), (free|taken|not for your party size)"/);
  }
  assert.match(html, /<fieldset class="rt-field"><legend>Party size<\/legend>/);
  assert.equal((html.match(/<svg class="rt-floor"[^>]*aria-hidden="true"/g) || []).length, 1);
});

test('the table picker never says a booking is confirmed or asks for personal details', async () => {
  const html = await read('/tools/restaurant-tables');
  const text = visible(html.slice(html.indexOf('<main'), html.indexOf('<footer')));
  assert.doesNotMatch(text, /confirmed|you(?:'|’)re booked|booking is made/i);
  const picker = html.slice(html.indexOf('class="rt"'), html.indexOf('<footer'));
  assert.doesNotMatch(picker, /<input[^>]*type="(?:text|email|tel)"/);
  assert.doesNotMatch(picker, /<form\b/);
});

test('the home page links the tools hub and the picker, and shows the labelled teaser', async () => {
  const text = visible(await read('/'));
  assert.match(text, /Interactive concept demo/);
  assert.match(text, /No real reservation is made/);
});
