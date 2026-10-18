import { createHash } from 'node:crypto';
import { BOOKING_URL } from '../app/site.ts';

/**
 * One-off demo text for the "feel the speed" widget. Sends nothing unless Twilio is
 * configured (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM); without them the
 * widget shows the on-screen preview only. Limits are held in memory per server
 * instance, so they are best-effort: a hard 1-per-number-per-24h rule needs shared
 * storage (see HANDOFF.md). A small daily cap bounds the cost either way.
 */
const DAY = 86_400_000;
const MAX_BODY = 2_048;
const DAILY_CAP = 40;
const seen = new Map(); // sha256(key) -> time
let capDay = 0; let capCount = 0;

export const MESSAGE = `Hi, this is the Maz Works demo. If you were a customer who had just rung and nobody picked up, this is the text you would get straight away. Tap to pick a time: ${BOOKING_URL}\nReply STOP to opt out.`;

/** UK mobile in 07… or +44 7… form → E.164, otherwise ''. */
export function toE164(value) {
  const digits = String(value || '').replace(/[\s()-]/g, '');
  const match = /^(?:\+44|0044|0)(7\d{9})$/.exec(digits);
  return match ? `+44${match[1]}` : '';
}

export function allowDemo(ip, number, now = Date.now()) {
  for (const [key, time] of seen) if (now - time >= DAY) seen.delete(key);
  const day = Math.floor(now / DAY);
  if (day !== capDay) { capDay = day; capCount = 0; }
  const keys = ['ip:' + ip, 'tel:' + number].map(k => createHash('sha256').update(k).digest('hex'));
  if (capCount >= DAILY_CAP || keys.some(k => seen.has(k))) return false;
  keys.forEach(k => seen.set(k, now)); capCount++;
  return true;
}

export default async function handler(req, res, fetchImpl = fetch) {
  res.setHeader('cache-control', 'no-store');
  res.setHeader('content-type', 'application/json');
  const reply = (status, body) => { res.statusCode = status; res.end(JSON.stringify(body)); };
  if (req.method !== 'POST') { res.setHeader('allow', 'POST'); return reply(405, { ok: false }); }
  try {
    let raw = '';
    for await (const chunk of req) { raw += chunk.toString(); if (Buffer.byteLength(raw) > MAX_BODY) return reply(413, { ok: false }); }
    const body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || body.consent !== true) return reply(400, { ok: false, error: 'consent' });
    if (body._honey) return reply(200, { ok: true, simulated: true });
    const number = toE164(body.phone);
    if (!number) return reply(400, { ok: false, error: 'number' });
    const sid = process.env.TWILIO_ACCOUNT_SID, token = process.env.TWILIO_AUTH_TOKEN, from = process.env.TWILIO_FROM;
    if (!sid || !token || !from) return reply(200, { ok: true, simulated: true });
    const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0];
    if (!allowDemo(ip, number)) return reply(429, { ok: false, error: 'limit' });
    const response = await fetchImpl(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
      method: 'POST', signal: AbortSignal.timeout(9000),
      headers: { authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'), 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ To: number, From: from, Body: MESSAGE }).toString(),
    });
    return reply(response.ok ? 200 : 502, { ok: response.ok, simulated: false });
  } catch { return reply(400, { ok: false }); }
}
