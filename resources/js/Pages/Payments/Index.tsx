import { PageProps, PaginatedResponse } from '@/types';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { PlusIcon, CreditCardIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, payments }: PageProps<{ payments: PaginatedResponse<any> }>) {
    // ترجمة طرق الدفع وحالات الدفع
    const getPaymentMethodTranslation = (method: string) => {
        const methods: { [key: string]: string } = {
            'cash': 'نقدي',
            'card': 'بطاقة ائتمان',
            'bank_transfer': 'تحويل بنكي',
            'check': 'شيك'
        };
        return methods[method] || method;
    };

    const getStatusTranslation = (status: string) => {
        const statuses: { [key: string]: string } = {
            'paid': 'مدفوع',
            'pending': 'معلق',
            'failed': 'فشل',
            'cancelled': 'ملغي'
        };
        return statuses[status] || status;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center" dir="rtl">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">المدفوعات</h2>
                    <Link href={route('payments.create')}>
                        <Button>
                            <PlusIcon className="h-5 w-5 ml-2" />
                            إضافة دفعة
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="المدفوعات" />

            <div className="py-12" dir="rtl">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        المريض
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        الخدمة
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        المبلغ
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        طريقة الدفع
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        الحالة
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">الإجراءات</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {payments.data.length > 0 ? (
                                    payments.data.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                                                {payment.appointment?.patient?.full_name || payment.patient?.full_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                                                {payment.appointment?.service?.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                                                ${payment.amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                                                {getPaymentMethodTranslation(payment.payment_method)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {getStatusTranslation(payment.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                <Link href={route('payments.show', payment.id)} className="text-primary-600 hover:text-primary-900 ml-4 font-semibold">
                                                    عرض
                                                </Link>
                                                <Link href={route('payments.edit', payment.id)} className="text-indigo-600 hover:text-indigo-900 font-semibold">
                                                    تعديل
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12">
                                            <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">لا توجد مدفوعات</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ابدأ بإضافة دفعة جديدة.</p>
                                            <div className="mt-6">
                                                <Link href={route('payments.create')}>
                                                    <Button>
                                                        <PlusIcon className="h-5 w-5 ml-2" />
                                                        إضافة دفعة
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