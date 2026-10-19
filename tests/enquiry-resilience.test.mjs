import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

test('both exported enquiry forms provide a native POST fallback instead of leaking fields into a GET URL', async () => {
  for (const route of ['free-plan', '3d-printing']) {
    const html = await read(`out/${route}.html`);
    const form = html.match(/<form\b[^>]*>/)?.[0];
    assert.ok(form, `missing ${route} form`);
    assert.match(form, /method="[Pp][Oo][Ss][Tt]"/, route);
    assert.match(form, /action="https:\/\/formsubmit\.co\/cdecd22760836a83422b51da0a853f94"/, route);
    assert.match(html, /name="_subject"/);
    assert.match(html, /name="_template"/);
  }
});

test('Objects required contacts are always available; only optional details can collapse', async () => {
  const html = await read('out/3d-printing.html');
  const contact = html.match(/<fieldset\b[^>]*class="objects-contact-fields"[\s\S]*?<\/fieldset>/)?.[0];
  assert.ok(contact, 'contact progression must not depend on mounting fields with JavaScript');
  for (const name of ['name', 'email', 'destinationLinks', 'notes']) {
    assert.match(contact, new RegExp(`name="${name}"`));
  }
  assert.match(contact, /type="submit"/);
  const optional = contact.match(/<details\b[\s\S]*?<\/details>/)?.[0];
  assert.ok(optional);
  assert.doesNotMatch(optional, /\brequired(?:=|\s|>)/, 'native validation must never need to focus a hidden required field');
  assert.match(html, /class="objects-selection-summary"[^>]*hidden/, 'an unhydrated price estimate must not imply that it updates');
  for (const action of ['reviews', 'bookings', 'website']) {
    assert.match(html, new RegExp(`name="customer_action_${action}"`), 'native actions need unique field names');
  }
});

test('CSP permits the native provider destination without opening form submission to arbitrary sites', async () => {
  const config = JSON.parse(await read('vercel.json'));
  const csp = config.headers[0].headers.find((header) => header.key === 'Content-Security-Policy').value;
  const directive = csp.split(';').map((part) => part.trim()).find((part) => part.startsWith('form-action'));
  assert.equal(directive, "form-action 'self' https://formsubmit.co");
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /object-src 'none'/);
});
