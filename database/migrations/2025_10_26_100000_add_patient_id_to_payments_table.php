<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if patient_id column exists
        if (!Schema::hasColumn('payments', 'patient_id')) {
            Schema::table('payments', function (Blueprint $table) {
                $table->unsignedBigInteger('patient_id')->after('appointment_id');
            });
        }

        // Update existing payments with patient_id from their appointment
        DB::statement('UPDATE payments SET patient_id = (SELECT patient_id FROM appointments WHERE appointments.id = payments.appointment_id)');

        // Check if foreign key exists before adding
        $foreignKeys = DB::select("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'payments' AND COLUMN_NAME = 'patient_id' AND CONSTRAINT_SCHEMA = DATABASE()");
        if (empty($foreignKeys)) {
            Schema::table('payments', function (Blueprint $table) {
                $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $foreignKeys = DB::select("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'payments' AND COLUMN_NAME = 'patient_id' AND CONSTRAINT_SCHEMA = DATABASE()");
        if (!empty($foreignKeys)) {
            Schema::table('payments', function (Blueprint $table) {
                $table->dropForeign(['patient_id']);
            });
        }
        if (Schema::hasColumn('payments', 'patient_id')) {
            Schema::table('payments', function (Blueprint $table) {
                $table->dropColumn('patient_id');
            });
        }
    }
};