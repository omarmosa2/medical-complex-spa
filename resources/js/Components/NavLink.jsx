import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] group ${
                active
                    ? 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary border-l-4 border-primary shadow-md'
                    : 'text-foreground hover:bg-muted dark:hover:bg-muted/50 border-l-4 border-transparent hover:border-primary/50 dark:hover:border-primary/30'
            } ${className}`}
        >
            {children}
        </Link>
    );
}