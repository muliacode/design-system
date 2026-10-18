import { computed, inject, useAttrs, type ComputedRef, type InjectionKey } from 'vue';

/** What a `FormField` hands to the one control inside it. */
export interface FieldContext {
    id: string;
    describedBy: ComputedRef<string | undefined>;
    invalid: ComputedRef<boolean>;
    required: ComputedRef<boolean>;
}

export const fieldKey: InjectionKey<FieldContext | null> = Symbol('mc-form-field');

/**
 * The attributes that tie a control to its field: the id its label points
 * at, the hint and error it is described by, and whether it is invalid or
 * required. A control outside a `FormField` uses its own attributes and its
 * `invalid` prop.
 *
 * The control sets `inheritAttrs: false` and binds `controlAttrs`, which holds
 * every other attribute too, so a fallthrough `id` or `aria-describedby` can't
 * replace the field's.
 */
export function useFieldControl(props: { invalid?: boolean }) {
    const field = inject(fieldKey, null);
    const attrs = useAttrs();

    const invalid = computed(() => props.invalid || (field?.invalid.value ?? false));

    const controlAttrs = computed((): Record<string, unknown> => {
        const own = attrs['aria-describedby'] as string | undefined;
        const describedBy = [field?.describedBy.value, own].filter(Boolean).join(' ');
        return {
            ...attrs,
            id: field?.id ?? (attrs.id as string | undefined),
            'aria-describedby': describedBy === '' ? undefined : describedBy,
            'aria-invalid': invalid.value ? 'true' : undefined,
            required: field?.required.value || attrs.required !== undefined ? true : undefined,
        };
    });

    return { invalid, controlAttrs };
}

/** Joins the ids of the hint and the error that are shown, in reading order. */
export function describedBy(ids: (string | false | undefined)[]): string | undefined {
    const joined = ids.filter(Boolean).join(' ');
    return joined === '' ? undefined : joined;
}
