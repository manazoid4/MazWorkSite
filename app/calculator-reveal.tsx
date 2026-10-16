'use client';

import { useId, useState } from 'react';
import { CostCalculator, type CalculatorPreset } from './cost-calculator';

/**
 * The cost calculator behind one tap (sprint task 3), so short pages stay
 * short: only the button is in the page until a visitor asks for it.
 */
export function CalculatorReveal({ preset, trade }: { preset?: CalculatorPreset; trade?: string }) {
  const [open, setOpen] = useState(false);
  const regionId = useId();
  return (
    <div>
      <button type="button" className="ce-chip ce-reveal" aria-expanded={open} aria-controls={regionId} onClick={() => setOpen(!open)}>
        {open ? 'Hide the cost estimate' : 'What are missed calls costing you? Work it out →'}
      </button>
      <div id={regionId} hidden={!open}>
        {open ? <CostCalculator preset={preset} trade={trade} buildLink={false} /> : null}
      </div>
    </div>
  );
}
