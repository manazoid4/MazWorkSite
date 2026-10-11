import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ASSUMPTIONS, PLANS, costPerCustomer, monthly, firstMonth, paybackMonths, maxSafeMinutes, churnScenario, table } from '../scripts/receptionist-model.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const near = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} is not within ${tol} of ${b}`);

test('300 Telnyx minutes plus number cost about 14.61 before alerts', () => {
  const c = costPerCustomer({ minutesUsed: 300, provider: 'telnyx', urgentTextsPerMonth: 0 });
  near(c.total, 14.61);
});

test('alerts are priced at the assumed 4p per text', () => {
  const c = costPerCustomer({ minutesUsed: 0, provider: 'telnyx', urgentTextsPerMonth: 10 });
  near(c.alerts, 0.4);
});

test('only standard is approved, at 79 for 300 minutes; the rest are proposals', () => {
  assert.equal(PLANS.standard.status, 'approved');
  assert.equal(PLANS.standard.monthly, 79);
  assert.equal(PLANS.standard.minutes, 300);
  const others = Object.values(PLANS).filter((p) => p.id !== 'standard');
  assert.equal(others.length, 3);
  for (const p of others) assert.equal(p.status, 'proposal');
  assert.equal(PLANS.owned.setupFee, 295);
});

test('assumptions are frozen', () => {
  assert.ok(Object.isFrozen(ASSUMPTIONS));
  assert.ok(Object.isFrozen(ASSUMPTIONS.providers.telnyx));
  assert.ok(Object.isFrozen(PLANS.standard));
});

test('margin falls as minutes rise, on both providers', () => {
  for (const provider of ['telnyx', 'twilio-vapi']) {
    let last = Infinity;
    for (const minutesUsed of [30, 100, 150, 300, 600, 1000, 3000]) {
      const m = monthly({ plan: 'standard', minutesUsed, provider }).marginPct;
      assert.ok(m < last, `${provider} margin did not fall at ${minutesUsed}`);
      last = m;
    }
  }
});

test('standard plan at a full 300 minutes keeps a healthy margin on both providers', () => {
  assert.ok(monthly({ plan: 'standard', minutesUsed: 300, provider: 'telnyx' }).marginPct > 70);
  assert.ok(monthly({ plan: 'standard', minutesUsed: 300, provider: 'twilio-vapi' }).marginPct > 60);
});

test('abusive 3000 minutes on the standard plan loses money; break-even is about 1569 Telnyx minutes', () => {
  assert.ok(monthly({ plan: 'standard', minutesUsed: 3000 }).contribution < 0);
  const breakEven = maxSafeMinutes({ plan: 'standard', provider: 'telnyx', targetMarginPct: 0 });
  assert.equal(breakEven, 1569);
  assert.ok(monthly({ plan: 'standard', minutesUsed: breakEven }).contribution >= 0);
  assert.ok(monthly({ plan: 'standard', minutesUsed: breakEven + 1 }).contribution < 0);
});

test('maxSafeMinutes agrees with monthly(): at the limit the target holds, one minute more breaks it', () => {
  for (const provider of ['telnyx', 'twilio-vapi']) {
    for (const target of [40, 60, 70]) {
      const max = maxSafeMinutes({ plan: 'standard', provider, targetMarginPct: target });
      assert.ok(monthly({ plan: 'standard', minutesUsed: max, provider }).marginPct >= target);
      assert.ok(monthly({ plan: 'standard', minutesUsed: max + 1, provider }).marginPct < target);
    }
  }
});

test('first month is negative after set-up and acquisition time, and payback is a few months', () => {
  const f = firstMonth({ plan: 'standard', minutesUsed: 300 });
  assert.ok(f.net < 0);
  const months = paybackMonths({ plan: 'standard', minutesUsed: 300 });
  assert.ok(months > 3 && months < 12, `payback ${months}`);
});

test('founder hours scale with customers', () => {
  near(monthly({ plan: 'standard', minutesUsed: 300, customers: 10 }).founderHours, 7.5);
  near(monthly({ plan: 'standard', minutesUsed: 300, customers: 20 }).founderHours, 15);
});

test('churn makes cumulative profit worse', () => {
  const args = { plan: 'standard', minutesUsed: 300, customers: 10, months: 12 };
  const none = churnScenario({ ...args, monthlyChurnPct: 0 });
  const some = churnScenario({ ...args, monthlyChurnPct: 5 });
  const lots = churnScenario({ ...args, monthlyChurnPct: 10 });
  assert.ok(none > some && some > lots);
});

test('table covers every requested minutes and customers value', () => {
  const rows = table();
  for (const m of [30, 100, 150, 300, 600, 1000, 3000]) assert.ok(rows.some((r) => r.minutesUsed === m));
  for (const c of [1, 5, 10, 20, 50]) assert.ok(rows.some((r) => r.customers === c));
  assert.ok(rows.some((r) => r.provider === 'telnyx') && rows.some((r) => r.provider === 'twilio-vapi'));
});

test('the model never imports from app/', async () => {
  const src = await readFile(path.join(root, 'scripts', 'receptionist-model.mjs'), 'utf8');
  assert.doesNotMatch(src, /(?:import|from)\s*\(?\s*['"][^'"]*app\//);
});
