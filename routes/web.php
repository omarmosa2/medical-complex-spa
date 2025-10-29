<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClinicController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\PatientController as PatientCtrl;
use App\Http\Controllers\MedicalRecordTemplateController;
use App\Http\Controllers\Doctor\MedicalRecordTemplateController as DoctorMedicalRecordTemplateController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DoctorAvailabilityController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\SalaryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::patch('/theme', [UserController::class, 'updateTheme'])->name('theme.update');

    // Medical Record Templates for Doctors
    Route::resource('medical-record-templates', MedicalRecordTemplateController::class);
    Route::resource('patients', PatientController::class);
    Route::get('/patients/{patient}/export-pdf', [PatientController::class, 'exportPdf'])->name('patients.exportPdf');
    // API endpoint to get patient data for appointment booking
    Route::get('/patients/{id}/data', [PatientController::class, 'getPatientData'])->name('patients.data');
    Route::resource('services', ServiceController::class);
    Route::resource('users', UserController::class);
    Route::resource('appointments', AppointmentController::class);
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');
    Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf'])->name('reports.exportPdf');
    Route::resource('reports', ReportController::class);
    // Patient Documents
    Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::patch('/settings', [SettingsController::class, 'store'])->name('settings.store');
    Route::resource('clinics', ClinicController::class);
    Route::resource('payments', PaymentController::class);
    Route::get('/salaries', [SalaryController::class, 'index'])->name('salaries.index');
    Route::post('/salaries/bonus', [SalaryController::class, 'store'])->name('salaries.bonus');
    Route::delete('/salaries/bonus', [SalaryController::class, 'destroyMonthBonuses'])->name('salaries.bonus.delete');
    Route::resource('availabilities', DoctorAvailabilityController::class)->except(['show']);
    Route::resource('doctors', DoctorController::class);
    Route::get('/doctor/agenda', [DoctorController::class, 'agenda'])->name('doctor.agenda');
    Route::get('/doctor/tool', [DoctorController::class, 'tool'])->name('doctor.tool');
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('/notifications/{id}', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::patch('/notifications', [NotificationController::class, 'markAllAsRead'])->name('notifications.read.all');
});

require __DIR__.'/auth.php';