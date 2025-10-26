import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, Appointment, Patient } from '@/types';
import Card from '@/Components/Card';

export default function Tool({ auth, todaysAppointments, upcomingAppointments, recentPatients }: PageProps<{
    todaysAppointments: Appointment[],
    upcomingAppointments: Appointment[],
    recentPatients: Patient[]
}>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Doctor's Tool</h2>}
        >
            <Head title="Doctor's Tool" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Today's Appointments */}
                    <Card>
                        <h3 className="text-lg font-bold mb-4">Today's Appointments</h3>
                        <div className="space-y-4">
                            {todaysAppointments.map((appointment) => (
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
                            {todaysAppointments.length === 0 && (
                                <p className="text-gray-500">No appointments today.</p>
                            )}
                        </div>
                    </Card>

                    {/* Upcoming Appointments */}
                    <Card>
                        <h3 className="text-lg font-bold mb-4">Upcoming Appointments</h3>
                        <div className="space-y-4">
                            {upcomingAppointments.map((appointment) => (
                                <div key={appointment.id} className="p-4 border rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{appointment.patient.name}</p>
                                        <p className="text-sm text-gray-600">{appointment.service.name}</p>
                                        <p className="text-sm text-gray-500">{new Date(appointment.appointment_time).toLocaleDateString()} at {new Date(appointment.appointment_time).toLocaleTimeString()}</p>
                                    </div>
                                    <Link href={route('appointments.show', appointment.id)} className="text-indigo-600 hover:text-indigo-900">
                                        View
                                    </Link>
                                </div>
                            ))}
                            {upcomingAppointments.length === 0 && (
                                <p className="text-gray-500">No upcoming appointments.</p>
                            )}
                        </div>
                    </Card>

                    {/* Recent Patients */}
                    <Card>
                        <h3 className="text-lg font-bold mb-4">Recent Patients</h3>
                        <div className="space-y-4">
                            {recentPatients.map((patient) => (
                                <div key={patient.id} className="p-4 border rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{patient.name}</p>
                                        <p className="text-sm text-gray-600">{patient.phone}</p>
                                        <p className="text-sm text-gray-500">DOB: {patient.date_of_birth}</p>
                                    </div>
                                    <Link href={route('patients.show', patient.id)} className="text-indigo-600 hover:text-indigo-900">
                                        View Profile
                                    </Link>
                                </div>
                            ))}
                            {recentPatients.length === 0 && (
                                <p className="text-gray-500">No recent patients.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}