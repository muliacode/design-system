import { configureAxe } from 'vitest-axe';

// jsdom does no layout or painting, so axe cannot check contrast here. The
// theme's colour pairs are checked by scripts/validate-contrast.mjs instead.
export const axe = configureAxe({
    rules: {
        'color-contrast': { enabled: false },
    },
});
