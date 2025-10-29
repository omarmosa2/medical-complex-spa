<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Appointment;
use App\Models\Payment;
use App\Models\Notification as NotificationModel;
use App\Models\Service;
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
                'todaysAppointments' => Appointment::whereDate('appointment_time', Carbon::today())->count(),
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
                'appointmentTrends' => Appointment::select(DB::raw('DATE(appointment_time) as date'), DB::raw('count(*) as count'))
                    ->where('appointment_time', '>=', Carbon::now()->subDays(30))
                    ->groupBy('date')
                    ->orderBy('date', 'asc')
                    ->get(),
                'serviceDistribution' => Appointment::with('service')
                    ->select('service_id', DB::raw('count(*) as count'))
                    ->groupBy('service_id')
                    ->get()
                    ->map(function ($item) {
                        return [
                            'service' => $item->service->name,
                            'count' => $item->count,
                        ];
                    }),
                'monthlyRevenue' => Payment::select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), DB::raw('SUM(amount) as total'))
                    ->where('created_at', '>=', Carbon::now()->subMonths(12))
                    ->groupBy('month')
                    ->orderBy('month', 'asc')
                    ->get(),
            ];
            $data['recentNotifications'] = NotificationModel::latest()->take(5)->get();
            $data['todaysAppointments'] = Appointment::with(['patient', 'doctor.user', 'service'])
                ->whereDate('appointment_time', Carbon::today())
                ->orderBy('appointment_time', 'asc')
                ->get();
            $data['recentPatients'] = Patient::latest()->take(5)->get();
        } elseif ($user->role === 'doctor') {
            $data['todaysAppointments'] = Appointment::with('patient')
                ->where('doctor_id', $user->doctor->id)
                ->whereDate('appointment_time', Carbon::today())
                ->orderBy('appointment_time', 'asc')
                ->get();
            $data['recentPatients'] = Patient::whereHas('appointments', function ($query) use ($user) {
                $query->where('doctor_id', $user->doctor->id);
            })->latest()->take(5)->get();
        } elseif ($user->role === 'receptionist') {
            $data['todaysAppointments'] = Appointment::with(['patient', 'doctor.user'])
                ->whereDate('appointment_time', Carbon::today())
                ->orderBy('appointment_time', 'asc')
                ->get();
            $data['patients'] = Patient::orderBy('name')->get();
            $data['doctors'] = Doctor::with('user')->join('users', 'doctors.user_id', '=', 'users.id')->orderBy('users.name')->select('doctors.*')->get();
        }

        return Inertia::render('Dashboard', $data);
    }
}