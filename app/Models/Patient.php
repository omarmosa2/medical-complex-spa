<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $guarded = [];

    // Accessor for full_name (returns the actual database field)
    public function getFullNameAttribute()
    {
        return $this->attributes['full_name'] ?? null;
    }

    // Setter for full_name
    public function setFullNameAttribute($value)
    {
        $this->attributes['full_name'] = $value;
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}