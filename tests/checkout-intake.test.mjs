import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import handler, { deliverEnquiry } from '../api/enquiry.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('the checkout intake uses neutral wording and covers receptionist setup', async () => {
  // /start is now /contact?intent=setup: the one form switches to setup mode in the browser.
  const source = await readFile(path.join(root, 'app', 'demo-request-form.tsx'), 'utf8');
  assert.match(source, /intent === 'setup'/);
  assert.match(source, /const SETUP_SERVICE = 'Setup intake'/);
  assert.match(source, /Confirm payment in Stripe before setup; the package query is not proof of payment/);
  assert.match(source, /Send setup details/);
  assert.match(source, /phone line, hours, common questions and urgent-call rules/);
  assert.doesNotMatch(source, /payment received|paid yet|Paid: tell/i);
  const redirects = JSON.parse(await readFile(path.join(root, 'docs', 'plans', 'redirects-b2.json'), 'utf8'));
  assert.equal(redirects.find((row) => row.source === '/start')?.destination, '/contact?intent=setup');
});

test('setup service sends neutral confirmation, verifies payment before setup and skips sales follow-ups', async () => {
  const previous = { resend: process.env.RESEND_API_KEY, followUps: process.env.FOLLOW_UP_EMAILS, hubspot: process.env.HUBSPOT_TOKEN };
  process.env.RESEND_API_KEY = 'test-placeholder';
  process.env.FOLLOW_UP_EMAILS = 'on';
  delete process.env.HUBSPOT_TOKEN;
  try {
    const sent = [];
    const result = await deliverEnquiry({
      name: 'Example visitor', email: 'visitor@example.com', problem: 'Call answering setup',
      service: 'Setup intake', interested_in: 'After-Hours Receptionist',
      next_step: 'Payment received; start immediately', _url: 'https://www.mazworks.uk/start?package=After-Hours%20Receptionist',
      draft: 'Payment received; start immediately',
    }, async (_url, options) => { sent.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ id: 'fixture' }) }; });

    assert.deepEqual(result, { ok: true, confirmationSent: true });
    assert.equal(sent.length, 2, 'setup intake must not schedule free-demo follow-ups');
    assert.match(sent[0].subject, /setup details/);
    assert.match(sent[0].text, /service: Setup intake/);
    assert.match(sent[0].text, /next_step: Confirm payment in Stripe before setup/);
    assert.doesNotMatch(sent[0].text, /Payment received; start immediately/);
    assert.match(sent[1].subject, /setup details/);
    assert.match(sent[1].text, /check your payment and confirm the next steps by email/);
    assert.doesNotMatch(sent[1].text, /working demo|fixed price/);

    const request = (body) => {
      const stream = (async function* () { yield JSON.stringify(body); })();
      stream.method = 'POST';
      stream.headers = { 'x-forwarded-for': '198.51.100.10' };
      return stream;
    };
    const response = () => ({ setHeader() {}, end(body) { this.body = JSON.parse(body); } });
    const accepted = response();
    await handler(request({ name: 'Example visitor', email: 'visitor@example.com', problem: 'Setup', service: 'Setup intake' }), accepted,
      async () => ({ ok: true, json: async () => ({ id: 'fixture' }) }));
    assert.equal(accepted.statusCode, 200, 'the API accepts the setup discriminator');
    const rejected = response();
    await handler(request({ name: 'Example visitor', email: 'visitor@example.com', problem: 'Setup', service: 'Paid' }), rejected,
      async () => ({ ok: true, json: async () => ({ id: 'fixture' }) }));
    assert.equal(rejected.statusCode, 400, 'the API rejects unrecognized service labels');
  } finally {
    if (previous.resend === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = previous.resend;
    if (previous.followUps === undefined) delete process.env.FOLLOW_UP_EMAILS; else process.env.FOLLOW_UP_EMAILS = previous.followUps;
    if (previous.hubspot === undefined) delete process.env.HUBSPOT_TOKEN; else process.env.HUBSPOT_TOKEN = previous.hubspot;
  }
});
