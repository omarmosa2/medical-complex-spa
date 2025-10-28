<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Models\Patient;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('residence', 'like', "%{$search}%");
            });
        }

        // Handle filters
        if ($request->has('full_name') && !empty($request->full_name)) {
            $query->where('full_name', $request->full_name);
        }
        if ($request->has('phone') && !empty($request->phone)) {
            $query->where('phone', $request->phone);
        }
        if ($request->has('email') && !empty($request->email)) {
            $query->where('email', $request->email);
        }
        if ($request->has('residence') && !empty($request->residence)) {
            $query->where('residence', $request->residence);
        }

        $patients = $query->paginate(10)->through(fn ($patient) => [
            'id' => $patient->id,
            'full_name' => $patient->full_name,
            'gender' => $patient->gender,
            'age' => $patient->age,
            'residence' => $patient->residence,
            'phone' => $patient->phone,
            'email' => $patient->email,
        ]);

        // Calculate stats
        $stats = [
            'total_patients' => Patient::count(),
            'patients_with_appointments' => Patient::has('appointments')->count(),
            'recent_patients' => Patient::whereDate('created_at', '>=', now()->subDays(30))->count(),
        ];

        // Filter options
        $filterOptions = [
            'full_names' => Patient::distinct()->pluck('full_name')->filter()->values(),
            'genders' => Patient::distinct()->pluck('gender')->filter()->values(),
            'ages' => Patient::distinct()->pluck('age')->filter()->values(),
            'residences' => Patient::distinct()->pluck('residence')->filter()->values(),
            'phones' => Patient::distinct()->pluck('phone')->filter()->values(),
            'emails' => Patient::distinct()->pluck('email')->filter()->values(),
        ];

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'stats' => $stats,
            'filters' => $request->only(['search', 'full_name', 'phone', 'email', 'residence']), // Pass current filters back
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
        try {
            $patient = Patient::create($request->validated());

            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'created_patient',
                'description' => "Created patient: {$patient->full_name}",
            ]);

            return redirect()->route('patients.index')->with('success', 'Patient created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to create patient: ' . $e->getMessage());
        }
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
     * Get patient data for appointment booking
     */
    public function getPatientData(Request $request, $id)
    {
        try {
            $patient = Patient::find($id);
            
            if (!$patient) {
                return response()->json(['error' => 'Patient not found'], 404);
            }

            return response()->json([
                'id' => $patient->id,
                'full_name' => $patient->full_name,
                'gender' => $patient->gender,
                'age' => $patient->age,
                'phone' => $patient->phone,
                'residence' => $patient->residence,
                'email' => $patient->email,
                'notes' => $patient->notes,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
        }
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