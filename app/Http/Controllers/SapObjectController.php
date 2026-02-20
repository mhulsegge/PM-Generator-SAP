<?php

namespace App\Http\Controllers;

use App\Models\SapObject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\SapObjectsImport;

class SapObjectController extends Controller
{
    public function index()
    {
        $objects = SapObject::latest()->paginate(20);
        return Inertia::render('sap-objects/index', [
            'objects' => $objects,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'object_id' => 'required|string|unique:sap_objects,object_id',
            'name' => 'nullable|string',
            'type' => 'required|in:equipment,floc',
            'description' => 'nullable|string',
        ]);

        SapObject::create($validated);
        return back()->with('success', 'Object toegevoegd.');
    }

    public function update(Request $request, SapObject $sapObject)
    {
        $validated = $request->validate([
            'name' => 'nullable|string',
            'type' => 'required|in:equipment,floc',
            'description' => 'nullable|string',
        ]);

        $sapObject->update($validated);
        return back()->with('success', 'Object gewijzigd.');
    }

    public function destroy(SapObject $sapObject)
    {
        $sapObject->delete();
        return back()->with('success', 'Object verwijderd.');
    }

    public function importUpload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt,xlsx,xls|max:10240',
        ]);

        try {
            $path = $request->file('file')->store('imports');
            $headersData = (new \Maatwebsite\Excel\HeadingRowImport)->toArray(storage_path('app/private/' . $path));
            $headers = $headersData[0][0] ?? [];

            return Inertia::render('sap-objects/import-mapping', [
                'filePath' => $path,
                'headers' => $headers,
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Fout bij het inlezen van bestand: ' . $e->getMessage());
        }
    }

    public function importProcess(Request $request)
    {
        $request->validate([
            'file_path' => 'required|string',
            'mapping' => 'required|array',
            'mapping.object_id' => 'required|string',
        ]);

        try {
            $import = new SapObjectsImport($request->mapping);
            Excel::import($import, storage_path('app/private/' . $request->file_path));

            \Illuminate\Support\Facades\Storage::delete($request->file_path);

            $importedCount = $import->getImportedCount();
            $skippedCount = $import->getSkippedCount();

            $message = "Succesvol {$importedCount} objecten geïmporteerd.";
            if ($skippedCount > 0) {
                $message .= " ({$skippedCount} overgeslagen ivm ontbrekende data).";
            }

            return redirect()->route('sap-objects.index')->with('success', $message);
        } catch (\Exception $e) {
            return redirect()->route('sap-objects.index')->with('error', 'Fout bij het importeren: ' . $e->getMessage());
        }
    }
}
