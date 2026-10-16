/**
 * After-hours receptionist demo: the conversation rules.
 *
 * Plain rules, no paid services: it answers only from the business details it
 * is given (hours, services, "from" prices, areas, urgent words) and takes a
 * message for everything else. It never guesses a price. Shared by the demo
 * page and tests/receptionist-demo.test.mjs.
 *
 * @typedef {{ name: string, price?: string }} Service
 * @typedef {{ name: string, hours: string, services: Service[], areas?: string, urgent?: string[], callback?: string }} DeskConfig
 * @typedef {{ title: string, urgent: boolean, rows: [string, string][] }} DeskSummary
 * @typedef {'open'|'offer'|'name'|'number'|'confirm'|'more'|'done'} DeskStage
 */

export const DEFAULT_CONFIG = {
  name: 'Harbour Street Garage',
  hours: 'Monday to Friday 8am to 6pm, and Saturday 8am to 12 noon',
  services: [
    { name: 'MOT', price: 'from £45' },
    { name: 'Service', price: 'from £120' },
    { name: 'Tyres' },
    { name: 'Brakes' },
    { name: 'Clutch' },
    { name: 'Diagnostics', price: 'from £40' },
  ],
  areas: 'the town and villages within about 10 miles',
  urgent: ['broken down', 'breakdown', 'accident', 'blocking', 'stuck', 'smoke'],
  callback: 'after 8am on the next working day',
};

const WORD_DIGITS = { zero: '0', oh: '0', o: '0', nought: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9' };

/**
 * Turns "oh seven seven double oh 900123" into "07700900123". "plus forty four" gives 44.
 * With `loose`, a heard "to", "too" or "for" between two digit words counts as 2 or 4.
 * @param {string} text
 * @param {boolean} [loose]
 */
export function digitsFrom(text, loose = false) {
  let said = String(text).toLowerCase();
  // "oh yeah, oh seven…": the first "oh" is a filler, not a zero.
  if (loose) said = said.replace(/\b(?:oh|o)[,.]? (?=(?:yeah|yes|sorry|um+|er+m?|right|ok|okay|well|so|hmm|sure|no|hi|hello)\b)/g, ' ');
  const words = said.replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
  const digitWord = (word) => word !== undefined && (/^\d+$/.test(word) || word in WORD_DIGITS || word === 'double' || word === 'treble' || word === 'triple');
  let out = '';
  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    if (word === 'forty' && words[i + 1] === 'four' && (!out || words[i - 1] === 'plus')) { out += '44'; i += 1; continue; }
    if (loose && (word === 'to' || word === 'too' || word === 'for') && digitWord(words[i - 1]) && digitWord(words[i + 1])) { out += word === 'for' ? '4' : '2'; continue; }
    if ((word === 'double' || word === 'treble' || word === 'triple') && i + 1 < words.length) {
      const next = WORD_DIGITS[words[i + 1]] ?? (/^\d$/.test(words[i + 1]) ? words[i + 1] : '');
      if (next) { out += next.repeat(word === 'double' ? 2 : 3); i += 1; continue; }
    }
    if (/^\d+$/.test(word)) out += word;
    else if (WORD_DIGITS[word]) out += WORD_DIGITS[word];
  }
  return out;
}

/** UK-style grouping for reading back: 07700 900123. */
export function formatNumber(digits) {
  if (digits.length === 11 && digits.startsWith('0')) return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  return digits;
}

/**
 * Speech-friendly copy of a line: any run of 7+ digits is read digit by digit,
 * "07700 900123" becomes "0 7 7 0 0, 9 0 0, 1 2 3". Everything else is unchanged.
 */
export function spoken(text) {
  return String(text).replace(/\d(?: ?\d){6,}/g, (run) => {
    const digits = run.replace(/ /g, '');
    const sizes = digits.length === 11 ? [5, 3, 3] : [];
    const groups = [];
    for (let at = 0, i = 0; at < digits.length; i += 1) {
      const size = sizes[i] ?? 3;
      groups.push(digits.slice(at, at + size).split('').join(' '));
      at += size;
    }
    return groups.join(', ');
  });
}

/** A UK number from spoken digits: +44 / 0044 become 0; 11 digits, or a 10-digit 01/02 landline. '' if not valid. */
function ukNumber(digits) {
  let d = digits;
  if (d.startsWith('0044')) d = `0${d.slice(4).replace(/^0/, '')}`;
  else if (d.startsWith('44') && d.length >= 11) d = `0${d.slice(2).replace(/^0/, '')}`;
  return /^0\d{10}$/.test(d) || /^0[12]\d{8}$/.test(d) ? d : '';
}

