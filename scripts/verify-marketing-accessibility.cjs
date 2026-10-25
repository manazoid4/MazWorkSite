// Requires Playwright and axe-core (or AXE_SOURCE pointing to axe.min.js).
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const TARGET_URL = process.env.TARGET_URL || 'http://127.0.0.1:3107';
const ARTIFACTS = process.env.MAZ_QA_ARTIFACTS || path.join(require('node:os').tmpdir(), 'maz-works-hour-qa');
const AXE_SOURCE = process.env.AXE_SOURCE || require.resolve('axe-core/axe.min.js');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const report = [];
  try {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['/', '/3d-printing', '/demos', '/work/jobfilter', '/work/scrap-finance-partners', '/faq', '/about']) {
        await page.goto(TARGET_URL + route, { waitUntil: 'networkidle' });
        await page.locator('details').evaluateAll(details => details.forEach(detail => { detail.open = true; }));
        await page.addScriptTag({ path: AXE_SOURCE });
        const result = await page.evaluate(async () => {
          const result = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
          return {
            violations: result.violations.map(item => ({ id: item.id, impact: item.impact, help: item.help, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })),
            incomplete: result.incomplete.map(item => ({ id: item.id, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })),
          };
        });
        report.push({ route, width, ...result });
      }
    }
    fs.mkdirSync(ARTIFACTS, { recursive: true });
    fs.writeFileSync(path.join(ARTIFACTS, 'accessibility.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report.map(({ route, width, violations, incomplete }) => ({ route, width, violations, incomplete: incomplete.map(item => item.id) })), null, 2));
    assert.deepEqual(report.flatMap(page => page.violations), [], 'Automated checks must pass; incomplete results still require manual review');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
