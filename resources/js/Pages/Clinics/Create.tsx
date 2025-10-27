import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import { FormEventHandler } from 'react';

const days = ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];

export default function Create({ auth }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        location: '',
        notes: '',
        description: '',
        schedules: days.map((_, index) => ({
            day_of_week: index + 1,
            is_active: false,
            start_time: '09:00',
            end_time: '14:00',
        })),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('clinics.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">إضافة عيادة جديدة</h2>}
        >
            <Head title="إضافة عيادة" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="name" value="الاسم" />
                                <TextInput id="name" name="name" value={data.name} className="mt-1 block w-full" onChange={(e) => setData('name', e.target.value)} required />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="location" value="الموقع" />
                                <TextInput id="location" name="location" value={data.location} className="mt-1 block w-full" onChange={(e) => setData('location', e.target.value)} />
                                <InputError message={errors.location} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel value="الجدول الزمني" />
                                {days.map((day, index) => (
                                    <div key={day} className="mt-4 p-4 border rounded-md">
                                        <div className="flex items-center">
                                            <Checkbox
                                                checked={data.schedules[index].is_active}
                                                onChange={(e) => {
                                                    const newSchedules = [...data.schedules];
                                                    newSchedules[index] = { ...newSchedules[index], is_active: e.target.checked };
                                                    setData('schedules', newSchedules);
                                                }}
                                            />
                                            <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {day} {data.schedules[index].is_active ? '(يوم عمل)' : '(عطلة)'}
                                            </label>
                                        </div>
                                        {data.schedules[index].is_active && (
                                            <div className="mt-2 flex space-x-4">
                                                <div className="flex-1">
                                                    <InputLabel htmlFor={`start_time_${index}`} value="وقت البداية" />
                                                    <TextInput
                                                        id={`start_time_${index}`}
                                                        type="time"
                                                        value={data.schedules[index].start_time}
                                                        onChange={(e) => {
                                                            const newSchedules = [...data.schedules];
                                                            newSchedules[index] = { ...newSchedules[index], start_time: e.target.value };
                                                            setData('schedules', newSchedules);
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <InputLabel htmlFor={`end_time_${index}`} value="وقت النهاية" />
                                                    <TextInput
                                                        id={`end_time_${index}`}
                                                        type="time"
                                                        value={data.schedules[index].end_time}
                                                        onChange={(e) => {
                                                            const newSchedules = [...data.schedules];
                                                            newSchedules[index] = { ...newSchedules[index], end_time: e.target.value };
                                                            setData('schedules', newSchedules);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <InputError message={errors.schedules} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="notes" value="الملاحظات" />
                                <textarea id="notes" name="notes" value={data.notes} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300" rows={3} onChange={(e) => setData('notes', e.target.value)} />
                                <InputError message={errors.notes} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="الوصف" />
                                <textarea id="description" name="description" value={data.description} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300" rows={3} onChange={(e) => setData('description', e.target.value)} />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-6">
                                <Button className="ms-4" disabled={processing}>
                                    حفظ العيادة
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}