import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import ts from 'typescript';

// Batch 2: the "Build my system" price comes only from quotePlan() in app/offers.ts.
const modules = {};
for (const name of ['offers', 'systems']) {
  const source = await fs.readFile(`app/${name}.ts`, 'utf8');
  modules[name] = {};
  new Function('exports', 'require', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(modules[name], () => modules.offers);
}
const { quotePlan, getOffer, getExtra, priceAmount } = modules.offers;
const { getSystem, HEADACHE_PICKS } = modules.systems;
const plan = (...ids) => quotePlan(ids.map((id) => getSystem(id)));

test('nothing picked: start with Starter Automation', () => {
  const quote = plan();
  assert.equal(quote.offer.id, 'starter');
  assert.equal(quote.totalLabel, getOffer('starter').price);
});

test('a small set-up is never sold alone: it rides free with a Starter (Maz, 2 Oct)', () => {
  const quote = quotePlan([{ name: 'Review QR card', offerName: 'Review QR card' }]);
  assert.equal(quote.offer.id, 'starter');
  assert.equal(quote.total, getOffer('starter').from);
  assert.ok(quote.lines.some((line) => /Review QR card/.test(line.label) && line.price === 'Included'));
  const three = quotePlan(['Review QR card', 'Quote template', 'Saved replies'].map((name) => ({ name, offerName: name })));
  assert.equal(three.total, getOffer('starter').from + priceAmount(getExtra('Saved replies').price), 'the third set-up costs SETUP_PRICE');
});

test('the first job that needs building is Starter Automation', () => {
  const quote = plan('enquiries');
  assert.equal(quote.offer.id, 'starter');
  assert.equal(quote.total, getOffer('starter').from);
});

test('an extra job to build uses Extra automation, never on its own', () => {
  const two = quotePlan([getSystem('enquiries'), { name: 'Stock alerts', offerName: 'Starter Automation' }]);
  assert.deepEqual(two.lines.map((line) => line.price), [getOffer('starter').price, getExtra('Extra automation').price]);
  for (const id of HEADACHE_PICKS.map((pick) => pick.system)) {
    const quote = plan(id);
    assert.ok(!quote.lines.some((line) => line.label.startsWith('Extra automation')), `${id} alone must not be Extra automation`);
  }
});

test('a Starter, an extra job and a set-up add up line by line', () => {
  const quote = quotePlan([getSystem('enquiries'), getSystem('reminders'), { name: 'Review QR card', offerName: 'Review QR card' }]);
  const expected = getOffer('starter').from + priceAmount(getExtra('Extra automation').price);
  assert.equal(quote.total, expected);
  assert.ok(quote.total <= getOffer('business-system').from);
});

test('copying between apps (Business System) quotes the package, weekly report included', () => {
  const quote = plan('business-system', 'weekly');
  assert.equal(quote.offer.id, 'business-system');
  assert.equal(quote.totalLabel, getOffer('business-system').price);
  assert.match(quote.note, /weekly report included/i);
});

test('when the parts cost more than a Business System, recommend that instead', () => {
  const every = HEADACHE_PICKS.map((pick) => pick.system).filter((id) => id !== 'business-system').concat('weekly', 'rebooking');
  const parts = quotePlan([]).total; // guard: helper is pure
  assert.equal(parts, getOffer('starter').from);
  const quote = plan(...every);
  assert.equal(quote.offer.id, 'business-system');
  assert.match(quote.note, /more than a Business System/);
});

test('every headache maps to a real system', () => {
  for (const pick of HEADACHE_PICKS) assert.ok(getSystem(pick.system), pick.id);
});

test('builder and calculator hard-code no prices', async () => {
  for (const file of ['app/system-builder.tsx', 'app/cost-calculator.tsx', 'app/hero-demo.tsx']) {
    assert.doesNotMatch(await fs.readFile(file, 'utf8'), /£\s?\d/, file);
  }
});

// Offer v10 (2 Oct): commercial guard rails. Read docs/maz-works/OFFER-V10.md before changing these.
const { ALL_OFFERS, EXTRAS, TRACKS, CARE_PLANS, CHANGES_WINDOW, PAYMENT_TERMS } = modules.offers;

test('every offer has one track and a full spec: who, included, excluded, delivery, changes, upsell', () => {
  const tracks = new Set(TRACKS.map((track) => track.id));
  assert.equal(tracks.size, 4);
  for (const offer of ALL_OFFERS) {
    assert.ok(tracks.has(offer.track), offer.id);
    for (const field of ['forWho', 'delivery', 'changes', 'upsell']) assert.ok(offer[field]?.length > 10, `${offer.id}.${field}`);
    assert.ok(offer.includes.length >= 1 && offer.excludes.length >= 1, `${offer.id} needs included and excluded lists`);
  }
});

test('creators get two steps: a list they own first, then a page that sells (Offer v11, same ladder as everyone in v12)', () => {
  const starter = getOffer('creator-starter');
  const launch = getOffer('creator-launch');
  assert.equal(starter.track, 'automation');
  assert.ok(starter.excludes.some((line) => /sales page|payments/i.test(line)), 'Creator Starter must exclude the sales page');
  assert.ok(launch.includes.some((line) => /brand tidy/i.test(line)), 'the Launch Page carries the brand tidy');
  assert.ok(starter.from < getOffer('starter').from, 'creators pay less: their Starter is easy to DIY on free tools (Offer v13)');
  assert.ok(launch.from > starter.from, 'the launch costs more than the starter');
  assert.ok(starter.guarantee, 'the starter carries the 30-day guarantee');
});

test('no small set-up or add-on is priced below the £29 floor, and care covers real time', () => {
  for (const extra of EXTRAS) assert.ok(priceAmount(extra.price) >= 29, `${extra.name} is under the floor`);
  assert.ok(priceAmount(CARE_PLANS[0].price) >= 39);
  assert.ok(!/unlimited/i.test(JSON.stringify(CHANGES_WINDOW)), 'changes are never unlimited');
  assert.doesNotMatch(PAYMENT_TERMS, /half|deposit/i);
});

test('three jobs to build is a Business System, even when the parts are cheaper', () => {
  const quote = quotePlan([getSystem('enquiries'), { name: 'Stock alerts', offerName: 'Starter Automation' }, { name: 'Invoice chasing', offerName: 'Starter Automation' }]);
  assert.equal(quote.offer.id, 'business-system');
});

test('Offer v12: pages add up and every package is cheaper than its parts', () => {
  const { PACKAGE_VALUE, getExtra: extra, priceAmount: amount } = modules.offers;
  const launch = getOffer('creator-launch');
  const website = getOffer('website');
  assert.ok(website.includes.some((line) => /Everything in a Launch Page/.test(line)), 'a Website is a Launch Page plus more pages');
  assert.ok(website.from < launch.from + 4 * amount(extra('Extra website page').price), 'five pages as a Website cost less than a Launch Page plus four extra pages');
  for (const [id, value] of Object.entries(PACKAGE_VALUE)) {
    assert.ok(value.total > getOffer(id).from, `${id}: parts (${value.total}) must cost more than the package`);
  }
  for (const id of ['starter', 'creator-starter', 'business-system', 'creator-launch']) {
    assert.ok(getOffer(id).includes.some((line) => /set-ups? .*free/i.test(line)), `${id}: free small set-ups included`);
  }
});
