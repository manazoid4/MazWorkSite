import './home-visuals.css';
import { KitIcon } from './kit-icon';

/** One row of the "Today / Set up" graphic: the owner's pain, the menu job that fixes it, what happens instead. */
export type ChangeRow = { key: string; icon: string; before: string; name: string; after: string };

/**
 * Before / after graphic, shared by the homepage and the trade pages.
 * Pass three rows. Examples of what changes, never client results.
 */
export function BeforeAfter({ rows }: { rows: readonly ChangeRow[] }) {
  return (
    <div className="hv-ba">
      <div className="hv-col hv-before"><h3>Today</h3><ul>{rows.map(c => <li key={c.key}><span className="hv-icon" aria-hidden="true"><KitIcon name={c.icon} size={22} /></span>{c.before}</li>)}</ul></div>
      <span className="hv-arrow" aria-hidden="true">↓</span>
      <div className="hv-col hv-after"><h3>Set up</h3><ul>{rows.map(c => <li key={c.key}><span className="hv-icon" aria-hidden="true"><KitIcon name={c.icon} size={22} /></span><span><strong>{c.name}</strong>{c.after}</span></li>)}</ul></div>
    </div>
  );
}
