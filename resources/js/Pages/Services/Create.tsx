import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import Card from '@/Components/Card';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';
import { FormEventHandler } from 'react';

export default function Create({ auth, clinics }: PageProps<{ clinics: any[] }>) {
    const { data, setData, post, processing, errors } = useForm({
        clinic_id: '',
        name: '',
        description: '',
        price: '',
        duration_minutes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('services.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-foreground leading-tight">إضافة خدمة</h2>}
        >
            <Head title="إضافة خدمة" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="clinic_id" value="العيادة" />
                                    <select id="clinic_id" name="clinic_id" value={data.clinic_id} className="mt-1 block w-full border-input bg-background text-foreground focus:border-primary focus:ring-primary rounded-md shadow-sm" onChange={(e) => setData('clinic_id', e.target.value)} required>
                                        <option value="">اختر العيادة</option>
                                        {clinics?.map((c: any) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.clinic_id} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="name" value="اسم الخدمة" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="price" value="السعر" />
                                    <TextInput
                                        id="price"
                                        name="price"
                                        type="number"
                                        value={data.price}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.price} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="duration_minutes" value="المدة (بالدقائق)" />
                                    <TextInput
                                        id="duration_minutes"
                                        name="duration_minutes"
                                        type="number"
                                        value={data.duration_minutes}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('duration_minutes', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.duration_minutes} className="mt-2" />
                                </div>
                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="description" value="الوصف" />
                                    <TextInput
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-6">
                                <Button className="ms-4" disabled={processing}>
                                    حفظ الخدمة
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}