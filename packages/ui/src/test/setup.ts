import { setProjectAnnotations } from '@storybook/vue3-vite';
import { cleanup } from '@testing-library/vue';
import { afterEach, expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

import preview from '../../.storybook/preview';

expect.extend(matchers);

// Stories rendered in tests get the same decorators and parameters as in
// Storybook.
setProjectAnnotations(preview);

afterEach(() => {
    cleanup();
});
