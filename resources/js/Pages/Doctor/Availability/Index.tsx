import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';
import { FormEventHandler, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';

export default function Index({ auth, availabilities }: PageProps<{ availabilities: any[] }>) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        start_time: '',
        end_time: '',
    });

    const events: EventInput[] = availabilities.map(avail => ({
        id: avail.id.toString(),
        start: avail.start_time,
        end: avail.end_time,
        backgroundColor: '#16a34a', // Green
        borderColor: '#16a34a',
    }));

    const handleSelect = (arg: any) => {
        setData({
            start_time: arg.startStr,
            end_time: arg.endStr,
        });
        setIsModalOpen(true);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('availabilities.store'), {
            onSuccess: () => setIsModalOpen(false),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">My Availability</h2>}
        >
            <Head title="My Availability" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Select a time slot on the calendar to mark it as available for booking.
                        </p>
                        <FullCalendar
                            plugins={[timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'timeGridWeek,timeGridDay'
                            }}
                            events={events}
                            selectable={true}
                            select={handleSelect}
                            allDaySlot={false}
                        />
                    </Card>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Confirm Availability
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Are you sure you want to add this time slot to your availability?
                    </p>
                    <div className="mt-4 font-semibold text-gray-800 dark:text-gray-200">
                        <p>From: {new Date(data.start_time).toLocaleString()}</p>
                        <p>To: {new Date(data.end_time).toLocaleString()}</p>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
                            Cancel
                        </Button>
                        <Button className="ml-3" disabled={processing}>
                            Confirm
                        </Button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}