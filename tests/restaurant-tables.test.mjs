import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

// The table-picker rules are plain TypeScript, so load them the way site-v11 loads offers.ts:
// transpile to CommonJS and run, with no build step and no .ts extension in the app imports.
const dir = path.join(process.cwd(), 'app', 'tools', 'restaurant-tables');
const modules = {};
async function load(name) {
  if (modules[name]) return modules[name];
  const source = await fs.readFile(path.join(dir, `${name}.ts`), 'utf8');
  const out = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  modules[name] = exports;
  const deps = {};
  for (const dep of ['layout-data']) if (out.includes(`./${dep}`)) deps[`./${dep}`] = await load(dep);
  new Function('exports', 'require', out)(exports, (id) => deps[id]);
  return exports;
}
const data = await load('layout-data');
const logic = await load('logic');
const layout = { floor: data.FLOOR, tables: data.TABLES, sections: data.SECTIONS, taken: data.TAKEN };

test('the example layout has 8 tables, capacities 2, 4 and 6, and three sections', () => {
  assert.equal(data.TABLES.length, 8);
  assert.deepEqual([...new Set(data.TABLES.map((t) => t.capacity))].sort(), [2, 4, 6]);
  assert.deepEqual(data.SECTIONS.map((s) => s.id).sort(), ['main', 'terrace', 'window']);
  for (const section of data.SECTIONS) assert.ok(data.TABLES.some((t) => t.section === section.id), `${section.name} has a table`);
});

test('the example layout passes its own validation', () => {
  assert.deepEqual(logic.validateLayout(layout), []);
  for (const day of data.DAYS) for (const slot of data.SLOTS) assert.ok(Array.isArray(data.TAKEN[day.id][slot]), `${day.id} ${slot} has a diary entry`);
});

test('party-size fit: too small, ok, or more than needed', () => {
  assert.equal(logic.tableFit(2, 3), 'too-small');
  assert.equal(logic.tableFit(2, 2), 'ok');
  assert.equal(logic.tableFit(4, 2), 'ok');
  assert.equal(logic.tableFit(6, 2), 'too-big');
  assert.equal(logic.tableFit(6, 4), 'ok');
  assert.equal(logic.tableFit(4, 1), 'too-big');
});

test('status: unfit beats taken, taken beats available', () => {
  const six = { id: 'M2', capacity: 6 };
  assert.equal(logic.tableStatus(six, 2, ['M2']), 'unfit');
  assert.equal(logic.tableStatus(six, 5, ['M2']), 'taken');
  assert.equal(logic.tableStatus(six, 5, []), 'available');
});

test('every party size from 1 to 6 fits at least one table, and counts always add up to 8', () => {
  for (let party = data.RULES.minParty; party <= data.RULES.maxParty; party += 1) {
    const everyone = logic.summarise(data.TABLES, party, []);
    assert.ok(everyone.available >= 1, `party of ${party} has a table when nothing is taken`);
    for (const day of data.DAYS) for (const slot of data.SLOTS) {
      const c = logic.summarise(data.TABLES, party, data.TAKEN[day.id][slot]);
      assert.equal(c.available + c.taken + c.unfit, 8);
    }
  }
});

test('the busiest example slot leaves nothing for a party of 4 (the demo can show "none free")', () => {
  assert.equal(logic.summarise(data.TABLES, 4, data.TAKEN.sat['19:30']).available, 0);
});

test('status reasons are plain words and name the party size', () => {
  const two = { id: 'W1', capacity: 2 };
  assert.match(logic.statusReason(two, 4, 'unfit'), /too small for 4/);
  assert.match(logic.statusReason({ id: 'M2', capacity: 6 }, 2, 'unfit'), /more than a party of 2 needs/);
  assert.match(logic.statusReason(two, 2, 'taken'), /Already taken/);
  assert.match(logic.statusReason(two, 2, 'available'), /good fit for your party of 2/);
});

test('rotation swaps the footprint; the rotated T2 still fits the terrace', () => {
  assert.deepEqual(logic.footprint({ shape: 'long', rotation: 0 }), { w: 5.4, h: 3.2 });
  assert.deepEqual(logic.footprint({ shape: 'long', rotation: 90 }), { w: 3.2, h: 5.4 });
});

test('validation catches the mistakes an owner could make when editing the data', () => {
  const clone = () => structuredClone(layout);
  let bad = clone(); bad.tables[1].id = 'W1';
  assert.ok(logic.validateLayout(bad).some((p) => /duplicate table id W1/.test(p)));
  bad = clone(); bad.tables[1].x = bad.tables[0].x + 1;
  assert.ok(logic.validateLayout(bad).some((p) => /W1 and W2 overlap/.test(p)));
  bad = clone(); bad.tables[0].x = 0.5;
  assert.ok(logic.validateLayout(bad).some((p) => /W1: sits outside the floor/.test(p)));
  bad = clone(); bad.tables[0].section = 'garden';
  assert.ok(logic.validateLayout(bad).some((p) => /unknown section garden/.test(p)));
  bad = clone(); bad.tables[0].capacity = 4;
  assert.ok(logic.validateLayout(bad).some((p) => /a round table seats 2, not 4/.test(p)));
  bad = clone(); bad.taken.fri['12:00'] = ['Z9'];
  assert.ok(logic.validateLayout(bad).some((p) => /unknown table Z9/.test(p)));
});

test('the picker source makes no network calls, takes no personal data and never says a booking is confirmed', async () => {
  const files = ['table-picker.tsx', 'page.tsx', 'layout-data.ts', 'logic.ts', 'plan-art.tsx'];
  for (const file of files) {
    const source = await fs.readFile(path.join(dir, file), 'utf8');
    assert.doesNotMatch(source, /\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|document\.cookie/, `${file} stays offline and stores nothing`);
    assert.doesNotMatch(source, /type="(?:email|tel)"|name="(?:email|phone|name)"|autoComplete/i, `${file} asks for no personal details`);
    assert.doesNotMatch(source, /[Cc]onfirmed|booking is made|you(?:'|’)re booked/, `${file} never claims a booking`);
  }
  const picker = await fs.readFile(path.join(dir, 'table-picker.tsx'), 'utf8');
  assert.ok(picker.includes('Interactive demo — no real reservation is made.'));
  assert.match(picker, /aria-pressed/);
  const css = await fs.readFile(path.join(dir, 'table-picker.css'), 'utf8');
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);
});
