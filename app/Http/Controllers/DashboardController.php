<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Appointment;
use App\Models\Payment;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $data = [];

        if ($user->role === 'admin') {
            $data['stats'] = [
                'patients' => Patient::count(),
                'doctors' => Doctor::count(),
                'todaysAppointments' => Appointment::whereDate('date', Carbon::today())->count(),
                'pendingAppointments' => Appointment::where('status', 'scheduled')->count(),
                'totalRevenue' => Payment::sum('amount'),
                'monthlyRevenue' => Payment::whereMonth('created_at', Carbon::now()->month)->sum('amount'),
            ];
            $data['charts'] = [
                'patientGrowth' => Patient::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
                    ->where('created_at', '>=', Carbon::now()->subDays(30))
                    ->groupBy('date')
                    ->orderBy('date', 'asc')
                    ->get(),
            ];
        } elseif ($user->role === 'doctor') {
            $data['todaysAppointments'] = Appointment::with('patient')
                ->where('doctor_id', $user->doctor->id)
                ->whereDate('date', Carbon::today())
                ->orderBy('start_time', 'asc')
                ->get();
            $data['recentPatients'] = Patient::whereHas('appointments', function ($query) use ($user) {
                $query->where('doctor_id', $user->doctor->id);
            })->latest()->take(5)->get();
        } elseif ($user->role === 'receptionist') {
            $data['todaysAppointments'] = Appointment::with(['patient', 'doctor.user'])
                ->whereDate('date', Carbon::today())
                ->orderBy('start_time', 'asc')
                ->get();
            $data['patients'] = Patient::orderBy('name')->get();
            $data['doctors'] = Doctor::with('user')->orderBy('name')->get();
        }

        return Inertia::render('Dashboard', $data);
    }
}