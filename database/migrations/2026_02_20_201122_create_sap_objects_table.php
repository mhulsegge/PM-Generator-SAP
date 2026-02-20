<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sap_objects', function (Blueprint $table) {
            $table->id();
            $table->string('object_id')->unique(); // e.g., P-101
            $table->string('name')->nullable();
            $table->string('type')->default('equipment'); // FLOC or Equipment
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sap_objects');
    }
};
