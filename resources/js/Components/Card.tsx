import { ReactNode } from 'react';

export default function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`bg-white dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-xl p-6 ${className}`}>
            {children}
        </div>
    );
}