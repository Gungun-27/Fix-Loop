// Scans each home page in scripts/sites.txt with axe-core in a real browser.
// Run from the repo root:  node scripts/scan.mjs
// Setup: npm i playwright @axe-core/playwright && npx playwright install chromium
import fs from 'node:fs';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const sites = fs.readFileSync(new URL('./sites.txt', import.meta.url), 'utf8')
  .split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#'));

if (!sites.length) {
  console.error('Add some URLs to scripts/sites.txt first.');
  process.exit(1);
}

// Rules FixLoop knows how to fix (when it can work out a name or colour).
const TARGETED = new Set(['html-has-lang', 'html-lang-valid', 'label', 'select-name', 'link-name', 'button-name', 'color-contrast']);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pct = (n, d) => (d ? Math.round((100 * n) / d) + '%' : 'n/a');
const median = a => {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y), m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

fs.mkdirSync('data', { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  ignoreHTTPSErrors: true, // some public sites have certificate problems
  bypassCSP: true,         // lets axe run on pages with a strict content security policy
  viewport: { width: 1280, height: 900 },
});

const results = [];
for (const [i, url] of sites.entries()) {
  const page = await context.newPage();
  const row = { url };
  try {
    const resp = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(1500);
    row.status = resp ? resp.status() : null;
    row.title = await page.title();
    const r = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    row.violations = r.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
    row.total = row.violations.reduce((n, v) => n + v.nodes, 0);
    row.targeted = row.violations.filter(v => TARGETED.has(v.id)).reduce((n, v) => n + v.nodes, 0);
  } catch (e) {
    row.error = String(e.message).split('\n')[0];
  }
  await page.close();
  results.push(row);
  console.log(`[${i + 1}/${sites.length}] ${url} -> ${row.error ? 'ERROR: ' + row.error : row.total + ' problems'}`);
  await sleep(2000); // be polite: one load per site, a pause between sites
}
await browser.close();

fs.writeFileSync('data/scan-results.json', JSON.stringify(results, null, 2));

const ok = results.filter(r => !r.error);
const byRule = {};
for (const r of ok) for (const v of r.violations) {
  byRule[v.id] ??= { sites: 0, nodes: 0 };
  byRule[v.id].sites++;
  byRule[v.id].nodes += v.nodes;
}
const withAny = ok.filter(r => r.total > 0).length;
const withTargeted = ok.filter(r => r.targeted > 0).length;
const top = Object.entries(byRule).sort((a, b) => b[1].sites - a[1].sites).slice(0, 10);

const md = `# Scan summary

Home pages scanned: ${ok.length} of ${results.length} (${results.length - ok.length} failed to load and are left out)

| Measure | Result |
|---|---|
| Pages with at least one detectable barrier | ${withAny} (${pct(withAny, ok.length)}) |
| Pages with a barrier in the categories FixLoop targets | ${withTargeted} (${pct(withTargeted, ok.length)}) |
| Median detectable problems per page | ${median(ok.map(r => r.total))} |

## Most common barriers

| Rule | Pages affected | Total problems |
|---|---|---|
${top.map(([id, v]) => `| ${id} | ${v.sites} (${pct(v.sites, ok.length)}) | ${v.nodes} |`).join('\n')}

This only measures what automated checks can detect on each home page, loaded once. It is a floor, not a verdict on any site.
`;
fs.writeFileSync('data/summary.md', md);
console.log('\n' + md);
