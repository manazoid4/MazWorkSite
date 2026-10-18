// After-Hours Receptionist: unit-economics model. Edit the numbers in ASSUMPTIONS, then run:
//   node scripts/receptionist-model.mjs
// Dependency-free. Money is kept unrounded inside; rounded to pence only when printed.
// Not imported by the site. Prices marked 'proposal' are ideas, not live prices.

const deepFreeze = (o) => { Object.values(o).forEach((v) => typeof v === 'object' && v && deepFreeze(v)); return Object.freeze(o); };

export const ASSUMPTIONS = deepFreeze({
  // VERIFIED: vendor pricing pages, read 9 Oct 2026, FX $1 = GBP 0.75.
  providers: {
    // Telnyx: engine $0.05 + LLM $0.0064 + telephony $0.0032 + API fee $0.002 = $0.0616/min. Number "from $1" globally; UK price NOT verified.
    telnyx: { perMinute: 0.0462, number: 0.75 },
    // Twilio UK inbound $0.01/min (only UK rate verified) + Vapi, lowest model tiers. Number $3.50.
    'twilio-vapi': { perMinute: 0.0689, number: 2.63 },
    // Same stack at the high end of Vapi model tiers (about 0.104/min).
    'twilio-vapi-high': { perMinute: 0.104, number: 2.63 },
    // Twilio + self-built OpenAI realtime. Tokens per minute ASSUMED; forum reports say real bills run higher.
    'twilio-openai': { perMinute: 0.0435, number: 2.63 },
  },
  icoFeeYear: 52, // VERIFIED: ICO data protection fee tier 1, GBP 52 a year (47 by direct debit), ico.org.uk, 9 Oct 2026.
  // ASSUMED (not verified):
  smsCost: 0.04, // per UK SMS alert
  stripePct: 0.015, // Stripe UK card fee, 1.5% + 20p
  stripeFixed: 0.2,
  founderRate: 40, // GBP per hour, value of founder time
  setupHours: 3, // per customer
  tuningHours: 0.5, // per customer per month (30 minutes)
  supportHours: 0.25, // per customer per month (15 minutes)
  acquisitionHours: 2, // founder hours per customer won, GBP 0 cash
  contingencyPct: 0.05, // refunds and failures, share of revenue
  emailHosting: 0, // free tiers
  founderHoursPerWeek: 5, // capacity used in the PRICING-MODEL doc
});

export const PLANS = deepFreeze({
  standard: { id: 'standard', status: 'approved', monthly: 79, minutes: 300, setupFee: 99 },
  // PROPOSALS: ideas for the owner to approve. Not live prices.
  lite: { id: 'lite', status: 'proposal', monthly: 49, minutes: 100, setupFee: 0 },
  busy: { id: 'busy', status: 'proposal', monthly: 129, minutes: 600, setupFee: 0 },
  // Model C: customer holds the provider account and pays usage directly; Maz charges set-up and an optional care plan.
  owned: { id: 'owned', status: 'proposal', monthly: 39, minutes: 0, setupFee: 295, customerPaysProvider: true },
});

const A = ASSUMPTIONS;
const planOf = (p) => (typeof p === 'string' ? PLANS[p] : p);
const feeOn = (amount) => (amount > 0 ? amount * A.stripePct + A.stripeFixed : 0);

export function costPerCustomer({ minutesUsed, provider = 'telnyx', urgentTextsPerMonth = 10 }) {
  const p = A.providers[provider];
  const minutes = minutesUsed * p.perMinute;
  const number = p.number;
  const alerts = urgentTextsPerMonth * A.smsCost;
  return { minutes, number, alerts, emailHosting: A.emailHosting, total: minutes + number + alerts + A.emailHosting };
}

export function monthly({ plan, minutesUsed, customers = 1, provider = 'telnyx', urgentTextsPerMonth = 10 }) {
  const pl = planOf(plan);
  const revenue = pl.monthly * customers;
  const infra = (pl.customerPaysProvider ? 0 : costPerCustomer({ minutesUsed, provider, urgentTextsPerMonth }).total) * customers;
  const paymentFees = feeOn(pl.monthly) * customers;
  const contingency = revenue * A.contingencyPct;
  const contribution = revenue - infra - paymentFees - contingency;
  const founderHours = customers * (A.tuningHours + A.supportHours);
  const labour = founderHours * A.founderRate;
  const profitAfterLabour = contribution - labour;
  return { revenue, infra, paymentFees, contingency, contribution, marginPct: (contribution / revenue) * 100, founderHours, labour, profitAfterLabour, perCustomerProfit: profitAfterLabour / customers };
}

// One-off cost to win and onboard a customer, less any set-up fee kept after card fees.
const upfrontNet = (pl) => (A.setupHours + A.acquisitionHours) * A.founderRate - (pl.setupFee > 0 ? pl.setupFee - feeOn(pl.setupFee) : 0);

export function firstMonth({ plan, minutesUsed, customers = 1, provider = 'telnyx' }) {
  const pl = planOf(plan);
  const m = monthly({ plan: pl, minutesUsed, customers, provider });
  const setupIncome = (pl.setupFee - feeOn(pl.setupFee)) * customers;
  const setupLabour = A.setupHours * A.founderRate * customers;
  const acquisitionLabour = A.acquisitionHours * A.founderRate * customers;
  return { ...m, setupIncome, setupLabour, acquisitionLabour, net: m.profitAfterLabour + setupIncome - setupLabour - acquisitionLabour };
}

