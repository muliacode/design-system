<script setup lang="ts">
import { computed, type Component } from 'vue';

/**
 * A text link. Renders an `<a>`; pass `as` to render the app's router link
 * instead, which gets every other attribute, `href` or `to` included.
 *
 * Open a link in a new tab only when leaving the page would lose the user's
 * work. Set `newTabText` to do that: its text, such as "opens in a new tab",
 * is added to the link in brackets, so everyone sees and hears it. The
 * library has no default text, because it doesn't know the app's language.
 *
 * `current` marks the link to the page the user is on, with
 * `aria-current="page"`.
 */
const props = withDefaults(
    defineProps<{
        as?: string | Component;
        newTabText?: string;
        current?: boolean;
    }>(),
    { as: 'a', newTabText: undefined, current: false },
);

const newTab = computed(() => props.newTabText !== undefined && props.newTabText !== '');
</script>

<template>
    <component
        :is="as"
        :class="['utrecht-link', 'utrecht-link--html-a', { 'utrecht-link--current': current }]"
        :aria-current="current ? 'page' : undefined"
        :target="newTab ? '_blank' : undefined"
        :rel="newTab ? 'noopener noreferrer' : undefined"
    >
        <slot /><template v-if="newTab"> ({{ newTabText }})</template>
    </component>
</template>
