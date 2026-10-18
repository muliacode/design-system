import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

import Button from './Button.vue';

describe('Button', () => {
    it.each([
        ['primary', ['utrecht-button--primary-action']],
        ['secondary', ['utrecht-button--secondary-action']],
        ['subtle', ['utrecht-button--subtle']],
        ['danger', ['utrecht-button--primary-action', 'utrecht-button--danger']],
    ] as const)('renders the %s variant with its Utrecht classes', (variant, classes) => {
        render(Button, { props: { variant }, slots: { default: 'Save' } });

        const button = screen.getByRole('button', { name: 'Save' });
        expect(button.classList).toContain('utrecht-button');
        for (const name of classes) {
            expect(button.classList).toContain(name);
        }
    });

    it('is a secondary type="button" by default, so it never submits a form by accident', () => {
        render(Button, { slots: { default: 'Save' } });

        const button = screen.getByRole('button', { name: 'Save' });
        expect(button.getAttribute('type')).toBe('button');
        expect(button.classList).toContain('utrecht-button--secondary-action');
        expect(button.hasAttribute('aria-disabled')).toBe(false);
    });

    it('emits click when pressed with a mouse, Enter or Space', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(Button, { props: { onClick }, slots: { default: 'Save' } });

        await user.click(screen.getByRole('button', { name: 'Save' }));
        await user.keyboard('{Enter}');
        await user.keyboard(' ');

        expect(onClick).toHaveBeenCalledTimes(3);
    });

    describe.each([
        ['disabled', { disabled: true }],
        ['loading', { loading: true }],
    ])('when %s', (_state, props) => {
        it('stays focusable and is announced as unavailable', async () => {
            const user = userEvent.setup();
            render(Button, { props, slots: { default: 'Save' } });

            await user.tab();

            const button = screen.getByRole('button', { name: 'Save' });
            expect(document.activeElement).toBe(button);
            expect(button.getAttribute('aria-disabled')).toBe('true');
            expect(button.hasAttribute('disabled')).toBe(false);
        });

        it('emits no click', async () => {
            const user = userEvent.setup();
            const onClick = vi.fn();
            render(Button, { props: { ...props, onClick }, slots: { default: 'Save' } });

            await user.click(screen.getByRole('button', { name: 'Save' }));
            await user.keyboard('{Enter}');

            expect(onClick).not.toHaveBeenCalled();
        });

        it('does not submit its form, by click or by Enter in a field', async () => {
            const user = userEvent.setup();
            const onSubmit = vi.fn((event: Event) => event.preventDefault());
            render(
                defineComponent({
                    setup: () => () =>
                        h('form', { onSubmit }, [
                            h('label', ['Name ', h('input', { name: 'name' })]),
                            h(Button, { type: 'submit', ...props }, () => 'Save'),
                        ]),
                }),
            );

            await user.click(screen.getByRole('button', { name: 'Save' }));
            await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Netflix{Enter}');

            expect(onSubmit).not.toHaveBeenCalled();
        });
    });

    it('submits its form when type is submit', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn((event: Event) => event.preventDefault());
        render(
            defineComponent({
                setup: () => () => h('form', { onSubmit }, [h(Button, { type: 'submit' }, () => 'Save')]),
            }),
        );

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(onSubmit).toHaveBeenCalledOnce();
    });

    it('shows the loading text in place of the label while loading', () => {
        render(Button, { props: { loading: true, loadingText: 'Saving…' }, slots: { default: 'Save' } });

        const button = screen.getByRole('button', { name: 'Saving…' });
        expect(button.classList).toContain('utrecht-button--busy');
    });

    it('keeps its label while loading without a loading text', () => {
        render(Button, { props: { loading: true }, slots: { default: 'Save' } });

        expect(screen.getByRole('button', { name: 'Save' }).classList).toContain('utrecht-button--busy');
    });
});
