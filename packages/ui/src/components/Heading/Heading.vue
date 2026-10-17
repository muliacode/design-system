<script setup lang="ts">
import { computed } from 'vue';

/**
 * A section heading. `level` sets the element (h1 to h6) and so the document
 * outline; use one level 1 per page and don't skip levels for looks.
 */
const props = defineProps<{
    level: 1 | 2 | 3 | 4 | 5 | 6;
}>();

const tag = computed(() => `h${props.level}`);
</script>

<template>
    <component :is="tag" :class="`utrecht-heading-${level}`">
        <slot />
    </component>
</template>
