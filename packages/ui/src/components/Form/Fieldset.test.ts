import { render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';

import Checkbox from './Checkbox.vue';
import Fieldset from './Fieldset.vue';
import FormField from './FormField.vue';

describe('Fieldset', () => {
    it('names the group with its legend and describes it with its hint and error', () => {
        render(Fieldset, {
            props: { legend: 'Remind me', hint: 'Choose any', error: 'Choose at least one' },
            slots: { default: () => [h(Checkbox, { label: 'By email' }), h(Checkbox, { label: 'In the app' })] },
        });

        const group = screen.getByRole('group', { name: 'Remind me', description: 'Choose any Choose at least one' });
        expect(group.classList).toContain('utrecht-form-fieldset--invalid');
        expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    });

    it('keeps an outer FormField from claiming the controls inside', () => {
        render(
            defineComponent({
                setup: () => () =>
                    h(FormField, { label: 'Outer', error: 'Outer error' }, () =>
                        h(Fieldset, { legend: 'Remind me' }, () => [h(Checkbox, { label: 'By email' })]),
                    ),
            }),
        );

        const box = screen.getByRole('checkbox', { name: 'By email' });
        expect(box.hasAttribute('aria-describedby')).toBe(false);
        expect(box.hasAttribute('aria-invalid')).toBe(false);
    });
});
