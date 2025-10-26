import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Card from '@/Components/Card';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, totalRevenue, totalAppointments, totalPatients, transactions }: PageProps<{ totalRevenue: number, totalAppointments: number, totalPatients: number, transactions: any[] }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Reports</h2>}
        >
            <Head title="Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Total Revenue</h3>
                            <p className="mt-1 text-3xl font-semibold text-indigo-600">${Number(totalRevenue).toFixed(2)}</p>
                        </Card>
                        <Card>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Total Appointments</h3>
                            <p className="mt-1 text-3xl font-semibold text-indigo-600">{totalAppointments}</p>
                        </Card>
                        <Card>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Total Patients</h3>
                            <p className="mt-1 text-3xl font-semibold text-indigo-600">{totalPatients}</p>
                        </Card>
                    </div>

                    <div className="mt-8">
                        <Card>
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recent Transactions</h3>
                                <div className="flex space-x-2">
                                    <a href={route('reports.export')}>
                                        <PrimaryButton>Export to Excel</PrimaryButton>
                                    </a>
                                    <a href={route('reports.exportPdf')}>
                                        <SecondaryButton>Export to PDF</SecondaryButton>
                                    </a>
                                </div>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mt-4">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{transaction.user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{transaction.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${Number(transaction.amount).toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{transaction.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(transaction.created_at).toLocaleDateString()}</td>
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