import { PageProps, PaginatedResponse } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import PaymentCreateModal from "@/Components/PaymentCreateModal";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Card from "@/Components/Card";
import Button from "@/Components/Button";
import {
    PlusIcon,
    CreditCardIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

export default function Index({
    auth,
    payments,
    stats,
    patients,
    appointments,
}: PageProps<{
    payments: PaginatedResponse<any>;
    stats: {
        totalAmount: number;
        paidAmount: number;
        pendingAmount: number;
        countToday: number;
    };
    patients: any[];
    appointments: any[];
}>) {
    const [showCreate, setShowCreate] = useState(false);
    // ترجمة طرق الدفع وحالات الدفع
    const getPaymentMethodTranslation = (method: string) => {
        const methods: { [key: string]: string } = {
            cash: "نقدي",
            card: "بطاقة ائتمان",
            bank_transfer: "تحويل بنكي",
            check: "شيك",
        };
        return methods[method] || method;
    };

    const getStatusTranslation = (status: string) => {
        const statuses: { [key: string]: string } = {
            paid: "مدفوع",
            pending: "معلق",
            failed: "فشل",
            cancelled: "ملغي",
        };
        return statuses[status] || status;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center" dir="rtl">
                    <h2 className="font-semibold text-xl text-foreground leading-tight">
                        المدفوعات
                    </h2>
                    <Button onClick={() => setShowCreate(true)}>
                        <PlusIcon className="h-5 w-5 ml-2" />
                        إضافة دفعة
                    </Button>
                </div>
            }
        >
            <Head title="المدفوعات" />

            <div className="p-6 space-y-6" dir="rtl">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border border-border shadow-md rounded-xl overflow-hidden">
                        <div className="p-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                إجمالي المدفوعات
                            </p>
                            <p className="text-2xl font-bold text-foreground mt-1">
                                ${(stats?.totalAmount ?? 0).toFixed(2)}
                            </p>
                        </div>
                    </Card>
                    <Card className="border border-border shadow-md rounded-xl overflow-hidden">
                        <div className="p-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                مدفوع
                            </p>
                            <p className="text-2xl font-bold text-green-600 mt-1">
                                ${(stats?.paidAmount ?? 0).toFixed(2)}
                            </p>
                        </div>
                    </Card>
                    <Card className="border border-border shadow-md rounded-xl overflow-hidden">
                        <div className="p-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                معلّق
                            </p>
                            <p className="text-2xl font-bold text-yellow-600 mt-1">
                                ${(stats?.pendingAmount ?? 0).toFixed(2)}
                            </p>
                        </div>
                    </Card>
                    <Card className="border border-border shadow-md rounded-xl overflow-hidden">
                        <div className="p-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                مدفوعات اليوم
                            </p>
                            <p className="text-2xl font-bold text-foreground mt-1">
                                {stats?.countToday ?? 0}
                            </p>
                        </div>
                    </Card>
                </div>
                <Card className="border border-border shadow-lg rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                >
                                    المريض
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                >
                                    الخدمة
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                >
                                    المبلغ
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                >
                                    طريقة الدفع
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                >
                                    الحالة
                                </th>
                                <th
                                    scope="col"
                                    className="relative px-6 py-3 text-center"
                                >
                                    <span className="sr-only">الإجراءات</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {payments.data.length > 0 ? (
                                payments.data.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className="hover:bg-muted transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground text-center">
                                            {payment.appointment?.patient
                                                ?.full_name ||
                                                payment.patient?.full_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">
                                            {payment.appointment?.service?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">
                                            ${payment.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">
                                            {getPaymentMethodTranslation(
                                                payment.payment_method
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    payment.status === "paid"
                                                        ? "bg-green-100 text-green-800"
                                                        : payment.status ===
                                                          "pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {getStatusTranslation(
                                                    payment.status
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex items-center justify-center gap-3">
                                                <Link
                                                    href={route(
                                                        "payments.show",
                                                        payment.id
                                                    )}
                                                    title="عرض"
                                                    className="text-primary hover:text-primary/80"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "payments.edit",
                                                        payment.id
                                                    )}
                                                    title="تعديل"
                                                    className="text-green-600 hover:text-green-700"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    title="حذف"
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                "هل أنت متأكد من حذف هذه الدفعة؟"
                                                            )
                                                        ) {
                                                            router.delete(
                                                                route(
                                                                    "payments.destroy",
                                                                    payment.id
                                                                ),
                                                                {
                                                                    preserveScroll:
                                                                        true,
                                                                }
                                                            );
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center py-12"
                                    >
                                        <CreditCardIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-2 text-sm font-medium text-foreground">
                                            لا توجد مدفوعات
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            ابدأ بإضافة دفعة جديدة.
                                        </p>
                                        <div
                                            className="flex justify-center items-center"
                                            dir="rtl"
                                        >
                                            <Button
                                                onClick={() =>
                                                    setShowCreate(true)
                                                }
                                            >
                                                <PlusIcon className="h-5 w-5 ml-2" />
                                                إضافة دفعة
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Card>

                <PaymentCreateModal
                    show={showCreate}
                    onClose={() => setShowCreate(false)}
                    patients={patients || []}
                    appointments={appointments || []}
                />
            </div>
        </AuthenticatedLayout>
    );
}
