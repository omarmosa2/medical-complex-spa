import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Button from '@/Components/Button';
import InputError from '@/Components/InputError';

interface TestApiProps {
    patients: Array<{ id: number; full_name: string }>;
    doctors: Array<{ id: number; user?: { name: string } }>;
    services: Array<{ id: number; name: string }>;
    clinics: Array<{ id: number; name: string }>;
}

export default function TestApi({ patients, doctors, services, clinics }: TestApiProps) {
    const { data, setData, post, processing, errors } = useForm({
        patient_id: patients[0]?.id || '',
        doctor_id: doctors[0]?.id || '',
        service_id: services[0]?.id || '',
        clinic_id: clinics[0]?.id || '',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: '10:00',
        status: 'scheduled',
        notes: 'Test appointment',
        appointment_cost: '100',
        final_amount: '100',
        discount: '0',
    });

    const [result, setResult] = useState<any>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setResult(null);

        console.log('Submitting test data:', data);

        post('/appointments', {
            onSuccess: (response: any) => {
                console.log('Success response:', response);
                setResult({ success: true, response });
            },
            onError: (error: any) => {
                console.log('Error response:', error);
                setResult({ success: false, error });
            },
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto" style={{ direction: 'rtl' }}>
            <h1 className="text-2xl font-bold mb-6 text-center">اختبار إنشاء موعد جديد</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel value="المريض" />
                        <select
                            value={data.patient_id}
                            onChange={(e) => setData('patient_id', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md"
                            required
                        >
                            <option value="">اختر مريض</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.full_name}</option>
                            ))}
                        </select>
                        <InputError message={errors.patient_id} />
                    </div>

                    <div>
                        <InputLabel value="الطبيب" />
                        <select
                            value={data.doctor_id}
                            onChange={(e) => setData('doctor_id', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md"
                            required
                        >
                            <option value="">اختر طبيب</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.id}>
                                    {d.user?.name || `Doctor ${d.id}`}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.doctor_id} />
                    </div>

                    <div>
                        <InputLabel value="الخدمة" />
                        <select
                            value={data.service_id}
                            onChange={(e) => setData('service_id', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md"
                            required
                        >
                            <option value="">اختر خدمة</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.service_id} />
                    </div>

                    <div>
                        <InputLabel value="العيادة" />
                        <select
                            value={data.clinic_id}
                            onChange={(e) => setData('clinic_id', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md"
                        >
                            <option value="">اختر عيادة</option>
                            {clinics.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.clinic_id} />
                    </div>

                    <div>
                        <InputLabel value="تاريخ الموعد" />
                        <TextInput
                            type="date"
                            value={data.appointment_date}
                            onChange={(e) => setData('appointment_date', e.target.value)}
                            required
                        />
                        <InputError message={errors.appointment_date} />
                    </div>

                    <div>
                        <InputLabel value="وقت الموعد" />
                        <TextInput
                            type="time"
                            value={data.appointment_time}
                            onChange={(e) => setData('appointment_time', e.target.value)}
                            required
                        />
                        <InputError message={errors.appointment_time} />
                    </div>

                    <div>
                        <InputLabel value="تكلفة الموعد" />
                        <TextInput
                            type="number"
                            value={data.appointment_cost}
                            onChange={(e) => setData('appointment_cost', e.target.value)}
                            required
                        />
                        <InputError message={errors.appointment_cost} />
                    </div>

                    <div>
                        <InputLabel value="المبلغ النهائي" />
                        <TextInput
                            type="number"
                            value={data.final_amount}
                            onChange={(e) => setData('final_amount', e.target.value)}
                            required
                        />
                        <InputError message={errors.final_amount} />
                    </div>
                </div>

                <div>
                    <InputLabel value="الملاحظات" />
                    <TextInput
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                    />
                    <InputError message={errors.notes} />
                </div>

                <div className="flex justify-center">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3"
                    >
                        {processing ? 'جاري الحفظ...' : 'حفظ الموعد'}
                    </Button>
                </div>
            </form>

            {result && (
                <div className="mt-6 p-4 border rounded">
                    <h3 className="font-semibold mb-2">النتيجة:</h3>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}

            <div className="mt-6 text-sm text-gray-600">
                <p><strong>بيانات الاختبار المتاحة:</strong></p>
                <p>المرضى: {patients.length}, الأطباء: {doctors.length}, الخدمات: {services.length}, العيادات: {clinics.length}</p>
            </div>
        </div>
    );
}