import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDesk, DEFAULT_CONFIG, cleanConfig, decodeConfig, encodeConfig, digitsFrom, safeText, spoken } from '../app/receptionist-demo/engine.mjs';

// Talk-to-it demo (9 Oct 2026): free, browser-only, answers only from the
// business details it is given, never guesses a price, sends urgent calls on.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const talk = (lines, config = DEFAULT_CONFIG) => {
  const desk = createDesk(config);
  const said = [desk.greet()];
  for (const line of lines) said.push(desk.reply(line));
  return { said, desk };
};

test('a booking enquiry takes a name and number and ends with a summary', () => {
  const { said, desk } = talk(['Do you do MOTs?', 'yes please', "it's sam jones", 'oh seven seven double oh nine double oh one two three', 'yes that is right', "no that's all"]);
  assert.match(said[1], /Yes, we do MOT/);
  assert.match(said[4], /read that back: 07700 900123/);
  assert.equal(desk.stage, 'done');
  const summary = desk.summary();
  assert.equal(summary.title, 'New enquiry');
  assert.deepEqual(summary.rows[0], ['Caller', 'Sam Jones · 07700 900123']);
  assert.deepEqual(summary.rows[1], ['Number check', 'Confirmed by caller']);
});

test('it never guesses a price it was not given', () => {
  const { said, desk } = talk(['how much is a clutch']);
  assert.match(said[1], /won’t guess/);
  assert.equal(desk.stage, 'name');
});

test('business-urgent words are flagged for the owner without a 999 referral', () => {
  const { said, desk } = talk(['my car has broken down outside', 'Priya', '07700 900456', 'yes', 'no']);
  assert.match(said[1], /marked this as urgent/);
  assert.doesNotMatch(said[1], /999/);
  assert.ok(desk.summary().urgent);
  assert.match(said[5], /urgent/);
});

test('it says it is automated when asked', () => {
  assert.match(talk(['are you a real person']).said[1], /automated receptionist/);
});

test('a link carries the business details and survives the round trip', () => {
  const config = { name: 'Bright Smile Dental', hours: '9 to 5', services: [{ name: 'Check-up' }], urgent: ['toothache'] };
  const back = decodeConfig(encodeConfig(config));
  assert.equal(back.name, 'Bright Smile Dental');
  assert.deepEqual(back.services, [{ name: 'Check-up', price: undefined }]);
  assert.equal(decodeConfig('not-a-real-code!!'), null);
  assert.equal(digitsFrom('double seven'), '77');
});

test('demo pages are not indexed and say how speech is handled', async () => {
  const html = await readFile(path.join(root, 'out', 'receptionist-demo.html'), 'utf8');
  assert.match(html, /noindex/);
  assert.match(html, /Nothing is recorded or sent to Maz Works/);
  assert.doesNotMatch(html.replace(/<script[\s\S]*?<\/script>/g, ''), /\bAI\b/);
  assert.match(await readFile(path.join(root, 'out', 'receptionist-demo', 'make.html'), 'utf8'), /noindex/);
  assert.match(await readFile(path.join(root, 'out', 'after-hours-receptionist.html'), 'utf8'), /href="\/receptionist-demo"/);
});

test('custom links never borrow the example hours, and odd service names are safe', () => {
  const config = decodeConfig(encodeConfig({ name: 'Code Club', services: [{ name: 'C++ tutoring' }, { name: 'Python (beginners)' }] }));
  assert.equal(config.hours, '');
  const { said } = talk(['what time do you open', 'do you teach c++ tutoring'], config);
  assert.match(said[1], /won’t guess/);
  assert.doesNotThrow(() => talk(['python (beginners)?', 'yes'], config));
});

// Sprint 1 (9 Oct 2026): fixes from the probe run on the first version.
const NUMBER_LINES = ['book a service', 'Sam'];

test('"no" inside a sentence is not a goodbye', () => {
  const { said, desk } = talk(['my car makes no noise when I start it']);
  assert.notEqual(desk.stage, 'done');
  assert.match(said[1], /take a message/);
  assert.equal(talk(['bye']).desk.stage, 'done');
  assert.equal(talk(['no thanks, bye']).desk.stage, 'done');
});

test('"no, I also need brakes" at the end of a call is a new request', () => {
  const { said, desk } = talk(['do you do tyres', 'yes', 'Sam', '07700900123', 'yes', 'no, I also need brakes']);
  assert.match(said[6], /we do brakes/);
  assert.equal(desk.stage, 'offer');
  assert.match(desk.summary().rows.find(([label]) => label === 'Wants')[1], /Brakes/);
});

test('a question at the name stage is answered, then the name is asked again', () => {
  const { said, desk } = talk(['do you do MOT', 'yes', 'sorry how much is it?']);
  assert.match(said[3], /from £45/);
  assert.doesNotMatch(desk.summary().rows[0][1], /Sorry|Much/);
  const hours = talk(['book a service', 'when are you open?']);
  assert.match(hours.said[2], /Monday to Friday.*Can I take your name\?$/);
  assert.equal(hours.desk.stage, 'name');
  assert.equal(talk(['book a service', 'hello?']).desk.stage, 'name');
});

