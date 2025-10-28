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
import Create from './Create';

export default function Index({ auth, appointments, clinics, patients, doctors, services }: PageProps<{ appointments: Appointment[], clinics: Clinic[], patients: Patient[], doctors: Doctor[], services: Service[] }>) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [selectedClinic, setSelectedClinic] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredAppointments = selectedClinic
        ? appointments.filter(app => app.clinic_id === parseInt(selectedClinic))
        : appointments;

    const events = filteredAppointments.map(app => ({
        id: app.id.toString(),
        title: `${app.patient?.full_name || 'Unknown'} - ${app.service?.name || 'Unknown'}`,
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
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">المواعيد</h2>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        إضافة موعد جديد
                    </Button>
                </div>
            }
        >
            <Head title="المواعيد" />

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
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">لا توجد مواعيد</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ابدأ بحجز موعد جديد.</p>
                                <div className="mt-6">
                                    <Button onClick={() => setIsModalOpen(true)}>
                                        <PlusIcon className="h-5 w-5 mr-2" />
                                        إضافة موعد جديد
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            <Create
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                patients={patients}
                doctors={doctors}
                services={services}
                clinics={clinics}
            />
        </AuthenticatedLayout>
    );
}