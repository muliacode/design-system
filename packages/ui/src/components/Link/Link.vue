<script setup lang="ts">
import { computed, useAttrs, warn, type Component } from 'vue';

/**
 * A text link for use in running text. Renders an `<a>`; pass `as` to render
 * the app's router link instead, which gets every other attribute, `href` or
 * `to` included. For a standalone link, such as in a menu, use `ButtonLink`,
 * which has the full 44 by 44 px target.
 *
 * Open a link in a new tab only when leaving the page would lose the user's
 * work. Set `newTabText` to do that: its text, such as "opens in a new tab",
 * is added to the link in brackets, so everyone sees and hears it. The
 * library has no default text, because it doesn't know the app's language.
 * Leave any such indicator out of the slot. The link sets `target` and `rel`
 * itself, and ignores a `target` attribute without `newTabText`, so a link
 * never opens a new tab silently.
 *
 * `current` marks the link to the page the user is on, with
 * `aria-current="page"`. A router link sets that itself, so leave `current`
 * off when you pass one as `as`.
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        as?: string | Component;
        newTabText?: string;
        current?: boolean;
    }>(),
    { as: 'a', newTabText: undefined, current: false },
);

const attrs = useAttrs();

const newTab = computed(() => props.newTabText !== undefined && props.newTabText !== '');

if (import.meta.env.DEV && !newTab.value && attrs.target !== undefined) {
    warn('Link: `target` is ignored without `newTabText`, so the link opens in the same tab.');
}

// Our `target` and `rel` come last, so a fallthrough attribute can't override
// them. Attributes we don't set are left out, not set to undefined, so a router
// link's own `aria-current` isn't wiped.
const linkAttrs = computed(() => {
    const { target: _target, ...rest } = attrs;
    return {
        ...rest,
        ...(newTab.value ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
        ...(props.current ? { 'aria-current': 'page' } : {}),
    };
});
</script>

<template>
    <component
        :is="as"
        v-bind="linkAttrs"
        :class="['utrecht-link', 'utrecht-link--html-a', { 'utrecht-link--current': current }]"
    >
        <slot /><template v-if="newTab">{{ ' ' }}<span class="mc-link__new-tab">({{ newTabText }})</span></template>
    </component>
</template>
