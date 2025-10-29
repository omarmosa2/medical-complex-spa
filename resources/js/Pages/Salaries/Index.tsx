import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import Card from '@/Components/Card';
import { Link, router } from '@inertiajs/react';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Button from '@/Components/Button';
import { FormEventHandler } from 'react';

export default function Index({ auth, doctors, month }: PageProps<{ doctors: any[], month: string }>) {
    const { data, setData, post, processing, errors } = useForm({
        doctor_id: '',
        amount: '',
        note: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('salaries.bonus'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-foreground leading-tight">رواتب الأطباء</h2>}
        >
            <Head title="رواتب الأطباء" />

            <div className="p-6 space-y-6" dir="rtl">
                <Card className="border border-border shadow-md rounded-xl overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">إضافة مكافأة لطبيب</h3>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <InputLabel htmlFor="doctor_id" value="الطبيب" />
                                <select id="doctor_id" name="doctor_id" value={data.doctor_id} className="mt-1 block w-full border-input bg-background text-foreground focus:border-primary focus:ring-primary rounded-md shadow-sm" onChange={(e) => setData('doctor_id', e.target.value)}>
                                    <option value="">اختر الطبيب</option>
                                    {doctors.map((d) => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <InputLabel htmlFor="amount" value="المبلغ" />
                                <TextInput id="amount" name="amount" type="number" value={data.amount} className="mt-1 block w-full" onChange={(e) => setData('amount', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel htmlFor="note" value="ملاحظة" />
                                <TextInput id="note" name="note" value={data.note} className="mt-1 block w-full" onChange={(e) => setData('note', e.target.value)} />
                            </div>
                            <div className="md:col-span-3 flex justify-end">
                                <Button disabled={processing}>إضافة</Button>
                            </div>
                        </form>
                    </div>
                </Card>

                <Card className="border border-border shadow-md rounded-xl overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">رواتب شهر {month}</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-4 py-2 text-xs text-muted-foreground">الطبيب</th>
                                        <th className="px-4 py-2 text-xs text-muted-foreground">النسبة %</th>
                                        <th className="px-4 py-2 text-xs text-muted-foreground">مجموع الدفعات</th>
                                        <th className="px-4 py-2 text-xs text-muted-foreground">حصة الطبيب</th>
                                        <th className="px-4 py-2 text-xs text-muted-foreground">مكافآت</th>
                                        <th className="px-4 py-2 text-xs text-muted-foreground">الإجمالي</th>
                                        <th className="px-4 py-2 text-xs text-muted-foreground text-center">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-card divide-y divide-border">
                                    {doctors.map((d) => (
                                        <tr key={d.id}>
                                            <td className="px-4 py-2 text-sm text-foreground">{d.name}</td>
                                            <td className="px-4 py-2 text-sm text-foreground">{d.percentage}%</td>
                                            <td className="px-4 py-2 text-sm text-foreground">{d.payments}</td>
                                            <td className="px-4 py-2 text-sm text-foreground">{d.payout}</td>
                                            <td className="px-4 py-2 text-sm text-foreground">{d.bonus}</td>
                                            <td className="px-4 py-2 text-sm font-semibold text-foreground">{d.total}</td>
                                            <td className="px-4 py-2 text-sm text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <Link href={route('doctors.show', d.id)} title="عرض" className="text-primary hover:text-primary/80">
                                                        <EyeIcon className="h-5 w-5" />
                                                    </Link>
                                                    <Link href={route('doctors.edit', d.id)} title="تعديل" className="text-green-600 hover:text-green-700">
                                                        <PencilIcon className="h-5 w-5" />
                                                    </Link>
                                                    <button
                                                        title="حذف المكافآت لهذا الشهر"
                                                        onClick={() => {
                                                            if (confirm('حذف كل المكافآت لهذا الطبيب خلال هذا الشهر؟')) {
                                                                router.delete(route('salaries.bonus.delete'), { data: { doctor_id: d.id, month }, preserveScroll: true });
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}


