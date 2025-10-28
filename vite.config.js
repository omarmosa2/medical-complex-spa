import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command, mode }) => {
    // Determine environment
    const isProduction = mode === 'production';
    const nodeEnv = process.env.NODE_ENV || (isProduction ? 'production' : 'development');

    return {
        plugins: [
            laravel({
                input: 'resources/js/app.jsx',
                refresh: true,
            }),
            react({
                // Configure React plugin for proper production builds
                babel: {
                    plugins: isProduction ? [
                        // Remove development-only code in production
                        ['transform-remove-console', { exclude: ['error', 'warn'] }]
                    ] : []
                }
            }),
        ],
        // Ensure React development mode detection works correctly
        define: {
            'process.env.NODE_ENV': JSON.stringify(nodeEnv),
            // Ensure global process object exists for React
            global: 'globalThis',
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
            // Minify and optimize for production
            minify: isProduction ? 'esbuild' : false,
            sourcemap: !isProduction,
        },
        // Development server configuration
        server: {
            host: '127.0.0.1', // Use IPv4 to avoid IPv6 issues
            port: 3000,
        },
        // Preview server for production builds
        preview: {
            port: 3000,
        },
    };
});
