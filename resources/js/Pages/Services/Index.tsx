import { PageProps, PaginatedResponse } from '@/types';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { PlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { useCurrency } from '@/hooks/useCurrency';

export default function Index({ auth, services }: PageProps<{ services: PaginatedResponse<any> }>) {
    const { format } = useCurrency();

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center" dir="rtl">
                    <h2 className="font-semibold text-xl text-foreground leading-tight">الخدمات</h2>
                    <Link href={route('services.create')}>
                        <Button>
                            <PlusIcon className="h-5 w-5 ml-2" />
                            إضافة خدمة
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="الخدمات" />

            <div className="p-6" dir="rtl">
                <Card className="border border-border shadow-lg rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">الاسم</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">الوصف</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">السعر</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {services.data.length > 0 ? (
                                services.data.map((service: any) => (
                                    <tr key={service.id} className="hover:bg-muted transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground text-center">{service.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{service.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{format(service.price)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <Link href={route('services.edit', service.id)} className="text-primary hover:text-primary/80 font-semibold">
                                                تعديل
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-12">
                                        <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-2 text-sm font-medium text-foreground">لا توجد خدمات</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">ابدأ بإضافة خدمة جديدة.</p>
                                        <div className="mt-6">
                                            <Link href={route('services.create')}>
                                                <Button>
                                                    <PlusIcon className="h-5 w-5 ml-2" />
                                                    إضافة خدمة
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