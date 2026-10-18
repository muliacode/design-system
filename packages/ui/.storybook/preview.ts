import type { Decorator, Preview } from '@storybook/vue3-vite';

import '../styles.css';
import '../dist/themes/neutral.css';

export const schemes = ['light', 'dark', 'contrast'] as const;

// The theme switcher only changes data-color-scheme, and so only token
// values: components never restyle per scheme.
const withTheme: Decorator = (story, context) => {
    const scheme = (context.globals.scheme as string | undefined) ?? 'light';
    document.documentElement.setAttribute('data-color-scheme', scheme);
    document.body.classList.add('utrecht-document', 'utrecht-document--surface', 'mc-neutral-theme');

    return {
        components: { story },
        template: '<story />',
    };
};

const preview: Preview = {
    decorators: [withTheme],
    globalTypes: {
        scheme: {
            description: 'Colour scheme of the neutral theme',
            toolbar: {
                title: 'Scheme',
                icon: 'contrast',
                items: [
                    { value: 'light', title: 'Neutral, light' },
                    { value: 'dark', title: 'Neutral, dark' },
                    { value: 'contrast', title: 'Neutral, high contrast' },
                ],
                dynamicTitle: true,
            },
        },
    },
    initialGlobals: { scheme: 'light' },
    parameters: {
        // The accessibility panel runs axe on every story; a violation is
        // an error, not a warning.
        a11y: { test: 'error' },
        backgrounds: { disable: true },
        layout: 'padded',
    },
};

export default preview;
