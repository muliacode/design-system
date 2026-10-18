import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Link from './Link.vue';

const meta = {
    title: 'Navigation/Link',
    component: Link,
    args: { current: false },
    argTypes: {
        current: { control: 'boolean' },
        newTabText: { control: 'text' },
    },
    render: (args) => ({
        components: { Link },
        setup: () => ({ args }),
        template: `
            <p class="utrecht-paragraph">
                Read how we keep your data safe in the <Link v-bind="args" href="#privacy">privacy statement</Link>.
            </p>
        `,
    }),
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InText: Story = {};

/** Only when leaving the page would lose the user's work. */
export const NewTab: Story = { args: { newTabText: 'opens in a new tab' } };

export const Current: Story = { args: { current: true } };
