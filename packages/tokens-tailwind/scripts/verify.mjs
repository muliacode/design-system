#!/usr/bin/env node
/**
 * Two checks, both guarding against silent breakage rather than loud
 * breakage — Tailwind v4 drops a utility whose theme variable is missing
 * without warning, so nothing here fails at build time on its own.
 *
 *   1. Every var(--token) referenced by this package must actually be
 *      defined by @muliacode/tokens. This is what would have caught,
 *      automatically, the gap where the Tailwind layer forgot to map
 *      --border-control after it was added upstream.
 *
 *   2. Every colour name shadcn hardcodes must be defined by shadcn.css.
 *      A name we don't map is a component that renders unstyled, which is
 *      how the shadcn integration failed the first time: only bg-primary
 *      worked, because --color-primary was the single name the two
 *      vocabularies already shared.
 *
 *   node scripts/verify.mjs
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Prose in these files contains illustrative var(...) calls and class
// names, so comments are stripped before anything is extracted.
const read = (f) => readFileSync(join(ROOT, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

const LAYERS = ['index.css', 'shadcn.css'];
const sources = Object.fromEntries(LAYERS.map((f) => [f, read(f)]));

const tokensCss = readFileSync(join(ROOT, '..', 'tokens', 'dist', 'tokens.css'), 'utf8');
const defined = new Set([...tokensCss.matchAll(/--([\w-]+):/g)].map((m) => m[1]));

let failed = false;

/* ---- 1. Every referenced token exists upstream ---------------------- */

let checked = 0;

for (const file of LAYERS) {
  const referenced = [...new Set([...sources[file].matchAll(/var\(--([\w-]+)\)/g)].map((m) => m[1]))]
    // Tailwind's own namespaces are declared by this package, not by
    // @muliacode/tokens, so a self-reference like --radius-xl: var(--radius-lg)
    // is resolved by Tailwind and correctly absent from tokens.css.
    .filter((t) => !/^(radius|color|font|text|spacing|breakpoint|shadow|ease)-/.test(t) || defined.has(t));

  checked += referenced.length;
  const missing = referenced.filter((t) => !defined.has(t));

  if (missing.length) {
    failed = true;
    console.error(`\n${file}: ${missing.length} referenced token(s) do not exist in @muliacode/tokens:`);
    for (const t of missing) console.error(`  --${t}`);
  }
}

console.log(`${checked} token references checked against @muliacode/tokens.`);

/* ---- 2. The shadcn contract is complete ----------------------------- */

// The class names shadcn bakes into vendored component source. Adding a
// name here without mapping it in shadcn.css fails this check, which is
// the point: it turns "that component renders unstyled" into a red build.
const SHADCN_CONTRACT = [
  'background', 'foreground',
  'card', 'card-foreground',
  'popover', 'popover-foreground',
  'primary', 'primary-foreground',
  'secondary', 'secondary-foreground',
  'muted', 'muted-foreground',
  'accent', 'accent-foreground',
  'destructive', 'destructive-foreground',
  'border', 'input', 'ring',
  'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
  'sidebar', 'sidebar-foreground',
  'sidebar-primary', 'sidebar-primary-foreground',
  'sidebar-accent', 'sidebar-accent-foreground',
  'sidebar-border', 'sidebar-ring',
];

// shadcn.css imports index.css, so a name mapped in either satisfies the
// contract — the chart ramp is mapped upstream in index.css.
const mapped = new Set(
  LAYERS.flatMap((f) => [...sources[f].matchAll(/--color-([\w-]+)\s*:/g)].map((m) => m[1])),
);

const unmapped = SHADCN_CONTRACT.filter((n) => !mapped.has(n));

console.log(`${SHADCN_CONTRACT.length} shadcn colour names checked against shadcn.css.`);

if (unmapped.length) {
  failed = true;
  console.error(`\n${unmapped.length} shadcn colour name(s) are not mapped, so those utilities will not be generated:`);
  for (const n of unmapped) console.error(`  --color-${n}`);
}

if (failed) {
  console.error('\nEither a token was renamed/removed upstream and this layer is stale, or a mapping was never added. Fix before publishing.');
  process.exit(1);
}

console.log('All referenced tokens resolve. shadcn contract is complete.');
