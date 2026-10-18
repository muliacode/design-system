import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Checkbox from './Checkbox.vue';
import Fieldset from './Fieldset.vue';

const meta = {
    title: 'Forms/Checkbox',
    component: Checkbox,
    args: { label: 'Remind me before it renews', hint: '', error: '' },
    render: (args) => ({
        components: { Checkbox },
        setup: () => ({ args }),
        template: '<Checkbox v-bind="args" />',
    }),
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: 'A week before, by email' } };

export const WithError: Story = { args: { label: 'I have read the terms', error: 'Confirm you have read the terms' } };

/** Several checkboxes on one question, in a fieldset whose legend asks it. */
export const InFieldset: Story = {
    render: () => ({
        components: { Checkbox, Fieldset },
        template: `
            <Fieldset legend="How should we remind you?" hint="Choose any">
                <Checkbox label="By email" />
                <Checkbox label="In the app" />
            </Fieldset>
        `,
    }),
};
