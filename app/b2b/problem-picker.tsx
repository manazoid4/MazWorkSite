'use client';

import { useState } from 'react';
import { B2B_SYSTEMS, COMPLAINT_PACKAGES, OFFERS } from '../offers';

/**
 * The five-second recognition step. A visitor arriving from a post should see
 * their own week in the list, tap it, and get a first fix and a starting price
 * without reading the whole page. Prices come from offers.ts.
 */
const system = (id: string) => B2B_SYSTEMS.find((item) => item.id === id)!;
const [health, board] = COMPLAINT_PACKAGES;

type Problem = {
  id: string;
  label: string;
  short: string;
  title: string;
  body: string;
  fix: string;
  name: string;
  price: string;
  href: string;
  link: string;
};

export const PROBLEMS: Problem[] = [
  {
    id: 'complaints',
    label: 'Complaints are slipping',
    short: 'Dates missed, no clear owner',
    title: 'A complaint arrives and disappears into an inbox.',
    body: 'Nobody owns the case. The reply goes out, but the date, the cause and the lesson do not get recorded. Then the same complaint comes back from another customer.',
    fix: 'Give every complaint a reference, an owner and a due date, then review the top three causes monthly.',
    name: health.name,
    price: health.price,
    href: '/complaints#health-check',
    link: 'See a sample report',
  },
  {
    id: 'reporting',
    label: 'Reporting takes days',
    short: 'Numbers rebuilt by hand',
    title: 'The board asks for numbers and someone rebuilds the story.',
    body: 'The figures live in a case system, a spreadsheet and someone’s inbox. A day disappears into exports, then the chart still needs a paragraph explaining what it means.',
    fix: 'Agree the five numbers that matter, pull them from one source, and write the headline before the chart.',
    name: board.name,
    price: board.price,
    href: '/complaints#board-reporting',
    link: 'Try the dashboard sample',
  },
  {
    id: 'enquiries',
    label: 'Enquiries go cold',
    short: 'Slow first reply, missed calls',
    title: 'The enquiry waits until someone is free.',
    body: 'A form, DM or missed call comes in. By the time anyone replies, the customer has called someone else. The enquiry was not bad; the first hour was.',
    fix: 'Send an instant reply with your booking link, and tell one named person that it arrived.',
    name: system('speed').name,
    price: system('speed').price,
    href: '#systems',
    link: 'See the system',
  },
  {
    id: 'onboarding',
    label: 'Onboarding is a chase',
    short: 'ID, letters and forms in pieces',
    title: 'The file cannot start until someone chases the paperwork.',
    body: 'ID, proof of address and signed letters arrive by email, WhatsApp and paper. Each person asks in their own way, and the client gets asked twice for the same thing.',
    fix: 'Send one checklist link, keep the missing items in one place, and chase automatically until the file is complete.',
    name: system('intake').name,
    price: system('intake').price,
    href: '#systems',
    link: 'See the system',
  },
  {
    id: 'repetition',
    label: 'Details are copied by hand',
    short: 'CRM to sheet to invoice',
    title: 'The same details are typed into three places.',
    body: 'A new client is added to the CRM, the job sheet and the invoice. One field changes and the three copies stop matching. Nobody notices until a report is wrong.',
    fix: 'Pick one source of truth for each field, then connect the tools before adding another one.',
    name: OFFERS[1].name,
    price: OFFERS[1].price,
    href: '/prices#practices',
    link: 'See what a joined-up system costs',
  },
  {
    id: 'followup',
    label: 'Proposals go quiet',
    short: 'Follow-up depends on memory',
    title: 'The quote went out and then nothing happened.',
    body: 'The follow-up depends on someone remembering in a busy week. Some prospects come back; most do not, and there is no record of who was chased.',
    fix: 'Write the one follow-up you always forget, diarise day 3, and stop the sequence the moment they reply.',
    name: system('proposal').name,
    price: system('proposal').price,
    href: '#systems',
    link: 'See the system',
  },
];

export function ProblemPicker() {
  const [active, setActive] = useState(PROBLEMS[0].id);
  const item = PROBLEMS.find((problem) => problem.id === active) || PROBLEMS[0];

  return (
    <div className="b2b-picker" aria-labelledby="b2b-picker-title">
      <div className="b2b-picker-head">
        <p className="b2b-tag">Start here</p>
        <h2 id="b2b-picker-title">Which one is happening?</h2>
        <p>Tap the closest. See the first fix and a starting price.</p>
      </div>

      <div className="b2b-picker-list" role="tablist" aria-label="Common business problems">
        {PROBLEMS.map((problem) => (
          <button
            key={problem.id}
            type="button"
            role="tab"
            id={`b2b-tab-${problem.id}`}
            aria-selected={active === problem.id}
            aria-controls="b2b-problem-panel"
            onClick={() => setActive(problem.id)}
            className={active === problem.id ? 'is-on' : undefined}
          >
            <strong>{problem.label}</strong>
            <span>{problem.short}</span>
          </button>
        ))}
      </div>

      <div className="b2b-picker-panel" id="b2b-problem-panel" role="tabpanel" aria-labelledby={`b2b-tab-${item.id}`} tabIndex={0}>
        <h3>{item.title}</h3>
        <p>{item.body}</p>
        <p className="b2b-picker-fix"><strong>First fix:</strong> {item.fix}</p>
        <div className="b2b-picker-foot">
          <div><span className="b2b-tag">A good first step</span><strong>{item.name}</strong><span className="b2b-price">{item.price}</span></div>
          <a className="b2b-picker-link" href={item.href}>{item.link} →</a>
        </div>
        <a className="b2b-picker-assessment" href="/b2b/assessment?src=b2b-assessment">Check this in the free 2-minute assessment →</a>
      </div>
    </div>
  );
}
