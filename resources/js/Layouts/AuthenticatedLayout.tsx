import { useState, PropsWithChildren, ReactNode } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage, Page } from '@inertiajs/react';
import { User } from '@/types';
import NotificationDropdown from '@/Components/NotificationDropdown';
import ThemeToggle from '@/Components/ThemeToggle';
import ThemeSwitcher from '@/Components/ThemeSwitcher';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import {
    HomeIcon,
    UsersIcon,
    ClipboardDocumentListIcon,
    CalendarIcon,
    Cog6ToothIcon,
    ChartBarIcon,
    DocumentDuplicateIcon,
    BuildingOffice2Icon,
    CalendarDaysIcon,
} from '@heroicons/react/24/outline';

export default function Authenticated({ user, header, children }: PropsWithChildren<{ user: User, header?: React.ReactNode }>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { props: { auth } } = usePage<{ auth: { user: User } }>();
    const theme = auth.user.theme;

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="h-16 flex items-center justify-center border-b">
                    <Link href="/">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                    </Link>
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                    <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                        <HomeIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                        Dashboard
                    </NavLink>
                    <NavLink href={route('patients.index')} active={route().current('patients.index')}>
                        <UsersIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                        Patients
                    </NavLink>
                    <NavLink href={route('appointments.index')} active={route().current('appointments.index')}>
                        <CalendarIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                        Appointments
                    </NavLink>
                    {auth.user.role === 'admin' && (
                        <>
                            <NavLink href={route('users.index')} active={route().current('users.index')}>
                                <UsersIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                                Users
                            </NavLink>
                            <NavLink href={route('services.index')} active={route().current('services.index')}>
                                <ClipboardDocumentListIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                                Services
                            </NavLink>
                            <NavLink href={route('medical-record-templates.index')} active={route().current('medical-record-templates.index')}>
                                <DocumentDuplicateIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                                Record Templates
                            </NavLink>
                            <NavLink href={route('reports.index')} active={route().current('reports.index')}>
                                <ChartBarIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                                Reports
                            </NavLink>
                            <NavLink href={route('clinics.index')} active={route().current('clinics.index')}>
                                <BuildingOffice2Icon className="mr-3 flex-shrink-0 h-6 w-6" />
                                Clinics
                            </NavLink>
                            <NavLink href={route('settings.index')} active={route().current('settings.index')}>
                                <Cog6ToothIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                                Settings
                            </NavLink>
                        </>
                    )}
                    {auth.user.role === 'doctor' && (
                        <NavLink href={route('availabilities.index')} active={route().current('availabilities.index')}>
                            <CalendarDaysIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                            My Availability
                        </NavLink>
                    )}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                {header && (
                                    <div className="font-semibold text-xl text-gray-800 leading-tight">{header}</div>
                                )}
                            </div>

                            <div className="hidden sm:flex sm:items-center sm:ms-6">
                                <ThemeSwitcher />
                                <div className="ms-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    {user.name}
                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    className: '',
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                }}
            />
        </div>
    );
}