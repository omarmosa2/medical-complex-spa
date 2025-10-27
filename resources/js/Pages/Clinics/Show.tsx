import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Show({ auth, clinic }: PageProps<{ clinic: any }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">تفاصيل العيادة</h2>
                    <Link href={route('clinics.index')}>
                        <Button>
                            <ArrowLeftIcon className="h-5 w-5 mr-2" />
                            العودة إلى العيادات
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="تفاصيل العيادة" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">الاسم</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{clinic.name}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">الموقع</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{clinic.location || 'غير محدد'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">الجدول الزمني</h3>
                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                        {clinic.schedules && clinic.schedules.length > 0 ? (
                                            clinic.schedules.map(schedule => (
                                                <div key={schedule.day_of_week} className="mb-1">
                                                    {['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'][schedule.day_of_week - 1]}:
                                                    {schedule.is_active ? `${schedule.start_time} - ${schedule.end_time}` : 'عطلة'}
                                                </div>
                                            ))
                                        ) : (
                                            'غير محدد'
                                        )}
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">الملاحظات</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{clinic.notes || 'غير محدد'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">الوصف</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{clinic.description || 'غير محدد'}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex space-x-2">
                                <Link href={route('clinics.edit', clinic.id)}>
                                    <Button>تعديل</Button>
                                </Link>
                                <Link href={route('clinics.destroy', clinic.id)} method="delete" as="button">
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