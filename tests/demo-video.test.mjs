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

test('the standalone demo asset has captions and remains clearly labelled', async () => {
  const html = await readFile(path.join(root, 'out/index.html'), 'utf8');
  assert.doesNotMatch(html, /class="mw-home-demo"|Illustrative workflow/, 'the removed homepage workflow panel stays removed');
  const source = await readFile(path.join(root, 'app', 'walkthrough-video.tsx'), 'utf8');
  assert.match(source, /src: '\/video\/demo\.mp4'/);
  assert.match(source, /poster: '\/video\/demo-poster\.webp'/);
  assert.match(source, /captions: '\/video\/demo\.vtt'/);
  assert.match(source, /<track kind="captions" src=\{WALKTHROUGH_VIDEO\.captions\}/);
  assert.match(source, /Not a real customer/);
  assert.match(source, /preload="none"/);
});
