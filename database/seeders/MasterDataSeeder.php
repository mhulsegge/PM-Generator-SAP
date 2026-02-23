<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MasterData;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'frequency_unit' => [
                ['key' => 'D', 'label' => 'Dagen'],
                ['key' => 'W', 'label' => 'Weken'],
                ['key' => 'M', 'label' => 'Maanden'],
                ['key' => 'K', 'label' => 'Kwartalen'],
                ['key' => 'J', 'label' => 'Jaren'],
            ],
            'discipline' => [
                ['key' => 'W', 'label' => 'Werktuigbouwkunde'],
                ['key' => 'E', 'label' => 'Elektrotechniek'],
                ['key' => 'I', 'label' => 'Instrumentatie'],
                ['key' => 'C', 'label' => 'Civiele Techniek'],
            ],
            'strategy_package' => [
                ['key' => '1M', 'label' => 'Maandelijks (1M)'],
                ['key' => '3M', 'label' => 'Kwartaal (3M)'],
                ['key' => '6M', 'label' => 'Halfjaarlijks (6M)'],
                ['key' => '1Y', 'label' => 'Jaarlijks (1Y)'],
            ],
            'control_key' => [
                ['key' => 'PM01', 'label' => 'Interne inzet'],
                ['key' => 'PM02', 'label' => 'Externe inzet'],
            ]
        ];

        foreach ($data as $category => $items) {
            foreach ($items as $index => $item) {
                MasterData::firstOrCreate(
                    ['category' => $category, 'key' => $item['key']],
                    [
                        'label' => $item['label'],
                        'sort_order' => $index,
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
