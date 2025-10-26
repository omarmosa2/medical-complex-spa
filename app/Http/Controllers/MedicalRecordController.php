<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMedicalRecordRequest;
use App\Models\MedicalRecord;
use App\Models\Appointment;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MedicalRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMedicalRecordRequest $request)
    {
        DB::transaction(function () use ($request) {
            $appointment = Appointment::with('service')->findOrFail($request->appointment_id);

            $appointment->medicalRecord()->create([
                'patient_id' => $request->patient_id,
                'doctor_id' => $appointment->doctor_id,
                'diagnosis' => $request->diagnosis,
                'prescription' => $request->prescription,
                'notes' => $request->notes,
            ]);

            // Mark appointment as completed
            $appointment->update(['status' => 'completed']);

            // Create an invoice
            $invoice = Invoice::create([
                'patient_id' => $appointment->patient_id,
                'invoice_number' => 'INV-' . time(), // A more robust unique ID is recommended for production
                'total_amount' => $appointment->service->price,
                'status' => 'unpaid',
                'due_date' => now()->addDays(7),
            ]);

            $invoice->items()->create([
                'service_id' => $appointment->service_id,
                'description' => $appointment->service->name,
                'quantity' => 1,
                'unit_price' => $appointment->service->price,
                'total_price' => $appointment->service->price,
            ]);
        });

        return redirect()->route('doctor.agenda'); // Assuming a route name for the doctor's agenda
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}