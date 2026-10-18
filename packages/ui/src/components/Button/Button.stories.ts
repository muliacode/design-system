import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Button from './Button.vue';

const meta = {
    title: 'Actions/Button',
    component: Button,
    args: { variant: 'secondary', type: 'button', disabled: false, loading: false },
    argTypes: {
        variant: { control: { type: 'select' }, options: ['primary', 'secondary', 'subtle', 'danger'] },
        type: { control: { type: 'select' }, options: ['button', 'submit', 'reset'] },
        disabled: { control: 'boolean' },
        loading: { control: 'boolean' },
        loadingText: { control: 'text' },
    },
    render: (args) => ({
        components: { Button },
        setup: () => ({ args }),
        template: '<Button v-bind="args">Save</Button>',
    }),
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Subtle: Story = { args: { variant: 'subtle' } };

/** For actions that destroy something, such as deleting a household. */
export const Danger: Story = {
    args: { variant: 'danger' },
    render: (args) => ({
        components: { Button },
        setup: () => ({ args }),
        template: '<Button v-bind="args">Delete household</Button>',
    }),
};

/** Still focusable, announced as unavailable, and does nothing when pressed. */
export const Disabled: Story = { args: { variant: 'primary', disabled: true } };

export const Loading: Story = { args: { variant: 'primary', loading: true, loadingText: 'Saving…' } };

/** One primary action per form, then the others. */
export const Group: Story = {
    render: () => ({
        components: { Button },
        template: `
            <div class="utrecht-button-group">
                <Button variant="primary" type="submit">Save</Button>
                <Button>Save as draft</Button>
                <Button variant="subtle">Cancel</Button>
            </div>
        `,
    }),
};
