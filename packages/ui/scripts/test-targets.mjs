// Checks in a real browser that every control meets the 44 by 44 px minimum
// target in every colour scheme, even with a one-letter label. Link is not
// measured: it is for links in running text, which are exempt (WCAG 2.5.8), and
// standalone links use ButtonLink. jsdom does no layout, so this can't be a
// unit test.
//
// Needs dist/themes/neutral.css (npm run build) and a Chromium for Playwright
// (npx playwright install chromium).
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const utrecht = readFileSync(require.resolve('@utrecht/component-library-css/dist/index.css'), 'utf8');
const theme = readFileSync(new URL('../dist/themes/neutral.css', import.meta.url), 'utf8');
const tokens = JSON.parse(readFileSync(new URL('../themes/neutral.tokens.json', import.meta.url), 'utf8'));
const min = Number.parseFloat(tokens.dimension['target-min']);

// The markup each component renders, as in its tests.
const targets = {
    'Button primary': '<button type="button" class="utrecht-button utrecht-button--primary-action">X</button>',
    'Button secondary': '<button type="button" class="utrecht-button utrecht-button--secondary-action">X</button>',
    'Button subtle': '<button type="button" class="utrecht-button utrecht-button--subtle">X</button>',
    'Button danger': '<button type="button" class="utrecht-button utrecht-button--primary-action utrecht-button--danger">X</button>',
    'Button disabled': '<button type="button" class="utrecht-button utrecht-button--primary-action utrecht-button--disabled" aria-disabled="true">X</button>',
    'ButtonLink primary': '<a href="#" class="utrecht-button-link utrecht-button-link--html-a utrecht-button-link--primary-action">X</a>',
    'ButtonLink secondary': '<a href="#" class="utrecht-button-link utrecht-button-link--html-a utrecht-button-link--secondary-action">X</a>',
    'ButtonLink subtle': '<a href="#" class="utrecht-button-link utrecht-button-link--html-a utrecht-button-link--subtle">X</a>',
    // Measured hidden and focused: it can only be seen and clicked once focused.
    'SkipLink': '<a href="#main" class="utrecht-skip-link utrecht-skip-link--visible-on-focus">X</a>',
};
// Targets that are also measured with focus on them.
const alsoFocused = new Set(['SkipLink']);

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
const page = await browser.newPage();
let failures = 0;
let checked = 0;

for (const scheme of Object.keys(tokens.color)) {
    const body = Object.entries(targets)
        .map(([name, html], i) => `<p>${html.replace(/^<(\w+)/, `<$1 data-target="${i}" data-name="${name}"`)}</p>`)
        .join('');
    await page.setContent(
        `<html data-color-scheme="${scheme}"><head><style>${utrecht}</style><style>${theme}</style></head><body class="mc-neutral-theme utrecht-document">${body}</body></html>`,
    );
    const measure = (suffix) =>
        page.$$eval(
            '[data-target]',
            (elements, suffix) =>
                elements.map((element) => {
                    const box = element.getBoundingClientRect();
                    return { name: element.dataset.name + suffix, width: box.width, height: box.height };
                }),
            suffix,
        );
    const sizes = await measure('');
    for (const [i, name] of Object.keys(targets).entries()) {
        if (alsoFocused.has(name)) {
            await page.focus(`[data-target="${i}"]`);
            sizes.push(...(await measure(' (focused)')).filter((size) => size.name === `${name} (focused)`));
        }
    }
    for (const { name, width, height } of sizes) {
        checked++;
        if (width < min || height < min) {
            failures++;
            console.error(`${name}, ${scheme}: ${width} by ${height} px, needs at least ${min} by ${min}`);
        }
    }
}

await browser.close();
if (failures > 0) {
    console.error(`\n${failures} of ${checked} targets are too small.`);
    process.exit(1);
}
console.log(`All ${checked} targets are at least ${min} by ${min} px.`);
