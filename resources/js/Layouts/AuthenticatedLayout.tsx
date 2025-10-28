import { useState, PropsWithChildren, ReactNode } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
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
            <div className="h-20 flex items-center justify-center flex-shrink-0 px-6 bg-white border-b border-gray-300 shadow-lg">
                <Link href="/" className="hover:opacity-80 transition-all duration-300 hover:scale-105">
                    <ApplicationLogo className="block h-12 w-auto filter drop-shadow-sm" />
                </Link>
            </div>
            <nav className="mt-6 flex-1 px-4 pb-6 space-y-2 overflow-y-auto">
                <NavLink href={route('dashboard')}>
                    <HomeIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-black" />
                    <span className="font-medium text-black">لوحة التحكم</span>
                </NavLink>
                <NavLink href={route('patients.index')}>
                    <UsersIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-black" />
                    <span className="font-medium text-black">إدارة المرضى</span>
                </NavLink>
                <NavLink href={route('appointments.index')}>
                    <CalendarIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-black" />
                    <span className="font-medium text-black">إدارة الحجوزات</span>
                </NavLink>
                {(auth.user.role === 'admin' || auth.user.role === 'receptionist') && (
                    <NavLink href={route('payments.index')}>
                        <CreditCardIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-black" />
                        <span className="font-medium text-black">المدفوعات</span>
                    </NavLink>
                )}
                {auth.user.role === 'admin' && (
                    <>
                        <div className="pt-8 pb-4 px-4">
                            <h3 className="text-xs font-bold text-black uppercase tracking-wider flex items-center">
                                <div className="w-8 h-0.5 bg-gray-400 mr-2"></div>
                                الإدارة
                            </h3>
                        </div>
                        <NavLink href={route('users.index')}>
                            <UsersIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-black" />
                            <span className="font-medium text-black">المستخدمين</span>
                        </NavLink>
                        <NavLink href={route('services.index')}>
                            <ClipboardDocumentListIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-black" />
                            <span className="font-medium text-black">الخدمات</span>
                        </NavLink>
                        <NavLink href={route('medical-record-templates.index')}>
                            <DocumentDuplicateIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-black" />
                            <span className="font-medium text-black">ملفات المرضى</span>
                        </NavLink>
                        <NavLink href={route('reports.index')}>
                            <ChartBarIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-black" />
                            <span className="font-medium text-black">التقارير</span>
                        </NavLink>
                        <NavLink href={route('clinics.index')}>
                            <BuildingOffice2Icon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-black" />
                            <span className="font-medium text-black">العيادات</span>
                        </NavLink>
                        <NavLink href={route('doctors.index')}>
                            <UserCircleIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-black" />
                            <span className="font-medium text-black">الأطباء</span>
                        </NavLink>
                        <NavLink href={route('settings.index')}>
                            <Cog6ToothIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-black" />
                            <span className="font-medium text-black">الإعدادات</span>
                        </NavLink>
                    </>
                )}
                {auth.user.role === 'doctor' && (
                     <>
                        <div className="pt-8 pb-4 px-4">
                            <h3 className="text-xs font-bold text-black uppercase tracking-wider flex items-center">
                                <div className="w-8 h-0.5 bg-gray-400 mr-2"></div>
                                منطقة الطبيب
                            </h3>
                        </div>
                        <NavLink href={route('doctor.tool')}>
                            <HomeIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-black" />
                            <span className="font-medium text-black">أدوات الطبيب</span>
                        </NavLink>
                        <NavLink href={route('doctor.agenda')}>
                            <CalendarDaysIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-black" />
                            <span className="font-medium text-black">جدول المواعيد</span>
                        </NavLink>
                        <NavLink href={route('availabilities.index')}>
                            <CalendarDaysIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-black" />
                            <span className="font-medium text-black">أوقات التوفر</span>
                        </NavLink>
                     </>
                )}
            </nav>
        </>
    );


    return (
        <div className="flex h-screen bg-white text-black">
            {/* Static sidebar for desktop */}
            <aside className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-300 shadow-lg">
                        <SidebarContent />
                    </div>
                </div>
            </aside>

            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                {/* Top Header */}
                <header className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="px-4 border-r border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 md:hidden"
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6 text-black" aria-hidden="true" />
                    </button>
                    <div className="flex-1 px-4 flex justify-between">
                        <div className="flex-1 flex items-center">
                            {header && (
                                <div className="text-2xl font-bold text-black">{header}</div>
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
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-black bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {auth.user?.name}
                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4 text-black"
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
                                            <UserCircleIcon className="mr-2 h-5 w-5 text-black"/>
                                            الملف الشخصي
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5 text-black"/>
                                            تسجيل الخروج
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none p-6 bg-white">
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