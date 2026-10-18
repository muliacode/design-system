import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

import { tabOrder } from '../../test/keyboard';
import SkipLink from './SkipLink.vue';

const Page = defineComponent({
    props: { target: { type: Object, default: () => ({}) } },
    setup: (props) => () =>
        h('div', [
            h(SkipLink, { href: '#main' }, () => 'Skip to main content'),
            h('nav', { 'aria-label': 'Main' }, [h('a', { href: '/subscriptions' }, 'Subscriptions')]),
            h('main', { id: 'main', ...props.target }, [h('a', { href: '/subscriptions/new' }, 'Add a subscription')]),
        ]),
});

describe('SkipLink', () => {
    it('is the first stop on Tab and hidden until focused', async () => {
        const user = userEvent.setup();
        render(Page);

        expect(await tabOrder(user, 1)).toEqual(['link: Skip to main content']);
        expect(screen.getByRole('link', { name: 'Skip to main content' }).classList).toContain('utrecht-skip-link--visible-on-focus');
    });

    it('moves focus to the target, so the next Tab continues inside it', async () => {
        const user = userEvent.setup();
        render(Page);

        await user.tab();
        await user.keyboard('{Enter}');

        const main = screen.getByRole('main');
        expect(document.activeElement).toBe(main);
        expect(main.getAttribute('tabindex')).toBe('-1');
        expect(await tabOrder(user, 1)).toEqual(['link: Add a subscription']);
    });

    it('keeps a tabindex the target already has', async () => {
        const user = userEvent.setup();
        render(Page, { props: { target: { tabindex: '0' } } });

        await user.click(screen.getByRole('link', { name: 'Skip to main content' }));

        expect(document.activeElement).toBe(screen.getByRole('main'));
        expect(screen.getByRole('main').getAttribute('tabindex')).toBe('0');
    });

    it('takes tabindex off the target again once focus leaves it', async () => {
        const user = userEvent.setup();
        render(Page);

        await user.click(screen.getByRole('link', { name: 'Skip to main content' }));
        expect(screen.getByRole('main').getAttribute('tabindex')).toBe('-1');

        await user.tab();

        expect(screen.getByRole('main').hasAttribute('tabindex')).toBe(false);
    });

    it('leaves the click to the browser, so the URL gets the fragment', async () => {
        const user = userEvent.setup();
        render(Page);
        const clicked = vi.fn((event: MouseEvent) => event.defaultPrevented);
        document.addEventListener('click', clicked, { once: true });

        await user.click(screen.getByRole('link', { name: 'Skip to main content' }));

        expect(clicked).toHaveReturnedWith(false);
    });

    it.each([
        ['Ctrl', '{Control>}'],
        ['Cmd', '{Meta>}'],
        ['Shift', '{Shift>}'],
    ])('does not move focus on a %s-click, which opens the link elsewhere', async (_name, key) => {
        const user = userEvent.setup();
        render(Page);

        await user.keyboard(key);
        await user.click(screen.getByRole('link', { name: 'Skip to main content' }));

        expect(screen.getByRole('main').hasAttribute('tabindex')).toBe(false);
        expect(document.activeElement).not.toBe(screen.getByRole('main'));
    });

    it('does nothing when the target is missing', async () => {
        const user = userEvent.setup();
        render(SkipLink, { props: { href: '#nowhere' }, slots: { default: 'Skip' } });

        await user.click(screen.getByRole('link', { name: 'Skip' }));

        expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Skip' }));
    });

    it('finds a target whose id is percent-encoded in the fragment', async () => {
        const user = userEvent.setup();
        render(SkipLink, { props: { href: '#main%20content' }, slots: { default: 'Skip' } });
        const target = document.createElement('main');
        target.id = 'main content';
        document.body.append(target);

        await user.click(screen.getByRole('link', { name: 'Skip' }));

        expect(document.activeElement).toBe(target);
        target.remove();
    });

    it('does not throw on a malformed fragment, and still finds a target with that id', async () => {
        const user = userEvent.setup();
        render(SkipLink, { props: { href: '#100%' }, slots: { default: 'Skip' } });
        const target = document.createElement('main');
        target.id = '100%';
        document.body.append(target);

        await user.click(screen.getByRole('link', { name: 'Skip' }));

        expect(document.activeElement).toBe(target);
        target.remove();
    });
});
