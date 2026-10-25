import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = 4173;
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['scripts/serve-static.mjs'], {
  cwd: projectRoot,
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let serverOutput = '';
server.stdout.on('data', (chunk) => { serverOutput += chunk.toString(); });
server.stderr.on('data', (chunk) => { serverOutput += chunk.toString(); });

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      await delay(100);
    }
  }
  throw new Error(`Static server did not start.\n${serverOutput}`);
}

async function assertRoute(route, contentType) {
  const response = await fetch(`${baseUrl}${route}`);
  if (!response.ok) throw new Error(`${route} returned ${response.status}`);
  const actualType = response.headers.get('content-type') ?? '';
  if (!actualType.includes(contentType)) {
    throw new Error(`${route} returned ${actualType}, expected ${contentType}`);
  }
  return response.text();
}

try {
  await waitForServer();
  const home = await assertRoute('/', 'text/html');
  const mazos = await assertRoute('/mazos', 'text/html');
  await assertRoute('/robots.txt', 'text/plain');
  await assertRoute('/sitemap.xml', 'application/xml');
  await assertRoute('/social-card.png', 'image/png');
  await assertRoute('/agent-nudge-demo.webp', 'image/webp');
  await assertRoute('/jobfilter-scan-result.webp', 'image/webp');
  await assertRoute('/jobfilter-scan-result-mobile.webp', 'image/webp');

  if (!home.includes('JobFilter')) {
    throw new Error('Homepage smoke check did not find the featured-project copy.');
  }
  if (!mazos.includes('This page has moved')) {
    throw new Error('Legacy /mazos handoff smoke check failed.');
  }
  console.log('Local static HTML and asset smoke checks passed.');
} finally {
  server.kill();
}
