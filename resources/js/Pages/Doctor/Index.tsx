import { PageProps, PaginatedResponse, Doctor } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { PlusIcon, UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, doctors, search }: PageProps<{ doctors: PaginatedResponse<Doctor>; search?: string }>) {
    const { data, setData, get, processing } = useForm({
        search: search || '',
    });

    const submit = (e: any) => {
        e.preventDefault();
        get(route('doctors.index'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Doctors</h2>}
        >
            <Head title="Doctors" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Doctor List</h3>
                            <Link href={route('doctors.create')}>
                                <Button>Add Doctor</Button>
                            </Link>
                        </div>
                        <form onSubmit={submit} className="mb-4">
                            <div className="flex items-center">
                                <InputLabel htmlFor="search" value="Search" className="sr-only" />
                                <TextInput
                                    id="search"
                                    name="search"
                                    value={data.search}
                                    className="mr-2"
                                    placeholder="Search doctors..."
                                    onChange={(e) => setData('search', e.target.value)}
                                />
                                <Button type="submit" disabled={processing}>Search</Button>
                            </div>
                        </form>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment %</th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {doctors.data.length > 0 ? (
                                    doctors.data.map((doctor) => (
                                        <tr key={doctor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{doctor.user?.name || doctor.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{doctor.user?.email || 'Not Assigned'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{doctor.specialization}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{doctor.clinic?.name || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{doctor.payment_percentage}%</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link href={route('doctors.edit', doctor.id)} className="text-indigo-600 hover:text-indigo-900 font-semibold">
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12">
                                            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No doctors found</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new doctor.</p>
                                            <div className="mt-6">
                                                <Link href={route('doctors.create')}>
                                                    <Button>
                                                        <PlusIcon className="h-5 w-5 mr-2" />
                                                        Add Doctor
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}