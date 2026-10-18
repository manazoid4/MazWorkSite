import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';
import { ACTIONS, CATEGORIES, COMPLAINTS, TARGET_DAYS, byCategory, buildComplaints, findings, rootCauseTable, summary } from '../app/complaints/sample-data.ts';
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

test('the sample complaints data is fixed, complete and internally consistent', () => {
  assert.equal(COMPLAINTS.length, 120);
  assert.deepEqual(buildComplaints(), COMPLAINTS); // same seed, same records
  assert.equal(new Set(COMPLAINTS.map((row) => row.ref)).size, 120);
  assert.ok(COMPLAINTS.every((row) => CATEGORIES.includes(row.category) && row.daysToClose >= 3 && row.redress >= 0));
  assert.equal(byCategory(COMPLAINTS).reduce((sum, row) => sum + row.total, 0), 120);
  const s = summary(COMPLAINTS);
  assert.equal(s.total, 120);
  assert.ok(s.lastQuarter > s.firstQuarter, 'the story: more complaints late in the year than early');
  assert.ok(s.withinTarget > 0 && s.withinTarget < 100);
});

test('findings are computed from the records and the actions answer them', () => {
  const [first, , handover, training] = findings(COMPLAINTS);
  const top = rootCauseTable(COMPLAINTS)[0];
  assert.ok(first.headline.startsWith(top.cause));
  assert.match(first.evidence, new RegExp(`${top.total} of 120 complaints`));
  assert.match(handover.evidence, new RegExp(`against a ${TARGET_DAYS}-day target`));
  assert.match(training.evidence, /complaints \(\d+%\) trace to it/);
  assert.equal(ACTIONS.length, 6);
  assert.ok(ACTIONS.every((item) => item.owner && item.due && ['High', 'Medium', 'Low'].includes(item.priority)));
  const text = JSON.stringify(findings(COMPLAINTS)) + ACTIONS.map((item) => item.action).join(' ');
  assert.doesNotMatch(text, /\bAI\b|complian|guarantee/i);
});

test('audit sums use the visitor numbers and one visible assumption', () => {
  const result = audit([{ id: 'complaints', hours: 3 }, { id: 'onboarding', hours: 4 }], 40, 50);
  assert.equal(result.weekly, 7);
  assert.equal(result.yearHours, 322);
  assert.equal(result.savedHours, 161);
  assert.equal(result.savedValue, 6440);
  assert.deepEqual(result.recommended.map((item) => item.name), ['Business System', 'Complaints Health Check']);
  assert.deepEqual(audit([], 40, 50), { weekly: 0, yearHours: 0, savedHours: 0, savedValue: 0, recommended: [] });
  assert.equal(audit([{ id: 'copying', hours: 0 }, { id: 'nonsense', hours: 5 }], 40, 50).weekly, 0);
  assert.equal(audit(TASKS.map((task) => ({ id: task.id, hours: 2 })), 40, 50).recommended.length, 3);
  assert.match(summarise([{ id: 'copying', hours: 2 }], 40, 50, ['Xero']), /Tools in use: Xero/);
});

test('the four complaints packages carry the agreed starting prices and no AI or guarantee wording', () => {
  const packs = offers.COMPLAINT_PACKAGES;
  assert.deepEqual(packs.map((pack) => pack.from), [295, 895, 495, 1495]);
  assert.deepEqual(packs.map((pack) => pack.name), ['Complaints Health Check', 'Post-Complaints Analysis & Board Reporting', 'Tailored Complaints Workflows & Staff Toolkit', 'Complete Complaints Improvement Sprint']);
  const text = JSON.stringify(packs) + JSON.stringify(offers.COMPLAINT_DATA_HANDLING) + JSON.stringify(offers.B2B_SYSTEMS);
  assert.doesNotMatch(text, /\bAI\b|guarantee|fully compliant/i);
  assert.ok(packs.every((pack) => pack.limits.length >= 2 && pack.needs.length >= 2 && pack.turnaround));
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
  assert.match(await page('complaints'), /From £295/);
});

test('complaints page shows the four packages, the samples and the honest limits', async () => {
  const html = await page('complaints');
  for (const name of ['Complaints Health Check', 'Post-Complaints Analysis &amp; Board Reporting', 'Tailored Complaints Workflows &amp; Staff Toolkit', 'Complete Complaints Improvement Sprint']) assert.ok(html.includes(name), name);
  for (const price of ['From £295', 'From £895', 'From £495', 'From £1,495']) assert.ok(html.includes(price), price);
  assert.match(html, /Not legal or regulatory advice/);
  assert.match(html, /Fictional example for Northgate Advisory/);
  assert.match(html, /Easy to see\. Easy to understand\. Easy to act on\./);
  assert.match(html, /What this tells you/);
  assert.doesNotMatch(html, /excel|powerpoint|spreadsheet|xlsx/i, 'complaints page names the tools clients could use themselves');
  assert.doesNotMatch(html, /fully compliant|guaranteed|ombudsman-proof/i);
});

test('the downloadable sample PDFs exist and are real files', async () => {
  const dir = path.join(process.cwd(), 'public', 'samples', 'complaints');
  for (const file of ['sample-health-check-report.pdf', 'sample-board-report.pdf']) assert.equal((await readFile(path.join(dir, file))).subarray(0, 4).toString(), '%PDF', file);
  for (const route of ['complaints/sample/health-check', 'complaints/sample/board-report']) assert.match(await page(route), /Fictional example for Northgate Advisory/);
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
