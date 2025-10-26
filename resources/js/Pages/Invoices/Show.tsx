import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps, Invoice } from '@/types';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { useCurrency } from '@/hooks/useCurrency';

export default function Show({ auth, invoice }: PageProps<{ invoice: Invoice }>) {
    const { format } = useCurrency();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Invoice #{invoice.invoice_number}</h2>}
        >
            <Head title={`Invoice #${invoice.invoice_number}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-lg font-bold">Invoice To:</h3>
                                <p>{invoice.patient.name}</p>
                                <p>{invoice.patient.email}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="text-lg font-bold">Invoice Details:</h3>
                                <p>Invoice ID: {invoice.id}</p>
                                <p>Date: {new Date(invoice.created_at).toLocaleDateString()}</p>
                                <p>Status: <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{invoice.status}</span></p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {invoice.items.map(item => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">{format(item.price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td className="px-6 py-3 text-right font-bold uppercase">Total</td>
                                        <td className="px-6 py-3 text-right font-bold">{format(invoice.total_amount)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {invoice.status === 'unpaid' && (
                            <div className="mt-8 text-right">
                                <Button>Pay Now</Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}