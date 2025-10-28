import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import rtl from 'tailwindcss-rtl';

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Tajawal', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Sky Theme - Primary Colors
                primary: {
                    50: '#f0f9ff',   // Very Light Sky
                    100: '#e0f2fe',  // Light Sky
                    200: '#bae6fd',  // Sky Light
                    300: '#7dd3fc',  // Sky
                    400: '#38bdf8',  // Sky Blue
                    500: '#0ea5e9',  // Primary Sky
                    600: '#0284c7',  // Dark Sky
                    700: '#0369a1',  // Darker Sky
                    800: '#075985',  // Very Dark Sky
                    900: '#0c4a6e',  // Deep Sky
                    950: '#082f49'   // Darkest Sky
                },

                // Medical Status Colors
                medical: {
                    50: '#f0fdf4',   // Light Green
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',  // Success Green
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16'   // Dark Green
                },

                // Chart Colors
                chart: {
                    '1': 'hsl(var(--chart-1))',    // Sky Blue
                    '2': 'hsl(var(--chart-2))',    // Emerald Green
                    '3': 'hsl(var(--chart-3))',    // Amber
                    '4': 'hsl(var(--chart-4))',    // Red
                    '5': 'hsl(var(--chart-5))',    // Purple
                    '6': 'hsl(var(--chart-6))',    // Cyan
                    '7': 'hsl(var(--chart-7))',    // Orange
                    '8': 'hsl(var(--chart-8))',    // Pink
                    'grid': 'hsl(var(--chart-grid))',     // Grid Lines
                    'axis': 'hsl(var(--chart-axis))',     // Axis
                    'text': 'hsl(var(--chart-text))'      // Text
                },

                // Legacy gray colors (kept for compatibility)
                gray: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                    950: '#020617',
                }
            },
            spacing: {
                '128': '32rem',
                '144': '36rem',
            }
        },
    },

    plugins: [forms, rtl],
};