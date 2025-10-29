<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Payment::class, 'payment');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Payment::class);
        $paymentsQuery = Payment::with('appointment.patient', 'appointment.service');

        $stats = [
            'totalAmount' => (float) Payment::sum('amount'),
            'paidAmount' => (float) Payment::where('status', 'paid')->sum('amount'),
            'pendingAmount' => (float) Payment::where('status', 'pending')->sum('amount'),
            'countToday' => (int) Payment::whereDate('created_at', now()->toDateString())->count(),
        ];

        return Inertia::render('Payments/Index', [
            'payments' => $paymentsQuery->paginate(10),
            'stats' => $stats,
            'patients' => \App\Models\Patient::select('id','full_name')->get(),
            'appointments' => \App\Models\Appointment::with('patient')
                ->select('id','patient_id','appointment_date','appointment_time')
                ->orderBy('appointment_date','desc')
                ->take(200)
                ->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Payments/Create', [
            'patients' => Patient::all(),
            'appointments' => Appointment::with('patient')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'appointment_id' => 'required|exists:appointments,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,insurance',
            'transaction_id' => 'nullable|string',
            'status' => 'required|in:paid,pending,refunded',
        ]);

        $payment = Payment::create($validated);

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'created_payment',
            'description' => "Created payment for appointment ID: {$payment->appointment_id}",
        ]);

        return redirect()->route('payments.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        $payment->load('appointment.patient', 'appointment.service');

        return Inertia::render('Payments/Show', [
            'payment' => $payment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        return Inertia::render('Payments/Edit', [
            'payment' => $payment,
            'patients' => Patient::all(),
            'appointments' => Appointment::with('patient')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'appointment_id' => 'required|exists:appointments,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,insurance',
            'transaction_id' => 'nullable|string',
            'status' => 'required|in:paid,pending,refunded',
        ]);

        $payment->update($validated);

        return redirect()->route('payments.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        $payment->delete();

        return redirect()->route('payments.index');
    }
}