'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { AFTER_HOURS } from '../offers';
import { MAIN_CTA } from '../site';
import { IDLE, LISTEN_PATIENCE_MS, SILENCE_GOODBYE, STILL_THERE, TYPED_IDLE_MS, isLive, phaseLabel, primaryFor, silenceAction, transition, type Phase } from './call-machine.mjs';
import { DEFAULT_CONFIG, cleanConfig, createDesk, decodeConfig } from './engine.mjs';
import { buzz, playTone } from './feel.mjs';
import { ownerMessage } from './owner-message.mjs';
import { PROBLEMS, WORKS_BEST, describeSupport, problemFromRecognitionError, type Problem } from './recovery.mjs';
import { captionUnits, chooseHeard, estimateMs, lastQuestion, planSpeech, revealAtChar, revealAtTime, thinkingBeatMs } from './speech-plan.mjs';
import { createBrowserSpeech, type SpeechOutput } from './speech-output';
import { TryYours } from './try-yours';

type Line = { who: 'desk' | 'caller'; text: string; cut?: boolean };
type Desk = ReturnType<typeof createDesk>;
type Source = 'default' | 'link' | 'typed';
type Unit = { text: string; start: number };
type Caption = { units: Unit[]; shown: number };
type Machine = typeof IDLE;

