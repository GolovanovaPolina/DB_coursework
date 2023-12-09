/// <reference types="vitest" />
/// <reference types="vite/client" />

import {configDefaults, defineConfig} from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/setup.ts'],
        exclude:[
            ...configDefaults.exclude,
            'dashboard/*'
        ]
    },
})