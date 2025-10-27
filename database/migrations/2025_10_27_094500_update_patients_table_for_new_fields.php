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
        Schema::table('patients', function (Blueprint $table) {
            // Remove old columns if they exist
            if (Schema::hasColumn('patients', 'file_number')) {
                $table->dropColumn('file_number');
            }
            if (Schema::hasColumn('patients', 'name')) {
                $table->dropColumn('name');
            }
            if (Schema::hasColumn('patients', 'date_of_birth')) {
                $table->dropColumn('date_of_birth');
            }

            // Add new columns if they don't exist
            if (!Schema::hasColumn('patients', 'full_name')) {
                $table->string('full_name')->after('id');
            }
            if (!Schema::hasColumn('patients', 'age')) {
                $table->integer('age')->nullable();
            }

            // Handle phone index safely
            try {
                DB::statement('ALTER TABLE patients DROP INDEX patients_phone_unique');
            } catch (\Exception $e) {
                // Ignore if the index does not exist
            }

            // Update phone column to be nullable & unique
            if (Schema::hasColumn('patients', 'phone')) {
                $table->string('phone')->nullable()->unique()->change();
            } else {
                $table->string('phone')->nullable()->unique();
            }

            if (!Schema::hasColumn('patients', 'email')) {
                $table->string('email')->nullable()->unique();
            }

            if (!Schema::hasColumn('patients', 'notes')) {
                $table->text('notes')->nullable();
            }

            // Rename address → residence if applicable
            if (Schema::hasColumn('patients', 'address') && !Schema::hasColumn('patients', 'residence')) {
                $table->renameColumn('address', 'residence');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            // Restore old columns if they don't exist
            if (!Schema::hasColumn('patients', 'file_number')) {
                $table->string('file_number')->unique();
            }
            if (!Schema::hasColumn('patients', 'name')) {
                $table->string('name');
            }
            if (!Schema::hasColumn('patients', 'date_of_birth')) {
                $table->date('date_of_birth');
            }

            // Drop new columns if they exist
            if (Schema::hasColumn('patients', 'full_name')) {
                $table->dropColumn('full_name');
            }
            if (Schema::hasColumn('patients', 'age')) {
                $table->dropColumn('age');
            }
            if (Schema::hasColumn('patients', 'email')) {
                $table->dropColumn('email');
            }
            if (Schema::hasColumn('patients', 'notes')) {
                $table->dropColumn('notes');
            }

            // Rename residence back to address if residence exists
            if (Schema::hasColumn('patients', 'residence') && !Schema::hasColumn('patients', 'address')) {
                $table->renameColumn('residence', 'address');
            }


            if (Schema::hasColumn('patients', 'phone')) {
                $table->string('phone')->unique()->change();
            }
        });
    }
};