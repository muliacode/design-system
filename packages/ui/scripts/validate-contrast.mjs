// Fails when a colour pair of the neutral theme drops below its WCAG contrast
// threshold, in any colour scheme. The pairs and thresholds are declared in
// contrast.config.json; the colours come from themes/neutral.tokens.json.
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const tokens = JSON.parse(readFileSync(new URL('themes/neutral.tokens.json', root), 'utf8'));
const config = JSON.parse(readFileSync(new URL('contrast.config.json', root), 'utf8'));

// WCAG 2.2 relative luminance and contrast ratio.
export function luminance(hex) {
    const channels = hex.replace('#', '').match(/../g).map((part) => parseInt(part, 16) / 255);
    const [r, g, b] = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function ratio(a, b) {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (light + 0.05) / (dark + 0.05);
}

let failures = 0;

// A scheme or kind without a threshold would make every comparison false and
// every pair pass, so a missing threshold is a failure in itself.
for (const { kind } of config.pairs) {
    if (!(kind in config.thresholds)) {
        console.error(`Unknown kind "${kind}" in contrast.config.json; known kinds: ${Object.keys(config.thresholds).join(', ')}`);
        process.exit(1);
    }
}
for (const scheme of Object.keys(tokens.color)) {
    for (const [kind, byScheme] of Object.entries(config.thresholds)) {
        if (typeof byScheme[scheme] !== 'number') {
            console.error(`contrast.config.json has no ${kind} threshold for the ${scheme} scheme`);
            failures++;
        }
    }
}
if (failures > 0) {
    process.exit(1);
}

for (const [scheme, colours] of Object.entries(tokens.color)) {
    for (const { fg, bg, kind } of config.pairs) {
        if (!(fg in colours) || !(bg in colours)) {
            console.error(`${scheme}: ${fg} on ${bg} names a colour the theme doesn't define`);
            failures++;
            continue;
        }
        const needed = config.thresholds[kind][scheme];
        const actual = ratio(colours[fg], colours[bg]);
        if (actual < needed) {
            console.error(`${scheme}: ${fg} on ${bg} is ${actual.toFixed(2)}:1, needs ${needed}:1 (${kind})`);
            failures++;
        }
    }
}

if (failures > 0) {
    console.error(`\n${failures} contrast pair(s) fail.`);
    process.exit(1);
}
console.log(`All ${config.pairs.length} pairs pass in ${Object.keys(tokens.color).length} colour schemes.`);