test('refusing to give a name is accepted politely', () => {
  const { said, desk } = talk(['book an mot', "I'd rather not say"]);
  assert.match(said[2], /No problem/);
  assert.equal(desk.stage, 'number');
  assert.equal(desk.summary().rows[0][1], 'Caller (no name given)');
  assert.equal(talk(['book an mot', 'no']).desk.stage, 'number');
  // Long sentences are not names; a second miss moves on.
  const bad = talk(['book an mot', 'blah blah blah blah', 'blah blah blah blah']);
  assert.equal(bad.desk.stage, 'number');
  assert.equal(bad.desk.summary().rows[0][1], 'Caller (no name given)');
});

test('a number given at the name question is checked, then the name is asked', () => {
  const { said, desk } = talk(['book an mot', 'oh seven seven double oh nine double oh one two three', 'that is right', 'Jo Bloggs']);
  assert.match(said[2], /read that back: 07700 900123/);
  assert.match(said[3], /your name\?/);
  assert.equal(desk.stage, 'more');
  assert.deepEqual(desk.summary().rows[0], ['Caller', 'Jo Bloggs · 07700 900123']);
  const both = talk(['book an mot', 'Sam, 07700 900123', 'yes']);
  assert.equal(both.desk.summary().rows[0][1], 'Sam · 07700 900123');
});

test('urgent words are heard at the name, number and confirm stages', () => {
  const name = talk(['book a service', "there's smoke coming from the engine"]);
  assert.match(name.said[2], /ring 999/);
  assert.match(name.said[2], /Can I take your name\?$/);
  assert.equal(name.desk.stage, 'name');
  assert.ok(name.desk.summary().urgent);
  assert.match(name.desk.summary().rows[0][1], /No details left/);

  const number = talk([...NUMBER_LINES, 'I am stuck in the road']);
  assert.match(number.said[3], /marked this as urgent/);
  assert.doesNotMatch(number.said[3], /999/);
  assert.match(number.said[3], /best number/);
  assert.equal(number.desk.stage, 'number');

  const confirm = talk([...NUMBER_LINES, '07700 900123', 'the car is blocking the road']);
  assert.match(confirm.said[4], /urgent.*read that back: 07700 900123/);
  assert.equal(confirm.desk.stage, 'confirm');
  assert.ok(confirm.desk.summary().urgent);
});

test('the number is read back and only kept once confirmed', () => {
  const plus = talk([...NUMBER_LINES, '+44 7700 900123']);
  assert.match(plus.said[3], /read that back: 07700 900123\. Is that right\?/);
  assert.equal(plus.desk.stage, 'confirm');
  assert.equal(talk([...NUMBER_LINES, '0044 7700 900123']).desk.stage, 'confirm');
  assert.equal(talk([...NUMBER_LINES, '0113 496 0123']).desk.stage, 'confirm');
  const done = talk([...NUMBER_LINES, '+44 7700 900123', 'yes', 'that is all']);
  assert.deepEqual(done.desk.summary().rows.slice(0, 2), [['Caller', 'Sam · 07700 900123'], ['Number check', 'Confirmed by caller']]);
});

test('a number can be corrected: whole, partial, or from scratch', () => {
  const partial = talk([...NUMBER_LINES, '07700 900124', 'no sorry it ends 123']);
  assert.match(partial.said[4], /read that back: 07700 900123/);
  assert.equal(partial.desk.stage, 'confirm');
  const whole = talk([...NUMBER_LINES, '07700 900124', 'no, it is 07700 900999']);
  assert.match(whole.said[4], /07700 900999/);
  const again = talk([...NUMBER_LINES, '07700 900124', 'no']);
  assert.match(again.said[4], /right number/);
  assert.equal(again.desk.stage, 'number');
  const fixed = talk([...NUMBER_LINES, '07700 900124', 'no sorry it ends 123', 'yes']);
  assert.equal(fixed.desk.stage, 'more');
  assert.equal(fixed.desk.summary().rows[0][1], 'Sam · 07700 900123');
});

test('after two corrections the number is kept but flagged', () => {
  const { desk } = talk([...NUMBER_LINES, '07700 900124', 'no', '07700 900125', 'no', '07700 900126', 'no']);
  assert.equal(desk.stage, 'more');
  assert.deepEqual(desk.summary().rows[1], ['Number check', 'Not confirmed: ring to check']);
});

test('garbage is never stored as the number', () => {
  // Three tries, not two (RC13).
  const { said, desk } = talk([...NUMBER_LINES, 'what', 'I said seven', 'it is seven']);
  assert.match(said[3], /digit by digit/);
  assert.equal(talk([...NUMBER_LINES, 'what', 'I said seven']).desk.stage, 'number');
  assert.equal(desk.stage, 'more');
  const rows = desk.summary().rows;
  assert.equal(rows[0][1], 'Sam');
  assert.ok(!rows.some(([label]) => label === 'Number check'));
  assert.equal(rows.at(-1)[1], 'No number left: check caller ID');
});

test('only a short yes counts as yes', () => {
  const { said, desk } = talk(['do you do MOT', 'please can you tell me the price']);
  assert.match(said[2], /from £45/);
  assert.equal(desk.stage, 'offer');
  assert.equal(talk(['do you do MOT', 'yes please']).desk.stage, 'name');
  assert.equal(talk(['do you do MOT', 'can you call me back tomorrow']).desk.stage, 'name');
  assert.equal(talk(['do you do MOT', 'no thanks']).desk.stage, 'more');
});

