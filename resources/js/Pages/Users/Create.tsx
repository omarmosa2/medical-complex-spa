import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import Card from '@/Components/Card';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';
import { FormEventHandler } from 'react';

export default function Create({ auth }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'receptionist',
        specialization: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add New User</h2>}
        >
            <Head title="Add User" />

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
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="password" value="Password" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="role" value="Role" />

                                    <select
                                        id="role"
                                        name="role"
                                        value={data.role}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        onChange={(e) => setData('role', e.target.value)}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="receptionist">Receptionist</option>
                                    </select>

                                    <InputError message={errors.role} className="mt-2" />
                                </div>

                                {data.role === 'doctor' && (
                                    <>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="examination_fee" value="Examination Fee" />

                                            <TextInput
                                                id="examination_fee"
                                                type="number"
                                                name="examination_fee"
                                                value={data.examination_fee}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('examination_fee', e.target.value)}
                                            />

                                            <InputError message={errors.examination_fee} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="doctor_percentage" value="Doctor Percentage (%)" />

                                            <TextInput
                                                id="doctor_percentage"
                                                type="number"
                                                name="doctor_percentage"
                                                value={data.doctor_percentage}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('doctor_percentage', e.target.value)}
                                            />

                                            <InputError message={errors.doctor_percentage} className="mt-2" />
                                        </div>
                                    </>
                                )}

                                {data.role === 'doctor' && (
                                    <div>
                                        <InputLabel htmlFor="specialization" value="Specialization" />
                                        <TextInput
                                            id="specialization"
                                            name="specialization"
                                            value={data.specialization}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('specialization', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.specialization} className="mt-2" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <Button className="ms-4" disabled={processing}>
                                    Save User
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}