<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Service;
use App\Models\MedicalRecordTemplate;
use App\Models\ActivityLog;
use App\Models\Payment;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Appointment::class, 'appointment');
    }

    /**
      * Display a listing of the resource.
      */
    public function index()
    {
        return Inertia::render('Appointments/Index', [
            'appointments' => Appointment::with(['patient', 'doctor.user', 'service', 'clinic'])->get(),
            'patients' => Patient::all(),
            'doctors' => Doctor::with(['user', 'clinic'])->get(),
            'services' => Service::all(),
            'clinics' => \App\Models\Clinic::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Check if we have patients first
        $patients = Patient::select('id', 'name', 'phone', 'date_of_birth', 'gender', 'address')->get();
        
        if ($patients->isEmpty()) {
            return Inertia::render('Appointments/AddAppointment', [
                'patients' => [],
                'doctors' => Doctor::with(['user', 'clinic'])->get(),
                'services' => Service::all(),
                'clinics' => \App\Models\Clinic::all(),
                'defaultDate' => now()->format('Y-m-d'),
                'defaultTime' => now()->format('H:i'),
                'infoMessage' => 'لا توجد مرضى في النظام. يرجى إضافة مرضى أولاً.',
            ]);
        }

        return Inertia::render('Appointments/TestApi', [
            'patients' => $patients->map(function($patient) {
                return [
                    'id' => $patient->id,
                    'full_name' => $patient->name,
                ];
            }),
            'doctors' => Doctor::with(['user', 'clinic'])->get(),
            'services' => Service::all(),
            'clinics' => \App\Models\Clinic::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAppointmentRequest $request): \Illuminate\Http\RedirectResponse
    {
        Log::info('Starting appointment store process...');
        Log::info('Request data:', $request->all());

        try {
            // Simple validation - only check required fields
            $validatedData = [
                'patient_id' => $request->patient_id,
                'doctor_id' => $request->doctor_id,
                'service_id' => $request->service_id,
                'appointment_date' => $request->appointment_date,
                'appointment_time' => $request->appointment_time,
                'status' => $request->status ?? 'scheduled',
            ];

            // Add optional fields if they exist
            if ($request->has('clinic_id')) {
                $validatedData['clinic_id'] = $request->clinic_id;
            }
            if ($request->has('notes')) {
                $validatedData['notes'] = $request->notes;
            }
            if ($request->has('discount')) {
                $validatedData['discount'] = $request->discount;
            }
            if ($request->has('final_amount')) {
                $validatedData['amount_paid'] = $request->final_amount;
            } elseif ($request->has('appointment_cost')) {
                $validatedData['amount_paid'] = $request->appointment_cost;
            }

            // Add receptionist ID
            $validatedData['receptionist_id'] = Auth::id();

            Log::info('Validated data to save:', $validatedData);

            // Create appointment
            $appointment = Appointment::create($validatedData);
            Log::info('Appointment created successfully with ID:', ['id' => $appointment->id]);

            // Create basic payment record
            $appointment->payment()->create([
                'amount' => $validatedData['amount_paid'] ?? 0,
                'payment_date' => now(),
                'payment_method' => 'cash',
                'status' => 'completed',
            ]);

            Log::info('Payment record created successfully');

            return redirect()->route('appointments.index')->with('success', 'تم حفظ الموعد بنجاح');

        } catch (\Exception $e) {
            Log::error('Error creating appointment:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->back()->withInput()->withErrors(['error' => 'خطأ في حفظ الموعد: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Appointment $appointment)
    {
        $appointment->load(['patient.medicalRecords.doctor.user', 'doctor.user', 'service', 'clinic']);

        return Inertia::render('Appointments/Show', [
            'appointment' => $appointment,
            'templates' => MedicalRecordTemplate::all(), // Or filter by doctor
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Appointment $appointment)
    {
        return Inertia::render('Appointments/Edit', [
            'appointment' => $appointment->load(['patient', 'doctor.user', 'service']),
            'patients' => Patient::all(),
            'doctors' => Doctor::with(['user', 'clinic'])->get(),
            'services' => Service::all(),
            'clinics' => \App\Models\Clinic::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAppointmentRequest $request, Appointment $appointment)
    {
        $appointment->update($request->validated());
        return redirect()->route('appointments.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Appointment $appointment)
    {
        $appointment->delete();
        return redirect()->route('appointments.index');
    }
}