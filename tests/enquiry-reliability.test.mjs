import assert from 'node:assert/strict';
import test from 'node:test';
import handler, { deliverEnquiry, cleanPageUrl } from '../api/enquiry.js';
const input = { name: 'Example visitor', email: 'visitor@example.com', problem: 'Missed calls' };
const ok = { ok: true, json: async () => ({ id: 'test-id' }) };
test('owner ok, slow visitor mail does not delay beyond one parallel stage', async () => {
  process.env.RESEND_API_KEY = 'test-placeholder';
  const started = Date.now();
  const result = await deliverEnquiry(input, async (url, options) => {
    const msg = JSON.parse(options.body);
    if (msg.to[0] === 'visitor@example.com') return new Promise(resolve => setTimeout(() => resolve(ok), 200));
    return ok;
  });
  assert.equal(result.ok, true); assert.equal(result.confirmationSent, true);
  assert.ok(Date.now() - started < 1000);
});
test('owner ok, visitor mail throwing still returns ok with confirmationSent false', async () => {
  process.env.RESEND_API_KEY = 'test-placeholder';
  const result = await deliverEnquiry(input, async (url, options) => {
    if (JSON.parse(options.body).to[0] === 'visitor@example.com') throw new Error('boom');
    return ok;
  });
  assert.deepEqual(result, { ok: true, confirmationSent: false });
});
test('follow-ups and HubSpot run in parallel and never fail the enquiry', async () => {
  process.env.RESEND_API_KEY = 'test-placeholder'; process.env.HUBSPOT_TOKEN = 'x'; process.env.FOLLOW_UP_EMAILS = 'on';
  let inflight = 0, peak = 0;
  const result = await deliverEnquiry(input, async (url, options) => {
    if (String(url).includes('hubapi')) throw new Error('hubspot down');
    const msg = JSON.parse(options.body);
    if (msg.scheduled_at || msg.to[0] === 'visitor@example.com') { inflight++; peak = Math.max(peak, inflight); await new Promise(r => setTimeout(r, 30)); inflight--; }
    return ok;
  });
  delete process.env.HUBSPOT_TOKEN; delete process.env.FOLLOW_UP_EMAILS;
  assert.equal(result.ok, true); assert.ok(peak >= 4, `peak ${peak}`);
});
function fakeRes() { return { headers: {}, setHeader(k, v) { this.headers[k] = v; }, end(b) { this.body = b; } }; }
function fakeReq(body, ip) { const r = (async function* () { yield JSON.stringify(body); })(); r.method = 'POST'; r.headers = { 'x-forwarded-for': ip }; return r; }
test('owner mail failure returns 502 and sends nothing else', async () => {
  process.env.RESEND_API_KEY = 'test-placeholder';
  let calls = 0; const res = fakeRes();
  await handler(fakeReq(input, '10.0.0.1'), res, async () => { calls++; return { ok: false }; });
  assert.equal(res.statusCode, 502); assert.equal(calls, 1);
  assert.deepEqual(JSON.parse(res.body), { ok: false, confirmationSent: false });
});
test('page URL is included in the owner mail when valid, omitted otherwise', async () => {
  process.env.RESEND_API_KEY = 'test-placeholder';
  const run = async (_url) => { const sent = []; await deliverEnquiry({ ...input, _url }, async (u, o) => { sent.push(JSON.parse(o.body)); return ok; }); return sent[0].text; };
  assert.match(await run('https://www.mazworks.uk/free-plan?package=Starter#x'), /submitted_from: https:\/\/www\.mazworks\.uk\/free-plan$/m);
  assert.match(await run('https://mazos-site-git-x.vercel.app/free-plan'), /submitted_from: https:\/\/mazos-site-git-x\.vercel\.app\/free-plan/);
  for (const bad of ['http://www.mazworks.uk/', 'https://evil.example/free-plan', 'https://www.mazworks.uk.evil.com/', 'javascript:alert(1)', 5, undefined]) assert.doesNotMatch(await run(bad), /submitted_from/);
  assert.equal(cleanPageUrl('https://user:pw@www.mazworks.uk/'), '');
});
test('handler accepts _url and returns 200', async () => {
  process.env.RESEND_API_KEY = 'test-placeholder'; const res = fakeRes();
  await handler(fakeReq({ ...input, _url: 'https://www.mazworks.uk/free-plan' }, '10.0.0.2'), res, async () => ok);
  assert.equal(res.statusCode, 200);
});
