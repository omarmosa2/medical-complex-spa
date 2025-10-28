import { PageProps, Appointment, Patient, Doctor, Service, Clinic } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { FormEventHandler, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { ArrowRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

interface AppointmentsEditProps {
    appointment: Appointment;
    patients: Patient[];
    doctors: Doctor[];
    services: Service[];
    clinics: Clinic[];
}

export default function Edit({ auth, appointment, patients, doctors, services, clinics }: PageProps<AppointmentsEditProps>) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        patient_id: appointment.patient?.id?.toString() || appointment.patient_id?.toString() || '',
        doctor_id: appointment.doctor?.id?.toString() || appointment.doctor_id?.toString() || '',
        service_id: appointment.service?.id?.toString() || appointment.service_id?.toString() || '',
        clinic_id: appointment.clinic?.id?.toString() || appointment.clinic_id?.toString() || '',
        appointment_date: appointment.appointment_date || '',
        appointment_time: appointment.appointment_time || '',
        status: appointment.status || 'scheduled',
        notes: appointment.notes || '',
        amount_paid: appointment.amount_paid || 0,
        discount: appointment.discount || 0,
    });

    const filteredDoctors = data.clinic_id
        ? doctors.filter(d => d.clinic_id === Number(data.clinic_id))
        : doctors;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('appointments.update', appointment.id), {
            onSuccess: () => {
                // Handle success - maybe redirect or show message
            },
            onError: () => {
                // Handle errors
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link
                            href={route('appointments.index')}
                            className="text-gray-500 hover:text-gray-700 ml-4"
                        >
                            <ArrowRightIcon className="h-5 w-5" />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            تعديل الموعد
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="تعديل الموعد" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <form onSubmit={submit} className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    معلومات الموعد الحالي
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">المريض:</span>
                                            <span className="mr-2 text-gray-600">
                                                {appointment.patient?.full_name || appointment.patient?.name || 'غير محدد'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">الطبيب:</span>
                                            <span className="mr-2 text-gray-600">
                                                {appointment.doctor?.user?.name || appointment.doctor?.name || 'غير محدد'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">الخدمة:</span>
                                            <span className="mr-2 text-gray-600">
                                                {appointment.service?.name || 'غير محدد'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">التاريخ والوقت:</span>
                                            <span className="mr-2 text-gray-600">
                                                {appointment.appointment_date} - {appointment.appointment_time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                تعديل معلومات الموعد
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Patient Selection */}
                                <div>
                                    <InputLabel htmlFor="patient_id" value="المريض" />
                                    <select
                                        id="patient_id"
                                        name="patient_id"
                                        value={data.patient_id}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('patient_id', e.target.value)}
                                        required
                                    >
                                        <option value="">اختر مريض</option>
                                        {patients.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.full_name || p.name} {p.phone ? `(${p.phone})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.patient_id} className="mt-2" />
                                </div>

                                {/* Clinic Selection */}
                                <div>
                                    <InputLabel htmlFor="clinic_id" value="العيادة" />
                                    <select
                                        id="clinic_id"
                                        name="clinic_id"
                                        value={data.clinic_id}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('clinic_id', e.target.value)}
                                        required
                                    >
                                        <option value="">اختر عيادة</option>
                                        {clinics.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.clinic_id} className="mt-2" />
                                </div>

                                {/* Doctor Selection */}
                                <div>
                                    <InputLabel htmlFor="doctor_id" value="الطبيب" />
                                    <select
                                        id="doctor_id"
                                        name="doctor_id"
                                        value={data.doctor_id}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('doctor_id', e.target.value)}
                                        disabled={!data.clinic_id}
                                        required
                                    >
                                        <option value="">اختر طبيب</option>
                                        {filteredDoctors.map(d => (
                                            <option key={d.id} value={d.id}>
                                                {d.user?.name || d.name || `طبيب رقم ${d.id}`}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.doctor_id} className="mt-2" />
                                </div>

                                {/* Service Selection */}
                                <div>
                                    <InputLabel htmlFor="service_id" value="الخدمة" />
                                    <select
                                        id="service_id"
                                        name="service_id"
                                        value={data.service_id}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('service_id', e.target.value)}
                                        required
                                    >
                                        <option value="">اختر خدمة</option>
                                        {services.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.service_id} className="mt-2" />
                                </div>

                                {/* Date and Time */}
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
                                    <InputLabel htmlFor="appointment_time" value="وقت الموعد" />
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

                                {/* Status */}
                                <div>
                                    <InputLabel htmlFor="status" value="حالة الموعد" />
                                    <select
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('status', e.target.value as 'scheduled' | 'completed' | 'cancelled' | 'no_show')}
                                        required
                                    >
                                        <option value="scheduled">مجدول</option>
                                        <option value="completed">مكتمل</option>
                                        <option value="cancelled">ملغي</option>
                                        <option value="no_show">لم يحضر</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                {/* Discount */}
                                <div>
                                    <InputLabel htmlFor="discount" value="الخصم (%)" />
                                    <TextInput
                                        id="discount"
                                        type="number"
                                        name="discount"
                                        value={data.discount}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('discount', parseFloat(e.target.value) || 0)}
                                        min="0"
                                        max="100"
                                        step="0.01"
                                    />
                                    <InputError message={errors.discount} className="mt-2" />
                                </div>

                                {/* Amount Paid */}
                                <div>
                                    <InputLabel htmlFor="amount_paid" value="المبلغ المدفوع" />
                                    <TextInput
                                        id="amount_paid"
                                        type="number"
                                        name="amount_paid"
                                        value={data.amount_paid}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('amount_paid', parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="0.01"
                                    />
                                    <InputError message={errors.amount_paid} className="mt-2" />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="mt-6">
                                <InputLabel htmlFor="notes" value="ملاحظات" />
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows={4}
                                    value={data.notes}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="أي ملاحظات إضافية..."
                                />
                                <InputError message={errors.notes} className="mt-2" />
                            </div>

                            {/* Form Actions */}
                            <div className="mt-8 flex justify-end space-x-4">
                                <Link
                                    href={route('appointments.index')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    إلغاء
                                </Link>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                                >
                                    {processing ? 'جاري التحديث...' : 'تحديث الموعد'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}