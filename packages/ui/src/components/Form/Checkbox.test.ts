import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';

import Checkbox from './Checkbox.vue';

describe('Checkbox', () => {
    it('is named by its label, toggles with a click on the label or Space, and binds v-model', async () => {
        const user = userEvent.setup();
        const checked = ref(false);
        render(defineComponent({ setup: () => () => h(Checkbox, { label: 'Remind me', modelValue: checked.value, 'onUpdate:modelValue': (v: boolean) => (checked.value = v) }) }));

        await user.click(screen.getByText('Remind me'));
        expect(checked.value).toBe(true);

        await user.keyboard(' ');
        expect(checked.value).toBe(false);
        expect(document.activeElement).toBe(screen.getByRole('checkbox', { name: 'Remind me' }));
    });

    it('links its hint and error and marks itself invalid', () => {
        render(Checkbox, { props: { label: 'I agree', hint: 'You can change this later', error: 'Agree to continue' } });

        const box = screen.getByRole('checkbox', { name: 'I agree', description: 'You can change this later Agree to continue' });
        expect(box.getAttribute('aria-invalid')).toBe('true');
    });
});
