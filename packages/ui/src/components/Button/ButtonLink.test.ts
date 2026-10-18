import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';

import ButtonLink from './ButtonLink.vue';

describe('ButtonLink', () => {
    it.each([
        ['primary', 'utrecht-button-link--primary-action'],
        ['secondary', 'utrecht-button-link--secondary-action'],
        ['subtle', 'utrecht-button-link--subtle'],
    ] as const)('renders the %s variant as a link with its Utrecht classes', (variant, modifier) => {
        render(ButtonLink, { props: { variant }, attrs: { href: '/subscriptions/new' }, slots: { default: 'Add a subscription' } });

        const link = screen.getByRole('link', { name: 'Add a subscription' });
        expect(link.tagName).toBe('A');
        expect(link.getAttribute('href')).toBe('/subscriptions/new');
        expect(link.classList).toContain('utrecht-button-link');
        expect(link.classList).toContain('utrecht-button-link--html-a');
        expect(link.classList).toContain(modifier);
    });

    it('renders the app router link given as `as`, passing it every attribute', () => {
        const RouterLink = defineComponent({
            props: { to: { type: String, required: true } },
            setup:
                (props, { slots }) =>
                () =>
                    h('a', { href: props.to, 'data-router': '' }, slots.default?.()),
        });
        render(ButtonLink, { props: { as: RouterLink, variant: 'primary' }, attrs: { to: '/subscriptions/new' }, slots: { default: 'Add a subscription' } });

        const link = screen.getByRole('link', { name: 'Add a subscription' });
        expect(link.hasAttribute('data-router')).toBe(true);
        expect(link.getAttribute('href')).toBe('/subscriptions/new');
        expect(link.classList).toContain('utrecht-button-link--primary-action');
    });
});
