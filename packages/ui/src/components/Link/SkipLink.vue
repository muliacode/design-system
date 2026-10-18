<script setup lang="ts">
/**
 * The first focusable element of a page: a link past the navigation to the
 * main content. It is hidden until it gets keyboard focus.
 *
 * `href` is the id of the target as a fragment, such as `#main`. Activating
 * the link moves focus to the target, so the next Tab continues from there.
 * The browser still follows the fragment, so the URL and `:target` update and
 * opening the link in a new tab works. A target that can't take focus gets
 * `tabindex="-1"` until focus leaves it. Some browsers only scroll to a
 * fragment and leave focus where it was.
 */
const props = defineProps<{
    href: `#${string}`;
}>();

function targetId(href: string): string {
    const id = href.slice(1);
    try {
        return decodeURIComponent(id);
    } catch {
        // A malformed escape such as "#100%": use the raw text.
        return id;
    }
}

function onClick(event: MouseEvent): void {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
        return;
    }
    const target = document.getElementById(targetId(props.href));
    if (target === null) {
        return;
    }
    if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
    // The browser scrolls to the fragment itself.
    target.focus({ preventScroll: true });
}
</script>

<template>
    <a :href="href" class="utrecht-skip-link utrecht-skip-link--visible-on-focus" @click="onClick">
        <slot />
    </a>
</template>
