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
        Schema::create('operation_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_list_operation_id')->constrained()->cascadeOnDelete();
            $table->string('document_type')->default('DRW');
            $table->string('document_number');
            $table->string('document_part')->default('000');
            $table->string('document_version')->default('00');
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operation_documents');
    }
};
