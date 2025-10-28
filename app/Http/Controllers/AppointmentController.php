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
    public function index(\Illuminate\Http\Request $request)
    {
        $query = Appointment::with(['patient', 'doctor.user', 'service', 'clinic']);

        // Handle search
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('patient', function($patientQuery) use ($search) {
                    // Search in both full_name and name fields for compatibility
                    $patientQuery->where(function($pq) use ($search) {
                        $pq->where('full_name', 'like', "%{$search}%")
                           ->orWhere('name', 'like', "%{$search}%");
                    });
                })->orWhereHas('doctor.user', function($doctorQuery) use ($search) {
                    $doctorQuery->where('name', 'like', "%{$search}%");
                })->orWhereHas('service', function($serviceQuery) use ($search) {
                    $serviceQuery->where('name', 'like', "%{$search}%");
                })->orWhere('appointment_date', 'like', "%{$search}%")
                  ->orWhere('appointment_time', 'like', "%{$search}%");
            });
        }

        // Handle filters
        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }
        if ($request->has('clinic_id') && !empty($request->clinic_id)) {
            $query->where('clinic_id', $request->clinic_id);
        }
        if ($request->has('doctor_id') && !empty($request->doctor_id)) {
            $query->where('doctor_id', $request->doctor_id);
        }
        if ($request->has('service_id') && !empty($request->service_id)) {
            $query->where('service_id', $request->service_id);
        }
        if ($request->has('date_from') && !empty($request->date_from)) {
            $query->whereDate('appointment_date', '>=', $request->date_from);
        }
        if ($request->has('date_to') && !empty($request->date_to)) {
            $query->whereDate('appointment_date', '<=', $request->date_to);
        }

        // Sort by date and time
        $query->orderBy('appointment_date', 'desc')
              ->orderBy('appointment_time', 'desc');

        // Paginate results
        $appointments = $query->paginate(15);

        // Get filter options
        $filterOptions = [
            'statuses' => ['scheduled', 'completed', 'cancelled', 'no_show'],
            'clinics' => \App\Models\Clinic::select('id', 'name')->get(),
            'doctors' => Doctor::with('user')->select('id', 'user_id')->get(),
            'services' => Service::select('id', 'name')->get(),
        ];

        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments,
            'patients' => Patient::select('id', 'full_name', 'phone')->get(),
            'doctors' => Doctor::with(['user', 'clinic'])->get(),
            'services' => Service::all(),
            'clinics' => \App\Models\Clinic::all(),
            'filters' => $request->only(['search', 'status', 'clinic_id', 'doctor_id', 'service_id', 'date_from', 'date_to']),
            'filterOptions' => $filterOptions,
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
            'patients' => $patients,
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
        // Load all necessary relationships for the edit form
        $appointment->load(['patient', 'doctor.user', 'service', 'clinic']);
        
        return Inertia::render('Appointments/Edit', [
            'appointment' => $appointment,
            'patients' => Patient::select('id', 'full_name', 'name', 'phone')->get(),
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
        try {
            $appointment->update($request->validated());
            return redirect()->route('appointments.index')->with('success', 'تم تحديث الموعد بنجاح');
        } catch (\Exception $e) {
            Log::error('Error updating appointment:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->back()->withInput()->withErrors(['error' => 'خطأ في تحديث الموعد: ' . $e->getMessage()]);
        }
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