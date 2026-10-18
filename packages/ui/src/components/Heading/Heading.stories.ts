import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Heading from './Heading.vue';

const meta = {
    title: 'Typography/Heading',
    component: Heading,
    args: { level: 1, distanced: false },
    argTypes: {
        level: { control: { type: 'select' }, options: [1, 2, 3, 4, 5, 6] },
        distanced: { control: 'boolean' },
    },
    render: (args) => ({
        components: { Heading },
        setup: () => ({ args }),
        template: '<Heading v-bind="args">Upcoming payments</Heading>',
    }),
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Level1: Story = { args: { level: 1 } };
export const Level2: Story = { args: { level: 2 } };
export const Level3: Story = { args: { level: 3 } };

/**
 * A document outline in running text: one level 1, then levels in order,
 * none skipped, each `distanced` so the theme spaces them.
 */
export const Outline: Story = {
    render: () => ({
        components: { Heading },
        template: `
            <div>
                <Heading :level="1" distanced>Subscriptions</Heading>
                <p class="utrecht-paragraph utrecht-paragraph--distanced">Everything the household pays for, by when it is due.</p>
                <Heading :level="2" distanced>Due this month</Heading>
                <Heading :level="3" distanced>Streaming</Heading>
                <p class="utrecht-paragraph utrecht-paragraph--distanced">Two subscriptions renew this month.</p>
                <Heading :level="2" distanced>Paused</Heading>
            </div>
        `,
    }),
};
