import { PageProps, Paginated } from '@/types';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { PlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { useCurrency } from '@/hooks/useCurrency';

export default function Index({ auth, services }: PageProps<{ services: Paginated<any> }>) {
    const { format } = useCurrency();

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center" dir="rtl">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">الخدمات</h2>
                </div>
            }
        >
            <Head title="الخدمات" />

            <div className="py-12" dir="rtl">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">قائمة الخدمات</h3>
                            <Link href={route('services.create')}>
                                <Button>إضافة خدمة</Button>
                            </Link>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الاسم</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">السعر</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المدة (بالدقائق)</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {services.data.length > 0 ? (
                                    services.data.map((service) => (
                                        <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">{service.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">{service.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">{format(service.price)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                <Link href={route('services.edit', service.id)} className="text-indigo-600 hover:text-indigo-900 font-semibold">
                                                    تعديل
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-12">
                                            <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">لا توجد خدمات</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ابدأ بإضافة خدمة جديدة.</p>
                                            <div className="mt-6">
                                                <Link href={route('services.create')}>
                                                    <Button>
                                                        <PlusIcon className="h-5 w-5 ml-2" />
                                                        إضافة خدمة
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}