test('"close to" is about where, not opening hours', () => {
  assert.match(talk(['are you close to Leeds']).said[1], /We cover the town/);
  assert.match(talk(['what time do you close?']).said[1], /Monday to Friday/);
  assert.match(talk(['are you open on saturday']).said[1], /Saturday/);
});

test('link text is plain: no links, no numbers, prices in £ only', () => {
  const spoof = decodeConfig(encodeConfig({
    name: 'Barclays Fraud Team 07700 900123',
    hours: 'ring 09061234567 now',
    callback: 'visit https://evil.example/pay now',
    services: [{ name: 'Card number 4111 1111 1111 1111' }, { name: 'Check-up', price: 'from £45' }, { name: 'Scan', price: 'ring 09061234567' }],
    urgent: ['toothache', '07700900123'],
  }));
  assert.equal(spoof.name, DEFAULT_CONFIG.name);
  assert.equal(spoof.hours, DEFAULT_CONFIG.hours);
  assert.equal(spoof.callback, 'on the next working day');
  assert.deepEqual(spoof.services, DEFAULT_CONFIG.services);
  const custom = cleanConfig({
    name: 'Bright Smile Dental',
    hours: 'ring 09061234567 now',
    services: [{ name: 'Card number 4111 1111 1111 1111' }, { name: 'Check-up', price: 'from £45' }, { name: 'Scan', price: 'ring 09061234567' }, { name: 'Whitening', price: '£45.00 per session' }],
    urgent: ['toothache', '07700900123'],
  });
  assert.equal(custom.hours, '');
  assert.deepEqual(custom.services, [{ name: 'Check-up', price: 'from £45' }, { name: 'Scan', price: undefined }, { name: 'Whitening', price: '£45.00 per session' }]);
  assert.deepEqual(custom.urgent, ['toothache']);
  assert.equal(cleanConfig({ name: 'x'.repeat(80) }).name.length, 40);
  assert.equal(safeText('see www.bad.com or bad.com/pay <now>\u0007 ok', 80), 'see or now ok');
  assert.equal(cleanConfig({ name: 'Code Club', hours: 'Mon 9 to 5' }).hours, 'Mon 9 to 5');
  assert.equal(cleanConfig(DEFAULT_CONFIG).hours, DEFAULT_CONFIG.hours);
});

test('spoken() reads long digit runs one digit at a time', () => {
  assert.equal(spoken('That’s 07700 900123.'), 'That’s 0 7 7 0 0, 9 0 0, 1 2 3.');
  assert.equal(spoken('Let me read that back: 07700 900123. Is that right?'), 'Let me read that back: 0 7 7 0 0, 9 0 0, 1 2 3. Is that right?');
  assert.equal(spoken('07700900123'), '0 7 7 0 0, 9 0 0, 1 2 3');
  assert.equal(spoken('MOT is from £45 and open 8am to 12 noon'), 'MOT is from £45 and open 8am to 12 noon');
});

test('hints() suggests something to say at every stage, and each one works', () => {
  const desk = createDesk(DEFAULT_CONFIG);
  const open = desk.hints();
  assert.ok(open.length >= 2 && open.length <= 3);
  assert.ok(open.includes('Are you open on Saturday?'));
  assert.ok(open.includes('How much is an MOT?'));
  assert.ok(open.some((hint) => /broken down/.test(hint)));
  for (const hint of open) {
    const fresh = createDesk(DEFAULT_CONFIG);
    assert.doesNotMatch(fresh.reply(hint), /take a message for the team/);
  }
  // A custom desk only offers a price question for a service that has a price.
  const plain = createDesk({ name: 'Code Club', services: [{ name: 'Tutoring' }] }).hints();
  assert.ok(!plain.some((hint) => /How much/.test(hint)));
  desk.reply('book a service');
  assert.equal(desk.stage, 'name');
  assert.deepEqual(desk.hints(), ['It’s Sam']);
  desk.reply('Sam');
  assert.deepEqual(desk.hints(), ['07700 900123']);
  desk.reply(desk.hints()[0]);
  assert.equal(desk.stage, 'confirm');
  const [yes, no] = desk.hints();
  assert.equal(yes, 'Yes, that’s right');
  assert.match(no, /^No, it ends \d{3}$/);
  desk.reply(no);
  assert.equal(desk.stage, 'confirm');
  assert.notEqual(desk.summary().rows[0][1], 'Sam · 07700 900123');
  desk.reply(yes);
  assert.equal(desk.stage, 'more');
  assert.equal(desk.hints()[0], 'No, that’s all');
  desk.reply(desk.hints()[0]);
  assert.equal(desk.stage, 'done');
  assert.deepEqual(desk.hints(), []);
});

test('replies stay short and never say AI', () => {
  const { said } = talk(['are you a robot', 'do you do MOT', 'yes', 'Sam', '07700 900123', 'yes', 'no, I also need brakes', 'no']);
  for (const line of said) {
    assert.doesNotMatch(line, /\bAI\b/);
    assert.ok((line.match(/[.?!](\s|$)/g) ?? []).length <= 4, line);
  }
});

