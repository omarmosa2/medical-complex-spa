import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, Appointment } from '@/types';
import Card from '@/Components/Card';

export default function MyAgenda({ auth, appointments }: PageProps<{ appointments: Appointment[] }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Agenda</h2>}
        >
            <Head title="My Agenda" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <h3 className="text-lg font-bold mb-4">Today's Appointments</h3>
                        <div className="space-y-4">
                            {appointments.map((appointment) => (
                                <div key={appointment.id} className="p-4 border rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{appointment.patient.name}</p>
                                        <p className="text-sm text-gray-600">{appointment.service.name}</p>
                                        <p className="text-sm text-gray-500">{new Date(appointment.appointment_time).toLocaleTimeString()}</p>
                                    </div>
                                    <Link href={route('appointments.show', appointment.id)} className="text-indigo-600 hover:text-indigo-900">
                                        Start Consultation
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}