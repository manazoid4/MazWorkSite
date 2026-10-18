'use client';

import { useEffect, useRef, useState } from 'react';
import { safeText } from '../receptionist-demo/engine.mjs';
import { DEMO_BUSINESS, SCENARIOS } from './content';

/**
 * "Play an example call": pick a caller, watch the call, see the summary the
 * owner gets. Type a business name and the greeting answers as it, so the
 * visitor hears it answer as them with no phone line and no microphone. Runs
 * in the browser, no real call and no data sent.
 * Without JavaScript (or with reduced motion) the whole first call shows.
 */
export function CallDemo() {
  const [active, setActive] = useState(SCENARIOS[0].id);
  const [shown, setShown] = useState(99);
  const [playing, setPlaying] = useState(false);
  const [rawName, setRawName] = useState('');
  const timer = useRef<number | undefined>(undefined);
  const scenario = SCENARIOS.find((item) => item.id === active) ?? SCENARIOS[0];
  const total = scenario.lines.length + 1; // the lines, then the summary
  const name = safeText(rawName, 40).trim();
  const asBusiness = (text: string) => (name ? text.split(DEMO_BUSINESS).join(name) : text);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const play = (id: string) => {
    window.clearTimeout(timer.current);
    setActive(id);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(99); setPlaying(false); return; }
    setPlaying(true);
    setShown(1);
    const count = (SCENARIOS.find((item) => item.id === id) ?? SCENARIOS[0]).lines.length + 1;
    const step = (n: number) => {
      setShown(n);
      if (n < count) timer.current = window.setTimeout(() => step(n + 1), 1300);
      else setPlaying(false);
    };
    timer.current = window.setTimeout(() => step(2), 1300);
  };

  return (
    <div className="ah-demo">
      <label className="ah-demo-name">
        <span>Answer as your business <em>optional</em></span>
        <input
          type="text"
          name="business"
          value={rawName}
          maxLength={40}
          placeholder={DEMO_BUSINESS}
          autoComplete="organization"
          onChange={(event) => setRawName(event.target.value)}
        />
        <small>Type a name and the greeting below uses it. It stays in your browser.</small>
      </label>
      <div className="ah-demo-picks" role="group" aria-label="Choose an example call">
        {SCENARIOS.map((item) => (
          <button key={item.id} type="button" className="ah-pick" aria-pressed={item.id === active} onClick={() => play(item.id)}>
            <span>{item.label}</span><small>{item.time}</small>
          </button>
        ))}
      </div>
      <div className="ah-demo-stage">
        <ol className="ah-transcript" aria-live="polite" aria-label={`Example call: ${scenario.label}`}>
          {scenario.lines.slice(0, Math.min(shown, scenario.lines.length)).map((line, index) => (
            <li key={`${scenario.id}-${index}`} className={`ah-line ah-line-${line.who}`}>
              <span className="ah-who">{line.who === 'desk' ? 'Receptionist' : 'Caller'}</span>
              <span className="ah-said">{asBusiness(line.text)}</span>
            </li>
          ))}
          {playing && shown < scenario.lines.length ? <li className="ah-typing" aria-hidden="true"><i /><i /><i /></li> : null}
        </ol>
        <div className={`ah-summary${shown >= total ? ' is-on' : ''}${scenario.summary.flag ? ' is-urgent' : ''}`} aria-hidden={shown < total}>
          <span className="ah-mail-label">Emailed to the owner · {scenario.time}</span>
          <strong>{scenario.summary.title}</strong>
          <dl>{scenario.summary.rows.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
          {scenario.summary.flag ? <p className="ah-flag">{scenario.summary.flag}</p> : null}
        </div>
      </div>
      <p className="ah-demo-note">{name ? `Example script, shown answering as ${name}. Nothing is recorded or sent, and the name stays in your browser.` : 'Example calls for a made-up garage, played in your browser. Nothing is recorded or sent.'}</p>
    </div>
  );
}
