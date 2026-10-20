import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const picker = await readFile('app/solutions/solutions-picker.tsx', 'utf8');
const styles = await readFile('app/solutions/solutions.css', 'utf8');

test('solutions use a plain-language chooser instead of the playful tap prompt', () => {
  assert.match(picker, /Browse by what you need to improve/);
  assert.match(picker, /aria-label="Browse solutions"/);
  assert.doesNotMatch(picker, /Tap the one that sounds like you|Pick your problem/);
});

test('solution options read as clean, scannable rows with an accessible active state', () => {
  assert.match(styles, /grid-template-columns: 1fr/);
  assert.match(styles, /border-bottom: 1px solid/);
  assert.match(styles, /aria-current='true'.*color: #171715/);
  assert.match(styles, /focus-visible.*outline: 3px solid/);
  assert.doesNotMatch(styles, /box-shadow: 3px 3px 0 var\(--ink\)/);
});
