import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

// Run the real TS modules, including the current offer and industry registries.
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const code = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('exports', 'require', code)(exports, name => load(path.resolve(path.dirname(file), `${name}.ts`)));
  return exports;
}
const context = load('app/trade-context.ts');
const { CUSTOMER_TYPES } = load('app/customer-types.ts');
const { NICHE_GUIDES } = load('app/for/niches.ts');
const { ALL_OFFERS } = load('app/offers.ts');

test('every registered trade builds bounded enquiry context without inventing a package', () => {
  for (const item of [...CUSTOMER_TYPES, ...NICHE_GUIDES]) {
    const url = new URL(context.buildTradeEnquiryHref(item.id), 'https://example.test');
    assert.equal(url.pathname, '/free-plan');
    assert.equal(url.hash, '#leak-check-form');
    assert.equal(url.searchParams.get('src'), `for-${item.id}`);
    assert.equal(url.searchParams.get('trade'), item.id);
    assert.equal(url.searchParams.has('proof'), false, 'ordinary CTAs never claim a demo was viewed');
    assert.equal(url.searchParams.get('from'), `/for/${item.id}`);
    assert.equal(url.searchParams.has('package'), false);
  }
});

test('known problem and explicitly named canonical package survive', () => {
  const url = new URL(context.buildTradeEnquiryHref('heating-and-plumbing', {
    problem: 'quote-follow-up', proof: 'heating-and-plumbing', package: ALL_OFFERS[0].name,
  }), 'https://example.test');
  assert.equal(url.searchParams.get('problem'), 'quote-follow-up');
  assert.equal(url.searchParams.get('proof'), 'heating-and-plumbing');
  assert.equal(url.searchParams.get('package'), ALL_OFFERS[0].name);
});

test('invalid trades, proof pairings, problems and personal input fail safely', () => {
  for (const trade of ['unknown', '../contact', 'other', 'creator', 'name@example.com']) {
    assert.equal(context.buildTradeEnquiryHref(trade), '/free-plan#leak-check-form');
  }
  const url = new URL(context.buildTradeEnquiryHref('roofers', {
    proof: 'builders', problem: 'onboarding', package: 'Contact me at private@example.com',
  }), 'https://example.test');
  assert.equal(url.searchParams.has('proof'), false);
  assert.equal(url.searchParams.has('problem'), false);
  assert.equal(url.searchParams.has('package'), false);
  assert.doesNotMatch(url.href, /private|builders|onboarding/);
});

test('campaign attribution and originating industry page are independent', () => {
  const input = context.readTradeContext('?src=li-3&trade=roofers&proof=roofers&problem=missed-call&from=%2Ffor%2Froofers');
  assert.equal(input.sourcePage, '/for/roofers');
  assert.equal(input.proof, 'roofers');
  assert.equal(context.enquirySource('?src=li-3', 'em-trades'), 'em-trades → li-3');
});

test('source pages cannot be external, arbitrary, encoded, queried or fragmented', () => {
  for (const from of ['https://evil.example/for/roofers', '//evil.example', '/contact', '/for/nope', '/for/roofers?email=private', '/for/roofers#private', '/for/../roofers']) {
    assert.equal(context.readTradeContext(`?trade=roofers&from=${encodeURIComponent(from)}`).sourcePage, '', from);
  }
  assert.equal(context.readTradeContext('?src=for-roofers&trade=roofers').sourcePage, '/for/roofers');
  assert.equal(context.readTradeContext('?src=roofers&trade=roofers').sourcePage, '');
});

test('changing industry clears demo/problem/package preferences, retaining true origin', () => {
  const original = context.readTradeContext(`?trade=roofers&proof=roofers&problem=missed-call&from=/for/roofers&package=${encodeURIComponent(ALL_OFFERS[0].name)}`);
  const changed = context.changeTrade(original, 'salons-and-beauty');
  assert.equal(changed.trade, 'salons-and-beauty');
  assert.equal(changed.proof, '');
  assert.equal(changed.problem, '');
  assert.equal(changed.package, '');
  assert.equal(changed.sourcePage, '/for/roofers');
  assert.deepEqual(context.changeTrade(original, 'roofers'), original);
});

test('URL updates carry only approved context, never visitor fields', () => {
  const initial = '?trade=roofers&proof=roofers&problem=missed-call&src=li-3&name=Private&email=private@example.com&website=secret&business=Private&token=secret';
  const corrected = context.changeTrade(context.readTradeContext(initial), 'appointments');
  const params = new URLSearchParams(context.contextSearch(initial, corrected));
  assert.equal(params.get('trade'), 'appointments');
  assert.equal(params.get('src'), 'li-3');
  for (const key of ['proof', 'problem', 'package', 'name', 'email', 'website', 'business', 'token']) assert.equal(params.has(key), false, key);
});

test('new URL choices replace previous choices and absent values clear', () => {
  const first = context.readTradeContext('?trade=roofers&proof=roofers&problem=missed-call');
  const next = context.readTradeContext('?trade=creators&problem=lead-capture');
  assert.notEqual(first.trade, next.trade);
  assert.equal(next.proof, '');
  assert.equal(next.package, '');
  assert.equal(context.readTradeContext('').trade, '');
});

test('only real campaign/internal links can enter source or safe submission URL', () => {
  for (const src of ['footer', 'builder', 'prices-hero', 'for-roofers', 'service-missed-call', 'scene-booking', 'estimator-trades', 'li-3']) {
    assert.equal(context.enquirySource(`?src=${src}`, ''), src);
  }
  for (const src of ['private@example.com', 'https://evil.example', 'for-unknown', 'scene-private', 'service-private', 'estimator-private']) {
    assert.equal(context.enquirySource(`?src=${encodeURIComponent(src)}`, ''), 'direct (free-plan)');
  }
  const url = new URL(context.safeEnquiryPageUrl('https://www.mazworks.uk/free-plan?src=footer&name=Private&token=secret&trade=roofers&proof=builders'));
  assert.equal(url.searchParams.get('src'), 'footer');
  for (const key of ['name', 'token', 'proof']) assert.equal(url.searchParams.has(key), false);
});
