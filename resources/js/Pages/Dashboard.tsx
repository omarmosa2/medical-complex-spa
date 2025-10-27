import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps, Notification } from '@/types';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { FormEventHandler } from 'react';
import { motion } from 'framer-motion';
import {
    UserGroupIcon,
    UserIcon,
    CalendarDaysIcon,
    ClockIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    BellIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
}

const StatCard = ({ title, value, icon: Icon }: StatCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
    >
        <Card className="bg-gradient-to-br from-primary-50 via-primary-100/20 to-transparent dark:from-primary-900/20 dark:to-transparent border border-primary-200 dark:border-primary-700 shadow-xl hover:shadow-primary-500/20 transition-all duration-300 p-6 rounded-xl">
            <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                    <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                        {value}
                    </p>
                </div>
            </div>
        </Card>
    </motion.div>
);

const AdminDashboard = ({ auth, stats, charts, recentNotifications }: { auth: any, stats: any, charts: any, recentNotifications: Notification[] }) => {
    // Bar chart for overview
    const barChartData = {
        labels: ['المرضى', 'الأطباء', 'حجوزات اليوم', 'حجوزات معلقة'],
        datasets: [
            {
                label: 'العدد',
                data: [stats.patients, stats.doctors, stats.todaysAppointments, stats.pendingAppointments],
                backgroundColor: [
                    '#3498DB', // primary-500
                    '#5DADE2', // primary-400
                    '#85C1E9', // primary-300
                    '#AED6F1', // primary-200
                ],
                borderColor: [
                    '#2E86C1', // primary-600
                    '#2874A6', // primary-700
                    '#21618C', // primary-800
                    '#1B4F72', // primary-900
                ],
                borderWidth: 2,
            },
        ],
    };

    // Line chart for patient growth
    const patientGrowthData = {
        labels: charts.patientGrowth.map((item: any) => item.date),
        datasets: [
            {
                label: 'تسجيل المرضى',
                data: charts.patientGrowth.map((item: any) => item.count),
                borderColor: '#3498DB', // primary-500
                backgroundColor: 'rgba(52, 152, 219, 0.2)', // primary-500 with opacity
                tension: 0.4,
            },
        ],
    };

    // Line chart for appointment trends
    const appointmentTrendsData = {
        labels: charts.appointmentTrends.map((item: any) => item.date),
        datasets: [
            {
                label: 'حجوزات يومية',
                data: charts.appointmentTrends.map((item: any) => item.count),
                borderColor: '#5DADE2', // primary-400
                backgroundColor: 'rgba(93, 173, 226, 0.2)', // primary-400 with opacity
                tension: 0.4,
            },
        ],
    };

    // Pie chart for service distribution
    const serviceDistributionData = {
        labels: charts.serviceDistribution.map((item: any) => item.service),
        datasets: [
            {
                data: charts.serviceDistribution.map((item: any) => item.count),
                backgroundColor: [
                    '#3498DB', // primary-500
                    '#5DADE2', // primary-400
                    '#85C1E9', // primary-300
                    '#AED6F1', // primary-200
                    '#D6EAF8', // primary-100
                ],
                borderColor: [
                    '#2E86C1', // primary-600
                    '#2874A6', // primary-700
                    '#21618C', // primary-800
                    '#1B4F72', // primary-900
                    '#153E59', // primary-950
                ],
                borderWidth: 2,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'إحصائيات عامة',
                font: {
                    size: 16,
                },
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.label}: ${context.raw}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'العدد',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'الفئة',
                },
            },
        },
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'الاتجاهات',
                font: {
                    size: 16,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'توزيع الخدمات',
                font: {
                    size: 16,
                },
            },
        },
    };

    return (
        <div className="p-8 space-y-10 bg-gray-50 dark:bg-gray-900 min-h-screen" dir="rtl">
            {/* Header */}
            <div className="mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">لوحة التحكم الإدارية</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">مرحباً {auth.user.name}، إليك نظرة عامة على إحصائيات النظام والأداء</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date().toLocaleDateString('ar', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {[
                    { title: "إجمالي المرضى", value: stats.patients, icon: UserGroupIcon },
                    { title: "إجمالي الأطباء", value: stats.doctors, icon: UserIcon },
                    { title: "حجوزات اليوم", value: stats.todaysAppointments, icon: CalendarDaysIcon },
                    { title: "حجوزات معلقة", value: stats.pendingAppointments, icon: ClockIcon },
                    { title: "إجمالي الإيرادات", value: `${stats.totalRevenue} $`, icon: CurrencyDollarIcon },
                    { title: "إيرادات الشهر", value: `${stats.monthlyRevenue} $`, icon: ArrowTrendingUpIcon },
                ].map((item, i) => (
                    <StatCard key={i} title={item.title} value={item.value} icon={item.icon} />
                ))}
            </div>

            {/* Chart Section */}
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                <Card className="border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center">
                            <ChartBarIcon className="w-5 h-5 mr-2" />
                            إحصائيات عامة
                        </h3>
                        <div className="w-full" aria-label="مخطط إحصائيات عامة">
                            <Bar data={barChartData} options={barChartOptions} />
                        </div>
                    </div>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center">
                            <ArrowTrendingUpIcon className="w-5 h-5 mr-2" />
                            اتجاه تسجيل المرضى
                        </h3>
                        <div className="w-full" aria-label="مخطط اتجاه المرضى">
                            <Line data={patientGrowthData} options={lineChartOptions} />
                        </div>
                    </div>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl p-6">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center">
                            <ChartBarIcon className="w-5 h-5 mr-2" />
                            توزيع الخدمات
                        </h3>
                        <div className="w-full" aria-label="مخطط توزيع الخدمات">
                            <Doughnut data={serviceDistributionData} options={pieChartOptions} />
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Additional Charts */}
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
                <Card className="border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center">
                            <CalendarDaysIcon className="w-5 h-5 mr-2" />
                            اتجاه الحجوزات
                        </h3>
                        <div className="w-full" aria-label="مخطط اتجاه الحجوزات">
                            <Line data={appointmentTrendsData} options={lineChartOptions} />
                        </div>
                    </div>
                </Card>

                {/* Notifications */}
                <Card className="border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center">
                            <BellIcon className="w-5 h-5 mr-2" />
                            الإشعارات الأخيرة
                        </h3>
                        <div className="space-y-3">
                            {recentNotifications.length > 0 ? recentNotifications.map(notification => (
                                <div key={notification.id} className="p-3 bg-primary-50 dark:bg-primary-900 rounded-lg">
                                    <div className="flex items-start">
                                        <ExclamationTriangleIcon className={`w-5 h-5 mr-3 mt-0.5 ${notification.type === 'error' ? 'text-red-500' : notification.type === 'warning' ? 'text-yellow-500' : 'text-primary-500'}`} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{notification.title}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{notification.message}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{new Date(notification.created_at).toLocaleDateString('ar')}</p>
                                        </div>
                                    </div>
                                </div>
                            )) : <p className="text-gray-500 dark:text-gray-400">لا توجد إشعارات جديدة</p>}
                        </div>
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card className="border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center">
                            <ArrowTrendingUpIcon className="w-5 h-5 mr-2" />
                            إجراءات سريعة
                        </h3>
                        <div className="space-y-4">
                            <Link
                                href={route('patients.index')}
                                className="block p-3 bg-primary-50 dark:bg-primary-900 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
                            >
                                <div className="flex items-center">
                                    <UserIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3" />
                                    <span className="text-primary-600 dark:text-primary-400 font-medium">إدارة المرضى</span>
                                </div>
                            </Link>
                            <Link
                                href={route('appointments.index')}
                                className="block p-3 bg-primary-100 dark:bg-primary-800 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors"
                            >
                                <div className="flex items-center">
                                    <CalendarDaysIcon className="w-5 h-5 text-primary-500 dark:text-primary-300 mr-3" />
                                    <span className="text-primary-500 dark:text-primary-300 font-medium">إدارة الحجوزات</span>
                                </div>
                            </Link>
                            <Link
                                href={route('reports.index')}
                                className="block p-3 bg-primary-200 dark:bg-primary-700 rounded-lg hover:bg-primary-300 dark:hover:bg-primary-600 transition-colors"
                            >
                                <div className="flex items-center">
                                    <ChartBarIcon className="w-5 h-5 text-primary-700 dark:text-primary-500 mr-3" />
                                    <span className="text-primary-700 dark:text-primary-500 font-medium">عرض التقارير</span>
                                </div>
                            </Link>
                            <Link
                                href={route('settings.index')}
                                className="block p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="flex items-center">
                                    <ClockIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">الإعدادات</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};


