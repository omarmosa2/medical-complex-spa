<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('manage-appointments');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:doctors,id',
            'service_id' => 'required|exists:services,id',
            'clinic_id' => 'nullable|exists:clinics,id',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'status' => 'nullable|string|in:scheduled,completed,cancelled,no_show',
            'notes' => 'nullable|string',
            'appointment_cost' => 'nullable|numeric|min:0',
            'final_amount' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
        ];
    }
}