<script setup lang="ts">
import { useFieldControl } from './field';

defineOptions({ inheritAttrs: false });

/**
 * A single-line text input, for use inside a `FormField`, which labels it.
 * Bind the value with `v-model`. `type` picks the keyboard on phones; for
 * amounts of money use `MoneyInput`. Set `autocomplete` where it applies
 * (`email`, `name`), so browsers can fill it in.
 */
const props = withDefaults(
    defineProps<{
        type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'search';
        invalid?: boolean;
    }>(),
    { type: 'text', invalid: false },
);

const model = defineModel<string>({ default: '' });
const { invalid, controlAttrs } = useFieldControl(props);
</script>

<template>
    <input
        v-model="model"
        :type="type"
        :class="['utrecht-textbox', 'utrecht-textbox--html-input', { 'utrecht-textbox--invalid': invalid }]"
        v-bind="controlAttrs"
    />
</template>
