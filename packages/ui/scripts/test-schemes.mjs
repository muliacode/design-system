// Checks in a real browser that the nearest data-color-scheme wins, wherever
// it sits: html, body, a panel inside the page, or a theme class scoped below
// html. Custom properties resolve var() where they are declared, which only a
// browser computes faithfully, so jsdom can't stand in here.
//
// Needs dist/themes/neutral.css (npm run build) and a Chromium for Playwright
// (npx playwright install chromium).
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const css = readFileSync(new URL('../dist/themes/neutral.css', import.meta.url), 'utf8');
const tokens = JSON.parse(readFileSync(new URL('../themes/neutral.tokens.json', import.meta.url), 'utf8'));

// What a probe element should resolve to under each scheme.
const want = (scheme) => ({
    '--utrecht-document-background-color': tokens.color[scheme]['bg-document'],
    '--utrecht-form-control-border-width': tokens.width[scheme]['control-border-width'],
});

const cases = [
    ['no scheme anywhere', '<html><body class="mc-neutral-theme"><i id="probe"></i></body></html>', 'light'],
    ['scheme on html, theme class on body', '<html data-color-scheme="dark"><body class="mc-neutral-theme"><i id="probe"></i></body></html>', 'dark'],
    ['scheme on body, theme on :root', '<html><body data-color-scheme="dark"><i id="probe"></i></body></html>', 'dark'],
    ['the nearer of two schemes', '<html data-color-scheme="dark"><body class="mc-neutral-theme" data-color-scheme="contrast"><i id="probe"></i></body></html>', 'contrast'],
    ['a dark panel in a light page', '<html><body><section data-color-scheme="dark"><i id="probe"></i></section></body></html>', 'dark'],
    ['a light panel in a contrast page', '<html data-color-scheme="contrast"><body><section data-color-scheme="light"><i id="probe"></i></section></body></html>', 'light'],
    ['a scoped theme class under a dark html', '<html data-color-scheme="dark"><body><div class="mc-neutral-theme"><i id="probe"></i></div></body></html>', 'dark'],
    ...Object.keys(tokens.color).map((scheme) => [`every scheme is emitted: ${scheme}`, `<html data-color-scheme="${scheme}"><body><i id="probe"></i></body></html>`, scheme]),
];

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
const page = await browser.newPage();
let failures = 0;

for (const [name, html, scheme] of cases) {
    await page.setContent(html.replace('<body', `<head><style>${css}</style></head><body`));
    const expected = want(scheme);
    const actual = await page.evaluate((names) => {
        const style = getComputedStyle(document.getElementById('probe'));
        return Object.fromEntries(names.map((n) => [n, style.getPropertyValue(n).trim()]));
    }, Object.keys(expected));

    const wrong = Object.keys(expected).filter((n) => actual[n] !== expected[n]);
    if (wrong.length > 0) {
        failures++;
        console.error(`${name}: expected ${scheme}, got ${wrong.map((n) => `${n} = ${actual[n]}`).join(', ')}`);
    }
}

await browser.close();
if (failures > 0) {
    console.error(`\n${failures} of ${cases.length} scheme cases fail.`);
    process.exit(1);
}
console.log(`All ${cases.length} scheme cases resolve to the nearest scheme.`);
