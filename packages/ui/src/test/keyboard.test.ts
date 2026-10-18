import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';

import { tabOrder } from './keyboard';

const Fixture = defineComponent({
    template: `
        <div>
            <button type="button">Save</button>
            <span>Not focusable</span>
            <a href="#cancel">Cancel</a>
            <button type="button" aria-label="Close dialog">×</button>
            <label>Amount <input type="number"></label>
            <button type="button" aria-label="">Empty label falls back to text</button>
        </div>
    `,
});

describe('tabOrder', () => {
    it('lists every element Tab reaches, then body once focus leaves', async () => {
        const user = userEvent.setup();
        render(Fixture);

        expect(await tabOrder(user, 6)).toEqual([
            'button: Save',
            'link: Cancel',
            'button: Close dialog',
            'spinbutton: Amount',
            'button: Empty label falls back to text',
            'body',
        ]);
    });

    it('walks backwards with Shift+Tab', async () => {
        const user = userEvent.setup();
        render(Fixture);

        expect(await tabOrder(user, 2, { shift: true })).toEqual(['button: Empty label falls back to text', 'spinbutton: Amount']);
    });
});
