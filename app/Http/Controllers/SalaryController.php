<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\DoctorBonus;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class SalaryController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Doctor::class); // admin only via policy

        $month = $request->input('month', Carbon::now()->format('Y-m'));
        $start = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        $end = (clone $start)->endOfMonth();

        $doctors = Doctor::with('user')->get()->map(function ($doctor) use ($start, $end) {
            $paymentsSum = Payment::whereHas('appointment', function ($q) use ($doctor, $start, $end) {
                $q->where('doctor_id', $doctor->id)
                  ->whereBetween('appointment_time', [$start, $end]);
            })->sum('amount');

            $payout = (int) round(($paymentsSum * ($doctor->payment_percentage ?? 0)) / 100);
            $bonus = DoctorBonus::where('doctor_id', $doctor->id)
                ->whereBetween('created_at', [$start, $end])
                ->sum('amount');

            return [
                'id' => $doctor->id,
                'name' => $doctor->user?->name ?? $doctor->name,
                'percentage' => $doctor->payment_percentage ?? 0,
                'payments' => (float) $paymentsSum,
                'payout' => (int) $payout,
                'bonus' => (float) $bonus,
                'total' => (float) ($payout + $bonus),
            ];
        });

        return Inertia::render('Salaries/Index', [
            'month' => $month,
            'doctors' => $doctors,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'doctor_id' => ['required', 'exists:doctors,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'note' => ['nullable', 'string'],
        ]);

        DoctorBonus::create([
            'doctor_id' => $request->doctor_id,
            'amount' => $request->amount,
            'note' => $request->note,
        ]);

        return back();
    }
}


