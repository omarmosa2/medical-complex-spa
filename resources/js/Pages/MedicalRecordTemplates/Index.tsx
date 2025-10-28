import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { PlusIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

// Define the type for a single template
interface Template {
    id: number;
    title: string;
    content: object;
}

export default function Index({ auth, templates }: PageProps<{ templates: Template[] }>) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center" dir="rtl">
                    <h2 className="font-semibold text-xl text-foreground leading-tight">
                        قوالب الملفات الطبية
                    </h2>
                    <Link href={route('medical-record-templates.create')}>
                        <Button>
                            <PlusIcon className="h-5 w-5 ml-2" />
                            إنشاء قالب جديد
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="قوالب الملفات الطبية" />

            <div className="p-6" dir="rtl">
                <Card className="border border-border shadow-lg rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    العنوان
                                </th>
                                <th scope="col" className="relative px-6 py-3 text-center">
                                    <span className="sr-only">الإجراءات</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {templates.map((template) => (
                                <tr key={template.id} className="hover:bg-muted transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground text-center">
                                        {template.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <Link href={route('medical-record-templates.show', template.id)} className="text-primary hover:text-primary/80 ml-2 font-semibold">
                                            عرض
                                        </Link>
                                        <Link href={route('medical-record-templates.edit', template.id)} className="text-green-600 hover:text-green-700 font-semibold">
                                            تعديل
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {templates.length === 0 && (
                        <div className="text-center py-12">
                            <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-sm font-medium text-foreground">لا توجد قوالب</h3>
                            <p className="mt-1 text-sm text-muted-foreground">ابدأ بإنشاء قالب جديد للملفات الطبية.</p>
                            <div className="mt-6">
                                <Link href={route('medical-record-templates.create')}>
                                    <Button>
                                        <PlusIcon className="h-5 w-5 ml-2" />
                                        إنشاء قالب جديد
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}