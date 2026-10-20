import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const contact = await readFile(new URL('../app/contact/page.tsx', import.meta.url), 'utf8');
const form = await readFile(new URL('../app/demo-request-form.tsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../app/sales.css', import.meta.url), 'utf8');

test('contact puts the form directly after a short introduction and keeps call and email secondary', () => {
  assert.match(contact, /id="main-content"/);
  assert.match(contact, /Tell me what needs to work better/);
  assert.match(contact, /CHECK_REPLY_TIME/);
  assert.match(contact, /Book a 15-minute call/);
  assert.match(contact, /Email \{CONTACT_EMAIL\}/);
  assert.ok(contact.indexOf('<DemoRequestForm') > contact.indexOf('mw-contact-alternatives'));
  assert.doesNotMatch(contact, /ALL_OFFERS|BIGGER_JOBS|free-plan\?src=contact/);
});

test('contact keeps required answers, optional service selection and the preserved recovery path', () => {
  for (const field of ['name', 'email', 'problem']) assert.match(form, new RegExp(`name="${field}"[\\s\\S]{0,240}?required`));
  assert.match(form, /name="service"/);
  assert.match(form, /readServiceFromLocation\(\)/);
  assert.match(form, /setFailureReason\(result\.reason\)/);
  assert.match(form, /Nothing you typed has been lost/);
  assert.match(form, /send it by email instead/);
  assert.match(form, /website enquiries, a clearer team dashboard, or help tracking deadlines and complaints/i);
});

test('contact styles keep the introduction compact on small screens', () => {
  assert.match(styles, /\.mw-contact-landing \{ padding-top: clamp\(24px, 4vw, 48px\); \}/);
  assert.match(styles, /\.mw-contact-landing \.s-check-copy h1/);
});
