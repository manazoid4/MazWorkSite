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
  assert.match(vtt, /^WEBVTT\n/);
  assert.match(vtt, /not a real customer/);
  assert.doesNotMatch(vtt, /\bAI\b|£/);
});

test('the homepage plays the demo with a poster, captions and an example label', async () => {
  const html = await readFile(path.join(root, 'out/index.html'), 'utf8');
  const figure = html.slice(html.indexOf('id="demo-video"'), html.indexOf('</figure>', html.indexOf('id="demo-video"')));
  assert.ok(figure.length > 0, 'homepage has no #demo-video');
  assert.match(figure, /src="\/video\/demo\.mp4"/);
  assert.match(figure, /poster="\/video\/demo-poster\.webp"/);
  assert.match(figure, /kind="captions" src="\/video\/demo\.vtt"/);
  assert.match(figure, /preload="none"/);
  assert.match(figure, /not a real customer/i);
});
