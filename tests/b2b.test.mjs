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

test('the four complaints packages have scoped deliverables, quote-to-scope pricing and no AI or guarantee wording', () => {
  const packs = offers.COMPLAINT_PACKAGES;
  assert.deepEqual(packs.map((pack) => pack.price), ['Quoted to scope', 'Quoted to scope', 'Quoted to scope', 'Quoted to scope']);
  assert.ok(packs.every((pack) => !('from' in pack)), 'unapproved numeric price floors are removed');
  assert.deepEqual(packs.map((pack) => pack.name), ['Complaints Health Check', 'Post-Complaints Analysis & Board Reporting', 'Tailored Complaints Workflows & Staff Toolkit', 'Complete Complaints Improvement Sprint']);
  const text = JSON.stringify(packs) + JSON.stringify(offers.COMPLAINT_DATA_HANDLING) + JSON.stringify(offers.B2B_SYSTEMS);
  assert.doesNotMatch(text, /\bAI\b|guarantee|fully compliant/i);
  assert.doesNotMatch(JSON.stringify(offers.COMPLAINT_DATA_HANDLING), /30 days|within 30 days/i);
  assert.match(JSON.stringify(offers.COMPLAINT_DATA_HANDLING), /retention.*agreed in the written scope/i);
  assert.ok(packs.every((pack) => pack.limits.length >= 2 && pack.needs.length >= 2 && pack.turnaround));
  assert.ok(offers.B2B_SYSTEMS.every((item) => item.price === 'Quoted to scope'));
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

test('/professional-teams is built, in the sitemap and uses scoped pricing', async () => {
  const sitemap = await readFile(path.join(out, 'sitemap.xml'), 'utf8');
  const html = await page('professional-teams');
  assert.match(sitemap, /\/professional-teams</);
  assert.doesNotMatch(html.replace(/<script[\s\S]*?<\/script>/g, ''), /\bAI\b|ai assistant|ai agent/i, 'advertises AI');
  assert.match(html, /Tell me what(?:'|&#x27;)s not working/);
  assert.match(html, /Quoted to scope/);
  // The retired routes are gone from the export (they redirect in vercel.json).
  for (const route of ['b2b', 'b2b/assessment', 'complaints', 'complaints-improvement', 'audit']) await assert.rejects(page(route), /Missing static page/, route);
});

test('professional-teams shows the four packages, the samples and the honest limits', async () => {
  const html = await page('professional-teams');
  for (const name of ['Complaints Health Check', 'Post-Complaints Analysis &amp; Board Reporting', 'Tailored Complaints Workflows &amp; Staff Toolkit', 'Complete Complaints Improvement Sprint']) assert.ok(html.includes(name), name);
  const cards = html.slice(html.indexOf('id="complaints"'), html.indexOf('id="systems"'));
  assert.equal((cards.match(/class="pt-price">Quoted to scope/g) ?? []).length, 4);
  assert.doesNotMatch(html, /£(295|895|495|1,495)/);
  assert.doesNotMatch(html, /fully compliant|guaranteed|ombudsman-proof/i);
  assert.match(html, /Fictional example for Northgate Advisory|invented/);
  for (const href of ['/complaints/sample/health-check', '/complaints/sample/board-report']) assert.ok(html.includes(`href="${href}"`), href);
  assert.match(html, /no records are needed to ask/i);
  assert.match(html, /Retention and deletion timing for working copies are agreed in the written scope/);
  assert.match(html, /Manazir Hussain/);
});

test('prices keeps the practice tier with no proposed figures', async () => {
  const prices = await page('prices');
  const practices = prices.slice(prices.indexOf('id="practices"'));
  assert.match(practices, /Business System: From £595/);
  assert.match(practices, /Custom Software: From £2,450/);
  assert.doesNotMatch(practices, /From £595 to £2,450|£2,450 maximum|up to £2,450/i);
  assert.doesNotMatch(prices, /£850|£450–£750/);
  assert.match(prices, /Quoted to scope/);
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

test('the header stays focused (seven links and the Free preview button) and the footer is the short list of eight links', async () => {
  const html = await page('index');
  const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'));
  for (const href of ['/what-we-do', '/local-businesses', '/professional-teams', '/prices', '/proof', '/free-toolkit', '/contact']) assert.match(header, new RegExp(`href="${href}"`), href);
  assert.doesNotMatch(header, /href="\/video"/);
  const footer = html.slice(html.indexOf('<footer'), html.indexOf('</footer>'));
  for (const href of ['/what-we-do', '/prices', '/proof', '/about', '/contact', '/faq', '/privacy', '/terms']) assert.match(footer, new RegExp(`href="${href}"`));
});

test('free toolkit: free-forever line, six icon topics, calculator, sources on every fact, old URL redirects', async () => {
  const html = await page('free-toolkit');
  assert.match(html, /This is free, forever\./);
  assert.equal((html.match(/class="mw-kit-tile"/g) ?? []).length, 6);
  for (const id of ['getting-paid', 'customers', 'tax', 'staff', 'data', 'safety']) assert.match(html, new RegExp(`id="${id}"`), id);
  assert.match(html, /class="mw-calc"/);
  assert.match(html, /Pre-Action Protocol for Debt Claims/);
  const { CATEGORIES } = await import('../app/free-toolkit/toolkit.ts');
  for (const item of CATEGORIES.flatMap((c) => c.items)) {
    if (item.kind !== 'template') assert.ok(item.sources.length > 0, `${item.title} needs a source`);
    assert.ok(item.kind === 'template' ? item.text : item.points?.length, item.title);
    assert.doesNotMatch(JSON.stringify(item), /\u2014|\bAI\b/, item.title);
  }
  const vercel = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.equal(vercel.redirects.find((r) => r.source === '/free-templates')?.destination, '/free-toolkit');
});

test('late payment maths: compensation bands, simple daily interest and the reference rate half years', async () => {
  const { compensation, lateInterest, referenceRate } = await import('../app/free-toolkit/late-payment.ts');
  assert.deepEqual([999.99, 1000, 9999.99, 10000].map(compensation), [40, 70, 70, 100]);
  assert.equal(Math.round(lateInterest(1000, 3.75, 50) * 100) / 100, 16.1);
  assert.equal(referenceRate('2025-06-30'), 4.25, 'interest starts 1 July 2025, so the 30 June 2025 rate');
  assert.equal(referenceRate('2025-06-29'), 4.75);
  assert.equal(referenceRate('2026-10-01'), 3.75);
  assert.equal(referenceRate('2026-12-31'), undefined, 'starts in 2027: rate not known yet');
  assert.equal(referenceRate('2024-06-01'), undefined);
  assert.equal(referenceRate('not a date'), undefined);
});
