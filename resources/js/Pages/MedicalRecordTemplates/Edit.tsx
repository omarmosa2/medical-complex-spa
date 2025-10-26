import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import Card from '@/Components/Card';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';
import { FormEventHandler } from 'react';

interface Template {
    id: number;
    title: string;
    content: {
        diagnosis: string;
        prescription: string;
        notes: string;
    };
}

export default function Edit({ auth, template }: PageProps<{ template: Template }>) {
    const { data, setData, put, processing, errors } = useForm({
        title: template.title,
        content: template.content,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('medical-record-templates.update', template.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Template</h2>}
        >
            <Head title="Edit Template" />

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
                                    Update Template
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}