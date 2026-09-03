#!/usr/bin/env node
/**
 * Verify every declared contrast pairing still meets its WCAG 2.2 threshold.
 *
 * This runs in CI. A palette change that quietly drops a pairing below AA
 * fails the build rather than shipping — which is the whole point of putting
 * accessibility in the tokens instead of in a checklist.
 *
 *   node scripts/validate-contrast.mjs
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { theme } = JSON.parse(readFileSync(join(ROOT, 'dist/tokens.json'), 'utf8'));
const pairs = JSON.parse(readFileSync(join(ROOT, 'contrast.config.json'), 'utf8'));

/* WCAG relative luminance */
const channel = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`not a hex colour: ${hex}`);
  const n = parseInt(m[1], 16);
  return 0.2126 * channel(n >> 16 & 255) + 0.7152 * channel(n >> 8 & 255) + 0.0722 * channel(n & 255);
};
const ratio = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const resolve = (t, token) => {
  const v = theme[t][token];
  if (!v) throw new Error(`unknown token "${token}" in ${t} theme`);
  return v;
};

let failed = 0, checked = 0;
const rows = [];

for (const p of pairs.pairings) {
  for (const t of ['dark', 'light']) {
    const r = ratio(resolve(t, p.fg), resolve(t, p.bg));
    const ok = r >= p.min;
    checked++;
    if (!ok) failed++;
    rows.push([ok ? 'PASS' : 'FAIL', t.padEnd(5), p.name.padEnd(38),
               r.toFixed(2).padStart(6), `>= ${p.min}`]);
  }
}

/* Chart series must clear 3:1 against their own background (WCAG 1.4.11) */
for (const t of ['dark', 'light']) {
  for (let i = 1; i <= 8; i++) {
    const r = ratio(resolve(t, `chart-categorical-${i}`), resolve(t, 'surface-app'));
    const ok = r >= 3;
    checked++;
    if (!ok) failed++;
    rows.push([ok ? 'PASS' : 'FAIL', t.padEnd(5), `chart series ${i} on app background`.padEnd(38),
               r.toFixed(2).padStart(6), '>= 3']);
  }
}

for (const r of rows) console.log(`${r[0]}  ${r[1]}  ${r[2]}  ${r[3]}  ${r[4]}`);
console.log(`\n${checked - failed}/${checked} pairings pass.`);

if (failed) {
  console.error(`\n${failed} contrast pairing(s) below threshold. Adjust the token or the threshold — do not silence this.`);
  process.exit(1);
}
