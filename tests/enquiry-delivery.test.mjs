import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

// Exercise the real TypeScript module without changing the browser import contract.
const source = await readFile(new URL('../app/enquiry.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const enquiry = {};
const offers = {};
new Function('exports', ts.transpileModule(await readFile(new URL('../app/offers.ts', import.meta.url),'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(offers);
new Function('exports', 'require', 'window', outputText)(enquiry, name => name === './offers' ? offers : ({ CONTACT_EMAIL: 'recipient@example.com' }), globalThis);

test('delivery needs an explicit provider acknowledgement, not just HTTP 200', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('{}'));

  for (const body of ['{}', 'null', '[]', '{"success":1}', '<html>Unavailable</html>', '']) {
    globalThis.fetch = async () => new Response(body);
    assert.deepEqual(await enquiry.sendEnquiry({ problem: 'Example enquiry' }), { ok: false, reason: 'rejected' }, body);
  }
});

test('delivery accepts both documented confirmation shapes and rejects provider errors', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('{}'));

  for (const success of [true, 'true', false, 'false']) {
    globalThis.fetch = async () => Response.json({ success });
    assert.deepEqual(await enquiry.sendEnquiry({}), success === true || success === 'true'
      ? { ok: true } : { ok: false, reason: 'rejected' });
  }
  globalThis.fetch = async () => Response.json({ success: true }, { status: 503 });
  assert.deepEqual(await enquiry.sendEnquiry({}), { ok: false, reason: 'rejected' });
});

test('network loss and abort while reading confirmation never report delivery', async (t) => {

  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('offline'); });
  assert.deepEqual(await enquiry.sendEnquiry({}), { ok: false, reason: 'network' });
  globalThis.fetch = async (_url, { signal }) => ({
    ok: true,
    json: () => new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')), { once: true });
    }),
  });
  assert.deepEqual(await enquiry.sendEnquiry({}, 5), { ok: false, reason: 'timeout' });
});

test('email recovery preserves punctuation, multiline details and the reply address', () => {
  const href = new URL(enquiry.buildRecoveryMailto('Quote & question', [
    ['Name', 'Example Customer'], ['Email', 'customer@example.com'],
    ['Problem', 'Bookings & follow-up\nSecond line + £49'], ['Business', ''],
  ]));
  assert.equal(href.searchParams.get('subject'), 'Quote & question');
  assert.equal(href.searchParams.get('body'), 'Name: Example Customer\nEmail: customer@example.com\nProblem: Bookings & follow-up\nSecond line + £49');
});

test('plan delivery preserves context through fallback and never bypasses validation', async (t) => {
  const payload = { problem: 'Chasing quotes', customer_message: 'Keep my own words.', trade: 'roofers', proof_id: 'roofers', source_page: '/for/roofers', interested_in: 'Not chosen' };
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    return url === '/api/enquiry' ? Response.json({ ok: false }, { status: 502 }) : Response.json({ success: 'true' });
  });
  assert.deepEqual(await enquiry.sendPlanEnquiry(payload), { ok: true });
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[1].body, payload);
  calls.length = 0;
  globalThis.fetch = async (url) => { calls.push(url); return Response.json({ ok: false }, { status: 400 }); };
  assert.deepEqual(await enquiry.sendPlanEnquiry(payload), { ok: false, reason: 'rejected', status: 400 });
  assert.deepEqual(calls, ['/api/enquiry']);
});

test('API timeout and fallback failure stay truthful with recoverable context', async (t) => {
  t.mock.method(globalThis, 'fetch', async url => {
    if (url === '/api/enquiry') throw new DOMException('Timed out', 'TimeoutError');
    return Response.json({ success: 'false' });
  });
  assert.deepEqual(await enquiry.sendPlanEnquiry({ trade: 'roofers', problem: 'Chasing quotes' }), { ok: false, reason: 'rejected' });
});
