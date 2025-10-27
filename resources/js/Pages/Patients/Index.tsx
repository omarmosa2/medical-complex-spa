import { PageProps, Paginated } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import SearchAndFilter from '@/Components/SearchAndFilter';
import { PlusIcon, UsersIcon, UserGroupIcon, CalendarDaysIcon, ClockIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
}

const StatCard = ({ title, value, icon: Icon }: StatCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
    >
        <Card className="bg-gradient-to-br from-primary-50 via-primary-100/20 to-transparent dark:from-primary-900/20 dark:to-transparent border border-primary-200 dark:border-primary-700 shadow-xl hover:shadow-primary-500/20 transition-all duration-300 p-6 rounded-xl">
            <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                    <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                        {value}
                    </p>
                </div>
            </div>
        </Card>
    </motion.div>
);

export default function Index({ auth, patients, stats, filters, filterOptions }: PageProps<{ patients: Paginated<any>, stats: any, filters: any, filterOptions: any }>) {
    const filterConfig = [
        { key: 'full_name', label: 'الاسم الثلاثي', options: filterOptions.full_names || [] },
        { key: 'gender', label: 'الجنس', options: filterOptions.genders || [] },
        { key: 'age', label: 'العمر', options: filterOptions.ages || [] },
        { key: 'residence', label: 'مكان الإقامة', options: filterOptions.residences || [] },
        { key: 'phone', label: 'الهاتف', options: filterOptions.phones || [] },
        { key: 'email', label: 'الإيميل', options: filterOptions.emails || [] },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center" dir="rtl">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">المرضى</h2>
                </div>
            }
        >
            <Head title="المرضى" />

            <div className="p-8 space-y-10 bg-gray-50 dark:bg-gray-900 min-h-screen" dir="rtl">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: "إجمالي المرضى", value: stats.total_patients, icon: UserGroupIcon },
                        { title: "المرضى ذوي الحجوزات", value: stats.patients_with_appointments, icon: CalendarDaysIcon },
                        { title: "المرضى الجدد (30 يوم)", value: stats.recent_patients, icon: ClockIcon },
                    ].map((item, i) => (
                        <StatCard key={i} title={item.title} value={item.value} icon={item.icon} />
                    ))}
                </div>

                {/* Search and Filters */}
                <SearchAndFilter
                    searchPlaceholder="ابحث في الاسم، الهاتف، الإيميل، أو مكان الإقامة"
                    filters={filterConfig}
                    currentFilters={filters}
                    routeName="patients.index"
                    debounceMs={300}
                />

                {/* Table */}
                <Card className="border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        الاسم الثلاثي
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        الجنس
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        العمر
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        مكان الإقامة
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        الهاتف
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        الإيميل
                                    </th>
                                    <th scope="col" className="relative px-6 py-3 text-center">
                                        <span className="sr-only">الإجراءات</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {patients.data.length > 0 ? (
                                    patients.data.map((patient: any, index: number) => {
                                        const sequentialNumber = (patients.current_page - 1) * patients.per_page + index + 1;
                                        return (
                                            <tr key={patient.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900 dark:text-gray-100">{sequentialNumber}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900 dark:text-gray-100">{patient.full_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">{patient.gender === 'male' ? 'ذكر' : 'أنثى'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">{patient.age}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">{patient.residence}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">{patient.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">{patient.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <div className="flex justify-center space-x-2">
                                                    <Link href={route('patients.show', patient.id)} className="text-blue-600 hover:text-blue-900 p-1 rounded" title="عرض">
                                                        <EyeIcon className="w-5 h-5" />
                                                    </Link>
                                                    <Link href={route('patients.edit', patient.id)} className="text-green-600 hover:text-green-900 p-1 rounded" title="تعديل">
                                                        <PencilIcon className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('هل أنت متأكد من حذف هذا المريض؟')) {
                                                                router.delete(route('patients.destroy', patient.id));
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded" title="حذف"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="text-center py-12">
                                            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {Object.keys(filters).length > 0 ? 'لا يوجد بيانات مطابقة' : 'لا توجد مرضى'}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                {Object.keys(filters).length > 0 ? 'جرب تعديل معايير البحث أو الفلترة.' : 'ابدأ بإنشاء مريض جديد.'}
                                            </p>
                                            <div className="mt-6">
                                                <Link href={route('patients.create')}>
                                                    <Button>
                                                        <PlusIcon className="h-5 w-5 ml-2" />
                                                        إضافة مريض
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Pagination */}
                <div className="flex justify-center">
                    {patients.links && patients.links.map((link: any, index: number) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`px-3 py-2 mx-1 text-sm font-medium rounded-md ${link.active ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            preserveState
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}