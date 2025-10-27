import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { UsersIcon, UserCircleIcon, CalendarIcon, CurrencyDollarIcon, TrendingUpIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function Dashboard({ stats, charts, todaysAppointments, recentPatients }) {
    const statCards = [
        { name: 'المرضى', stat: stats?.patients || 0, icon: UsersIcon, color: 'bg-blue-500', href: route('patients.index') },
        { name: 'الأطباء', stat: stats?.doctors || 0, icon: UserCircleIcon, color: 'bg-green-500', href: route('doctors.index') },
        { name: 'المواعيد اليوم', stat: stats?.todaysAppointments || 0, icon: CalendarIcon, color: 'bg-yellow-500', href: route('appointments.index') },
        { name: 'الإيرادات الشهرية', stat: `$${stats?.monthlyRevenue || 0}`, icon: CurrencyDollarIcon, color: 'bg-purple-500', href: route('payments.index') },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        11لوحة التحكم
                    </h2>
                    <div className="flex space-x-2">
                        <Button as={Link} href={route('appointments.create')} className="bg-primary hover:bg-primary-dark">
                            <PlusIcon className="h-5 w-5 mr-2" />
                        </Button>
                        <Button as={Link} href={route('patients.create')} variant="outline">
                            <PlusIcon className="h-5 w-5 mr-2" />
                            مريض جديد
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="لوحة التحكم" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((item) => (
                            <Card key={item.name} className="p-6 hover:shadow-lg transition-shadow">
                                <Link href={item.href} className="block">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {item.name}
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                                {item.stat}
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-full ${item.color}`}>
                                            <item.icon className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                </Link>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Appointments */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    المواعيد اليوم
                                </h3>
                                <Link href={route('appointments.index')} className="text-sm text-primary hover:text-primary-dark">
                                    عرض الكل
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {todaysAppointments && todaysAppointments.length > 0 ? (
                                    todaysAppointments.slice(0, 5).map((appointment) => (
                                        <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {appointment.patient?.name || 'Unknown'}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {appointment.doctor?.user?.name || 'Unknown'} - {appointment.appointment_time}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">لا توجد مواعيد اليوم.</p>
                                )}
                            </div>
                        </Card>

                        {/* Recent Patients */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    المرضى الجدد
                                </h3>
                                <Link href={route('patients.index')} className="text-sm text-primary hover:text-primary-dark">
                                    عرض الكل
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentPatients && recentPatients.length > 0 ? (
                                    recentPatients.slice(0, 5).map((patient) => (
                                        <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {patient.name}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {patient.phone}
                                                </p>
                                            </div>
                                            <Link href={route('patients.show', patient.id)} className="text-primary hover:text-primary-dark">
                                                <EyeIcon className="h-5 w-5" />
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">لا يوجد مرضى جدد.</p>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    {charts?.patientGrowth && (
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                نمو عدد المرضى
                            </h3>
                            <div className="h-64 flex items-center justify-center text-gray-500">
                                <span>يمكن إضافة رسم بياني تفاعلي هنا باستخدام Chart.js</span>
                            </div>
                        </Card>
                    )}

                    {/* Quick Actions */}
                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                            إجراءات سريعة
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Button as={Link} href={route('appointments.index')} variant="outline" className="justify-start">
                                <CalendarIcon className="h-5 w-5 mr-2" />
                                عرض المواعيد
                            </Button>
                            <Button as={Link} href={route('patients.index')} variant="outline" className="justify-start">
                                <UsersIcon className="h-5 w-5 mr-2" />
                                إدارة المرضى
                            </Button>
                            <Button as={Link} href={route('reports.index')} variant="outline" className="justify-start">
                                <TrendingUpIcon className="h-5 w-5 mr-2" />
                                التقارير
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
