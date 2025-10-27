import { PageProps, Paginated } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import TextInput from '@/Components/TextInput';
import { PlusIcon, UsersIcon, MagnifyingGlassIcon, UserGroupIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';
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
    const [search, setSearch] = useState(filters.search || '');
    const [nameFilter, setNameFilter] = useState(filters.name || '');
    const [phoneFilter, setPhoneFilter] = useState(filters.phone || '');
    const [fileNumberFilter, setFileNumberFilter] = useState(filters.file_number || '');

    const handleApplyFilters = () => {
        router.get(route('patients.index'), {
            search,
            name: nameFilter,
            phone: phoneFilter,
            file_number: fileNumberFilter,
        }, { preserveState: true });
    };

    const handleClearFilters = () => {
        setSearch('');
        setNameFilter('');
        setPhoneFilter('');
        setFileNumberFilter('');
        router.get(route('patients.index'), {}, { preserveState: true });
    };

    useEffect(() => {
        setSearch(filters.search || '');
        setNameFilter(filters.name || '');
        setPhoneFilter(filters.phone || '');
        setFileNumberFilter(filters.file_number || '');
    }, [filters]);

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
                <Card className="border border-gray-200 dark:border-gray-700 shadow-md">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">البحث والفلترة</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">البحث</label>
                                <div className="relative">
                                    <TextInput
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="ابحث في الاسم، الهاتف، أو رقم الملف"
                                        className="pl-10"
                                    />
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">فلترة بالاسم</label>
                                <select
                                    value={nameFilter}
                                    onChange={(e) => setNameFilter(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                                >
                                    <option value="">الكل</option>
                                    {filterOptions.names.map((name: string) => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">فلترة بالهاتف</label>
                                <select
                                    value={phoneFilter}
                                    onChange={(e) => setPhoneFilter(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                                >
                                    <option value="">الكل</option>
                                    {filterOptions.phones.map((phone: string) => (
                                        <option key={phone} value={phone}>{phone}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">فلترة برقم الملف</label>
                                <select
                                    value={fileNumberFilter}
                                    onChange={(e) => setFileNumberFilter(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                                >
                                    <option value="">الكل</option>
                                    {filterOptions.file_numbers.map((fileNumber: string) => (
                                        <option key={fileNumber} value={fileNumber}>{fileNumber}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4 space-x-2">
                            <Button onClick={handleClearFilters} className="bg-gray-500 hover:bg-gray-600">مسح الفلاتر</Button>
                            <Button onClick={handleApplyFilters}>تطبيق الفلاتر</Button>
                        </div>
                    </div>
                </Card>

                {/* Table */}
                <Card className="border border-gray-200 dark:border-gray-700 shadow-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        الاسم
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        الهاتف
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        رقم الملف
                                    </th>
                                    <th scope="col" className="relative px-6 py-3 text-center">
                                        <span className="sr-only">الإجراءات</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {patients.data.length > 0 ? (
                                    patients.data.map((patient: any) => (
                                        <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900 dark:text-gray-100">{patient.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">{patient.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">{patient.file_number}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <Link href={route('patients.show', patient.id)} className="text-primary-600 hover:text-primary-900 ml-4 font-semibold">
                                                    عرض
                                                </Link>
                                                <Link href={route('patients.edit', patient.id)} className="text-indigo-600 hover:text-indigo-900 font-semibold">
                                                    تعديل
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-12">
                                            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">لا توجد مرضى</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ابدأ بإنشاء مريض جديد.</p>
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