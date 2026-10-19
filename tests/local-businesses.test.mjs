import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const page = await readFile(new URL('../app/local-businesses/page.tsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../app/local-businesses/local-businesses.css', import.meta.url), 'utf8');

test('local business page has its agreed contact path, metadata, and canonical offer sources', () => {
  assert.match(page, /canonical: '\/local-businesses'/);
  assert.match(page, /id="main-content"/);
  assert.equal((page.match(/<h1\b/g) ?? []).length, 1);
  assert.match(page, /href="\/contact\?src=local-businesses"/);
  assert.match(page, /Tell me what's not working/);
  assert.match(page, /const starter = OFFERS\[0\]/);
  assert.match(page, /const system = OFFERS\[1\]/);
  assert.match(page, /const custom = OFFERS\[2\]/);
  assert.doesNotMatch(page, /£\s?\d/);
});

test('local business links point to existing trades, appointment, garage and food journeys and service pages', () => {
  for (const route of ['/for/trades', '/for/appointments', '/for/garages', '/for/cafes-and-food', '/services/missed-call', '/services/quote-follow-up', '/services/reminders', '/services/reviews']) {
    assert.ok(page.includes(`'${route}'`) || page.includes(`href="${route}"`), `expected ${route}`);
  }
});

test('page styles keep the layout mobile friendly and honour reduced motion', () => {
  assert.match(styles, /@media \(max-width: 700px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /:focus-visible/);
});
