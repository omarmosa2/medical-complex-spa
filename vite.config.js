import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    // Ensure React development mode detection works correctly
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    // Handle dependency optimization to fix chart.js resolution issues
    optimizeDeps: {
        include: [
            'chart.js',
            'react-chartjs-2',
            'framer-motion',
            '@heroicons/react/24/outline',
        ],
        exclude: [
            // Exclude problematic packages from pre-bundling
        ],
    },
    // Disable dependency scanning for problematic packages
    ssr: {
        noExternal: [
            // Keep these packages in the client bundle
        ]
    },
    build: {
        rollupOptions: {
            external: [],
        },
    },
});
