<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClinicSchedule extends Model
{
    use HasFactory;

    protected $fillable = ['clinic_id', 'day_of_week', 'is_active', 'start_time', 'end_time'];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}