<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class MaintenanceTasksImport implements ToCollection, WithHeadingRow, WithCustomCsvSettings
{
    protected $importedCount = 0;
    protected $skippedCount = 0;
    protected $mapping;
    protected $skipAssetIds;

    public function __construct(array $mapping, array $skipAssetIds = [])
    {
        $this->mapping = $mapping;
        $this->skipAssetIds = $skipAssetIds;
    }

    public function collection(Collection $rows)
    {
        $user = auth()->user();

        foreach ($rows as $row) {
            $mappedName = $row[$this->mapping['name']] ?? null;
            $mappedFreqUnit = $row[$this->mapping['frequency_unit']] ?? null;
            $mappedFreqValue = $row[$this->mapping['frequency_value']] ?? null;
            $mappedObjType = $row[$this->mapping['object_type']] ?? null;
            $mappedObjId = $row[$this->mapping['object_id']] ?? null;
            $mappedDesc = isset($this->mapping['description']) ? ($row[$this->mapping['description']] ?? null) : null;

            if (empty($mappedName) || empty($mappedFreqUnit) || empty($mappedFreqValue) || empty($mappedObjType) || empty($mappedObjId)) {
                $this->skippedCount++;
                continue;
            }

            if (in_array(trim($mappedObjId), $this->skipAssetIds)) {
                $this->skippedCount++;
                continue;
            }

            $plan = \App\Models\MaintenancePlan::create([
                'name' => trim($mappedName),
                'frequency_unit' => trim($mappedFreqUnit),
                'frequency_value' => (int) trim($mappedFreqValue),
            ]);

            $task = $user->maintenanceTasks()->create([
                'name' => trim($mappedName),
                'description' => $mappedDesc ? trim($mappedDesc) : null,
                'status' => 'draft',
                'maintenance_plan_id' => $plan->id,
            ]);

            $task->items()->create([
                'object_type' => trim($mappedObjType),
                'object_id' => trim($mappedObjId),
            ]);

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
            'delimiter' => ';' // Excel exported CSVs often use ';'
        ];
    }
}
