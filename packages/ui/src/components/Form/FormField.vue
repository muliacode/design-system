<script setup lang="ts">
import { computed, provide, useId } from 'vue';

import { describedBy, fieldKey } from './field';

/**
 * A label, an optional hint and error message, and one control: `Textbox`,
 * `Textarea` or `Select`. The field gives the control its id, so the label
 * names it, and links the hint and the error with `aria-describedby`; an
 * error also sets `aria-invalid`. Every control needs a visible label: a
 * placeholder is not one, as it disappears while typing.
 *
 * The error message is shown above the control, after the hint, and says
 * what to do ("Enter a monthly amount, such as 12,99"). For a checkbox use
 * `Checkbox`, and for a group of options `RadioGroup` or `Fieldset`.
 */
const props = withDefaults(
    defineProps<{
        label: string;
        hint?: string;
        error?: string;
        required?: boolean;
        id?: string;
    }>(),
    { hint: undefined, error: undefined, required: false, id: undefined },
);

const generated = useId();
const controlId = props.id ?? `${generated}-control`;
const hintId = `${controlId}-hint`;
const errorId = `${controlId}-error`;

const hasHint = computed(() => props.hint !== undefined && props.hint !== '');
const hasError = computed(() => props.error !== undefined && props.error !== '');

provide(fieldKey, {
    id: controlId,
    describedBy: computed(() => describedBy([hasHint.value && hintId, hasError.value && errorId])),
    invalid: hasError,
    required: computed(() => props.required),
});
</script>

<template>
    <div :class="['utrecht-form-field', 'utrecht-form-field--text', { 'utrecht-form-field--invalid': hasError }]">
        <div class="utrecht-form-field__label">
            <label class="utrecht-form-label" :for="controlId">{{ label }}</label>
        </div>
        <div v-if="hasHint" :id="hintId" class="utrecht-form-field__description utrecht-form-field-description">{{ hint }}</div>
        <div v-if="hasError" :id="errorId" class="utrecht-form-field__error-message utrecht-form-field-error-message">{{ error }}</div>
        <div class="utrecht-form-field__input">
            <slot />
        </div>
    </div>
</template>
