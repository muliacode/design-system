import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';

import Heading from './Heading.vue';

describe('Heading', () => {
    it.each([1, 2, 3, 4, 5, 6] as const)('renders level %i as the matching h element with its Utrecht class', (level) => {
        render(Heading, { props: { level }, slots: { default: 'Upcoming payments' } });

        const heading = screen.getByRole('heading', { level, name: 'Upcoming payments' });
        expect(heading.tagName).toBe(`H${level}`);
        expect(heading.className).toBe(`utrecht-heading-${level}`);
    });

    it('adds the distanced modifier when asked', () => {
        render(Heading, { props: { level: 2, distanced: true }, slots: { default: 'Paused' } });

        expect(screen.getByRole('heading', { level: 2 }).classList).toContain('utrecht-heading-2--distanced');
    });

    it.each([
        ['not set', {}],
        ['false', { distanced: false }],
    ])('leaves the distanced modifier off when it is %s', (_label, extra) => {
        render(Heading, { props: { level: 2, ...extra }, slots: { default: 'Paused' } });

        expect(screen.getByRole('heading', { level: 2 }).classList).not.toContain('utrecht-heading-2--distanced');
    });
});
