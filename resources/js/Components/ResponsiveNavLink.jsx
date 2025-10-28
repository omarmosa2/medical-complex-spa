import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-center border-l-4 py-3 pe-4 ps-3 rounded-r-xl transition-all duration-300 transform hover:scale-[1.01] ${
                active
                    ? 'border-primary bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary shadow-lg'
                    : 'border-transparent text-foreground hover:border-primary/50 hover:bg-muted dark:hover:bg-muted/50'
            } text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${className}`}
        >
            {children}
        </Link>
    );
}
