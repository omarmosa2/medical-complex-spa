<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Clinic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Payment::class); // Assuming a PaymentPolicy exists or will be created

        $query = Payment::join('appointments', 'payments.appointment_id', '=', 'appointments.id')
            ->join('clinics', 'appointments.clinic_id', '=', 'clinics.id')
            ->select('clinics.name as clinic_name', DB::raw('SUM(payments.amount) as total_revenue'))
            ->groupBy('clinics.name');

        if ($request->filled('start_date')) {
            $query->whereDate('payments.created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('payments.created_at', '<=', $request->end_date);
        }

        if ($request->filled('clinic_id')) {
            $query->where('appointments.clinic_id', $request->clinic_id);
        }

        $revenueByClinic = $query->get();

        return Inertia::render('Reports/Index', [
            'revenueByClinic' => $revenueByClinic,
            'clinics' => Clinic::all(),
            'filters' => $request->only(['start_date', 'end_date', 'clinic_id']),
        ]);
    }
}