/** Curly apostrophes become straight, so "It’s" and "It's" read the same. */
const norm = (text) => String(text).toLowerCase().replace(/[’‘`]/g, "'");

const NUMBER_WORDS = new Set([...Object.keys(WORD_DIGITS), 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred', 'thousand', 'double', 'treble', 'triple', 'plus']);
/** Greetings and intros that come before a name, stripped one after another: "hiya, its Dave". */
const LEAD_IN = /^(?:hi+|hiya|hello|hey+|heya|thanks|thank you|yeah|yes|yep|ok|okay|no|nope|nah|sure|well|sorry|um+|uh+|er+m?|oh|so|it'?s me|it is me|this is me|it'?s|it is|its|this is|i'?m|i am|im|my name is|my name'?s|my names|name'?s|name is|call me)\b[\s,.!:;-]*/i;
const TRAIL_OUT = /[\s,.!]*\b(?:here|speaking|calling|again|please|thanks|thank you|mate|cheers)\s*$/i;
const NOT_NAMES = /^(yes|yeah|no|ok|okay|um|uh|er|erm|hello|hi|hey|what|sorry|pardon|why|thanks|thank|you|please|sure|bye|cheers|it|its|is|me|name|my|am|not|so|well|now|just|and|that|this|the|a|an|there|help|look|listen|urgent|emergency|asap|quickly|hurry|actually|anyway|speaking|here)$/i;
/** Words that make a "name" a sentence: "I am being threatened" is not someone called Being. */
const NOT_NAME_ANY = /\b(?:being|been|threatened|threatening|scared|worried|frightened|flooding|flooded|stuck|locked|trapped|broken|burst|leaking|attacked|followed|hurt|injured|help|need|needs|want|wants)\b/i;
const PROFANE = /\b(fuck|shit|piss|cunt|bollock|twat|wank|arse|bastard|bitch|dick)/i;

const nameWords = (text) => {
  let rest = norm(text).replace(/[^a-z' -]/g, ' ').trim();
  for (let i = 0; i < 8; i += 1) {
    const next = rest.replace(LEAD_IN, '').replace(TRAIL_OUT, '').trim();
    if (next === rest) break;
    rest = next;
  }
  return rest.split(/\s+/).map((word) => word.replace(/^['-]+|['-]+$/g, '')).filter(Boolean);
};
const titleCase = (words) => words.map((word) => word.replace(/(^|['-])([a-z])/g, (_, edge, letter) => edge + letter.toUpperCase())).join(' ');

/** "it's Sam Jones" / "my name is sam" → "Sam Jones". */
export function nameFrom(text) {
  return titleCase(nameWords(text).slice(0, 3).map((word) => word.toLowerCase()));
}

/** A believable name (1 to 3 words, no digits), or '' so the desk asks again. */
function validName(text) {
  if (/\d/.test(text) || digitsFrom(text).length >= 5) return '';
  const words = nameWords(text);
  if (!words.length || words.length > 3 || words.some((word) => word.length > 20)) return '';
  if (words.some((word) => NUMBER_WORDS.has(word)) || words.every((word) => NOT_NAMES.test(word)) || PROFANE.test(words.join(' '))) return '';
  if (isClosing(words.join(' ')) || NOT_NAME_ANY.test(words.join(' '))) return '';
  return titleCase(words);
}

const escape = (word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const has = (text, words) => words.some((word) => new RegExp(`(^|\\W)${escape(word)}(\\W|$)`, 'i').test(text));
/** Lower-case words only, so "Yes, please!" and "yes please" compare equal. */
const plain = (text) => norm(text).replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();
const wordCount = (text) => (text ? text.split(' ').length : 0);

const AFFIRM = /^(yes|yeah|yep|yup|sure|ok|okay|please|go on|go ahead|that would be great|that'd be great|definitely|absolutely|of course)\b/;
const CLOSINGS = /\b(yeah no|yeah nah|no thank you|no thanks|nope|nah|no|nothing else|nothing|not really|that'?s all|that is all|thats all|that'?s it|that is it|thats it|that'?s everything|that is everything|thats everything|that'?s me|bye bye|bye|goodbye|good bye|cheers|thanks very much|thank you very much|thanks|thank you|mate|all good|i'?m (?:all right|alright|fine|good|ok|okay|all set)|im (?:all right|alright|fine|good|ok|okay|all set)|you'?re (?:all right|alright|fine)|youre (?:all right|alright|fine)|ta|take care|see you)\b/g;
const QUESTION = /^(how|what|when|where|do|does|can|are|is|why)\b/;
const QUESTION_ANYWHERE = /\b(how much|how many|how long|what'?s|what is|what are|what was|what time|what do|what does|what about|when (?:are|do|is|can|does|will)|where (?:are|is|do|can)|do you|does it|can you|could you|would you|will you|are you|is it|is there|is this|have you|pardon)\b/;
/** A lone "what", "hello" or "sorry": not a real question, not a name. */
const BARE_FILLER = /^(hi|hello|hey|um+|uh+|er+m?|hmm+|mm+|huh|eh|pardon|what|sorry)[\s?!.,]*$/i;
const NEG_START = /^(?:(?:yeah|yes|yep|oh|um+|er+m?|well|sorry|actually|ok|okay) )*(?:no|nope|nah|nay)\b(?! (?:problem|worries))/;
const NEG_PHRASE = /\b(not (?:quite |really )?(?:right|correct)|isn'?t (?:right|correct|it)|is not (?:right|correct)|wrong|incorrect)\b/;
const GOODBYE_WORD = /\b(bye|goodbye|good bye|that'?s all|that is all|thats all|that'?s it|nothing else|take care|cheers)\b/;

/** A short "yes" (4 words or fewer), or a request to be called back. Never a question like "please tell me the price". */
function isYes(text) {
  const t = plain(text);
  if (/\bcall (me )?back\b/.test(t)) return true;
  return wordCount(t) <= 4 && AFFIRM.test(t) && !/\b(how|what|when|where|why|price|cost)\b/.test(t);
}
/** Any reply that starts with no / nope / nah, however long ("yeah no" too). */
const startsNo = (text) => NEG_START.test(plain(text));
/** Short "no": "no", "no thanks", "not now", "that's not right", "yeah no". Check this BEFORE isYes. */
function isNo(text) {
  const t = plain(text);
  return (wordCount(t) <= 4 && (NEG_START.test(t) || /^(not now|not really)\b/.test(t))) || (wordCount(t) <= 7 && NEG_PHRASE.test(t));
}
/** The WHOLE utterance is a goodbye ("no thanks, bye"), never "no" inside a longer sentence. */
function isClosing(text) {
  const t = plain(text);
  return Boolean(t) && !t.replace(CLOSINGS, ' ').trim();
}
const isQuestion = (text) => /\?/.test(text) || QUESTION.test(plain(text).replace(/^(sorry|um+|uh+|er+m?|hi|hello|yeah|yes|ok|okay)\b ?/, '')) || QUESTION_ANYWHERE.test(plain(text));
const refusesDetail = (text) => isNo(text) || /\b(rather not|prefer not|don'?t want|do not want|not saying|no name|keep it private)\b/i.test(norm(text));

/** Strips links, e-mail addresses, angle brackets and control characters. */
export function safeText(value, max) {
  if (typeof value !== 'string') return '';
  const out = value
    .normalize('NFKC')
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06f0-\u06f9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g, '')
    .replace(/\s*[[({]\s*(?:\.|dot)\s*[\])}]\s*/gi, '.')
    .replace(/\s+dot\s+(?=[a-z]{2,24}\b)/gi, '.')
    .replace(/\b([a-z0-9-]+)\s?\.\s(?=(?:com|co|uk|net|org|io|me|app|shop|store|online|site)\b)/gi, '$1.')
    .replace(/\b(?:https?|hxxps?):\/\/\S*/gi, ' ')
    .replace(/\bwww\.\S*/gi, ' ')
    .replace(/\S+@\S+/g, ' ')
    .replace(/\b[a-z][a-z0-9-]*(?:\.[a-z0-9-]+)+\/\S*/gi, ' ')
    .replace(/\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,24}\b\S*/gi, ' ')
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return out.slice(0, max).trim();
}

/** safeText, but refuses anything that looks like a phone or card number: 5+ digits in a row, digit groups split by " / " and the like, or 4+ spoken digits. */
const NUMBERISH = /\d(?:[\s().,-]?\d){4,}|\d{3,}[\s().,/-]{1,3}\d{3,}/;
const DIGIT_WORDS = /\b(?:(?:oh|zero|nought|one|two|three|four|five|six|seven|eight|nine|double|triple|treble)[\s,-]+){3,}(?:oh|zero|nought|one|two|three|four|five|six|seven|eight|nine)\b/i;
const numberish = (text) => NUMBERISH.test(text) || DIGIT_WORDS.test(text);
const noNumbers = (value, max) => {
  const out = safeText(value, max);
  return numberish(out) ? '' : out;
};
/** "£45", "from £120", "£60 per hour", "£30+". The amount has no leading zero and is under £10,000; any unit is a word, never more digits. */
const PRICE = /^(from |about |around )?£ ?([1-9]\d{0,2},\d{3}|[1-9]\d{0,3})(\.\d{2})?( ?\+| (per|an?) [a-z]+| ?\/ ?[a-z]+)?$/i;

/** Too common to be anyone's urgent word: a link with urgent: ['the'] would flag every line. */
const STOPWORDS = new Set(['the', 'and', 'you', 'your', 'have', 'with', 'that', 'this', 'what', 'when', 'please', 'hello', 'thanks', 'okay', 'call', 'phone', 'want', 'need', 'like', 'just', 'about', 'there', 'here']);

/** Normalises a config from a link: drops empty parts, keeps strings short and plain. */
export function cleanConfig(input) {
  const raw = input && typeof input === 'object' ? input : {};
  const name = noNumbers(raw.name, 40);
  // A name that was refused means the whole link is suspect: show the example desk instead.
  if (raw.name && !name) return cleanConfig({});
  const services = Array.isArray(raw.services) ? raw.services : [];
  const config = {
    name: name || DEFAULT_CONFIG.name,
    hours: noNumbers(raw.hours, 160) || (name ? '' : DEFAULT_CONFIG.hours),
    services: services
      .map((service) => {
        const price = safeText(service?.price, 40);
        return { name: noNumbers(service?.name, 40), price: PRICE.test(price) ? price : undefined };
      })
      .filter((service) => service.name)
      .slice(0, 20),
    areas: noNumbers(raw.areas, 160) || undefined,
    urgent: (Array.isArray(raw.urgent) ? raw.urgent : []).map((word) => noNumbers(word, 30).toLowerCase()).filter((word) => /[a-z]{4,}/.test(word) && !STOPWORDS.has(word)).slice(0, 12),
    callback: noNumbers(raw.callback, 80) || 'on the next working day',
  };
  if (!config.services.length && !name) config.services = DEFAULT_CONFIG.services;
  if (!config.urgent.length && !name) config.urgent = DEFAULT_CONFIG.urgent;
  return config;
}

/** Link-safe encoding of a config (base64url JSON), and back. */
export function encodeConfig(config) {
  const bytes = new TextEncoder().encode(JSON.stringify(config));
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function decodeConfig(code) {
  try {
    const binary = atob(String(code).replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return cleanConfig(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return null;
  }
}

const NAME_ASK = 'Can I take your name?';
const NUMBER_ASK = 'What’s the best number to call you on?';
const NOT_UK = 'Sorry, I can only take a UK number in this demo. What’s the best UK number?';
const DIDNT_CATCH = 'Sorry, I didn’t catch that. Could you say it again?';
/** Words that mean someone may be hurt or at risk: these get the 999 line. Business-urgent words (the owner's list) only get flagged. */
const DANGER = new RegExp(String.raw`(?:^|\W)(?:heart attack|chest pains?|(?:is ?n'?t|is not|not|stopped|struggling to|difficulty|trouble|hard to) breath(?:e|ing)|no pulse|unresponsive|(?:can'?t|cannot) wake (?:him|her|them|my \w+) up|(?:turned|turning|going|gone) blue|lips are blue|allergic reaction|electric shock|electrocut\w*|sparks? (?:(?:are|is|were) )?(?:coming|flying|everywhere|shooting)|sparking|burning smell|smells? (?:of )?burning|(?:see|seen) (?:the )?flames|flames (?:coming|everywhere)|(?:there(?:'s| is)|lots of|full of) smoke|smoke (?:coming|everywhere|pouring)|co alarm (?:is )?(?:going off|sounding|beeping|went off)|water (?:\w+ ){0,3}(?:fuse ?box|consumer unit|electrics|sockets?)|(?:fell|fallen) (?:off|from) (?:a |the )?(?:ladder|roof)|head injury|hit (?:his|her|my|their) head|having a (?:fit|seizure)|kill (?:myself|himself|herself)|suicid\w*|end (?:my|his|her) life|hurt (?:myself|himself|herself)|(?:he|she|they)(?:'s| is| are) bleeding|bleeding (?:a lot|everywhere)|chok(?:ing|ed)|passed out|faint(?:ed|ing)|not breathing|(?:can'?t|cannot|can not) breathe|throat (?:is )?(?:closing|swelling)|stroke|seizure|overdos(?:e|ed)|gas smell|smells? (?:of )?gas|leaking gas|gas leak|caught fire|there(?:'s| is) a fire(?! (?:alarm|extinguisher|door|exit|safety|risk|drill|certificate))|house fire|on fire|smoke coming|full of smoke|carbon monoxide|collapsed|unconscious|in danger|injured|blood everywhere|(?:a )?lot of blood|bleeding (?:heavily|badly)|(?:is|am) bleeding|(?:face|tongue|lips?) (?:is |are )?swelling|anaphyla\w+|stabbed|been attacked|attacking (?:me|us|him|her|them)|(?:has|with|pulled) a knife(?! set| block| sharpen)|(?:hurt|injured) (?:badly|bad|really badly)|(?:badly|seriously) hurt|ring 999|call 999|dial 999|(?:being|been|getting) (?:threatened|attacked|followed|stalked|harassed)|threaten(?:ed|ing|s) (?:me|us|him|her|them|to)|(?:break[ -]?in|break-in)(?! (?:alarm|proof|protection|prevention))|broke into|breaking into|broken into|(?:there(?:'s| is)|an?) (?:intruder|burglar)|someone(?:'s| is) (?:in|trying to get in)|trying to get in(?:to)? (?:my|the|our)|(?:domestic|being) abuse\w*|hurt(?:ing)? (?:me|us|the kids|my kids|my child))(?=\W|$)`, 'i');
const DANGER_LINE = 'If anyone is in danger, please ring 999 now. I’ve also marked this as urgent for the owner.';
const URGENT_LINE = 'I’ve marked this as urgent for the owner.';
const ANON = 'Caller (no name given)';
const isDanger = (text) => DANGER.test(norm(text));
const aOrAn = (name) => (/^[A-Z0-9]{2,}$/.test(name) ? /^[FHLMNRSX]/.test(name) : /^[aeiou]/i.test(name)) ? 'an' : 'a';
/** Lower-case for mid-sentence use, but keep acronyms: "EV charger" → "EV charger", "Deep clean" → "deep clean". */
const shown = (name) => name.split(' ').map((word) => (/^[A-Z0-9]{2,}$/.test(word) ? word : word.toLowerCase())).join(' ');

// ---- urgent words ---------------------------------------------------------
const SUFFIX = '(?:e|es|ed|ing|s|y|ly)?';
/** "flooding" and "floods" both become "flood"; trailing "e" goes too, so "smoke" meets "smoking". */
const stem = (word) => {
  let out = word;
  if (out.length > 5 && out.endsWith('ing')) out = out.slice(0, -3);
  else if (out.length > 4 && (out.endsWith('ed') || out.endsWith('es'))) out = out.slice(0, -2);
  else if (out.length > 3 && out.endsWith('s') && !out.endsWith('ss')) out = out.slice(0, -1);
  return out.replace(/e$/, '');
};
const stemPattern = (word, loose) => {
  const base = stem(word).split('').map(escape);
  return base.join(loose && base.length >= 6 ? '[ -]?' : '') + SUFFIX;
};
const AFTER_WORD = String.raw`(?![a-z0-9])(?! (?:alarm|detector)s?)`;
const NO_FAILS = String.raw`[^.?!]{0,25}\b(?:gone off|stopped|not working|isn'?t working|is not working|broken|packed up|died|dead|off|down|failed)\b`;
/**
 * Matcher for the owner's urgent words. Single words match inflections and
 * "tooth ache" for "toothache". Several words match close together in any
 * order ("pipe has burst" for "burst pipe"), and "no heating" also hears
 * "the heating has gone off".
 * @param {string[]} terms
 * @returns {(text: string) => boolean}
 */
function compileUrgent(terms) {
  const tests = [];
  for (const raw of terms) {
    const words = norm(raw).split(/[^a-z0-9']+/).filter((word) => word.length > 1 || /\d/.test(word));
    if (!words.length) continue;
    if (words.length === 1) {
      const re = new RegExp(`(?:^|[^a-z0-9])${stemPattern(words[0], true)}${AFTER_WORD}`);
      tests.push((t) => re.test(t));
      continue;
    }
    const res = words.map((word) => new RegExp(`^${stemPattern(word, false)}$`));
    const span = words.length + 3;
    tests.push((t) => {
      const tokens = t.split(/[^a-z0-9']+/);
      for (let at = 0; at < tokens.length; at += 1) {
        const window = tokens.slice(at, at + span);
        if (res.every((re) => window.some((token) => re.test(token)))) return true;
      }
      return false;
    });
    if (words[0] === 'no' && words.length > 1) {
      const re = new RegExp(`(?:^|[^a-z0-9])${words.slice(1).map((word) => stemPattern(word, false)).join('[^a-z0-9]+')}${NO_FAILS}`);
      tests.push((t) => re.test(t));
    }
  }
  return (text) => {
    const t = norm(text);
    return tests.some((test) => test(t));
  };
}
const GENERIC_URGENT = compileUrgent(['urgent', 'emergency', 'emergencies', 'asap', 'right away', 'as soon as possible']);
const SERVICE_QUESTION = /\b(?:do|does|can|could|would|will) (?:you|they|your \w+) (?:do|offer|provide|have|handle|cover|run|accept|take|charge|include|deal|sell|fix|repair|mend|replace|install|unblock|check|inspect|supply|fit|sort|help with)\b/;
const NOT_URGENT = /\b(?:not|isn'?t|is not|no|non) (?:that |very |really |all that |too )?(?:urgent|an emergency|a rush)\b|\bno rush\b|\bnot in a hurry\b/;

/** Urgent for ANY business, even if the owner's own list does not say so. Guarded like the word "urgent": questions about a service and "not urgent" do not count. */
const VULNERABLE = /\b(?:baby|babies|newborn|infant|toddler|elderly|pensioner|disabled|(?:old|elderly) (?:man|lady|woman|person|couple)|nan|nana|gran|granny|grandma|grandad|grandpa|child|children|kids?|pregnant|ill|unwell|sick)\b/;
const EMERGENCY = [
  /\b(?:flooding|flooded)\b/,
  /\b(?:a|the|an|major) flood\b(?! ?(?:light|risk|zone|insurance|defen|barrier))/,
  /\b(?:pipes?|water main|tank|boiler|radiator|toilet|washing machine) (?:has |have |had |just |is |are |keeps? |just has )?(?:burst|bursting|exploded)\b/,
  /\b(?:burst|bursting) (?:water )?(?:pipes?|main|tank)\b/,
  /\bwater (?:is |was |keeps? |has been )?(?:pouring|gushing|streaming|flooding|cascading)\b/,
  /\bwater\b[^.?!]{0,30}\b(?:through|from|via|down|into) (?:the |my |our |a )?(?:ceiling|roof|light fitting|lights?|walls?)\b/,
  /\b(?:leak|leaking|dripping|drips?)\b[^.?!]{0,25}\b(?:through|from|in|into|on) (?:the |my |our |a )?(?:ceiling|light fitting|electrics|fuse ?box)\b/,
  /\bwater (?:is )?coming (?:in|through|out|down|up)\b/,
  /\blocked (?:myself |ourselves |him |her |them )?out\b/,
  /\b(?:locked|trapped|stuck) (?:myself |ourselves |him |her |them )?in(?:side)?\b(?! (?:the )?(?:queue|traffic))/,
];
const HEATING = /\b(?:heating|heat|hot water|boiler)\b/;
const HEAT_FAIL = /\b(?:no|without|broken|not working|isn'?t working|stopped|packed up|off|died|gone|failed|down)\b/;
const isEmergency = (t) => EMERGENCY.some((re) => re.test(t)) || (HEATING.test(t) && HEAT_FAIL.test(t) && VULNERABLE.test(t));

// ---- what the caller asked ------------------------------------------------
const PRICE_WORDS = /\b(prices?|pricing|costs?|how much|how dear|charges?|charging|quotes?|quid|pounds|rates?|fees?|set me back|cost me)\b/;
const PERSON = /\b(?:speak|talk|chat|spoke|speaking|talking)\b[^?.!]*\b(?:person|human|someone|somebody|anyone|anybody|owner|manager|boss|staff|operator|receptionist|colleague)\b|\b(?:put me through|transfer me|get me someone)\b|\b(?:anyone|anybody|someone) (?:there|in|about|available)\b/;
const BOT = /\b(?:are|is|am) (?:you|this|that|i)\b[^?.!]*\b(?:bot|chatbot|robot|ai|a i|computer|machine|recording|recorded|real|human|automated|automatic|live|program|software)\b|\b(?:robot|chatbot|bot|automated|a recording|are you real)\b/;
/** Asking for the owner's or staff's private contact details, or telling it to drop its rules. It declines and carries on. */
const STAFF_CONTACT = /\b(?:ignore|forget|disregard|override|bypass)\b[^?.!]*\b(?:rules|instructions|prompt|programming|guidelines|restrictions)\b|\b(?:owner|boss|manager|staff|mechanic|engineer|director|his|her|their)(?:'s|s')?\b[^?.!]*\b(?:mobile|cell|personal (?:number|phone|email)|home (?:number|address)|private (?:number|phone)|direct (?:line|number)|email address|e-?mail)\b|\b(?:give|tell|share|send|text) me (?:the |his |her |their )?(?:owner'?s? |manager'?s? |boss'?s? )?(?:mobile|cell|number|phone number|email|address)\b/;
const SCAM = /\b(?:is (?:this|that|it)|are (?:you|they)|sounds?)\b[^?.!]*\b(?:scam|scammers?|fraud|spam|dodgy|legit|legitimate|fake|genuine)\b|\b(?:scam|scammer|fraud)\b/;
const CANCEL = /\b(cancel\w*|reschedul\w*|rearrang\w*|postpon\w*|call off)\b|\b(change|move|swap|alter) (my|the|our|this) (appointment|booking|slot|time|date|visit|mot|service)\b|\bmove (my|the|our) \w+ (to|from)\b/;
const HOURS_NOW = /\b(?:open|closed)\b[^?.!]*\b(?:now|right now|at the moment|today|tonight|this evening|still|yet)\b|^(?:are you|r u|you) (?:guys )?(?:open|closed)[\s?!.]*$/;
const INJURY = /\b(?:cut|burn(?:t|ed)?|hurt|broke|broken|slic(?:ed|e)|crush(?:ed)?|trapp?ed|scald(?:ed)?|sprain(?:ed)?|hit|bang(?:ed)?|bitten|stung)\s+(?:my|his|her|their|the|our)\s+(?:\w+\s+)?(?:hand|hands|finger|fingers|thumb|arm|leg|foot|toe|knee|eye|head|face|back)\b/;
const NOT_COUNTED = /^(um+|uh+|er+m?|hmm+|mm+|ah+)$/;

/** Words that may sit around a service name in a price question without changing what is being priced. */
const PRICE_FILLER = new Set(('how much is are was a an the it for to of do does you your what whats how much price prices pricing cost costs charge charges charging quote quotes please and or me my our i can could would will with on at in there this that be get have would roughly about approx approximately usually typically normal standard basic full interim annual quick new used small big large car cars van vans vehicle bike bikes motorbike cheap cheapest average starting from just only per much dear expensive erm um uh er so well hi hello hey hiya sorry many quid pound pounds set back rate rates fee fees dear roughly ballpark yeah ok okay then also actually if').split(' '));
/** True when a price question is really about this listed service, not something else that shares a word with it ("boiler service" is not a garage "Service"). */
function aboutService(t, service) {
  const own = service.name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).map((w) => w.replace(/(es|s)$/, ''));
  const rest = plain(t).split(' ').filter((word) => word && !PRICE_FILLER.has(word) && !own.includes(word.replace(/(es|s)$/, '')));
  return rest.length === 0;
}
/** "07700 900123" or "my number is 07700 900123" and nothing else. */
const NUMBER_ONLY_FILLER = new Set(['my', 'number', 'is', 'its', "it's", 'it', 'call', 'me', 'on', 'phone', 'mobile', 'the', 'best', 'oh', 'plus', 'contact', 'ring', 'text', 'reach', 'back', 'please']);
const isBareNumber = (text) => plain(text).split(' ').filter(Boolean).every((word) => /^\d+$/.test(word) || NUMBER_WORDS.has(word) || NUMBER_ONLY_FILLER.has(word));

/** Cut a long line down for the owner's email: no links, 140 characters at most. */
const clip = (text) => {
  const out = safeText(String(text), 400).replace(/\+?\d(?:[\s().-]?\d){5,}/g, 'a phone number').replace(/\s+/g, ' ').trim();
  return out.length > 140 ? `${out.slice(0, 139).trimEnd()}…` : out;
};
/** A spoken number that starts with + or 00 and is not 44: not a UK number. */
function foreignNumber(text, digits) {
  if (ukNumber(digits) || digits.length < 6) return false;
  const t = plain(text);
  const plus = /\+/.test(text) ? !/\+\s*\(?44\b/.test(text) : /\bplus\b/.test(t) && !/\bplus (44|forty four|four four|double four)\b/.test(t);
  return plus || (digits.startsWith('00') && !digits.startsWith('0044'));
}
/** The first spoken chunk when it is a believable name and not the urgent bit: "Sam, my car has broken down". */
function nameBeforeUrgent(text, isUrgent) {
  const parts = text.split(/[,;.!]| and /i).map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2 || isDanger(parts[0]) || isUrgent(parts[0])) return '';
  return validName(parts[0]);
}
/** "It is Sam", "I'm Priya Patel", or a plain capitalised name: an introduction, not a request. */
function introName(text) {
  const intro = /^\s*(?:(?:hi|hello|hey|hiya)[ ,]+)?(?:it'?s|it is|this is|i'?m|i am|my name is|my name'?s|name'?s|call me)\b/i.test(norm(text));
  const capitalised = /^[A-Z][A-Za-z'-]*(?:\s+[A-Z][A-Za-z'-]*){0,2}[.!]?$/.test(text.trim());
  return intro || capitalised ? validName(text) : '';
}

/**
 * One call. `greet()` starts it; `reply(text)` takes what the caller said and
 * returns what the receptionist says next; `hints()` suggests what to say now;
 * `summary()` is the owner's email.
 * @param {DeskConfig} input
 */
export function createDesk(input) {
  const config = cleanConfig(input);
  const ownerUrgent = compileUrgent(config.urgent);
  /** Business-urgent: the owner's words, or "urgent" / "emergency" unless it is a question about a service. */
  const isUrgent = (text) => {
    if (ownerUrgent(text)) return true;
    const t = norm(text);
    return (GENERIC_URGENT(t) || isEmergency(t)) && !SERVICE_QUESTION.test(t) && !NOT_URGENT.test(t);
  };
  /** @type {DeskStage} */
  let stage = 'open';
  let caller = '';
  let named = false;
  let number = '';
  let held = '';
  let partial = '';
  let numberConfirmed = false;
  let noNumber = false;
  let nameTries = 0;
  let numberTries = 0;
  let corrections = 0;
  let urgent = false;
  let lastAsk = 'How can I help?';
  /** @type {Service | undefined} */
  let lastService;
  const wants = [];
  const answered = [];
  const note = (list, item) => { if (item && !list.includes(item)) list.push(item); };

  /** The service sharing the most whole words with what was said ("boiler repair" beats "boiler service"). Plurals count, prefixes don't. */
  const findService = (text) => {
    const said = text.replace(/\b((?:[a-z]\.){2,})/g, (dotted) => dotted.replace(/\./g, ''));
    nearServices = [];
    if (INJURY.test(said)) return undefined;
    let best;
    let bestScore = 0;
    for (const service of config.services) {
      const words = service.name.split(/\s+/).filter((word) => word.length > 2 || (word.length === 2 && word === word.toUpperCase() && /^[A-Z0-9]{2}$/.test(word)));
      const score = words.filter((word) => {
        const base = word.toLowerCase().replace(/(ches|shes|xes|sses)$/, (m) => m.slice(0, -2)).replace(/([^s])s$/, '$1');
        const pattern = escape(base).replace(/-/g, '[ -]?').replace(/tyre/, 't[yi]re');
        return new RegExp(`(^|[^a-z0-9])${pattern}(?:s|es)?(?![a-z0-9])`, 'i').test(said);
      }).length;
      // A multi-word service only counts when every word was said ("fit new boilers" is not "Boiler service").
      if (score === words.length && score > bestScore) { best = service; bestScore = score; }
      else if (score > 0 && score < words.length) nearServices.push(service.name);
    }
    return best;
  };
  /** Services that share a word with what was said, when none matched fully. */
  let nearServices = [];
  const askName = (lead) => {
    if (caller && (number || noNumber)) { stage = 'more'; return `${lead} I’ve added that to your message. Anything else?`; }
    if (caller && held && !number) { stage = 'confirm'; return `${lead} ${readBack()}`; }
    if (caller) { stage = 'number'; return `${lead} ${NUMBER_ASK}`; }
    stage = 'name';
    return `${lead} ${NAME_ASK}`;
  };
  /** "My name is Sam and my number is 07700 900123, can you book an MOT": keep both, then deal with the request. */
  const takeDetails = (text) => {
    if (!['open', 'offer', 'more'].includes(stage)) return;
    if (!caller) {
      const said = norm(text).match(/\bmy name(?:'s| is)\s+([a-z' -]+?)(?=\s*(?:,|\.|\band\b|\bmy\b|\bcan\b|$))/i);
      const name = said ? validName(said[1]) : '';
      if (name) { caller = name; named = true; }
    }
    // Only a number introduced as theirs ("my number is…", "call me on…") or said first; never an order, part or reg number.
    const introduced = /\b(?:my (?:phone |mobile |contact )?number|(?:phone|mobile)(?: number)?(?: is)?|call me (?:back )?on|ring me (?:back )?on|text me on|reach me on|contact me on)\b/i.test(norm(text));
    const leading = /^\s*(?:\+?\d|oh\b|zero\b)/i.test(text);
    if (!number && !held && (introduced || leading) && !/\b(?:order|reference|ref|part|account|invoice|reg(?:istration)?|policy|tracking)\b/i.test(norm(text))) {
      const found = ukNumber(digitsFrom(text, true));
      if (found) held = found;
    }
  };
  const markUrgent = (text) => { urgent = true; note(wants, `Urgent: ${clip(text)}`); };
  const readBack = () => `Let me read that back: ${formatNumber(held)}. Is that right?`;
  const firstName = () => caller.split(' ')[0];
  /** The question still waiting for an answer, to ask again after answering something else. */
  const pending = () => (stage === 'name' ? NAME_ASK : stage === 'number' ? NUMBER_ASK : readBack());
  /** Answers a side question at the name, number or confirm stage, then asks the pending question again. */
  const aside = (text) => `${open(text, true)} ${pending()}`;

  /**
   * Answers one thing the caller said. With `inline`, it only answers: the stage
   * does not move and no follow-up question is added.
   */
  function open(text, inline = false) {
    const t = norm(text);
    const ask = (lead) => (inline ? lead : askName(lead));
    const out = (statement, tail, to) => {
      if (inline) return statement;
      if (to) stage = to;
      return `${statement} ${tail}`;
    };
    const service = findService(t);

    // 1. Danger, then urgent.
    if (isDanger(t) || isUrgent(t)) {
      markUrgent(text);
      return ask(`Thanks for telling me. ${isDanger(t) ? DANGER_LINE : URGENT_LINE}`);
    }
    if (!inline && isClosing(text)) return finish();
    if (!inline && /^(hi|hello|hey|good (evening|morning|afternoon))[\s!.,?]*$/.test(t)) return 'Hello. How can I help?';
    if (!inline && /\b(still there|are you there)\b/.test(t)) return 'I’m still here. How can I help?';
    if (has(t, ['take a message', 'leave a message', 'pass a message', 'pass on a message'])) {
      note(wants, 'Left a message');
      return ask('Of course.');
    }
    // 2. Is it a person, a bot, a scam?
    if (PERSON.test(t) && !STAFF_CONTACT.test(t) && !/\bam i (?:talking|speaking|chatting)\b/.test(t)) {
      note(wants, 'Asked to speak to someone');
      return ask(`There’s nobody here right now, but I can take a message and the team will see it ${config.callback}.`);
    }
    if (BOT.test(t) || has(t, ['real person', 'human', 'robot', 'automated', 'machine'])) {
      note(answered, 'Said it is an automated receptionist');
      return out(`I’m an automated receptionist for ${config.name}, not a person. I can answer common questions or take a message for the team.`, 'How can I help?');
    }
    if (SCAM.test(t)) {
      note(answered, 'Said it is an automated receptionist');
      return out(`No, this is the automated receptionist for ${config.name}. If you’d rather check, look up their number and ring back when they’re open.`, 'Can I help with anything?');
    }
    if (STAFF_CONTACT.test(t)) {
      note(wants, 'Asked for staff contact details');
      note(answered, 'Declined to share staff contact details');
      return ask(`I can’t share staff contact details, but I can take a message and the team will see it ${config.callback}.`);
    }
    // 3. Cancel or change.
    if (CANCEL.test(t)) {
      note(wants, `Cancel or change: ${service ? service.name : clip(text)}`);
      return ask('I can’t change the diary myself, but I can take your details so the team can sort it out.');
    }
    // 4. Price.
    if (PRICE_WORDS.test(t)) {
      // "how much is it?" after a service was mentioned means that service.
      const refersBack = /((\b(is|are|would|will|does|be) (it|that|this)( cost)?|\b(it|that|this) costs?|\bthe (price|cost)|\bhow much)\s*[?.!]*)$/.test(t);
      const asked = service || (refersBack ? lastService : undefined);
      if (asked) lastService = asked;
      if (asked?.price && (asked === lastService && !service ? true : aboutService(t, asked))) {
        note(answered, `${asked.name} price`);
        note(wants, asked.name);
        return out(`${asked.name} is ${asked.price}. For an exact price the team will need a few details.`, 'Would you like them to call you back?', 'offer');
      }
      note(wants, asked && !asked.price ? `Price for ${asked.name}` : `Price enquiry: ${clip(text)}`);
      return ask('I don’t have a price for that, so I won’t guess. I can take your details so the team can send a proper quote.');
    }
    // 5. Where, then when.
    if (config.areas && /\b(close to|near|nearby|far)\b/.test(t)) {
      note(answered, 'Areas covered');
      return out(`We cover ${config.areas}.`, 'Is there anything else?');
    }
    if (has(t, ['open', 'opening', 'hours', 'closing', 'what time', 'when are you']) || /\b(you|do you) close\b|\bclose (at|today|tonight|early|on)\b/.test(t)) {
      if (!config.hours) { note(wants, 'Asked about opening hours'); return ask('I don’t have the opening hours to hand, so I won’t guess. The team can let you know.'); }
      note(answered, 'Opening hours');
      return out(HOURS_NOW.test(t) ? `We’re closed right now. We’re open ${config.hours}.` : `We’re open ${config.hours}.`, 'Is there anything else I can help with?');
    }
    // 6. "Do you cover brakes" is about the service; "do you cover Leeds" is about the area.
    const serviceFirst = () => {
      note(answered, `Confirmed ${service.name}`);
      note(wants, service.name);
      lastService = service;
      return out(`Yes, we do ${shown(service.name)}.`, 'Would you like the team to call you back to arrange it?', 'offer');
    };
    if (service && has(t, ['cover'])) return serviceFirst();
    if (config.areas && has(t, ['area', 'areas', 'cover', 'come out', 'travel', 'where are you', 'location'])) {
      note(answered, 'Areas covered');
      return out(`We cover ${config.areas}.`, 'Is there anything else?');
    }
    if (has(t, ['book', 'booking', 'booked', 'appointment', 'slot', 'available', 'availability', 'come in'])) {
      note(wants, service ? `Book: ${service.name}` : `Booking: ${clip(text)}`);
      return ask('I can’t book the diary myself, but I can take your details so the team can arrange it.');
    }
    if (service) return serviceFirst();
    // A name said on its own at the start is an introduction.
    const intro = !inline && !caller ? introName(text) : '';
    if (intro) {
      caller = intro;
      named = true;
      return `Thanks, ${firstName()}. How can I help?`;
    }
    if (nearServices.length) {
      const list = nearServices.map(shown);
      note(wants, `Asked about: ${clip(text)}`);
      return `We do ${list.length > 1 ? `${list.slice(0, -1).join(', ')} and ${list.at(-1)}` : list[0]}. If it’s something else, I can take a message for the team. Is it one of those?`;
    }
    note(wants, `Message: ${clip(text)}`);
    return ask('I can’t answer that one myself, but I can take a message for the team.');
  }

  function finish() {
    stage = 'done';
    const thanks = `Thanks for calling${named ? `, ${firstName()}` : ` ${config.name}`}.`;
    if (!caller && !number) return `${thanks} Goodbye.`;
    // Never promise a callback without a number the caller confirmed.
    if (!number) return `${thanks} I couldn’t take a number, so if you need a reply, please ring back when we’re open. Goodbye.`;
    if (urgent) return `${thanks} Your message is marked urgent for the owner. Goodbye.`;
    return `${thanks} ${numberConfirmed ? `The team will get your message and can call you back ${config.callback}.` : 'The team will get your message and check the number before ringing.'} Goodbye.`;
  }

  /** Urgent words at the name, number or confirm question: 999 line first, keep any number or name said with it, then ask again. */
  function interruptUrgent(text) {
    markUrgent(text);
    const line = isDanger(text) ? DANGER_LINE : URGENT_LINE;
    const valid = ukNumber(digitsFrom(text, true));
    const name = stage === 'name' ? nameBeforeUrgent(text, isUrgent) : '';
    if (name) { caller = name; named = true; }
    if (valid) { held = valid; stage = 'confirm'; return `${line} ${readBack()}`; }
    if (name) {
      if (number || noNumber) { stage = 'more'; return `${line} Thanks, ${firstName()}. Anything else?`; }
      stage = 'number';
      return `${line} Thanks, ${firstName()}. ${NUMBER_ASK}`;
    }
    return `${line} ${pending()}`;
  }

  function takeName(text) {
    if (/\b(rather not|prefer not|don'?t want|do not want|not saying|no name|keep it private)\b/i.test(norm(text))) return anonymous('No problem.');
    // A number given at the name question ("Sam, 07700 900123", or just the number): keep it, check it, ask the name after.
    const digits = digitsFrom(text, true);
    const early = ukNumber(digits);
    if (early) {
      const rest = validName(norm(text).replace(/\+?\d[\d\s]*/g, ' ').replace(new RegExp(`\\b(${Object.keys(WORD_DIGITS).join('|')}|double|treble|triple|on|and|my|names?(?:'s)?|number|is)\\b`, 'gi'), ' ').replace(/[,.]/g, ' ').trim());
      if (rest) { caller = rest; named = true; }
      held = early;
      stage = 'confirm';
      return readBack();
    }
    if (foreignNumber(text, digits)) { stage = 'number'; return NOT_UK; }
    const filler = BARE_FILLER.test(text.trim()) || /^(that'?s|that is) (right|correct)|^(correct|right|exactly)\b/i.test(text.trim());
    if (isQuestion(text) && !filler) return aside(text);
    const name = filler ? '' : validName(text);
    if (!name) {
      if (isNo(text)) return anonymous('No problem.');
      if (isClosing(text)) return finish();
      nameTries += 1;
      if (nameTries < 2) return `Sorry, I didn’t catch that. ${NAME_ASK}`;
      return anonymous('That’s fine.');
    }
    caller = name;
    named = true;
    if (held && !number) { stage = 'confirm'; return `Thanks, ${firstName()}. ${readBack()}`; }
    if (number || noNumber) { stage = 'more'; return `Thanks, ${firstName()}. Is there anything else?`; }
    stage = 'number';
    return `Thanks, ${firstName()}. ${NUMBER_ASK}`;
  }
  function anonymous(lead) {
    caller = ANON;
    if (number || noNumber) { stage = 'more'; return `${lead} Is there anything else?`; }
    stage = 'number';
    return `${lead} ${NUMBER_ASK}`;
  }

  function leaveWithoutNumber(lead) {
    noNumber = true;
    stage = 'more';
    return `${lead} I’ll pass your message on without a number. Is there anything else?`;
  }
  function takeNumber(text) {
    const digits = digitsFrom(text, true);
    const valid = ukNumber(digits) || ukNumber(partial + digits);
    if (valid) { partial = ''; held = valid; stage = 'confirm'; return readBack(); }
    if (foreignNumber(text, digits)) {
      numberTries += 1;
      return numberTries < 3 ? NOT_UK : leaveWithoutNumber('Sorry, I can only take a UK number in this demo.');
    }
    if (refusesDetail(text)) return leaveWithoutNumber('No problem.');
    if (isQuestion(text) && !BARE_FILLER.test(text.trim())) return aside(text);
    if (isClosing(text)) return finish();
    if (digits.length >= 3) partial = digits;
    numberTries += 1;
    if (numberTries < 3) return 'Sorry, I didn’t get all of that. Could you say the number again, digit by digit?';
    return leaveWithoutNumber('Sorry, I still can’t make that out.');
  }

  function acceptNumber(confirmed) {
    number = formatNumber(held);
    numberConfirmed = confirmed;
    if (!caller) { stage = 'name'; return `Thanks. ${NAME_ASK}`; }
    stage = 'more';
    const flag = urgent ? ' I’ve marked this as urgent for the owner.' : '';
    return confirmed
      ? `Thanks.${urgent ? flag : ` The team will call you back ${config.callback}.`} Is there anything else?`
      : `Thanks, I’ve noted ${number} but couldn’t confirm it, so the team will check it first.${flag} Is there anything else?`;
  }
  /** One more correction. Past two, take what we have and flag it. */
  function correct(next) {
    corrections += 1;
    if (next) held = next;
    if (corrections > 2) return acceptNumber(false);
    stage = 'confirm';
    return readBack();
  }
  function redo() {
    corrections += 1;
    if (corrections > 2) return acceptNumber(false);
    stage = 'number';
    numberTries = 0;
    return 'No problem. What’s the right number?';
  }
  function checkNumber(text) {
    const digits = digitsFrom(text, true);
    if (/\b(end|ends|ending|last|finish|finishes)\b/i.test(text) && digits.length >= 1 && digits.length < held.length - 3) {
      return correct(held.slice(0, -digits.length) + digits);
    }
    const valid = ukNumber(digits);
    if (valid) return valid === held ? acceptNumber(true) : correct(valid);
    if (foreignNumber(text, digits)) { stage = 'number'; numberTries = 0; return NOT_UK; }
    // "No" first: "yeah no" and "yeah that's not right" are not a yes.
    if (isNo(text)) return redo();
    if (isYes(text) || /^(that'?s|that is|it'?s|it is) (right|correct|fine|good|perfect)|^(correct|right|exactly|spot on|perfect)\b/.test(plain(text))) return acceptNumber(true);
    if (isQuestion(text) && !BARE_FILLER.test(text.trim())) return aside(text);
    if (digits.length >= 3) return redo();
    if (isClosing(text)) return finish();
    return 'Sorry, is that number right? Say yes, or say the right number.';
  }

  /** The 'more' stage: "no, I also need brakes" is a new request, not a goodbye. */
  function more(text) {
    if (isClosing(text)) return finish();
    const rest = text.replace(/^\s*(?:(?:yeah|yes),?\s+)?(no|nope|nah)\b[\s,.!-]*(thanks|thank you)?[\s,.!-]*(but|and|also|actually)?[\s,.!-]*/i, '').trim();
    if (rest && rest !== text.trim()) return open(rest);
    if (isYes(text) && text.split(/\s+/).length <= 2) return 'Of course. What else can I help with?';
    return open(text);
  }

  const REPEAT = /^(?:(?:sorry|pardon|um|er) )*(?:what was that|what did you say|what was it|pardon me|pardon|come again|say that again|say again|(?:can|could) you (?:say|repeat) (?:that|it)(?: again)?|(?:can|could) you say (?:it )?again|repeat that|sorry what)(?: please| again)?$/;
  const repeatLine = () => `Of course. ${stage === 'confirm' ? readBack() : stage === 'name' ? NAME_ASK : stage === 'number' ? NUMBER_ASK : lastAsk}`;

  function respond(text) {
    if (stage === 'done') return '';
    const p = plain(text);
    if (!p || NOT_COUNTED.test(p)) return DIDNT_CATCH;
    if (isDanger(text) || isUrgent(text)) {
      return stage === 'name' || stage === 'number' || stage === 'confirm' ? interruptUrgent(text) : open(text);
    }
    if (STAFF_CONTACT.test(norm(text)) && (stage === 'name' || stage === 'number' || stage === 'confirm')) return aside(text);
    if (['open', 'offer', 'more'].includes(stage) && held && !number && isBareNumber(text)) { stage = 'confirm'; return readBack(); }
    if (REPEAT.test(p) || (/^(what|huh|eh)$/.test(p) && (stage === 'open' || stage === 'offer' || stage === 'more'))) return repeatLine();
    if (stage === 'name') return takeName(text);
    if (stage === 'number') return takeNumber(text);
    if (stage === 'confirm') return checkNumber(text);
    if (stage === 'offer') {
      if (startsNo(text)) {
        if (GOODBYE_WORD.test(p)) return finish();
        const rest = text.replace(/^\s*(?:(?:yeah|yes),?\s+)?(no|nope|nah)\b[\s,.!-]*(thanks|thank you)?[\s,.!-]*/i, '').trim();
        if (/^(but|and|also|actually)\b/i.test(rest)) return more(text);
        stage = 'more';
        return 'No problem. Is there anything else I can help with?';
      }
      if (isClosing(text)) return finish();
      if (isYes(text)) return askName('Great.');
      return open(text);
    }
    if (stage === 'more') return more(text);
    return open(text);
  }

  const firstHint = () => (config.hours ? 'Are you open on Saturday?' : config.services[0] ? `Do you do ${shown(config.services[0].name)}?` : 'Can you take a message?');
  const openHints = () => {
    const hints = [firstHint()];
    const priced = config.services.find((service) => service.price);
    if (priced) hints.push(`How much is ${aOrAn(priced.name)} ${shown(priced.name)}?`);
    const word = config.urgent.find((item) => !isDanger(item));
    if (word) hints.push(/^(broken down|breakdown)$/.test(word) ? 'It’s urgent, I’ve broken down' : `It’s urgent: ${word}`);
    if (hints.length < 2) hints.push(config.services[0] ? `Do you do ${shown(config.services[0].name)}?` : hints[0] === 'Can you take a message?' ? 'Are you open tomorrow?' : 'Can you take a message?');
    return hints.slice(0, 3);
  };

  return {
    config,
    get stage() { return stage; },
    greet() { return `Good evening, ${config.name}. We’re closed right now, but I can answer a question or take a message. How can I help?`; },
    /** @param {string} said */
    reply(said) {
      takeDetails(String(said || ''));
      const out = respond(String(said || '').trim());
      const question = (out.match(/[^.?!]*\?/g) ?? []).pop();
      if (question && out !== DIDNT_CATCH && !REPEAT.test(plain(String(said || '')))) lastAsk = question.trim();
      return out;
    },
    /** Two or three short things the caller could say right now. */
    hints() {
      if (stage === 'name') return ['It’s Sam'];
      if (stage === 'number') return ['07700 900123'];
      if (stage === 'confirm') return ['Yes, that’s right', `No, it ends ${String((Number(held.slice(-3)) + 1) % 1000).padStart(3, '0')}`];
      if (stage === 'offer') return ['Yes please', 'No thanks'];
      if (stage === 'more') return ['No, that’s all', config.services[0] ? `Do you do ${shown(config.services[0].name)}?` : 'Can you take a message?'];
      if (stage === 'done') return [];
      return openHints();
    },
    /** @returns {DeskSummary} */
    summary() {
      const title = urgent ? 'Urgent call' : wants.length ? 'New enquiry' : 'Question answered';
      /** @type {[string, string][]} */
      const rows = [];
      // A confirmed number with no name is still a caller worth ringing.
      const who = caller || (number ? ANON : '');
      rows.push(['Caller', who ? `${who}${number ? ` · ${number}` : ''}` : 'No details left']);
      if (number) rows.push(['Number check', numberConfirmed ? 'Confirmed by caller' : 'Not confirmed: ring to check']);
      if (wants.length) rows.push(['Wants', wants.slice(0, 8).join('; ')]);
      if (answered.length) rows.push(['Answered', answered.join('; ')]);
      const next = !who ? (urgent ? 'Urgent: no details left, check caller ID' : wants.length ? 'No details left: check caller ID' : 'Nothing to do')
        : !number ? `${urgent ? 'Urgent. ' : ''}No number left: check caller ID`
          : !numberConfirmed ? `${urgent ? 'Urgent. ' : ''}Number not confirmed: check it before ringing`
            : urgent ? 'Urgent: ring back now' : `Call back ${config.callback}`;
      rows.push(['Next step', next]);
      return { title, urgent, rows };
    },
  };
}
