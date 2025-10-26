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
use Illuminate\Http\Request;
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
            'doctors' => Doctor::with('user')->get(),
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
    public function store(StoreAppointmentRequest $request)
    {
        $appointment = Appointment::create($request->validated() + ['receptionist_id' => auth()->id(), 'status' => 'scheduled', 'clinic_id' => $request->clinic_id]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'created_appointment',
            'description' => "Created appointment for patient {$appointment->patient->name} with doctor {$appointment->doctor->user->name}",
        ]);

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