import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PageProps, Patient } from '@/types';
import Card from '@/Components/Card';
import { FormEventHandler, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';
import { DocumentPlusIcon, CalendarDaysIcon, DocumentTextIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Show({ auth, patient }: PageProps<{ patient: Patient }>) {
    const [activeTab, setActiveTab] = useState('info');
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        file: null as File | null,
    });

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData('file', e.target.files[0]);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('documents.store', { patient_id: patient.id }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">ملف المريض: {patient.full_name}</h2>}
        >
            <Head title={patient.full_name} />

            <div className="py-12" dir="rtl">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button onClick={() => setActiveTab('info')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'info' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                <UserIcon className="h-5 w-5 mr-2" />
                                معلومات شخصية
                            </button>
                            <button onClick={() => setActiveTab('appointments')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'appointments' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                <CalendarDaysIcon className="h-5 w-5 mr-2" />
                                المواعيد
                            </button>
                            <button onClick={() => setActiveTab('medical_records')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'medical_records' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                <DocumentTextIcon className="h-5 w-5 mr-2" />
                                السجلات الطبية
                            </button>
                            <button onClick={() => setActiveTab('documents')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'documents' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                <DocumentPlusIcon className="h-5 w-5 mr-2" />
                                الوثائق
                            </button>
                        </nav>
                    </div>

                    {activeTab === 'info' && (
                        <Card>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">معلومات المريض</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel value="الاسم الثلاثي" />
                                        <p className="text-gray-900 dark:text-gray-100">{patient.full_name}</p>
                                    </div>
                                    <div>
                                        <InputLabel value="الجنس" />
                                        <p className="text-gray-900 dark:text-gray-100">{patient.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                                    </div>
                                    <div>
                                        <InputLabel value="العمر" />
                                        <p className="text-gray-900 dark:text-gray-100">{patient.age}</p>
                                    </div>
                                    <div>
                                        <InputLabel value="مكان الإقامة" />
                                        <p className="text-gray-900 dark:text-gray-100">{patient.residence}</p>
                                    </div>
                                    <div>
                                        <InputLabel value="رقم الهاتف" />
                                        <p className="text-gray-900 dark:text-gray-100">{patient.phone || 'غير محدد'}</p>
                                    </div>
                                    <div>
                                        <InputLabel value="الإيميل" />
                                        <p className="text-gray-900 dark:text-gray-100">{patient.email || 'غير محدد'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <InputLabel value="ملاحظات" />
                                        <p className="text-gray-900 dark:text-gray-100">{patient.notes || 'لا توجد ملاحظات'}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href={route('patients.edit', patient.id)} className="text-primary-600 hover:text-primary-900">
                                        تعديل المعلومات
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'appointments' && (
                        <Card>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">المواعيد</h3>
                                {patient.appointments && patient.appointments.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-border">
                                            <thead className="bg-muted">
                                                <tr>
                                                    <th className="px-4 py-2 text-xs text-muted-foreground">التاريخ</th>
                                                    <th className="px-4 py-2 text-xs text-muted-foreground">الوقت</th>
                                                    <th className="px-4 py-2 text-xs text-muted-foreground">الطبيب</th>
                                                    <th className="px-4 py-2 text-xs text-muted-foreground">الخدمة</th>
                                                    <th className="px-4 py-2 text-xs text-muted-foreground">الحالة</th>
                                                    <th className="px-4 py-2 text-xs text-muted-foreground"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-card divide-y divide-border">
                                                {patient.appointments.map((a: any) => (
                                                    <tr key={a.id}>
                                                        <td className="px-4 py-2 text-sm text-foreground">{a.appointment_date}</td>
                                                        <td className="px-4 py-2 text-sm text-foreground">{a.appointment_time}</td>
                                                        <td className="px-4 py-2 text-sm text-foreground">{a.doctor?.user?.name || a.doctor?.name || 'غير محدد'}</td>
                                                        <td className="px-4 py-2 text-sm text-foreground">{a.service?.name || 'غير محدد'}</td>
                                                        <td className="px-4 py-2 text-sm text-foreground">{a.status || '—'}</td>
                                                        <td className="px-4 py-2 text-sm text-right">
                                                            <Link href={route('appointments.show', a.id)} className="text-primary hover:underline">عرض</Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">لا توجد مواعيد.</p>
                                )}
                            </div>
                        </Card>
                    )}

                    {activeTab === 'medical_records' && (
                        <Card>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">السجلات الطبية</h3>
                                {patient.medical_records && patient.medical_records.length > 0 ? (
                                    <ul className="space-y-3">
                                        {patient.medical_records.map((mr: any) => (
                                            <li key={mr.id} className="p-4 border border-border rounded-lg">
                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">الطبيب</p>
                                                        <p className="text-foreground font-medium">{mr.doctor?.user?.name || mr.doctor?.name || 'غير محدد'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">التاريخ</p>
                                                        <p className="text-foreground font-medium">{mr.created_at}</p>
                                                    </div>
                                                </div>
                                                {mr.summary && (
                                                    <div className="mt-3">
                                                        <p className="text-sm text-muted-foreground">الملخص</p>
                                                        <p className="text-foreground whitespace-pre-wrap">{mr.summary}</p>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted-foreground">لا توجد سجلات طبية.</p>
                                )}
                            </div>
                        </Card>
                    )}

                    {activeTab === 'documents' && (
                        <Card>
                            <div className="p-6 space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">الوثائق</h3>
                                    {patient.documents && patient.documents.length > 0 ? (
                                        <ul className="space-y-3">
                                            {patient.documents.map((doc: any) => (
                                                <li key={doc.id} className="p-4 border border-border rounded-lg flex items-center justify-between">
                                                    <div>
                                                        <p className="text-foreground font-medium">{doc.title}</p>
                                                        <p className="text-sm text-muted-foreground">رفع بواسطة: {doc.uploaded_by_user?.name || 'غير معروف'} • {doc.created_at}</p>
                                                    </div>
                                                    {doc.file_path && (
                                                        <div className="flex items-center gap-4">
                                                            <a href={`/storage/${doc.file_path}`} target="_blank" className="text-primary hover:underline" rel="noreferrer">تنزيل</a>
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm('هل أنت متأكد من حذف هذه الوثيقة؟')) {
                                                                        router.delete(route('documents.destroy', doc.id));
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:underline"
                                                            >
                                                                حذف
                                                            </button>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-muted-foreground">لا توجد وثائق.</p>
                                    )}
                                </div>

                                <form onSubmit={submit}>
                                    <div className="mb-4">
                                        <InputLabel htmlFor="title" value="عنوان الوثيقة" />
                                        <TextInput id="title" name="title" value={data.title} onChange={(e) => setData('title', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.title} className="mt-2" />
                                    </div>
                                    <div className="mb-4">
                                        <InputLabel htmlFor="file" value="الملف" />
                                        <input type="file" id="file" onChange={onFileChange} className="mt-1 block w-full" />
                                        <InputError message={errors.file} className="mt-2" />
                                    </div>
                                    <Button disabled={processing}>رفع الوثيقة</Button>
                                </form>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}