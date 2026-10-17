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
        </div>
    `,
});

describe('tabOrder', () => {
    it('lists every element Tab reaches, then body once focus leaves', async () => {
        const user = userEvent.setup();
        render(Fixture);

        expect(await tabOrder(user, 4)).toEqual(['button: Save', 'a: Cancel', 'button: Close dialog', 'body']);
    });

    it('walks backwards with Shift+Tab', async () => {
        const user = userEvent.setup();
        render(Fixture);

        expect(await tabOrder(user, 2, { shift: true })).toEqual(['button: Close dialog', 'a: Cancel']);
    });
});
