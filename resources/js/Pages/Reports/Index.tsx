import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps, Clinic } from '@/types';
import Card from '@/Components/Card';
import { FormEventHandler } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Button from '@/Components/Button';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface RevenueData {
    clinic_name: string;
    total_revenue: number;
}

export default function Index({ auth, revenueByClinic, clinics, filters }: PageProps<{ revenueByClinic: RevenueData[], clinics: Clinic[], filters: any }>) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        clinic_id: filters.clinic_id || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        get(route('reports.financial'));
    };

    const chartData = {
        labels: revenueByClinic.map(item => item.clinic_name),
        datasets: [
            {
                label: 'Total Revenue',
                data: revenueByClinic.map(item => item.total_revenue),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
        ],
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Financial Reports</h2>}
        >
            <Head title="Financial Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <form onSubmit={submit} className="flex items-center space-x-4 mb-6">
                            <div>
                                <InputLabel htmlFor="start_date" value="Start Date" />
                                <TextInput id="start_date" type="date" name="start_date" value={data.start_date} className="mt-1 block w-full" onChange={(e) => setData('start_date', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel htmlFor="end_date" value="End Date" />
                                <TextInput id="end_date" type="date" name="end_date" value={data.end_date} className="mt-1 block w-full" onChange={(e) => setData('end_date', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel htmlFor="clinic_id" value="Clinic" />
                                <select id="clinic_id" name="clinic_id" value={data.clinic_id} className="mt-1 block w-full" onChange={(e) => setData('clinic_id', e.target.value)}>
                                    <option value="">All Clinics</option>
                                    {clinics.map(clinic => (
                                        <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-6">
                                <Button disabled={processing}>Filter</Button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <Bar data={chartData} />
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}