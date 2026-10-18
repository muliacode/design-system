<script setup lang="ts">
/**
 * The first focusable element of a page: a link past the navigation to the
 * main content. It is hidden until it gets keyboard focus.
 *
 * `href` is the id of the target as a fragment, such as `#main`. Activating
 * the link moves focus to the target, making it focusable with
 * `tabindex="-1"` when it isn't, so the next Tab continues from there. Some
 * browsers only scroll to a fragment and leave focus where it was.
 */
const props = defineProps<{
    href: `#${string}`;
}>();

function onClick(event: MouseEvent): void {
    const target = document.getElementById(decodeURIComponent(props.href.slice(1)));
    if (target === null) {
        return;
    }
    event.preventDefault();
    if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
    }
    target.focus();
}
</script>

<template>
    <a :href="href" class="utrecht-skip-link utrecht-skip-link--visible-on-focus" @click="onClick">
        <slot />
    </a>
</template>
