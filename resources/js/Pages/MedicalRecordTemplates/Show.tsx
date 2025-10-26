import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import Card from '@/Components/Card';
import Button from '@/Components/Button';

interface Template {
    id: number;
    title: string;
    content: {
        diagnosis: string;
        prescription: string;
        notes: string;
    };
}

export default function Show({ auth, template }: PageProps<{ template: Template }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Template Details</h2>}
        >
            <Head title="Template Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Template Title</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{template.title}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Diagnosis</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{template.content.diagnosis || 'N/A'}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Prescription</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{template.content.prescription || 'N/A'}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Notes</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{template.content.notes || 'N/A'}</p>
                            </div>

                            <div className="flex items-center justify-end mt-6">
                                <Link href={route('medical-record-templates.edit', template.id)}>
                                    <Button>Edit</Button>
                                </Link>
                                <Link href={route('medical-record-templates.index')} className="ml-4">
                                    <Button>Back to List</Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}