/* The browser's own speech tools. Not in TypeScript's DOM types yet. */
type Recogniser = {
  lang: string; interimResults: boolean; continuous: boolean; maxAlternatives: number;
  onresult: ((event: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  onaudiostart: (() => void) | null;
  onstart: (() => void) | null;
  start(): void; stop(): void; abort(): void;
};
const recogniserClass = (): (new () => Recogniser) | null => {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recogniser; webkitSpeechRecognition?: new () => Recogniser };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

const RATE = 1;
const clock = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

const ICONS: Record<string, string> = {
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  speaking: 'M4 9v6h4l5 4V5L8 9H4zM16 8.5a5 5 0 0 1 0 7M18.6 6a8.5 8.5 0 0 1 0 12',
  mic: 'M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
  micoff: 'M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3M3 3l18 18',
  thinking: 'M6 12h.01M12 12h.01M18 12h.01',
  keys: 'M3 7h18v10H3zM7 11h.01M11 11h.01M15 11h.01M7 14h10',
  sound: 'M4 9v6h4l5 4V5L8 9H4zM16 9a4 4 0 0 1 0 6',
  soundoff: 'M4 9v6h4l5 4V5L8 9H4zM17 9l5 6M22 9l-5 6',
  end: 'M3 14c5-4 13-4 18 0l-2 3-4-1.5v-2.5a10 10 0 0 0-6 0V15.5L5 17z',
  hand: 'M8 12V5.5a1.5 1.5 0 0 1 3 0V11M11 10V4.5a1.5 1.5 0 0 1 3 0V11M14 10V6.5a1.5 1.5 0 0 1 3 0V13a7 7 0 0 1-7 7c-3 0-4.5-1.5-6-4l-1.3-2.2a1.4 1.4 0 0 1 2.3-1.5L8 14',
  pause: 'M8 5v14M16 5v14',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  send: 'M4 12l16-8-6 16-3-7z',
  again: 'M4 12a8 8 0 1 0 3-6.2M4 4v5h5',
};
function Ico({ name, size = 24 }: { name: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={ICONS[name] ?? ICONS.phone} />
    </svg>
  );
}
const phaseIcon = (phase: Phase): string => ({ idle: 'phone', ringing: 'phone', speaking: 'speaking', thinking: 'thinking', interrupted: 'hand', listening: 'mic', waiting: 'mic', paused: 'pause', ended: 'check' } as Record<Phase, string>)[phase];

/**
 * A pretend after-hours call you can have out loud, in the browser. One screen, all the way through.
 * Speech in and out uses the browser's built-in tools (free, no account).
 * Answers come from engine.mjs: only the business details in the link.
 * The call itself is a state machine (call-machine.mjs); this file wires real browser events into it.
 * Without a microphone, or in browsers without speech, you type or tap a suggestion instead.
 */
export function VoiceDesk() {
  const [config, setConfig] = useState(cleanConfig(DEFAULT_CONFIG));
  const [source, setSource] = useState<Source>('default');
  const [view, setView] = useState<Machine>(IDLE);
  const [seconds, setSeconds] = useState(0);
  const [madeAt, setMadeAt] = useState('');
  const [lines, setLines] = useState<Line[]>([]);
  const [caption, setCaption] = useState<Caption | null>(null);
  const [interim, setInterim] = useState('');
  const [youSaid, setYouSaid] = useState('');
  const [asked, setAsked] = useState('');
  const [summary, setSummary] = useState<ReturnType<Desk['summary']> | null>(null);
  const [caps, setCaps] = useState<ReturnType<typeof describeSupport>>({ canListen: false, canSpeak: false, notice: null });
  const [problem, setProblem] = useState<Problem | null>(null);
  const [voiceOn, setVoiceOn] = useState(true);
  const [typing, setTyping] = useState(false);
  const [tryOpen, setTryOpen] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [listenKey, setListenKey] = useState(0);
  const [announce, setAnnounce] = useState('');

  const m = useRef<Machine>(IDLE);
  const desk = useRef<Desk | null>(null);
  const rec = useRef<Recogniser | null>(null);
  const live = useRef(false);
  const voiceRef = useRef(true);
  const capsRef = useRef(caps);
  const out = useRef<SpeechOutput | null>(null);
  const ringTail = useRef<{ greeting: string; first?: string } | null>(null);
  const resumeText = useRef('');
  const textRef = useRef(false);
  const typingRef = useRef(false);
  const voiceBroken = useRef(false);
  const micDead = useRef(false);
  /** Counts utterances. A callback only carries on if its number is still the current one. */
  const turn = useRef(0);
  const timers = useRef<number[]>([]);
  const tick = useRef(0);
  const guard = useRef(0);
  const decay = useRef(0);
  const spokenSoFar = useRef<string[]>([]);
  const pending = useRef('');
  const lastDesk = useRef('');
  const typedFocus = useRef(false);
  const manualStop = useRef(false);
  const startedAt = useRef(0);
  const audio = useRef<AudioContext | null>(null);
  const calm = useRef(false);
  const card = useRef<HTMLDivElement>(null);
  const log = useRef<HTMLOListElement>(null);
  const ico = useRef<HTMLSpanElement>(null);
  const typedBox = useRef<HTMLInputElement>(null);
  const primary = useRef<HTMLButtonElement>(null);
  const starter = useMemo(() => createDesk(config).hints(), [config]);

  const send = (type: string) => {
    const next = transition(m.current, { type });
    m.current = next;
    setView(next);
    return next;
  };
  const { phase } = view;
  const idle = phase === 'idle' || phase === 'ended';

  // ---- Setup: link details, what this browser can do, voices ----
  useEffect(() => {
    const code = new URLSearchParams(window.location.hash.slice(1)).get('c');
    const fromLink = code ? decodeConfig(code) : null;
    if (fromLink) { setConfig(fromLink); setSource('link'); }
    calm.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    out.current = createBrowserSpeech(RATE);
    const found = describeSupport({ recognition: Boolean(recogniserClass()), synthesis: Boolean(out.current), voices: out.current?.voiceCount() ?? 0, userAgent: navigator.userAgent });
    setCaps(found);
    capsRef.current = found;
    if (found.notice) setProblem(found.notice);
    if (!found.canListen) setTyping(true);
    return () => { out.current?.dispose(); };
  }, []);
  useEffect(() => () => { live.current = false; stopListening(); stopSpeech(); window.clearTimeout(decay.current); try { audio.current?.close(); } catch { /* already closed */ } },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  // Typing panel gone (closed, or mic path restored) means the box can no longer hold focus: voice must be free to reopen.
  useEffect(() => { if (!(typing || textRef.current) || !isLive(phase)) typedFocus.current = false; });
  // On the typed path the cursor is always in the box on your turn.
  useEffect(() => { if (textRef.current && phase === 'waiting' && document.activeElement !== typedBox.current) typedBox.current?.focus({ preventScroll: true }); });
  // Keep the newest line in view inside the transcript only: never scroll the page.
  useEffect(() => { const el = log.current; if (el) el.scrollTop = el.scrollHeight; }, [lines]);
  // The summary arrives when the call ends: move focus on so keyboard users aren't dropped.
  useEffect(() => { if (summary) card.current?.querySelector<HTMLElement>('.vd-mail')?.focus({ preventScroll: true }); }, [summary]);
  // Call timer: counts up while live, then keeps the final length.
  useEffect(() => {
    if (idle) return undefined;
    startedAt.current = Date.now();
    setSeconds(0);
    const id = window.setInterval(() => setSeconds(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => { window.clearInterval(id); setSeconds(Math.floor((Date.now() - startedAt.current) / 1000)); };
  }, [idle]);
  // Escape hangs up wherever focus is; Space does the big button's job when nothing else has focus.
  useEffect(() => {
    if (idle) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (!live.current) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        const box = typedBox.current;
        // In the typing box, Esc clears it, then closes it, and only then does the next Esc hang up.
        if (box && event.target === box) {
          if (box.value) { box.value = ''; return; }
          if (typingRef.current && !textRef.current) { toggleTyping(); return; }
          box.blur();
          return;
        }
        endCall();
        return;
      }
      const t = event.target as HTMLElement | null;
      if (event.key === ' ' && (!t || t === document.body)) { event.preventDefault(); primary.current?.click(); }
    };
    const onHide = () => { if (document.hidden && live.current && m.current.phase !== 'paused') pauseCall(); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onHide);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('visibilitychange', onHide); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idle]);

  // ---- Helpers ----
  const later = (fn: () => void, ms: number) => { const id = window.setTimeout(fn, ms); timers.current.push(id); return id; };
  const clearTimers = () => { timers.current.forEach((id) => window.clearTimeout(id)); timers.current = []; window.clearInterval(tick.current); };
  const addLine = (who: Line['who'], text: string, cut?: boolean) => {
    setLines((current) => [...current, { who, text, cut }]);
    // One polite live region: say new receptionist lines only when nobody is hearing them out loud.
    if (who === 'desk' && !(voiceRef.current && capsRef.current.canSpeak && !voiceBroken.current)) setAnnounce(`Receptionist: ${text}`);
  };
  /** After a quiet spell on the typed or muted path, nudge, then end politely. */
  const armIdle = () => {
    clearGuard();
    guard.current = window.setTimeout(() => { if (live.current && m.current.phase === 'waiting') onSilence(); }, TYPED_IDLE_MS);
  };

  /** Moves the little ring around the state icon. Written straight to the element, because it changes on every spoken word. */
  const bump = () => {
    const el = ico.current;
    if (!el || calm.current) return;
    el.style.setProperty('--level', '1');
    window.clearTimeout(decay.current);
    decay.current = window.setTimeout(() => el.style.setProperty('--level', '0'), 140);
  };
  const feel = (tone?: 'ring' | 'pickup' | 'hangup', vibration?: 'connect' | 'end') => {
    if (calm.current) return;
    if (vibration) buzz(vibration);
    if (tone && voiceRef.current) playTone(audio.current, tone);
  };

  /** Stops the receptionist mid-sentence. Bumping `turn` means the old utterance can never restart the mic. */
  function stopSpeech() {
    turn.current += 1;
    clearTimers();
    out.current?.cancel();
  }
  function clearGuard() { window.clearTimeout(guard.current); }
  /** Detaches and aborts the recogniser, so there is never more than one. */
  function stopListening() {
    clearGuard();
    const r = rec.current;
    rec.current = null;
    if (r) { r.onresult = null; r.onerror = null; r.onend = null; r.onaudiostart = null; r.onstart = null; try { r.abort(); } catch { /* already stopped */ } }
    setInterim('');
  }
  const showProblem = (found: Problem | null) => { if (found) setProblem(found); };

  const endCall = () => {
    if (!live.current) return;
    live.current = false;
    stopListening();
    if (pending.current && spokenSoFar.current.length) addLine('desk', spokenSoFar.current.join(' '), true);
    stopSpeech();
    pending.current = '';
    feel('hangup', 'end');
    send('END');
    setCaption(null);
    setProblem((p) => (p && (p.kind === 'quiet' || p.kind === 'hidden') ? null : p));
    if (desk.current) {
      setSummary(desk.current.summary());
      setMadeAt(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    }
  };

  /** Speaks one sentence with captions in step. Falls back to a timed reveal where the voice sends no word events, or the voice is off. */
  const speakSentence = (sentence: { display: string; say: string }, token: number, done: () => void) => {
    const units = captionUnits(sentence.display);
    setCaption({ units, shown: 0 });
    let finished = false;
    let started = false;
    let t0 = Date.now();
    let boundarySeen = false;
    const finish = () => {
      if (finished || token !== turn.current || !live.current) return;
      finished = true;
      window.clearInterval(tick.current);
      setCaption({ units, shown: units.length });
      done();
    };
    const speech = out.current;
    const total = estimateMs(sentence.say, RATE);
    if (voiceRef.current && speech && capsRef.current.canSpeak && !voiceBroken.current) {
      // A voice that never starts (none installed, blocked): carry on silently with captions.
      later(() => {
        if (started || finished || token !== turn.current) return;
        finished = true;
        voiceBroken.current = true;
        speech.cancel();
        showProblem(speech.voiceCount() === 0 ? PROBLEMS['no-voice'] : PROBLEMS['voice-failed']);
        speakSentence(sentence, token, done);
      }, 2600);
      tick.current = window.setInterval(() => { if (started && !boundarySeen) setCaption({ units, shown: revealAtTime(units, Date.now() - t0, total) }); }, 90);
      // Backstop for engines that never fire the end: stop the voice first so the mic never opens over it.
      later(() => { if (!finished) { speech.cancel(); finish(); } }, total * 2 + 2500);
      speech.speak(sentence.say, {
        onStart: () => { started = true; t0 = Date.now(); send('SPEAK_START'); },
        onBoundary: (charIndex) => { boundarySeen = true; setCaption({ units, shown: revealAtChar(units, charIndex) }); bump(); },
        onEnd: finish,
      });
    } else {
      // Captions only, at reading pace.
      const reading = Math.round(total * 0.8);
      send('SPEAK_START');
      tick.current = window.setInterval(() => setCaption({ units, shown: revealAtTime(units, Date.now() - t0, reading) }), 90);
      later(finish, reading + 120);
    }
  };

  /** Speaks a whole reply sentence by sentence, with short pauses between. */
  const speakReply = (text: string, then: 'listen' | 'end' | 'finish') => {
    stopSpeech();
    const token = turn.current;
    const plan = planSpeech(text);
    spokenSoFar.current = [];
    pending.current = text;
    lastDesk.current = text;
    setAsked(lastQuestion(text));
    let index = 0;
    const next = () => {
      if (token !== turn.current || !live.current) return;
      if (index >= plan.length) { replyDone(text, then); return; }
      const sentence = plan[index];
      index += 1;
      spokenSoFar.current.push(sentence.display);
      speakSentence(sentence, token, () => later(next, sentence.pause));
    };
    next();
  };

  const replyDone = (text: string, then: 'listen' | 'end' | 'finish') => {
    pending.current = '';
    addLine('desk', text);
    send('SPEAK_END');
    if (then === 'end' || desk.current?.stage === 'done') { later(endCall, 800); return; }
    if (then === 'listen') later(listen, 260);
  };

  const onSilence = () => {
    if (!live.current) return;
    clearGuard();
    stopListening();
    const next = send('SILENCE');
    const action = silenceAction(next.silences);
    if (action === 'prompt') speakReply(STILL_THERE, 'listen');
    else if (action === 'goodbye') speakReply(SILENCE_GOODBYE, 'end');
  };

  /** Opens the microphone for the caller's turn. */
  function listen() {
    const Recog = recogniserClass();
    if (!live.current) return;
    if (m.current.muted || micDead.current || !capsRef.current.canListen || !Recog || typedFocus.current) {
      // Not listening (typing, muted, no mic): never leave the call stuck, and never let it sit open forever.
      if (m.current.phase === 'interrupted') send('YIELD');
      if (m.current.phase === 'waiting') armIdle();
      return;
    }
    if (m.current.phase !== 'waiting' && m.current.phase !== 'interrupted') return;
    stopListening();
    const r = new Recog();
    rec.current = r;
    r.lang = 'en-GB'; r.interimResults = true; r.continuous = false; r.maxAlternatives = 1;
    let heard = '';
    let latest = '';
    let opened = false;
    let failed = false;
    manualStop.current = false;
    const open = () => {
      if (rec.current !== r || opened) return;
      opened = true;
      send('LISTEN_OPEN');
      setListenKey((k) => k + 1);
      guard.current = window.setTimeout(() => { if (rec.current === r && !heard) { try { r.stop(); } catch { /* ended */ } } }, LISTEN_PATIENCE_MS);
    };
    r.onaudiostart = open;
    // Some browsers skip the audio event: treat "started" as open after a beat.
    r.onstart = () => { later(open, 1200); };
    r.onresult = (event) => {
      if (rec.current !== r) return;
      open();
      clearGuard();
      bump();
      let text = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript;
        if (event.results[i].isFinal) heard = text;
      }
      latest = text;
      setInterim(text);
    };
    r.onerror = (event) => {
      if (rec.current !== r) return;
      const found = problemFromRecognitionError(event.error);
      if (found && found.kind !== 'quiet') failed = true;
      if (found?.fatal) {
        micDead.current = true;
        setCaps((c) => ({ ...c, canListen: false }));
        setTyping(true);
      }
      if (found && found.kind !== 'quiet') showProblem(found);
    };
    r.onend = () => {
      if (rec.current !== r) return;
      rec.current = null;
      clearGuard();
      setInterim('');
      if (!live.current) return;
      const said = chooseHeard(heard, latest);
      if (said) handle(said);
      else if (failed || manualStop.current) { send('STOP_LISTEN'); send('YIELD'); if (m.current.phase === 'waiting') armIdle(); }
      else onSilence();
    };
    try { r.start(); } catch { rec.current = null; showProblem(PROBLEMS['mic-missing']); send('YIELD'); }
  }

  /** The caller has said (or typed) something. Acknowledge at once, think for a beat, then answer. */
  function handle(text: string) {
    const said = text.trim();
    if (!desk.current || !live.current || !said) return;
    const wasSpeaking = m.current.phase === 'speaking' || (m.current.phase === 'thinking' && pending.current !== '');
    if (wasSpeaking) interruptNow();
    stopSpeech();
    stopListening();
    setProblem((p) => (p && p.kind === 'quiet' ? null : p));
    send('HEARD');
    setYouSaid(said);
    addLine('caller', said);
    const answer = desk.current.reply(said);
    setHints(desk.current.hints());
    pending.current = answer;
    lastDesk.current = answer;
    spokenSoFar.current = [];
    const urgent = desk.current.summary().urgent;
    const token = turn.current;
    later(() => { if (token === turn.current) speakReply(answer, desk.current?.stage === 'done' ? 'end' : 'listen'); }, thinkingBeatMs(answer, { urgent }));
  }

  /** Cuts the receptionist off and records what was heard of the reply. */
  function interruptNow() {
    // Only what the caller actually heard goes in the transcript: a reply cut off before any sound is never shown.
    const heardPart = spokenSoFar.current.join(' ');
    if (pending.current && heardPart) addLine('desk', heardPart, true);
    spokenSoFar.current = [];
    pending.current = '';
    stopSpeech();
    send('INTERRUPT');
  }
  const interrupt = () => {
    if (!live.current) return;
    interruptNow();
    later(listen, 140);
  };

  const pauseCall = () => {
    if (!live.current) return;
    resumeText.current = pending.current || lastDesk.current;
    interruptNow();
    stopListening();
    send('PAUSE');
    showProblem(PROBLEMS.hidden);
  };
  const resume = () => {
    if (!live.current || m.current.phase !== 'paused') return;
    setProblem(null);
    send('RESUME');
    // Paused while still ringing: carry on from the ring, with the tapped line if there was one.
    if (ringTail.current) { finishRing(); return; }
    speakReply(resumeText.current || lastDesk.current || 'Sorry, where were we? How can I help?', 'listen');
  };
  const finishRing = () => {
    const tail = ringTail.current;
    if (!tail || !live.current) return;
    ringTail.current = null;
    send('RING_END');
    if (tail.first) { addLine('desk', tail.greeting); handle(tail.first); } else speakReply(tail.greeting, 'listen');
  };

  /** Starts a call. With `first` (a suggestion tapped before the call), the greeting is shown and that line is sent straight away. */
  const begin = (first?: string) => {
    stopSpeech();
    stopListening();
    // Everything audio-related is unlocked here, inside the tap (iOS and Chrome both require it).
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctx && !audio.current) audio.current = new Ctx();
      void audio.current?.resume();
    } catch { /* tones are a bonus */ }
    if (voiceRef.current) out.current?.unlock();
    voiceBroken.current = false;
    micDead.current = !capsRef.current.canListen;
    desk.current = createDesk(config);
    live.current = true;
    setLines([]); setSummary(null); setCaption(null); setYouSaid(''); setAsked(''); setInterim(''); setAnnounce('');
    setProblem(capsRef.current.notice);
    setTryOpen(false);
    setHints(desk.current.hints());
    send('RESET');
    send('CALL');
    feel('ring', 'connect');
    const greeting = desk.current.greet();
    const rings = first ? 1 : 2;
    later(() => feel('pickup'), rings * 1100 - 150);
    ringTail.current = { greeting, first };
    later(finishRing, rings * 1100);
    primary.current?.focus({ preventScroll: true });
  };

  const sendTyped = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const box = typedBox.current;
    if (!box || !box.value.trim() || m.current.phase === 'ringing') return;
    const text = box.value;
    box.value = '';
    handle(text);
  };
  const sendChip = (text: string) => {
    if (m.current.phase === 'ringing') return;
    if (idle) begin(text); else handle(text);
  };

  const onPrimary = () => {
    const { action } = primaryFor(m.current.phase, { canListen: capsRef.current.canListen && !micDead.current && !m.current.muted });
    if (action === 'call' || action === 'again') begin();
    else if (action === 'interrupt') interrupt();
    else if (action === 'stop') { manualStop.current = true; try { rec.current?.stop(); } catch { /* ended */ } }
    else if (action === 'talk') { typedFocus.current = false; typedBox.current?.blur(); listen(); }
    else if (action === 'resume') resume();
  };

  const toggleMute = () => {
    const next = send('MUTE');
    if (next.muted) { stopListening(); setInterim(''); if (next.phase === 'waiting') armIdle(); } else if (live.current && next.phase === 'waiting') { clearGuard(); later(listen, 150); }
  };
  const toggleVoice = () => {
    voiceRef.current = !voiceRef.current;
    setVoiceOn(voiceRef.current);
    if (!voiceRef.current) out.current?.cancel();
  };
  const toggleTyping = () => {
    const open = !typingRef.current;
    typingRef.current = open;
    setTyping(open);
    if (open) later(() => typedBox.current?.focus(), 30);
    else {
      // Closing the box means "back to voice": a hidden input can't blur, so free the mic by hand.
      typedFocus.current = false;
      if (live.current && m.current.phase === 'waiting') { clearGuard(); later(listen, 120); }
    }
  };

  /** A visitor typed their own business: swap the desk and go back to the start. */
  const madeDemo = (made: typeof config, from: Source = 'typed') => {
    live.current = false;
    stopListening();
    stopSpeech();
    desk.current = null;
    send('RESET');
    setConfig(made); setSource(from);
    setLines([]); setSummary(null); setHints([]); setCaption(null); setYouSaid(''); setAsked('');
    setProblem(capsRef.current.notice);
    setSeconds(0);
    setTryOpen(false);
    later(() => primary.current?.focus({ preventScroll: true }), 50);
  };
  const resetExample = () => {
    try { window.history.replaceState(null, '', window.location.pathname); } catch { /* fine */ }
    madeDemo(cleanConfig(DEFAULT_CONFIG), 'default');
  };

  // ---- What to draw ----
  const canListenNow = caps.canListen && !micDead.current;
  const main = primaryFor(phase, { canListen: canListenNow && !view.muted });
  const label = phaseLabel(phase, { muted: view.muted || !canListenNow, typing });
  const message = summary ? ownerMessage(summary, { business: config.name, time: madeAt, seconds }) : null;
  const truth = source === 'default' ? 'Demo in your browser, using your browser’s own voice. The real service answers your phone line with a more natural voice.'
    : `Demo in your browser, using your browser’s own voice. Made for ${config.name}: not ${config.name}’s real line. The real service answers your phone line with a more natural voice.`;
  const planHref = `/contact?intent=preview&src=voice-demo&package=${encodeURIComponent(AFTER_HOURS.name)}${source !== 'default' ? `&business=${encodeURIComponent(config.name)}` : ''}#leak-check-form`;
  const chips = phase === 'idle' ? starter : phase === 'ended' ? [] : hints;
  const live_ = isLive(phase);
  /** No usable microphone (none, blocked, muted): the box under the panel is the way to answer. */
  const textMode = live_ && (!canListenNow || view.muted);
  textRef.current = textMode;
  typingRef.current = typing;
  const showForm = live_ && (typing || textMode);
  const showMain = (!idle || phase === 'idle') && (!textMode || main.action === 'interrupt' || main.action === 'resume');
  const calmNote = problem !== null && problem === caps.notice;

  let words: Caption | null = null;
  if (phase === 'speaking' || (phase === 'thinking' && caption && !youSaid)) words = caption;
  const nowText = (() => {
    if (phase === 'idle') return `${config.name} is closed. Ring it to hear it answer.`;
    if (phase === 'ringing') return `Calling ${config.name}…`;
    if (phase === 'interrupted') return 'Go ahead.';
    if (phase === 'listening') return interim || 'Go ahead, I’m listening.';
    if (phase === 'paused') return 'Paused while this tab was hidden.';
    if (phase === 'ended') return `Call length ${clock(seconds)}`;
    if (phase === 'waiting') return asked ? `Asked: ${asked}` : 'Your turn.';
    if (phase === 'thinking') return youSaid ? `You: ${youSaid}` : 'One moment…';
    return '';
  })();

  return (
    <div className={`vd vd-s-${phase}`} ref={card} data-phase={phase}>
      <p className="vd-sr" aria-live="polite" aria-atomic="true">{announce}</p>
      <p className="vd-truth">{truth}</p>
      <div className="vd-head">
        <div className="vd-who-wrap">
          <h2 className="vd-name">{config.name}</h2>
          <p className="vd-closed"><span aria-hidden="true">●</span> Closed now{config.hours ? ` · open ${config.hours}` : ''}</p>
        </div>
        {idle ? (
          <button type="button" className="vd-quiet vd-swap" aria-expanded={tryOpen} onClick={() => setTryOpen((o) => !o)}>
            {source === 'default' ? 'Try it as your business' : 'Change business'}
          </button>
        ) : <span className="vd-timer"><span className="vd-sr">Call time </span>{clock(seconds)}</span>}
      </div>

      {tryOpen && idle ? <TryYours custom={source !== 'default'} onMade={(c) => madeDemo(c, 'typed')} onClose={() => setTryOpen(false)} onReset={resetExample} /> : null}

      {problem ? (
        <p className={`vd-problem${calmNote ? ' is-calm' : problem.fatal ? ' is-hard' : ''}`} role={!calmNote && (problem.fatal || problem.kind === 'hidden') ? 'alert' : undefined}>
          <strong>{problem.message}</strong> {problem.next}
        </p>
      ) : null}

      <div className="vd-call">
        <div className={`vd-now vd-now-${phase}`}>
          <div className="vd-now-top">
            <span className="vd-ico" ref={ico}><Ico name={phaseIcon(phase)} size={26} /></span>
            <span className="vd-state">{label}</span>
            {phase === 'thinking' ? <span className="vd-dots" aria-hidden="true"><i /><i /><i /></span> : null}
          </div>
          <p className="vd-caption" aria-hidden="true">
            {words ? words.units.map((unit, i) => <span key={`${unit.start}-${i}`} className={i < words.shown ? 'vd-w' : 'vd-w is-hid'}>{unit.text}{' '}</span>) : nowText}
          </p>
          {phase === 'listening' && asked && !interim ? <p className="vd-asked">Asked: {asked}</p> : null}
          <div className="vd-patience" aria-hidden="true">{phase === 'listening' && !interim ? <i key={listenKey} style={{ ['--patience' as string]: `${LISTEN_PATIENCE_MS}ms` }} /> : null}</div>
        </div>

        {showForm ? (
          <form className={`vd-type${textMode ? ' is-primary' : ''}`} onSubmit={sendTyped}>
            <label className="vd-sr" htmlFor="vd-typed">Type what you’d say</label>
            <input id="vd-typed" ref={typedBox} autoComplete="off" enterKeyHint="send" placeholder="Type what you’d say…"
              onChange={() => { if (m.current.phase === 'waiting' && (textRef.current || typedFocus.current)) armIdle(); }}
              onFocus={() => { typedFocus.current = true; if (m.current.phase === 'listening') { stopListening(); send('STOP_LISTEN'); armIdle(); } }}
              onBlur={() => { typedFocus.current = false; }} />
            <button type="submit" className={textMode ? 'vd-main vd-main-talk' : 'vd-btn vd-btn-sun'}><Ico name="send" size={textMode ? 26 : 20} /><span>Send</span></button>
          </form>
        ) : null}

        {showMain ? (
          <button type="button" ref={primary} className={`vd-main vd-main-${main.action}`} disabled={main.action === 'none'} onClick={onPrimary}>
            <Ico name={{ call: 'phone', again: 'again', interrupt: 'hand', stop: 'check', talk: 'mic', resume: 'phone', none: phase === 'interrupted' ? 'mic' : 'thinking' }[main.action]} size={26} />
            {main.label}
          </button>
        ) : null}

        {live_ ? (
          <div className="vd-ctls" role="group" aria-label="Call controls">
            <button type="button" className="vd-ctl" aria-pressed={view.muted} disabled={!canListenNow} onClick={toggleMute}><Ico name={view.muted ? 'micoff' : 'mic'} /><span>Mute mic</span></button>
            <button type="button" className="vd-ctl" aria-pressed={typing || textMode} disabled={textMode} onClick={toggleTyping}><Ico name="keys" /><span>Type</span></button>
            <button type="button" className="vd-ctl" aria-pressed={!voiceOn} onClick={toggleVoice}><Ico name={voiceOn ? 'sound' : 'soundoff'} /><span>Mute voice</span></button>
            <button type="button" className="vd-ctl vd-ctl-end" onClick={endCall} aria-keyshortcuts="Escape"><Ico name="end" /><span>End call</span></button>
          </div>
        ) : null}

        {chips.length ? (
          <div className="vd-hints" role="group" aria-label="Things you could say">
            <span className="vd-hint-label">{phase === 'idle' ? 'Or start with' : 'Try saying'}</span>
            {chips.map((chip) => <button key={chip} type="button" className="vd-chip" disabled={phase === 'ringing'} onClick={() => sendChip(chip)}>{chip}</button>)}
          </div>
        ) : null}

        {message ? (
          <article className={`vd-mail${message.urgent ? ' is-urgent' : ''}`} tabIndex={-1} aria-label="Message the owner would receive">
            <div className="vd-mhead">
              <span className="vd-tag">New message · {message.time}</span>
              <span className="vd-stamp">Demo · not sent</span>
            </div>
            <p className="vd-meta">From: Receptionist at {message.business}<br />To: You, the owner · call length {message.length}</p>
            <strong className="vd-subject">{message.subject}{message.urgent ? <span className="vd-urgent">Urgent</span> : null}</strong>
            <dl>{message.rows.map((row) => <div key={row.label} className={row.tone === 'urgent' ? 'is-urgent' : undefined}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
            <p className="vd-real">With the real service, a message like this reaches your inbox after every call.</p>
            <div className="vd-actions">
              <a className="vd-btn vd-btn-sig" href={planHref}>{MAIN_CTA}</a>
              <button type="button" ref={primary} className="vd-btn vd-btn-line" onClick={() => begin()}><Ico name="again" size={20} /><span>Call again</span></button>
              <button type="button" className="vd-btn vd-btn-line" onClick={() => { setTryOpen(true); card.current?.scrollIntoView({ block: 'start' }); }}><span>{source === 'default' ? 'Try it as your business' : 'Change business'}</span></button>
            </div>
          </article>
        ) : null}
      </div>

      <div className="vd-side">
        <h3 className="vd-side-title">The call so far</h3>
        <ol className="vd-log" ref={log} tabIndex={0} aria-label="Call so far">
          {lines.length === 0 ? <li className="vd-empty">Nothing yet. Start the call, then talk as if you were a customer ringing after hours.</li> : null}
          {lines.map((line, index) => (
            <li key={index} className={`vd-line vd-${line.who}`}><span className="vd-who">{line.who === 'desk' ? 'Receptionist' : 'You'}{line.cut ? ' (cut off)' : ''}</span><span className="vd-said">{line.text}</span></li>
          ))}
        </ol>
      </div>

      <p className="vd-small">
        {WORKS_BEST} Nothing is recorded or sent to Maz Works. {caps.canListen ? 'Your browser’s own speech service turns your voice into text (in Chrome that is Google’s). ' : ''}
        It answers only from the details it was given and takes a message for anything else. Tap or press Space to interrupt, Esc to hang up.
      </p>
    </div>
  );
}
