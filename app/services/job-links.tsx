import { getMenuJob } from '../offers';
import { serviceJobsForType } from './jobs';

/** Lower-case a label for mid-sentence use but keep acronyms such as MOT. */
const midSentence = (label: string) => label.replace(/[A-Za-z]+/g, (word) => (word.length > 1 && word === word.toUpperCase() ? word : word.toLowerCase()));

/** Small "Jobs I set up for <who>" block on the /for pages: link chips to the matching /services pages. */
export function JobLinks({ typeId, who, inline = false }: { typeId: string; who: string; inline?: boolean }) {
  const jobs = serviceJobsForType(typeId).slice(0, inline ? 3 : 5);
  if (!jobs.length) return null;
  const Wrap = inline ? 'div' : 'section';
  const label = midSentence(who);
  return (
    <Wrap className={inline ? 'tp-jobs' : 's-section tp-jobs'} aria-labelledby={`jobs-${typeId}-title`}>
      {inline ? <h3 id={`jobs-${typeId}-title`}>Jobs I set up for {label}</h3> : <><p className="eyebrow">From the menu</p><h2 id={`jobs-${typeId}-title`}>Jobs I set up for {label}.</h2></>}
      <ul className="tp-links">
        {jobs.map((job) => <li key={job.id}><a href={`/for#job-${job.id}`}>{getMenuJob(job.id).name} <span aria-hidden="true">→</span></a></li>)}
        <li><a href="/for#jobs">All jobs <span aria-hidden="true">→</span></a></li>
      </ul>
    </Wrap>
  );
}
