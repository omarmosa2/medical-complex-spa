import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] group ${
                active
                    ? 'bg-gray-200 text-black shadow-lg border-l-4 border-gray-400'
                    : 'text-black hover:bg-gray-100 border-l-4 border-transparent hover:border-gray-400'
            } ${className}`}
        >
            {children}
        </Link>
    );
}