import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { deliverEnquiry } from '../api/enquiry.js';

// Real TS modules, as in trade-context.test.mjs.
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const code = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function('exports', 'require', code)(exports, name => load(path.resolve(path.dirname(file), `${name}.ts`)));
  return exports;
}
const context = load('app/trade-context.ts');
const { INDUSTRY_PROOFS } = load('app/for/industry-proof-data.ts');
const { INDUSTRY_VOICE } = load('app/for/industry-voice.ts');
const IDS = Object.keys(INDUSTRY_PROOFS);

const page = id => {
  const file = path.join('out', 'for', `${id}.html`);
  return readFileSync(file, 'utf8');
};
const decode = value => value.replace(/&amp;/g, '&');

test('all 14 industry pages show their own example, labelled as an example', () => {
  assert.equal(IDS.length, 14);
  for (const id of IDS) {
    const html = page(id);
    assert.match(html, new RegExp(`class="ip-proof"[^>]*data-industry="${id}"|data-industry="${id}"[^>]*class="ip-proof"`), `${id}: proof present`);
    assert.match(html, /Example · made-up business, nothing is sent/, `${id}: labelled`);
    assert.ok(html.includes(INDUSTRY_PROOFS[id].moment.replace(/’/g, '’')), `${id}: its own moment is in the static HTML`);
    assert.match(html, /<noscript>/, `${id}: readable without JavaScript`);
    assert.ok(html.includes(INDUSTRY_VOICE[id].objection.q.replace(/’/g, '’')), `${id}: its own worry is answered`);
  }
});

test('the examples really differ: no shared moment, step title, opening line or field set', () => {
  const all = Object.values(INDUSTRY_PROOFS);
  assert.equal(new Set(all.map(p => p.moment)).size, all.length);
  assert.equal(new Set(all.map(p => p.steps[0].customer)).size, all.length);
  assert.equal(new Set(all.map(p => p.decision)).size, all.length);
  assert.equal(new Set(all.map(p => p.artifact)).size, all.length);
  const titles = all.flatMap(p => p.steps.map(s => s.title));
  assert.equal(new Set(titles).size, titles.length, 'step titles are written per industry');
  assert.equal(new Set(all.map(p => p.fields.map(f => f.label).join('|'))).size, all.length);
});

test('copy rules hold in the example and voice data: no price, no AI, no quick fix, no contact details', () => {
  const text = JSON.stringify([INDUSTRY_PROOFS, INDUSTRY_VOICE]);
  assert.doesNotMatch(text, /£|\bAI\b|artificial intelligence|quick.?fix|website repair/i);
  assert.doesNotMatch(text, /@[a-z]+\.|https?:|\b0\d{9,10}\b|\+44/i);
  assert.doesNotMatch(text, /\b(our clients|testimonial|we helped|case study|\d+%)/i);
});

test('every enquiry link on a page carries the industry, the origin page and the job', () => {
  for (const id of IDS) {
    const links = [...page(id).matchAll(/href="(\/free-plan\?[^"]*src=for-[^"]*)"/g)].map(match => decode(match[1]));
    assert.ok(links.length >= 3, `${id}: has trade links`);
    for (const link of links) {
      const url = new URL(link, 'https://example.test');
      assert.equal(url.searchParams.get('trade'), id, `${id}: ${link}`);
      assert.equal(url.searchParams.get('from'), `/for/${id}`, `${id}: ${link}`);
      // The job is carried by every page link; a named package link carries the package instead.
      if (!url.searchParams.has('package')) assert.equal(url.searchParams.get('problem'), INDUSTRY_PROOFS[id].problem, `${id}: ${link}`);
      assert.equal(url.hash, '#leak-check-form');
    }
  }
});

