import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';

import { tabOrder } from '../../test/keyboard';
import RadioGroup from './RadioGroup.vue';

const options = [
    { value: 'month', label: 'Every month' },
    { value: 'quarter', label: 'Every quarter' },
    { value: 'year', label: 'Every year', hint: 'Often cheaper' },
];

function page(initial?: string) {
    const period = ref(initial);
    const Page = defineComponent({
        setup: () => () => [
            h('button', 'Before'),
            h(RadioGroup, {
                legend: 'How often do you pay?',
                options,
                modelValue: period.value,
                'onUpdate:modelValue': (v: string | undefined) => (period.value = v),
            }),
            h('button', 'After'),
        ],
    });
    return { period, Page };
}

describe('RadioGroup', () => {
    it('is a group named by its legend, with one radio per option', () => {
        render(page().Page);

        const group = screen.getByRole('group', { name: 'How often do you pay?' });
        expect(group.tagName).toBe('FIELDSET');
        expect(screen.getAllByRole('radio')).toHaveLength(3);
        expect(screen.getByRole('radio', { name: 'Every year', description: 'Often cheaper' })).toBeTruthy();
    });

    it('is one Tab stop, entered at the chosen option', async () => {
        const user = userEvent.setup();
        render(page('quarter').Page);

        expect(await tabOrder(user, 3)).toEqual(['button: Before', 'radio: Every quarter', 'button: After']);
    });

    it('is entered at the first option when none is chosen', async () => {
        const user = userEvent.setup();
        render(page().Page);

        expect(await tabOrder(user, 3)).toEqual(['button: Before', 'radio: Every month', 'button: After']);
    });

    it('moves and chooses with the arrow keys, wrapping at the ends', async () => {
        const user = userEvent.setup();
        const { period, Page } = page('month');
        render(Page);

        await user.click(screen.getByRole('radio', { name: 'Every month' }));
        await user.keyboard('{ArrowDown}');
        expect(period.value).toBe('quarter');
        expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Every quarter' }));

        await user.keyboard('{ArrowDown}{ArrowDown}');
        expect(period.value).toBe('month');

        await user.keyboard('{ArrowUp}');
        expect(period.value).toBe('year');
    });

    it('links its error to the group and marks every option invalid', () => {
        render(RadioGroup, { props: { legend: 'How often do you pay?', options, hint: 'Pick one', error: 'Choose how often you pay' } });

        expect(screen.getByRole('group', { name: 'How often do you pay?', description: 'Pick one Choose how often you pay' })).toBeTruthy();
        for (const radio of screen.getAllByRole('radio')) {
            expect(radio.getAttribute('aria-invalid')).toBe('true');
        }
    });

    it('keeps two groups apart', async () => {
        const user = userEvent.setup();
        render(
            defineComponent({
                setup: () => () => [
                    h(RadioGroup, { legend: 'First', options, modelValue: 'month' }),
                    h(RadioGroup, { legend: 'Second', options, modelValue: 'year' }),
                ],
            }),
        );

        await user.click(screen.getAllByRole('radio', { name: 'Every quarter' })[0]!);

        const [, , , , , secondYear] = screen.getAllByRole('radio') as HTMLInputElement[];
        expect(secondYear!.checked).toBe(true);
    });
});
