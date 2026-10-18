import type { Meta, StoryObj } from '@storybook/vue3-vite';

import FormField from './FormField.vue';
import Select from './Select.vue';
import Textarea from './Textarea.vue';
import Textbox from './Textbox.vue';

const meta = {
    title: 'Forms/FormField',
    component: FormField,
    args: { label: 'Name', hint: 'As on your bank statement', error: '', required: false },
    argTypes: {
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        required: { control: 'boolean' },
    },
    render: (args) => ({
        components: { FormField, Textbox },
        setup: () => ({ args }),
        template: '<FormField v-bind="args"><Textbox autocomplete="off" /></FormField>',
    }),
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithTextbox: Story = {};

export const WithError: Story = { args: { error: 'Enter the name of the subscription' } };

export const WithTextarea: Story = {
    args: { label: 'Notes', hint: 'Only you can see these' },
    render: (args) => ({
        components: { FormField, Textarea },
        setup: () => ({ args }),
        template: '<FormField v-bind="args"><Textarea rows="4" /></FormField>',
    }),
};

export const WithSelect: Story = {
    args: { label: 'Category', hint: '' },
    render: (args) => ({
        components: { FormField, Select },
        setup: () => ({ args }),
        template: `
            <FormField v-bind="args">
                <Select>
                    <option value="">Choose a category</option>
                    <option value="streaming">Streaming</option>
                    <option value="insurance">Insurance</option>
                    <option value="utilities">Utilities</option>
                </Select>
            </FormField>
        `,
    }),
};
