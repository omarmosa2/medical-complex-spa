import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Card from '@/Components/Card';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Link } from '@inertiajs/react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StatCardProps {
    title: string;
    value: number;
}

const StatCard = ({ title, value }: StatCardProps) => (
    <Card className="w-full md:w-1/4 p-4">
        <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
    </Card>
);

const AdminDashboard = ({ stats }: { stats: any }) => {
    const chartData = {
        labels: ['Patients', 'Doctors', 'Today\'s App.', 'Pending App.'],
        datasets: [
            {
                label: 'Count',
                data: [stats.patients, stats.doctors, stats.todaysAppointments, stats.pendingAppointments],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.5)',
                    'rgba(46, 204, 113, 0.5)',
                    'rgba(241, 196, 15, 0.5)',
                    'rgba(231, 76, 60, 0.5)',
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(241, 196, 15, 1)',
                    'rgba(231, 76, 60, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Patients" value={stats.patients} />
                <StatCard title="Total Doctors" value={stats.doctors} />
                <StatCard title="Today's Appointments" value={stats.todaysAppointments} />
                <StatCard title="Pending Appointments" value={stats.pendingAppointments} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Statistics Overview</h3>
                <Bar data={chartData} />
            </Card>
        </div>
    );
};

const DoctorDashboard = ({ todaysAppointments, recentPatients }: { todaysAppointments: any[], recentPatients: any[] }) => (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Today's Appointments</h3>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {todaysAppointments.map(appointment => (
                    <li key={appointment.id} className="py-3 flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{appointment.patient.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.start_time}</p>
                        </div>
                        <Link href={route('appointments.show', appointment.id)} className="text-primary-600 hover:text-primary-900 font-semibold">
                            View
                        </Link>
                    </li>
                ))}
            </ul>
        </Card>
        <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Recent Patients</h3>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentPatients.map(patient => (
                    <li key={patient.id} className="py-3 flex justify-between items-center">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{patient.name}</p>
                        <Link href={route('patients.show', patient.id)} className="text-primary-600 hover:text-primary-900 font-semibold">
                            View Profile
                        </Link>
                    </li>
                ))}
            </ul>
        </Card>
    </div>
);

const ReceptionistDashboard = ({ todaysAppointments, patients, doctors }: { todaysAppointments: any[], patients: any[], doctors: any[] }) => {
    const { data, setData, post, processing, errors } = useForm({
        patient_id: '',
        doctor_id: '',
        date: '',
        start_time: '',
        end_time: '',
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('appointments.store'));
    };

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Booking</h3>
                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="patient_id" value="Patient" />
                            <select id="patient_id" name="patient_id" value={data.patient_id} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm" onChange={(e) => setData('patient_id', e.target.value)}>
                                <option value="">Select Patient</option>
                                {patients.map(patient => (
                                    <option key={patient.id} value={patient.id}>{patient.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.patient_id} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="doctor_id" value="Doctor" />
                            <select id="doctor_id" name="doctor_id" value={data.doctor_id} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm" onChange={(e) => setData('doctor_id', e.target.value)}>
                                <option value="">Select Doctor</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>{doctor.user.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.doctor_id} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="date" value="Date" />
                            <TextInput id="date" type="date" name="date" value={data.date} className="mt-1 block w-full" onChange={(e) => setData('date', e.target.value)} />
                            <InputError message={errors.date} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="start_time" value="Start Time" />
                            <TextInput id="start_time" type="time" name="start_time" value={data.start_time} className="mt-1 block w-full" onChange={(e) => setData('start_time', e.target.value)} />
                            <InputError message={errors.start_time} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="end_time" value="End Time" />
                            <TextInput id="end_time" type="time" name="end_time" value={data.end_time} className="mt-1 block w-full" onChange={(e) => setData('end_time', e.target.value)} />
                            <InputError message={errors.end_time} className="mt-2" />
                        </div>
                        <div className="flex items-center justify-end mt-4">
                            <Button className="ms-4" disabled={processing}>
                                Book
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Today's Appointments</h3>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {todaysAppointments.map(appointment => (
                            <li key={appointment.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{appointment.patient.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.doctor.user.name} at {appointment.start_time}</p>
                                </div>
                                <Link href={route('appointments.show', appointment.id)} className="text-primary-600 hover:text-primary-900 font-semibold">
                                    View
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default function Dashboard({ auth, stats, charts, todaysAppointments, recentPatients, patients, doctors }: PageProps<{ stats: any, charts: any, todaysAppointments: any[], recentPatients: any[], patients: any[], doctors: any[] }>) {
    const renderDashboard = () => {
        switch (auth.user.role) {
            case 'admin':
                return <AdminDashboard stats={stats} />;
            case 'doctor':
                return <DoctorDashboard todaysAppointments={todaysAppointments} recentPatients={recentPatients} />;
            case 'receptionist':
                return <ReceptionistDashboard todaysAppointments={todaysAppointments} patients={patients} doctors={doctors} />;
            default:
                return <div className="p-6 text-gray-900 dark:text-gray-100">You're logged in!</div>;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {renderDashboard()}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}