import { PageProps, PaginatedResponse, User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { PlusIcon, UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, users, search }: PageProps<{ users: PaginatedResponse<User>; search?: string }>) {
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
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">المستخدمين</h2>
                </div>
            }
        >
            <Head title="المستخدمين" />

            <div className="py-12" dir="rtl">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">قائمة المستخدمين</h3>
                            <Link href={route('users.create')}>
                                <Button>إضافة مستخدم</Button>
                            </Link>
                        </div>
                        <form onSubmit={submit} className="mb-4">
                            <div className="flex items-center">
                                <InputLabel htmlFor="search" value="البحث" className="sr-only" />
                                <TextInput
                                    id="search"
                                    name="search"
                                    value={data.search}
                                    className="ml-2"
                                    placeholder="ابحث عن المستخدمين..."
                                    onChange={(e) => setData('search', e.target.value)}
                                />
                                <Button type="submit" disabled={processing}>بحث</Button>
                            </div>
                        </form>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدور</th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">تعديل</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">{getRoleTranslation(user.role)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                <Link href={route('users.edit', user.id)} className="text-indigo-600 hover:text-indigo-900 font-semibold">
                                                    تعديل
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-12">
                                            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">لا يوجد مستخدمين</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ابدأ بإضافة مستخدم جديد.</p>
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
            </div>
        </AuthenticatedLayout>
    );
}