/**
 * Plain messages for things that go wrong with browser speech, each with an
 * obvious next step. Pure, so every wording is tested.
 * @typedef {'mic-denied'|'mic-missing'|'no-recognition'|'no-synthesis'|'no-voice'|'offline'|'quiet'|'hidden'|'in-app'|'voice-failed'} ProblemKind
 * @typedef {{ kind: ProblemKind, message: string, next: string, fatal: boolean }} Problem
 */

export const WORKS_BEST = 'Works best in Chrome or Safari.';

/** @type {Record<ProblemKind, Problem>} */
export const PROBLEMS = {
  'mic-denied': { kind: 'mic-denied', fatal: true, message: 'The microphone is blocked for this page.', next: 'Type or tap a suggestion instead, or allow the microphone in your browser’s address bar and call again.' },
  'mic-missing': { kind: 'mic-missing', fatal: true, message: 'No microphone was found.', next: 'Type or tap a suggestion instead.' },
  'no-recognition': { kind: 'no-recognition', fatal: true, message: 'This browser can’t listen to speech.', next: `Type or tap a suggestion. ${WORKS_BEST}` },
  'no-synthesis': { kind: 'no-synthesis', fatal: false, message: 'This browser can’t speak out loud.', next: 'Replies show as captions, and you can still talk or type.' },
  'no-voice': { kind: 'no-voice', fatal: false, message: 'No voice is installed on this device.', next: 'Replies show as captions instead.' },
  'voice-failed': { kind: 'voice-failed', fatal: false, message: 'The voice didn’t start.', next: 'Replies show as captions for the rest of this call.' },
  offline: { kind: 'offline', fatal: false, message: 'Speech needs an internet connection and couldn’t reach it.', next: 'Type your reply, or check your connection and tap to talk again.' },
  quiet: { kind: 'quiet', fatal: false, message: 'Didn’t catch anything.', next: 'Tap to talk, tap a suggestion, or type.' },
  hidden: { kind: 'hidden', fatal: false, message: 'The call paused because the tab went into the background.', next: 'Tap Continue the call when you’re back.' },
  'in-app': { kind: 'in-app', fatal: false, message: 'In-app browsers often block the microphone.', next: `Open this page in Chrome or Safari to talk. Typing works here. ${WORKS_BEST}` },
};

/**
 * Maps a SpeechRecognition error code to a problem (or null when it is nothing to report).
 * @param {string} code
 * @returns {Problem | null}
 */
export function problemFromRecognitionError(code) {
  switch (code) {
    case 'not-allowed': case 'service-not-allowed': return PROBLEMS['mic-denied'];
    case 'audio-capture': return PROBLEMS['mic-missing'];
    case 'network': return PROBLEMS.offline;
    case 'no-speech': return PROBLEMS.quiet;
    case 'language-not-supported': return PROBLEMS['no-recognition'];
    default: return null; // 'aborted' (we stopped it ourselves) and anything unknown
  }
}

/** Facebook, Instagram, LinkedIn, TikTok, Snapchat, Line, WeChat and Android WebViews. @param {string} userAgent */
export function isInAppBrowser(userAgent) {
  return /FBAN|FBAV|FB_IAB|Instagram|LinkedInApp|musical_ly|BytedanceWebview|TikTok|Snapchat|\bLine\/|MicroMessenger|; wv\)/i.test(String(userAgent));
}

/**
 * What this browser can do, from simple facts. `notice` is the first problem to show.
 * `voices` may be 0 on first load (they arrive later), so `canSpeak` only needs synthesis;
 * the page checks voices again when they load.
 * @param {{ recognition: boolean, synthesis: boolean, voices: number, userAgent?: string }} facts
 * @returns {{ canListen: boolean, canSpeak: boolean, notice: Problem | null }}
 */
export function describeSupport({ recognition, synthesis, voices, userAgent = '' }) {
  const inApp = isInAppBrowser(userAgent);
  const canListen = recognition && !inApp;
  const canSpeak = synthesis;
  /** @type {Problem | null} */
  let notice = null;
  if (inApp) notice = PROBLEMS['in-app'];
  else if (!recognition) notice = PROBLEMS['no-recognition'];
  else if (!synthesis) notice = PROBLEMS['no-synthesis'];
  else if (voices === 0) notice = null; // not an error yet: the list often fills in a moment later
  return { canListen, canSpeak, notice };
}
