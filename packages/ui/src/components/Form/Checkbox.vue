<script setup lang="ts">
import { computed, useId } from 'vue';

import { describedBy } from './field';

/**
 * One checkbox inside its label, and an optional hint and error. The whole
 * label is the target, at least 44 px tall. Bind the checked state with
 * `v-model`. For several checkboxes on one question,
 * put them in a `Fieldset` whose legend asks the question.
 */
const props = withDefaults(
    defineProps<{
        label: string;
        hint?: string;
        error?: string;
        invalid?: boolean;
        required?: boolean;
    }>(),
    { hint: undefined, error: undefined, invalid: false, required: false },
);

const model = defineModel<boolean>({ default: false });

const id = `${useId()}-checkbox`;
const hintId = `${id}-hint`;
const errorId = `${id}-error`;

const hasHint = computed(() => props.hint !== undefined && props.hint !== '');
const hasError = computed(() => props.error !== undefined && props.error !== '');
const invalid = computed(() => props.invalid || hasError.value);
</script>

<template>
    <div :class="['utrecht-form-field', 'utrecht-form-field--checkbox', { 'utrecht-form-field--invalid': hasError }]">
        <div class="utrecht-form-field__label">
            <label class="utrecht-form-label utrecht-form-label--checkbox mc-form-label-choice">
                <span class="utrecht-form-field__input">
                    <input
                        :id="id"
                        v-model="model"
                        type="checkbox"
                        :class="['utrecht-checkbox', 'utrecht-checkbox--html-input', 'mc-checkbox', { 'utrecht-checkbox--invalid': invalid }]"
                        :aria-describedby="describedBy([hasHint && hintId, hasError && errorId])"
                        :aria-invalid="invalid ? 'true' : undefined"
                        :required="required || undefined"
                    />
                </span>
                {{ label }}
            </label>
        </div>
        <div v-if="hasHint" :id="hintId" class="utrecht-form-field__description utrecht-form-field-description">{{ hint }}</div>
        <div v-if="hasError" :id="errorId" class="utrecht-form-field__error-message utrecht-form-field-error-message">{{ error }}</div>
    </div>
</template>
