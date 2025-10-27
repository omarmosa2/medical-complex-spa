<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClinicController extends Controller
{
    /**
      * Display a listing of the resource.
      */
    public function index()
    {
         $this->authorize('viewAny', Clinic::class);
         $clinics = Clinic::all();
         $stats = [
             'total_clinics' => Clinic::count(),
             'active_clinics' => Clinic::count(), // Assuming all clinics are active for now
         ];
         return Inertia::render('Clinics/Index', [
             'clinics' => $clinics,
             'stats' => $stats
         ]);
    }

     /**
      * Show the form for creating a new resource.
      */
    public function create()
    {
         $this->authorize('create', Clinic::class);
         return Inertia::render('Clinics/Create');
     }

     /**
      * Store a newly created resource in storage.
      */
    public function store(Request $request)
    {
         $this->authorize('create', Clinic::class);
         $validated = $request->validate([
             'name' => 'required|string|max:255',
             'location' => 'nullable|string|max:255',
             'working_days' => 'nullable|string',
             'notes' => 'nullable|string',
             'description' => 'nullable|string',
         ]);

         Clinic::create($validated);

         return redirect()->route('clinics.index');
     }

     /**
      * Display the specified resource.
      */
    public function show(Clinic $clinic)
    {
         $this->authorize('view', $clinic);
         return Inertia::render('Clinics/Show', [
             'clinic' => $clinic
         ]);
     }

     /**
      * Show the form for editing the specified resource.
      */
    public function edit(Clinic $clinic)
    {
         $this->authorize('update', $clinic);
         return Inertia::render('Clinics/Edit', [
             'clinic' => $clinic
         ]);
     }

     /**
      * Update the specified resource in storage.
      */
    public function update(Request $request, Clinic $clinic)
    {
         $this->authorize('update', $clinic);
         $validated = $request->validate([
             'name' => 'required|string|max:255',
             'location' => 'nullable|string|max:255',
             'working_days' => 'nullable|string',
             'notes' => 'nullable|string',
             'description' => 'nullable|string',
         ]);

         $clinic->update($validated);

         return redirect()->route('clinics.index');
     }

     /**
      * Remove the specified resource from storage.
      */
    public function destroy(Clinic $clinic)
    {
         $this->authorize('delete', $clinic);
         $clinic->delete();

         return redirect()->route('clinics.index');
     }
}
