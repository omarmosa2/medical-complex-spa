<?php

namespace App\Policies;

use App\Models\MedicalRecordTemplate;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MedicalRecordTemplatePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'doctor';
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, MedicalRecordTemplate $medicalRecordTemplate): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'doctor';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, MedicalRecordTemplate $medicalRecordTemplate): bool
    {
        return $user->id === $medicalRecordTemplate->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, MedicalRecordTemplate $medicalRecordTemplate): bool
    {
        return $user->id === $medicalRecordTemplate->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, MedicalRecordTemplate $medicalRecordTemplate): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, MedicalRecordTemplate $medicalRecordTemplate): bool
    {
        return false;
    }
}