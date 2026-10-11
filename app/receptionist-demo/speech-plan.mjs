/**
 * Turning a reply into natural speech: sentences with short pauses, a thinking
 * beat before answering, and captions that follow the voice. Pure.
 */
import { spoken } from './engine.mjs';

/**
 * Splits at . ? ! only where a sentence really ends: the mark must be followed
 * by a space or the end, so "8.30am" and "07700 900123," stay whole.
 * @param {string} text
 * @returns {string[]}
 */
export function splitSentences(text) {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const out = [];
  let from = 0;
  for (let i = 0; i < clean.length; i += 1) {
    if (!/[.?!…]/.test(clean[i])) continue;
    let end = i;
    while (end + 1 < clean.length && /[.?!…"”’')]/.test(clean[end + 1])) end += 1;
    if (end + 1 === clean.length || clean[end + 1] === ' ') {
      out.push(clean.slice(from, end + 1).trim());
      from = end + 1;
      i = end;
    }
  }
  if (from < clean.length) out.push(clean.slice(from).trim());
  return out.filter(Boolean);
}

/** Pause after a sentence, in ms: questions and number read-backs breathe more. @param {string} sentence */
export function pauseAfter(sentence) {
  if (/\d(?: ?\d){6,}/.test(sentence)) return 480;
  if (/\?\s*$/.test(sentence)) return 380;
  if (/!\s*$/.test(sentence)) return 220;
  return 260;
}

/**
 * Display text, spoken text and pause for each sentence of a reply.
 * @param {string} text
 * @returns {{ display: string, say: string, pause: number, last: boolean }[]}
 */
export function planSpeech(text) {
  const sentences = splitSentences(text);
  return sentences.map((display, index) => ({
    display,
    say: spoken(display),
    pause: index === sentences.length - 1 ? 0 : pauseAfter(display),
    last: index === sentences.length - 1,
  }));
}

/**
 * The beat before the receptionist answers, so it never feels instant or robotic.
 * Urgent answers come quicker. Always between 160 and 820 ms.
 * @param {string} reply
 * @param {{ urgent?: boolean }} [opts]
 */
export function thinkingBeatMs(reply, opts = {}) {
  const base = 300 + Math.min(String(reply).length, 240) * 1.9;
  return Math.round(Math.max(opts.urgent ? 160 : 260, Math.min(820, opts.urgent ? base * 0.5 : base)));
}

/** Rough speaking time of a spoken sentence at a given rate, in ms. @param {string} say @param {number} [rate] */
export function estimateMs(say, rate = 1) {
  const words = Math.max(1, String(say).trim().split(/\s+/).length);
  return Math.round((350 + words * 340) / Math.max(0.5, rate));
}

/**
 * Splits a displayed sentence into caption units and records where each one
 * starts in the SPOKEN text, because speech `boundary` events count characters
 * of what was spoken ("07700 900123" is spoken digit by digit, so it is much longer).
 * @param {string} display
 * @returns {{ text: string, start: number }[]}
 */
export function captionUnits(display) {
  const units = [];
  let offset = 0;
  // A run of 7+ digits is one unit, matching what spoken() expands.
  const pieces = String(display).match(/\d(?: ?\d){6,}\S*|\S+/g) ?? [];
  for (const piece of pieces) {
    units.push({ text: piece, start: offset });
    offset += spoken(piece).length + 1;
  }
  return units;
}

/**
 * How many caption units to show when the voice reports it is at `charIndex`
 * (the unit being spoken counts as shown).
 * @param {{ start: number }[]} units
 * @param {number} charIndex
 */
export function revealAtChar(units, charIndex) {
  let shown = 0;
  for (const unit of units) if (unit.start <= charIndex) shown += 1;
  return Math.min(units.length, Math.max(units.length ? 1 : 0, shown));
}

/**
 * Time-based fallback for voices that send no boundary events (many Android and
 * Safari voices) or when the voice is off: reveal in proportion to elapsed time.
 * @param {{ start: number }[]} units
 * @param {number} elapsedMs
 * @param {number} totalMs
 */
export function revealAtTime(units, elapsedMs, totalMs) {
  if (!units.length) return 0;
  if (elapsedMs >= totalMs) return units.length;
  const last = units[units.length - 1];
  const spokenLength = last.start + last.text.length;
  return revealAtChar(units, Math.floor((Math.max(0, elapsedMs) / Math.max(1, totalMs)) * spokenLength));
}

/** The last question in a reply, so "She asked" can stay on screen while you answer. @param {string} text */
export function lastQuestion(text) {
  const asked = splitSentences(text).filter((sentence) => /\?["”’')]*\s*$/.test(sentence));
  return asked.length ? asked[asked.length - 1] : '';
}

/**
 * What the caller said, when the recogniser stops. A final result wins; if the
 * browser only ever sent an interim one (it often ends right after the last
 * words), that still counts, unless it is just a noise word.
 * @param {string} finalText
 * @param {string} interimText
 */
export function chooseHeard(finalText, interimText) {
  const final = String(finalText || '').trim();
  if (final) return final;
  const interim = String(interimText || '').trim();
  return /^(um+|uh+|er+m?|hmm+|mm+|ah+|huh)$/i.test(interim) ? '' : interim;
}
