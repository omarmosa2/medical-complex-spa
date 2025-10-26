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
        name: patient.name,
        phone: patient.phone,
        file_number: patient.file_number,
        date_of_birth: patient.date_of_birth,
        gender: patient.gender,
        address: patient.address || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('patients.update', patient.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Patient: {patient.name}</h2>}
        >
            <Head title={`Edit Patient: ${patient.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Name" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="phone" value="Phone" />
                                    <TextInput
                                        id="phone"
                                        name="phone"
                                        value={data.phone}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('phone', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.phone} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="file_number" value="File Number" />
                                    <TextInput
                                        id="file_number"
                                        name="file_number"
                                        value={data.file_number}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('file_number', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.file_number} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="date_of_birth" value="Date of Birth" />
                                    <TextInput
                                        id="date_of_birth"
                                        type="date"
                                        name="date_of_birth"
                                        value={data.date_of_birth}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.date_of_birth} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="gender" value="Gender" />
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={data.gender}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('gender', e.target.value as 'male' | 'female')}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    <InputError message={errors.gender} className="mt-2" />
                                </div>
                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="address" value="Address" />
                                    <TextInput
                                        id="address"
                                        name="address"
                                        value={data.address}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('address', e.target.value)}
                                    />
                                    <InputError message={errors.address} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-6">
                                <Button className="ms-4" disabled={processing}>
                                    Update Patient
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}