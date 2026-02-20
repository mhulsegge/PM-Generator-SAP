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
        Schema::create('maintenance_strategy_packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('maintenance_strategy_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // e.g. '1M', '1Y', 'A', 'B'
            $table->integer('cycle_value');
            $table->string('cycle_unit'); // e.g. 'MON', 'YR', 'WK'
            $table->integer('hierarchy_short_text')->nullable(); // Could be a sorting number or rank
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_strategy_packages');
    }
};