export function paybackMonths({ plan, minutesUsed, provider = 'telnyx' }) {
  const pl = planOf(plan);
  const perMonth = monthly({ plan: pl, minutesUsed, provider }).profitAfterLabour;
  const upfront = upfrontNet(pl);
  if (upfront <= 0) return 0;
  return perMonth > 0 ? upfront / perMonth : Infinity;
}

// Most included minutes that still keep the target contribution margin (whole minutes, rounded down).
export function maxSafeMinutes({ plan, provider = 'telnyx', targetMarginPct = 60, urgentTextsPerMonth = 10 }) {
  const pl = planOf(plan);
  if (pl.customerPaysProvider) return Infinity;
  const p = A.providers[provider];
  const room = pl.monthly * (1 - targetMarginPct / 100 - A.contingencyPct) - feeOn(pl.monthly) - p.number - urgentTextsPerMonth * A.smsCost - A.emailHosting;
  return Math.max(0, Math.floor(room / p.perMinute));
}

// Customer count is held steady: each churned customer is replaced, costing set-up and acquisition time.
// Starting customers also cost their onboarding in month 0. Expected values, so fractions are fine.
export function churnScenario({ plan, minutesUsed, customers, monthlyChurnPct, months, provider = 'telnyx' }) {
  const pl = planOf(plan);
  const perMonth = monthly({ plan: pl, minutesUsed, customers, provider }).profitAfterLabour;
  const replacementsPerMonth = (customers * monthlyChurnPct) / 100;
  const onboarding = upfrontNet(pl);
  return perMonth * months - customers * onboarding - replacementsPerMonth * months * onboarding;
}

export const GRID = { minutes: [30, 100, 150, 300, 600, 1000, 3000], customers: [1, 5, 10, 20, 50], providers: ['telnyx', 'twilio-vapi'] };

export function table() {
  const rows = [];
  for (const plan of Object.values(PLANS)) {
    for (const provider of plan.customerPaysProvider ? ['customer'] : GRID.providers) {
      for (const minutesUsed of GRID.minutes) {
        for (const customers of GRID.customers) {
          rows.push({ plan: plan.id, status: plan.status, provider, minutesUsed, customers, ...monthly({ plan, minutesUsed, customers, provider: provider === 'customer' ? 'telnyx' : provider }) });
        }
      }
    }
  }
  return rows;
}

const gbp = (n) => (n < 0 ? '-' : '') + '£' + Math.abs(n).toFixed(2);

function print() {
  const rows = table();
  console.log('Receptionist model. Money in GBP. "margin" = contribution margin before founder time.');
  console.log('Proposal plans are ideas, not live prices. Inputs: ASSUMPTIONS in this file.\n');
  for (const plan of Object.values(PLANS)) {
    for (const provider of [...new Set(rows.filter((r) => r.plan === plan.id).map((r) => r.provider))]) {
      console.log(`${plan.id} (${plan.status}, ${gbp(plan.monthly)}/month, ${plan.minutes} min, set-up ${gbp(plan.setupFee)}) on ${provider}`);
      console.log('  minutes   cost/cust  contribution  margin  after-labour/cust   total after labour at 1 / 5 / 10 / 20 / 50 customers');
      for (const minutesUsed of GRID.minutes) {
        const set = rows.filter((r) => r.plan === plan.id && r.provider === provider && r.minutesUsed === minutesUsed);
        const one = set[0];
        console.log(`  ${String(minutesUsed).padStart(7)}  ${gbp(one.infra).padStart(9)}  ${gbp(one.contribution).padStart(12)}  ${one.marginPct.toFixed(1).padStart(5)}%  ${gbp(one.perCustomerProfit).padStart(17)}   ${set.map((r) => gbp(r.profitAfterLabour)).join(' / ')}`);
      }
      console.log('');
    }
  }
  console.log('Standard plan at 300 minutes, one customer:');
  for (const provider of GRID.providers) {
    const f = firstMonth({ plan: 'standard', minutesUsed: 300, provider });
    const payback = paybackMonths({ plan: 'standard', minutesUsed: 300, provider }).toFixed(1);
    console.log(`  ${provider}: first month net ${gbp(f.net)}, payback ${payback} months, max safe minutes at 60% margin ${maxSafeMinutes({ plan: 'standard', provider, targetMarginPct: 60 })}, break-even minutes ${maxSafeMinutes({ plan: 'standard', provider, targetMarginPct: 0 })}`);
  }
  const perCust = A.tuningHours + A.supportHours;
  console.log('\nFounder hours a month (tuning + support) at 1 / 5 / 10 / 20 / 50 customers: ' + GRID.customers.map((c) => (c * perCust).toFixed(2)).join(' / '));
  const budget = (A.founderHoursPerWeek * 52) / 12;
  console.log(`Most customers on ${A.founderHoursPerWeek} h/week (${budget.toFixed(1)} h/month, steady state, no new set-ups): ${Math.floor(budget / perCust)}`);
  console.log('\nChurn, 10 customers, standard, 300 min, telnyx, 12 months, cumulative profit after labour incl. onboarding:');
  for (const churn of [0, 5, 10]) console.log(`  ${churn}% monthly churn: ${gbp(churnScenario({ plan: 'standard', minutesUsed: 300, customers: 10, monthlyChurnPct: churn, months: 12 }))}`);
}

if (import.meta.main) print();