test('possible danger gets the 999 line; everyday trade words do not', () => {
  for (const line of ['my van is on fire', 'I can smell gas in the kitchen', 'someone is injured', 'there is smoke coming from the boiler']) {
    assert.match(talk([line]).said[1], /ring 999 now/, line);
  }
  for (const line of ['do you do emergency call-outs', 'can you fit a smoke alarm', 'my back hurts when I lift']) {
    assert.doesNotMatch(talk([line]).said[1], /999/, line);
  }
});

test('the goodbye never promises a callback without a confirmed number', () => {
  const { said, desk } = talk(['book an mot', 'Sam', "I'd rather not say", "no that's all"]);
  assert.match(said.at(-1), /couldn’t take a number/);
  assert.doesNotMatch(said.at(-1), /call you back/);
  assert.match(desk.summary().rows.at(-1)[1], /No number left/);
});

test('the service page hero opens the talk-to-it demo', async () => {
  const html = await readFile(path.join(root, 'out', 'after-hours-receptionist.html'), 'utf8');
  assert.match(html, /Talk to the receptionist/);
  assert.ok(html.includes('href="/receptionist-demo"'));
});

test('try-it-as-your-business presets: the closest service wins, acronyms survive, no prices invented', async () => {
  const { presetConfig, PRESETS } = await import('../app/receptionist-demo/presets.mjs');
  const plumber = presetConfig('Smith & Sons Plumbing', 'plumbing');
  assert.equal(plumber.name, 'Smith & Sons Plumbing');
  assert.ok(plumber.services.every((service) => !service.price));
  assert.match(talk(['do you do boiler repair'], plumber).said[1], /we do boiler repair\./);
  assert.match(talk(['how much is a boiler repair'], plumber).said[1], /won’t guess/);
  assert.match(talk(['can you fit an EV charger'], presetConfig('Volt Electrical', 'electrician')).said[1], /we do EV charger/);
  for (const bad of ['www.example.com', 'Call 0906 123 4567', '   ']) assert.equal(presetConfig(bad, 'garage'), null, bad);
  const other = presetConfig('Bean There Cafe', 'other');
  const { desk } = talk([], other);
  assert.deepEqual(desk.hints(), ['Can you take a message?', 'Are you open tomorrow?']);
  assert.match(talk(['Can you take a message?'], other).said[1], /^Of course\. Can I take your name\?$/);
  assert.ok(PRESETS.length >= 8);
});

// Conversation QA fixes (9 Oct 2026): one test per root cause group.
const CALLBACK = /will call you|can call you|call you back (on|after|within)/;
const PLUMBER = {
  name: 'Pipeline Plumbing', hours: 'Monday to Friday 7am to 6pm', areas: 'Leeds and within 15 miles', callback: 'after 7am on the next working day',
  services: [{ name: 'Boiler service', price: 'from £89' }, { name: 'Leak repair' }, { name: 'Unblocking', price: 'from £75' }],
  urgent: ['leak', 'flooding', 'no heating', 'burst pipe'],
};
const DENTAL = {
  name: 'Bright Smile Dental', hours: 'Monday to Friday 9am to 5:30pm', services: [{ name: 'Check-up', price: 'from £25' }, { name: 'Emergency appointment' }],
  urgent: ['toothache', 'swelling', 'swollen', 'knocked out tooth'],
};

test('RC1 danger: real emergencies get 999 before any service answer, trade words do not', () => {
  for (const line of ['my dad had a heart attack', 'she is choking', 'he passed out', 'my throat is closing up', 'I can’t breathe', 'there is a gas smell from the boiler', 'it smells of gas', 'the house is full of smoke', 'he is bleeding', 'someone has collapsed']) {
    assert.match(talk([line], PLUMBER).said[1], /ring 999 now/, line);
  }
  // Danger beats the service match: never "Yes, we do boiler service".
  assert.doesNotMatch(talk(['gas smell from the boiler'], PLUMBER).said[1], /Yes, we do/);
  for (const line of ['I need the brakes bleeding', 'my radiators need bleeding', 'can you service a fire alarm', 'there is a fire alarm test tomorrow']) {
    assert.doesNotMatch(talk([line], PLUMBER).said[1], /999/, line);
  }
});

test('RC2 urgent words: inflections, spacing and plain "urgent" are caught, service questions are not', () => {
  for (const line of ['the kitchen is flooded', 'my pipe is leaking everywhere', 'a pipe has burst under the sink', 'the heating has gone off']) {
    const { said, desk } = talk([line], PLUMBER);
    assert.match(said[1], /marked this as urgent/, line);
    assert.doesNotMatch(said[1], /999/, line);
    assert.ok(desk.summary().urgent, line);
  }
  assert.ok(talk(['my tooth ache is awful'], DENTAL).desk.summary().urgent);
  assert.ok(talk(['my son knocked out a front tooth'], DENTAL).desk.summary().urgent);
  // "emergency" in a call beats the "Emergency appointment" service answer.
  const emergency = talk(['emergency, my tooth is throbbing'], DENTAL);
  assert.match(emergency.said[1], /marked this as urgent/);
  assert.doesNotMatch(emergency.said[1], /Yes, we do/);
  assert.ok(talk(['I need someone asap'], { name: 'Code Club', services: [{ name: 'Tutoring' }], urgent: [] }).desk.summary().urgent);
  for (const line of ['do you do emergency call-outs', 'do you offer emergency appointments', 'it is not urgent']) assert.ok(!talk([line], DENTAL).desk.summary().urgent, line);
  assert.ok(!talk(['can you fit a smoke alarm']).desk.summary().urgent);
});

