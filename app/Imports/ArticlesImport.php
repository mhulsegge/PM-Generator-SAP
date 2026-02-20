<?php

namespace App\Imports;

use App\Models\Article;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class ArticlesImport implements ToCollection, WithHeadingRow, WithCustomCsvSettings
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
            $mappedArticleNumber = $row[$this->mapping['article_number']] ?? null;
            $mappedDescription = $row[$this->mapping['description']] ?? null;
            $mappedUnit = isset($this->mapping['unit']) ? ($row[$this->mapping['unit']] ?? 'ST') : 'ST';

            if (empty($mappedArticleNumber) || empty($mappedDescription)) {
                $this->skippedCount++;
                continue;
            }

            Article::updateOrCreate(
                [
                    'article_number' => trim($mappedArticleNumber),
                ],
                [
                    'description' => trim($mappedDescription),
                    'unit' => trim($mappedUnit),
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
