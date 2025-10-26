import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Patient, Doctor, Service } from '@/types';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';

export default function Create({ show, onClose, patients, doctors, services, date }: { show: boolean, onClose: () => void, patients: Patient[], doctors: Doctor[], services: Service[], date: string }) {
    const { data, setData, post, processing, errors } = useForm({
        patient_id: '',
        doctor_id: '',
        service_id: '',
        appointment_time: date,
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('appointments.store'), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Book New Appointment
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-6">
                    <div>
                        <InputLabel htmlFor="patient_id" value="Patient" />
                        <select
                            id="patient_id"
                            name="patient_id"
                            value={data.patient_id}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            onChange={(e) => setData('patient_id', e.target.value)}
                        >
                            <option value="">Select a patient</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <InputError message={errors.patient_id} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="doctor_id" value="Doctor" />
                        <select
                            id="doctor_id"
                            name="doctor_id"
                            value={data.doctor_id}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            onChange={(e) => setData('doctor_id', e.target.value)}
                        >
                            <option value="">Select a doctor</option>
                            {doctors.map(d => <option key={d.id} value={d.id}>{d.user.name}</option>)}
                        </select>
                        <InputError message={errors.doctor_id} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="service_id" value="Service" />
                        <select
                            id="service_id"
                            name="service_id"
                            value={data.service_id}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            onChange={(e) => setData('service_id', e.target.value)}
                        >
                            <option value="">Select a service</option>
                            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <InputError message={errors.service_id} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="appointment_time" value="Appointment Time" />
                        <TextInput
                            id="appointment_time"
                            type="datetime-local"
                            name="appointment_time"
                            value={data.appointment_time}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('appointment_time', e.target.value)}
                            required
                        />
                        <InputError message={errors.appointment_time} className="mt-2" />
                    </div>
                    <div>
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
                </div>

                <div className="mt-6 flex justify-end">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button className="ms-3" disabled={processing}>
                        Book Appointment
                    </Button>
                </div>
            </form>
        </Modal>
    );
}