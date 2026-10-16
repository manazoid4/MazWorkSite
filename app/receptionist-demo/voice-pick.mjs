/**
 * Choosing the best free voice the browser already has. Pure: give it the list
 * from speechSynthesis.getVoices(). No network, nothing downloaded.
 * @typedef {{ name: string, lang: string, localService?: boolean, default?: boolean }} VoiceLike
 */

const langOf = (/** @type {VoiceLike} */ v) => String(v.lang || '').replace('_', '-').toLowerCase();

/** Novelty voices that ship with macOS / iOS and sound like jokes on a phone line. */
const NOVELTY = /\b(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|grandma|grandpa|rocko|shelley|sandy|flo|eddy|reed)\b/i;
/** Names that tend to be the natural-sounding en-GB voices across Chrome, Edge, Safari and Android. */
const GOOD = /** @type {[RegExp, number][]} */ ([
  [/natural|neural|online/i, 40],
  [/google uk english female/i, 34],
  [/\b(sonia|libby|maisie)\b/i, 38],
  [/\b(serena|kate|stephanie|martha|oliver|daniel|arthur)\b/i, 24],
  [/\b(hazel|susan|george)\b/i, 14],
  [/premium|enhanced|siri/i, 18],
  [/google uk english male/i, 12],
]);

/**
 * Higher is better. en-GB beats other English; quality names and local (instant) voices add points.
 * Not English: -1. Novelty voice: 1.
 * @param {VoiceLike} voice
 */
export function scoreVoice(voice) {
  const l = langOf(voice);
  let score = 0;
  if (l === 'en-gb') score += 100;
  else if (l.startsWith('en-')) score += 40;
  else if (l === 'en') score += 30;
  else return -1;
  if (NOVELTY.test(voice.name)) return 1;
  for (const [pattern, points] of GOOD) if (pattern.test(voice.name)) score += points;
  if (voice.localService) score += 6;
  if (voice.default && l.startsWith('en')) score += 2;
  return score;
}

/** Voices best first, English only, novelty voices left out. @param {VoiceLike[]} voices */
export function rankVoices(voices) {
  return voices
    .map((voice, index) => ({ voice, index, score: scoreVoice(voice) }))
    .filter((item) => item.score > 1)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.voice);
}

/**
 * The voice to use, or null (let the browser choose its default for en-GB).
 * @template {VoiceLike} V
 * @param {V[]} voices
 * @returns {V | null}
 */
export function pickVoice(voices) {
  return /** @type {V | null} */ (rankVoices(voices)[0] ?? null);
}
