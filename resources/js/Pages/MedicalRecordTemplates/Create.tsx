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
        title: '',
        content: {
            diagnosis: '',
            prescription: '',
            notes: '',
        },
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('medical-record-templates.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create New Template</h2>}
        >
            <Head title="Create Template" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <form onSubmit={submit} className="p-6">
                            <div>
                                <InputLabel htmlFor="title" value="Template Title" />
                                <TextInput
                                    id="title"
                                    name="title"
                                    value={data.title}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="diagnosis" value="Default Diagnosis" />
                                <TextInput
                                    id="diagnosis"
                                    name="diagnosis"
                                    value={data.content.diagnosis}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('content', { ...data.content, diagnosis: e.target.value })}
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="prescription" value="Default Prescription" />
                                <TextInput
                                    id="prescription"
                                    name="prescription"
                                    value={data.content.prescription}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('content', { ...data.content, prescription: e.target.value })}
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="notes" value="Default Notes" />
                                <TextInput
                                    id="notes"
                                    name="notes"
                                    value={data.content.notes}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('content', { ...data.content, notes: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center justify-end mt-6">
                                <Button className="ms-4" disabled={processing}>
                                    Save Template
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}