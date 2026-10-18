<script setup lang="ts">
import { computed } from 'vue';

export type ButtonVariant = 'primary' | 'secondary' | 'subtle' | 'danger';

/**
 * A button that does something on this page: submits a form, opens a dialog,
 * saves. To go to another page, use `ButtonLink`.
 *
 * `disabled` and `loading` keep the button focusable and in the tab order,
 * with `aria-disabled`, so keyboard and screen reader users can still find it
 * and hear why it doesn't respond. While either is set the button emits no
 * `click` and doesn't submit its form.
 *
 * `loading` also sets `aria-busy`, and shows `loadingText` in place of the
 * label when given ("Saving…"), so the change is visible and not only a
 * cursor. Announce the outcome
 * elsewhere too, for example with a status message: a button's text alone is
 * not reliably read out when it changes.
 */
const props = withDefaults(
    defineProps<{
        variant?: ButtonVariant;
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
        loading?: boolean;
        loadingText?: string;
    }>(),
    { variant: 'secondary', type: 'button', disabled: false, loading: false, loadingText: undefined },
);

const emit = defineEmits<{ click: [event: MouseEvent] }>();

const inert = computed(() => props.disabled || props.loading);

const variantClasses: Record<ButtonVariant, string[]> = {
    primary: ['utrecht-button--primary-action'],
    secondary: ['utrecht-button--secondary-action'],
    subtle: ['utrecht-button--subtle'],
    danger: ['utrecht-button--primary-action', 'utrecht-button--danger'],
};

const classes = computed(() => [
    'utrecht-button',
    ...variantClasses[props.variant],
    {
        'utrecht-button--disabled': props.disabled,
        'utrecht-button--busy': props.loading,
    },
]);

function onClick(event: MouseEvent): void {
    if (inert.value) {
        // aria-disabled doesn't stop a submit button from submitting, nor the
        // click from reaching ancestors the way a native disabled button does.
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
    }
    emit('click', event);
}
</script>

<template>
    <button
        :type="type"
        :class="classes"
        :aria-disabled="inert ? 'true' : undefined"
        :aria-busy="loading ? 'true' : undefined"
        @click="onClick"
    >
        <template v-if="loading && loadingText">{{ loadingText }}</template>
        <slot v-else />
    </button>
</template>
