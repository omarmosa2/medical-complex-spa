import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { Patient, Doctor, Service, Clinic } from '@/types';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';

interface PatientData {
    id: number;
    name: string;
    gender: 'male' | 'female';
    age: number;
    date_of_birth: string;
    phone: string;
    address?: string;
}

interface CreateProps {
    show: boolean;
    onClose: () => void;
    patients: Patient[];
    doctors: Doctor[];
    services: Service[];
    clinics: Clinic[];
    date?: string;
    time?: string;
}

export default function Create({
    show,
    onClose,
    patients,
    doctors,
    services,
    clinics,
    date = new Date().toISOString().split('T')[0],
    time = new Date().toTimeString().slice(0, 5)
}: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        appointment_date: date,
        appointment_time: time,
        patient_id: '',
        patient_gender: '',
        patient_age: '',
        clinic_id: '',
        doctor_id: '',
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
                const response = await fetch(`/patients/${patientId}/data`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const patientData = await response.json();
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
        
        // Keep date and time separate - don't convert to datetime
        post(route('appointments.store'), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6" style={{ direction: 'rtl' }}>
                <div className="bg-white rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center border-b pb-4">
                        إضافة موعد جديد
                    </h2>

                    <form onSubmit={submit} className="space-y-6">
                        {/* معلومات الموعد الأساسية */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="bg-blue-50 p-4 rounded-lg border-r-4 border-blue-500">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">معلومات المريض</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        {/* معلومات العيادة والطبيب والخدمة */}
                        <div className="bg-green-50 p-4 rounded-lg border-r-4 border-green-500">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">معلومات العيادة والطبيب والخدمة</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <InputLabel htmlFor="clinic_id" value="العيادة" />
                                    <select
                                        id="clinic_id"
                                        name="clinic_id"
                                        value={data.clinic_id}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => {
                                            setData('clinic_id', e.target.value);
                                            setData('doctor_id', ''); // Reset doctor when clinic changes
                                        }}
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
                                    <InputLabel htmlFor="doctor_id" value="الطبيب" />
                                    <select
                                        id="doctor_id"
                                        name="doctor_id"
                                        value={data.doctor_id}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('doctor_id', e.target.value)}
                                        disabled={!data.clinic_id}
                                        required
                                    >
                                        <option value="">اختر طبيب</option>
                                        {data.clinic_id
                                            ? doctors.filter(d => d.clinic_id === Number(data.clinic_id)).map((doctor) => (
                                                <option key={doctor.id} value={doctor.id}>
                                                    {doctor.user?.name || doctor.name}
                                                </option>
                                            ))
                                            : doctors.map((doctor) => (
                                                <option key={doctor.id} value={doctor.id}>
                                                    {doctor.user?.name || doctor.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                    <InputError message={errors.doctor_id} className="mt-2" />
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
                        <div className="bg-yellow-50 p-4 rounded-lg border-r-4 border-yellow-500">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">معلومات التكلفة</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                        className="mt-1 block w-full bg-gray-100 font-bold text-lg"
                                        readOnly
                                    />
                                    <InputError message={errors.final_amount} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* الملاحظات وحالة الموعد */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>

                        {/* أزرار العمل */}
                        <div className="flex justify-center space-x-4 space-x-reverse pt-6 border-t">
                            <Button
                                type="button"
                                onClick={onClose}
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
        </Modal>
    );
}