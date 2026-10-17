import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// Library mode: one ES module per source file, so an app's bundler can drop
// the components it doesn't import. Vue and the Utrecht CSS stay external.
export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
        },
        rolldownOptions: {
            external: ['vue', /^@utrecht\//],
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: '[name].js',
            },
        },
        sourcemap: true,
        emptyOutDir: true,
    },
});
