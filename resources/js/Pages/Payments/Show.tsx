import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Show({ auth, payment }: { auth: { user: any }, payment: any }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Payment Details"
        >
            <Head title="Payment Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card className="p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{payment.id}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Appointment</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {payment.appointment?.patient?.name} - {payment.appointment?.service?.name}
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">${payment.amount}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{payment.payment_method}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transaction ID</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{payment.transaction_id || 'N/A'}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {payment.status}
                            </span>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created At</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{new Date(payment.created_at).toLocaleString()}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Updated At</label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{new Date(payment.updated_at).toLocaleString()}</p>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <Link href={route('payments.edit', payment.id)}>
                                <Button>Edit Payment</Button>
                            </Link>
                            <Link href={route('payments.index')}>
                                <SecondaryButton>Back to Payments</SecondaryButton>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}