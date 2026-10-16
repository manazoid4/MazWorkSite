/**
 * The one small door the call uses to make the receptionist talk. voice-desk.tsx
 * only knows this interface, so a different voice engine can replace the
 * browser's own voice without touching the call logic: speak one sentence with
 * start / word / end callbacks, and cancel it at once.
 */
import { pickVoice } from './voice-pick.mjs';

export type SpeakHandlers = {
  /** Sound has actually begun (not merely queued). */
  onStart: () => void;
  /** Optional: the voice reports it is at this character of the text it was given. */
  onBoundary?: (charIndex: number) => void;
  /** The sentence finished, or failed in a way that should simply move on. */
  onEnd: () => void;
};

export interface SpeechOutput {
  /** Can this engine produce sound at all on this device (before any voice is loaded)? */
  readonly supported: boolean;
  /** How many voices the engine can see right now. 0 can mean "still loading". */
  voiceCount(): number;
  /** Call inside a tap: some browsers only allow sound that starts from a user gesture. */
  unlock(): void;
  /** Speak one sentence. The previous sentence must have ended or been cancelled. */
  speak(text: string, handlers: SpeakHandlers): void;
  /** Stop whatever is playing, now. Handlers of the cancelled sentence must not carry the call on. */
  cancel(): void;
  /** Release listeners. */
  dispose(): void;
}

/** The free engine: the browser's own speechSynthesis, best en-GB voice. */
export function createBrowserSpeech(rate = 1): SpeechOutput | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const synth = window.speechSynthesis;
  let voice: SpeechSynthesisVoice | null = null;
  const pick = () => { voice = pickVoice(synth.getVoices()); };
  pick();
  // Voices often load after the page does, so look again when the list changes.
  synth.addEventListener('voiceschanged', pick);
  return {
    supported: true,
    voiceCount: () => synth.getVoices().length,
    unlock: () => { synth.speak(new SpeechSynthesisUtterance(' ')); },
    speak(text, handlers) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = rate;
      if (voice) utterance.voice = voice;
      utterance.onstart = handlers.onStart;
      if (handlers.onBoundary) utterance.onboundary = (event) => handlers.onBoundary?.(event.charIndex);
      utterance.onend = handlers.onEnd;
      utterance.onerror = handlers.onEnd;
      synth.speak(utterance);
    },
    cancel: () => synth.cancel(),
    dispose: () => synth.removeEventListener('voiceschanged', pick),
  };
}
