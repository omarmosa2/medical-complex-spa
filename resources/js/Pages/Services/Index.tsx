import { PageProps, PaginatedResponse } from '@/types';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { PlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { useCurrency } from '@/hooks/useCurrency';

export default function Index({ auth, services, clinics }: PageProps<{ services: PaginatedResponse<any>, clinics: any[] }>) {
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

            <div className="p-6 space-y-6" dir="rtl">
                {/* جدول الخدمات */}
                <Card className="border border-border shadow-lg rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">الاسم</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">العيادة</th>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{service.clinic?.name || '—'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{service.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{format(service.price)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex items-center justify-center gap-3">
                                                <Link href={route('services.show', service.id)} className="text-primary hover:text-primary/80 font-semibold">عرض</Link>
                                                <Link href={route('services.edit', service.id)} className="text-green-600 hover:text-green-700 font-semibold">تعديل</Link>
                                                <Link href={route('services.destroy', service.id)} method="delete" as="button" className="text-red-600 hover:text-red-700 font-semibold" preserveScroll>حذف</Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-12">
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

                {/* ترقيم الصفحات */}
                {services.links && services.links.length > 0 && (
                    <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3 sm:px-6 rounded-md">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    عرض{' '}
                                    <span className="font-medium text-foreground">{((services.current_page - 1) * services.per_page) + 1}</span>{' '}
                                    إلى{' '}
                                    <span className="font-medium text-foreground">{Math.min(services.current_page * services.per_page, services.total)}</span>{' '}
                                    من أصل{' '}
                                    <span className="font-medium text-foreground">{services.total}</span>{' '}نتيجة
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    {services.links.map((link: any, index: number) => (
                                        link.url ? (
                                            <Link key={index} href={link.url} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${index === 0 ? 'rounded-l-md' : index === services.links.length - 1 ? 'rounded-r-md' : ''} ${link.active ? 'z-10 bg-primary/10 border-primary text-primary' : 'bg-card border-border text-muted-foreground hover:bg-muted'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                        ) : (
                                            <span key={index} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-muted-foreground bg-card border border-border" dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}