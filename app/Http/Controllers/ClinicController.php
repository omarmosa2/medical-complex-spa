<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use App\Models\ClinicSchedule;
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
        $clinics = Clinic::with('schedules')->get();
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
             'notes' => 'nullable|string',
             'description' => 'nullable|string',
             'schedules' => 'array',
             'schedules.*.day_of_week' => 'required|integer|between:1,7',
             'schedules.*.is_active' => 'boolean',
             'schedules.*.start_time' => 'nullable|date_format:H:i',
             'schedules.*.end_time' => 'nullable|date_format:H:i|after:schedules.*.start_time',
         ]);

         $schedules = $validated['schedules'];
         unset($validated['schedules']);

         $clinic = Clinic::create($validated);

         // Create schedules
         foreach ($schedules as $scheduleData) {
             $clinic->schedules()->create($scheduleData);
         }

         return redirect()->route('clinics.index');
     }

     /**
      * Display the specified resource.
      */
     public function show(Clinic $clinic)
     {
         $this->authorize('view', $clinic);
         return Inertia::render('Clinics/Show', [
             'clinic' => $clinic->load('schedules')
         ]);
     }

     /**
      * Show the form for editing the specified resource.
      */
     public function edit(Clinic $clinic)
     {
         $this->authorize('update', $clinic);
         return Inertia::render('Clinics/Edit', [
             'clinic' => $clinic->load('schedules')
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
             'notes' => 'nullable|string',
             'description' => 'nullable|string',
             'schedules' => 'array',
             'schedules.*.day_of_week' => 'required|integer|between:1,7',
             'schedules.*.is_active' => 'boolean',
             'schedules.*.start_time' => 'nullable|date_format:H:i',
             'schedules.*.end_time' => 'nullable|date_format:H:i|after:schedules.*.start_time',
         ]);

         $schedules = $validated['schedules'];
         unset($validated['schedules']);

         $clinic->update($validated);

         // Delete existing schedules and create new ones
         $clinic->schedules()->delete();
         foreach ($schedules as $scheduleData) {
             $clinic->schedules()->create($scheduleData);
         }

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
