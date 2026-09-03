#!/usr/bin/env node
/**
 * Every var(--token) referenced in index.css must actually be defined by
 * @muliacode/tokens. This is what would have caught, automatically, the
 * gap where the Tailwind layer forgot to map --border-control after it
 * was added upstream — instead of that surfacing later as a missing style
 * someone had to notice by eye.
 *
 *   node scripts/verify.mjs
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const layer = readFileSync(join(ROOT, 'index.css'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, ''); // strip comments — prose may contain illustrative var(...) calls
const tokensCss = readFileSync(join(ROOT, '..', 'tokens', 'dist', 'tokens.css'), 'utf8');

const defined = new Set([...tokensCss.matchAll(/--([\w-]+):/g)].map((m) => m[1]));
const referenced = [...new Set([...layer.matchAll(/var\(--([\w-]+)\)/g)].map((m) => m[1]))];

const missing = referenced.filter((t) => !defined.has(t));

console.log(`${referenced.length} token references checked against @muliacode/tokens.`);

if (missing.length) {
  console.error(`\n${missing.length} referenced token(s) do not exist in @muliacode/tokens:`);
  for (const t of missing) console.error(`  --${t}`);
  console.error('\nEither the token was renamed/removed upstream and this layer is stale, or it was never added. Fix before publishing.');
  process.exit(1);
}

console.log('All referenced tokens resolve.');
