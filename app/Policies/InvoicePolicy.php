<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class InvoicePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'receptionist']);
    }

    public function view(User $user, Invoice $invoice): bool
    {
        if ($user->role === 'doctor') {
            return $invoice->appointment->doctor_id === $user->doctor->id;
        }
        return in_array($user->role, ['admin', 'receptionist']);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'receptionist']);
    }

    public function update(User $user, Invoice $invoice): bool
    {
        return in_array($user->role, ['admin', 'receptionist']);
    }

    public function delete(User $user, Invoice $invoice): bool
    {
        return $user->role === 'admin';
    }
}