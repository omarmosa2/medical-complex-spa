import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Card from '@/Components/Card';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, totalRevenue, totalAppointments, totalPatients, transactions }: PageProps<{ totalRevenue: number, totalAppointments: number, totalPatients: number, transactions: any[] }>) {
    // ترجمة أنواع المعاملات
    const getTransactionTypeTranslation = (type: string) => {
        const types: { [key: string]: string } = {
            'credit': 'إيداع',
            'debit': 'سحب',
            'payment': 'دفع',
            'refund': 'استرداد'
        };
        return types[type] || type;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center" dir="rtl">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">التقارير</h2>
                </div>
            }
        >
            <Head title="التقارير" />

            <div className="py-12" dir="rtl">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 text-right">إجمالي الإيرادات</h3>
                            <p className="mt-1 text-3xl font-semibold text-indigo-600 text-right">${Number(totalRevenue).toFixed(2)}</p>
                        </Card>
                        <Card>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 text-right">إجمالي الحجوزات</h3>
                            <p className="mt-1 text-3xl font-semibold text-indigo-600 text-right">{totalAppointments}</p>
                        </Card>
                        <Card>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 text-right">إجمالي المرضى</h3>
                            <p className="mt-1 text-3xl font-semibold text-indigo-600 text-right">{totalPatients}</p>
                        </Card>
                    </div>

                    <div className="mt-8">
                        <Card>
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">المعاملات الأخيرة</h3>
                                <div className="flex space-x-reverse space-x-2">
                                    <a href={route('reports.export')}>
                                        <PrimaryButton>تصدير إلى Excel</PrimaryButton>
                                    </a>
                                    <a href={route('reports.exportPdf')}>
                                        <SecondaryButton>تصدير إلى PDF</SecondaryButton>
                                    </a>
                                </div>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mt-4">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">المستخدم</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">النوع</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">المبلغ</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الوصف</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">التاريخ</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">{transaction.user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">{getTransactionTypeTranslation(transaction.type)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">${Number(transaction.amount).toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">{transaction.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">{new Date(transaction.created_at).toLocaleDateString('ar')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}