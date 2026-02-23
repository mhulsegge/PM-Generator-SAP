<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\MasterData;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, add the new master data frequency units if they don't exist
        $newUnits = [
            ['key' => 'D', 'label' => 'Dagen', 'sort_order' => 10],
            ['key' => 'W', 'label' => 'Weken', 'sort_order' => 20],
            ['key' => 'M', 'label' => 'Maanden', 'sort_order' => 30],
            ['key' => 'K', 'label' => 'Kwartalen', 'sort_order' => 40],
            ['key' => 'J', 'label' => 'Jaren', 'sort_order' => 50],
        ];

        foreach ($newUnits as $unit) {
            MasterData::firstOrCreate(
                ['category' => 'frequency_unit', 'key' => $unit['key']],
                ['label' => $unit['label'], 'sort_order' => $unit['sort_order'], 'is_active' => true]
            );
        }

        // Mapping old values to new keys
        $map = [
            // Days
            'DAG' => 'D',
            'D' => 'D',
            // Weeks
            'WK' => 'W',
            'W' => 'W',
            // Months
            'MND' => 'M',
            'MON' => 'M',
            'M' => 'M',
            // Quarters
            'KWT' => 'K',
            'Q' => 'K',
            'K' => 'K',
            // Years
            'JR' => 'J',
            'YR' => 'J',
            'J' => 'J',
        ];

        // Update Packages
        foreach ($map as $old => $new) {
            DB::table('maintenance_strategy_packages')
                ->where('cycle_unit', $old)
                ->update(['cycle_unit' => $new]);
        }

        // Update Single Cycle Plans
        foreach ($map as $old => $new) {
            DB::table('maintenance_plans')
                ->where('frequency_unit', $old)
                ->update(['frequency_unit' => $new]);
        }

        // Update scheduling period units while we are at it, typically uses YR/MON
        DB::table('maintenance_plans')
            ->where('scheduling_period_unit', 'YR')
            ->update(['scheduling_period_unit' => 'J']);
        DB::table('maintenance_plans')
            ->where('scheduling_period_unit', 'MON')
            ->update(['scheduling_period_unit' => 'M']);

        // Remove old frequency units from Master Data
        $validKeys = ['D', 'W', 'M', 'K', 'J'];
        MasterData::where('category', 'frequency_unit')
            ->whereNotIn('key', $validKeys)
            ->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // One way migration
    }
};
