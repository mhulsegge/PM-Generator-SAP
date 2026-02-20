<?php

namespace App\Imports;

use App\Models\SapObject;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class SapObjectsImport implements ToCollection, WithHeadingRow, WithCustomCsvSettings
{
    protected $importedCount = 0;
    protected $skippedCount = 0;
    protected $mapping;

    public function __construct(array $mapping)
    {
        $this->mapping = $mapping;
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $mappedObjectId = $row[$this->mapping['object_id']] ?? null;
            $mappedName = isset($this->mapping['name']) ? ($row[$this->mapping['name']] ?? null) : null;
            $mappedType = isset($this->mapping['type']) ? ($row[$this->mapping['type']] ?? 'equipment') : 'equipment';
            $mappedDesc = isset($this->mapping['description']) ? ($row[$this->mapping['description']] ?? null) : null;

            if (empty($mappedObjectId)) {
                $this->skippedCount++;
                continue;
            }

            if (!in_array(strtolower($mappedType), ['equipment', 'floc'])) {
                $mappedType = 'equipment';
            }

            SapObject::updateOrCreate(
                [
                    'object_id' => trim($mappedObjectId),
                ],
                [
                    'name' => trim($mappedName),
                    'type' => strtolower(trim($mappedType)),
                    'description' => $mappedDesc ? trim($mappedDesc) : null,
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
