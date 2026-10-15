// One-tap unsubscribe for mailing-list emails (link in every email, and the
// List-Unsubscribe one-click POST that Gmail and Yahoo send). Marks the Resend
// contact unsubscribed, so broadcasts skip them too. The signed token means a
// link only works for the address it was sent to.
import { timingSafeEqual } from 'node:crypto';
import { unsubToken } from './subscribe.js';

const CONTACTS_URL = 'https://api.resend.com/contacts';
const TIMEOUT_MS = 10000;

function page(res, status, message) {
  res.statusCode = status;
  res.setHeader('content-type', 'text/html; charset=utf-8');
  res.setHeader('cache-control', 'no-store, max-age=0');
  res.setHeader('x-content-type-options', 'nosniff');
  return res.end(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Maz Works</title><body style="font:18px/1.5 system-ui,sans-serif;max-width:32rem;margin:15vh auto;padding:0 16px"><h1 style="font-size:1.4rem">${message}</h1><p><a href="/">mazworks.uk</a></p></body>`);
}

export function validToken(email, token) {
  const want = Buffer.from(unsubToken(email));
  const got = Buffer.from(String(token || ''));
  return got.length === want.length && timingSafeEqual(got, want);
}

export async function unsubscribe(email, fetchImpl = fetch) {
  const apiKey = process.env.RESEND_API_KEY || '';
  if (!apiKey) return false;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetchImpl(`${CONTACTS_URL}/${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({ unsubscribed: true }),
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
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('allow', 'GET, POST');
    return res.end();
  }
  const url = new URL(req.url || '/', 'https://www.mazworks.uk');
  const email = (url.searchParams.get('e') || '').trim().toLowerCase();
  if (!email || !validToken(email, url.searchParams.get('t'))) {
    return page(res, 400, 'This unsubscribe link does not work. Reply "stop" to any email and Maz will take you off the list.');
  }
  if (!(await unsubscribe(email, fetchImpl))) {
    return page(res, 502, 'Could not unsubscribe you just now. Reply "stop" to any email and Maz will take you off the list.');
  }
  return page(res, 200, 'You are unsubscribed. No more emails from Maz Works.');
}
