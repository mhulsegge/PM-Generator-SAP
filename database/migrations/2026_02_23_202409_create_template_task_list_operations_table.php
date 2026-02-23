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
        Schema::create('template_task_list_operations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_task_list_id')->constrained()->cascadeOnDelete();
            $table->integer('operation_number')->default(10);
            $table->string('control_key')->default('PM01');
            $table->string('short_text');
            $table->text('long_text')->nullable();
            $table->string('work_center')->nullable();
            $table->decimal('duration_normal', 8, 2)->nullable();
            $table->string('duration_unit')->default('H');
            $table->integer('number_of_people')->default(1);
            $table->string('strategy_package')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('template_task_list_operations');
    }
};