test('RC3 negatives first: "yeah no" and "that\'s not right" never confirm a number', () => {
  for (const no of ['yeah no', 'no', 'nope', 'not right', 'that’s wrong', 'yeah that’s not right']) {
    const { said, desk } = talk([...NUMBER_LINES, '07700 900123', no]);
    assert.match(said[4], /right number/, no);
    assert.equal(desk.stage, 'number', no);
  }
  const bye = talk(['do you do brakes', 'yes', 'Sam', '07700 900123', 'yes', 'yeah no']);
  assert.equal(bye.desk.stage, 'done');
  // At the offer, any reply starting with no/nah declines, however long.
  const offer = talk(['how much is an MOT', 'no I just wanted the price thanks']);
  assert.match(offer.said[2], /^No problem\. Is there anything else/);
  assert.equal(offer.desk.stage, 'more');
  assert.equal(talk(['how much is an MOT', 'nah that is fine for now']).desk.stage, 'more');
});

test('RC4 no callback is promised before a number is confirmed', () => {
  for (const line of ['can I book in for an MOT', 'how much is a clutch', 'I need to cancel my MOT']) {
    assert.doesNotMatch(talk([line]).said[1], CALLBACK, line);
    assert.match(talk([line]).said[1], /take your details|can take your details/, line);
  }
  const { said, desk } = talk([...NUMBER_LINES, '07700 900124', 'no', '07700 900125', 'no', '07700 900126', 'no', 'no that is all']);
  assert.match(said[8], /couldn’t confirm/);
  assert.doesNotMatch(said[8], CALLBACK);
  assert.doesNotMatch(said.at(-1), CALLBACK);
  assert.equal(desk.summary().rows.at(-1)[1], 'Number not confirmed: check it before ringing');
});

test('RC5/RC6 names: greetings and intros are stripped, numbers and refusals are not names', () => {
  const name = (line) => talk(['book in', line]).desk.summary().rows[0][1];
  for (const [said, want] of [['hiya its Dave', 'Dave'], ['thanks it’s Sam', 'Sam'], ["it's me, Sam", 'Sam'], ['this is Sam speaking', 'Sam'], ['no, it’s Sam', 'Sam'], ['It’s Sam', 'Sam'], ["my name's Sam Jones", 'Sam Jones'], ['yeah hi, my name is priya patel', 'Priya Patel']]) {
    assert.equal(name(said), want, said);
  }
  assert.equal(talk(['book in', 'I’m nine']).desk.stage, 'name');
  assert.equal(talk(['book in', 'no']).desk.summary().rows[0][1], 'Caller (no name given)');
  const both = talk(['book in', 'my name is Sam Jones, 07700 900123', 'yes']);
  assert.equal(both.desk.summary().rows[0][1], 'Sam Jones · 07700 900123');
  assert.equal(both.desk.stage, 'more');
  const hint = talk(['book in', talk(['book in']).desk.hints()[0]]);
  assert.equal(hint.desk.summary().rows[0][1], 'Sam');
});

test('RC7 questions at the name, number and confirm stages are answered, then the question is asked again', () => {
  for (const [before, ask] of [[['book in'], /Can I take your name\?$/], [[...NUMBER_LINES], /best number to call you on\?$/], [[...NUMBER_LINES, '07700 900123'], /Is that right\?$/]]) {
    const { said, desk } = talk([...before, 'erm so how much is an MOT']);
    assert.match(said.at(-1), /from £45/);
    assert.match(said.at(-1), ask);
  }
  // The stage does not move while the side question is answered.
  assert.equal(talk([...NUMBER_LINES, 'how much is an MOT']).desk.stage, 'number');
  assert.equal(talk([...NUMBER_LINES, '07700 900123', 'are you open on saturday']).desk.stage, 'confirm');
  assert.match(talk(['book in', 'sorry what was that']).said[2], /Can I take your name\?$/);
  assert.match(talk([...NUMBER_LINES, '07700 900123', 'pardon']).said[3 + 1], /read that back: 07700 900123/);
  assert.match(talk(['book in', 'what']).said[2], /didn’t catch that/);
});

test('RC8 services match whole words and plurals only; prices hear everyday phrasing', () => {
  assert.doesNotMatch(talk(['my mother rang about her car']).said[1], /Yes, we do/);
  assert.match(talk(['do you do M.O.T.s']).said[1], /Yes, we do MOT/);
  assert.match(talk(['do you do brake pads']).said[1], /we do brakes/);
  assert.match(talk(['do you do tires']).said[1], /we do tyres/);
  const salon = { name: 'Curl & Co', hours: '9 to 5', services: [{ name: 'Cut', price: 'from £28' }, { name: 'Colour' }] };
  assert.doesNotMatch(talk(['I cut my hand on a tin of paint'], salon).said[1], /Yes, we do/);
  assert.match(talk(['do you do a cut'], salon).said[1], /Yes, we do cut/);
  for (const line of ['roughly how many quid for an MOT', 'what would an MOT set me back', 'what do you charge for an MOT', 'how dear is an MOT']) {
    assert.match(talk([line]).said[1], /MOT is from £45/, line);
  }
  assert.match(talk(['how much is a diagnostic']).said[1], /from £40/);
});

