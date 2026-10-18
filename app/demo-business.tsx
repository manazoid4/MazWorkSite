import type { CustomerTypeId } from './offers';
import { BUILD_CREDIT } from './site';

/**
 * Honest proof (audit 2 Oct, finding 6): one made-up demo business per
 * customer type, with before/after phone screens drawn in SVG. Always
 * captioned "Demo business, not a client". No names of real people or
 * firms, no numbers presented as results.
 */
type Screen = { title: string; lines: Array<{ who: 'them' | 'auto' | 'note'; text: string }> };
type Demo = { name: string; trade: string; before: Screen; after: Screen; what: string };

export const DEMO_BUSINESSES: Record<CustomerTypeId, Demo> = {
  trades: {
    name: 'Hollybank Plumbing',
    trade: 'a one-van plumber',
    what: 'Missed-call text-back: a call the plumber can’t take gets a text with the quote link straight away.',
    before: { title: 'Before', lines: [{ who: 'note', text: 'Missed call · 10:42' }, { who: 'note', text: 'Missed call · 10:43' }, { who: 'note', text: 'No reply sent' }, { who: 'note', text: 'Caller rings someone else' }] },
    after: { title: 'After', lines: [{ who: 'note', text: 'Missed call · 10:42' }, { who: 'auto', text: 'Sorry I missed you, I’m on a job. Get a quote here: link' }, { who: 'them', text: 'Done, sent the photos' }, { who: 'note', text: 'Quote request in the list' }] },
  },
  appointments: {
    name: 'Willow Room Salon',
    trade: 'a two-chair salon',
    what: 'Appointment reminders: a text the day before, and clients confirm or move with one reply.',
    before: { title: 'Before', lines: [{ who: 'note', text: 'Tue 2:00 · empty chair' }, { who: 'note', text: 'Client forgot' }, { who: 'note', text: 'No way to fill the slot' }] },
    after: { title: 'After', lines: [{ who: 'auto', text: 'Reminder: cut and colour tomorrow 2pm. Reply C to confirm or M to move.' }, { who: 'them', text: 'M' }, { who: 'auto', text: 'No problem, pick a new time: link' }, { who: 'note', text: 'Slot offered to the waitlist' }] },
  },
  creators: {
    name: 'Peak Form Coaching',
    trade: 'a personal trainer',
    what: 'Comment to get it: someone comments a word, gets the free preview by DM and joins the email list.',
    before: { title: 'Before', lines: [{ who: 'them', text: 'PLAN' }, { who: 'them', text: 'PLAN please!' }, { who: 'note', text: 'Replying by hand, hours later' }] },
    after: { title: 'After', lines: [{ who: 'them', text: 'PLAN' }, { who: 'auto', text: 'Here’s your free 4-week plan: link. Want weekly tips too?' }, { who: 'them', text: 'Yes' }, { who: 'note', text: 'Added to the email list' }] },
  },
  offices: {
    name: 'Brookside Lettings',
    trade: 'a small lettings office',
    what: 'Every enquiry in one list: phone, email and form enquiries land in one place with an instant reply.',
    before: { title: 'Before', lines: [{ who: 'note', text: 'Inbox A: 14 unread' }, { who: 'note', text: 'Inbox B: 9 unread' }, { who: 'note', text: 'Voicemail: 3' }, { who: 'note', text: 'Who’s answering this one?' }] },
    after: { title: 'After', lines: [{ who: 'auto', text: 'Thanks, we’ve got your enquiry. We’ll reply today.' }, { who: 'note', text: 'One list · 5 new · 0 waiting' }, { who: 'note', text: 'Each one assigned' }] },
  },
};

function Phone({ screen, tone }: { screen: Screen; tone: 'before' | 'after' }) {
  const width = 180;
  let y = 58;
  const rows = screen.lines.map((line, index) => {
    const chars = 24;
    const words = line.text.split(' ');
    const wrapped: string[] = [];
    let current = '';
    for (const word of words) {
      if ((current + ' ' + word).trim().length > chars) {
        wrapped.push(current.trim());
        current = word;
      } else current += ' ' + word;
    }
    if (current.trim()) wrapped.push(current.trim());
    const h = 14 * wrapped.length + 12;
    const x = line.who === 'them' ? 40 : 14;
    const fill = line.who === 'auto' ? 'var(--signal, #e8ff59)' : line.who === 'them' ? 'var(--surface, #fff)' : 'none';
    const row = (
      <g key={index}>
        {line.who === 'note' ? null : <rect x={x} y={y} width={width - 54} height={h} rx={8} fill={fill} stroke="currentColor" strokeOpacity={0.25} />}
        {wrapped.map((text, i) => (
          <text key={i} x={line.who === 'note' ? 16 : x + 8} y={y + 16 + i * 14} fontSize={11} fill="currentColor" fontStyle={line.who === 'note' ? 'italic' : undefined}>
            {text}
          </text>
        ))}
      </g>
    );
    y += h + 8;
    return row;
  });
  const height = Math.max(250, y + 14);
  return (
    <svg viewBox={`0 0 ${width + 8} ${height}`} role="img" aria-label={`${screen.title}: ${screen.lines.map((line) => line.text).join('. ')}`} className={`db-phone db-${tone}`}>
      <rect x={4} y={4} width={width} height={height - 8} rx={22} fill="var(--paper, #f7f5ef)" stroke="currentColor" strokeWidth={2} />
      <rect x={width / 2 - 22} y={12} width={52} height={6} rx={3} fill="currentColor" opacity={0.3} />
      <text x={16} y={42} fontSize={13} fontWeight={800} fill="currentColor">{screen.title}</text>
      {rows}
    </svg>
  );
}

/** Before/after phones for the type's demo business, plus the case-study slot. */
export function DemoBusiness({ type }: { type: CustomerTypeId }) {
  const demo = DEMO_BUSINESSES[type];
  return (
    <figure className="db">
      <div className="db-phones">
        <Phone screen={demo.before} tone="before" />
        <Phone screen={demo.after} tone="after" />
      </div>
      <figcaption>
        <strong>{demo.name}, {demo.trade}.</strong> {demo.what} <em>Demo business, not a client.</em> <small className="db-credit">{BUILD_CREDIT}</small>
      </figcaption>
    </figure>
  );
}
