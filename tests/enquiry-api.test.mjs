import assert from 'node:assert/strict';
import test from 'node:test';
import { cleanPageUrl, deliverEnquiry } from '../api/enquiry.js';
const input = { name: 'Example visitor', email: 'visitor@example.com', problem: 'Missed calls', referred_by: 'Alex Referral', _honey: '' };
test('only reports confirmation after both messages are accepted', async () => {
  process.env.RESEND_API_KEY = 'test-placeholder';
  const sent = [];
  const result = await deliverEnquiry(input, async (url, options) => { sent.push(JSON.parse(options.body)); return {ok:true,json:async()=>({id:'test-id'})}; });
  assert.equal(result.ok, true); assert.equal(result.confirmationSent, true);
  assert.equal(sent.length, 2); assert.match(sent[0].text, /referred_by: Alex Referral/); assert.match(sent[1].text, /1 working day/);
  assert.equal(sent[1].from, 'Maz Works <info@mazworks.uk>');
});
test('owner acceptance survives confirmation failure without inviting a duplicate fallback', async () => {
  let count=0;
  const result=await deliverEnquiry(input, async()=>({ok:++count===1,json:async()=>({id:'test-id'})}));
  assert.deepEqual(result,{ok:true,confirmationSent:false});
});
test('owner failure allows fallback and does not send a misleading confirmation', async () => {
  let count=0;
  const result=await deliverEnquiry(input,async()=>{count++;return {ok:false};});
  assert.equal(result.ok,false); assert.equal(count,1);
});

test('submission page never copies sensitive query keys or fragments', () => {
  assert.equal(cleanPageUrl('https://www.mazworks.uk/free-plan?name=Private&email=private@example.com&src=private#secret'), 'https://www.mazworks.uk/free-plan');
});

test('owner gets separate customer message, tools, safe source and next action', async () => {
  process.env.RESEND_API_KEY = 'test-placeholder';
  const sent = [];
  const result = await deliverEnquiry({ ...input, trade: 'roofers', industry: 'Roofers', proof_id: 'roofers', problem_id: 'quote-follow-up',
    customer_message: 'Please work with my calendar.', existing_tools: 'GarageHive', interested_in: 'Not chosen',
    next_step: 'Send a free demo and fixed price; not an order', source: 'li-3 → for-roofers', source_page: '/for/roofers',
    _url: 'https://www.mazworks.uk/free-plan?email=private@example.com',
  }, async (_url, options) => { sent.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ id: 'fixture' }) }; });
  assert.equal(result.ok, true);
  for (const value of ['customer_message: Please work with my calendar.', 'existing_tools: GarageHive', 'industry: Roofers',
    'proof_id: roofers', 'problem_id: quote-follow-up', 'source_page: /for/roofers', 'interested_in: Not chosen',
    'next_step: Send a free demo and fixed price; not an order', 'source: li-3 → for-roofers']) assert.ok(sent[0].text.includes(value), value);
  assert.doesNotMatch(sent[0].text, /private@example.com/);
});

test('forged source, proof pairing and source page do not reach the owner summary', async () => {
  const sent = [];
  await deliverEnquiry({ ...input, trade: 'roofers', proof_id: 'builders', source: 'personal@example.com', source_page: '/for/roofers?secret=123' },
    async (_url, options) => { sent.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ id: 'fixture' }) }; });
  assert.doesNotMatch(sent[0].text, /personal@example.com|secret=123|proof_id: builders/);
});
