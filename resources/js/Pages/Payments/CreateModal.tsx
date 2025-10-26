import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Invoice } from '@/types';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';

export default function CreateModal({ show, onClose, invoice }: { show: boolean, onClose: () => void, invoice: Invoice | null }) {
    const { data, setData, post, processing, errors } = useForm({
        invoice_id: invoice?.id || '',
        amount: invoice ? (invoice.total_amount - invoice.paid_amount).toString() : '0',
        payment_method: 'cash',
        transaction_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('transactions.store'), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Record Payment for Invoice #{invoice?.invoice_number}
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-6">
                    <div>
                        <InputLabel htmlFor="amount" value="Amount" />
                        <TextInput
                            id="amount"
                            type="number"
                            name="amount"
                            value={data.amount}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('amount', e.target.value)}
                            required
                        />
                        <InputError message={errors.amount} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="payment_method" value="Payment Method" />
                        <select
                            id="payment_method"
                            name="payment_method"
                            value={data.payment_method}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            onChange={(e) => setData('payment_method', e.target.value)}
                        >
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                            <option value="insurance">Insurance</option>
                        </select>
                        <InputError message={errors.payment_method} className="mt-2" />
                    </div>
                    {data.payment_method !== 'cash' && (
                        <div>
                            <InputLabel htmlFor="transaction_id" value="Transaction ID" />
                            <TextInput
                                id="transaction_id"
                                name="transaction_id"
                                value={data.transaction_id}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('transaction_id', e.target.value)}
                            />
                            <InputError message={errors.transaction_id} className="mt-2" />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button className="ms-3" disabled={processing}>
                        Record Payment
                    </Button>
                </div>
            </form>
        </Modal>
    );
}