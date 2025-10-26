import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';

export default function Edit({ auth, payment, patients, appointments }: { auth: { user: any }, payment: any, patients: any[], appointments: any[] }) {
    const { data, setData, put, processing, errors } = useForm({
        patient_id: payment.patient_id,
        appointment_id: payment.appointment_id,
        amount: payment.amount,
        payment_method: payment.payment_method,
        transaction_id: payment.transaction_id,
        status: payment.status,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('payments.update', payment.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Edit Payment"
        >
            <Head title="Edit Payment" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="mb-4">
                            <InputLabel htmlFor="patient_id" value="Patient" />
                            <select
                                id="patient_id"
                                name="patient_id"
                                value={data.patient_id}
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                                onChange={(e) => setData('patient_id', e.target.value)}
                                required
                            >
                                <option value="">Select Patient</option>
                                {patients && patients.filter(patient => patient).map((patient) => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.patient_id} className="mt-2" />
                        </div>
                        <div className="mb-4">
                            <InputLabel htmlFor="appointment_id" value="Appointment" />
                            <select
                                id="appointment_id"
                                name="appointment_id"
                                value={data.appointment_id}
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                                onChange={(e) => setData('appointment_id', e.target.value)}
                                required
                            >
                                <option value="">Select Appointment</option>
                                {appointments && appointments.filter(appointment => appointment && appointment.patient).map((appointment) => (
                                    <option key={appointment.id} value={appointment.id}>
                                        {appointment.id} - {appointment.patient.name} ({appointment.appointment_date})
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.appointment_id} className="mt-2" />
                        </div>

                        <div className="mb-4">
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

                        <div className="mb-4">
                            <InputLabel htmlFor="payment_method" value="Payment Method" />
                            <select
                                id="payment_method"
                                name="payment_method"
                                value={data.payment_method}
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                                onChange={(e) => setData('payment_method', e.target.value)}
                            >
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="insurance">Insurance</option>
                            </select>
                            <InputError message={errors.payment_method} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="transaction_id" value="Transaction ID" />
                            <TextInput
                                id="transaction_id"
                                type="text"
                                name="transaction_id"
                                value={data.transaction_id}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('transaction_id', e.target.value)}
                            />
                            <InputError message={errors.transaction_id} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="status" value="Status" />
                            <select
                                id="status"
                                name="status"
                                value={data.status}
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                                onChange={(e) => setData('status', e.target.value)}
                            >
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="refunded">Refunded</option>
                            </select>
                            <InputError message={errors.status} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            <Button className="ms-4" disabled={processing}>
                                Update Payment
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}