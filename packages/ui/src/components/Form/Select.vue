<script setup lang="ts">
import { useFieldControl } from './field';

defineOptions({ inheritAttrs: false });

/**
 * A native select, for use inside a `FormField`. Put `<option>` elements in
 * the slot and bind the value with `v-model`. With up to about five options,
 * a `RadioGroup` shows them all at once and is easier to use.
 */
const props = withDefaults(defineProps<{ invalid?: boolean }>(), { invalid: false });

const model = defineModel<string>({ default: '' });
const { invalid, controlAttrs } = useFieldControl(props);
</script>

<template>
    <select
        v-model="model"
        :class="['utrecht-select', 'utrecht-select--html-select', { 'utrecht-select--invalid': invalid }]"
        v-bind="controlAttrs"
    >
        <slot />
    </select>
</template>
