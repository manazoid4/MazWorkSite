import type { ReactNode } from 'react';

/**
 * Small SVG charts shared by the dashboard, the slides and the printable sample reports.
 * Plain markup only (no chart library), each with a text alternative.
 */
export function ColumnChart({ values, labels, highlight = [], title, height = 140 }: { values: readonly number[]; labels: readonly string[]; highlight?: readonly number[]; title: string; height?: number }) {
  const max = Math.max(1, ...values);
  const width = 300;
  const slot = width / values.length;
  const plot = height - 28;
  return (
    <svg className="sx-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title}: ${labels.map((label, i) => `${label} ${values[i]}`).join(', ')}.`}>
      <line x1="0" x2={width} y1={plot} y2={plot} className="sx-axis" />
      {values.map((value, i) => {
        const h = (value / max) * (plot - 16);
        const x = i * slot + slot * 0.18;
        return (
          <g key={labels[i]}>
            <rect className={highlight.includes(i) ? 'sx-bar is-hot' : 'sx-bar'} x={x} y={plot - h} width={slot * 0.64} height={h} rx="2" />
            <text className="sx-val" x={x + slot * 0.32} y={plot - h - 3} textAnchor="middle">{value}</text>
            <text className="sx-lab" x={x + slot * 0.32} y={height - 10} textAnchor="middle">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function BarList({ items, unit = '', max, title }: { items: readonly { label: string; value: number; note?: ReactNode }[]; unit?: string; max?: number; title: string }) {
  const top = max ?? Math.max(1, ...items.map((item) => item.value));
  return (
    <ul className="sx-bars" aria-label={title}>
      {items.map((item) => (
        <li key={item.label}>
          <span className="sx-bar-label">{item.label}</span>
          <span className="sx-bar-track" aria-hidden="true"><i style={{ width: `${Math.min(100, (item.value / top) * 100)}%` }} /></span>
          <strong>{item.value}{unit}</strong>
          {item.note && <small>{item.note}</small>}
        </li>
      ))}
    </ul>
  );
}

export function SplitBar({ parts, title }: { parts: readonly { label: string; value: number }[]; title: string }) {
  const total = Math.max(1, parts.reduce((sum, part) => sum + part.value, 0));
  return (
    <div>
      <div className="sx-split" role="img" aria-label={`${title}: ${parts.map((part) => `${part.label} ${part.value}`).join(', ')}.`}>
        {parts.map((part, i) => <span key={part.label} className={`is-${i}`} style={{ width: `${(part.value / total) * 100}%` }} />)}
      </div>
      <ul className="sx-legend">{parts.map((part, i) => <li key={part.label}><i className={`is-${i}`} aria-hidden="true" />{part.label}: <strong>{part.value}</strong> ({Math.round((part.value / total) * 100)}%)</li>)}</ul>
    </div>
  );
}

export function Kpi({ label, value, note }: { label: string; value: ReactNode; note?: string }) {
  return <div className="sx-kpi"><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>;
}

export function ScoreDots({ score, of = 5 }: { score: number; of?: number }) {
  return <span className="sx-dots" role="img" aria-label={`${score} out of ${of}`}>{Array.from({ length: of }, (_, i) => <i key={i} className={i < score ? 'on' : ''} />)}</span>;
}
