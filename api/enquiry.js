import { CHECK_REPLY_TIME } from '../app/reply-time.js';
import { createHash } from 'node:crypto';
import { cleanEnquirySource, isEnquirySource } from '../app/linkedin-source.ts';
const buckets = new Map();
const WINDOW = 60_000;
const MAX_BODY = 16_384;
export function allowRequest(ip, now = Date.now()) {
  for (const [key, value] of buckets) if (now - value.start >= WINDOW) buckets.delete(key);
  const key = createHash('sha256').update(ip).digest('hex');
  const item = buckets.get(key) || { start: now, count: 0 };
  if (buckets.size >= 5000 && !buckets.has(key)) return false;
  item.count++; buckets.set(key, item);
  return item.count <= 5;
}
/**
 * Timing budget (keep in step with vercel.json maxDuration and SUBMIT/API timeouts in app/enquiry.ts):
 * owner mail <=9s, then one parallel stage <=9s => worst case ~18s. maxDuration is 30s; the client waits 35s,
 * so the FormSubmit fallback can only fire if the function really never answered.
 */
const PAGE_HOSTS = /^(www\.mazworks\.uk|[a-z0-9-]+\.vercel\.app)$/;
export function cleanPageUrl(value) {
  if (typeof value !== 'string') return '';
  try {
    const url = new URL(value.trim().slice(0, 500));
    if (url.protocol !== 'https:' || url.username || url.password || !PAGE_HOSTS.test(url.hostname)) return '';
    // Context is sent as separate validated fields. Never copy query data into mail.
    return `${url.origin}${url.pathname}`.slice(0, 300);
  } catch { return ''; }
}
const PROBLEM_IDS = ['missed-call', 'quote-follow-up', 'booking', 'reminder', 'lead-capture', 'onboarding'];
/** One line, no control characters or angle brackets, capped. Stops a value forging extra lines in the owner email. */
export const oneLine = (value, max) => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) : '';
/** Visitor's own words may keep line breaks, but nothing else unusual. */
const ownWords = (value, max) => typeof value === 'string' ? value.replace(/[\u0000-\u0009\u000b-\u001f\u007f<>]/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, max) : '';
export function cleanEnquiryContext(body) {
  const isTrade = value => typeof value === 'string' && value !== 'hub' && (isEnquirySource(`for-${value}`) || ['creator', 'other'].includes(value));
  const tradeRoute = value => typeof value === 'string' && value.startsWith('/for/') && value !== '/for/hub' && isEnquirySource(`for-${value.slice(5)}`);
  const trade = isTrade(body.trade) ? body.trade : '';
  return { ...body,
    trade,
    industry: trade ? oneLine(body.industry, 60) : '',
    problem_id: PROBLEM_IDS.includes(body.problem_id) ? body.problem_id : '',
    proof_id: trade && body.proof_id === trade && tradeRoute(`/for/${trade}`) ? trade : '',
    source: cleanEnquirySource(body.source),
    source_page: tradeRoute(body.source_page) ? body.source_page : '',
    name: oneLine(body.name, 120),
    problem: ownWords(body.problem, 4000),
    customer_message: ownWords(body.customer_message, 2000),
    existing_tools: oneLine(body.existing_tools, 500),
    interested_in: oneLine(body.interested_in, 120),
    systems: oneLine(body.systems, 400),
    website: oneLine(body.website, 200),
    referred_by: oneLine(body.referred_by, 120),
    next_step: 'Send a free demo and fixed price; not an order',
  };
}
export async function deliverEnquiry(body, fetchImpl = fetch) {
  body = cleanEnquiryContext(body);
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, confirmationSent: false };
  const send = async (message, suffix) => {
    try {
      const response = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST', signal: AbortSignal.timeout(9000),
        headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json', 'Idempotency-Key': `${body.request_id || createHash('sha256').update(JSON.stringify(body)).digest('hex')}-${suffix}` },
        body: JSON.stringify({ from: 'Maz Works <info@mazworks.uk>', ...message }),
      });
      if (!response.ok) return false;
      const result = await response.json();
      return typeof result.id === 'string';
    } catch { return false; }
  };
  const fields = ['name', 'email', 'problem', 'customer_message', 'existing_tools', 'website', 'referred_by', 'interested_in', 'systems', 'trade', 'industry', 'problem_id', 'proof_id', 'source_page', 'source', 'next_step'];
  const draft = body.draft ? `\n\n----- Draft reply (approve, tweak, send) -----\n${body.draft}` : '';
  const page = cleanPageUrl(body._url);
  const accepted = await send({ to: ['info@mazworks.uk'], reply_to: body.email,
    subject: `Maz Works — free demo and quote${body.interested_in && body.interested_in !== 'Not chosen' ? ` — ${body.interested_in}` : ''}`,
    text: fields.filter(field => body[field]).map(field => `${field}: ${body[field]}`).join('\n\n') + (page ? `\n\nsubmitted_from: ${page}` : '') + draft,
  }, 'owner');
  if (!accepted) return { ok: false, confirmationSent: false };
  // The owner has the enquiry, so everything below runs concurrently and can never fail it.
  // Total time is owner (<=9s) + one parallel stage (<=9s), not the sum of every call.
  const [, , confirmation] = await Promise.allSettled([
    syncHubSpot(body, fetchImpl),
    scheduleFollowUps(body, send),
    send({ to: [body.email], reply_to: 'info@mazworks.uk',
      subject: 'Your Maz Works free demo request',
      text: `Thanks ${body.name}, I've got your request.\n\nI'll read it myself and send you a working demo with your business name on it, plus a fixed price, usually within ${CHECK_REPLY_TIME}. No call needed, no obligation.\n\nThis confirmation is the same kind of instant reply I set up for clients.\n\nIf anything changes, reply to this email.\n\nManazir, Maz Works`,
    }, 'visitor'),
  ]);
  const confirmationSent = confirmation.status === 'fulfilled' && confirmation.value === true;
  return { ok: true, confirmationSent };
}
/**
 * HubSpot sync (C12): upsert the contact by email with the message and source.
 * Needs HUBSPOT_TOKEN (private app token, crm.objects.contacts write). Standard
 * properties only, so it works on a fresh portal; Maz tiers it by hand after.
 */