const DoctorDashboard = ({ todaysAppointments, recentPatients }: { todaysAppointments: any[], recentPatients: any[] }) => (
    <div className="p-6" dir="rtl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">لوحة التحكم الطبيب</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">حجوزات اليوم</h3>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {todaysAppointments.map(appointment => (
                        <li key={appointment.id} className="py-3 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{appointment.patient.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.start_time}</p>
                            </div>
                            <Link href={route('appointments.show', appointment.id)} className="text-primary-600 hover:text-primary-900 font-semibold">
                                عرض
                            </Link>
                        </li>
                    ))}
                </ul>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">المرضى الأخيرون</h3>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentPatients.map(patient => (
                        <li key={patient.id} className="py-3 flex justify-between items-center">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{patient.name}</p>
                            <Link href={route('patients.show', patient.id)} className="text-primary-600 hover:text-primary-900 font-semibold">
                                عرض الملف الشخصي
                            </Link>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
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
        <div className="p-6" dir="rtl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">لوحة التحكم الاستقبال</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">حجز سريع</h3>
                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="patient_id" value="المريض" />
                                <select id="patient_id" name="patient_id" value={data.patient_id} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm" onChange={(e) => setData('patient_id', e.target.value)}>
                                    <option value="">اختر المريض</option>
                                    {patients.map(patient => (
                                        <option key={patient.id} value={patient.id}>{patient.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.patient_id} className="mt-2" />
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="doctor_id" value="الطبيب" />
                                <select id="doctor_id" name="doctor_id" value={data.doctor_id} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm" onChange={(e) => setData('doctor_id', e.target.value)}>
                                    <option value="">تحديد طبيب</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor.id} value={doctor.id}>{doctor.user.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.doctor_id} className="mt-2" />
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="date" value="التاريخ" />
                                <TextInput id="date" type="date" name="date" value={data.date} className="mt-1 block w-full" onChange={(e) => setData('date', e.target.value)} />
                                <InputError message={errors.date} className="mt-2" />
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="start_time" value="وقت البداية" />
                                <TextInput id="start_time" type="time" name="start_time" value={data.start_time} className="mt-1 block w-full" onChange={(e) => setData('start_time', e.target.value)} />
                                <InputError message={errors.start_time} className="mt-2" />
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="end_time" value="وقت النهاية" />
                                <TextInput id="end_time" type="time" name="end_time" value={data.end_time} className="mt-1 block w-full" onChange={(e) => setData('end_time', e.target.value)} />
                                <InputError message={errors.end_time} className="mt-2" />
                            </div>
                            <div className="flex items-center justify-end mt-4">
                                <Button className="ms-4" disabled={processing}>
                                    حجز
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">حجوزات اليوم</h3>
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {todaysAppointments.map(appointment => (
                                <li key={appointment.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{appointment.patient.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.doctor.user.name} في {appointment.start_time}</p>
                                    </div>
                                    <Link href={route('appointments.show', appointment.id)} className="text-primary-600 hover:text-primary-900 font-semibold">
                                        عرض
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard({ auth, stats, charts, todaysAppointments, recentPatients, patients, doctors, recentNotifications }: PageProps<{ stats: any, charts: any, todaysAppointments: any[], recentPatients: any[], patients: any[], doctors: any[], recentNotifications: Notification[] }>) {
    const renderDashboard = () => {
        switch (auth.user.role) {
            case 'admin':
                return <AdminDashboard auth={auth} stats={stats} charts={charts} recentNotifications={recentNotifications} />;
            case 'doctor':
                return <DoctorDashboard todaysAppointments={todaysAppointments} recentPatients={recentPatients} />;
            case 'receptionist':
                return <ReceptionistDashboard todaysAppointments={todaysAppointments} patients={patients} doctors={doctors} />;
            default:
                return <div className="p-6 text-gray-900 dark:text-gray-100" dir="rtl">تم تسجيل الدخول!</div>;
        }
    };

    return (
        <AuthenticatedLayout
            header="لوحة التحكم"
        >
            <Head title="لوحة التحكم" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        {renderDashboard()}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
