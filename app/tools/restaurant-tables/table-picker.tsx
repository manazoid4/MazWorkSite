'use client';

import { useRef, useState } from 'react';
import { DAYS, FLOOR, RULES, SECTIONS, SLOTS, TABLES, TAKEN } from './layout-data';
import type { DayId, SlotId } from './layout-data';
import { footprint, statusReason, summarise, tableFit, tableStatus } from './logic';
import type { Status } from './logic';
import { FloorArt, PLAN_LABELS, TableGlyph, glyphViewBox } from './plan-art';
import './table-picker.css';

export const DEMO_NOTICE = 'Interactive demo — no real reservation is made.';

const PARTIES = Array.from({ length: RULES.maxParty - RULES.minParty + 1 }, (_, i) => RULES.minParty + i);
const sectionName = (id: string) => SECTIONS.find((s) => s.id === id)?.name ?? id;

/** Short word on the table itself, long phrase for screen readers and the panel. */
function shortStatus(capacity: number, party: number, status: Status) {
  if (status === 'available') return 'Free';
  if (status === 'taken') return 'Taken';
  return tableFit(capacity, party) === 'too-small' ? 'Too small' : 'Too big';
}
const spokenStatus = (status: Status) => (status === 'available' ? 'free' : status === 'taken' ? 'taken' : 'not for your party size');

