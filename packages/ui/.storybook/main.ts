import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.ts'],
    addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
    framework: '@storybook/vue3-vite',
    // No usage data leaves a contributor's machine or CI.
    core: { disableTelemetry: true },
};

export default config;
