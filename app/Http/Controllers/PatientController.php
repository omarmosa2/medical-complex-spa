<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Models\Patient;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Patient::class, 'patient');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Patient::query();

        // Handle search
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('file_number', 'like', "%{$search}%");
            });
        }

        // Handle filters
        if ($request->has('name') && !empty($request->name)) {
            $query->where('name', $request->name);
        }
        if ($request->has('phone') && !empty($request->phone)) {
            $query->where('phone', $request->phone);
        }
        if ($request->has('file_number') && !empty($request->file_number)) {
            $query->where('file_number', $request->file_number);
        }

        $patients = $query->paginate(10)->through(fn ($patient) => [
            'id' => $patient->id,
            'name' => $patient->name,
            'phone' => $patient->phone,
            'file_number' => $patient->file_number,
        ]);

        // Calculate stats
        $stats = [
            'total_patients' => Patient::count(),
            'patients_with_appointments' => Patient::has('appointments')->count(),
            'recent_patients' => Patient::whereDate('created_at', '>=', now()->subDays(30))->count(),
        ];

        // Filter options
        $filterOptions = [
            'names' => Patient::distinct()->pluck('name')->filter()->values(),
            'phones' => Patient::distinct()->pluck('phone')->filter()->values(),
            'file_numbers' => Patient::distinct()->pluck('file_number')->filter()->values(),
        ];

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'stats' => $stats,
            'filters' => $request->only(['search', 'name', 'phone', 'file_number']), // Pass current filters back
            'filterOptions' => $filterOptions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Patients/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePatientRequest $request)
    {
        $data = $request->validated();
        $data['file_number'] = 'PAT-' . str_pad(Patient::count() + 1, 6, '0', STR_PAD_LEFT);
        $patient = Patient::create($data);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'created_patient',
            'description' => "Created patient: {$patient->name}",
        ]);

        return redirect()->route('patients.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Patient $patient)
    {
        $patient->load('appointments.service', 'appointments.doctor.user', 'medicalRecords.doctor.user', 'documents.uploadedByUser');

        return Inertia::render('Patients/Show', [
            'patient' => $patient,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        return Inertia::render('Patients/Edit', [
            'patient' => $patient
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePatientRequest $request, Patient $patient)
    {
        $patient->update($request->validated());

        return redirect()->route('patients.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient)
    {
        $patient->delete();

        return redirect()->route('patients.index');
    }
}