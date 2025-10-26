import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

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
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    '50': '#EBF5FF',
                    '100': '#D6EAF8',
                    '200': '#AED6F1',
                    '300': '#85C1E9',
                    '400': '#5DADE2',
                    '500': '#3498DB',
                    '600': '#2E86C1',
                    '700': '#2874A6',
                    '800': '#21618C',
                    '900': '#1B4F72',
                    '950': '#153E59',
                },
                gray: {
                    '50': '#F8FAFC',
                    '100': '#F1F5F9',
                    '200': '#E2E8F0',
                    '300': '#CBD5E1',
                    '400': '#94A3B8',
                    '500': '#64748B',
                    '600': '#475569',
                    '700': '#334155',
                    '800': '#1E293B',
                    '900': '#0F172A',
                    '950': '#020617',
                }
            },
            spacing: {
                '128': '32rem',
                '144': '36rem',
            }
        },
    },

    plugins: [forms],
};