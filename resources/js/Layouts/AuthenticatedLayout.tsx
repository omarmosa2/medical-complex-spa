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
    CreditCardIcon,
    ArrowRightOnRectangleIcon,
    UserCircleIcon,
    Bars3Icon,
} from '@heroicons/react/24/outline';

export default function Authenticated({ header, children }: PropsWithChildren<{ header?: React.ReactNode }>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { props: { auth } } = usePage<{ auth: { user: User } }>();
    const theme = auth.user?.theme || 'light';

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const SidebarContent = () => (
        <>
            <div className="h-20 flex items-center justify-center flex-shrink-0 px-4 bg-slate-800 border-b border-teal-500">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <ApplicationLogo className="block h-12 w-auto" />
                </Link>
            </div>
            <nav className="mt-5 flex-1 px-4 space-y-3">
                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                    <HomeIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                    لوحة التحكم
                </NavLink>
                <NavLink href={route('patients.index')} active={route().current('patients.index')}>
                    <UsersIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                    إدارة المرضى
                </NavLink>
                <NavLink href={route('appointments.index')} active={route().current('appointments.index')}>
                    <CalendarIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                    إدارة الحجوزات
                </NavLink>
                {(auth.user.role === 'admin' || auth.user.role === 'receptionist') && (
                    <NavLink href={route('payments.index')} active={route().current('payments.index')}>
                        <CreditCardIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                        المدفوعات
                    </NavLink>
                )}
                {auth.user.role === 'admin' && (
                    <>
                        <div className="pt-6 pb-3 px-3">
                            <h3 className="text-xs font-semibold text-teal-300 uppercase tracking-wider">الإدارة</h3>
                        </div>
                        <NavLink href={route('users.index')} active={route().current('users.index')}>
                            <UsersIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                            المستخدمين
                        </NavLink>
                        <NavLink href={route('services.index')} active={route().current('services.index')}>
                            <ClipboardDocumentListIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                            الخدمات
                        </NavLink>
                        <NavLink href={route('medical-record-templates.index')} active={route().current('medical-record-templates.index')}>
                            <DocumentDuplicateIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                            قوالب التسجيل
                        </NavLink>
                        <NavLink href={route('reports.index')} active={route().current('reports.index')}>
                            <ChartBarIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                            التقارير
                        </NavLink>
                        <NavLink href={route('clinics.index')} active={route().current('clinics.index')}>
                            <BuildingOffice2Icon className="mr-3 flex-shrink-0 h-6 w-6" />
                            العيادات
                        </NavLink>
                        <NavLink href={route('doctors.index')} active={route().current('doctors.index')}>
                            <UserCircleIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                            الأطباء
                        </NavLink>
                        <NavLink href={route('settings.index')} active={route().current('settings.index')}>
                            <Cog6ToothIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                            الإعدادات
                        </NavLink>
                    </>
                )}
                {auth.user.role === 'doctor' && (
                     <>
                        <div className="pt-6 pb-3 px-3">
                            <h3 className="text-xs font-semibold text-teal-300 uppercase tracking-wider">منطقة الطبيب</h3>
                        </div>
                        <NavLink href={route('doctor.tool')} active={route().current('doctor.tool')}>
                            <HomeIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                            أدوات الطبيب
                        </NavLink>
                        <NavLink href={route('doctor.agenda')} active={route().current('doctor.agenda')}>
                            <CalendarDaysIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                            جدول المواعيد
                        </NavLink>
                        <NavLink href={route('availabilities.index')} active={route().current('availabilities.index')}>
                            <CalendarDaysIcon className="mr-3 flex-shrink-0 h-6 w-6" />
                            أوقات التوفر
                        </NavLink>
                    </>
                )}
            </nav>
        </>
    );


    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {/* Static sidebar for desktop */}
            <aside className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col h-0 flex-1 bg-gradient-to-b from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900">
                        <SidebarContent />
                    </div>
                </div>
            </aside>

            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                {/* Top Header */}
                <header className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="flex-1 px-4 flex justify-between">
                        <div className="flex-1 flex items-center">
                            {header && (
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{header}</div>
                            )}
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            <ThemeSwitcher />
                            {/* Profile dropdown */}
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-100 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {auth.user?.name}
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
                                        <Dropdown.Link href={route('profile.edit')}>
                                            <UserCircleIcon className="mr-2 h-5 w-5"/>
                                            الملف الشخصي
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5"/>
                                            تسجيل الخروج
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
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