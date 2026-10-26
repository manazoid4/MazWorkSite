// Mobile (390px) lab check of the SEO landing pages: LCP, CLS, page weight, horizontal overflow, axe violations.
// Needs a running static export: `npm run build && node scripts/serve-static.mjs 4173`, then `node scripts/seo-vitals.mjs`.
// Lab numbers on localhost are indicative only; real Core Web Vitals come from Search Console / Vercel Speed Insights.
import { loadAxe, loadPlaywright, arg } from './lib-playwright.mjs';

const base = arg('base', 'http://127.0.0.1:4173');
const routes = arg('routes', '/,/one-page-website,/missed-call-text-back,/website-cost,/prices').split(',');
const { chromium } = loadPlaywright();
const axeModule = loadAxe();
const AxeBuilder = axeModule?.AxeBuilder ?? axeModule?.default;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
let failed = false;
for (const route of routes) {
  const page = await context.newPage();
  const errors = [];
  let bytes = 0;
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', async (response) => { try { bytes += (await response.body()).length; } catch { /* redirects have no body */ } });
  await page.addInitScript(() => {
    window.__vitals = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => { for (const entry of list.getEntries()) window.__vitals.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__vitals.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(base + route, { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  const result = await page.evaluate(() => ({ ...window.__vitals, overflow: document.documentElement.scrollWidth > window.innerWidth + 1 }));
  let violations = [];
  if (AxeBuilder) violations = (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations.map((v) => `${v.id} (${v.nodes.length})`);
  const ok = result.lcp < 2500 && result.cls < 0.1 && !result.overflow && !errors.length && !violations.length;
  if (!ok) failed = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${route.padEnd(24)} LCP ${Math.round(result.lcp)}ms  CLS ${result.cls.toFixed(3)}  ${(bytes / 1024).toFixed(0)}kB  overflow:${result.overflow}  console errors:${errors.length}  axe:${AxeBuilder ? violations.join(',') || 'clean' : 'not installed'}`);
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
