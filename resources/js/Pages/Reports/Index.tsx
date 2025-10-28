import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { PlusIcon, ArrowDownTrayIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

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
                    <h2 className="font-semibold text-xl text-foreground leading-tight">التقارير</h2>
                </div>
            }
        >
            <Head title="التقارير" />

            <div className="p-6" dir="rtl">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="bg-gradient-to-br from-primary-50 via-primary-100/20 to-transparent dark:from-primary-900/20 dark:to-transparent border border-primary-200 dark:border-primary-700 shadow-xl hover:shadow-primary-500/20 transition-all duration-300 p-6 rounded-xl">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-foreground mb-2">إجمالي الإيرادات</h3>
                            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">${Number(totalRevenue).toFixed(2)}</p>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-primary-50 via-primary-100/20 to-transparent dark:from-primary-900/20 dark:to-transparent border border-primary-200 dark:border-primary-700 shadow-xl hover:shadow-primary-500/20 transition-all duration-300 p-6 rounded-xl">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-foreground mb-2">إجمالي الحجوزات</h3>
                            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{totalAppointments}</p>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-primary-50 via-primary-100/20 to-transparent dark:from-primary-900/20 dark:to-transparent border border-primary-200 dark:border-primary-700 shadow-xl hover:shadow-primary-500/20 transition-all duration-300 p-6 rounded-xl">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-foreground mb-2">إجمالي المرضى</h3>
                            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{totalPatients}</p>
                        </div>
                    </Card>
                </div>

                {/* Transactions Table */}
                <Card className="border border-border shadow-lg rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-foreground">المعاملات الأخيرة</h3>
                            <div className="flex space-x-4">
                                <Link href={route('reports.export')}>
                                    <Button>
                                        <ArrowDownTrayIcon className="h-5 w-5 ml-2" />
                                        تصدير إلى Excel
                                    </Button>
                                </Link>
                                <Link href={route('reports.exportPdf')}>
                                    <Button>
                                        <DocumentArrowDownIcon className="h-5 w-5 ml-2" />
                                        تصدير إلى PDF
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">المستخدم</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">النوع</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">المبلغ</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">الوصف</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {transactions.map((transaction: any) => (
                                <tr key={transaction.id} className="hover:bg-muted transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground text-center">{transaction.user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{getTransactionTypeTranslation(transaction.type)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">${Number(transaction.amount).toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{transaction.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{new Date(transaction.created_at).toLocaleDateString('ar')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}