function Choice<T extends string | number>({ legend, name, options, value, onChange }: {
  legend: string; name: string; options: { value: T; label: string }[]; value: T; onChange: (value: T) => void;
}) {
  return (
    <fieldset className="rt-field">
      <legend>{legend}</legend>
      <div className="rt-chips">
        {options.map((option) => (
          <label className="rt-chip" key={option.value}>
            <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function TablePicker() {
  const [day, setDay] = useState<DayId>('fri');
  const [slot, setSlot] = useState<SlotId>('19:30');
  const [party, setParty] = useState(2);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [step, setStep] = useState<'pick' | 'next'>('pick');
  const headingRef = useRef<HTMLHeadingElement>(null);

  const taken = TAKEN[day][slot];
  const counts = summarise(TABLES, party, taken);
  const selected = TABLES.find((t) => t.id === selectedId) ?? null;
  const status = selected ? tableStatus(selected, party, taken) : null;
  const dayName = DAYS.find((d) => d.id === day)?.name ?? '';
  // Any change to the visit goes back to "pick": a stale next-step screen would describe a table that may no longer fit.
  const change = <T,>(set: (value: T) => void) => (value: T) => { set(value); setStep('pick'); };

  function choose(id: string) {
    setSelectedId((current) => (current === id ? null : id));
    setStep('pick');
  }
  function reserve() {
    setStep('next');
    // Wait for the next-step panel to render, then move focus to its heading so keyboard and screen-reader users land on it.
    setTimeout(() => headingRef.current?.focus(), 0);
  }
  function startAgain() {
    setSelectedId(null);
    setStep('pick');
    setTimeout(() => headingRef.current?.focus(), 0);
  }

  return (
    <div className="rt" data-step={step}>
      <p className="rt-notice" role="note"><span className="rt-notice-dot" aria-hidden="true" />{DEMO_NOTICE}</p>

      <div className="rt-controls">
        <Choice legend="Day (example)" name="rt-day" value={day} onChange={change(setDay)} options={DAYS.map((d) => ({ value: d.id, label: d.name }))} />
        <Choice legend="Time" name="rt-time" value={slot} onChange={change(setSlot)} options={SLOTS.map((s) => ({ value: s, label: s }))} />
        <Choice legend="Party size" name="rt-party" value={party} onChange={change(setParty)} options={PARTIES.map((n) => ({ value: n, label: String(n) }))} />
      </div>

      <p className="rt-summary" role="status" aria-live="polite">
        <strong>{counts.available} of {TABLES.length} tables free</strong> for a party of {party}, {dayName} at {slot}.
        {counts.available === 0 && ' Try another time or day.'}
      </p>

      <div className="rt-grid">
        <figure className="rt-figure">
          <div className="rt-plan" style={{ aspectRatio: `${FLOOR.width} / ${FLOOR.height}` }} role="group" aria-label="Floor plan of an example cafe. Each table is a button.">
            <svg className="rt-floor" viewBox={`0 0 ${FLOOR.width * 10} ${FLOOR.height * 10}`} aria-hidden="true" focusable="false"><FloorArt /></svg>
            {PLAN_LABELS.map((label) => (
              <span key={label.text} className={`rt-label${'onDark' in label ? ' is-on-dark' : ''}`} aria-hidden="true" style={{ left: `${(label.x / FLOOR.width) * 100}%`, top: `${(label.y / FLOOR.height) * 100}%` }}>{label.text}</span>
            ))}
            {TABLES.map((table) => {
              const tableState = tableStatus(table, party, taken);
              const fp = footprint(table);
              const isSelected = table.id === selectedId;
              return (
                <button
                  key={table.id}
                  type="button"
                  className={`rt-table is-${tableState}${isSelected ? ' is-selected' : ''}`}
                  aria-pressed={isSelected}
                  aria-label={`${table.label}, seats ${table.capacity}, ${sectionName(table.section)}, ${spokenStatus(tableState)}`}
                  style={{ left: `${(table.x / FLOOR.width) * 100}%`, top: `${(table.y / FLOOR.height) * 100}%`, width: `${(fp.w / FLOOR.width) * 100}%`, height: `${(fp.h / FLOOR.height) * 100}%` }}
                  onClick={() => choose(table.id)}
                >
                  <svg viewBox={glyphViewBox(table)} aria-hidden="true" focusable="false"><TableGlyph table={table} hatch={tableState === 'taken'} /></svg>
                  <span className="rt-table-text" aria-hidden="true">
                    <b>{isSelected ? '✓ ' : ''}{table.id}</b>
                    <i>{shortStatus(table.capacity, party, tableState)}</i>
                  </span>
                </button>
              );
            })}
          </div>
          <figcaption className="rt-legend">
            <span><i className="rt-key is-available" aria-hidden="true" />Free</span>
            <span><i className="rt-key is-taken" aria-hidden="true" />Taken</span>
            <span><i className="rt-key is-unfit" aria-hidden="true" />Too small or too big for your party</span>
            <span className="rt-legend-note">Example cafe and example diary: made-up data.</span>
          </figcaption>
        </figure>

        <aside className="rt-panel" aria-labelledby="rt-panel-title">
          {step === 'pick' && (
            <>
              <h2 id="rt-panel-title" tabIndex={-1} ref={headingRef}>{selected ? selected.label : 'Your table'}</h2>
              {!selected && <p className="rt-hint">Choose a table on the plan. The words on each table say whether it is free for {party === 1 ? 'one person' : `${party} people`}.</p>}
              {selected && status && (
                <>
                  <dl className="rt-facts">
                    <div><dt>Table</dt><dd>{selected.id}</dd></div>
                    <div><dt>Seats</dt><dd>{selected.capacity}</dd></div>
                    <div><dt>Section</dt><dd>{sectionName(selected.section)}</dd></div>
                    <div><dt>Where</dt><dd>{selected.position}</dd></div>
                    <div><dt>When</dt><dd>{dayName} at {slot}, party of {party}</dd></div>
                  </dl>
                  <p className={`rt-state is-${status}`}><strong>{status === 'available' ? 'Free' : status === 'taken' ? 'Taken' : 'Not for your party size'}.</strong> {statusReason(selected, party, status)}</p>
                  <button type="button" className="button button-signal rt-action" aria-disabled={status !== 'available'} aria-describedby="rt-action-note" onClick={() => { if (status === 'available') reserve(); }}>
                    Reserve this table (demo)
                  </button>
                  <p className="rt-action-note" id="rt-action-note">{status === 'available' ? 'This only shows the next screen. Nothing is saved or sent.' : 'Pick a free table to try the next step.'}</p>
                </>
              )}
            </>
          )}
          {step === 'next' && selected && (
            <div className="rt-next">
              <h2 id="rt-panel-title" tabIndex={-1} ref={headingRef}>This is how the next step would look</h2>
              <p>Your pick: <strong>{selected.label}</strong>, {sectionName(selected.section)}, seats {selected.capacity}, for {party} on {dayName} at {slot}.</p>
              <ol>
                <li>A real version would ask for your name and a way to reach you. This demo asks for nothing.</li>
                <li>It would check the table is still free at that exact moment, before saving anything.</li>
                <li>It would then send you the details and tell the cafe. Here, nothing is saved, sent or shared.</li>
              </ol>
              <p className="rt-next-notice"><strong>{DEMO_NOTICE}</strong></p>
              <button type="button" className="rt-secondary" onClick={startAgain}>Start again</button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
