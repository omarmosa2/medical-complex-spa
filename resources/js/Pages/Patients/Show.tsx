import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps, Patient } from '@/types';
import Card from '@/Components/Card';
import { FormEventHandler, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';
import { DocumentPlusIcon, CalendarDaysIcon, DocumentTextIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Show({ auth, patient }: PageProps<{ patient: Patient }>) {
    const [activeTab, setActiveTab] = useState('appointments');
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
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Patient Profile: {patient.name}</h2>}
        >
            <Head title={patient.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button onClick={() => setActiveTab('appointments')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'appointments' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                <CalendarDaysIcon className="h-5 w-5 mr-2" />
                                Appointments
                            </button>
                            <button onClick={() => setActiveTab('medical_records')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'medical_records' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                <DocumentTextIcon className="h-5 w-5 mr-2" />
                                Medical Records
                            </button>
                            <button onClick={() => setActiveTab('documents')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'documents' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                <DocumentPlusIcon className="h-5 w-5 mr-2" />
                                Documents
                            </button>
                        </nav>
                    </div>

                    {activeTab === 'appointments' && (
                        <Card>
                            {/* Appointments content here */}
                        </Card>
                    )}

                    {activeTab === 'medical_records' && (
                        <Card>
                             {/* Medical records content here */}
                        </Card>
                    )}

                    {activeTab === 'documents' && (
                        <Card>
                            {/* Documents content here */}
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}