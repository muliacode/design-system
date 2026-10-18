import { render, screen } from '@testing-library/vue';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

import Link from './Link.vue';

describe('Link', () => {
    it('renders an a with the Utrecht link classes, in the same tab', () => {
        render(Link, { attrs: { href: '/privacy' }, slots: { default: 'privacy statement' } });

        const link = screen.getByRole('link', { name: 'privacy statement' });
        expect(link.getAttribute('href')).toBe('/privacy');
        expect(link.className).toBe('utrecht-link utrecht-link--html-a');
        expect(link.hasAttribute('target')).toBe(false);
        expect(link.hasAttribute('rel')).toBe(false);
        expect(link.hasAttribute('aria-current')).toBe(false);
    });

    it('opens in a new tab only with a new-tab text, and then says so in its name', () => {
        render(Link, { props: { newTabText: 'opens in a new tab' }, attrs: { href: 'https://example.org' }, slots: { default: 'Terms' } });

        const link = screen.getByRole('link', { name: 'Terms (opens in a new tab)' });
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('treats an empty new-tab text as no new tab, so it never opens one silently', () => {
        render(Link, { props: { newTabText: '' }, attrs: { href: 'https://example.org' }, slots: { default: 'Terms' } });

        const link = screen.getByRole('link', { name: 'Terms' });
        expect(link.hasAttribute('target')).toBe(false);
    });

    it('wraps the new-tab text in a span, apart from the label', () => {
        render(Link, { props: { newTabText: 'opens in a new tab' }, attrs: { href: 'https://example.org' }, slots: { default: 'Terms' } });

        const suffix = screen.getByText('(opens in a new tab)');
        expect(suffix.tagName).toBe('SPAN');
        expect(suffix.classList).toContain('mc-link__new-tab');
    });

    it('ignores a target without new-tab text, so a fallthrough target cannot open a tab silently', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        render(Link, { attrs: { href: 'https://example.org', target: '_blank', rel: 'nofollow' }, slots: { default: 'Terms' } });

        const link = screen.getByRole('link', { name: 'Terms' });
        expect(link.hasAttribute('target')).toBe(false);
        expect(link.getAttribute('rel')).toBe('nofollow');
        expect(warn.mock.calls[0]?.[0]).toContain('`target` is ignored without `newTabText`');
        warn.mockRestore();
    });

    it('does not let a fallthrough rel replace the one a new tab needs', () => {
        render(Link, {
            props: { newTabText: 'opens in a new tab' },
            attrs: { href: 'https://example.org', target: '_self', rel: 'external' },
            slots: { default: 'Terms' },
        });

        const link = screen.getByRole('link', { name: 'Terms (opens in a new tab)' });
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('marks the current page', () => {
        render(Link, { props: { current: true }, attrs: { href: '/subscriptions' }, slots: { default: 'Subscriptions' } });

        const link = screen.getByRole('link', { name: 'Subscriptions' });
        expect(link.getAttribute('aria-current')).toBe('page');
        expect(link.classList).toContain('utrecht-link--current');
    });

    it('renders the app router link given as `as`', () => {
        const RouterLink = defineComponent({
            props: { to: { type: String, required: true } },
            setup:
                (props, { slots }) =>
                () =>
                    h('a', { href: props.to, 'data-router': '' }, slots.default?.()),
        });
        render(Link, { props: { as: RouterLink }, attrs: { to: '/subscriptions' }, slots: { default: 'Subscriptions' } });

        const link = screen.getByRole('link', { name: 'Subscriptions' });
        expect(link.hasAttribute('data-router')).toBe(true);
        expect(link.classList).toContain('utrecht-link');
    });

    describe('with a router link as `as`', () => {
        // Like vue-router's RouterLink, which sets aria-current itself when active.
        const RouterLink = defineComponent({
            inheritAttrs: false,
            props: { to: { type: String, required: true }, active: Boolean },
            setup: (props, { slots, attrs }) => () =>
                h('a', { href: props.to, 'aria-current': props.active ? 'page' : null, ...attrs }, slots.default?.()),
        });

        it('leaves the router aria-current alone when `current` is off', () => {
            render(Link, { props: { as: RouterLink }, attrs: { to: '/subscriptions', active: true }, slots: { default: 'Subscriptions' } });

            expect(screen.getByRole('link', { name: 'Subscriptions' }).getAttribute('aria-current')).toBe('page');
        });

        it('passes `current` on as aria-current', () => {
            render(Link, { props: { as: RouterLink, current: true }, attrs: { to: '/subscriptions' }, slots: { default: 'Subscriptions' } });

            expect(screen.getByRole('link', { name: 'Subscriptions' }).getAttribute('aria-current')).toBe('page');
        });
    });
});
