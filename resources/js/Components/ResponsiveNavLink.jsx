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
                    ? 'border-gray-400 bg-gray-200 text-black shadow-lg'
                    : 'border-transparent text-black hover:border-gray-400 hover:bg-gray-100'
            } text-base font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ${className}`}
        >
            {children}
        </Link>
    );
}