test('journey: a niche page link pre-fills industry and job, and the delivered enquiry contains them', async () => {
  process.env.RESEND_API_KEY = 'test-placeholder';
  const link = decode(/href="(\/free-plan\?[^"]*src=for-roofers[^"]*)"/.exec(page('roofers'))[1]);
  const read = context.readTradeContext(new URL(link, 'https://example.test').search);
  assert.equal(read.trade, 'roofers');
  assert.equal(read.problem, 'lead-capture');
  assert.equal(read.sourcePage, '/for/roofers');
  assert.equal(read.proof, '', 'viewing the page alone never claims a demo was played');
  // What the form posts, as the form builds it.
  const fields = Object.fromEntries(context.tradeContextFields(read));
  assert.equal(fields.Industry, 'Roofers');
  const sent = [];
  const result = await deliverEnquiry({
    name: 'Example visitor', email: 'visitor@example.com', problem: 'Keeping enquiries in one place',
    trade: read.trade, industry: fields.Industry, problem_id: read.problem, proof_id: read.proof, source_page: read.sourcePage,
    source: 'li-3 → for-roofers', interested_in: 'Not chosen',
  }, async (_url, options) => { sent.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ id: 'fixture' }) }; });
  assert.equal(result.ok, true);
  for (const line of ['trade: roofers', 'industry: Roofers', 'problem_id: lead-capture', 'source_page: /for/roofers', 'source: li-3 → for-roofers', 'next_step: Send a free demo and fixed price; not an order']) {
    assert.ok(sent[0].text.includes(line), line);
  }
});

test('journey: after playing the example the delivered enquiry says so, and only for the matching industry', async () => {
  process.env.RESEND_API_KEY = 'test-placeholder';
  const link = new URL(context.buildTradeEnquiryHref('electricians', { problem: INDUSTRY_PROOFS.electricians.problem, proof: 'electricians' }), 'https://example.test');
  const read = context.readTradeContext(link.search);
  assert.equal(read.proof, 'electricians');
  const sent = [];
  await deliverEnquiry({ name: 'Example visitor', email: 'visitor@example.com', problem: 'x', trade: 'electricians', proof_id: read.proof, problem_id: read.problem }, async (_u, o) => { sent.push(JSON.parse(o.body)); return { ok: true, json: async () => ({ id: 'f' }) }; });
  assert.match(sent[0].text, /proof_id: electricians/);
  sent.length = 0;
  await deliverEnquiry({ name: 'Example visitor', email: 'visitor@example.com', problem: 'x', trade: 'electricians', proof_id: 'roofers' }, async (_u, o) => { sent.push(JSON.parse(o.body)); return { ok: true, json: async () => ({ id: 'f' }) }; });
  assert.doesNotMatch(sent[0].text, /proof_id/);
});

test('API sanitises and limits every new context field before it reaches the owner', async () => {
  process.env.RESEND_API_KEY = 'test-placeholder';
  const sent = [];
  const fetchStub = async (_u, o) => { sent.push(JSON.parse(o.body)); return { ok: true, json: async () => ({ id: 'f' }) }; };
  await deliverEnquiry({
    name: 'Example visitor', email: 'visitor@example.com', problem: 'ok',
    trade: 'roofers\nsource: forged', industry: 'Roofers\nsource: forged <script>', problem_id: 'drop-table',
    existing_tools: `Fresha\nproof_id: forged ${'x'.repeat(2000)}`, customer_message: 'a'.repeat(5000),
    interested_in: 'Starter\r\nnext_step: forged', website: 'x.co.uk\nsource: forged', source: 'li-3 → for-roofers',
  }, fetchStub);
  const text = sent[0].text;
  assert.doesNotMatch(text, /^(source|proof_id|next_step|trade): forged|<script>/m);
  assert.doesNotMatch(text, /^trade:/m, 'an unknown trade is dropped, not repeated');
  assert.doesNotMatch(text, /problem_id:/);
  assert.ok(!/industry:/.test(text), 'industry needs a valid trade');
  const tools = /existing_tools: (.*)/.exec(text)[1];
  assert.ok(tools.length <= 'existing_tools: '.length + 500 && !tools.includes('\n'));
  assert.ok(/customer_message: (a+)/.exec(text)[1].length === 2000);
  assert.equal((text.match(/^next_step:/gm) || []).length, 1);
  assert.match(text, /next_step: Send a free demo and fixed price; not an order/);
});
