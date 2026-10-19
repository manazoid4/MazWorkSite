import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

process.env.RESEND_API_KEY ??= 're_test_key';
const { default: handler } = await import('../api/subscribe.js');

function fakeReq(body, { json = true, method = 'POST' } = {}) {
  const req = new EventEmitter();
  req.method = method;
  req.headers = json
    ? { 'content-type': 'application/json', accept: 'application/json' }
    : { 'content-type': 'application/x-www-form-urlencoded', accept: 'text/html' };
  req.destroy = () => {};
  setImmediate(() => {
    if (body !== undefined) req.emit('data', Buffer.from(json ? JSON.stringify(body) : new URLSearchParams(body).toString()));
    req.emit('end');
  });
  return req;
}

function fakeRes() {
  return {
    statusCode: 200, headers: {}, body: '',
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    end(chunk) { if (chunk) this.body += chunk; return this; },
  };
}

function recordingFetch(status = 200, text = '', emailStatus = 200) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, headers: init.headers, body: JSON.parse(init.body) });
    const s = url.endsWith('/emails') ? emailStatus : status;
    return { ok: s < 300, status: s, text: async () => text };
  };
  return { calls, impl };
}

test('a valid email is added to Resend contacts and reported as joined', async () => {
  const f = recordingFetch();
  const res = fakeRes();
  await handler(fakeReq({ email: '  Owner@Shop.co.uk ' }), res, f.impl);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.body), { ok: true });
  assert.equal(f.calls.length, 2, "contact, note to Maz; no automatic email to the visitor (Maz, 15 Oct)");
  assert.equal(f.calls[0].url, 'https://api.resend.com/contacts');
  assert.equal(f.calls[0].headers.authorization, 'Bearer re_test_key');
  assert.deepEqual(f.calls[0].body, { email: 'owner@shop.co.uk', unsubscribed: false });
});

test('a bad email is refused before anything reaches Resend', async () => {
  const f = recordingFetch();
  const res = fakeRes();
  await handler(fakeReq({ email: 'not-an-email' }), res, f.impl);
  assert.equal(res.statusCode, 400);
  assert.equal(JSON.parse(res.body).reason, 'invalid-email');
  assert.equal(f.calls.length, 0);
});

test('a filled honeypot looks like success to the bot but sends nothing', async () => {
  const f = recordingFetch();
  const res = fakeRes();
  await handler(fakeReq({ email: 'bot@spam.com', website: 'http://spam' }), res, f.impl);
  assert.deepEqual(JSON.parse(res.body), { ok: true });
  assert.equal(f.calls.length, 0);
});

test('signing up twice still reads as joined', async () => {
  const res = fakeRes();
  await handler(fakeReq({ email: 'owner@shop.co.uk' }), res, recordingFetch(409, '{"message":"Contact already exists"}').impl);
  assert.deepEqual(JSON.parse(res.body), { ok: true });
});

test('a Resend rejection is reported as a failure, never as joined', async () => {
  const res = fakeRes();
  await handler(fakeReq({ email: 'owner@shop.co.uk' }), res, recordingFetch(400).impl);
  assert.equal(res.statusCode, 502);
  assert.equal(JSON.parse(res.body).ok, false);
});

test('without JavaScript the form posts normally and is redirected back with the outcome', async () => {
  const ok = fakeRes();
  await handler(fakeReq({ email: 'owner@shop.co.uk' }, { json: false }), ok, recordingFetch().impl);
  assert.equal(ok.statusCode, 303);
  assert.equal(ok.headers.location, '/lab?subscribed=1#newsletter');

  const bad = fakeRes();
  await handler(fakeReq({ email: 'nope' }, { json: false }), bad, recordingFetch().impl);
  assert.equal(bad.headers.location, '/lab?subscribed=0#newsletter');
});

test('only POST is accepted', async () => {
  const res = fakeRes();
  await handler(fakeReq(undefined, { method: 'GET' }), res, recordingFetch().impl);
  assert.equal(res.statusCode, 405);
});

