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
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Consultation</h2>}
        >
            <Head title="Consultation" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                        <Card>
                            <h3 className="text-lg font-bold mb-4">Patient Medical History</h3>
                            <div className="space-y-4">
                                {appointment.patient.medical_records?.map(record => (
                                    <div key={record.id} className="p-4 border rounded-lg">
                                        <p className="font-bold">{new Date(record.created_at).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-600">Doctor: {record.doctor.user.name}</p>
                                        <p className="mt-2"><strong>Diagnosis:</strong> {record.diagnosis}</p>
                                        <p><strong>Prescription:</strong> {record.prescription}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">New Medical Record</h3>
                                <Button type="button" onClick={() => setShowTemplateModal(true)}>Load from Template</Button>
                            </div>
                            <form onSubmit={submit}>
                                <div>
                                    <InputLabel htmlFor="diagnosis" value="Diagnosis" />
                                    <TextInput
                                        id="diagnosis"
                                        name="diagnosis"
                                        value={data.diagnosis}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('diagnosis', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.diagnosis} className="mt-2" />
                                </div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="prescription" value="Prescription" />
                                    <TextInput
                                        id="prescription"
                                        name="prescription"
                                        value={data.prescription}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('prescription', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.prescription} className="mt-2" />
                                </div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="notes" value="Notes" />
                                    <TextInput
                                        id="notes"
                                        name="notes"
                                        value={data.notes}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('notes', e.target.value)}
                                    />
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold mb-2">Vitals</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="vitals.height" value="Height (cm)" />
                                            <TextInput id="vitals.height" type="number" name="vitals.height" value={data.vitals.height} className="mt-1 block w-full" onChange={(e) => setData('vitals', { ...data.vitals, height: e.target.value })} />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="vitals.weight" value="Weight (kg)" />
                                            <TextInput id="vitals.weight" type="number" name="vitals.weight" value={data.vitals.weight} className="mt-1 block w-full" onChange={(e) => setData('vitals', { ...data.vitals, weight: e.target.value })} />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="vitals.bp" value="Blood Pressure" />
                                            <TextInput id="vitals.bp" type="text" name="vitals.bp" value={data.vitals.bp} className="mt-1 block w-full" onChange={(e) => setData('vitals', { ...data.vitals, bp: e.target.value })} />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="vitals.temperature" value="Temperature (°C)" />
                                            <TextInput id="vitals.temperature" type="number" name="vitals.temperature" value={data.vitals.temperature} className="mt-1 block w-full" onChange={(e) => setData('vitals', { ...data.vitals, temperature: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <Button className="ms-4" disabled={processing}>
                                        Save Medical Record
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>

            <Modal show={showTemplateModal} onClose={() => setShowTemplateModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Select a Template
                    </h2>
                    <div className="mt-4 space-y-2">
                        {templates.map(template => (
                            <div
                                key={template.id}
                                className="p-2 border rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
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
                                {template.title}
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}