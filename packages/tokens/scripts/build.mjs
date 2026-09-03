#!/usr/bin/env node
/**
 * Build design tokens into every platform target.
 *
 * Deliberately zero-dependency. A token package sits at the root of every
 * other repository, so its own supply chain should be as close to empty as
 * possible. Node's standard library is enough.
 *
 *   node scripts/build.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

mkdirSync(DIST, { recursive: true });

const read = (f) => JSON.parse(readFileSync(join(SRC, f), 'utf8'));
const src = Object.fromEntries(
  readdirSync(SRC).filter((f) => f.endsWith('.json')).map((f) => [f.replace('.json', ''), read(f)])
);

/* ---------- flatten DTCG to { path: value } ---------- */
function flatten(node, prefix = [], out = {}) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) out[[...prefix, k].join('-')] = v.$value;
    else if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, [...prefix, k], out);
  }
  return out;
}

const themes = {
  light: {
    ...flatten(src['color.primitive'].gray.light, ['gray']),
    ...flatten(src['color.semantic.light']),
    ...flatten(src.chart.light, ['chart']),
  },
  dark: {
    ...flatten(src['color.primitive'].gray.dark, ['gray']),
    ...flatten(src['color.semantic.dark']),
    ...flatten(src.chart.dark, ['chart']),
  },
};

const shared = {
  ...flatten(src.typography, ['font']),
  ...flatten(src.space, ['space']),
  ...flatten(src.shape),
  ...flatten(src.motion),
};

/* ---------- CSS custom properties ---------- */
const banner = `/* ${pkg.name} v${pkg.version} — GENERATED, do not edit.
   Source: packages/tokens/src/*.json   Build: npm run build */\n`;

const cssBlock = (obj) =>
  Object.entries(obj).map(([k, v]) => `  --${k}: ${v};`).join('\n');

const css = `${banner}
:root, [data-theme="dark"] {
${cssBlock(themes.dark)}
  color-scheme: dark;
}

[data-theme="light"] {
${cssBlock(themes.light)}
  color-scheme: light;
}

:root {
${cssBlock(shared)}
}

@media (prefers-reduced-motion: reduce) {
  :root { --duration-micro: 1ms; --duration-panel: 1ms; }
  *, *::before, *::after {
    animation-duration: 1ms !important;
    transition-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
`;
writeFileSync(join(DIST, 'tokens.css'), css);

/* ---------- SCSS ---------- */
writeFileSync(
  join(DIST, '_tokens.scss'),
  banner + Object.entries({ ...themes.dark, ...shared })
    .map(([k, v]) => `$${k}: ${v};`).join('\n') + '\n'
);

/* ---------- JSON (resolved, flat) ---------- */
const json = {
  $meta: { name: pkg.name, version: pkg.version, license: pkg.license,
           accessibility: 'WCAG 2.2 AA', generated: 'do not edit' },
  theme: themes, shared, cli: src.cli,
};
writeFileSync(join(DIST, 'tokens.json'), JSON.stringify(json, null, 2));

/* ---------- JS + TypeScript declarations ---------- */
writeFileSync(
  join(DIST, 'tokens.js'),
  `${banner}export const theme = ${JSON.stringify(themes, null, 2)};
export const shared = ${JSON.stringify(shared, null, 2)};
export const cli = ${JSON.stringify(src.cli, null, 2)};
export default { theme, shared, cli };
`);

writeFileSync(
  join(DIST, 'tokens.d.ts'),
  `${banner}export type ThemeName = 'light' | 'dark';
export type ColorToken = ${Object.keys(themes.dark).map((k) => `'${k}'`).join(' | ')};
export type SharedToken = ${Object.keys(shared).map((k) => `'${k}'`).join(' | ')};
export declare const theme: Record<ThemeName, Record<ColorToken, string>>;
export declare const shared: Record<SharedToken, string>;
export declare const cli: {
  status: Record<string, { ansi: string; mark: string }>;
  exitCode: Record<string, number>;
  rules: string[];
};
declare const _default: { theme: typeof theme; shared: typeof shared; cli: typeof cli };
export default _default;
`);

/* ---------- Swift ---------- */
const swiftName = (k) => k.replace(/-(\w)/g, (_, c) => c.toUpperCase());
const hexToSwift = (v) => {
  const m = /^#([0-9a-f]{6})$/i.exec(v.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return `Color(red: ${((n >> 16 & 255) / 255).toFixed(3)}, green: ${((n >> 8 & 255) / 255).toFixed(3)}, blue: ${((n & 255) / 255).toFixed(3)})`;
};
const swiftLines = (obj) => Object.entries(obj)
  .map(([k, v]) => { const c = hexToSwift(v); return c ? `    static let ${swiftName(k)} = ${c}` : null; })
  .filter(Boolean).join('\n');
writeFileSync(join(DIST, 'Tokens.swift'), `${banner.replace(/\/\*|\*\//g, '//')}
import SwiftUI

public enum MuliaTokens {
  public enum Dark {
${swiftLines(themes.dark)}
  }
  public enum Light {
${swiftLines(themes.light)}
  }
  public enum Space {
${Object.entries(shared).filter(([k]) => k.startsWith('space-'))
    .map(([k, v]) => `    static let ${swiftName(k)}: CGFloat = ${parseFloat(v)}`).join('\n')}
  }
}
`);

/* ---------- Kotlin ---------- */
const ktLines = (obj) => Object.entries(obj)
  .filter(([, v]) => /^#[0-9a-f]{6}$/i.test(v.trim()))
  .map(([k, v]) => `    val ${swiftName(k)} = Color(0xFF${v.trim().slice(1).toUpperCase()})`).join('\n');
writeFileSync(join(DIST, 'Tokens.kt'), `${banner.replace(/\/\*|\*\//g, '//')}
package dev.mulia.tokens

import androidx.compose.ui.graphics.Color

object MuliaTokens {
  object Dark {
${ktLines(themes.dark)}
  }
  object Light {
${ktLines(themes.light)}
  }
}
`);

/* ---------- CLI (ANSI names, no hex) ---------- */
writeFileSync(join(DIST, 'cli.json'), JSON.stringify(src.cli, null, 2));

const counts = {
  colour: Object.keys(themes.dark).length,
  shared: Object.keys(shared).length,
};
console.log(`built ${counts.colour} colour tokens x 2 themes, ${counts.shared} shared tokens`);
console.log('→', readdirSync(DIST).sort().join('  '));
