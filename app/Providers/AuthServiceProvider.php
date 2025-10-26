<?php

namespace App\Providers;

use App\Models\Patient;
use App\Policies\PatientPolicy;
use App\Models\User;
use App\Policies\UserPolicy;
use App\Models\Service;
use App\Policies\ServicePolicy;
use App\Models\Appointment;
use App\Policies\AppointmentPolicy;
use App\Models\Setting;
use App\Policies\SettingPolicy;
use App\Models\MedicalRecordTemplate;
use App\Policies\MedicalRecordTemplatePolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Patient::class => PatientPolicy::class,
        User::class => UserPolicy::class,
        Service::class => ServicePolicy::class,
        Appointment::class => AppointmentPolicy::class,
        Setting::class => SettingPolicy::class,
        MedicalRecordTemplate::class => MedicalRecordTemplatePolicy::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::define('view-admin-dashboard', fn(User $user) => $user->role === 'admin');
        Gate::define('manage-users', fn(User $user) => $user->role === 'admin');
        Gate::define('manage-services', fn(User $user) => $user->role === 'admin');

        Gate::define('manage-patients', fn(User $user) => in_array($user->role, ['admin', 'receptionist']));
        Gate::define('manage-appointments', fn(User $user) => in_array($user->role, ['admin', 'receptionist']));

        Gate::define('view-doctor-dashboard', fn(User $user) => $user->role === 'doctor');
        Gate::define('add-medical-record', fn(User $user) => $user->role === 'doctor');
    }
}