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
        Schema::create('maintenance_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('maintenance_task_id')->constrained()->cascadeOnDelete();
            $table->string('frequency_unit')->nullable(); // WK, ND, JR
            $table->integer('frequency_value')->nullable();
            $table->string('call_horizon_unit')->nullable();
            $table->integer('call_horizon_value')->nullable();
            $table->string('start_date')->nullable();
            $table->boolean('is_strategy_plan')->default(false);
            $table->string('strategy_package')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_plans');
    }
};
