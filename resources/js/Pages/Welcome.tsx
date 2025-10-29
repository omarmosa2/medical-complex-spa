import { Link } from '@inertiajs/react';

interface Props {
    canLogin: boolean;
    canRegister: boolean;
    laravelVersion: string;
    phpVersion: string;
}

export default function Welcome({ canLogin, canRegister, laravelVersion, phpVersion }: Props) {
    return (
        <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center min-h-screen items-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            مرحباً بكم في نظام إدارة المجمع الطبي
                        </h1>
                        <p className="mt-3 text-xl text-gray-600 dark:text-gray-400">
                            حل شامل لإدارة المجمعات الطبية
                        </p>
                        <div className="mt-8 space-x-reverse space-x-4">
                            {canLogin && (
                                <Link
                                    href="/login"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    تسجيل الدخول
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
