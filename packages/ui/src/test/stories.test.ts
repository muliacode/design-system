import { composeStories } from '@storybook/vue3-vite';
import { render } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';

import { axe } from './axe';

// Every story of every component, found by file name, so a new component's
// stories are checked without registering them here.
const modules = import.meta.glob<Record<string, unknown>>('../components/**/*.stories.ts', { eager: true });

describe.each(Object.entries(modules))('%s', (_path, module) => {
    const stories = Object.entries(composeStories(module as Parameters<typeof composeStories>[0]));

    it.each(stories)('%s has no axe violations', async (_name, Story) => {
        const { container } = render(Story);

        expect(await axe(container)).toHaveNoViolations();
    });
});
