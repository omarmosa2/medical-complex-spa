<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('manage-patients');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'age' => 'required|integer|min:1|max:150',
            'residence' => 'required|string|max:255',
            'phone' => 'nullable|string|unique:patients,phone',
            'email' => 'nullable|email|unique:patients,email',
            'notes' => 'nullable|string',
        ];
    }
}