test('RC9 branch order: cancel, hours, "open now" and "do you cover brakes"', () => {
  const cancel = talk(['I need to cancel my MOT appointment']);
  assert.match(cancel.said[1], /can’t change the diary/);
  assert.match(cancel.desk.summary().rows.find(([label]) => label === 'Wants')[1], /^Cancel or change: MOT$/);
  assert.match(talk(['can I move my appointment to thursday']).said[1], /can’t change the diary/);
  assert.match(talk(['are you open now']).said[1], /^We’re closed right now\. We’re open Monday to Friday/);
  assert.match(talk(['are you open']).said[1], /^We’re closed right now/);
  assert.doesNotMatch(talk(['are you open on saturday']).said[1], /closed/);
  assert.match(talk(['do you cover brakes']).said[1], /Yes, we do brakes/);
  assert.match(talk(['do you cover Leeds']).said[1], /We cover the town/);
  assert.match(talk(['hello are you still there']).said[1], /still here/);
});

test('RC10 asked if it is a bot, a scam or a person: honest answers, never the word AI', () => {
  for (const line of ['are you a bot', 'are you AI', 'are you a robot', 'is this a recording', 'are you a computer', 'are you real']) {
    const reply = talk([line]).said[1];
    assert.match(reply, /^I’m an automated receptionist for Harbour Street Garage, not a person./, line);
    assert.doesNotMatch(reply, /\bAI\b/);
  }
  assert.match(talk(['is this a scam']).said[1], /^No, this is the automated receptionist for Harbour Street Garage\. If you’d rather check, look up their number and ring back when they’re open\. Can I help with anything\?$/);
  for (const line of ['can I speak to a real person please', 'can I speak to the owner', 'I want to talk to someone']) {
    const { said, desk } = talk([line]);
    assert.match(said[1], /^There’s nobody here right now, but I can take a message and the team will see it after 8am on the next working day\. Can I take your name\?$/, line);
    assert.equal(desk.stage, 'name');
  }
});

test('RC11 goodbyes without new content end the call', () => {
  for (const bye of ['that’s everything thanks', 'that’s it', 'I’m all right thanks', 'I’m alright', 'you’re alright', 'nah you’re alright', 'no I’m good', 'ta', 'cheers', 'thanks bye', 'yeah no']) {
    assert.equal(talk(['do you do brakes', 'yes', 'Sam', '07700 900123', 'yes', bye]).desk.stage, 'done', bye);
  }
  assert.equal(talk(['nah you’re alright']).desk.stage, 'done');
  // New content in the same breath is not a goodbye.
  assert.notEqual(talk(['do you do brakes', 'no', 'I’m all right but do you do MOT']).desk.stage, 'done');
  assert.notEqual(talk(['thanks, how much is an MOT']).desk.stage, 'done');
});

test('RC13 spoken numbers: plus forty four, heard "to" and "for", three tries, UK only', () => {
  assert.equal(digitsFrom('plus forty four seven seven oh oh nine oh oh one two three'), '447700900123');
  assert.notEqual(digitsFrom('oh seven seven oh oh nine oh oh one to three'), '07700900123');
  assert.equal(digitsFrom('oh seven seven oh oh nine oh oh one to three', true), '07700900123');
  assert.equal(digitsFrom('seven for two', true), '742');
  assert.equal(digitsFrom('I want to book for friday', true), '');
  for (const heard of ['plus forty four seven seven oh oh nine oh oh one two three', 'plus four four seven seven oh oh nine oh oh one two three', 'oh seven seven oh oh nine oh oh one to three']) {
    assert.match(talk([...NUMBER_LINES, heard]).said[3], /read that back: 07700 900123/, heard);
  }
  // Said in two goes.
  assert.match(talk([...NUMBER_LINES, 'oh seven seven oh oh nine oh oh one two', 'three']).said[4], /07700 900123/);
  // Two misses still try again; the third gives up.
  assert.equal(talk([...NUMBER_LINES, 'blah', 'blah']).desk.stage, 'number');
  assert.equal(talk([...NUMBER_LINES, 'blah', 'blah', 'blah']).desk.stage, 'more');
  // Not a UK number.
  for (const foreign of ['+1 212 555 0147', 'plus one two one two five five five oh one four seven', '001 212 555 0147']) {
    const { said, desk } = talk([...NUMBER_LINES, foreign]);
    assert.equal(said[3], 'Sorry, I can only take a UK number in this demo. What’s the best UK number?', foreign);
    assert.equal(desk.stage, 'number');
  }
});

