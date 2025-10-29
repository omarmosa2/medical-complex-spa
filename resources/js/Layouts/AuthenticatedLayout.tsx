import { useState, PropsWithChildren } from 'react';
// @ts-ignore
import ApplicationLogo from '@/Components/ApplicationLogo.jsx';
// @ts-ignore
import Dropdown from '@/Components/Dropdown.jsx';
// @ts-ignore
import NavLink from '@/Components/NavLink.jsx';
// @ts-ignore
import ResponsiveNavLink from '@/Components/ResponsiveNavLink.jsx';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';
// @ts-ignore
import NotificationDropdown from '@/Components/NotificationDropdown.jsx';
import ThemeToggle from '@/Components/ThemeToggle';
import { useThemeClasses } from '@/Components/ThemeProvider';
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
    const themeClasses = useThemeClasses();

    const SidebarContent = () => (
        <>
            <div className={`h-20 flex items-center justify-center flex-shrink-0 px-6 ${themeClasses.bgSecondary} border-b border-border shadow-lg bg-gradient-to-b from-transparent to-muted/50`}>
                <Link href="/" className="hover:opacity-80 transition-all duration-300 hover:scale-105">
                    <img src="" className="block h-12 w-auto filter drop-shadow-sm" />
                </Link>
            </div>
            <nav className="mt-6 flex-1 px-4 pb-6 space-y-1 overflow-y-auto">
                <div className="rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                <NavLink href={route('dashboard')}>
                    <HomeIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-foreground" />
                    <span className={`font-medium ${themeClasses.textPrimary}`}>لوحة التحكم</span>
                </NavLink>
                </div>
                <div className="rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                <NavLink href={route('patients.index')}>
                    <UsersIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-foreground" />
                    <span className={`font-medium ${themeClasses.textPrimary}`}>إدارة المرضى</span>
                </NavLink>
                </div>
                <div className="rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                <NavLink href={route('appointments.index')}>
                    <CalendarIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-foreground" />
                    <span className={`font-medium ${themeClasses.textPrimary}`}>إدارة الحجوزات</span>
                </NavLink>
                </div>
                {(auth.user.role === 'admin' || auth.user.role === 'receptionist') && (
                    <div className="rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                    <NavLink href={route('payments.index')}>
                        <CreditCardIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-foreground" />
                        <span className={`font-medium ${themeClasses.textPrimary}`}>المدفوعات</span>
                    </NavLink>
                    </div>
                )}
                {auth.user.role === 'admin' && (
                    <>
                        <div className="pt-8 pb-4 px-4">
                            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center ${themeClasses.textPrimary}`}>
                                <div className="w-8 h-0.5 bg-muted mr-2"></div>
                                الإدارة
                            </h3>
                        </div>
                        <div className="rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                        <NavLink href={route('users.index')}>
                            <UsersIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-foreground" />
                            <span className={`font-medium ${themeClasses.textPrimary}`}>المستخدمين</span>
                        </NavLink>
                        </div>
                        <div className="rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                        <NavLink href={route('services.index')}>
                            <ClipboardDocumentListIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-foreground" />
                            <span className={`font-medium ${themeClasses.textPrimary}`}>الخدمات</span>
                        </NavLink>
                        </div>
                        <div className="rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                        <NavLink href={route('medical-record-templates.index')}>
                            <DocumentDuplicateIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-foreground" />
                            <span className={`font-medium ${themeClasses.textPrimary}`}>ملفات المرضى</span>
                        </NavLink>
                        </div>
                        <div className="rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                        <NavLink href={route('reports.index')}>
                            <ChartBarIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-foreground" />
                            <span className={`font-medium ${themeClasses.textPrimary}`}>التقارير</span>
                        </NavLink>
                        </div>
                        <div className="rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                        <NavLink href={route('payments.index')}>
                            <CreditCardIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-foreground" />
                            <span className={`font-medium ${themeClasses.textPrimary}`}>المدفوعات</span>
                        </NavLink>
                        </div>
                        <div className="rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                        <NavLink href={route('salaries.index')}>
                            <ChartBarIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-foreground" />
                            <span className={`font-medium ${themeClasses.textPrimary}`}>الرواتب</span>
                        </NavLink>
                        </div>
                        <div className="rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                        <NavLink href={route('clinics.index')}>
                            <BuildingOffice2Icon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-foreground" />
                            <span className={`font-medium ${themeClasses.textPrimary}`}>العيادات</span>
                        </NavLink>
                        </div>
                        <div className="rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                        <NavLink href={route('doctors.index')}>
                            <UserCircleIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-foreground" />
                            <span className={`font-medium ${themeClasses.textPrimary}`}>الأطباء</span>
                        </NavLink>
                        </div>
                        <div className="rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                        <NavLink href={route('settings.index')}>
                            <Cog6ToothIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-foreground" />
                            <span className={`font-medium ${themeClasses.textPrimary}`}>الإعدادات</span>
                        </NavLink>
                        </div>
                    </>
                )}
                {auth.user.role === 'doctor' && (
                     <>
                        <div className="pt-8 pb-4 px-4">
                            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center ${themeClasses.textPrimary}`}>
                                <div className="w-8 h-0.5 bg-muted mr-2"></div>
                                منطقة الطبيب
                            </h3>
                        </div>
                        <div className="rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                        <NavLink href={route('doctor.tool')}>
                            <HomeIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-foreground" />
                            <span className={`font-medium ${themeClasses.textPrimary}`}>أدوات الطبيب</span>
                        </NavLink>
                        </div>
                        <div className="rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                        <NavLink href={route('doctor.agenda')}>
                            <CalendarDaysIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-foreground" />
                            <span className={`font-medium ${themeClasses.textPrimary}`}>جدول المواعيد</span>
                        </NavLink>
                        </div>
                        <div className="rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                        <NavLink href={route('availabilities.index')}>
                            <CalendarDaysIcon className="mr-3 flex-shrink-0 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-foreground" />
                            <span className={`font-medium ${themeClasses.textPrimary}`}>أوقات التوفر</span>
                        </NavLink>
                        </div>
                     </>
                )}
            </nav>
        </>
    );

    return (
        <div className={`flex h-screen ${themeClasses.bgPrimary} ${themeClasses.textPrimary}`}>
            {/* Static sidebar for desktop */}
            <aside className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className={`flex flex-col h-0 flex-1 ${themeClasses.bgSecondary} border-r border-border shadow-lg`}>
                        <SidebarContent />
                    </div>
                </div>
            </aside>

            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                {/* Top Header */}
                <header className={`relative z-10 flex-shrink-0 flex h-16 ${themeClasses.bgSecondary} shadow`}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`px-4 border-r border-${themeClasses.textPrimary} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden`}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className={`h-6 w-6 ${themeClasses.textPrimary}`} aria-hidden="true" />
                    </button>
                    <div className="flex-1 px-4 flex justify-between">
                        <div className="flex-1 flex items-center">
                            {header && (
                                <div className={`text-2xl font-bold ${themeClasses.textPrimary}`}>{header}</div>
                            )}
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            <ThemeToggle />
                            {/* Profile dropdown */}
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${themeClasses.textPrimary} ${themeClasses.bgSecondary} hover:text-muted-foreground focus:outline-none transition ease-in-out duration-150`}
                                            >
                                                {auth.user?.name}
                                                <svg
                                                    className={`ms-2 -me-0.5 h-4 w-4 ${themeClasses.textPrimary}`}
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
                                            <UserCircleIcon className="mr-2 h-5 w-5 text-foreground"/>
                                            الملف الشخصي
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5 text-foreground"/>
                                            تسجيل الخروج
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className={`flex-1 relative overflow-y-auto focus:outline-none ${themeClasses.bgPrimary}`}>
                    {children}
                </main>
            </div>
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    className: '',
                    style: {
                        background: 'hsl(var(--card))',
                        color: 'hsl(var(--card-foreground))',
                        border: '1px solid hsl(var(--border))',
                    },
                }}
            />
        </div>
    );
}