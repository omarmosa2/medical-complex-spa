import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import TextInput from '@/Components/TextInput';
import { PlusIcon, BuildingOffice2Icon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, clinics, stats }: PageProps<{ clinics: any[], stats: any }>) {
    const [search, setSearch] = useState('');
    const [filteredClinics, setFilteredClinics] = useState(clinics);

    const handleSearch = (query: string) => {
        setSearch(query);
        setFilteredClinics(clinics.filter(clinic => clinic.name.toLowerCase().includes(query.toLowerCase())));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center" dir="rtl">
                    <h2 className="font-semibold text-xl text-foreground leading-tight">العيادات</h2>
                    <Link href={route('clinics.create')}>
                        <Button>
                            <PlusIcon className="h-5 w-5 ml-2" />
                            إضافة عيادة
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="العيادات" />

            <div className="p-6" dir="rtl">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card className="bg-gradient-to-br from-primary-50 via-primary-100/20 to-transparent dark:from-primary-900/20 dark:to-transparent border border-primary-200 dark:border-primary-700 shadow-xl hover:shadow-primary-500/20 transition-all duration-300 p-6 rounded-xl">
                        <div className="flex items-center">
                            <div className="p-3 bg-primary rounded-lg">
                                <BuildingOffice2Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">إجمالي العيادات</p>
                                <p className="text-2xl font-semibold text-primary">{stats.total_clinics}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 via-green-100/20 to-transparent dark:from-green-900/20 dark:to-transparent border border-green-200 dark:border-green-700 shadow-xl hover:shadow-green-500/20 transition-all duration-300 p-6 rounded-xl">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-500 rounded-lg">
                                <BuildingOffice2Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">العيادات النشطة</p>
                                <p className="text-2xl font-semibold text-green-600">{stats.active_clinics}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Search and Filter */}
                <div className="mb-6">
                    <TextInput
                        placeholder="البحث في العيادات..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="max-w-md"
                    />
                </div>

                <Card className="border border-border shadow-lg rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    الاسم
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    الموقع
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    أيام العمل
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    الملاحظات
                                </th>
                                <th scope="col" className="relative px-6 py-3 text-center">
                                    <span className="sr-only">الإجراءات</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {filteredClinics.length > 0 ? (
                                filteredClinics.map((clinic: any) => (
                                    <tr key={clinic.id} className="hover:bg-muted transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground text-center">{clinic.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{clinic.location}</td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground text-center">
                                            {clinic.schedules && clinic.schedules.length > 0 ? (
                                                clinic.schedules.map((schedule: any) => (
                                                    <div key={schedule.day_of_week} className="mb-1">
                                                        {['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'][schedule.day_of_week - 1]}:
                                                        {schedule.is_active ? `${schedule.start_time} - ${schedule.end_time}` : 'عطلة'}
                                                    </div>
                                                ))
                                            ) : (
                                                'غير محدد'
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground text-center">{clinic.notes}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center space-x-2">
                                                <Link href={route('clinics.show', clinic.id)} className="text-primary hover:text-primary/80 p-1 rounded" title="عرض">
                                                    <EyeIcon className="h-5 w-5" />
                                                </Link>
                                                <Link href={route('clinics.edit', clinic.id)} className="text-green-600 hover:text-green-700 p-1 rounded" title="تعديل">
                                                    <PencilIcon className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('هل أنت متأكد من حذف هذه العيادة؟')) {
                                                            router.delete(route('clinics.destroy', clinic.id));
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-700 p-1 rounded" title="حذف">
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-12">
                                        <BuildingOffice2Icon className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-2 text-sm font-medium text-foreground">لم يتم العثور على عيادات</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">ابدأ بإنشاء عيادة جديدة.</p>
                                        <div className="mt-6">
                                            <Link href={route('clinics.create')}>
                                                <Button>
                                                    <PlusIcon className="h-5 w-5 ml-2" />
                                                    إضافة عيادة
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
        </AuthenticatedLayout>
    );
}