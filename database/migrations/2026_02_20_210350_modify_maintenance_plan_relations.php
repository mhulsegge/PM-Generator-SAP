<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     * 
     * Flips the relationship: instead of maintenance_plans.maintenance_task_id,
     * we add maintenance_tasks.maintenance_plan_id so one plan can own many tasks.
     */
    public function up(): void
    {
        // 1. Add `name` to maintenance_plans
        Schema::table('maintenance_plans', function (Blueprint $table) {
            $table->string('name')->nullable()->after('id');
        });

        // 2. Add nullable maintenance_plan_id to maintenance_tasks
        Schema::table('maintenance_tasks', function (Blueprint $table) {
            $table->foreignId('maintenance_plan_id')->nullable()->after('user_id')->constrained('maintenance_plans')->nullOnDelete();
        });

        // 3. Migrate existing data: for each plan, point its tasks to it
        $plans = DB::table('maintenance_plans')->get();
        foreach ($plans as $plan) {
            DB::table('maintenance_tasks')
                ->where('id', $plan->maintenance_task_id)
                ->update(['maintenance_plan_id' => $plan->id]);
        }

        // 4. Drop the old FK column from maintenance_plans
        Schema::table('maintenance_plans', function (Blueprint $table) {
            $table->dropForeign(['maintenance_task_id']);
            $table->dropColumn('maintenance_task_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Re-add old column
        Schema::table('maintenance_plans', function (Blueprint $table) {
            $table->foreignId('maintenance_task_id')->nullable()->constrained('maintenance_tasks')->nullOnDelete();
        });

        // Migrate data back
        $tasks = DB::table('maintenance_tasks')->whereNotNull('maintenance_plan_id')->get();
        foreach ($tasks as $task) {
            DB::table('maintenance_plans')
                ->where('id', $task->maintenance_plan_id)
                ->update(['maintenance_task_id' => $task->id]);
        }

        // Drop new columns
        Schema::table('maintenance_tasks', function (Blueprint $table) {
            $table->dropForeign(['maintenance_plan_id']);
            $table->dropColumn('maintenance_plan_id');
        });

        Schema::table('maintenance_plans', function (Blueprint $table) {
            $table->dropColumn('name');
        });
    }
};
