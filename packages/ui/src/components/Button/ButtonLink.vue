<script setup lang="ts">
import { computed, type Component } from 'vue';

export type ButtonLinkVariant = 'primary' | 'secondary' | 'subtle';

/**
 * A link that looks like a button, for the main way to another page ("Add a
 * subscription"). It is still a link: it goes somewhere, and screen readers
 * announce it as one. To do something on this page, use `Button`.
 *
 * Renders an `<a>`. Pass `as` to render the app's router link instead, for
 * example Inertia's `Link` or vue-router's `RouterLink`; every other
 * attribute, `href` or `to` included, goes to that element.
 *
 * There is no disabled link: a link that goes nowhere is not a link. Leave it
 * out, or say in text why the page isn't available yet.
 */
const props = withDefaults(
    defineProps<{
        variant?: ButtonLinkVariant;
        as?: string | Component;
    }>(),
    { variant: 'secondary', as: 'a' },
);

const variantClass: Record<ButtonLinkVariant, string> = {
    primary: 'utrecht-button-link--primary-action',
    secondary: 'utrecht-button-link--secondary-action',
    subtle: 'utrecht-button-link--subtle',
};

const classes = computed(() => ['utrecht-button-link', 'utrecht-button-link--html-a', variantClass[props.variant]]);
</script>

<template>
    <component :is="as" :class="classes">
        <slot />
    </component>
</template>
