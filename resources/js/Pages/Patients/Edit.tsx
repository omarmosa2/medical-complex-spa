import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps, Patient } from '@/types';
import Card from '@/Components/Card';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';
import { FormEventHandler } from 'react';

export default function Edit({ auth, patient }: PageProps<{ patient: Patient }>) {
    const { data, setData, patch, processing, errors } = useForm({
        full_name: patient.full_name || '',
        gender: patient.gender || '',
        age: patient.age || '',
        residence: patient.residence || '',
        phone: patient.phone || '',
        email: patient.email || '',
        notes: patient.notes || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('patients.update', patient.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">تعديل المريض: {patient.full_name}</h2>}
        >
            <Head title={`تعديل المريض: ${patient.full_name}`} />

            <div className="py-12" dir="rtl">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="full_name" value="الاسم الثلاثي" />
                                    <TextInput
                                        id="full_name"
                                        name="full_name"
                                        value={data.full_name}
                                        className="mt-1 block w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('full_name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.full_name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="gender" value="الجنس" />
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={data.gender}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('gender', e.target.value as 'male' | 'female')}
                                    >
                                        <option value="male">ذكر</option>
                                        <option value="female">أنثى</option>
                                    </select>
                                    <InputError message={errors.gender} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="age" value="العمر" />
                                    <TextInput
                                        id="age"
                                        type="number"
                                        name="age"
                                        value={data.age}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('age', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.age} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="residence" value="مكان الإقامة" />
                                    <TextInput
                                        id="residence"
                                        name="residence"
                                        value={data.residence}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('residence', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.residence} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="phone" value="رقم الهاتف" />
                                    <TextInput
                                        id="phone"
                                        name="phone"
                                        value={data.phone}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    <InputError message={errors.phone} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="email" value="الإيميل" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="notes" value="ملاحظات" />
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={data.notes}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={4}
                                    />
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-6">
                                <Button className="ms-4" disabled={processing}>
                                    تحديث المريض
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}