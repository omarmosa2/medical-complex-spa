import { PageProps, PaginatedResponse, Doctor } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import TextInput from '@/Components/TextInput';
import { PlusIcon, UserGroupIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, doctors, search, stats }: PageProps<{ doctors: PaginatedResponse<Doctor>; search?: string; stats: any }>) {
    const [searchQuery, setSearchQuery] = useState(search || '');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        router.get(route('doctors.index'), { search: query }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">الأطباء</h2>
                    <Link href={route('doctors.create')}>
                        <Button>
                            <PlusIcon className="h-5 w-5 mr-2" />
                            إضافة طبيب
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="الأطباء" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
                        <Card>
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-500 rounded-lg">
                                        <UserGroupIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي الأطباء</p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.total_doctors}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-500 rounded-lg">
                                        <UserGroupIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">الأطباء النشطون</p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.active_doctors}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Search and Filter */}
                    <div className="mb-6">
                        <TextInput
                            placeholder="البحث في الأطباء..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="max-w-md"
                        />
                    </div>

                    <Card>
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        الاسم
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        البريد الإلكتروني
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        التخصص
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        العيادة
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        نسبة الدفع %
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">الإجراءات</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {doctors.data.length > 0 ? (
                                    doctors.data.map((doctor) => (
                                        <tr key={doctor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{doctor.user?.name || doctor.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{doctor.user?.email || 'غير محدد'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{doctor.specialization}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{doctor.clinic?.name || 'غير محدد'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{doctor.payment_percentage}%</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link href={route('doctors.show', doctor.id)} className="text-blue-600 hover:text-blue-900">
                                                        <EyeIcon className="h-5 w-5" />
                                                    </Link>
                                                    <Link href={route('doctors.edit', doctor.id)} className="text-indigo-600 hover:text-indigo-900">
                                                        <PencilIcon className="h-5 w-5" />
                                                    </Link>
                                                    <Link href={route('doctors.destroy', doctor.id)} method="delete" as="button" className="text-red-600 hover:text-red-900">
                                                        <TrashIcon className="h-5 w-5" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12">
                                            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">لم يتم العثور على أطباء</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ابدأ بإنشاء طبيب جديد.</p>
                                            <div className="mt-6">
                                                <Link href={route('doctors.create')}>
                                                    <Button>
                                                        <PlusIcon className="h-5 w-5 mr-2" />
                                                        إضافة طبيب
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {doctors.meta && doctors.meta.last_page > 1 && (
                            <div className="mt-4 flex justify-center space-x-2">
                                {doctors.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                                            link.active
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        preserveState
                                    />
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}