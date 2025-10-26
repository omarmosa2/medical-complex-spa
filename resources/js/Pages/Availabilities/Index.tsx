import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps, DoctorAvailability } from '@/types';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { FormEventHandler } from 'react';

export default function Index({ auth, availabilities }: PageProps<{ availabilities: DoctorAvailability[] }>) {
    const { data, setData, post, processing, errors } = useForm({
        day_of_week: 0,
        start_time: '',
        end_time: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('availabilities.store'));
    };

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">My Availability</h2>}
        >
            <Head title="My Availability" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <Card>
                            <h3 className="text-lg font-semibold mb-4">Add New Slot</h3>
                            <form onSubmit={submit}>
                                <div>
                                    <InputLabel htmlFor="day_of_week" value="Day" />
                                    <select
                                        id="day_of_week"
                                        name="day_of_week"
                                        value={data.day_of_week}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('day_of_week', parseInt(e.target.value))}
                                    >
                                        {days.map((day, index) => (
                                            <option key={index} value={index}>{day}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.day_of_week} className="mt-2" />
                                </div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="start_time" value="Start Time" />
                                    <TextInput
                                        id="start_time"
                                        type="time"
                                        name="start_time"
                                        value={data.start_time}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('start_time', e.target.value)}
                                    />
                                    <InputError message={errors.start_time} className="mt-2" />
                                </div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="end_time" value="End Time" />
                                    <TextInput
                                        id="end_time"
                                        type="time"
                                        name="end_time"
                                        value={data.end_time}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('end_time', e.target.value)}
                                    />
                                    <InputError message={errors.end_time} className="mt-2" />
                                </div>
                                <div className="flex items-center justify-end mt-4">
                                    <Button className="ms-4" disabled={processing}>
                                        Add
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                    <div className="md:col-span-2">
                        <Card>
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Day</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Start Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">End Time</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {availabilities.map(availability => (
                                        <tr key={availability.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{days[availability.day_of_week]}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{availability.start_time}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{availability.end_time}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <Link href={route('availabilities.destroy', availability.id)} method="delete" as="button" className="text-red-600 hover:text-red-900">Delete</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}