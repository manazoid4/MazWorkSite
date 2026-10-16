// SUPERSEDED (14 Oct 2026): the homepage clip now comes from the private maz-works-brag-room repo.
// Running this overwrites public/video/demo.* with the old 30 second clip.
// Renders the 30 second demo (missed call -> instant text -> booked) from code:
//   node scripts/render-demo-video.mjs
// Needs Playwright (Chromium) and ffmpeg (with libx264 + libwebp) on the machine; neither is a
// repo dependency. Re-render on a machine with the same fonts so the text does not reflow.
// Output: public/video/demo.mp4 (720p H.264, no audio, under 2 MB), demo-poster.webp, demo.vtt.
// Change the words in scripts/demo-video/scene.html AND CUES below, then re-run.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
  execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
} catch {
  console.error('Needs Playwright and ffmpeg: npm i --no-save playwright && npx playwright install chromium, plus ffmpeg on PATH.');
  process.exit(1);
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'video');
const FPS = 24;
const SECONDS = 30;
const POSTER_AT = 20.2; // "Booked" with all three steps lit: the clearest still
const MAX_BYTES = 2 * 1024 * 1024;

// Same words as the on-screen captions in scene.html, as a WebVTT file for screen readers.
const CUES = [
  [0, 4, 'A customer rings while you are on a job.'],
  [4, 9, 'You cannot answer. The call is missed.'],
  [9, 15, 'A text goes out on its own: sorry we missed you, book a time here.'],
  [15, 21, 'They pick a time that suits them.'],
  [21, 26, 'It lands in your diary. No chasing, no phone tag.'],
  [26, 30, 'Missed call. Instant text. Booked. Get my free demo at mazworks.uk. This is an example, not a real customer.'],
];
const stamp = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}.000`;

mkdirSync(out, { recursive: true });
const frames = mkdtempSync(path.join(tmpdir(), 'mw-demo-'));
try {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(path.join(root, 'scripts', 'demo-video', 'scene.html')).href);
    const total = FPS * SECONDS;
    for (let i = 0; i < total; i++) {
      await page.evaluate((t) => window.seek(t), i / FPS);
      await page.screenshot({ path: path.join(frames, `f${String(i).padStart(4, '0')}.png`) });
    }
    await page.evaluate((t) => window.seek(t), POSTER_AT);
    await page.screenshot({ path: path.join(frames, 'poster.png') });
  } finally {
    await browser.close();
  }
  // High profile, level 4.0 (few reference frames) so older Android phones decode it too.
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, 'f%04d.png'),
    '-c:v', 'libx264', '-preset', 'veryslow', '-profile:v', 'high', '-level', '4.0', '-crf', '30', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', '-an', path.join(out, 'demo.mp4')]);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(frames, 'poster.png'), '-quality', '80', path.join(out, 'demo-poster.webp')]);
} finally {
  rmSync(frames, { recursive: true, force: true });
}
writeFileSync(path.join(out, 'demo.vtt'), `WEBVTT\n\n${CUES.map(([a, b, text], i) => `${i + 1}\n${stamp(a)} --> ${stamp(b)}\n${text}\n`).join('\n')}`);
const size = statSync(path.join(out, 'demo.mp4')).size;
console.log(`demo.mp4 ${(size / 1024).toFixed(0)} KB`);
if (size > MAX_BYTES) throw new Error('demo.mp4 is over 2 MB: raise the CRF or lower FPS');