test('the /lab signup posts to the API, has a hidden honeypot and says how to unsubscribe', async () => {
  const html = await readFile(new URL('../out/lab.html', import.meta.url), 'utf8');
  const section = html.match(/<section class="mw-newsletter"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, '/lab should include the mailing-list signup');
  const form = section.match(/<form[^>]*>/)?.[0] ?? '';
  assert.match(form, /method="post"/);
  assert.match(form, /action="\/api\/subscribe"/);
  const input = (name) => section.match(new RegExp(`<input[^>]*name="${name}"[^>]*>`))?.[0] ?? '';
  assert.match(input('email'), /type="email"/);
  assert.match(input('website'), /tabindex="-1"/i);
  assert.match(input('website'), /aria-hidden="true"/);
  assert.match(section, /unsubscribe any time/i);
});

test('each signup emails Maz, from the verified domain, with the subscriber as reply-to', async () => {
  const f = recordingFetch();
  await handler(fakeReq({ email: 'owner@shop.co.uk' }), fakeRes(), f.impl);
  const mail = f.calls.find((call) => call.url === 'https://api.resend.com/emails');
  assert.ok(mail, 'a notification email should be sent');
  assert.deepEqual(mail.body.to, ['info@mazworks.uk']);
  assert.match(mail.body.from, /@mazworks\.uk>$/);
  assert.equal(mail.body.reply_to, 'owner@shop.co.uk');
  assert.match(mail.body.subject, /owner@shop\.co\.uk/);
});

test('a failed notification never turns a saved signup into an error', async () => {
  const res = fakeRes();
  await handler(fakeReq({ email: 'owner@shop.co.uk' }), res, recordingFetch(200, '', 500).impl);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.body), { ok: true });
});

test('no notification is sent when the signup itself failed', async () => {
  const f = recordingFetch(400);
  await handler(fakeReq({ email: 'owner@shop.co.uk' }), fakeRes(), f.impl);
  assert.equal(f.calls.some((call) => call.url.endsWith('/emails')), false);
});

test('footer signups carry only known trade and source tags, and return to the same page', async () => {
  const { signupTags, returnPath } = await import('../api/subscribe.js');
  assert.deepEqual(signupTags({ source: 'footer', trade: 'salon', return: 'footer-signup' }), { source: 'footer', trade: 'salon', formId: 'footer-signup' });
  assert.deepEqual(signupTags({ source: '<b>x</b>', trade: 'plumber', return: 'a b' }), { source: '', trade: '', formId: '' });
  const req = { headers: { host: 'www.mazworks.uk', referer: 'https://www.mazworks.uk/for/garages?x=1' } };
  assert.deepEqual(returnPath(req, 'footer-signup'), { path: '/for/garages', formId: 'footer-signup' });
  assert.deepEqual(returnPath({ headers: { host: 'www.mazworks.uk', referer: 'https://evil.example/p' } }, 'footer-signup'), { path: '/lab', formId: 'newsletter' });
});

test('the signup email to Maz names the trade the visitor picked', async () => {
  const f = recordingFetch();
  await handler(fakeReq({ email: 'owner@shop.co.uk', source: 'footer', trade: 'cafe' }), fakeRes(), f.impl);
  assert.match(f.calls[1].body.subject, /\(cafe\)/);
  assert.match(f.calls[1].body.text, /signed up from: footer/);
});

test('every page footer offers the general enquiry, optional preview and newsletter', async () => {
  const src = await readFile(new URL('../app/footer-convert.tsx', import.meta.url), 'utf8');
  assert.match(src, /ENQUIRY_CTA/);
  assert.match(src, /You don.t need to name the right service/);
  assert.match(src, /free-plan\?src=footer-convert/);
  assert.match(src, /<NewsletterSignup/);
  const chrome = await readFile(new URL('../app/site-chrome.tsx', import.meta.url), 'utf8');
  assert.match(chrome, /<FooterConvert \/>/);
  const home = await readFile(new URL('../out/index.html', import.meta.url), 'utf8');
  assert.match(home, /href="\/contact\?src=footer-convert#contact"/);
  assert.match(home, /id="footer-signup"/);
});