export async function syncHubSpot(body, fetchImpl = fetch) {
  const token = process.env.HUBSPOT_TOKEN;
  if (!token) return false;
  const [firstname, ...rest] = String(body.name || '').trim().split(/\s+/);
  const properties = { email: body.email, firstname, lastname: rest.join(' ') || undefined, website: body.website || undefined, lifecyclestage: 'lead', hs_lead_status: 'NEW',
    message: [body.problem, body.interested_in && body.interested_in !== 'Not chosen' ? `Interested in: ${body.interested_in}` : '', body.trade ? `Type: ${body.trade}` : '', body.referred_by ? `Referred by: ${body.referred_by}` : '', body.source ? `Source: ${body.source}` : ''].filter(Boolean).join('\n') };
  for (const key of Object.keys(properties)) if (properties[key] === undefined) delete properties[key];
  const headers = { authorization: `Bearer ${token}`, 'content-type': 'application/json' };
  const signal = AbortSignal.timeout(9000); // shared, so create + update together stay within 9s
  const create = await fetchImpl('https://api.hubapi.com/crm/v3/objects/contacts', { method: 'POST', headers, body: JSON.stringify({ properties }), signal });
  if (create.ok) return true;
  if (create.status !== 409) return false;
  const update = await fetchImpl(`https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(body.email)}?idProperty=email`, { method: 'PATCH', headers, body: JSON.stringify({ properties }), signal });
  return update.ok;
}

/**
 * Three gentle follow-ups (C12) for people who go quiet, scheduled with Resend
 * so nothing runs on a server. Only when FOLLOW_UP_EMAILS=on. If the person
 * replies, Maz cancels the rest in Resend (the ids are in the Resend log).
 */
export const FOLLOW_UPS = [
  { in: 'in 2 days', subject: 'Did you try the demo?', text: (name) => `Hi ${name},\n\nJust checking the demo reached you and worked on your phone. If anything is unclear, reply with one line and I'll fix it.\n\nManazir, Maz Works` },
  { in: 'in 5 days', subject: 'One question', text: (name) => `Hi ${name},\n\nWhat's the one thing that would make this an easy yes? Price, timing, a worry about your apps? Tell me and I'll answer straight.\n\nManazir, Maz Works` },
  { in: 'in 9 days', subject: 'Leaving this with you', text: (name) => `Hi ${name},\n\nI'll leave it here so I'm not in your way. The demo and price stand whenever you're ready, and the written scope sheet comes before you pay anything. Reply any time.\n\nManazir, Maz Works` },
];
export async function scheduleFollowUps(body, send) {
  if (process.env.FOLLOW_UP_EMAILS !== 'on' || !body.email) return false;
  const name = String(body.name || '').trim().split(/\s+/)[0] || 'there';
  const results = await Promise.all(FOLLOW_UPS.map((step, index) => send({ to: [body.email], reply_to: 'info@mazworks.uk', subject: step.subject, text: step.text(name), scheduled_at: step.in }, `follow-up-${index + 1}`)));
  const scheduled = results.filter(Boolean).length;
  return scheduled === FOLLOW_UPS.length;
}

export default async function handler(req, res, fetchImpl = fetch) {
  res.setHeader('cache-control', 'no-store');
  res.setHeader('content-type', 'application/json');
  const reply = (status, body) => { res.statusCode = status; res.end(JSON.stringify(body)); };
  if (req.method !== 'POST') { res.setHeader('allow', 'POST'); return reply(405, {ok:false}); }
  let raw = '';
  try {
    for await (const chunk of req) { raw += chunk.toString(); if (Buffer.byteLength(raw) > MAX_BODY) return reply(413,{ok:false}); }
    const body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(400,{ok:false});
    if (body._honey) return reply(200, {ok:true,confirmationSent:false});
    const fields = ['name','email','problem','customer_message','existing_tools','website','referred_by','interested_in','systems','trade','industry','problem_id','proof_id','source_page','source','next_step','request_id','_url','draft'];
    if (fields.some(field => body[field] !== undefined && (typeof body[field] !== 'string' || body[field].length > 4000))) return reply(400,{ok:false});
    if (!body.name?.trim() || !body.problem?.trim() || !/^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(body.email || '') || body.name.length > 120) return reply(400,{ok:false});
    if (body.request_id && !/^[a-zA-Z0-9-]{1,64}$/.test(body.request_id)) return reply(400,{ok:false});
    if (!allowRequest(String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0])) {res.setHeader('retry-after','60'); return reply(429,{ok:false});}
    const result = await deliverEnquiry(body, fetchImpl);
    return reply(result.ok ? 200 : 502, result);
  } catch { return reply(400,{ok:false}); }
}
