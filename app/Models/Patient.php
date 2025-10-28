<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $appends = ['full_name'];

    // Accessor for full_name - handle both old and new field names
    public function getFullNameAttribute()
    {
        // Return full_name if it exists, otherwise return name (for backward compatibility)
        return $this->attributes['full_name'] ?? $this->attributes['name'] ?? 'غير محدد';
    }

    // Setter for full_name
    public function setFullNameAttribute($value)
    {
        // Set full_name field
        $this->attributes['full_name'] = $value;
        
        // Also set name field for backward compatibility if it exists
        if ($this->hasAttribute('name')) {
            $this->attributes['name'] = $value;
        }
    }

    // Check if attribute exists
    private function attributeExists($name)
    {
        return array_key_exists($name, $this->getAttributes());
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