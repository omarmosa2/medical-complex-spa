import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import Card from '@/Components/Card';
import Button from '@/Components/Button';

export default function Show({ auth, service }: PageProps<{ service: any }>) {
    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-foreground leading-tight">تفاصيل الخدمة</h2>}>
            <Head title="تفاصيل الخدمة" />
            <div className="p-6" dir="rtl">
                <Card className="border border-border shadow-md rounded-xl overflow-hidden">
                    <div className="p-6 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">الاسم</p>
                                <p className="text-foreground font-semibold">{service.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">العيادة</p>
                                <p className="text-foreground font-semibold">{service.clinic?.name || '—'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">السعر</p>
                                <p className="text-foreground font-semibold">{service.price}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">المدة (دقيقة)</p>
                                <p className="text-foreground font-semibold">{service.duration_minutes}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-muted-foreground">الوصف</p>
                                <p className="text-foreground">{service.description || '—'}</p>
                            </div>
                        </div>
                        <div className="pt-4">
                            <Link href={route('services.edit', service.id)}>
                                <Button>تعديل</Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}


