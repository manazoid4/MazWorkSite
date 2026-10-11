/**
 * The call as an explicit state machine. Pure: no browser, no timers.
 * voice-desk.tsx sends events as real things happen (speech started, mic opened,
 * words heard) and draws whatever phase comes back.
 *
 *   idle -> ringing -> thinking -> speaking -> waiting -> listening -> thinking ...
 *   speaking/thinking -> interrupted -> listening        (tap to interrupt)
 *   any live phase -> paused (tab hidden) -> thinking    (continue)
 *   any live phase -> ended
 */

/** @typedef {'idle'|'ringing'|'speaking'|'thinking'|'interrupted'|'listening'|'waiting'|'paused'|'ended'} Phase */
/** @typedef {{ phase: Phase, muted: boolean, silences: number }} CallState */

/** How long the mic stays open with nobody talking before we nudge (ms). */
export const LISTEN_PATIENCE_MS = 9000;

/** Typing or muted: how long a quiet call waits before "Are you still there?" (ms). The same wait again ends it. */
export const TYPED_IDLE_MS = 45000;

/** @type {CallState} */
export const IDLE = { phase: 'idle', muted: false, silences: 0 };

const LIVE = new Set(['ringing', 'speaking', 'thinking', 'interrupted', 'listening', 'waiting', 'paused']);
/** @param {Phase} phase */
export const isLive = (phase) => LIVE.has(phase);

/**
 * @param {CallState} state
 * @param {{ type: string }} event
 * @returns {CallState}
 */
export function transition(state, event) {
  const { phase } = state;
  const to = (/** @type {Phase} */ next, extra = {}) => ({ ...state, phase: next, ...extra });
  switch (event.type) {
    case 'CALL':
      return phase === 'idle' || phase === 'ended' ? { phase: 'ringing', muted: state.muted, silences: 0 } : state;
    case 'RING_END':
      return phase === 'ringing' ? to('thinking') : state;
    case 'THINK':
      return isLive(phase) && phase !== 'paused' ? to('thinking') : state;
    case 'SPEAK_START':
      return ['thinking', 'ringing', 'speaking', 'waiting', 'interrupted'].includes(phase) ? to('speaking') : state;
    case 'SPEAK_END':
      return phase === 'speaking' || phase === 'thinking' ? to('waiting') : state;
    case 'YIELD':
      return phase === 'interrupted' ? to('waiting') : state;
    case 'STOP_LISTEN':
      return phase === 'listening' ? to('waiting') : state;
    case 'LISTEN_OPEN':
      return phase === 'waiting' || phase === 'interrupted' ? to('listening') : state;
    case 'HEARD':
      return ['listening', 'waiting', 'interrupted', 'thinking', 'ringing'].includes(phase) ? to('thinking', { silences: 0 }) : state;
    case 'SILENCE':
      return phase === 'listening' || phase === 'waiting' || phase === 'interrupted' ? to('waiting', { silences: state.silences + 1 }) : state;
    case 'INTERRUPT':
      return phase === 'speaking' || phase === 'thinking' ? to('interrupted') : state;
    case 'MUTE':
      return { ...state, muted: !state.muted, phase: !state.muted && phase === 'listening' ? 'waiting' : phase };
    case 'PAUSE':
      return isLive(phase) && phase !== 'paused' ? to('paused') : state;
    case 'RESUME':
      return phase === 'paused' ? to('thinking') : state;
    case 'END':
      return isLive(phase) ? to('ended') : state;
    case 'RESET':
      return { ...IDLE, muted: state.muted };
    default:
      return state;
  }
}

/** First silence gets "Are you still there?", the second ends the call politely. @param {number} silences */
export const silenceAction = (silences) => (silences <= 0 ? 'none' : silences === 1 ? 'prompt' : 'goodbye');

export const STILL_THERE = 'Are you still there? You can talk, tap a suggestion, or type.';
export const SILENCE_GOODBYE = 'I can’t hear anyone, so I’ll leave it there. Please ring again any time. Goodbye.';

/**
 * Words on screen for a phase. Colour and shape come from CSS; this is the text that carries it for everyone.
 * @param {Phase} phase
 * @param {{ muted?: boolean, typing?: boolean }} [opts]
 */
export function phaseLabel(phase, opts = {}) {
  const yourTurn = opts.muted || opts.typing ? 'Your turn · type or tap' : 'Your turn';
  return {
    idle: 'Ready to ring',
    ringing: 'Ringing',
    speaking: 'Receptionist speaking',
    thinking: 'Thinking',
    interrupted: 'Interrupted · go ahead',
    listening: 'Listening to you',
    waiting: yourTurn,
    paused: 'Paused',
    ended: 'Call ended',
  }[phase];
}

/**
 * What the one big button does in each phase.
 * @param {Phase} phase
 * @param {{ canListen: boolean }} opts
 * @returns {{ action: 'call'|'interrupt'|'stop'|'talk'|'resume'|'again'|'none', label: string }}
 */
export function primaryFor(phase, { canListen }) {
  switch (phase) {
    case 'idle': return { action: 'call', label: 'Start the call' };
    case 'ended': return { action: 'again', label: 'Call again' };
    case 'speaking': case 'thinking': return { action: 'interrupt', label: 'Tap to interrupt' };
    case 'listening': return { action: 'stop', label: 'I’m done talking' };
    case 'interrupted': return { action: 'none', label: 'Opening the mic…' };
    case 'waiting': return canListen ? { action: 'talk', label: 'Tap to talk' } : { action: 'none', label: 'Type your reply below' };
    case 'paused': return { action: 'resume', label: 'Continue the call' };
    default: return { action: 'none', label: 'Ringing…' };
  }
}
