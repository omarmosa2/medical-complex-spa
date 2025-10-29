import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, User } from '@/types';
import Card from '@/Components/Card';
import Button from '@/Components/Button';

export default function Show({ auth, user }: PageProps<{ user: any }>) {
    const roleMap: Record<string, string> = { admin: 'مدير', doctor: 'طبيب', receptionist: 'موظف استقبال' };
    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-foreground leading-tight">تفاصيل المستخدم</h2>}>
            <Head title="تفاصيل المستخدم" />
            <div className="p-6" dir="rtl">
                <Card className="border border-border shadow-md rounded-xl overflow-hidden">
                    <div className="p-6 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">الاسم</p>
                                <p className="text-foreground font-semibold">{user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                                <p className="text-foreground font-semibold">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">الدور</p>
                                <p className="text-foreground font-semibold">{roleMap[user.role] || user.role}</p>
                            </div>
                        </div>
                        <div className="pt-4">
                            <Link href={route('users.edit', user.id)}>
                                <Button>تعديل</Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}


