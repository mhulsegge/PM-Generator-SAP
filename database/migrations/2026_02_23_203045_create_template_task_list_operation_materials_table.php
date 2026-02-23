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
        Schema::create('template_task_list_operation_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_task_list_operation_id')
                ->constrained('template_task_list_operations')
                ->onDelete('cascade');
            $table->string('material_number');
            $table->decimal('quantity', 10, 3)->default(1);
            $table->string('unit', 10)->default('ST');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('template_task_list_operation_materials');
    }
};
