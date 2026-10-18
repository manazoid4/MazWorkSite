import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';
import { acknowledgementEmail, addWorkingDays, caseHealth, countByCategory, DEMO_CASES, draftReply, nextCaseId, workingDaysBetween } from '../app/complaints/model.ts';
import { attributionLine } from '../app/linkedin-source.ts';
import { deliverEnquiry } from '../api/enquiry.js';
import demoTrigger, { allowDemo, toE164 } from '../api/demo-trigger.js';

// B2B launch (19 Oct): the complaints demo logic, the audit sums, campaign capture,
// the lead alerts and the SMS demo endpoint, plus the static pages those feed.

// audit/model.ts imports offers without an extension, so load both through the same shim as the other tests.
const load = async (file, requireMap = {}) => {
  const exports = {};
  new Function('exports', 'require', ts.transpileModule(await readFile(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(exports, (name) => requireMap[name]);
  return exports;
};
const offers = await load('app/offers.ts');
const auditModel = await load('app/audit/model.ts', { '../offers': offers });
const { audit, summarise, TASKS } = auditModel;

test('working-day maths skips weekends', () => {
  assert.equal(addWorkingDays('2026-10-16', 1), '2026-10-19'); // Friday → Monday
  assert.equal(addWorkingDays('2026-10-14', 2), '2026-10-16');
  assert.equal(workingDaysBetween('2026-10-16', '2026-10-19'), 1);
  assert.equal(workingDaysBetween('2026-10-19', '2026-10-16'), -1);
  assert.equal(workingDaysBetween('2026-10-19', '2026-10-19'), 0);
});

test('demo cases cover on-track, due soon and overdue, and the most urgent sorts first', () => {
  const health = Object.fromEntries(DEMO_CASES.map((item) => [item.id, caseHealth(item).health]));
  assert.equal(health['C-1003'], 'overdue');
  assert.equal(health['C-1001'], 'due-soon');
  assert.equal(health['C-1002'], 'on-track');
  const sorted = [...DEMO_CASES].sort((a, b) => caseHealth(a).daysLeft - caseHealth(b).daysLeft);
  assert.equal(sorted[0].id, 'C-1003');
  assert.equal(nextCaseId(DEMO_CASES), 'C-1006');
  assert.equal(Object.values(countByCategory(DEMO_CASES)).reduce((a, b) => a + b, 0), DEMO_CASES.length);
});

test('draft replies are drafts for a person: placeholders left, no compliance or outcome promises', () => {
  for (const item of DEMO_CASES) {
    const text = draftReply(item) + acknowledgementEmail(item);
    assert.match(text, /\[Your name\]/);
    assert.doesNotMatch(text, /complian|guarantee|ombudsman|resolved/i);
  }
});

test('audit sums use the visitor numbers and one visible assumption', () => {
  const result = audit([{ id: 'complaints', hours: 3 }, { id: 'onboarding', hours: 4 }], 40, 50);
  assert.equal(result.weekly, 7);
  assert.equal(result.yearHours, 322);
  assert.equal(result.savedHours, 161);
  assert.equal(result.savedValue, 6440);
  assert.deepEqual(result.recommended.map((item) => item.name), ['Business System', 'Complaints & Escalation Tracker']);
  assert.deepEqual(audit([], 40, 50), { weekly: 0, yearHours: 0, savedHours: 0, savedValue: 0, recommended: [] });
  assert.equal(audit([{ id: 'copying', hours: 0 }, { id: 'nonsense', hours: 5 }], 40, 50).weekly, 0);
  assert.equal(audit(TASKS.map((task) => ({ id: task.id, hours: 2 })), 40, 50).recommended.length, 3);
  assert.match(summarise([{ id: 'copying', hours: 2 }], 40, 50, ['Xero']), /Tools in use: Xero/);
});

test('the complaints offer never promises compliance or resolution', () => {
  const text = JSON.stringify(offers.COMPLAINTS_SETUP) + JSON.stringify(offers.B2B_SYSTEMS);
  assert.doesNotMatch(text, /\bAI\b|guarantee|compliant/i);
  assert.equal(offers.COMPLAINTS_SETUP.from, 795);
});

test('campaign capture keeps only safe labels', () => {
  assert.equal(attributionLine('?utm_source=linkedin&utm_medium=social&utm_campaign=oct-post-1', 'https://www.linkedin.com/feed/'), 'source=linkedin; medium=social; campaign=oct-post-1; referrer=linkedin');
  assert.equal(attributionLine('?utm_source=<script>&utm_campaign=ok', ''), 'campaign=ok');
  assert.equal(attributionLine('?utm_source=' + 'x'.repeat(60), 'not a url'), '');
});

test('a test enquiry reaches the owner email, HubSpot and the phone alert, with campaign details', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => { calls.push({ url: String(url), body: JSON.parse(init.body) }); return new Response(JSON.stringify({ id: 'x' }), { status: 200 }); };
  Object.assign(process.env, { RESEND_API_KEY: 'test', HUBSPOT_TOKEN: 'test', TELEGRAM_BOT_TOKEN: 'bot', TELEGRAM_CHAT_ID: '1' });
  try {
    const result = await deliverEnquiry({ name: 'Test Person', email: 'test@example.com', problem: 'Complaints are in my inbox', service: 'Free Preview & Fixed Price', source: 'b2b', attribution: 'source=linkedin; campaign=oct-post-1', request_id: 'abc-123' }, fetchImpl);
    assert.equal(result.ok, true);
    const owner = calls.find((call) => call.url.includes('resend.com') && call.body.to[0] === 'info@mazworks.uk');
    assert.match(owner.body.text, /attribution: source=linkedin; campaign=oct-post-1/);
    assert.match(owner.body.text, /source: b2b/);
    assert.match(calls.find((call) => call.url.includes('hubapi.com')).body.properties.message, /Campaign: source=linkedin/);
    const alert = calls.find((call) => call.url.includes('api.telegram.org'));
    assert.match(alert.body.text, /Test Person/);
    assert.doesNotMatch(alert.body.text, /test@example\.com/);
  } finally {
    for (const key of ['RESEND_API_KEY', 'HUBSPOT_TOKEN', 'TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID']) delete process.env[key];
  }
});

test('a forged attribution string is dropped, not forwarded', async () => {
  const calls = [];
  process.env.RESEND_API_KEY = 'test';
  try {
    await deliverEnquiry({ name: 'A', email: 'a@example.com', problem: 'x', service: 'Free Preview & Fixed Price', attribution: 'x\nTo: evil@example.com <b>' }, async (url, init) => { calls.push(JSON.parse(init.body)); return new Response('{"id":"x"}'); });
    assert.doesNotMatch(calls[0].text, /evil@example\.com|attribution:/);
  } finally { delete process.env.RESEND_API_KEY; }
});

test('demo text: UK mobiles only, consent required, simulated unless texting is configured, limited per number', async () => {
  assert.equal(toE164('07912 345678'), '+447912345678');
  assert.equal(toE164('+44 7912 345678'), '+447912345678');
  assert.equal(toE164('02079460000'), '');
  assert.equal(toE164('07912'), '');

  const run = async (body, fetchImpl) => {
    let status = 0; let payload = '';
    const req = { method: 'POST', headers: { 'x-forwarded-for': `203.0.113.${Math.floor(Math.random() * 200)}` }, async *[Symbol.asyncIterator]() { yield JSON.stringify(body); } };
    const res = { setHeader() {}, set statusCode(value) { status = value; }, end(text) { payload = text; } };
    await demoTrigger(req, res, fetchImpl);
    return { status, body: JSON.parse(payload) };
  };
  const never = async () => { throw new Error('must not call the texting service'); };

  assert.equal((await run({ phone: '07912345678' }, never)).status, 400); // no consent
  assert.equal((await run({ phone: '07912345678', consent: true }, never)).body.simulated, true); // not configured

  Object.assign(process.env, { TWILIO_ACCOUNT_SID: 'AC1', TWILIO_AUTH_TOKEN: 't', TWILIO_FROM: '+15005550006' });
  try {
    const sent = [];
    const fetchImpl = async (url, init) => { sent.push(init.body); return new Response('{}', { status: 201 }); };
    const first = await run({ phone: '07700900123', consent: true }, fetchImpl);
    assert.deepEqual(first, { status: 200, body: { ok: true, simulated: false } });
    assert.match(sent[0], /To=%2B447700900123/);
    assert.equal((await run({ phone: '07700900123', consent: true }, fetchImpl)).status, 429);
    assert.equal(sent.length, 1);
    assert.equal(allowDemo('198.51.100.1', '+447700900999'), true);
    assert.equal(allowDemo('198.51.100.1', '+447700900998'), false); // same IP within 24h
  } finally { for (const key of ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_FROM']) delete process.env[key]; }
});

const out = path.join(process.cwd(), 'out');
const page = async (route) => {
  for (const candidate of [path.join(out, `${route}.html`), path.join(out, route, 'index.html')]) {
    try { return (await readFile(candidate, 'utf8')).replaceAll('<!-- -->', ''); } catch { /* try next shape */ }
  }
  throw new Error(`Missing static page ${route}`);
};

test('the new pages are built, sit in the sitemap, and keep the one main action', async () => {
  const sitemap = await readFile(path.join(out, 'sitemap.xml'), 'utf8');
  for (const route of ['b2b', 'complaints', 'audit']) {
    const html = await page(route);
    assert.match(sitemap, new RegExp(`/${route}<`));
    assert.doesNotMatch(html.replace(/<script[\s\S]*?<\/script>/g, ''), /\bAI\b|ai assistant|ai agent/i, `${route} advertises AI`);
  }
  assert.match(await page('b2b'), /Automate your practice operations without hiring more admin staff\./);
  assert.match(await page('b2b'), /Get my free preview/);
  assert.match(await page('complaints'), /From £795/);
});

test('complaints page is honest about what it is not', async () => {
  const html = await page('complaints');
  assert.match(html, /Legal advice, or a promise that your process meets any regulator/);
  assert.match(html, /invented/i);
  assert.doesNotMatch(html, /fully compliant|guaranteed|ombudsman-proof/i);
});

test('proof labels demonstrations and publishes no invented results', async () => {
  const html = await page('proof');
  assert.match(html, /Internal demonstration, not a client/);
  assert.match(html, /No client quotes yet/);
  assert.match(html, /View a scope sheet/);
});

test('header has the four main links, video and objects moved to the Lab group', async () => {
  const html = await page('index');
  assert.match(html, /Lab \/ Physical products/);
  const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'));
  assert.match(header, /href="\/proof"/);
  assert.doesNotMatch(header, /href="\/video"/);
});
