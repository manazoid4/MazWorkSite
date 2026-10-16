# Voice UI research (11 Oct 2026)

Time-boxed read of shipped voice experiences, for `/receptionist-demo`. Patterns only: no wording or artwork copied. Where a page could not be read or said nothing, that is stated. Everything here is free to build with browser speech.

| Product | Pattern | Why it works | Source | Read |
| --- | --- | --- | --- | --- |
| Gemini Live | Interrupt by talking, and still by tapping the screen when talking-interrupt is off | Tap is a reliable fallback when the mic hears the speaker | https://support.google.com/gemini/answer/15274899 | 11 Oct 2026 |
| Gemini Live | Separate Mute (mic off, assistant keeps talking) and Hold (pause everything) | Two different needs, named plainly | same | 11 Oct 2026 |
| Gemini Live | Captions toggle while talking; ending the call hands you a transcript and a switch to text | Voice and text are one thread, never two products | same | 11 Oct 2026 |
| ElevenLabs agent widget | Voice + text mode: switch between speaking and typing mid-conversation | Typing is first-class, not an error path | https://elevenlabs.io/docs/agents-platform/customization/widget | 11 Oct 2026 |
| ElevenLabs agent widget | One orb with named states ("Listening", "Assistant speaking") and a mute button | State is text plus visual, not visual alone | same | 11 Oct 2026 |
| ElevenLabs agent widget | Terms shown once before the call, remembered | Consent before the mic, without nagging | same | 11 Oct 2026 |
| Vapi (docs) | Wait about 0.4 s after the caller pauses before replying; stop speaking within about 0.2 s of interruption; short "uh-huh" should not end a turn | Real numbers for pacing: quick but not twitchy | https://docs.vapi.ai/customization/speech-configuration | 11 Oct 2026 |
| Sesame (research page) | Names pauses, emphasis, interruptions and low first-audio delay as what makes speech feel human; admits turn-taking is unsolved | Latency to first sound matters more than polish | https://www.sesame.com/research/crossing_the_uncanny_valley_of_voice | 11 Oct 2026 |
| ChatGPT voice (press, not OpenAI) | A single centre orb that pulses; interrupt at any time; transcript lands in the chat afterwards; accidental interruptions were a known complaint | One object carries the whole conversation; open-mic interruption has a real cost | https://www.techradar.com/computing/artificial-intelligence/openai-launch-chatgpt-advanced-voice-mode-on-desktop-and-now-pcs-and-macs-can-join-the-conversation | 11 Oct 2026 |
| MDN | `boundary` events are not Baseline and some voices never fire them; `vibrate` needs a tap first and is missing on iOS Safari | Dictates a timed fallback and feature detection | https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/boundary_event and .../Navigator/vibrate | 11 Oct 2026 |

Not verified: the OpenAI help page returned 403; Hume's page said nothing about EVI interaction (benchmark page only); Apple's HIG voice page 404ed; I did not read Claude voice mode, Pi, Retell or Siri/Phone UI, so nothing is claimed about them.

## What we take
1. One central object for the whole call (ChatGPT, ElevenLabs): the "now" panel is one element that changes colour, tail side, border style and icon, with a text label, instead of swapping widgets.
2. Tap interrupts at any moment (Gemini fallback): the big button reads "Tap to interrupt" while it speaks; Escape ends; Space triggers the main action.
3. Mute and voice-off are separate (Gemini Mute vs Hold): "Mute mic" keeps the receptionist talking; "Voice off" keeps captions.
4. Voice and typing interchangeable mid-call (ElevenLabs, Gemini): one transcript, typing panel toggles any time, chips always there.
5. Numbers for pacing (Vapi): about 0.3 to 0.8 s thinking beat, 0.25 to 0.5 s between sentences, mic opens about 0.25 s after the voice ends so it does not hear its own tail.
6. Acknowledge fast (Sesame on latency): the caller's words appear in the panel the instant the recogniser finishes or they press Send, before the beat.
7. Captions in step with speech, using `boundary` where it fires and a timed reveal where it does not (MDN caveat).
8. Transcript and a summary at the end (Gemini): the call ends into the owner's message, in place.
9. Small touches: haptic buzz on connect and hang up where `vibrate` exists; soft ring and hang-up tones from the Web Audio API, no audio files, tied to the voice toggle and skipped under reduced motion.

## What we deliberately skip, and why
- Open-mic barge-in: the browser would hear the receptionist's own voice, and ChatGPT's accidental interruptions show the cost. Tap and key only.
- Realtime speech-to-speech models (Sesame, ChatGPT, Hume): paid, per-minute, and an open public page would be an uncapped bill.
- Smart end-of-turn models (Vapi): browser recognition ends a turn on its own pause; we add an "I'm done" button instead.
- Emotion or expression read-outs (Hume): needs a paid model and would be an invented claim.
- A mic level meter or waveform: needs a second microphone stream and permission prompt. The visual moves on real speech and recognition events instead.
- Backchanneling ("uh-huh") and overlap: not possible with turn-based browser speech.
- Consent modal (ElevenLabs): nothing is recorded or sent by us, so a persistent honest label replaces it.

## The ceiling of free browser speech
Voices are whatever the device ships (often flat); no emotion, no overlap, no reliable boundary events, recognition quality and privacy depend on the browser vendor's service (Chrome sends audio to Google), and there is no true full-duplex conversation. The paid line is the upgrade path.
