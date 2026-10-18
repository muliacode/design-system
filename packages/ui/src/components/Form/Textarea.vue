<script setup lang="ts">
import { useFieldControl } from './field';

defineOptions({ inheritAttrs: false });

/** A multi-line text input, for use inside a `FormField`. Bind the value with `v-model`. */
const props = withDefaults(defineProps<{ invalid?: boolean }>(), { invalid: false });

const model = defineModel<string>({ default: '' });
const { invalid, controlAttrs } = useFieldControl(props);
</script>

<template>
    <textarea
        v-model="model"
        :class="['utrecht-textarea', 'utrecht-textarea--html-textarea', { 'utrecht-textarea--invalid': invalid }]"
        v-bind="controlAttrs"
    ></textarea>
</template>
