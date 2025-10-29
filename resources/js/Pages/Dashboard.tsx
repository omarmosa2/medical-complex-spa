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

    // Line chart for patient growth (with demo fallback)
    const patientGrowth = (charts.patientGrowth && charts.patientGrowth.length > 0)
        ? charts.patientGrowth
        : [
            { date: '2025-10-01', count: 2 },
            { date: '2025-10-05', count: 4 },
            { date: '2025-10-10', count: 3 },
            { date: '2025-10-15', count: 6 },
            { date: '2025-10-20', count: 5 },
            { date: '2025-10-25', count: 8 },
        ];
    const patientGrowthData = {
        labels: patientGrowth.map((item: any) => item.date),
        datasets: [
            {
                label: 'تسجيل المرضى',
                data: patientGrowth.map((item: any) => item.count),
                borderColor: '#3498DB', // primary-500
                backgroundColor: 'rgba(52, 152, 219, 0.2)', // primary-500 with opacity
                tension: 0.4,
            },
        ],
    };

    // Line chart for appointment trends (with demo fallback)
    const appointmentTrends = (charts.appointmentTrends && charts.appointmentTrends.length > 0)
        ? charts.appointmentTrends
        : [
            { date: '2025-10-01', count: 1 },
            { date: '2025-10-05', count: 2 },
            { date: '2025-10-10', count: 1 },
            { date: '2025-10-15', count: 3 },
            { date: '2025-10-20', count: 2 },
            { date: '2025-10-25', count: 4 },
        ];
    const appointmentTrendsData = {
        labels: appointmentTrends.map((item: any) => item.date),
        datasets: [
            {
                label: 'حجوزات يومية',
                data: appointmentTrends.map((item: any) => item.count),
                borderColor: '#5DADE2', // primary-400
                backgroundColor: 'rgba(93, 173, 226, 0.2)', // primary-400 with opacity
                tension: 0.4,
            },
        ],
    };

    // Revenue per month (12 months) with demo fallback
    const monthlyRevenue = (charts.monthlyRevenue && charts.monthlyRevenue.length > 0)
        ? charts.monthlyRevenue
        : [
            { month: '2025-01', total: 1200 },
            { month: '2025-02', total: 900 },
            { month: '2025-03', total: 1500 },
            { month: '2025-04', total: 1100 },
            { month: '2025-05', total: 1700 },
            { month: '2025-06', total: 1400 },
            { month: '2025-07', total: 1600 },
            { month: '2025-08', total: 1800 },
            { month: '2025-09', total: 1300 },
            { month: '2025-10', total: 1900 },
            { month: '2025-11', total: 1750 },
            { month: '2025-12', total: 2000 },
        ];
    const revenueBarData = {
        labels: monthlyRevenue.map((r: any) => r.month),
        datasets: [
            {
                label: 'الإيراد الشهري',
                data: monthlyRevenue.map((r: any) => r.total),
                backgroundColor: '#10B981',
                borderColor: '#059669',
                borderWidth: 2,
            },
        ],
    };

    // Pie chart for service distribution (with demo fallback)
    const serviceDistribution = (charts.serviceDistribution && charts.serviceDistribution.length > 0)
        ? charts.serviceDistribution
        : [
            { service: 'استشارة', count: 10 },
            { service: 'تنظيف أسنان', count: 6 },
            { service: 'تحاليل', count: 8 },
        ];
    const serviceDistributionData = {
        labels: serviceDistribution.map((item: any) => item.service),
        datasets: [
            {
                data: serviceDistribution.map((item: any) => item.count),
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
        <div className="space-y-10" dir="rtl">
            {/* Header */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-3">لوحة التحكم الإدارية</h2>
                        <p className="text-muted-foreground text-lg">مرحباً {auth.user.name}، إليك نظرة عامة على إحصائيات النظام والأداء</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <div className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString('ar', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <Link
                    href={route('patients.create')}
                    className="group relative overflow-hidden rounded-xl border border-border bg-card hover:bg-muted/60 dark:hover:bg-muted/10 shadow-md hover:shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 p-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="mr-3 grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                <UserIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">إجراء سريع</p>
                                <p className="font-semibold text-foreground">مريض جديد</p>
                            </div>
                        </div>
                        <span className="opacity-0 group-hover:opacity-100 text-primary transition-opacity">→</span>
                    </div>
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 group-hover:from-primary/5 group-hover:via-primary/0 group-hover:to-primary/10 transition-colors"></span>
                </Link>

                <Link
                    href={route('appointments.create')}
                    className="group relative overflow-hidden rounded-xl border border-border bg-card hover:bg-muted/60 dark:hover:bg-muted/10 shadow-md hover:shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 p-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="mr-3 grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                <CalendarDaysIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">إجراء سريع</p>
                                <p className="font-semibold text-foreground">موعد جديد</p>
                            </div>
                        </div>
                        <span className="opacity-0 group-hover:opacity-100 text-primary transition-opacity">→</span>
                    </div>
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 group-hover:from-primary/5 group-hover:via-primary/0 group-hover:to-primary/10 transition-colors"></span>
                </Link>

                <Link
                    href={route('reports.index')}
                    className="group relative overflow-hidden rounded-xl border border-border bg-card hover:bg-muted/60 dark:hover:bg-muted/10 shadow-md hover:shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 p-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="mr-3 grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                <ChartBarIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">إجراء سريع</p>
                                <p className="font-semibold text-foreground">التقارير</p>
                            </div>
                        </div>
                        <span className="opacity-0 group-hover:opacity-100 text-primary transition-opacity">→</span>
                    </div>
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 group-hover:from-primary/5 group-hover:via-primary/0 group-hover:to-primary/10 transition-colors"></span>
                </Link>

                <Link
                    href={route('settings.index')}
                    className="group relative overflow-hidden rounded-xl border border-border bg-card hover:bg-muted/60 dark:hover:bg-muted/10 shadow-md hover:shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 p-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="mr-3 grid place-items-center h-10 w-10 rounded-lg bg-muted text-foreground/70 group-hover:bg-muted/80 transition-colors">
                                <ClockIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">إجراء سريع</p>
                                <p className="font-semibold text-foreground">الإعدادات</p>
                            </div>
                        </div>
                        <span className="opacity-0 group-hover:opacity-100 text-primary transition-opacity">→</span>
                    </div>
                </Link>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {[
                    { title: "إجمالي المرضى", value: stats.patients || 0, icon: UserGroupIcon },
                    { title: "إجمالي الأطباء", value: stats.doctors || 0, icon: UserIcon },
                    { title: "حجوزات اليوم", value: stats.todaysAppointments || 0, icon: CalendarDaysIcon },
                    { title: "حجوزات معلقة", value: stats.pendingAppointments || 0, icon: ClockIcon },
                    { title: "إجمالي الإيرادات", value: `${stats.totalRevenue || 0} $`, icon: CurrencyDollarIcon },
                    { title: "إيرادات الشهر", value: `${stats.monthlyRevenue || 0} $`, icon: ArrowTrendingUpIcon },
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
                <Card className="border border-border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-foreground mb-6 border-b border-border pb-3 flex items-center">
                            <ChartBarIcon className="w-5 h-5 mr-2" />
                            الإيراد الشهري (12 شهر)
                        </h3>
                        <div className="w-full" aria-label="monthly-revenue">
                            <Bar data={revenueBarData} options={barChartOptions} />
                        </div>
                    </div>
                </Card>

                <Card className="border border-border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-foreground mb-6 border-b border-border pb-3 flex items-center">
                            <ArrowTrendingUpIcon className="w-5 h-5 mr-2" />
                            اتجاه تسجيل المرضى
                        </h3>
                        <div className="w-full" aria-label="مخطط اتجاه المرضى">
                            <Line data={patientGrowthData} options={lineChartOptions} />
                        </div>
                    </div>
                </Card>

                <Card className="border border-border shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-foreground mb-6 border-b border-border pb-3 flex items-center">
                            <ChartBarIcon className="w-5 h-5 mr-2" />
                            توزيع الخدمات
                        </h3>
                        <div className="w-full" aria-label="مخطط توزيع الخدمات">
                            <Doughnut data={serviceDistributionData} options={pieChartOptions} />
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Secondary Charts */}
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
                <Card className="border border-border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-foreground mb-6 border-b border-border pb-3 flex items-center">
                            <CalendarDaysIcon className="w-5 h-5 mr-2" />
                            اتجاه الحجوزات
                        </h3>
                        <div className="w-full" aria-label="مخطط اتجاه الحجوزات">
                            <Line data={appointmentTrendsData} options={lineChartOptions} />
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};


const DoctorDashboard = ({ todaysAppointments, recentPatients }: { todaysAppointments: any[], recentPatients: any[] }) => (
    <div className="space-y-6" dir="rtl">
        <h2 className="text-3xl font-bold text-foreground mb-4">لوحة التحكم الطبيب</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-3">حجوزات اليوم</h3>
                    <ul className="divide-y divide-border">
                        {todaysAppointments.map(appointment => (
                            <li key={appointment.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-foreground">{appointment.patient?.name || 'Unknown'}</p>
                                    <p className="text-sm text-muted-foreground">{appointment.start_time}</p>
                                </div>
                                <Link href={route('appointments.show', appointment.id)} className="text-primary hover:text-primary/80 font-semibold">
                                    عرض
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>
            <Card className="border border-border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-3">المرضى الأخيرون</h3>
                    <ul className="divide-y divide-border">
                        {recentPatients.map(patient => (
                            <li key={patient.id} className="py-3 flex justify-between items-center">
                                <p className="font-semibold text-foreground">{patient.name}</p>
                                <Link href={route('patients.show', patient.id)} className="text-primary hover:text-primary/80 font-semibold">
                                    عرض الملف الشخصي
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
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
        <div className="space-y-6" dir="rtl">
            <h2 className="text-3xl font-bold text-foreground mb-4">لوحة التحكم الاستقبال</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Card className="border border-border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-3">حجز سريع</h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="patient_id" value="المريض" />
                                    <select id="patient_id" name="patient_id" value={data.patient_id} className="mt-1 block w-full border-input bg-background text-foreground focus:border-primary focus:ring-primary rounded-md shadow-sm" onChange={(e) => setData('patient_id', e.target.value)}>
                                        <option value="">اختر المريض</option>
                                        {patients.map(patient => (
                                            <option key={patient.id} value={patient.id}>{patient.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.patient_id} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="doctor_id" value="الطبيب" />
                                    <select id="doctor_id" name="doctor_id" value={data.doctor_id} className="mt-1 block w-full border-input bg-background text-foreground focus:border-primary focus:ring-primary rounded-md shadow-sm" onChange={(e) => setData('doctor_id', e.target.value)}>
                                        <option value="">تحديد طبيب</option>
                                        {doctors.map(doctor => (
                                            <option key={doctor.id} value={doctor.id}>{doctor.user.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.doctor_id} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="date" value="التاريخ" />
                                    <TextInput id="date" type="date" name="date" value={data.date} className="mt-1 block w-full" onChange={(e) => setData('date', e.target.value)} />
                                    <InputError message={errors.date} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="start_time" value="وقت البداية" />
                                    <TextInput id="start_time" type="time" name="start_time" value={data.start_time} className="mt-1 block w-full" onChange={(e) => setData('start_time', e.target.value)} />
                                    <InputError message={errors.start_time} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="end_time" value="وقت النهاية" />
                                    <TextInput id="end_time" type="time" name="end_time" value={data.end_time} className="mt-1 block w-full" onChange={(e) => setData('end_time', e.target.value)} />
                                    <InputError message={errors.end_time} className="mt-2" />
                                </div>
                                <div className="flex items-center justify-end pt-4">
                                    <Button disabled={processing}>
                                        حجز
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Card className="border border-border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-3">حجوزات اليوم</h3>
                            <ul className="divide-y divide-border">
                                {todaysAppointments.map(appointment => (
                                    <li key={appointment.id} className="py-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-foreground">{appointment.patient?.name || 'Unknown'}</p>
                                            <p className="text-sm text-muted-foreground">{appointment.doctor?.user?.name || 'Unknown'} في {appointment.start_time}</p>
                                        </div>
                                        <Link href={route('appointments.show', appointment.id)} className="text-primary hover:text-primary/80 font-semibold">
                                            عرض
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
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
            header={
                <div className="flex justify-between items-center" dir="rtl">
                    <h2 className="font-semibold text-xl text-foreground leading-tight">لوحة التحكم</h2>
                </div>
            }
        >
            <Head title="لوحة التحكم" />
            
            <div className="p-6" dir="rtl">
                {renderDashboard()}
            </div>
        </AuthenticatedLayout>
    );
}
