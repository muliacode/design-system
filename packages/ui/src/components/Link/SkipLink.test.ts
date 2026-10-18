import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
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
});
