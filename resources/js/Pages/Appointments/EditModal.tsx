import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { Patient, Doctor, Service, Appointment, Clinic } from '@/types';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';

export default function EditModal({ show, onClose, appointment, patients, doctors, services, clinics }: { show: boolean, onClose: () => void, appointment: Appointment | null, patients: Patient[], doctors: Doctor[], services: Service[], clinics: Clinic[] }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        patient_id: '',
        doctor_id: '',
        service_id: '',
        clinic_id: '',
        appointment_time: '',
        status: 'scheduled',
        notes: '',
        amount_paid: 0,
        discount: 0,
    });

    const filteredDoctors = data.clinic_id
        ? doctors.filter(d => d.clinic_id === Number(data.clinic_id))
        : doctors;

    useEffect(() => {
        if (appointment) {
            setData({
                patient_id: appointment.patient_id.toString(),
                doctor_id: appointment.doctor_id.toString(),
                service_id: appointment.service_id.toString(),
                clinic_id: appointment.clinic_id?.toString() || '',
                appointment_time: appointment.appointment_time.slice(0, 16), // Format for datetime-local
                status: appointment.status,
                notes: appointment.notes || '',
                amount_paid: appointment.amount_paid,
                discount: appointment.discount || 0,
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
                        <InputLabel htmlFor="clinic_id" value="Clinic" />
                        <select
                            id="clinic_id"
                            name="clinic_id"
                            value={data.clinic_id}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            onChange={(e) => setData('clinic_id', e.target.value)}
                        >
                            <option value="">Select a clinic</option>
                            {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <InputError message={errors.clinic_id} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="doctor_id" value="Doctor" />
                        <select
                            id="doctor_id"
                            name="doctor_id"
                            value={data.doctor_id}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            onChange={(e) => setData('doctor_id', e.target.value)}
                            disabled={!data.clinic_id}
                        >
                            <option value="">Select a doctor</option>
                            {filteredDoctors.map(d => <option key={d.id} value={d.id}>{d.user.name}</option>)}
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
                        <InputLabel htmlFor="status" value="Status" />
                        <select
                            id="status"
                            name="status"
                            value={data.status}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            onChange={(e) => setData('status', e.target.value)}
                        >
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="no_show">No Show</option>
                        </select>
                        <InputError message={errors.status} className="mt-2" />
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
                    <div>
                        <InputLabel htmlFor="discount" value="Discount (%)" />
                        <TextInput
                            id="discount"
                            type="number"
                            name="discount"
                            value={data.discount}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('discount', parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                        />
                        <InputError message={errors.discount} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="amount_paid" value="Amount Paid" />
                        <TextInput
                            id="amount_paid"
                            type="number"
                            name="amount_paid"
                            value={data.amount_paid}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('amount_paid', parseFloat(e.target.value) || 0)}
                            min="0"
                        />
                        <InputError message={errors.amount_paid} className="mt-2" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800" onClick={onClose}>
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