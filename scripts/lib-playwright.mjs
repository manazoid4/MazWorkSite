// Resolve playwright the way other scripts here do: env PLAYWRIGHT, local dep, then sibling repo.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export function loadPlaywright() {
  const tries = [process.env.PLAYWRIGHT, 'playwright', 'playwright-core', 'C:/Users/Maz/repos/MazWorkSite/node_modules/playwright'].filter(Boolean);
  for (const t of tries) { try { return require(t); } catch {} }
  throw new Error('playwright not found: npm i --no-save playwright, or set PLAYWRIGHT=<path>');
}
export function loadAxe() {
  const tries = ['@axe-core/playwright', 'C:/Users/Maz/repos/MazWorkSite/node_modules/@axe-core/playwright'];
  for (const t of tries) { try { return require(t); } catch {} }
  return null;
}
export const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : d; };
