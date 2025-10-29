import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';
import { useForm } from '@inertiajs/react';
import { useEffect, useMemo } from 'react';

interface Props {
    show: boolean;
    onClose: () => void;
    patients: Array<{ id: number; full_name?: string; name?: string }>;
    appointments: Array<{ id: number; patient_id: number; appointment_date: string; appointment_time?: string; patient?: any }>
}

export default function PaymentCreateModal({ show, onClose, patients, appointments }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        patient_id: '',
        appointment_id: '',
        amount: '',
        payment_method: 'cash',
        transaction_id: '',
        status: 'paid',
    });

    const closeAndReset = () => {
        reset();
        onClose();
    };

    const filteredAppointments = useMemo(() => {
        if (!data.patient_id) return appointments;
        return appointments.filter(a => String(a.patient_id) === String(data.patient_id));
    }, [appointments, data.patient_id]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('payments.store'), {
            onSuccess: closeAndReset,
        });
    };

    return (
        <Modal show={show} onClose={closeAndReset} maxWidth="2xl">
            <div className="p-6" style={{ direction: 'rtl' }}>
                <h3 className="text-xl font-semibold text-foreground mb-4">إضافة دفعة جديدة</h3>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="patient_id" value="المريض" />
                            <select id="patient_id" name="patient_id" value={data.patient_id} className="mt-1 block w-full border-input bg-background text-foreground focus:border-primary focus:ring-primary rounded-md shadow-sm" onChange={(e) => setData('patient_id', e.target.value)} required>
                                <option value="">اختر المريض</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.full_name || p.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.patient_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="appointment_id" value="الموعد" />
                            <select id="appointment_id" name="appointment_id" value={data.appointment_id} className="mt-1 block w-full border-input bg-background text-foreground focus:border-primary focus:ring-primary rounded-md shadow-sm" onChange={(e) => setData('appointment_id', e.target.value)} required>
                                <option value="">اختر الموعد</option>
                                {filteredAppointments.map(a => (
                                    <option key={a.id} value={a.id}>
                                        {a.patient?.full_name || a.patient?.name} — {a.appointment_date}{a.appointment_time ? ` ${a.appointment_time}` : ''}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.appointment_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="amount" value="المبلغ" />
                            <TextInput id="amount" name="amount" type="number" value={data.amount} className="mt-1 block w-full" onChange={(e) => setData('amount', e.target.value)} required />
                            <InputError message={errors.amount} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="payment_method" value="طريقة الدفع" />
                            <select id="payment_method" name="payment_method" value={data.payment_method} className="mt-1 block w-full border-input bg-background text-foreground focus:border-primary focus:ring-primary rounded-md shadow-sm" onChange={(e) => setData('payment_method', e.target.value)}>
                                <option value="cash">نقدي</option>
                                <option value="card">بطاقة</option>
                                <option value="insurance">تأمين</option>
                            </select>
                            <InputError message={errors.payment_method} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="transaction_id" value="رقم العملية (اختياري)" />
                            <TextInput id="transaction_id" name="transaction_id" value={data.transaction_id} className="mt-1 block w-full" onChange={(e) => setData('transaction_id', e.target.value)} />
                            <InputError message={errors.transaction_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="status" value="الحالة" />
                            <select id="status" name="status" value={data.status} className="mt-1 block w-full border-input bg-background text-foreground focus:border-primary focus:ring-primary rounded-md shadow-sm" onChange={(e) => setData('status', e.target.value)}>
                                <option value="paid">مدفوع</option>
                                <option value="pending">معلق</option>
                                <option value="refunded">مُسترد</option>
                            </select>
                            <InputError message={errors.status} className="mt-2" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" className="bg-muted text-foreground hover:bg-muted/80" onClick={closeAndReset}>إلغاء</Button>
                        <Button disabled={processing}>حفظ الدفعة</Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}


