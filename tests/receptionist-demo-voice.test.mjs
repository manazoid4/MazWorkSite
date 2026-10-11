import assert from 'node:assert/strict';
import test from 'node:test';
import { IDLE, LISTEN_PATIENCE_MS, isLive, phaseLabel, primaryFor, silenceAction, transition } from '../app/receptionist-demo/call-machine.mjs';
import { pickVoice, rankVoices, scoreVoice } from '../app/receptionist-demo/voice-pick.mjs';
import { captionUnits, estimateMs, lastQuestion, pauseAfter, planSpeech, revealAtChar, revealAtTime, splitSentences, thinkingBeatMs } from '../app/receptionist-demo/speech-plan.mjs';
import { PROBLEMS, describeSupport, isInAppBrowser, problemFromRecognitionError } from '../app/receptionist-demo/recovery.mjs';
import { ownerMessage } from '../app/receptionist-demo/owner-message.mjs';
import { BUZZ, TONES, TONE_VOLUME, playTone } from '../app/receptionist-demo/feel.mjs';
import { createDesk, DEFAULT_CONFIG, spoken } from '../app/receptionist-demo/engine.mjs';

const run = (events, from = IDLE) => events.reduce((state, type) => transition(state, { type }), from);

// ---- state machine ----
test('a normal turn walks idle, ringing, thinking, speaking, waiting, listening, thinking', () => {
  const phases = [];
  let state = IDLE;
  for (const type of ['CALL', 'RING_END', 'SPEAK_START', 'SPEAK_END', 'LISTEN_OPEN', 'HEARD']) {
    state = transition(state, { type });
    phases.push(state.phase);
  }
  assert.deepEqual(phases, ['ringing', 'thinking', 'speaking', 'waiting', 'listening', 'thinking']);
});

test('tapping to interrupt goes speaking -> interrupted -> listening, and only while the receptionist talks or thinks', () => {
  assert.equal(run(['CALL', 'RING_END', 'SPEAK_START', 'INTERRUPT']).phase, 'interrupted');
  assert.equal(run(['CALL', 'RING_END', 'SPEAK_START', 'INTERRUPT', 'LISTEN_OPEN']).phase, 'listening');
  assert.equal(run(['CALL', 'RING_END', 'SPEAK_START', 'SPEAK_END', 'INTERRUPT']).phase, 'waiting', 'nothing to interrupt in your own turn');
  assert.equal(run(['INTERRUPT']).phase, 'idle');
});

test('with no microphone an interruption yields to typing instead of hanging', () => {
  assert.equal(run(['CALL', 'RING_END', 'SPEAK_START', 'INTERRUPT', 'YIELD']).phase, 'waiting');
});

test('silence is counted, reset by speech, and the first nudges while the second ends politely', () => {
  const quiet = run(['CALL', 'RING_END', 'SPEAK_START', 'SPEAK_END', 'LISTEN_OPEN', 'SILENCE']);
  assert.equal(quiet.silences, 1);
  assert.equal(silenceAction(quiet.silences), 'prompt');
  const again = run(['SPEAK_START', 'SPEAK_END', 'LISTEN_OPEN', 'SILENCE'], quiet);
  assert.equal(silenceAction(again.silences), 'goodbye');
  assert.equal(run(['HEARD'], quiet).silences, 0);
  assert.equal(silenceAction(0), 'none');
});

test('mute is a toggle that drops a live mic to your-turn and survives into the next call', () => {
  const live = run(['CALL', 'RING_END', 'SPEAK_START', 'SPEAK_END', 'LISTEN_OPEN']);
  const muted = transition(live, { type: 'MUTE' });
  assert.equal(muted.muted, true);
  assert.equal(muted.phase, 'waiting');
  assert.equal(transition(muted, { type: 'MUTE' }).muted, false);
  assert.equal(run(['END', 'CALL'], muted).muted, true);
});

test('hidden tab pauses a live call, continue picks it up, and an ended call stays ended', () => {
  const paused = run(['CALL', 'RING_END', 'SPEAK_START', 'PAUSE']);
  assert.equal(paused.phase, 'paused');
  assert.equal(transition(paused, { type: 'RESUME' }).phase, 'thinking');
  const ended = run(['CALL', 'END']);
  assert.equal(ended.phase, 'ended');
  assert.equal(isLive(ended.phase), false);
  assert.equal(transition(ended, { type: 'PAUSE' }).phase, 'ended');
  assert.equal(transition(ended, { type: 'HEARD' }).phase, 'ended');
  assert.equal(transition(ended, { type: 'CALL' }).phase, 'ringing');
});

