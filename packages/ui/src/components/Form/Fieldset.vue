<script setup lang="ts">
import { computed, provide, useId } from 'vue';

import { describedBy, fieldKey } from './field';

/**
 * A group of related controls under one legend, such as a set of checkboxes,
 * or the parts of an address. The legend names the group; screen readers read
 * it when focus enters. A hint and an error apply to the whole group and are
 * linked to it with `aria-describedby`.
 *
 * Controls inside keep their own labels: a `FormField` around the fieldset
 * doesn't reach them.
 */
const props = withDefaults(
    defineProps<{
        legend: string;
        hint?: string;
        error?: string;
    }>(),
    { hint: undefined, error: undefined },
);

const id = useId();
const hintId = `${id}-hint`;
const errorId = `${id}-error`;

const hasHint = computed(() => props.hint !== undefined && props.hint !== '');
const hasError = computed(() => props.error !== undefined && props.error !== '');

// Controls in the group are not the control of an outer FormField.
provide(fieldKey, null);
</script>

<template>
    <fieldset
        :class="['utrecht-form-fieldset', 'utrecht-form-fieldset--html-fieldset', { 'utrecht-form-fieldset--invalid': hasError }]"
        :aria-describedby="describedBy([hasHint && hintId, hasError && errorId])"
    >
        <legend class="utrecht-form-fieldset__legend utrecht-form-fieldset__legend--html-legend">{{ legend }}</legend>
        <div v-if="hasHint" :id="hintId" class="utrecht-form-field-description">{{ hint }}</div>
        <div v-if="hasError" :id="errorId" class="utrecht-form-field-error-message">{{ error }}</div>
        <slot :invalid="hasError" />
    </fieldset>
</template>
