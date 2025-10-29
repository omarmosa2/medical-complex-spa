import { PageProps, PaginatedResponse, User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { PlusIcon, UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, users, search, stats }: PageProps<{ users: PaginatedResponse<User>; search?: string; stats: { total_users: number; admins: number; doctors: number; receptionists: number } }>) {
    const { data, setData, get, processing } = useForm({
        search: search || '',
    });

    const submit = (e: any) => {
        e.preventDefault();
        get(route('users.index'));
    };
    
    // ترجمة أدوار المستخدمين
    const getRoleTranslation = (role: string) => {
        const roles: { [key: string]: string } = {
            'admin': 'مدير',
            'doctor': 'طبيب',
            'receptionist': 'موظف استقبال'
        };
        return roles[role] || role;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center" dir="rtl">
                    <h2 className="font-semibold text-xl text-foreground leading-tight">المستخدمين</h2>
                    <Link href={route('users.create')}>
                        <Button>
                            <PlusIcon className="h-5 w-5 ml-2" />
                            إضافة مستخدم
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="المستخدمين" />

            <div className="p-6 space-y-6" dir="rtl">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border border-border shadow-md rounded-xl overflow-hidden"><div className="p-4 text-center"><p className="text-sm text-muted-foreground">إجمالي المستخدمين</p><p className="text-2xl font-bold text-foreground mt-1">{stats?.total_users ?? 0}</p></div></Card>
                    <Card className="border border-border shadow-md rounded-xl overflow-hidden"><div className="p-4 text-center"><p className="text-sm text-muted-foreground">المدراء</p><p className="text-2xl font-bold text-foreground mt-1">{stats?.admins ?? 0}</p></div></Card>
                    <Card className="border border-border shadow-md rounded-xl overflow-hidden"><div className="p-4 text-center"><p className="text-sm text-muted-foreground">الأطباء</p><p className="text-2xl font-bold text-foreground mt-1">{stats?.doctors ?? 0}</p></div></Card>
                    <Card className="border border-border shadow-md rounded-xl overflow-hidden"><div className="p-4 text-center"><p className="text-sm text-muted-foreground">موظفو الاستقبال</p><p className="text-2xl font-bold text-foreground mt-1">{stats?.receptionists ?? 0}</p></div></Card>
                </div>
                <Card className="border border-border shadow-lg rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <form onSubmit={submit} className="flex items-center space-x-4">
                            <div className="flex-1">
                                <InputLabel htmlFor="search" value="البحث" className="sr-only" />
                                <TextInput
                                    id="search"
                                    name="search"
                                    value={data.search}
                                    placeholder="ابحث عن المستخدمين..."
                                    onChange={(e) => setData('search', e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={processing}>بحث</Button>
                        </form>
                    </div>
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">الاسم</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">البريد الإلكتروني</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">الدور</th>
                                <th scope="col" className="relative px-6 py-3 text-center">
                                    <span className="sr-only">تعديل</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {users.data.length > 0 ? (
                                users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground text-center">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">{getRoleTranslation(user.role)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <Link href={route('users.edit', user.id)} className="text-primary hover:text-primary/80 font-semibold">
                                                تعديل
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-12">
                                        <UserGroupIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-2 text-sm font-medium text-foreground">لا يوجد مستخدمين</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">ابدأ بإضافة مستخدم جديد.</p>
                                        <div className="mt-6">
                                            <Link href={route('users.create')}>
                                                <Button>
                                                    <PlusIcon className="h-5 w-5 ml-2" />
                                                    إضافة مستخدم
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