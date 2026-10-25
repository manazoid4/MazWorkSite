import { FLOOR, SECTIONS, TABLES } from './layout-data';
import type { Table } from './layout-data';
import { footprint } from './logic';
import './plan-art.css';

/** 1 cell = 10 SVG units everywhere in the plan. */
export const U = 10;

/** Text labels drawn as HTML on top of the plan, so they keep a readable size on a phone. Positions are cell centres. */
export const PLAN_LABELS = [
  { text: 'Window', x: 6.2, y: 4.9 },
  { text: 'Main floor', x: 9, y: 12.4 },
  { text: 'Terrace', x: 16, y: 1.1 },
  { text: 'Counter', x: 3.2, y: 15.3, onDark: true },
  { text: 'Entrance', x: 8, y: 15.3 },
  { text: 'Door', x: 13.7, y: 9 },
] as const;

/** One table and its chairs, centred on (0,0). Rotation is applied here; the caller positions the group. */
export function TableGlyph({ table, hatch = false }: { table: Pick<Table, 'shape' | 'rotation'>; hatch?: boolean }) {
  const top = hatch ? { style: { fill: 'url(#rt-hatch)' } } : {};
  return (
    <g transform={`rotate(${table.rotation})`}>
      {table.shape === 'round' && <>
        <rect className="rt-chair" x={-5.5} y={-17} width={11} height={5} rx={2} />
        <rect className="rt-chair" x={-5.5} y={12} width={11} height={5} rx={2} />
        <circle className="rt-top" r={10} {...top} />
      </>}
      {table.shape === 'square' && <>
        <rect className="rt-chair" x={-5.5} y={-18} width={11} height={5} rx={2} />
        <rect className="rt-chair" x={-5.5} y={13} width={11} height={5} rx={2} />
        <rect className="rt-chair" x={-18} y={-5.5} width={5} height={11} rx={2} />
        <rect className="rt-chair" x={13} y={-5.5} width={5} height={11} rx={2} />
        <rect className="rt-top" x={-11} y={-11} width={22} height={22} rx={3} {...top} />
      </>}
      {table.shape === 'long' && <>
        {[-10, 10].map((cx) => <rect className="rt-chair" key={`t${cx}`} x={cx - 5.5} y={-16} width={11} height={5} rx={2} />)}
        {[-10, 10].map((cx) => <rect className="rt-chair" key={`b${cx}`} x={cx - 5.5} y={11} width={11} height={5} rx={2} />)}
        <rect className="rt-chair" x={-27} y={-5.5} width={5} height={11} rx={2} />
        <rect className="rt-chair" x={22} y={-5.5} width={5} height={11} rx={2} />
        <rect className="rt-top" x={-20} y={-9} width={40} height={18} rx={3} {...top} />
      </>}
    </g>
  );
}

/** Zones, walls, glass, counter and plants. Decorative: the buttons carry the meaning. */
export function FloorArt() {
  const w = FLOOR.width * U;
  const h = FLOOR.height * U;
  return (
    <>
      <defs>
        <pattern id="rt-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect className="rt-hatch-bg" width="6" height="6" />
          <line className="rt-hatch-line" x1="0" y1="0" x2="0" y2="6" />
        </pattern>
      </defs>
      <rect className="rt-floor-base" width={w} height={h} />
      {SECTIONS.map((s) => <rect key={s.id} className={`rt-zone rt-zone--${s.id}`} x={s.area.x * U} y={s.area.y * U} width={s.area.w * U} height={s.area.h * U} />)}
      <path className="rt-wall" d="M0 0H125M0 0V160M0 160H100M120 160H125M125 0V80M125 100V160" />
      <path className="rt-door" d="M125 80V100M100 160A20 20 0 0 1 120 140" />
      {[10, 50, 90].map((x) => <rect key={x} className="rt-glass" x={x} y={0} width={30} height={3} rx={1} />)}
      <rect className="rt-counter" x={5} y={146} width={55} height={14} rx={2} />
      {[[194, 10], [194, 150], [132, 150], [132, 10]].map(([cx, cy]) => <g key={`${cx}-${cy}`}><circle className="rt-plant" cx={cx} cy={cy} r={6} /><circle className="rt-plant-core" cx={cx} cy={cy} r={2.5} /></g>)}
    </>
  );
}

/** Small decorative plan for the home page: same data as the picker, no interaction. */
export function MiniPlan() {
  return (
    <svg className="rt-mini" viewBox={`0 0 ${FLOOR.width * U} ${FLOOR.height * U}`} aria-hidden="true" focusable="false">
      <FloorArt />
      {TABLES.map((t) => <g key={t.id} className="rt-mini-table" transform={`translate(${t.x * U} ${t.y * U})`}><TableGlyph table={t} /></g>)}
    </svg>
  );
}

/** viewBox for a single table's own SVG, sized to its footprint. */
export function glyphViewBox(table: Pick<Table, 'shape' | 'rotation'>) {
  const { w, h } = footprint(table);
  return `${-w * U / 2} ${-h * U / 2} ${w * U} ${h * U}`;
}
