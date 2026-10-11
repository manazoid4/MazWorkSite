import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

// Exercise the actual TypeScript modules, without depending on a stale export.
const cache = new Map();
function load(file) {
  const absolute = path.resolve(file);
  if (cache.has(absolute)) return cache.get(absolute);
  const exports = {};
  cache.set(absolute, exports);
  const source = fs.readFileSync(absolute, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  new Function('exports', 'require', compiled)(exports, name => {
    if (name.startsWith('.')) return load(path.resolve(path.dirname(absolute), `${name}.ts`));
    throw new Error(`Unexpected dependency ${name}`);
  });
  return exports;
}

test('the static /for inventory has exactly one distinct configured proof per page', () => {
  const { INDUSTRY_PROOFS } = load('app/for/industry-proof-data.ts');
  const { NICHE_GUIDES } = load('app/for/niches.ts');
  const { CUSTOMER_TYPES } = load('app/customer-types.ts');
  const inventory = [...NICHE_GUIDES, ...CUSTOMER_TYPES].map(item => item.id).sort();
  assert.deepEqual(Object.keys(INDUSTRY_PROOFS).sort(), inventory);
  assert.equal(inventory.length, 14);
  assert.equal(new Set(Object.values(INDUSTRY_PROOFS).map(proof => proof.title)).size, 14);
  for (const [slug, proof] of Object.entries(INDUSTRY_PROOFS)) {
    assert.equal(proof.slug, slug);
    assert.ok(['missed-call', 'quote-follow-up', 'booking', 'reminder', 'lead-capture', 'onboarding'].includes(proof.problem));
    assert.ok(proof.steps.length >= 3 && proof.steps.length <= 5, slug);
    assert.ok(proof.moment && proof.decision, slug);
    assert.ok(proof.heroTitle.length <= 65, slug);
    assert.ok(proof.intro.length <= 160, slug);
    assert.ok(proof.artifact && proof.boundary && proof.scope);
    for (const field of proof.fields) {
      assert.ok(field.options.includes(field.initial), `${slug}: valid initial choice`);
      assert.ok(field.options.length >= 2);
    }
    for (const step of proof.steps) {
      assert.ok(step.action && step.customer && step.owner && step.status);
      for (const id of step.fields) assert.ok(proof.fields.some(field => field.id === id), `${slug}: missing field ${id}`);
    }
  }
});

test('steps, choices and replay preserve truth and never confirm a new booking', () => {
  const { INDUSTRY_PROOFS } = load('app/for/industry-proof-data.ts');
  const { initialProofState, advanceProof, selectProofChoice, replayProof, proofSummary } = load('app/for/industry-proof-state.ts');
  for (const proof of Object.values(INDUSTRY_PROOFS)) {
    const start = initialProofState(proof);
    assert.equal(start.interacted, false);
    assert.equal(start.step, 0);
    let state = selectProofChoice(proof, start, proof.fields[0].id, proof.fields[0].options[1]);
    assert.equal(state.interacted, true);
    assert.equal(state.choices[proof.fields[0].id], proof.fields[0].options[1]);
    assert.deepEqual(selectProofChoice(proof, state, proof.fields[0].id, 'arbitrary private data'), state);
    assert.deepEqual(selectProofChoice(proof, state, 'unknown', 'anything'), state);
    for (let index = 0; index < 10; index++) state = advanceProof(proof, state);
    assert.equal(state.step, proof.steps.length - 1);
    assert.equal(state.complete, true);
    const summary = proofSummary(proof, state);
    assert.equal(summary.fields[0].value, proof.fields[0].options[1]);
    assert.match(summary.status, /request|review|pending|awaiting|opt-in|checklist/i);
    assert.doesNotMatch(summary.status, /booking confirmed|appointment booked|added to.*diary/i);
    assert.deepEqual(replayProof(proof), start);
  }
});

test('sensitive scenarios and consent have explicit limits', () => {
  const { INDUSTRY_PROOFS: p } = load('app/for/industry-proof-data.ts');
  assert.match(p['heating-and-plumbing'].boundary, /routine.*Gas Safe/i);
  assert.match(p.roofers.boundary, /ground level/i);
  assert.match(p.electricians.boundary, /no diagnosis/i);
  assert.match(p['clinics-and-therapists'].boundary, /no clinical/i);
  assert.doesNotMatch(p['clinics-and-therapists'].fields.map(f => f.label).join(' '), /symptom|diagnosis|medical|condition/i);
  assert.match(p['cafes-and-food'].boundary, /allerg.*staff/i);
  assert.match(p.creators.boundary, /opt.*in|consent/i);
  assert.match(p.offices.boundary, /no.*upload/i);
});

test('only an interacted proof tags proof; hero has no package default', () => {
  const component = fs.readFileSync('app/for/industry-proof.tsx', 'utf8');
  const hero = fs.readFileSync('app/for/trade-blocks.tsx', 'utf8');
  assert.match(component, /proof:\s*state\.interacted\s*\?\s*proof\.slug\s*:\s*undefined/);
  assert.doesNotMatch(component, /package:|fetch\(|localStorage|sessionStorage|XMLHttpRequest|sendBeacon/);
  assert.match(component, /<noscript>/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /prefers-reduced-motion/);
  assert.doesNotMatch(hero, /HeroDemo/);
  assert.match(hero, /IndustryProof/);
});
