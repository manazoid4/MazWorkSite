'use client';

import { useState } from 'react';
import { DashboardSample, SlideViewer } from '../complaints/samples';
import { ChecklistSample } from '../complaints/samples-workflow';
import '../complaints/samples.css';
import './deliverables.css';

/**
 * A compact look at the actual formats, without sending a B2B visitor away
 * from the page. Every sample is invented data and labelled as such. The full
 * complaints page has the tracker, action list and downloads.
 */
const TABS = [
  { id: 'dashboard', label: 'Complaints dashboard', note: 'Filter the sample records and the figures recalculate.' },
  { id: 'board', label: 'Board paper', note: 'One headline per slide, then the evidence a board will ask for.' },
  { id: 'checklist', label: 'Staff checklist', note: 'A one-page guide a handler can follow on a busy day.' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function Deliverables() {
  const [tab, setTab] = useState<TabId>('dashboard');
  const current = TABS.find((item) => item.id === tab)!;

  return (
    <div className="b2b-deliverables">
      <div className="b2b-deliverables-top">
        <div>
          <p className="b2b-tag">Open the actual formats</p>
          <h2>See what you would receive.</h2>
        </div>
        <p>Invented sample data, real deliverable formats. Change the filter, flick through the slides and read the checklist. Nothing here is a client result.</p>
      </div>

      <div className="b2b-deliverable-tabs" role="tablist" aria-label="Sample deliverables">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`b2b-deliverable-tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls="b2b-deliverable-panel"
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="b2b-deliverable-note">{current.note}</p>
      <div id="b2b-deliverable-panel" role="tabpanel" aria-labelledby={`b2b-deliverable-tab-${tab}`} tabIndex={0}>
        {tab === 'dashboard' && <DashboardSample />}
        {tab === 'board' && <SlideViewer />}
        {tab === 'checklist' && <ChecklistSample />}
      </div>

      <p className="b2b-fine">This is the standard I build to. <a href="/complaints#board-reporting">Open the full complaints examples, tracker and downloads →</a></p>
    </div>
  );
}
