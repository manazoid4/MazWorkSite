import { RULES } from './layout-data';
import type { DayId, Section, SlotId, Table, TableShape } from './layout-data';

/** Pure rules for the table picker: no React, no DOM, no clock. Tested in tests/restaurant-tables.test.mjs. */

export type Status = 'available' | 'taken' | 'unfit';
export type Fit = 'ok' | 'too-small' | 'too-big';

/** Table size on the plan in cells, chairs included, before rotation. Each shape seats one capacity. */
export const SHAPES: Record<TableShape, { w: number; h: number; seats: number }> = {
  round: { w: 3.4, h: 3.4, seats: 2 },
  square: { w: 3.6, h: 3.6, seats: 4 },
  long: { w: 5.4, h: 3.2, seats: 6 },
};

export function footprint(table: Pick<Table, 'shape' | 'rotation'>) {
  const { w, h } = SHAPES[table.shape];
  return table.rotation === 90 ? { w: h, h: w } : { w, h };
}

export function tableFit(capacity: number, party: number): Fit {
  if (capacity < party) return 'too-small';
  return capacity - party > RULES.maxSpareSeats ? 'too-big' : 'ok';
}

/** "Not for your party" wins over "taken": a table that never fits is not worth explaining as busy. */
export function tableStatus(table: Pick<Table, 'id' | 'capacity'>, party: number, takenIds: readonly string[]): Status {
  if (tableFit(table.capacity, party) !== 'ok') return 'unfit';
  return takenIds.includes(table.id) ? 'taken' : 'available';
}

/** Plain-words reason shown in the panel, so status never relies on colour or pattern alone. */
export function statusReason(table: Pick<Table, 'id' | 'capacity'>, party: number, status: Status): string {
  if (status === 'available') return `A good fit for your party of ${party}.`;
  if (status === 'taken') return 'Already taken at this time in the example diary.';
  return tableFit(table.capacity, party) === 'too-small'
    ? `Seats ${table.capacity}, too small for ${party}.`
    : `Seats ${table.capacity}, more than a party of ${party} needs.`;
}

export function summarise(tables: readonly Pick<Table, 'id' | 'capacity'>[], party: number, takenIds: readonly string[]) {
  const counts = { available: 0, taken: 0, unfit: 0 };
  for (const table of tables) counts[tableStatus(table, party, takenIds)] += 1;
  return counts;
}

type Layout = {
  floor: { width: number; height: number };
  tables: readonly Table[];
  sections: readonly Section[];
  taken: Record<DayId, Record<SlotId, string[]>>;
};

/** Returns a list of problems; empty means the layout is safe to draw. Run it after every data edit. */
export function validateLayout(layout: Layout): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const sectionIds = new Set(layout.sections.map((s) => s.id));
  for (const t of layout.tables) {
    if (ids.has(t.id)) problems.push(`duplicate table id ${t.id}`);
    ids.add(t.id);
    if (!sectionIds.has(t.section)) problems.push(`${t.id}: unknown section ${t.section}`);
    if (SHAPES[t.shape].seats !== t.capacity) problems.push(`${t.id}: a ${t.shape} table seats ${SHAPES[t.shape].seats}, not ${t.capacity}`);
    const { w, h } = footprint(t);
    if (t.x - w / 2 < 0 || t.y - h / 2 < 0 || t.x + w / 2 > layout.floor.width || t.y + h / 2 > layout.floor.height) problems.push(`${t.id}: sits outside the floor`);
  }
  const list = [...layout.tables];
  for (let i = 0; i < list.length; i += 1) {
    for (let j = i + 1; j < list.length; j += 1) {
      const a = footprint(list[i]);
      const b = footprint(list[j]);
      if (Math.abs(list[i].x - list[j].x) < (a.w + b.w) / 2 && Math.abs(list[i].y - list[j].y) < (a.h + b.h) / 2) problems.push(`${list[i].id} and ${list[j].id} overlap`);
    }
  }
  for (const [day, slots] of Object.entries(layout.taken)) {
    for (const [slot, takenIds] of Object.entries(slots)) {
      for (const id of takenIds) if (!ids.has(id)) problems.push(`${day} ${slot}: unknown table ${id}`);
    }
  }
  return problems;
}
