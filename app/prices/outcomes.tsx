/** Four outcomes, each with its own small drawing. Hand-built SVG, no icon set. */

function Noticed() {
  return (
    <svg viewBox="0 0 220 150" aria-hidden="true" focusable="false">
      <rect x="10" y="14" width="168" height="112" rx="6" fill="#fff7e8" stroke="#10133a" strokeWidth="3" />
      <path d="M10 40 H178" stroke="#10133a" strokeWidth="3" />
      <circle cx="26" cy="27" r="4.5" fill="#ff5a3c" /><circle cx="42" cy="27" r="4.5" fill="#ffd43b" /><circle cx="58" cy="27" r="4.5" fill="#2a44f0" />
      <rect x="26" y="56" width="84" height="12" fill="#10133a" /><rect x="26" y="74" width="58" height="12" fill="#10133a" />
      <rect x="26" y="98" width="52" height="16" rx="8" fill="#ff6b1a" stroke="#10133a" strokeWidth="2.5" />
      <circle cx="140" cy="86" r="22" fill="#ff9ccd" stroke="#10133a" strokeWidth="3" />
      <path d="M168 98 L198 134 L184 134 L176 148 Z" fill="#10133a" transform="translate(-6 -12)" />
      <path d="M196 20 l4 -12 l4 12 l12 4 l-12 4 l-4 12 l-4 -12 l-12 -4 Z" fill="#2a44f0" />
    </svg>
  );
}

function Customers() {
  return (
    <svg viewBox="0 0 220 150" aria-hidden="true" focusable="false">
      <path d="M14 14 H122 a10 10 0 0 1 10 10 V62 a10 10 0 0 1 -10 10 H54 L32 92 V72 H24 a10 10 0 0 1 -10 -10 V24 a10 10 0 0 1 10 -10 Z" fill="#fff7e8" stroke="#10133a" strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 36 H112 M32 52 H88" stroke="#10133a" strokeWidth="4" strokeLinecap="round" />
      <path d="M206 62 H100 a10 10 0 0 0 -10 10 V110 a10 10 0 0 0 10 10 H168 L190 140 V120 H196 a10 10 0 0 0 10 -10 V72 a10 10 0 0 0 -10 -10 Z" fill="#2a44f0" stroke="#10133a" strokeWidth="3" strokeLinejoin="round" transform="translate(-6 0)" />
      <path d="M118 90 L130 102 L156 76" fill="none" stroke="#ffd43b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Easier() {
  return (
    <svg viewBox="0 0 220 150" aria-hidden="true" focusable="false">
      <rect x="10" y="14" width="64" height="122" rx="6" fill="#fff7e8" stroke="#10133a" strokeWidth="3" />
      <rect x="78" y="14" width="64" height="122" rx="6" fill="#fff7e8" stroke="#10133a" strokeWidth="3" />
      <rect x="146" y="14" width="64" height="122" rx="6" fill="#fff7e8" stroke="#10133a" strokeWidth="3" />
      <rect x="18" y="26" width="48" height="22" fill="#ffd43b" stroke="#10133a" strokeWidth="2.5" />
      <rect x="18" y="54" width="48" height="22" fill="#ff5a3c" stroke="#10133a" strokeWidth="2.5" />
      <rect x="86" y="26" width="48" height="22" fill="#ff9ccd" stroke="#10133a" strokeWidth="2.5" />
      <rect x="154" y="26" width="48" height="22" fill="#c7b8ff" stroke="#10133a" strokeWidth="2.5" />
      <rect x="154" y="54" width="48" height="22" fill="#c7b8ff" stroke="#10133a" strokeWidth="2.5" />
      <path d="M156 100 V126 M170 88 V126 M184 108 V126 M198 94 V126" stroke="#10133a" strokeWidth="6" strokeLinecap="round" />
      <path d="M72 66 C 86 66, 76 40, 90 40" fill="none" stroke="#10133a" strokeWidth="2.5" strokeDasharray="5 5" />
    </svg>
  );
}

function Better() {
  return (
    <svg viewBox="0 0 220 150" aria-hidden="true" focusable="false">
      <rect x="14" y="104" width="44" height="32" fill="#fff7e8" stroke="#10133a" strokeWidth="3" />
      <rect x="62" y="80" width="44" height="56" fill="#ff9ccd" stroke="#10133a" strokeWidth="3" />
      <rect x="110" y="54" width="44" height="82" fill="#ffd43b" stroke="#10133a" strokeWidth="3" />
      <rect x="158" y="26" width="44" height="110" fill="#2a44f0" stroke="#10133a" strokeWidth="3" />
      <path d="M20 84 C 60 76, 100 46, 150 20" fill="none" stroke="#10133a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M130 14 L152 18 L146 40" fill="none" stroke="#10133a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PANELS = [
  { id: 'noticed', tone: 'yellow', art: <Noticed />, title: 'Get noticed.', lead: 'Websites, landing pages and a stronger digital presence.', points: ['A one-page Launch Page or a full website', 'A tidy Google listing and fresh posts'], href: '#websites', link: 'See pages and websites' },
  { id: 'customers', tone: 'pink', art: <Customers />, title: 'Win and keep customers.', lead: 'Enquiries, follow-ups, smoother communication and booking journeys.', points: ['Missed calls and quotes followed up for you', 'Bookings, reminders and an after-hours receptionist'], href: '#systems', link: 'See automation' },
  { id: 'easier', tone: 'cobalt', art: <Easier />, title: 'Make work easier.', lead: 'Internal workflows, useful dashboards, reporting and software.', points: ['One shared list instead of five inboxes', 'Deadlines, case tracking and KPI reporting for teams'], href: '#offer-custom', link: 'See custom software' },
  { id: 'better', tone: 'lilac', art: <Better />, title: 'Keep getting better.', lead: 'Ongoing improvements, support and practical problem-solving.', points: ['Monthly care, fixes and small changes', 'A review each month of what to improve next'], href: '#monthly', link: 'See monthly help' },
];

export function Outcomes() {
  return (
    <section className="pz-section pz-outcomes" id="help" aria-labelledby="help-title">
      <h2 id="help-title">What can I help you with?</h2>
      <div className="pz-panels">
        {PANELS.map((panel) => (
          <article key={panel.id} className={`pz-panel pz-${panel.tone} pz-panel-${panel.id}`}>
            <div className="pz-panel-art">{panel.art}</div>
            <h3>{panel.title}</h3>
            <p>{panel.lead}</p>
            <ul>{panel.points.map((point) => <li key={point}>{point}</li>)}</ul>
            <a className="pz-textlink" href={panel.href}>{panel.link} <span aria-hidden="true">→</span></a>
          </article>
        ))}
      </div>
      <p className="pz-who">I work with local trades, salons and cafés, agencies and professional practices, finance and customer-operations teams, and creators. Different businesses, the same question: where does the customer get stuck?</p>
    </section>
  );
}