test('every phase has words on screen and the big button always says what it will do', () => {
  for (const phase of ['idle', 'ringing', 'speaking', 'thinking', 'interrupted', 'listening', 'waiting', 'paused', 'ended']) {
    assert.ok(phaseLabel(phase).length > 3, phase);
    assert.ok(primaryFor(phase, { canListen: true }).label.length > 3, phase);
  }
  assert.equal(primaryFor('speaking', { canListen: true }).action, 'interrupt');
  assert.equal(primaryFor('waiting', { canListen: false }).action, 'none');
  assert.match(phaseLabel('waiting', { muted: true }), /type or tap/i);
  assert.ok(LISTEN_PATIENCE_MS >= 6000 && LISTEN_PATIENCE_MS <= 15000);
});

// ---- voices ----
test('voice ranking prefers natural en-GB voices, drops novelty and non-English voices', () => {
  const voices = [
    { name: 'Samantha', lang: 'en-US', localService: true },
    { name: 'Eddy', lang: 'en-GB', localService: true },
    { name: 'Thomas', lang: 'fr-FR', localService: true },
    { name: 'Google UK English Female', lang: 'en-GB', localService: false },
    { name: 'Microsoft Sonia Online (Natural) - English (United Kingdom)', lang: 'en-GB', localService: false },
    { name: 'Daniel', lang: 'en_GB', localService: true },
  ];
  const ranked = rankVoices(voices).map((v) => v.name);
  assert.match(ranked[0], /Sonia/);
  assert.ok(ranked.indexOf('Google UK English Female') < ranked.indexOf('Samantha'));
  assert.ok(!ranked.includes('Eddy') && !ranked.includes('Thomas'));
  assert.ok(ranked.includes('Daniel'), 'underscore locales still count as en-GB');
});

test('voice picking falls back gracefully: other English, then null', () => {
  assert.equal(pickVoice([{ name: 'Samantha', lang: 'en-US' }])?.name, 'Samantha');
  assert.equal(pickVoice([{ name: 'Thomas', lang: 'fr-FR' }]), null);
  assert.equal(pickVoice([]), null);
  assert.ok(scoreVoice({ name: 'X', lang: 'en-GB', localService: true }) > scoreVoice({ name: 'X', lang: 'en-GB', localService: false }));
});

// ---- speech plan and captions ----
test('replies split into sentences without breaking times, numbers or abbreviations of digits', () => {
  assert.deepEqual(splitSentences('We open at 8.30am. Is that right? Yes!'), ['We open at 8.30am.', 'Is that right?', 'Yes!']);
  assert.deepEqual(splitSentences('I read that back: 07700 900123. Is that right?'), ['I read that back: 07700 900123.', 'Is that right?']);
  assert.deepEqual(splitSentences('  '), []);
  assert.deepEqual(splitSentences('No full stop here'), ['No full stop here']);
});

test('speech plan pauses longer after questions and number read-backs, and not after the last sentence', () => {
  const plan = planSpeech('Good evening. How can I help? Your number is 07700 900123.');
  assert.equal(plan.length, 3);
  assert.equal(plan[2].pause, 0);
  assert.equal(plan[2].last, true);
  assert.ok(plan[1].pause > plan[0].pause);
  assert.ok(pauseAfter('07700 900123 is that right.') > pauseAfter('Hello there.'));
  assert.match(plan[2].say, /0 7 7 0 0, 9 0 0, 1 2 3/);
  assert.equal(lastQuestion('Thanks. What is your name? Take your time.'), 'What is your name?');
  assert.equal(lastQuestion('All done.'), '');
});

test('the thinking beat is short, scales with the answer and is quicker for urgent calls', () => {
  const short = thinkingBeatMs('Yes.');
  const long = thinkingBeatMs('x'.repeat(400));
  assert.ok(short >= 260 && long <= 820 && long > short);
  assert.ok(thinkingBeatMs('x'.repeat(200), { urgent: true }) < thinkingBeatMs('x'.repeat(200)));
  assert.ok(thinkingBeatMs('', { urgent: true }) >= 160);
});

test('captions follow word boundaries measured in SPOKEN characters, so a read-out number is not skipped early', () => {
  const display = 'Your number is 07700 900123, right?';
  const units = captionUnits(display);
  assert.deepEqual(units.map((u) => u.text), ['Your', 'number', 'is', '07700 900123,', 'right?']);
  assert.equal(units[3].start, 'Your number is '.length);
  // The voice is at char 3 ("Your"): one unit. At the number's start: four units. Inside the number: still four.
  assert.equal(revealAtChar(units, 0), 1);
  assert.equal(revealAtChar(units, units[3].start), 4);
  assert.equal(revealAtChar(units, units[3].start + 10), 4);
  assert.equal(revealAtChar(units, units[4].start), 5);
  assert.ok(units[4].start > units[3].start + spoken('07700 900123,').length - 1);
});

