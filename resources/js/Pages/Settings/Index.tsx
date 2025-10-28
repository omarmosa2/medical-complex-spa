import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Button from '@/Components/Button';
import { FormEventHandler } from 'react';

export default function Index({ auth, settings }: PageProps<{ settings: any }>) {
    const { data, setData, patch, processing, errors } = useForm({
        app_name: settings.app_name || '',
        default_currency: settings.default_currency || 'USD',
        available_currencies: settings.available_currencies || 'USD,SYP,TRY',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('settings.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center" dir="rtl">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">الإعدادات</h2>
                </div>
            }
        >
            <Head title="الإعدادات" />

            <div className="py-12" dir="rtl">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="app_name" value="اسم التطبيق" />
                                    <TextInput id="app_name" name="app_name" value={data.app_name} className="mt-1 block w-full" onChange={(e) => setData('app_name', e.target.value)} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="default_currency" value="العملة الافتراضية" />
                                    <select id="default_currency" name="default_currency" value={data.default_currency} className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm" onChange={(e) => setData('default_currency', e.target.value)}>
                                        {data.available_currencies.split(',').map(currency => (
                                            <option key={currency} value={currency}>{currency}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="available_currencies" value="العملات المتاحة (مفصولة بفواصل)" />
                                    <TextInput id="available_currencies" name="available_currencies" value={data.available_currencies} className="mt-1 block w-full" onChange={(e) => setData('available_currencies', e.target.value)} />
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-6">
                                <Button className="ms-4" disabled={processing}>
                                    حفظ الإعدادات
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}