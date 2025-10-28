import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps, Appointment } from '@/types';
import Card from '@/Components/Card';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';
import { FormEventHandler, useState } from 'react';
import Modal from '@/Components/Modal';
import { CalendarIcon, ClockIcon, UserIcon, BuildingOfficeIcon, HeartIcon } from '@heroicons/react/24/outline';

interface Template {
    id: number;
    title: string;
    content: {
        diagnosis: string;
        prescription: string;
        notes: string;
    };
}

export default function Show({ auth, appointment, templates }: PageProps<{ appointment: Appointment, templates: Template[] }>) {
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        appointment_id: appointment.id,
        patient_id: appointment.patient_id,
        diagnosis: '',
        prescription: '',
        notes: '',
        vitals: {
            height: '',
            weight: '',
            bp: '',
            temperature: '',
        },
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('medical-records.store'), {
            onSuccess: () => {
                // Redirect or show a success message
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">تفاصيل الموعد</h2>}
        >
            <Head title="تفاصيل الموعد" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Appointment Details Card */}
                    <Card className="mb-6">
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-6 text-gray-800">معلومات الموعد</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Patient Info */}
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <UserIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">المريض</p>
                                        <p className="font-semibold">{appointment.patient?.full_name || appointment.patient?.name || 'غير محدد'}</p>
                                    </div>
                                </div>

                                {/* Doctor Info */}
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <UserIcon className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">الطبيب</p>
                                        <p className="font-semibold">{appointment.doctor?.user?.name || appointment.doctor?.name || 'غير محدد'}</p>
                                    </div>
                                </div>

                                {/* Service Info */}
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-100 rounded-full">
                                        <HeartIcon className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">الخدمة</p>
                                        <p className="font-semibold">{appointment.service?.name || 'غير محدد'}</p>
                                    </div>
                                </div>

                                {/* Date Info */}
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-yellow-100 rounded-full">
                                        <CalendarIcon className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">التاريخ</p>
                                        <p className="font-semibold">{appointment.appointment_date}</p>
                                    </div>
                                </div>

                                {/* Time Info */}
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-indigo-100 rounded-full">
                                        <ClockIcon className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">الوقت</p>
                                        <p className="font-semibold">{appointment.appointment_time}</p>
                                    </div>
                                </div>

                                {/* Clinic Info */}
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-red-100 rounded-full">
                                        <BuildingOfficeIcon className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">العيادة</p>
                                        <p className="font-semibold">{appointment.clinic?.name || 'غير محدد'}</p>
                                    </div>
                                </div>

                                {/* Status Info */}
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        <div className={`w-4 h-4 rounded-full ${
                                            appointment.status === 'completed' ? 'bg-green-500' :
                                            appointment.status === 'cancelled' ? 'bg-red-500' :
                                            appointment.status === 'no_show' ? 'bg-gray-500' : 'bg-blue-500'
                                        }`} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">الحالة</p>
                                        <p className="font-semibold">
                                            {appointment.status === 'completed' ? 'مكتمل' :
                                             appointment.status === 'cancelled' ? 'ملغي' :
                                             appointment.status === 'no_show' ? 'لم يحضر' : 'مجدول'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Notes Section */}
                            {appointment.notes && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold mb-2">ملاحظات</h4>
                                    <p className="text-gray-700">{appointment.notes}</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Medical Records */}
                        <div className="lg:col-span-2">
                            <Card>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold mb-4">التاريخ الطبي للمريض</h3>
                                    <div className="space-y-4">
                                        {appointment.patient.medical_records?.length > 0 ? (
                                            appointment.patient.medical_records.map(record => (
                                                <div key={record.id} className="p-4 border rounded-lg">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className="font-bold">{new Date(record.created_at).toLocaleDateString('ar')}</p>
                                                        <p className="text-sm text-gray-600">د. {record.doctor.user?.name || record.doctor?.name || 'غير محدد'}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p><strong>التشخيص:</strong> {record.diagnosis || 'غير محدد'}</p>
                                                        <p><strong>الوصفة:</strong> {record.prescription || 'غير محدد'}</p>
                                                        {record.notes && <p><strong>ملاحظات:</strong> {record.notes}</p>}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                لا توجد سجلات طبية سابقة
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* New Medical Record Form */}
                        <div>
                            <Card>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold">سجل طبي جديد</h3>
                                        <Button type="button" onClick={() => setShowTemplateModal(true)} className="text-sm">
                                            استخدام قالب
                                        </Button>
                                    </div>
                                    <form onSubmit={submit}>
                                        <div>
                                            <InputLabel htmlFor="diagnosis" value="التشخيص" />
                                            <TextInput
                                                id="diagnosis"
                                                name="diagnosis"
                                                value={data.diagnosis}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('diagnosis', e.target.value)}
                                                required
                                                placeholder="أدخل التشخيص"
                                            />
                                            <InputError message={errors.diagnosis} className="mt-2" />
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="prescription" value="الوصفة" />
                                            <TextInput
                                                id="prescription"
                                                name="prescription"
                                                value={data.prescription}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('prescription', e.target.value)}
                                                required
                                                placeholder="أدخل الوصفة"
                                            />
                                            <InputError message={errors.prescription} className="mt-2" />
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="notes" value="ملاحظات" />
                                            <TextInput
                                                id="notes"
                                                name="notes"
                                                value={data.notes}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('notes', e.target.value)}
                                                placeholder="ملاحظات إضافية"
                                            />
                                            <InputError message={errors.notes} className="mt-2" />
                                        </div>

                                        <div className="mt-6">
                                            <h3 className="text-lg font-bold mb-3">المؤشرات الحيوية</h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                <div>
                                                    <InputLabel htmlFor="vitals.height" value="الطول (سم)" />
                                                    <TextInput
                                                        id="vitals.height"
                                                        type="number"
                                                        name="vitals.height"
                                                        value={data.vitals.height}
                                                        className="mt-1 block w-full"
                                                        onChange={(e) => setData('vitals', { ...data.vitals, height: e.target.value })}
                                                        placeholder="170"
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel htmlFor="vitals.weight" value="الوزن (كغ)" />
                                                    <TextInput
                                                        id="vitals.weight"
                                                        type="number"
                                                        name="vitals.weight"
                                                        value={data.vitals.weight}
                                                        className="mt-1 block w-full"
                                                        onChange={(e) => setData('vitals', { ...data.vitals, weight: e.target.value })}
                                                        placeholder="70"
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel htmlFor="vitals.bp" value="ضغط الدم" />
                                                    <TextInput
                                                        id="vitals.bp"
                                                        type="text"
                                                        name="vitals.bp"
                                                        value={data.vitals.bp}
                                                        className="mt-1 block w-full"
                                                        onChange={(e) => setData('vitals', { ...data.vitals, bp: e.target.value })}
                                                        placeholder="120/80"
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel htmlFor="vitals.temperature" value="درجة الحرارة (°م)" />
                                                    <TextInput
                                                        id="vitals.temperature"
                                                        type="number"
                                                        name="vitals.temperature"
                                                        value={data.vitals.temperature}
                                                        className="mt-1 block w-full"
                                                        onChange={(e) => setData('vitals', { ...data.vitals, temperature: e.target.value })}
                                                        placeholder="36.5"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end mt-6">
                                            <Button className="ms-4" disabled={processing}>
                                                {processing ? 'جارٍ الحفظ...' : 'حفظ السجل الطبي'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showTemplateModal} onClose={() => setShowTemplateModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        اختر قالب للسجل الطبي
                    </h2>
                    <div className="space-y-2">
                        {templates.length > 0 ? (
                            templates.map(template => (
                                <div
                                    key={template.id}
                                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    onClick={() => {
                                        setData(prevData => ({
                                            ...prevData,
                                            diagnosis: template.content.diagnosis,
                                            prescription: template.content.prescription,
                                            notes: template.content.notes,
                                        }));
                                        setShowTemplateModal(false);
                                    }}
                                >
                                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                                        {template.title}
                                    </div>
                                    {template.content.diagnosis && (
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {template.content.diagnosis.length > 50
                                                ? `${template.content.diagnosis.substring(0, 50)}...`
                                                : template.content.diagnosis}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                لا توجد قوالب متاحة
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}