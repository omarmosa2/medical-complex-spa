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
import { PlusIcon, CalendarDaysIcon, TableCellsIcon, ListBulletIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
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
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
    
    // Form for deletion
    const deleteForm = useForm();
    
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
        
        // Get color based on status
        const getEventColor = (status: Appointment['status']) => {
            switch (status) {
                case 'completed': return '#10B981'; // green
                case 'cancelled': return '#EF4444'; // red
                case 'no_show': return '#6B7280'; // gray
                case 'scheduled':
                default:
                    return '#3B82F6'; // blue
            }
        };

        return {
            id: app.id.toString(),
            title: `${app.patient?.full_name || app.patient?.name || 'غير محدد'}\n${app.service?.name || 'خدمة غير محددة'}\n${app.appointment_time}`,
            start: startDateTime,
            backgroundColor: getEventColor(app.status),
            borderColor: getEventColor(app.status),
            textColor: '#ffffff',
            extendedProps: {
                patient: app.patient?.full_name || app.patient?.name || 'غير محدد',
                doctor: app.doctor?.user?.name || app.doctor?.name || 'غير محدد',
                service: app.service?.name || 'غير محدد',
                clinic: app.clinic?.name || 'غير محدد',
                status: app.status,
                statusText: getStatusText(app.status),
                appointment_date: app.appointment_date,
                appointment_time: app.appointment_time,
                notes: app.notes || '',
            }
        };
    });

    function getStatusColor(status: Appointment['status']) {
        switch (status) {
            case 'completed': return 'status-completed';
            case 'cancelled': return 'status-cancelled';
            case 'no_show': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
            case 'scheduled':
            default:
                return 'status-scheduled';
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
        setSelectedTime('09:00'); // Default time
        setCreateModalOpen(true);
    }

    const handleSelect = (arg: any) => {
        // Extract date and time from selected period
        const selectedDateTime = new Date(arg.start);
        const dateStr = selectedDateTime.toISOString().split('T')[0];
        const timeStr = selectedDateTime.toTimeString().slice(0, 5);
        
        setSelectedDate(dateStr);
        setSelectedTime(timeStr);
        setCreateModalOpen(true);
    }

    const handleEventClick = (arg: any) => {
        const appointment = appointments.data.find(app => app.id.toString() === arg.event.id);
        if (appointment) {
            setSelectedAppointment(appointment);
            // Could open edit modal or appointment details
        }
    }

    const handleEventDrop = (arg: any) => {
        // Handle drag and drop to reschedule appointment
        const appointment = appointments.data.find(app => app.id.toString() === arg.event.id);
        if (appointment) {
            const newDate = arg.event.start.toISOString().split('T')[0];
            const newTime = arg.event.start.toTimeString().slice(0, 5);
            
            // Check for conflicts before updating
            checkAppointmentConflict(appointment.doctor_id.toString(), newDate, newTime, appointment.id.toString())
                .then((hasConflict) => {
                    if (hasConflict) {
                        alert('يوجد تضارب في المواعيد. يرجى اختيار وقت آخر.');
                        // Revert the change
                        window.location.reload();
                    } else {
                        // Update appointment via API
                        useForm({
                            appointment_date: newDate,
                            appointment_time: newTime
                        }).put(`/appointments/${appointment.id}`, {
                            onSuccess: () => {
                                window.location.reload();
                            }
                        });
                    }
                });
        }
    }

    // Check for appointment conflicts
    const checkAppointmentConflict = async (doctorId: string, date: string, time: string, excludeId?: string) => {
        try {
            const params = new URLSearchParams({
                doctor_id: doctorId,
                appointment_date: date,
                appointment_time: time,
                ...(excludeId && { exclude_id: excludeId })
            });
            
            const response = await fetch(`/appointments/check-conflict?${params}`);
            const data = await response.json();
            return data.hasConflict;
        } catch (error) {
            console.error('Error checking appointment conflict:', error);
            return false;
        }
    }

    // Handle delete appointment
    const handleDeleteClick = (appointment: Appointment) => {
        setAppointmentToDelete(appointment);
        setDeleteModalOpen(true);
    }

    const confirmDelete = () => {
        if (appointmentToDelete) {
            deleteForm.delete(`/appointments/${appointmentToDelete.id}`, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setAppointmentToDelete(null);
                }
            });
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-foreground leading-tight">المواعيد</h2>
                    <div className="flex items-center space-x-4">
                        {/* View Mode Toggle */}
                        <div className="flex bg-muted rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    viewMode === 'table'
                                        ? 'bg-card text-primary shadow-sm border border-border'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <TableCellsIcon className="h-4 w-4 inline mr-1" />
                                جدول
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    viewMode === 'calendar'
                                        ? 'bg-card text-primary shadow-sm border border-border'
                                        : 'text-muted-foreground hover:text-foreground'
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
                                    onClick={clearFilters}
                                    className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700"
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
                                        className="mt-1 block w-full rounded-md border-input bg-background shadow-sm focus:border-primary focus:ring-primary text-foreground"
                                    >
                                        <option value="">جميع الحالات</option>
                                        {filterOptions.statuses.map((statusOpt) => (
                                            <option key={statusOpt} value={statusOpt} className="bg-background text-foreground">
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
                                        className="mt-1 block w-full rounded-md border-input bg-background shadow-sm focus:border-primary focus:ring-primary text-foreground"
                                    >
                                        <option value="">جميع العيادات</option>
                                        {filterOptions.clinics.map((clinic) => (
                                            <option key={clinic.id} value={clinic.id} className="bg-background text-foreground">
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
                                        className="mt-1 block w-full rounded-md border-input bg-background shadow-sm focus:border-primary focus:ring-primary text-foreground"
                                    >
                                        <option value="">جميع الأطباء</option>
                                        {filterOptions.doctors.map((doctor) => (
                                            <option key={doctor.id} value={doctor.id} className="bg-background text-foreground">
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
                                        className="mt-1 block w-full rounded-md border-input bg-background shadow-sm focus:border-primary focus:ring-primary text-foreground"
                                    >
                                        <option value="">جميع الخدمات</option>
                                        {filterOptions.services.map((service) => (
                                            <option key={service.id} value={service.id} className="bg-background text-foreground">
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
                                    <table className="min-w-full divide-y divide-border bg-background rounded-lg overflow-hidden">
                                        <thead className="bg-muted">
                                            <tr>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    المريض
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    الطبيب
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    الخدمة
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    التاريخ والوقت
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    العيادة
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    الحالة
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    الإجراءات
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-card divide-y divide-border">
                                            {appointments.data.map((appointment) => (
                                                <tr key={appointment.id} className="hover:bg-muted transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-foreground">
                                                        {appointment.patient?.full_name || appointment.patient?.name || 'غير محدد'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-muted-foreground">
                                                        {appointment.doctor?.user?.name || appointment.doctor?.name || 'غير محدد'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-muted-foreground">
                                                        {appointment.service?.name || 'غير محدد'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-muted-foreground">
                                                        <div className="flex flex-col items-center">
                                                            <div className="font-medium text-foreground">{appointment.appointment_date}</div>
                                                            <div className="text-muted-foreground">{appointment.appointment_time}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-muted-foreground">
                                                        {appointment.clinic?.name || 'غير محدد'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                                            {getStatusText(appointment.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <div className="flex justify-center space-x-2">
                                                            <Link
                                                                href={`/appointments/${appointment.id}`}
                                                                className="p-2 text-primary hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                                                                title="عرض التفاصيل"
                                                            >
                                                                <EyeIcon className="h-5 w-5" />
                                                            </Link>
                                                            <Link
                                                                href={`/appointments/${appointment.id}/edit`}
                                                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-colors"
                                                                title="تعديل"
                                                            >
                                                                <PencilIcon className="h-5 w-5" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDeleteClick(appointment)}
                                                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                                                title="حذف"
                                                            >
                                                                <TrashIcon className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-12">
                                        <ListBulletIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-2 text-sm font-medium text-foreground">لا توجد مواعيد</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
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
                            <div className="calendar-container">
                                {appointments.data.length > 0 ? (
                                    <FullCalendar
                                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                        initialView="timeGridWeek"
                                        locale="ar"
                                        direction="rtl"
                                        headerToolbar={{
                                            left: 'prev,next today',
                                            center: 'title',
                                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                        }}
                                        events={events}
                                        editable={true}
                                        selectable={true}
                                        selectMirror={true}
                                        dayMaxEvents={true}
                                        weekends={true}
                                        dateClick={handleDateClick}
                                        select={handleSelect}
                                        eventClick={handleEventClick}
                                        eventDrop={handleEventDrop}
                                        eventResize={handleEventDrop}
                                        height="auto"
                                        slotMinTime="08:00:00"
                                        slotMaxTime="20:00:00"
                                        slotDuration="00:30:00"
                                        snapDuration="00:15:00"
                                        expandRows={true}
                                        eventDisplay="block"
                                        eventTimeFormat={{
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        }}
                                        slotLabelFormat={{
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        }}
                                        eventContent={(arg) => {
                                            const { event } = arg;
                                            const props = event.extendedProps;
                                            
                                            return {
                                                html: `
                                                    <div class="fc-event-main-frame p-1">
                                                        <div class="fc-event-title-container">
                                                            <div class="fc-event-title fc-sticky text-white text-xs">
                                                                <strong>${props.patient}</strong><br>
                                                                <span>${props.service}</span><br>
                                                                <span>${props.appointment_time}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `
                                            };
                                        }}
                                        eventDidMount={(info) => {
                                            // Add custom styling and tooltips
                                            const props = info.event.extendedProps;
                                            info.el.setAttribute('title',
                                                `المريض: ${props.patient}\n` +
                                                `الطبيب: ${props.doctor}\n` +
                                                `الخدمة: ${props.service}\n` +
                                                `العيادة: ${props.clinic}\n` +
                                                `الحالة: ${props.statusText}\n` +
                                                `التاريخ: ${props.appointment_date}\n` +
                                                `الوقت: ${props.appointment_time}${props.notes ? '\nملاحظات: ' + props.notes : ''}`
                                            );
                                        }}
                                        businessHours={{
                                            daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Saturday
                                            startTime: '08:00',
                                            endTime: '20:00',
                                        }}
                                        nowIndicator={true}
                                        scrollTime="08:00:00"
                                        aspectRatio={1.8}
                                    />
                                ) : (
                                    <div className="text-center py-12">
                                        <CalendarDaysIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-2 text-sm font-medium text-foreground">لا توجد مواعيد</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">انقر على أي تاريخ في التقويم لإضافة موعد جديد.</p>
                                        <div className="mt-6">
                                            <Button onClick={() => setIsModalOpen(true)}>
                                                <PlusIcon className="h-5 w-5 mr-2" />
                                                إضافة موعد جديد
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {appointments.data.length > 0 && viewMode === 'table' && (
                            <div className="mt-6 flex items-center justify-between border-t border-border bg-card px-4 py-3 sm:px-6">
                                <div className="flex flex-1 justify-between sm:hidden">
                                    {appointments.links && appointments.links.map((link, index) => (
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                                    link.active
                                                        ? 'z-10 bg-primary/10 border-primary text-primary'
                                                        : 'bg-card border-border text-muted-foreground hover:bg-muted'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : null
                                    ))}
                                </div>
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            عرض{' '}
                                            <span className="font-medium text-foreground">
                                                {((appointments.current_page - 1) * appointments.per_page) + 1}
                                            </span>{' '}
                                            إلى{' '}
                                            <span className="font-medium text-foreground">
                                                {Math.min(appointments.current_page * appointments.per_page, appointments.total)}
                                            </span>{' '}
                                            من أصل{' '}
                                            <span className="font-medium text-foreground">{appointments.total}</span>{' '}
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
                                                                ? 'z-10 bg-primary/10 border-primary text-primary'
                                                                : 'bg-card border-border text-muted-foreground hover:bg-muted'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ) : (
                                                    <span
                                                        key={index}
                                                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-muted-foreground bg-card border border-border"
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
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedDate('');
                    setSelectedTime('');
                }}
                patients={patients}
                doctors={doctors}
                services={services}
                clinics={clinics}
                date={selectedDate}
                time={selectedTime}
            />

            {/* Delete Confirmation Modal */}
            <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        تأكيد الحذف
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        هل أنت متأكد من حذف موعد المريض "{appointmentToDelete?.patient?.full_name}" مع الدكتور "{appointmentToDelete?.doctor?.user?.name}"؟
                        لا يمكن التراجع عن هذا الإجراء.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <Button
                            onClick={() => setDeleteModalOpen(false)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                        >
                            إلغاء
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            disabled={deleteForm.processing}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {deleteForm.processing ? 'جارٍ الحذف...' : 'حذف'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}