import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    isDarkMode: boolean;
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    setDarkMode: (isDark: boolean) => void;
    toggleDarkMode: () => void;
}

// Core Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        // Auto-detect system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        
        let shouldBeDark = false;
        if (storedTheme) {
            shouldBeDark = storedTheme === 'dark';
        } else {
            shouldBeDark = systemPrefersDark;
        }
        
        setTheme(shouldBeDark ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const toggleDarkMode = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const setDarkMode = (isDark: boolean) => {
        setTheme(isDark ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            isDarkMode: theme === 'dark',
            toggleTheme,
            toggleDarkMode,
            setTheme: setTheme,
            setDarkMode
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

// Theme Classes Hook
export function useThemeClasses() {
    const { isDarkMode } = useTheme();
    
    return {
        // Background classes
        bgPrimary: 'bg-background',
        bgSecondary: 'bg-card',
        bgTertiary: 'bg-muted',
        bgElevated: isDarkMode
            ? 'bg-card shadow-lg shadow-black/10'
            : 'bg-card shadow-sm',
        
        // Text classes
        textPrimary: 'text-foreground',
        textSecondary: 'text-muted-foreground',
        
        // Button classes
        buttonPrimary: isDarkMode
            ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
            : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md',
            
        // Status classes
        statusScheduled: isDarkMode
            ? 'bg-primary/20 text-primary border border-primary/30'
            : 'bg-primary/10 text-primary border border-primary/20',
    };
}

// Get theme-aware colors
export function getThemeColors(isDarkMode: boolean) {
    return {
        primary: isDarkMode ? '#38bdf8' : '#0284c7',
        primaryHover: isDarkMode ? '#0ea5e9' : '#0369a1',
        secondary: isDarkMode ? '#0ea5e9' : '#0369a1',
        success: isDarkMode ? '#22c55e' : '#059669',
        warning: isDarkMode ? '#f59e0b' : '#d97706',
        error: isDarkMode ? '#ef4444' : '#dc2626',
        background: isDarkMode ? '#0f172a' : '#ffffff',
        surface: isDarkMode ? '#1e293b' : '#f8fafc',
        text: isDarkMode ? '#f1f5f9' : '#0f172a',
    };
}

// Status Color System
export function getStatusColors(isDarkMode: boolean) {
    return {
        scheduled: {
            bg: isDarkMode ? 'rgba(56, 189, 248, 0.2)' : 'rgba(2, 132, 199, 0.1)',
            text: isDarkMode ? '#38bdf8' : '#0284c7',
            border: isDarkMode ? 'rgba(56, 189, 248, 0.3)' : 'rgba(2, 132, 199, 0.2)',
        },
        completed: {
            bg: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(5, 150, 105, 0.1)',
            text: isDarkMode ? '#22c55e' : '#059669',
            border: isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(5, 150, 105, 0.2)',
        },
        cancelled: {
            bg: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(220, 38, 38, 0.1)',
            text: isDarkMode ? '#ef4444' : '#dc2626',
            border: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(220, 38, 38, 0.2)',
        },
    };
}