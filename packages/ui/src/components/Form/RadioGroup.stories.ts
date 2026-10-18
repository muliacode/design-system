import type { Meta, StoryObj } from '@storybook/vue3-vite';

import RadioGroup from './RadioGroup.vue';

const meta = {
    title: 'Forms/RadioGroup',
    component: RadioGroup,
    args: {
        legend: 'How often do you pay?',
        options: [
            { value: 'month', label: 'Every month' },
            { value: 'quarter', label: 'Every quarter' },
            { value: 'year', label: 'Every year', hint: 'Often cheaper per month' },
        ],
        hint: '',
        error: '',
    },
    render: (args) => ({
        components: { RadioGroup },
        setup: () => ({ args }),
        template: '<RadioGroup v-bind="args" />',
    }),
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Chosen: Story = { args: { modelValue: 'quarter' } };

export const WithError: Story = { args: { error: 'Choose how often you pay' } };
