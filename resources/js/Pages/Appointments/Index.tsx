import { PageProps, Appointment, Patient, Doctor, Service, Clinic } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';
import { FormEventHandler, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { PlusIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function Index({ auth, appointments, clinics, patients, doctors, services }: PageProps<{ appointments: Appointment[], clinics: Clinic[], patients: Patient[], doctors: Doctor[], services: Service[] }>) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [selectedClinic, setSelectedClinic] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('appointments.store'));
    };

    const filteredAppointments = selectedClinic
        ? appointments.filter(app => app.clinic_id === parseInt(selectedClinic))
        : appointments;

    const events = filteredAppointments.map(app => ({
        id: app.id.toString(),
        title: `${app.patient?.name || 'Unknown'} - ${app.service?.name || 'Unknown'}`,
        start: app.appointment_time,
        extendedProps: {
            clinic: app.clinic?.name,
        }
    }));

    function getStatusColor(status: Appointment['status']) {
        switch (status) {
            case 'completed': return '#22c55e'; // green-500
            case 'cancelled': return '#ef4444'; // red-500
            case 'no_show': return '#6b7280'; // gray-500
            case 'scheduled':
            default:
                return '#3b82f6'; // blue-500
        }
    }

    const handleDateClick = (arg: any) => {
        setSelectedDate(arg.dateStr);
        setCreateModalOpen(true);
    }

    const handleEventClick = (arg: any) => {
        const appointment = appointments.find(app => app.id.toString() === arg.event.id);
        if (appointment) {
            setSelectedAppointment(appointment);
            setEditModalOpen(true);
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Appointments</h2>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        New Appointment
                    </Button>
                </div>
            }
        >
            <Head title="Appointments" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        {appointments.length > 0 ? (
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="timeGridWeek"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                }}
                                events={events}
                                editable={true}
                                selectable={true}
                                dateClick={handleDateClick}
                                eventClick={handleEventClick}
                            />
                        ) : (
                            <div className="text-center py-12">
                                <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No appointments found</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by booking a new appointment.</p>
                                <div className="mt-6">
                                    <Button onClick={() => setIsModalOpen(true)}>
                                        <PlusIcon className="h-5 w-5 mr-2" />
                                        New Appointment
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        New Appointment
                    </h2>

                    <div className="mt-6">
                        <InputLabel htmlFor="patient_id" value="Patient" />
                        <select id="patient_id" name="patient_id" value={data.patient_id} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm" onChange={(e) => setData('patient_id', e.target.value)}>
                            <option value="">Select Patient</option>
                            {patients?.map(patient => (
                                <option key={patient.id} value={patient.id}>{patient.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.patient_id} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="doctor_id" value="Doctor" />
                        <select id="doctor_id" name="doctor_id" value={data.doctor_id} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm" onChange={(e) => setData('doctor_id', e.target.value)}>
                            <option value="">Select Doctor</option>
                            {doctors?.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>{doctor.user?.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.doctor_id} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="service_id" value="Service" />
                        <select id="service_id" name="service_id" value={data.service_id} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm" onChange={(e) => setData('service_id', e.target.value)}>
                            <option value="">Select Service</option>
                            {services?.map(service => (
                                <option key={service.id} value={service.id}>{service.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.service_id} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="clinic_id" value="Clinic" />
                        <select id="clinic_id" name="clinic_id" value={data.clinic_id} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm" onChange={(e) => setData('clinic_id', e.target.value)}>
                            <option value="">Select Clinic</option>
                            {clinics?.map(clinic => (
                                <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.clinic_id} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="doctor_id" value="Doctor" />
                        <select id="doctor_id" name="doctor_id" value={data.doctor_id} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm" onChange={(e) => setData('doctor_id', e.target.value)} disabled={!data.clinic_id}>
                            <option value="">Select Doctor</option>
                            {filteredDoctors?.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>{doctor.user?.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.doctor_id} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="service_id" value="Service" />
                        <select id="service_id" name="service_id" value={data.service_id} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm" onChange={(e) => setData('service_id', e.target.value)}>
                            <option value="">Select Service</option>
                            {services?.map(service => (
                                <option key={service.id} value={service.id}>{service.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.service_id} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="appointment_time" value="Appointment Time" />
                        <TextInput id="appointment_time" type="datetime-local" name="appointment_time" value={data.appointment_time} className="mt-1 block w-full" onChange={(e) => setData('appointment_time', e.target.value)} />
                        <InputError message={errors.appointment_time} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="status" value="Status" />
                        <select id="status" name="status" value={data.status} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm" onChange={(e) => setData('status', e.target.value)}>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="no_show">No Show</option>
                        </select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="notes" value="Notes" />
                        <TextInput id="notes" name="notes" value={data.notes} className="mt-1 block w-full" onChange={(e) => setData('notes', e.target.value)} />
                        <InputError message={errors.notes} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="discount" value="Discount (%)" />
                        <TextInput id="discount" type="number" name="discount" value={data.discount} className="mt-1 block w-full" onChange={(e) => setData('discount', parseFloat(e.target.value) || 0)} min="0" max="100" />
                        <InputError message={errors.discount} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="amount_paid" value="Amount Paid" />
                        <TextInput id="amount_paid" type="number" name="amount_paid" value={data.amount_paid} className="mt-1 block w-full" onChange={(e) => setData('amount_paid', parseFloat(e.target.value) || 0)} min="0" />
                        <InputError message={errors.amount_paid} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
                            Cancel
                        </Button>
                        <Button className="ml-3" disabled={processing}>
                            Book Appointment
                        </Button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}