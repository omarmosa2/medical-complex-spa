export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    role: 'admin' | 'doctor' | 'receptionist';
};

export type Patient = {
    id: number;
    file_number: string;
    name: string;
    phone: string;
    date_of_birth: string;
    gender: 'male' | 'female';
    address: string | null;
};

export type Doctor = {
    id: number;
    user_id: number;
    specialization: string;
    bio: string | null;
    user: User;
};

export type Service = {
    id: number;
    name: string;
    description: string | null;
    price: number;
    duration_minutes: number;
};

export type Appointment = {
    id: number;
    patient_id: number;
    doctor_id: number;
    service_id: number;
    receptionist_id: number | null;
    appointment_time: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
    notes: string | null;
    patient: Patient;
    doctor: Doctor;
    service: Service;
};

export type PaginatedResponse<T> = {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
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