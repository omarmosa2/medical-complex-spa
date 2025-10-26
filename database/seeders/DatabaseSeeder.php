<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ClinicSeeder::class,
            ServiceSeeder::class,
            PatientSeeder::class,
            AppointmentSeeder::class,
            InvoiceSeeder::class,
            PaymentSeeder::class,
            MedicalRecordSeeder::class,
            DocumentSeeder::class,
            ActivityLogSeeder::class,
            NotificationSeeder::class,
            SettingSeeder::class,
            DoctorAvailabilitySeeder::class,
            MedicalRecordTemplateSeeder::class,
        ]);
    }
}