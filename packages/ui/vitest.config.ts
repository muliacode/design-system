import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        setupFiles: ['src/test/setup.ts'],
        include: ['src/**/*.test.ts'],
        // The cached transform of src/test/stories.test.ts keeps the file list
        // its import.meta.glob found, so a new component's stories would go
        // unchecked by axe until the cache is cleared.
        fsModuleCache: false,
    },
});