test('RC14 urgent words said with a number or name keep them', () => {
  const number = talk([...NUMBER_LINES, '07700 900123 the car is blocking the road']);
  assert.match(number.said[3], /marked this as urgent.*read that back: 07700 900123/);
  assert.equal(number.desk.stage, 'confirm');
  assert.equal(talk([...NUMBER_LINES, '07700 900123 the car is blocking the road', 'yes']).desk.summary().rows[0][1], 'Sam · 07700 900123');
  const name = talk(['book in', 'Sam, my car has broken down']);
  assert.equal(name.desk.stage, 'number');
  assert.equal(name.desk.summary().rows[0][1], 'Sam');
  assert.match(name.said[2], /best number/);
  // Nothing name-like in the urgent line: still asks for the name.
  assert.equal(talk(['book in', 'my car has broken down']).desk.stage, 'name');
});

test('RC15 the owner\'s Wants row is short, link-free and honest', () => {
  const long = talk(['I just wanted to say please call me back about the job see www.cheap-seo.example/offer or http://bad.example/x '.repeat(30)]);
  const wants = long.desk.summary().rows.find(([label]) => label === 'Wants')[1];
  assert.ok(wants.length <= 160, String(wants.length));
  assert.ok(wants.endsWith('…'));
  assert.doesNotMatch(wants, /www\.|https?:|\.example/);
  for (const filler of ['um', 'erm', '...', 'uh']) {
    const { said, desk } = talk([filler]);
    assert.equal(said[1], 'Sorry, I didn’t catch that. Could you say it again?', filler);
    assert.ok(!desk.summary().rows.some(([label]) => label === 'Wants'));
  }
  assert.doesNotMatch(talk(['how much is it']).desk.summary().rows.find(([label]) => label === 'Wants')[1], /Price for (it|how)/);
});

test('a confirmed number with no name still gives the owner a caller and a next step', () => {
  const { desk } = talk(['book an mot', '07700 900123', 'yes', 'bye']);
  assert.equal(desk.stage, 'done');
  const rows = desk.summary().rows;
  assert.deepEqual(rows[0], ['Caller', 'Caller (no name given) · 07700 900123']);
  assert.deepEqual(rows[1], ['Number check', 'Confirmed by caller']);
  assert.match(rows.at(-1)[1], /^Call back after 8am/);
  // And "no that's all" at the name question keeps the number.
  assert.equal(talk(['book an mot', '07700 900123', 'yes', 'no that’s all']).desk.summary().rows[0][1], 'Caller (no name given) · 07700 900123');
});

test('a name said on its own at the start is an introduction, not a message', () => {
  for (const [line, first] of [['It is Sam', 'Sam'], ['Priya Patel', 'Priya'], ['hello, I’m Dave', 'Dave']]) {
    const { said, desk } = talk([line]);
    assert.equal(said[1], `Thanks, ${first}. How can I help?`);
    assert.ok(!desk.summary().rows.some(([label]) => label === 'Wants'), line);
    assert.equal(desk.stage, 'open');
  }
  const then = talk(['Priya Patel', 'book an mot']);
  assert.match(then.said[2], /best number/);
  assert.equal(then.desk.summary().rows[0][1], 'Priya Patel');
  // A service or a real request is never mistaken for a name.
  assert.match(talk(['Tyres']).said[1], /Yes, we do tyres/);
  assert.match(talk(['Hello']).said[1], /^Hello\. How can I help\?$/);
});

test('hints() only suggests lines the engine handles well (walked four levels deep)', () => {
  const configs = [DEFAULT_CONFIG, PLUMBER, DENTAL, { name: 'Code Club', services: [{ name: 'Tutoring' }] }, { name: 'Bean There Cafe', services: [] }];
  const replay = (config, lines) => { const desk = createDesk(config); desk.greet(); lines.forEach((line) => desk.reply(line)); return desk; };
  const walk = (config, path, depth) => {
    const before = replay(config, path);
    if (!depth || before.stage === 'done') return;
    for (const hint of before.hints()) {
      const desk = replay(config, path);
      const stage = desk.stage;
      const reply = desk.reply(hint);
      const label = `${config.name}: ${[...path, hint].join(' > ')} => ${reply}`;
      assert.doesNotMatch(reply, /\bAI\b|^$/, label);
      // Without opening hours, saying so is the honest answer to "Are you open tomorrow?".
      if (stage === 'open' && (config.hours || !/^Are you open/.test(hint))) assert.doesNotMatch(reply, /can’t answer|won’t guess|take a message for the team/, label);
      if (stage === 'name') assert.equal(desk.summary().rows[0][1].split(' · ')[0], 'Sam', label);
      if (stage === 'number') assert.match(reply, /read that back/, label);
      if (stage === 'confirm' && /^Yes/.test(hint)) assert.equal(desk.stage, 'more', label);
      if (stage === 'confirm' && /^No/.test(hint)) assert.match(reply, /read that back/, label);
      if (stage === 'offer') assert.equal(desk.stage, /^Yes/.test(hint) ? (before.summary().rows[0][1].startsWith('No details') ? 'name' : desk.stage) : 'more', label);
      if (stage === 'more' && /^No, that/.test(hint)) assert.equal(desk.stage, 'done', label);
      if (stage === 'more' && !/^No, that/.test(hint)) assert.doesNotMatch(reply, /can’t answer/, label);
      walk(config, [...path, hint], depth - 1);
    }
  };
  for (const config of configs) walk(config, [], 4);
});

