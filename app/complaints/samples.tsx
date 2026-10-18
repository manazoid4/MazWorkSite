'use client';

import { useId, useState } from 'react';
import { ACTIONS, CATEGORIES, COMPLAINTS, MONTHS, TARGET_DAYS, monthlyCounts, outcomeSplit, rootCauseTable, summary, type ActionItem, type Category } from './sample-data';
import { BarList, ColumnChart, Kpi, SplitBar } from './charts';
import { FICTION_NOTE, SLIDES } from './reports';

/** Interactive samples for the Board Reporting package. All data is the fictional set in sample-data.ts. */

export function DashboardSample() {
  const uid = useId();
  const [category, setCategory] = useState<'All' | Category>('All');
  const rows = category === 'All' ? COMPLAINTS : COMPLAINTS.filter((row) => row.category === category);
  const s = summary(rows);
  const monthly = monthlyCounts(rows);
  const peak = monthly.indexOf(Math.max(...monthly));
  const causes = rootCauseTable(rows);
  const soWhat = causes.length === 0 ? 'No complaints in this view.' : `${causes[0].cause} is the biggest cause here (${causes[0].total} of ${s.total}, ${causes[0].share}%). Average time to close is ${s.avgDays} working days against a ${TARGET_DAYS}-day target, and ${100 - s.withinTarget}% ran over.`;
  return (
    <div className="sx-card" role="group" aria-label="Sample complaints dashboard">
      <div className="sx-bar-top">
        <p className="sx-fiction">{FICTION_NOTE}</p>
        <div className="cx-field">
          <label htmlFor={`${uid}-cat`}>Show</label>
          <select id={`${uid}-cat`} value={category} onChange={(event) => setCategory(event.target.value as 'All' | Category)}>
            <option value="All">All categories</option>
            {CATEGORIES.map((name) => <option key={name}>{name}</option>)}
          </select>
        </div>
      </div>
      <div className="sx-kpis" aria-live="polite">
        <Kpi label="Complaints" value={s.total} />
        <Kpi label="Upheld, wholly or partly" value={`${s.upheldShare}%`} />
        <Kpi label="Average days to close" value={s.avgDays} note={`Target ${TARGET_DAYS}`} />
        <Kpi label="Closed within target" value={`${s.withinTarget}%`} />
      </div>
      <div className="sx-two">
        <div><p className="sx-sub">Complaints per month</p><ColumnChart values={monthly} labels={MONTHS} highlight={s.total ? [peak] : []} title="Complaints per month" /></div>
        <div><p className="sx-sub">Outcomes</p><SplitBar title="Outcomes" parts={outcomeSplit(rows).map((row) => ({ label: row.outcome, value: row.total }))} /></div>
      </div>
      <p className="sx-sowhat" aria-live="polite"><strong>What this tells you:</strong> {soWhat}</p>
      <p className="sx-sub">Root causes (what the records point to)</p>
      <BarList title="Root causes" items={rootCauseTable(rows).slice(0, 5).map((row) => ({ label: row.cause, value: row.total, note: `${row.upheldShare}% upheld · ${row.avgDays} days` }))} />
      <p className="sx-note">Change the filter: the figures, chart and root causes all recalculate from the {COMPLAINTS.length} sample records.</p>
    </div>
  );
}

export function SheetSample() {
  const [showAll, setShowAll] = useState(false);
  const rows = showAll ? COMPLAINTS.slice(0, 40) : COMPLAINTS.slice(0, 8);
  return (
    <div className="sx-card" role="group" aria-label="Sample complaints tracker">
      <p className="sx-fiction">{FICTION_NOTE}</p>
      <div className="cx-table-wrap">
        <table className="cx-table sx-sheet">
          <caption className="s-visually-hidden">First rows of the sample tracker</caption>
          <thead><tr><th scope="col">Ref</th><th scope="col">Received</th><th scope="col">Category</th><th scope="col">Root cause</th><th scope="col">Outcome</th><th scope="col">Days</th><th scope="col">Late?</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.ref}>
                <th scope="row">{row.ref}</th><td>{row.day} {MONTHS[row.month]}</td><td>{row.category}</td><td>{row.rootCause}</td><td>{row.outcome}</td><td>{row.daysToClose}</td>
                <td>{row.daysToClose > TARGET_DAYS ? <span className="cx-pill is-overdue">Late</span> : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="button" onClick={() => setShowAll(!showAll)}>{showAll ? 'Show fewer rows' : 'Show more rows'}</button>
      <ul className="b2b-list">
        <li>Fixed choices for category, root cause and outcome, taken from <em>your</em> categories, so every entry is recorded the same way.</li>
        <li>“Late?” is worked out from your own target, and the dashboard updates as cases are added.</li>
        <li>Built to sit alongside whatever case system you already use.</li>
      </ul>
    </div>
  );
}

export function SlideViewer() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  return (
    <div className="sx-card" role="group" aria-label="Sample board presentation" aria-roledescription="carousel">
      <p className="sx-fiction">{FICTION_NOTE}</p>
      <div className="sx-slide" role="group" aria-roledescription="slide" aria-label={`Slide ${index + 1} of ${SLIDES.length}`}>
        <p className="sx-kicker">Slide {index + 1} of {SLIDES.length}</p>
        <h4>{slide.title}</h4>
        <p className="sx-takeaway">{slide.takeaway}</p>
        {slide.body}
      </div>
      <div className="sx-nav">
        <button type="button" className="button" onClick={() => setIndex((index + SLIDES.length - 1) % SLIDES.length)}>← Previous</button>
        <span aria-hidden="true">{index + 1} / {SLIDES.length}</span>
        <button type="button" className="button" onClick={() => setIndex((index + 1) % SLIDES.length)}>Next →</button>
      </div>
      <p><a className="button button-signal" href="/samples/complaints/sample-board-report.pdf" download>Download the sample board report (PDF)</a></p>
    </div>
  );
}

const STATUSES: ActionItem['status'][] = ['Not started', 'In progress', 'Done'];

export function ActionTrackerSample() {
  const uid = useId();
  const [items, setItems] = useState<readonly ActionItem[]>(ACTIONS);
  const done = items.filter((item) => item.status === 'Done').length;
  return (
    <div className="sx-card" role="group" aria-label="Sample management action tracker">
      <p className="sx-fiction">{FICTION_NOTE}</p>
      <p className="sx-note" aria-live="polite">{done} of {items.length} actions done</p>
      <div className="cx-table-wrap">
        <table className="cx-table">
          <caption className="s-visually-hidden">Management actions</caption>
          <thead><tr><th scope="col">Action</th><th scope="col">Owner</th><th scope="col">Due</th><th scope="col">Priority</th><th scope="col">Status</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.action}</th><td>{item.owner}</td><td>{item.due}</td><td>{item.priority}</td>
                <td>
                  <label className="s-visually-hidden" htmlFor={`${uid}-${item.id}`}>Status for: {item.action}</label>
                  <select id={`${uid}-${item.id}`} value={item.status} onChange={(event) => setItems(items.map((row) => row.id === item.id ? { ...row, status: event.target.value as ActionItem['status'] } : row))}>
                    {STATUSES.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
