import type { Meta, StoryObj } from '@storybook/vue3-vite';

import ButtonLink from './ButtonLink.vue';

const meta = {
    title: 'Actions/ButtonLink',
    component: ButtonLink,
    args: { variant: 'secondary' },
    argTypes: {
        variant: { control: { type: 'select' }, options: ['primary', 'secondary', 'subtle'] },
    },
    render: (args) => ({
        components: { ButtonLink },
        setup: () => ({ args }),
        template: '<ButtonLink v-bind="args" href="#subscriptions/new">Add a subscription</ButtonLink>',
    }),
} satisfies Meta<typeof ButtonLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Subtle: Story = { args: { variant: 'subtle' } };
