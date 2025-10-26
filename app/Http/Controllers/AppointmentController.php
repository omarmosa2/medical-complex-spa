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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        return Inertia::render('Appointments/Create', [
            'patients' => Patient::all(),
            'doctors' => Doctor::with('user')->get(),
            'services' => Service::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'patient_id' => 'required|exists:patients,id',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'status' => 'required|string|in:scheduled,completed,cancelled',
            'notes' => 'nullable|string',
            'amount_paid' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
        ]);

        DB::transaction(function () use ($request) {
            $appointment = Appointment::create($request->all() + ['receptionist_id' => auth()->id()]);

            // 1. Create Payment Record
            $appointment->payment()->create([
                'amount' => $request->amount_paid,
                'payment_date' => now(),
                'payment_method' => 'cash', // Assuming cash for now
                'status' => 'completed',
            ]);

            // 2. Calculate Shares
            $doctor = Doctor::with('user')->find($request->doctor_id);
            $doctor_percentage = $doctor->user->doctor_percentage ?? 0;
            $doctor_share = ($request->amount_paid * $doctor_percentage) / 100;
            $clinic_profit = $request->amount_paid - $doctor_share;

            // 3. Create Transaction for Doctor
            Transaction::create([
                'user_id' => $doctor->user->id,
                'appointment_id' => $appointment->id,
                'type' => 'credit',
                'amount' => $doctor_share,
                'description' => "Doctor's share for appointment #{$appointment->id}",
            ]);

            // 4. Create Transaction for Clinic Profit
            Transaction::create([
                'user_id' => auth()->id(), // Associated with the receptionist who booked
                'appointment_id' => $appointment->id,
                'type' => 'credit',
                'amount' => $clinic_profit,
                'description' => "Clinic profit for appointment #{$appointment->id}",
            ]);

            ActivityLog::create([
                'user_id' => auth()->id(),
                'action' => 'created_appointment',
                'description' => "Created appointment for patient {$appointment->patient->name} with doctor {$doctor->user->name}",
            ]);
        });

        return redirect()->route('appointments.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Appointment $appointment)
    {
        $appointment->load(['patient.medicalRecords.doctor.user', 'doctor.user', 'service']);

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
            'doctors' => Doctor::with('user')->get(),
            'services' => Service::all(),
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