test('a partial match on a multi-word service is never claimed as that service', async () => {
  const { presetConfig } = await import('../app/receptionist-demo/presets.mjs');
  const plumber = presetConfig('Smith & Sons Plumbing', 'plumbing');
  const reply = talk(['do you fit new boilers'], plumber).said[1];
  assert.match(reply, /We do boiler service and boiler repair\..*Is it one of those\?/);
  assert.doesNotMatch(reply, /Yes, we do/);
});

test('red team: everyday emergency wording gets the 999 line, trade jargon does not', () => {
  const danger = ["he isn't breathing", "she's stopped breathing", 'struggling to breathe', "he's bleeding", 'allergic reaction', 'he was electrocuted', 'sparks coming from the socket', 'burning smell from the fuse box', 'I can see flames', 'the CO alarm is going off', 'he fell off a ladder', 'I want to kill myself', 'she is having a fit', "my dad's unresponsive", 'water pouring into the fuse box', "there's smoke", "can't wake him up"];
  const safe = ['I need a boiler fitted', 'can you bleed the radiators', 'my smoke alarm needs a new battery', 'flame failure on the boiler', 'fit a new socket', 'my CO alarm needs replacing'];
  for (const line of danger) { const desk = createDesk({}); desk.greet(); assert.match(JSON.stringify(desk.reply(line)), /999/, line); }
  for (const line of safe) { const desk = createDesk({}); desk.greet(); assert.doesNotMatch(JSON.stringify(desk.reply(line)), /999/, line); }
});

test('red team: no phone numbers through prices or names, no disguised links', () => {
  const config = cleanConfig({ name: 'Acme', hours: 'Mon-Fri 8.30am-5.30pm, Sat 9am-12.30pm', services: [
    { name: 'Boiler', price: 'from £0770/0900123' }, { name: 'Gas', price: '£12 a 345678' }, { name: 'Labour', price: '£60 per hour' }, { name: 'Rewire', price: '£1,200' },
    { name: 'Call 0770 / 090 / 0123' }, { name: 'ring oh seven seven double oh nine' }, { name: 'acme dot com' }, { name: 'acme[.]co.uk/x' }, { name: 'ａｃｍｅ．ｃｏｍ' }, { name: 'acme. shop' }, { name: 'visit acme.online' },
  ] });
  assert.equal(config.hours, 'Mon-Fri 8.30am-5.30pm, Sat 9am-12.30pm');
  const text = JSON.stringify(config.services);
  assert.doesNotMatch(text, /0770|345678|acme|ａｃｍｅ|seven/i);
  assert.deepEqual(config.services.filter((s) => s.price).map((s) => s.price), ['£60 per hour', '£1,200']);
});

test('red team 2: details in the opener are kept, junk urgent words and hidden characters are dropped', () => {
  const opener = talk(['my name is Sam and my number is 07700 900123, can you book an MOT', 'yes', 'no thanks']);
  assert.match(opener.said[1], /read that back: 07700 900123/);
  assert.deepEqual(opener.desk.summary().rows[0], ['Caller', 'Sam · 07700 900123']);
  const config = cleanConfig({ name: 'Evil', urgent: ['the', 'ok', 'leak'], areas: '‮hello ٠٧٧٠٠٩٠٠١٢٣' });
  assert.deepEqual(config.urgent, ['leak']);
  assert.ok(!config.areas || !/[‮٠-٩]/.test(config.areas));
  for (const line of ['he has been stabbed', 'someone with a knife is attacking me', 'my dad is hurt badly']) assert.match(talk([line]).said[1], /999/, line);
  assert.doesNotMatch(talk(['I got a knife set for christmas, do you sharpen them']).said[1], /999/);
});

test('an order or part number in the opener is never taken as the callback number', () => {
  const { said, desk } = talk(['my name is Sam and order number is 01234567890, I need tyres', 'yes please']);
  assert.doesNotMatch(said.join(' '), /read that back: 01234 567890/);
  assert.equal(desk.stage, 'number');
  const intro = talk(['hi, call me back on 07700 900123 about brakes', 'yes please', 'Jo']);
  assert.match(intro.said[3], /read that back: 07700 900123/);
});

test('roofer, builder and electrician pages exist, and roofers can talk to the receptionist as a roofer', async () => {
  for (const id of ['roofers', 'builders', 'electricians']) {
    const html = await readFile(path.join(root, 'out', 'for', `${id}.html`), 'utf8');
    assert.match(html, /Get my free preview/, id);
    assert.doesNotMatch(html.replace(/<script[\s\S]*?<\/script>/g, ''), /\bAI\b/, id);
  }
  assert.match(await readFile(path.join(root, 'out', 'for', 'roofers.html'), 'utf8'), /Talk to it as (?:<!-- -->)?a roofer/);
  const { presetConfig } = await import('../app/receptionist-demo/presets.mjs');
  const roofer = presetConfig('Top Tile Roofing', 'roofer');
  assert.match(talk(['there is water coming in through the ceiling'], roofer).said[1], /urgent/);
  assert.match(talk(['do you do guttering'], roofer).said[1], /we do guttering/);
});
