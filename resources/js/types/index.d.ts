export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    role: 'admin' | 'doctor' | 'receptionist';
    theme: 'light' | 'dark';
};

export type Patient = {
    id: number;
    full_name: string;
    gender: 'male' | 'female';
    age: number;
    residence: string;
    phone: string | null;
    email: string | null;
    notes: string | null;
    medical_records?: MedicalRecord[];
};

export type Doctor = {
    id: number;
    user_id: number | null;
    name: string | null;
    clinic_id: number | null;
    specialization: string;
    payment_percentage: number;
    bio: string | null;
    user?: User;
    clinic?: Clinic;
};

export type Service = {
    id: number;
    name: string;
    description: string | null;
    price: number;
    duration_minutes: number;
};

export type Clinic = {
    id: number;
    name: string;
    description: string | null;
};

export type Appointment = {
    id: number;
    patient_id: number;
    doctor_id: number;
    service_id: number;
    clinic_id: number | null;
    receptionist_id: number | null;
    appointment_time: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
    notes: string | null;
    amount_paid: number;
    discount: number | null;
    patient: Patient;
    doctor: Doctor;
    service: Service;
    clinic?: Clinic;
};

export type Notification = {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    read_at: string | null;
    created_at: string;
};

export type PaginatedResponse<T> = {
    data: T[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
};

export type PageProps<T> = T & {
    auth: {
        user: User;
    };
};

declare global {
    function route(name: string, parameters?: any): string;
}