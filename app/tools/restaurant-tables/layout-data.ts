/**
 * Example cafe layout for the table-picker demo. Everything the picker draws or
 * decides comes from this file, so rearranging tables, adding a section or
 * changing who is booked is a data edit, not a code change.
 *
 * Units: positions are in grid CELLS on a FLOOR.width x FLOOR.height plan.
 * x and y are the CENTRE of the table (chairs included in its footprint).
 * Labelled demonstration data: this cafe and these bookings do not exist.
 */

export type SectionId = 'window' | 'main' | 'terrace';
export type Capacity = 2 | 4 | 6;
export type TableShape = 'round' | 'square' | 'long';
/** Only quarter turns that keep the footprint on the grid. */
export type Rotation = 0 | 90;
export type DayId = 'fri' | 'sat' | 'sun';
export type SlotId = '12:00' | '13:30' | '18:00' | '19:30' | '20:30';

export type Section = {
  id: SectionId;
  name: string;
  blurb: string;
  /** Plan rectangle in cells, for drawing the tinted zone. */
  area: { x: number; y: number; w: number; h: number };
};

export type Table = {
  id: string;
  label: string;
  capacity: Capacity;
  section: SectionId;
  shape: TableShape;
  x: number;
  y: number;
  rotation: Rotation;
  /** Plain-words position, shown in the selected-table panel. */
  position: string;
};

export type Day = { id: DayId; name: string };

export const FLOOR = { width: 20, height: 16 } as const;

/** A party fits a table when the table seats them with at most this many spare seats. */
export const RULES = { maxSpareSeats: 2, minParty: 1, maxParty: 6 } as const;

export const SECTIONS: Section[] = [
  { id: 'window', name: 'Window', blurb: 'The bright row along the front glass.', area: { x: 0, y: 0, w: 12.5, h: 4.9 } },
  { id: 'main', name: 'Main floor', blurb: 'Central and lively, close to the counter.', area: { x: 0, y: 4.9, w: 12.5, h: 11.1 } },
  { id: 'terrace', name: 'Terrace', blurb: 'Outdoors, through the side door.', area: { x: 12.5, y: 0, w: 7.5, h: 16 } },
];

export const TABLES: Table[] = [
  { id: 'W1', label: 'Table W1', capacity: 2, section: 'window', shape: 'round', x: 2.2, y: 2.4, rotation: 0, position: 'Window seat at the far left, beside the first pane of glass.' },
  { id: 'W2', label: 'Table W2', capacity: 2, section: 'window', shape: 'round', x: 6.2, y: 2.4, rotation: 0, position: 'Window seat in the middle of the front glass.' },
  { id: 'W3', label: 'Table W3', capacity: 4, section: 'window', shape: 'square', x: 10.3, y: 2.4, rotation: 0, position: 'Window table at the right-hand end, next to the wall to the terrace.' },
  { id: 'M1', label: 'Table M1', capacity: 4, section: 'main', shape: 'square', x: 3, y: 7.4, rotation: 0, position: 'Left side of the main floor, a little back from the window.' },
  { id: 'M2', label: 'Table M2', capacity: 6, section: 'main', shape: 'long', x: 9, y: 7.6, rotation: 0, position: 'Centre of the main floor. A long table for bigger groups.' },
  { id: 'M3', label: 'Table M3', capacity: 4, section: 'main', shape: 'square', x: 3.2, y: 12, rotation: 0, position: 'Bottom left, right beside the counter.' },
  { id: 'T1', label: 'Table T1', capacity: 2, section: 'terrace', shape: 'round', x: 16.2, y: 4, rotation: 0, position: 'Terrace, near the top corner, in the open air.' },
  { id: 'T2', label: 'Table T2', capacity: 6, section: 'terrace', shape: 'long', x: 16.6, y: 11.6, rotation: 90, position: 'Terrace, a long table running down the right-hand side.' },
];

export const DAYS: Day[] = [
  { id: 'fri', name: 'Friday' },
  { id: 'sat', name: 'Saturday' },
  { id: 'sun', name: 'Sunday' },
];

export const SLOTS: SlotId[] = ['12:00', '13:30', '18:00', '19:30', '20:30'];

/**
 * Per day and time slot: the tables already taken in this EXAMPLE diary.
 * Anything not listed is free. A real system would read this from its bookings.
 */
export const TAKEN: Record<DayId, Record<SlotId, string[]>> = {
  fri: { '12:00': ['W2'], '13:30': ['M2', 'T1'], '18:00': ['W1', 'W3', 'M1'], '19:30': ['W2', 'M2', 'M3', 'T2'], '20:30': ['W1', 'M1'] },
  sat: { '12:00': ['W1', 'W3', 'T1'], '13:30': ['W1', 'W2', 'M2', 'M3', 'T2'], '18:00': ['W2', 'M1', 'M2', 'T1'], '19:30': ['W1', 'W2', 'W3', 'M1', 'M2', 'M3', 'T1', 'T2'], '20:30': ['W3', 'M2', 'T2'] },
  sun: { '12:00': [], '13:30': ['M1'], '18:00': ['T1'], '19:30': ['W3', 'M2'], '20:30': [] },
};
