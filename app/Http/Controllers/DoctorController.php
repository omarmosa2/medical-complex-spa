<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\User;
use App\Models\Clinic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Models\Appointment;
use Inertia\Inertia;

class DoctorController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Doctor::class, 'doctor');
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Doctor::query();

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('specialization', 'like', '%' . $search . '%')
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', '%' . $search . '%')
                         ->orWhere('email', 'like', '%' . $search . '%');
                  });
            });
        }

        $stats = [
            'total_doctors' => Doctor::count(),
            'active_doctors' => Doctor::count(), // Assuming all are active
        ];

        return Inertia::render('Doctor/Index', [
            'doctors' => $query->with(['user', 'clinic'])->paginate(10),
            'search' => $request->search,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Doctor/Create', [
            'clinics' => Clinic::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'clinic_id' => 'nullable|exists:clinics,id',
            'specialization' => 'required|string|max:255',
            'payment_percentage' => 'required|numeric|min:0|max:100',
            'bio' => 'nullable|string',
        ]);

        Doctor::create([
            'name' => $request->name,
            'clinic_id' => $request->clinic_id,
            'specialization' => $request->specialization,
            'payment_percentage' => $request->payment_percentage,
            'bio' => $request->bio,
        ]);

        return redirect()->route('doctors.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Doctor $doctor)
    {
        $doctor->load(['user', 'clinic']);
        return Inertia::render('Doctor/Show', [
            'doctor' => $doctor,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Doctor $doctor)
    {
        $doctor->load(['user', 'clinic']);
        return Inertia::render('Doctor/Edit', [
            'doctor' => $doctor,
            'clinics' => Clinic::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Doctor $doctor)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'clinic_id' => 'nullable|exists:clinics,id',
            'specialization' => 'required|string|max:255',
            'payment_percentage' => 'required|numeric|min:0|max:100',
            'bio' => 'nullable|string',
        ]);

        if ($doctor->user) {
            $doctor->user->update([
                'name' => $request->name,
            ]);
        }

        $doctor->update([
            'name' => $request->name,
            'clinic_id' => $request->clinic_id,
            'specialization' => $request->specialization,
            'payment_percentage' => $request->payment_percentage,
            'bio' => $request->bio,
        ]);

        return redirect()->route('doctors.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Doctor $doctor)
    {
        $doctor->delete();
        return redirect()->route('doctors.index');
    }
}
