import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { Patient, Doctor, Service, Appointment } from '@/types';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';

export default function EditModal({ show, onClose, appointment, patients, doctors, services }: { show: boolean, onClose: () => void, appointment: Appointment | null, patients: Patient[], doctors: Doctor[], services: Service[] }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        patient_id: '',
        doctor_id: '',
        service_id: '',
        appointment_time: '',
        status: 'scheduled',
        notes: '',
    });

    useEffect(() => {
        if (appointment) {
            setData({
                patient_id: appointment.patient_id.toString(),
                doctor_id: appointment.doctor_id.toString(),
                service_id: appointment.service_id.toString(),
                appointment_time: appointment.appointment_time.slice(0, 16), // Format for datetime-local
                status: appointment.status,
                notes: appointment.notes || '',
            });
        }
    }, [appointment]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!appointment) return;
        patch(route('appointments.update', appointment.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Edit Appointment
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-6">
                    {/* Form fields similar to Create.tsx, but with status field */}
                    <div>
                        <InputLabel htmlFor="status" value="Status" />
                        <select
                            id="status"
                            name="status"
                            value={data.status}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            onChange={(e) => setData('status', e.target.value as 'scheduled' | 'completed' | 'cancelled' | 'no_show')}
                        >
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="no_show">No Show</option>
                        </select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>
                    {/* Other fields like patient, doctor, service, time can be added here if they should be editable */}
                </div>

                <div className="mt-6 flex justify-end">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button className="ms-3" disabled={processing}>
                        Update Appointment
                    </Button>
                </div>
            </form>
        </Modal>
    );
}