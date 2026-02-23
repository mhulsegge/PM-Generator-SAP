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
        // 1. Add new Foreign ID columns
        if (!Schema::hasColumn('maintenance_plans', 'maintenance_strategy_id')) {
            Schema::table('maintenance_plans', function (Blueprint $table) {
                $table->foreignId('maintenance_strategy_id')->nullable()->constrained('maintenance_strategies')->nullOnDelete();
            });
        }
        if (!Schema::hasColumn('task_lists', 'maintenance_strategy_id')) {
            Schema::table('task_lists', function (Blueprint $table) {
                $table->foreignId('maintenance_strategy_id')->nullable()->constrained('maintenance_strategies')->nullOnDelete();
            });
        }
        if (!Schema::hasColumn('template_task_lists', 'maintenance_strategy_id')) {
            Schema::table('template_task_lists', function (Blueprint $table) {
                $table->foreignId('maintenance_strategy_id')->nullable()->constrained('maintenance_strategies')->nullOnDelete();
            });
        }
        if (!Schema::hasColumn('task_list_operations', 'maintenance_strategy_package_id')) {
            Schema::table('task_list_operations', function (Blueprint $table) {
                $table->foreignId('maintenance_strategy_package_id')->nullable()->constrained('maintenance_strategy_packages')->nullOnDelete();
            });
        }
        if (!Schema::hasColumn('template_task_list_operations', 'maintenance_strategy_package_id')) {
            Schema::table('template_task_list_operations', function (Blueprint $table) {
                $table->foreignId('maintenance_strategy_package_id')->nullable()->constrained('maintenance_strategy_packages')->nullOnDelete();
            });
        }

        // 2. Map existing string data to IDs natively (sqlite doesn't support complex joins in updates consistently, so use a fetch script)
        $strategies = \Illuminate\Support\Facades\DB::table('maintenance_strategies')->get();
        $packages = \Illuminate\Support\Facades\DB::table('maintenance_strategy_packages')->get();

        foreach ($strategies as $strategy) {
            \Illuminate\Support\Facades\DB::table('maintenance_plans')->where('strategy_package', $strategy->name)->update(['maintenance_strategy_id' => $strategy->id]);
            \Illuminate\Support\Facades\DB::table('task_lists')->where('strategy_package', $strategy->name)->update(['maintenance_strategy_id' => $strategy->id]);
            \Illuminate\Support\Facades\DB::table('template_task_lists')->where('strategy_package', $strategy->name)->update(['maintenance_strategy_id' => $strategy->id]);
        }

        foreach ($packages as $pkg) {
            \Illuminate\Support\Facades\DB::table('task_list_operations')->where('strategy_package', $pkg->name)->update(['maintenance_strategy_package_id' => $pkg->id]);
            \Illuminate\Support\Facades\DB::table('template_task_list_operations')->where('strategy_package', $pkg->name)->update(['maintenance_strategy_package_id' => $pkg->id]);
        }

        // 3. Drop old columns
        if (Schema::hasColumn('maintenance_plans', 'strategy_package')) {
            Schema::table('maintenance_plans', function (Blueprint $table) {
                $table->dropColumn('strategy_package');
            });
        }
        if (Schema::hasColumn('task_lists', 'strategy_package')) {
            Schema::table('task_lists', function (Blueprint $table) {
                $table->dropColumn('strategy_package');
            });
        }
        if (Schema::hasColumn('template_task_lists', 'strategy_package')) {
            Schema::table('template_task_lists', function (Blueprint $table) {
                $table->dropColumn('strategy_package');
            });
        }
        if (Schema::hasColumn('task_list_operations', 'strategy_package')) {
            Schema::table('task_list_operations', function (Blueprint $table) {
                $table->dropColumn('strategy_package');
            });
        }
        if (Schema::hasColumn('template_task_list_operations', 'strategy_package')) {
            Schema::table('template_task_list_operations', function (Blueprint $table) {
                $table->dropColumn('strategy_package');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Add back string columns
        Schema::table('maintenance_plans', function (Blueprint $table) {
            $table->string('strategy_package')->nullable();
        });
        Schema::table('task_lists', function (Blueprint $table) {
            $table->string('strategy_package')->nullable();
        });
        Schema::table('template_task_lists', function (Blueprint $table) {
            $table->string('strategy_package')->nullable();
        });
        Schema::table('task_list_operations', function (Blueprint $table) {
            $table->string('strategy_package')->nullable();
        });
        Schema::table('template_task_list_operations', function (Blueprint $table) {
            $table->string('strategy_package')->nullable();
        });

        // Mapping back would require joins. Minimal implementation for rollback focus on dropping constraints:

        Schema::table('maintenance_plans', function (Blueprint $table) {
            $table->dropForeign(['maintenance_strategy_id']);
            $table->dropColumn('maintenance_strategy_id');
        });
        Schema::table('task_lists', function (Blueprint $table) {
            $table->dropForeign(['maintenance_strategy_id']);
            $table->dropColumn('maintenance_strategy_id');
        });
        Schema::table('template_task_lists', function (Blueprint $table) {
            $table->dropForeign(['maintenance_strategy_id']);
            $table->dropColumn('maintenance_strategy_id');
        });
        Schema::table('task_list_operations', function (Blueprint $table) {
            $table->dropForeign(['maintenance_strategy_package_id']);
            $table->dropColumn('maintenance_strategy_package_id');
        });
        Schema::table('template_task_list_operations', function (Blueprint $table) {
            $table->dropForeign(['maintenance_strategy_package_id']);
            $table->dropColumn('maintenance_strategy_package_id');
        });
    }
};
