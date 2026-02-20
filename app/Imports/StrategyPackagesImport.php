<?php

namespace App\Imports;

use App\Models\MaintenanceStrategyPackage;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class StrategyPackagesImport implements ToCollection, WithHeadingRow, WithCustomCsvSettings
{
    protected $importedCount = 0;
    protected $skippedCount = 0;
    protected $mapping;
    protected $strategyId;

    public function __construct(array $mapping, int $strategyId)
    {
        $this->mapping = $mapping;
        $this->strategyId = $strategyId;
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $mappedName = $row[$this->mapping['name']] ?? null;
            $mappedCycleValue = $row[$this->mapping['cycle_value']] ?? null;
            $mappedCycleUnit = $row[$this->mapping['cycle_unit']] ?? null;
            $mappedHierarchy = isset($this->mapping['hierarchy_short_text']) ? ($row[$this->mapping['hierarchy_short_text']] ?? null) : null;

            if (empty($mappedName) || empty($mappedCycleValue) || empty($mappedCycleUnit)) {
                $this->skippedCount++;
                continue;
            }

            MaintenanceStrategyPackage::updateOrCreate(
                [
                    'maintenance_strategy_id' => $this->strategyId,
                    'name' => trim($mappedName),
                ],
                [
                    'cycle_value' => (int) trim($mappedCycleValue),
                    'cycle_unit' => trim($mappedCycleUnit),
                    'hierarchy_short_text' => $mappedHierarchy ? (int) trim($mappedHierarchy) : null,
                ]
            );

            $this->importedCount++;
        }
    }

    public function getImportedCount()
    {
        return $this->importedCount;
    }

    public function getSkippedCount()
    {
        return $this->skippedCount;
    }

    public function getCsvSettings(): array
    {
        return [
            'input_encoding' => 'UTF-8',
            'delimiter' => ';'
        ];
    }
}
