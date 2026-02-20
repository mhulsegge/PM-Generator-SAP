<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // 1. Maintenance Plans
        Schema::table('maintenance_plans', function (Blueprint $table) {
            $table->string('scheduling_period_value')->nullable();
            $table->string('scheduling_period_unit')->nullable();
            $table->string('order_type')->nullable(); // e.g. PM01, PM03
            $table->boolean('completion_requirement')->default(false);
            $table->boolean('auto_order_generation')->default(true);
        });

        // 2. Maintenance Items
        Schema::table('maintenance_items', function (Blueprint $table) {
            $table->string('planner_group')->nullable();
            $table->string('main_work_center')->nullable();
            $table->string('order_type')->nullable(); // Override from plan
        });

        // 3. Task Lists
        Schema::table('task_lists', function (Blueprint $table) {
            $table->string('strategy_package')->nullable(); // Strategy reference on Task List level
            $table->text('general_instructions')->nullable();
            $table->string('usage')->nullable(); // "Toepassing"
        });

        // 4. Task List Operations
        Schema::table('task_list_operations', function (Blueprint $table) {
            $table->string('strategy_package')->nullable(); // A, B, C etc
        });
    }

    public function down(): void
    {
        Schema::table('maintenance_plans', function (Blueprint $table) {
            $table->dropColumn(['scheduling_period_value', 'scheduling_period_unit', 'order_type', 'completion_requirement', 'auto_order_generation']);
        });

        Schema::table('maintenance_items', function (Blueprint $table) {
            $table->dropColumn(['planner_group', 'main_work_center', 'order_type']);
        });

        Schema::table('task_lists', function (Blueprint $table) {
            $table->dropColumn(['strategy_package', 'general_instructions', 'usage']);
        });

        Schema::table('task_list_operations', function (Blueprint $table) {
            $table->dropColumn(['strategy_package']);
        });
    }
};
