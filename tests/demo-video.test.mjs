import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();

// Task 4 (7 Oct): the 22 second demo rendered from code by scripts/render-demo-video.mjs.
test('the demo video, poster and captions exist and the video stays under 2 MB', async () => {
  const video = await stat(path.join(root, 'public/video/demo.mp4'));
  assert.ok(video.size > 50_000 && video.size <= 2 * 1024 * 1024, `demo.mp4 is ${video.size} bytes`);
  await stat(path.join(root, 'public/video/demo-poster.webp'));
  const vtt = await readFile(path.join(root, 'public/video/demo.vtt'), 'utf8');
  assert.match(vtt, /^WEBVTT\r?\n/);
  assert.match(vtt, /not a real customer/);
  assert.doesNotMatch(vtt, /\bAI\b|£/);
});

test('the editorial homepage uses real project work rather than a generic autoplay demo', async () => {
  const html = await readFile(path.join(root, 'out/index.html'), 'utf8');
  assert.match(html, /scrap-finance-partners\.webp/);
  assert.match(html, /jobfilter-home\.webp/);
  assert.doesNotMatch(html, /autoplay/);
  assert.doesNotMatch(html, /id="demo-video"/);
});
