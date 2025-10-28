import { PageProps, PaginatedResponse, Doctor } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import TextInput from '@/Components/TextInput';
import { PlusIcon, UserGroupIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, doctors, search, stats }: PageProps<{ doctors: PaginatedResponse<Doctor>; search?: string; stats: any }>) {
    const [searchQuery, setSearchQuery] = useState(search || '');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        router.get(route('doctors.index'), { search: query }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center" dir="rtl">
                    <h2 className="font-semibold text-xl text-foreground leading-tight">الأطباء</h2>
                    <Link href={route('doctors.create')}>
                        <Button>
                            <PlusIcon className="h-5 w-5 ml-2" />
                            إضافة طبيب
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="الأطباء" />

            <div className="p-6" dir="rtl">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card className="bg-gradient-to-br from-primary-50 via-primary-100/20 to-transparent dark:from-primary-900/20 dark:to-transparent border border-primary-200 dark:border-primary-700 shadow-xl hover:shadow-primary-500/20 transition-all duration-300 p-6 rounded-xl">
                        <div className="flex items-center">
                            <div className="p-3 bg-primary rounded-lg">
                                <UserGroupIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">إجمالي الأطباء</p>
                                <p className="text-2xl font-semibold text-primary">{stats.total_doctors}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 via-green-100/20 to-transparent dark:from-green-900/20 dark:to-transparent border border-green-200 dark:border-green-700 shadow-xl hover:shadow-green-500/20 transition-all duration-300 p-6 rounded-xl">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-500 rounded-lg">
                                <UserGroupIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">الأطباء النشطون</p>
                                <p className="text-2xl font-semibold text-green-600">{stats.active_doctors}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Search and Filter */}
                <div className="mb-6">
                    <TextInput
                        placeholder="البحث في الأطباء..."
                        value={searchQuery}
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
                                    البريد الإلكتروني
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    التخصص
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    العيادة
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    نسبة الدفع %
                                </th>
                                <th scope="col" className="relative px-6 py-3 text-center">
                                    <span className="sr-only">الإجراءات</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {doctors.data.length > 0 ? (
                                doctors.data.map((doctor: Doctor) => (
                                    <tr key={doctor.id} className="hover:bg-muted transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground text-center">{doctor.user?.name || doctor.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{doctor.user?.email || 'غير محدد'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{doctor.specialization}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{doctor.clinic?.name || 'غير محدد'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{doctor.payment_percentage}%</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center space-x-2">
                                                <Link href={route('doctors.show', doctor.id)} className="text-primary hover:text-primary/80 p-1 rounded" title="عرض">
                                                    <EyeIcon className="h-5 w-5" />
                                                </Link>
                                                <Link href={route('doctors.edit', doctor.id)} className="text-green-600 hover:text-green-700 p-1 rounded" title="تعديل">
                                                    <PencilIcon className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('هل أنت متأكد من حذف هذا الطبيب؟')) {
                                                            router.delete(route('doctors.destroy', doctor.id));
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
                                    <td colSpan={6} className="text-center py-12">
                                        <UserGroupIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-2 text-sm font-medium text-foreground">لم يتم العثور على أطباء</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">ابدأ بإنشاء طبيب جديد.</p>
                                        <div className="mt-6">
                                            <Link href={route('doctors.create')}>
                                                <Button>
                                                    <PlusIcon className="h-5 w-5 ml-2" />
                                                    إضافة طبيب
                                                </Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {doctors.meta && doctors.meta.last_page > 1 && (
                        <div className="mt-4 flex justify-center space-x-2">
                            {doctors.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                                        link.active
                                            ? 'bg-primary text-white'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    preserveState
                                />
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}