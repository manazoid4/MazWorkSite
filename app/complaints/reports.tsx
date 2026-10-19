import type { ReactNode } from 'react';
import { ACTIONS, COMPLAINTS, HEALTH_RECOMMENDATIONS, HEALTH_SCORECARD, MONTHS, SAMPLE_BUSINESS, SAMPLE_PERIOD, TARGET_DAYS, byCategory, findings, monthlyCounts, outcomeSplit, rootCauseTable, share, summary } from './sample-data';
import { BarList, ColumnChart, Kpi, ScoreDots, SplitBar } from './charts';

/**
 * The two sample deliverables, as plain components. They render on /complaints, and the same
 * markup is printed to the downloadable PDFs, so the page and the files can never disagree.
 */
const S = summary(COMPLAINTS);
const FINDINGS = findings(COMPLAINTS);
const CAUSES = rootCauseTable(COMPLAINTS);
const CATS = byCategory(COMPLAINTS);
const MONTHLY = monthlyCounts(COMPLAINTS);
const TOP3 = [...CATS].sort((a, b) => b.total - a.total).slice(0, 3);
const PEAK = [MONTHLY.indexOf(Math.max(...MONTHLY))];

export const FICTION_NOTE = `Fictional example for ${SAMPLE_BUSINESS}. The data is invented to show the format. It is not a client result.`;

export const SLIDES: { title: string; takeaway: string; body: ReactNode }[] = [
  {
    title: 'The year at a glance',
    takeaway: `${S.total} complaints in twelve months. ${S.upheldShare}% were upheld at least in part.`,
    body: (
      <div className="sx-kpis">
        <Kpi label="Complaints" value={S.total} note={SAMPLE_PERIOD} />
        <Kpi label="Upheld, wholly or partly" value={`${S.upheldShare}%`} />
        <Kpi label="Average days to close" value={S.avgDays} note={`Target ${TARGET_DAYS} working days`} />
        <Kpi label="Closed within target" value={`${S.withinTarget}%`} />
      </div>
    ),
  },
  {
    title: 'Volumes peaked after the fee change',
    takeaway: `Complaints peaked in ${S.peakMonth}. The last quarter (${S.lastQuarter}) is still above the first (${S.firstQuarter}).`,
    body: <ColumnChart values={MONTHLY} labels={MONTHS} highlight={PEAK} title="Complaints per month" height={170} />,
  },
  {
    title: 'What the complaints were about',
    takeaway: `The three biggest categories (${TOP3.map((row) => row.category).join(', ')}) make up ${share(TOP3.reduce((sum, row) => sum + row.total, 0), S.total)}% of complaints.`,
    body: <BarList title="Complaints by category" items={[...CATS].sort((a, b) => b.total - a.total).map((row) => ({ label: row.category, value: row.total }))} />,
  },
  {
    title: 'Why they happened (root causes)',
    takeaway: `${CAUSES[0].cause} and ${CAUSES[1].cause.toLowerCase()} together explain ${CAUSES[0].share + CAUSES[1].share}% of complaints.`,
    body: <BarList title="Complaints by root cause" items={CAUSES.slice(0, 6).map((row) => ({ label: row.cause, value: row.total, note: `${row.upheldShare}% upheld · ${row.avgDays} days` }))} />,
  },
  {
    title: 'Outcomes and timeliness',
    takeaway: `${100 - S.withinTarget}% of complaints ran past the ${TARGET_DAYS}-day target.`,
    body: (
      <div className="sx-two">
        <div><p className="sx-sub">Outcomes</p><SplitBar title="Outcomes" parts={outcomeSplit(COMPLAINTS).map((row) => ({ label: row.outcome, value: row.total }))} /></div>
        <div><p className="sx-sub">Late by category</p><BarList title="Complaints closed late by category" items={[...CATS].sort((a, b) => b.late - a.late).slice(0, 4).map((row) => ({ label: row.category, value: row.late }))} /></div>
      </div>
    ),
  },
  {
    title: 'What management should do next',
    takeaway: `${ACTIONS.length} actions, each with an owner and a date.`,
    body: (
      <table className="sx-table">
        <thead><tr><th scope="col">Action</th><th scope="col">Owner</th><th scope="col">By</th></tr></thead>
        <tbody>{ACTIONS.map((item) => <tr key={item.id}><td>{item.action}</td><td>{item.owner}</td><td>{item.due}</td></tr>)}</tbody>
      </table>
    ),
  },
];

export function BoardReport() {
  return (
    <article className="sx-report">
      <header>
        <p className="sx-kicker">Board report · {SAMPLE_PERIOD}</p>
        <h1>Complaints: what we found and what we will do</h1>
        <p className="sx-fiction">{FICTION_NOTE}</p>
      </header>
      <section>
        <h2>Executive summary</h2>
        <p>{S.total} complaints were received in the year; {S.upheldShare}% were upheld at least in part and the average case took {S.avgDays} working days against a {TARGET_DAYS}-day target. Volumes peaked in {S.peakMonth}, after the fee-schedule change. The records point to causes the firm can fix, set out below with an owner for each action.</p>
      </section>
      {SLIDES.map((slide) => (
        <section key={slide.title} className="sx-slide-print">
          <h2>{slide.title}</h2>
          <p className="sx-takeaway">{slide.takeaway}</p>
          {slide.body}
        </section>
      ))}
      <section>
        <h2>Findings in brief</h2>
        <ol className="sx-findings">{FINDINGS.map((item) => <li key={item.headline}><strong>{item.headline}.</strong> {item.evidence} <em>Next: {item.action}</em></li>)}</ol>
      </section>
      <footer className="sx-fiction">{FICTION_NOTE}</footer>
    </article>
  );
}

export function HealthReport() {
  const average = Math.round((HEALTH_SCORECARD.reduce((sum, row) => sum + row.score, 0) / HEALTH_SCORECARD.length) * 10) / 10;
  return (
    <article className="sx-report">
      <header>
        <p className="sx-kicker">Complaints Health Check · review of 15 anonymised cases</p>
        <h1>Where complaint handling is strong, and where it is not</h1>
        <p className="sx-fiction">{FICTION_NOTE}</p>
      </header>
      <section>
        <h2>Scorecard <span className="sx-avg">average {average} out of 5</span></h2>
        <ul className="sx-score">
          {HEALTH_SCORECARD.map((row) => <li key={row.area}><span>{row.area}</span><ScoreDots score={row.score} /><small>{row.note}</small></li>)}
        </ul>
      </section>
      <section>
        <h2>Top five improvements, in priority order</h2>
        <ol className="sx-recs">
          {HEALTH_RECOMMENDATIONS.map((item) => (
            <li key={item.rank}><strong>{item.title}</strong><span>{item.why}</span><small>Evidence: {item.evidence} · Effort: {item.effort} · Suggested owner: {item.owner}</small></li>
          ))}
        </ol>
      </section>
      <section>
        <h2>What I would not conclude from 15 cases</h2>
        <p>A sample this size shows patterns worth acting on. It does not prove how often each problem happens across the whole firm, and it is not a legal or regulatory opinion.</p>
      </section>
      <footer className="sx-fiction">{FICTION_NOTE}</footer>
    </article>
  );
}
