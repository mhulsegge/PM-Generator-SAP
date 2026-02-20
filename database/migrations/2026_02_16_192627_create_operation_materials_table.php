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
        Schema::create('operation_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_list_operation_id')->constrained()->cascadeOnDelete();
            $table->string('material_number');
            $table->string('description')->nullable();
            $table->decimal('quantity', 8, 2);
            $table->string('unit')->default('PC');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operation_materials');
    }
};
