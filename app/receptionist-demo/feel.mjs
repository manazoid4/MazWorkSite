/**
 * Small touches: soft ring / pick-up / hang-up tones from the Web Audio API
 * (no audio files) and a short vibration where the phone supports it.
 * The tone shapes are plain data so they can be tested; playing needs a browser.
 */

/** Each tone is a list of notes: frequency (Hz), start (s), length (s). Soft sine beeps, UK-style double ring. */
export const TONES = {
  ring: [{ f: 400, at: 0, len: 0.4 }, { f: 450, at: 0, len: 0.4 }, { f: 400, at: 0.55, len: 0.4 }, { f: 450, at: 0.55, len: 0.4 }],
  pickup: [{ f: 660, at: 0, len: 0.09 }, { f: 880, at: 0.11, len: 0.12 }],
  hangup: [{ f: 520, at: 0, len: 0.12 }, { f: 380, at: 0.14, len: 0.2 }],
};

/** Vibration patterns in ms. */
export const BUZZ = { connect: [18], end: [14, 50, 14] };

/** Loudest a tone gets (0 to 1). Kept quiet on purpose. */
export const TONE_VOLUME = 0.045;

/**
 * Plays a named tone. Does nothing when audio is unavailable.
 * @param {{ currentTime: number, destination: unknown, createOscillator: () => any, createGain: () => any } | null} ctx
 * @param {keyof typeof TONES} name
 */
export function playTone(ctx, name) {
  if (!ctx) return;
  const t0 = ctx.currentTime + 0.02;
  for (const note of TONES[name]) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = note.f;
    gain.gain.setValueAtTime(0.0001, t0 + note.at);
    gain.gain.linearRampToValueAtTime(TONE_VOLUME, t0 + note.at + 0.02);
    gain.gain.linearRampToValueAtTime(0.0001, t0 + note.at + note.len);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0 + note.at);
    osc.stop(t0 + note.at + note.len + 0.05);
  }
}

/** Vibrates if the device can (not iOS Safari). @param {keyof typeof BUZZ} name */
export function buzz(name) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(BUZZ[name]);
  } catch { /* vibration is only ever a bonus */ }
}
