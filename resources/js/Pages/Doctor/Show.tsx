import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Show({ auth, doctor }: PageProps<{ doctor: any }>) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">تفاصيل الطبيب</h2>
                    <Link href={route('doctors.index')}>
                        <Button>
                            <ArrowLeftIcon className="h-5 w-5 mr-2" />
                            العودة إلى الأطباء
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="تفاصيل الطبيب" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">الاسم</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{doctor.user?.name || doctor.name}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">البريد الإلكتروني</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{doctor.user?.email || 'غير محدد'}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">التخصص</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{doctor.specialization}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">العيادة</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{doctor.clinic?.name || 'غير محدد'}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">نسبة الدفع %</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{doctor.payment_percentage}%</p>
                                </div>
                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">السيرة الذاتية</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{doctor.bio || 'غير محدد'}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex space-x-2">
                                <Link href={route('doctors.edit', doctor.id)}>
                                    <Button>تعديل</Button>
                                </Link>
                                <Link href={route('doctors.destroy', doctor.id)} method="delete" as="button">
                                    <Button className="bg-red-600 hover:bg-red-700">حذف</Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}