'use client';

import { useState } from 'react';

type Mode = 'local' | 'team';

/** One stroke path per stop, drawn on a 24-unit grid. */
const ICONS = [
  'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm5 11.5L21 21',
  'M3 6h18v12H3Zm0 0 9 7 9-7',
  'M9 7 4 12l5 5M4 12h11a5 5 0 0 1 5 5v1',
  'M5 5h14v14H5Zm3 5 2 2 3-3M8 16h8',
  'M4 12.5 9.5 18 20 6.5',
  'M6 17V11a6 6 0 0 1 12 0v6l2 2H4ZM10 21h4',
  'M4 20V10M10 20V4M16 20v-7M22 20H2',
];

const STOPS: Record<Mode, { title: string; help: string }[]> = {
  local: [
    { title: 'Someone finds you', help: 'A clear website or Launch Page and a tidy Google listing' },
    { title: 'They get in touch', help: 'A form, booking page or phone line that never goes nowhere' },
    { title: 'They get a reply', help: 'Instant text-back, or an after-hours answer' },
    { title: 'Your team knows what’s next', help: 'One customer list, with reminders' },
    { title: 'The work gets done', help: 'Quotes, jobs and payments followed up for you' },
    { title: 'The customer stays informed', help: '“Booked”, “on the way”, “done”, sent for you' },
    { title: 'You learn what to improve', help: 'A weekly report and review requests' },
  ],
  team: [
    { title: 'A case or request arrives', help: 'An intake form that asks the right questions first time' },
    { title: 'It’s logged', help: 'One shared list, not someone’s inbox' },
    { title: 'The client hears back', help: 'An acknowledgement with a clear next date' },
    { title: 'Someone owns it', help: 'An owner, a deadline and reminders on every case' },
    { title: 'It gets resolved', help: 'Deadline and SLA tracking that flags cases before they slip' },
    { title: 'The client is updated', help: 'Milestone updates sent for you' },
    { title: 'Management sees the picture', help: 'KPI dashboards and regular reporting' },
  ],
};

const TONES = ['yellow', 'pink', 'orange', 'lilac', 'yellow', 'pink', 'orange'];

export function Journey() {
  const [mode, setMode] = useState<Mode>('local');
  return (
    <section className="pz-band pz-journey" id="journey" aria-labelledby="journey-title">
      <div className="pz-journey-head">
        <h2 id="journey-title">A website is one stop on a longer journey.</h2>
        <p>This is the whole route a customer takes, and where I can make it smoother. Flip it to see the same route for a team or practice.</p>
        <div className="pz-switch" role="group" aria-label="Whose journey?">
          <button type="button" aria-pressed={mode === 'local'} onClick={() => setMode('local')}>A local business</button>
          <button type="button" aria-pressed={mode === 'team'} onClick={() => setMode('team')}>A team or practice</button>
        </div>
      </div>
      <ol className="pz-route">
        {STOPS[mode].map((stop, index) => (
          <li key={index} className={index % 2 ? 'is-low' : undefined}>
            <span className={`pz-stop pz-${TONES[index]}`} aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false"><path d={ICONS[index]} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <h3>{stop.title}</h3>
            <p><span className="pz-help-label">I can help: </span>{stop.help}</p>
          </li>
        ))}
      </ol>
      <p className="pz-journey-note">{mode === 'team' ? 'Team versions are scoped as a Business System or Custom Software, and priced after we talk about how you work.' : 'Most of these are jobs on the automation menu. A Starter does one; a Business System joins three.'}</p>
    </section>
  );
}
