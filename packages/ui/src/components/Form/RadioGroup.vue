<script setup lang="ts">
import { computed, useId } from 'vue';

import Fieldset from './Fieldset.vue';

export interface RadioOption {
    value: string;
    label: string;
    hint?: string;
}

/**
 * One question with a few mutually exclusive answers, as native radio buttons
 * in a `Fieldset` whose legend asks the question. Bind the chosen value with
 * `v-model`.
 *
 * Keyboard behaviour is the browser's own: Tab enters the group at the chosen
 * option (or the first), the arrow keys move and choose, and Tab leaves the
 * group. An error marks every option invalid and is linked to the group.
 */
const props = withDefaults(
    defineProps<{
        legend: string;
        options: RadioOption[];
        hint?: string;
        error?: string;
        name?: string;
        required?: boolean;
    }>(),
    { hint: undefined, error: undefined, name: undefined, required: false },
);

const model = defineModel<string>();

const id = useId();
const groupName = computed(() => props.name ?? id);
const invalid = computed(() => props.error !== undefined && props.error !== '');
</script>

<template>
    <Fieldset :legend="legend" :hint="hint" :error="error">
        <div
            v-for="(option, i) in options"
            :key="option.value"
            class="utrecht-form-field utrecht-form-field--radio"
        >
            <div class="utrecht-form-field__label">
                <label class="utrecht-form-label utrecht-form-label--radio mc-form-label-choice">
                    <span class="utrecht-form-field__input">
                        <input
                            :id="`${id}-${i}`"
                            v-model="model"
                            type="radio"
                            :name="groupName"
                            :value="option.value"
                            :class="['utrecht-radio-button', 'utrecht-radio-button--html-input', { 'utrecht-radio-button--invalid': invalid }]"
                            :aria-describedby="option.hint ? `${id}-${i}-hint` : undefined"
                            :aria-invalid="invalid ? 'true' : undefined"
                            :required="required || undefined"
                        />
                    </span>
                    {{ option.label }}
                </label>
            </div>
            <div v-if="option.hint" :id="`${id}-${i}-hint`" class="utrecht-form-field__description utrecht-form-field-description">
                {{ option.hint }}
            </div>
        </div>
    </Fieldset>
</template>
