import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';

import FormField from './FormField.vue';
import Select from './Select.vue';
import Textarea from './Textarea.vue';
import Textbox from './Textbox.vue';

function field(control: unknown, fieldProps: { label: string; hint?: string; error?: string; required?: boolean }, controlProps: Record<string, unknown> = {}, children?: () => unknown) {
    return defineComponent({
        setup: () => () => h(FormField, fieldProps, () => h(control as never, controlProps, children)),
    });
}

describe.each([
    ['Textbox', Textbox, 'textbox', undefined],
    ['Textarea', Textarea, 'textbox', undefined],
    ['Select', Select, 'combobox', () => [h('option', { value: 'month' }, 'Every month'), h('option', { value: 'year' }, 'Every year')]],
] as const)('FormField with %s', (_name, control, role, children) => {
    it('names the control with its visible label', () => {
        render(field(control, { label: 'Name' }, {}, children));

        expect(screen.getByRole(role, { name: 'Name' })).toBeTruthy();
    });

    it('describes the control with its hint', () => {
        render(field(control, { label: 'Name', hint: 'As on your bank statement' }, {}, children));

        const input = screen.getByRole(role, { name: 'Name', description: 'As on your bank statement' });
        expect(input.hasAttribute('aria-invalid')).toBe(false);
    });

    it('links the error message to the control and marks it invalid', () => {
        render(field(control, { label: 'Name', hint: 'As on your bank statement', error: 'Enter a name' }, {}, children));

        const input = screen.getByRole(role, { name: 'Name', description: 'As on your bank statement Enter a name' });
        expect(input.getAttribute('aria-invalid')).toBe('true');
        expect(input.className).toContain('--invalid');
        expect(document.getElementById(input.getAttribute('aria-describedby')!.split(' ')[1]!)!.textContent).toBe('Enter a name');
    });

    it('passes required to the control', () => {
        render(field(control, { label: 'Name', required: true }, {}, children));

        expect((screen.getByRole(role, { name: 'Name' }) as HTMLInputElement).required).toBe(true);
    });

    it('keeps an aria-describedby the control has of its own', () => {
        render(field(control, { label: 'Name', error: 'Enter a name' }, { 'aria-describedby': 'extra' }, children));

        const input = screen.getByRole(role, { name: 'Name' });
        expect(input.getAttribute('aria-describedby')!.split(' ')).toContain('extra');
        expect(input.getAttribute('aria-describedby')!.split(' ')).toHaveLength(2);
    });
});

describe('FormField', () => {
    it('gives every field its own ids', () => {
        render(
            defineComponent({
                setup: () => () => [
                    h(FormField, { label: 'Name', error: 'Enter a name' }, () => h(Textbox)),
                    h(FormField, { label: 'Email', error: 'Enter an email' }, () => h(Textbox, { type: 'email' })),
                ],
            }),
        );

        expect(screen.getByRole('textbox', { name: 'Name', description: 'Enter a name' })).toBeTruthy();
        expect(screen.getByRole('textbox', { name: 'Email', description: 'Enter an email' })).toBeTruthy();
    });

    it('updates the description when the error appears and goes', async () => {
        const error = ref<string | undefined>(undefined);
        render(defineComponent({ setup: () => () => h(FormField, { label: 'Name', error: error.value }, () => h(Textbox)) }));

        error.value = 'Enter a name';
        await Promise.resolve();
        expect(screen.getByRole('textbox', { name: 'Name', description: 'Enter a name' }).getAttribute('aria-invalid')).toBe('true');

        error.value = undefined;
        await Promise.resolve();
        expect(screen.getByRole('textbox', { name: 'Name' }).hasAttribute('aria-describedby')).toBe(false);
    });
});

describe('controls', () => {
    it('bind their value with v-model', async () => {
        const user = userEvent.setup();
        const name = ref('Net');
        const period = ref('month');
        render(
            defineComponent({
                setup: () => () => [
                    h(FormField, { label: 'Name' }, () => h(Textbox, { modelValue: name.value, 'onUpdate:modelValue': (v: string) => (name.value = v) })),
                    h(FormField, { label: 'Period' }, () =>
                        h(Select, { modelValue: period.value, 'onUpdate:modelValue': (v: string) => (period.value = v) }, () => [
                            h('option', { value: 'month' }, 'Every month'),
                            h('option', { value: 'year' }, 'Every year'),
                        ]),
                    ),
                ],
            }),
        );

        await user.type(screen.getByRole('textbox', { name: 'Name' }), 'flix');
        await user.selectOptions(screen.getByRole('combobox', { name: 'Period' }), 'Every year');

        expect(name.value).toBe('Netflix');
        expect(period.value).toBe('year');
    });

    it('can be marked invalid outside a field, and keep their own attributes', () => {
        render(Textbox, { props: { invalid: true }, attrs: { 'aria-label': 'Search', id: 'q', autocomplete: 'off' } });

        const input = screen.getByRole('textbox', { name: 'Search' });
        expect(input.id).toBe('q');
        expect(input.getAttribute('aria-invalid')).toBe('true');
        expect(input.getAttribute('autocomplete')).toBe('off');
    });
});
