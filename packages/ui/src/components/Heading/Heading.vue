<script setup lang="ts">
import { computed } from 'vue';

/**
 * A section heading. `level` sets the element (h1 to h6) and so the document
 * outline; use one level 1 per page and don't skip levels for looks.
 *
 * Headings have no outer margin: the layout around them sets the spacing.
 * In running text, `distanced` gives them the theme's spacing instead.
 */
const props = withDefaults(
    defineProps<{
        level: 1 | 2 | 3 | 4 | 5 | 6;
        distanced?: boolean;
    }>(),
    { distanced: false },
);

const tag = computed(() => `h${props.level}`);
</script>

<template>
    <component
        :is="tag"
        :class="[`utrecht-heading-${level}`, { [`utrecht-heading-${level}--distanced`]: distanced }]"
    >
        <slot />
    </component>
</template>