test('timed captions reveal in proportion, start non-empty, and finish at the end', () => {
  const units = captionUnits('One two three four five six');
  const total = estimateMs('One two three four five six');
  assert.equal(revealAtTime(units, 0, total), 1);
  assert.equal(revealAtTime(units, total, total), units.length);
  const mid = revealAtTime(units, total / 2, total);
  assert.ok(mid > 1 && mid < units.length);
  assert.equal(revealAtTime([], 100, 1000), 0);
  assert.ok(estimateMs('a b c d e f g h', 2) < estimateMs('a b c d e f g h', 1));
});

// ---- recovery ----
test('recognition errors map to plain messages with a next step', () => {
  assert.equal(problemFromRecognitionError('not-allowed'), PROBLEMS['mic-denied']);
  assert.equal(problemFromRecognitionError('service-not-allowed').kind, 'mic-denied');
  assert.equal(problemFromRecognitionError('audio-capture').kind, 'mic-missing');
  assert.equal(problemFromRecognitionError('network').kind, 'offline');
  assert.equal(problemFromRecognitionError('no-speech').fatal, false);
  assert.equal(problemFromRecognitionError('aborted'), null);
  for (const problem of Object.values(PROBLEMS)) {
    assert.ok(problem.message && problem.next, problem.kind);
    assert.doesNotMatch(`${problem.message} ${problem.next}`, /\bAI\b/);
  }
  assert.match(PROBLEMS['no-recognition'].next, /Chrome or Safari/);
});

test('support detection: no recognition means typing, in-app browsers are named, and missing voices are not an error until a call fails', () => {
  assert.equal(describeSupport({ recognition: false, synthesis: true, voices: 3 }).canListen, false);
  assert.equal(describeSupport({ recognition: false, synthesis: true, voices: 3 }).notice?.kind, 'no-recognition');
  assert.equal(describeSupport({ recognition: true, synthesis: false, voices: 0 }).notice?.kind, 'no-synthesis');
  assert.equal(describeSupport({ recognition: true, synthesis: true, voices: 0 }).notice, null);
  assert.equal(describeSupport({ recognition: true, synthesis: true, voices: 4 }).canListen, true);
  const insta = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605 Mobile/15E148 Instagram 300.0';
  assert.equal(isInAppBrowser(insta), true);
  assert.equal(isInAppBrowser('Mozilla/5.0 (iPhone) Safari/604.1'), false);
  assert.equal(describeSupport({ recognition: true, synthesis: true, voices: 4, userAgent: insta }).notice?.kind, 'in-app');
});

// ---- owner message ----
test('the summary becomes the message the owner would get: who, number, needs, urgency, answered, next step', () => {
  const desk = createDesk(DEFAULT_CONFIG);
  desk.greet();
  for (const line of ['Do you do MOTs?', 'yes please', "it's sam jones", 'oh seven seven double oh nine double oh one two three', 'yes that is right', "no that's all"]) desk.reply(line);
  const message = ownerMessage(desk.summary(), { business: 'Harbour Street Garage', time: '21:04', seconds: 75 });
  assert.deepEqual(message.rows.map((row) => row.label), ['Who', 'Number', 'Needs', 'Urgency', 'Answered', 'Next step']);
  assert.equal(message.rows[0].value, 'Sam Jones');
  assert.match(message.rows[1].value, /^07700 900123 \(confirmed by caller\)$/);
  assert.equal(message.rows[3].value, 'Not urgent');
  assert.equal(message.length, '1 min 15 sec');
});

test('an urgent call with no details is flagged and says so plainly', () => {
  const desk = createDesk(DEFAULT_CONFIG);
  desk.greet();
  desk.reply('I have broken down, it is urgent');
  const message = ownerMessage(desk.summary(), { business: 'Garage', time: '22:10', seconds: 9 });
  assert.equal(message.urgent, true);
  assert.equal(message.rows.find((row) => row.label === 'Urgency')?.tone, 'urgent');
  assert.equal(message.length, '9 sec');
});

// ---- small touches ----
test('tones are quiet, short and need no audio files; vibration patterns are brief', () => {
  assert.ok(TONE_VOLUME <= 0.08);
  for (const notes of Object.values(TONES)) {
    assert.ok(notes.every((n) => n.f >= 200 && n.f <= 1200 && n.len <= 0.5));
    assert.ok(Math.max(...notes.map((n) => n.at + n.len)) <= 1.2);
  }
  for (const pattern of Object.values(BUZZ)) assert.ok(pattern.reduce((a, b) => a + b, 0) <= 100);
  const made = [];
  const node = () => ({ type: '', frequency: {}, gain: { setValueAtTime() {}, linearRampToValueAtTime() {} }, connect() {}, start() { made.push('start'); }, stop() {} });
  playTone({ currentTime: 0, destination: {}, createOscillator: node, createGain: node }, 'pickup');
  assert.equal(made.length, TONES.pickup.length);
  assert.doesNotThrow(() => playTone(null, 'ring'));
});
