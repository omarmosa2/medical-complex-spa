import { PageProps, Appointment, Patient, Doctor, Service, Clinic } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';
import { FormEventHandler, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { PlusIcon, CalendarDaysIcon, TableCellsIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Create from './Create';

interface AppointmentsIndexProps {
    appointments: {
        data: Appointment[];
        links: any[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
    clinics: Clinic[];
    patients: Patient[];
    doctors: Doctor[];
    services: Service[];
    filters: any;
    filterOptions: {
        statuses: string[];
        clinics: any[];
        doctors: any[];
        services: any[];
    };
}

export default function Index({ auth, appointments, clinics, patients, doctors, services, filters, filterOptions }: PageProps<AppointmentsIndexProps>) {
    const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Get current filter values
    const { search = '', status = '', clinic_id = '', doctor_id = '', service_id = '', date_from = '', date_to = '' } = filters || {};

    // Handle search and filter changes
    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1'); // Reset to first page
        window.location.href = `${window.location.pathname}?${params.toString()}`;
    };

    // Clear all filters
    const clearFilters = () => {
        window.location.href = window.location.pathname;
    };

    const events = appointments.data.map(app => {
        // Combine date and time for calendar display
        let startDateTime = '';
        if (app.appointment_date && app.appointment_time) {
            startDateTime = `${app.appointment_date} ${app.appointment_time}:00`;
        } else if (app.appointment_time) {
            startDateTime = app.appointment_time;
        }
        
        return {
            id: app.id.toString(),
            title: `${app.patient?.full_name || 'Unknown'} - ${app.service?.name || 'Unknown'}`,
            start: startDateTime,
            extendedProps: {
                clinic: app.clinic?.name,
            }
        };
    });

    function getStatusColor(status: Appointment['status']) {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'no_show': return 'bg-gray-100 text-gray-800';
            case 'scheduled':
            default:
                return 'bg-blue-100 text-blue-800';
        }
    }

    function getStatusText(status: Appointment['status']) {
        switch (status) {
            case 'completed': return 'مكتمل';
            case 'cancelled': return 'ملغي';
            case 'no_show': return 'لم يحضر';
            case 'scheduled':
            default:
                return 'مجدول';
        }
    }

    const handleDateClick = (arg: any) => {
        setSelectedDate(arg.dateStr);
        setCreateModalOpen(true);
    }

    const handleEventClick = (arg: any) => {
        const appointment = appointments.data.find(app => app.id.toString() === arg.event.id);
        if (appointment) {
            setSelectedAppointment(appointment);
            // setEditModalOpen(true);
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">المواعيد</h2>
                    <div className="flex items-center space-x-4">
                        {/* View Mode Toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    viewMode === 'table'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <TableCellsIcon className="h-4 w-4 inline mr-1" />
                                جدول
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    viewMode === 'calendar'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                                تقويم
                            </button>
                        </div>
                        <Button onClick={() => setIsModalOpen(true)}>
                            <PlusIcon className="h-5 w-5 mr-2" />
                            إضافة موعد جديد
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="المواعيد" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        {/* Search and Filters */}
                        <div className="mb-6 space-y-4">
                            {/* Search Input */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <TextInput
                                        type="text"
                                        placeholder="البحث في المواعيد..."
                                        defaultValue={search}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleFilterChange('search', e.currentTarget.value);
                                            }
                                        }}
                                        className="w-full"
                                    />
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={clearFilters}
                                    className="px-4"
                                >
                                    مسح الفلاتر
                                </Button>
                            </div>

                            {/* Filter Dropdowns */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                {/* Status Filter */}
                                <div>
                                    <InputLabel htmlFor="status">الحالة</InputLabel>
                                    <select
                                        id="status"
                                        value={status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">جميع الحالات</option>
                                        {filterOptions.statuses.map((statusOpt) => (
                                            <option key={statusOpt} value={statusOpt}>
                                                {getStatusText(statusOpt as Appointment['status'])}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Clinic Filter */}
                                <div>
                                    <InputLabel htmlFor="clinic">العيادة</InputLabel>
                                    <select
                                        id="clinic"
                                        value={clinic_id}
                                        onChange={(e) => handleFilterChange('clinic_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">جميع العيادات</option>
                                        {filterOptions.clinics.map((clinic) => (
                                            <option key={clinic.id} value={clinic.id}>
                                                {clinic.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Doctor Filter */}
                                <div>
                                    <InputLabel htmlFor="doctor">الطبيب</InputLabel>
                                    <select
                                        id="doctor"
                                        value={doctor_id}
                                        onChange={(e) => handleFilterChange('doctor_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">جميع الأطباء</option>
                                        {filterOptions.doctors.map((doctor) => (
                                            <option key={doctor.id} value={doctor.id}>
                                                {doctor.user?.name || 'طبيب غير محدد'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Service Filter */}
                                <div>
                                    <InputLabel htmlFor="service">الخدمة</InputLabel>
                                    <select
                                        id="service"
                                        value={service_id}
                                        onChange={(e) => handleFilterChange('service_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">جميع الخدمات</option>
                                        {filterOptions.services.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date Range */}
                                <div>
                                    <InputLabel htmlFor="date_from">من تاريخ</InputLabel>
                                    <TextInput
                                        type="date"
                                        id="date_from"
                                        value={date_from}
                                        onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Content based on view mode */}
                        {viewMode === 'table' ? (
                            <div className="overflow-x-auto">
                                {appointments.data.length > 0 ? (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    المريض
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    الطبيب
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    الخدمة
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    التاريخ والوقت
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    العيادة
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    الحالة
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    الإجراءات
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {appointments.data.map((appointment) => (
                                                <tr key={appointment.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {appointment.patient?.full_name || 'غير محدد'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {appointment.doctor?.user?.name || 'غير محدد'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {appointment.service?.name || 'غير محدد'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div>
                                                            <div className="font-medium">{appointment.appointment_date}</div>
                                                            <div className="text-gray-400">{appointment.appointment_time}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {appointment.clinic?.name || 'غير محدد'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                                            {getStatusText(appointment.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={`/appointments/${appointment.id}`}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            عرض
                                                        </Link>
                                                        <Link
                                                            href={`/appointments/${appointment.id}/edit`}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            تعديل
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-12">
                                        <ListBulletIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">لا توجد مواعيد</h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {search || status || clinic_id || doctor_id || service_id || date_from || date_to
                                                ? 'لا توجد مواعيد تطابق المعايير المحددة'
                                                : 'ابدأ بحجز موعد جديد'
                                            }
                                        </p>
                                        <div className="mt-6">
                                            <Button onClick={() => setIsModalOpen(true)}>
                                                <PlusIcon className="h-5 w-5 mr-2" />
                                                إضافة موعد جديد
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Calendar View */
                            appointments.data.length > 0 ? (
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
                                    height="auto"
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
                            )
                        )}

                        {/* Pagination */}
                        {appointments.data.length > 0 && viewMode === 'table' && (
                            <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                                <div className="flex flex-1 justify-between sm:hidden">
                                    {appointments.links && appointments.links.map((link, index) => (
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                                    link.active
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : null
                                    ))}
                                </div>
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            عرض{' '}
                                            <span className="font-medium">
                                                {((appointments.current_page - 1) * appointments.per_page) + 1}
                                            </span>{' '}
                                            إلى{' '}
                                            <span className="font-medium">
                                                {Math.min(appointments.current_page * appointments.per_page, appointments.total)}
                                            </span>{' '}
                                            من أصل{' '}
                                            <span className="font-medium">{appointments.total}</span>{' '}
                                            نتيجة
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                            {appointments.links && appointments.links.map((link, index) => (
                                                link.url ? (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                            index === 0
                                                                ? 'rounded-l-md'
                                                                : index === appointments.links.length - 1
                                                                ? 'rounded-r-md'
                                                                : ''
                                                        } ${
                                                            link.active
                                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ) : (
                                                    <span
                                                        key={index}
                                                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                )
                                            ))}
                                        </nav>
                                    </div>
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