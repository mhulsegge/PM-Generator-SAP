<?php

namespace App\Http\Controllers;

use App\Models\MasterData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\MasterDataImport;

class MasterDataController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->query('category');

        $items = [];
        if ($category) {
            $items = MasterData::where('category', $category)
                ->orderBy('sort_order')
                ->orderBy('label')
                ->get();
        }

        return Inertia::render('master-data/index', [
            'category' => $category,
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'key' => 'required|string',
            'label' => 'required|string',
            'sort_order' => 'integer',
        ]);

        MasterData::create($validated);

        return back();
    }

    public function update(Request $request, MasterData $masterData)
    {
        $validated = $request->validate([
            'label' => 'sometimes|string',
            'sort_order' => 'sometimes|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        $masterData->update($validated);

        return back();
    }

    public function destroy(MasterData $masterData)
    {
        $masterData->delete();

        return back();
    }

    public function importUpload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt,xlsx,xls|max:10240',
            'category' => 'required|string',
        ]);

        try {
            $path = $request->file('file')->store('imports');
            $headersData = (new \Maatwebsite\Excel\HeadingRowImport)->toArray(storage_path('app/private/' . $path));
            $headers = $headersData[0][0] ?? [];

            return Inertia::render('master-data/import-mapping', [
                'filePath' => $path,
                'headers' => $headers,
                'category' => $request->category,
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Fout bij het inlezen van bestand: ' . $e->getMessage());
        }
    }

    public function importProcess(Request $request)
    {
        $request->validate([
            'file_path' => 'required|string',
            'category' => 'required|string',
            'mapping' => 'required|array',
            'mapping.key' => 'required|string',
            'mapping.label' => 'required|string',
        ]);

        try {
            $import = new MasterDataImport($request->mapping, $request->category);
            Excel::import($import, storage_path('app/private/' . $request->file_path));

            \Illuminate\Support\Facades\Storage::delete($request->file_path);

            $importedCount = $import->getImportedCount();
            $skippedCount = $import->getSkippedCount();

            $message = "Succesvol {$importedCount} regels geïmporteerd.";
            if ($skippedCount > 0) {
                $message .= " ({$skippedCount} overgeslagen ivm ontbrekende data).";
            }

            return redirect()->route('master-data.index', ['category' => $request->category])->with('success', $message);
        } catch (\Exception $e) {
            return redirect()->route('master-data.index', ['category' => $request->category])->with('error', 'Fout bij het importeren: ' . $e->getMessage());
        }
    }
}
