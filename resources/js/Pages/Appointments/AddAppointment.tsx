import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Patient, Doctor, Service, Clinic } from '@/types';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';

interface AddAppointmentProps {
    patients: Patient[];
    doctors: Doctor[];
    services: Service[];
    clinics: Clinic[];
    defaultDate: string;
    defaultTime: string;
}

interface PatientData {
    id: number;
    name: string; // هذا يجب أن يكون full_name
    gender: 'male' | 'female';
    age: number;
    date_of_birth: string;
    phone: string;
    address?: string;
}

export default function AddAppointment({
    patients,
    doctors,
    services,
    clinics,
    defaultDate,
    defaultTime
}: AddAppointmentProps) {
    const { data, setData, post, processing, errors } = useForm({
        appointment_date: defaultDate,
        appointment_time: defaultTime,
        patient_id: '',
        patient_gender: '',
        patient_age: '',
        doctor_id: '',
        clinic_id: '',
        service_id: '',
        appointment_cost: '',
        discount: '',
        final_amount: '',
        notes: '',
        status: 'scheduled',
    });

    const [selectedPatientData, setSelectedPatientData] = useState<PatientData | null>(null);
    const [loadingPatient, setLoadingPatient] = useState(false);

    // حساب المبلغ النهائي تلقائياً (الخصم رقم ثابت وليس نسبة)
    useEffect(() => {
        const cost = parseFloat(data.appointment_cost as any) || 0;
        const discountValue = parseFloat(data.discount as any) || 0;
        const finalAmount = Math.max(cost - discountValue, 0);
        if (!isNaN(finalAmount)) setData('final_amount', finalAmount.toFixed(2));
    }, [data.appointment_cost, data.discount]);

    // جلب بيانات المريض عند الاختيار
    const handlePatientChange = async (patientId: string) => {
        setData('patient_id', patientId);
        
        if (patientId) {
            setLoadingPatient(true);
            try {
                console.log('Fetching patient data for ID:', patientId);
                const response = await fetch(`/patients/${patientId}/data`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const patientData = await response.json();
                console.log('Patient data received:', patientData);
                
                setSelectedPatientData(patientData);
                setData('patient_gender', patientData.gender === 'male' ? 'ذكر' : 'أنثى');
                setData('patient_age', patientData.age.toString());
            } catch (error) {
                console.error('Error fetching patient data:', error);
                alert('حدث خطأ في جلب بيانات المريض. يرجى المحاولة مرة أخرى.');
            } finally {
                setLoadingPatient(false);
            }
        } else {
            setSelectedPatientData(null);
            setData('patient_gender', '');
            setData('patient_age', '');
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Submit with separate date and time fields
        post(route('appointments.store'), {
            onSuccess: () => window.history.back(),
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6" style={{ direction: 'rtl' }}>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        إضافة موعد جديد
                    </h1>

                    <form onSubmit={submit} className="space-y-6">
                        {/* معلومات الموعد */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="appointment_date" value="تاريخ الموعد" />
                                <TextInput
                                    id="appointment_date"
                                    type="date"
                                    name="appointment_date"
                                    value={data.appointment_date}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('appointment_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.appointment_date} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="appointment_time" value="توقيت الموعد" />
                                <TextInput
                                    id="appointment_time"
                                    type="time"
                                    name="appointment_time"
                                    value={data.appointment_time}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('appointment_time', e.target.value)}
                                    required
                                />
                                <InputError message={errors.appointment_time} className="mt-2" />
                            </div>
                        </div>

                        {/* معلومات المريض */}
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">معلومات المريض</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="patient_id" value="اسم المريض الثلاثي" />
                                    <select
                                        id="patient_id"
                                        name="patient_id"
                                        value={data.patient_id}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => handlePatientChange(e.target.value)}
                                        required
                                    >
                                        <option value="">اختر مريض</option>
                                        {patients.map((patient) => (
                                            <option key={patient.id} value={patient.id}>
                                                {patient.full_name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.patient_id} className="mt-2" />
                                </div>

                                {loadingPatient && (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                                        <span className="mr-2 text-gray-600">جاري التحميل...</span>
                                    </div>
                                )}

                                {selectedPatientData && (
                                    <>
                                        <div>
                                            <InputLabel htmlFor="patient_gender" value="جنس المريض" />
                                            <TextInput
                                                id="patient_gender"
                                                type="text"
                                                name="patient_gender"
                                                value={data.patient_gender}
                                                className="mt-1 block w-full bg-gray-100"
                                                readOnly
                                            />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="patient_age" value="العمر" />
                                            <TextInput
                                                id="patient_age"
                                                type="text"
                                                name="patient_age"
                                                value={data.patient_age}
                                                className="mt-1 block w-full bg-gray-100"
                                                readOnly
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* معلومات العيادة والخدمة */}
                        <div className="bg-green-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">معلومات العيادة والخدمة</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="doctor_id" value="الطبيب" />
                                    <select
                                        id="doctor_id"
                                        name="doctor_id"
                                        value={data.doctor_id}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('doctor_id', e.target.value)}
                                        required
                                    >
                                        <option value="">اختر طبيب</option>
                                        {doctors.map((doctor) => (
                                            <option key={doctor.id} value={doctor.id}>
                                                {doctor.user?.name || `Doctor #${doctor.id}`}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.doctor_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="clinic_id" value="العيادة" />
                                    <select
                                        id="clinic_id"
                                        name="clinic_id"
                                        value={data.clinic_id}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('clinic_id', e.target.value)}
                                        required
                                    >
                                        <option value="">اختر عيادة</option>
                                        {clinics.map((clinic) => (
                                            <option key={clinic.id} value={clinic.id}>
                                                {clinic.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.clinic_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="service_id" value="الخدمة" />
                                    <select
                                        id="service_id"
                                        name="service_id"
                                        value={data.service_id}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('service_id', e.target.value)}
                                        required
                                    >
                                        <option value="">اختر خدمة</option>
                                        {services.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.service_id} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* معلومات التكلفة */}
                        <div className="bg-yellow-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">معلومات التكلفة</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="appointment_cost" value="تكلفة الموعد" />
                                    <TextInput
                                        id="appointment_cost"
                                        type="number"
                                        name="appointment_cost"
                                        value={data.appointment_cost}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('appointment_cost', e.target.value)}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                    <InputError message={errors.appointment_cost} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="discount" value="الخصم" />
                                    <TextInput
                                        id="discount"
                                        type="number"
                                        name="discount"
                                        value={data.discount}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('discount', e.target.value)}
                                        min="0"
                                        max="100"
                                        step="0.01"
                                    />
                                    <InputError message={errors.discount} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="final_amount" value="المبلغ النهائي" />
                                    <TextInput
                                        id="final_amount"
                                        type="number"
                                        name="final_amount"
                                        value={data.final_amount}
                                        className="mt-1 block w-full bg-gray-100 font-bold"
                                        readOnly
                                    />
                                    <InputError message={errors.final_amount} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="حالة الموعد" />
                                    <select
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('status', e.target.value)}
                                        required
                                    >
                                        <option value="scheduled">مجدول</option>
                                        <option value="completed">مكتمل</option>
                                        <option value="cancelled">ملغي</option>
                                        <option value="no_show">لم يحضر</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* الملاحظات */}
                        <div>
                            <InputLabel htmlFor="notes" value="الملاحظات" />
                            <TextInput
                                id="notes"
                                name="notes"
                                value={data.notes}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                            <InputError message={errors.notes} className="mt-2" />
                        </div>

                        {/* أزرار العمل */}
                        <div className="flex justify-center space-x-4 space-x-reverse pt-6">
                            <Button
                                type="button"
                                onClick={() => window.history.back()}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3"
                            >
                                إلغاء
                            </Button>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3"
                            >
                                {processing ? 'جاري الحفظ...' : 'حفظ الموعد'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}