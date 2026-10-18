import type { Meta, StoryObj } from '@storybook/vue3-vite';

import SkipLink from './SkipLink.vue';

const meta = {
    title: 'Navigation/SkipLink',
    component: SkipLink,
    args: { href: '#main' },
    render: (args) => ({
        components: { SkipLink },
        setup: () => ({ args }),
        template: `
            <div>
                <SkipLink v-bind="args">Skip to main content</SkipLink>
                <p class="utrecht-paragraph">Press Tab to show the skip link.</p>
                <nav aria-label="Main"><a class="utrecht-button-link utrecht-button-link--html-a utrecht-button-link--subtle" href="#subscriptions">Subscriptions</a></nav>
                <main id="main"><p class="utrecht-paragraph">The main content.</p></main>
            </div>
        `,
    }),
} satisfies Meta<typeof SkipLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HiddenUntilFocused: Story = {};
