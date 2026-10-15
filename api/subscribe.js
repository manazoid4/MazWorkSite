// Mailing-list signup. Adds one email address to Resend's contacts, which is
// the list Maz Works broadcasts go to from its own domain.
//
// Runs server-side so the page keeps its same-origin CSP, the form still works
// without JavaScript (a plain POST gets a redirect back), the honeypot is
// checked before anything reaches Resend, and the API key never reaches a
// browser. The key lives only in Vercel as RESEND_API_KEY.
const CONTACTS_URL = 'https://api.resend.com/contacts';
const EMAILS_URL = 'https://api.resend.com/emails';
// Resend stores contacts silently, so each signup is also emailed to Maz.
const NOTIFY_TO = process.env.SIGNUP_NOTIFY_EMAIL || 'info@mazworks.uk';
const NOTIFY_FROM = 'Maz Works <signups@mazworks.uk>';
const MAX_BODY_BYTES = 2048;
const TIMEOUT_MS = 10000;

// Deliberately loose: the goal is to reject typos and junk, not to be an RFC.
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function parseBody(raw, type = '') {
  if (type.includes('application/json')) {
    try { return JSON.parse(raw) ?? {}; } catch { return {}; }
  }
  return Object.fromEntries(new URLSearchParams(raw));
}

function wantsJson(req) {
  return (req.headers.accept || '').includes('application/json');
}

const TRADES = ['salon', 'garage', 'clinic', 'cafe', 'trades'];
const TAG = /^[a-z0-9-]{1,32}$/;

/** Only known shapes get through: these values land in Maz's inbox and a redirect URL. */
export function signupTags(body) {
  const pick = (value, ok) => (typeof value === 'string' && ok(value) ? value : '');
  return {
    source: pick(body.source, (v) => TAG.test(v)),
    trade: pick(body.trade, (v) => TRADES.includes(v)),
    formId: pick(body.return, (v) => TAG.test(v)),
  };
}

/** Back to the page the form was on (same site only), else the original /lab form. */
export function returnPath(req, formId) {
  try {
    const from = new URL(req.headers.referer || '');
    if (formId && from.host === req.headers.host) return { path: from.pathname, formId };
  } catch { /* no or bad referer */ }
  return { path: '/lab', formId: 'newsletter' };
}

function reply(req, res, status, result, back = { path: '/lab', formId: 'newsletter' }) {
  res.setHeader('cache-control', 'no-store, max-age=0');
  res.setHeader('x-content-type-options', 'nosniff');
  if (wantsJson(req)) {
    res.statusCode = status;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify(result));
  }
  // No JavaScript: send the visitor back to the form with the outcome in the URL.
  res.statusCode = 303;
  res.setHeader('location', `${back.path}?subscribed=${result.ok ? '1' : '0'}#${back.formId}`);
  return res.end();
}

export async function addContact(email, fetchImpl = fetch) {
  const apiKey = process.env.RESEND_API_KEY || '';
  if (!apiKey) return { ok: false, reason: 'unconfigured' };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetchImpl(CONTACTS_URL, {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({ email, unsubscribed: false }),
      signal: controller.signal,
    });
    if (response.ok) return { ok: true };
    // Signing up twice is not an error from the visitor's side: they are on the list.
    const detail = await response.text().catch(() => '');
    if (response.status === 409 || /already exists/i.test(detail)) return { ok: true };
    return { ok: false, reason: 'rejected' };
  } catch {
    return { ok: false, reason: controller.signal.aborted ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Best effort: a failed notification must never turn a real signup into an
 * error for the visitor, because the contact is already saved in Resend.
 */
export async function notifyOwner(email, fetchImpl = fetch, tags = {}) {
  const from = [tags.trade && `trade: ${tags.trade}`, tags.source && `signed up from: ${tags.source}`].filter(Boolean).join(', ');
  const apiKey = process.env.RESEND_API_KEY || '';
  if (!apiKey) return false;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetchImpl(EMAILS_URL, {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        reply_to: email,
        subject: `New mailing-list signup${tags.trade ? ` (${tags.trade})` : ''}: ${email}`,
        text: `${email} just joined the Maz Works mailing list from www.mazworks.uk.${from ? `\n${from}` : ''}\n\nThey are saved in Resend contacts. Reply to this email to write to them directly.`,
      }),
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res, fetchImpl = fetch) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('allow', 'POST');
    return res.end();
  }

  let body;
  try {
    body = parseBody(await readBody(req), req.headers['content-type']);
  } catch {
    return reply(req, res, 413, { ok: false, reason: 'too-large' });
  }

  // Honeypot: real visitors never see this field, so anything in it is a bot.
  // Report success so the bot has nothing to learn from, and send nothing on.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return reply(req, res, 200, { ok: true });
  }

  const tags = signupTags(body);
  const back = returnPath(req, tags.formId);
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL.test(email)) return reply(req, res, 400, { ok: false, reason: 'invalid-email' }, back);

  const result = await addContact(email, fetchImpl);
  // Awaited, not fired-and-forgotten: the function can be frozen once it replies.
  if (result.ok) await notifyOwner(email, fetchImpl, tags);
  return reply(req, res, result.ok ? 200 : 502, result, back);
}
