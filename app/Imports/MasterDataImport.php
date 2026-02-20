<?php

namespace App\Imports;

use App\Models\MasterData;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class MasterDataImport implements ToCollection, WithHeadingRow, WithCustomCsvSettings
{
    protected $importedCount = 0;
    protected $skippedCount = 0;
    protected $mapping;
    protected $category;

    public function __construct(array $mapping, string $category)
    {
        $this->mapping = $mapping;
        $this->category = $category;
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $mappedKey = $row[$this->mapping['key']] ?? null;
            $mappedLabel = $row[$this->mapping['label']] ?? null;
            $mappedDesc = isset($this->mapping['description']) ? ($row[$this->mapping['description']] ?? null) : null;
            $mappedSortOrder = isset($this->mapping['sort_order']) ? ((int) $row[$this->mapping['sort_order']]) : 0;

            if (empty($mappedKey) || empty($mappedLabel)) {
                $this->skippedCount++;
                continue;
            }

            MasterData::updateOrCreate(
                [
                    'category' => $this->category,
                    'key' => trim($mappedKey),
                ],
                [
                    'label' => trim($mappedLabel),
                    'description' => $mappedDesc ? trim($mappedDesc) : null,
                    'sort_order' => $mappedSortOrder,
                    'is_active' => true,
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
            'delimiter' => ';' // Excel exported CSVs often use ';'
        ];
    }
}
