<?php

namespace App\Http\Controllers;

use App\Models\DoctorAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DoctorAvailabilityController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', DoctorAvailability::class);
        $availabilities = DoctorAvailability::where('doctor_id', Auth::user()->doctor->id)->get();
        return Inertia::render('Availabilities/Index', ['availabilities' => $availabilities]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', DoctorAvailability::class);
        $request->validate([
            'day_of_week' => ['required', 'integer', 'between:0,6'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
        ]);

        DoctorAvailability::create([
            'doctor_id' => Auth::user()->doctor->id,
            'day_of_week' => $request->day_of_week,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        return back();
    }

    public function destroy(DoctorAvailability $availability)
    {
        $this->authorize('delete', $availability);
        $availability->delete();
        return back();
    }
}