#!/usr/bin/env node
/**
 * Run axe-core against the styleguide with a browser Playwright manages
 * itself, rather than a Selenium/ChromeDriver combination that has to match
 * whatever Chrome happens to be preinstalled on the runner.
 *
 * Fails the build (exit 1) if any violation is reported. Serious/critical
 * violations are listed first since those are the ones worth fixing before
 * the rest.
 *
 *   node scripts/check-a11y.mjs [path-to-html]
 */

import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const target = process.argv[2] ?? 'docs/design-system.html';
const url = target.startsWith('http') ? target : `file://${process.cwd()}/${target}`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.addScriptTag({ content: axeSource });

const results = await page.evaluate(async () => {
  // eslint-disable-next-line no-undef
  return axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag22aa'] } });
});
await browser.close();

const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
const violations = [...results.violations].sort(
  (a, b) => order[a.impact] - order[b.impact]
);

console.log(`${target}`);
console.log(`${results.passes.length} rules passed, ${violations.length} failed, ${results.incomplete.length} need manual review.\n`);

for (const v of violations) {
  console.log(`[${v.impact}] ${v.id} — ${v.help}`);
  console.log(`  ${v.helpUrl}`);
  for (const node of v.nodes.slice(0, 3)) {
    console.log(`  · ${node.target.join(' ')}`);
  }
  if (v.nodes.length > 3) console.log(`  · … and ${v.nodes.length - 3} more`);
  console.log('');
}

if (results.incomplete.length) {
  console.log(`Needs manual review (not counted as failures): ${results.incomplete.map((i) => i.id).join(', ')}`);
}

if (violations.length) {
  console.error(`${violations.length} accessibility violation(s). Fix or, if a false positive, exclude the specific rule with a documented reason — do not disable the check.`);
  process.exit(1);
}
