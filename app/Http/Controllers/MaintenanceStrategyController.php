<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceStrategy;
use App\Models\MaintenanceStrategyPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\StrategyPackagesImport;

class MaintenanceStrategyController extends Controller
{
    public function index(Request $request)
    {
        $activeStrategyId = $request->query('strategy_id');
        $strategies = MaintenanceStrategy::orderBy('name')->get();

        $activeStrategy = null;
        if ($activeStrategyId) {
            $activeStrategy = MaintenanceStrategy::with('packages')->find($activeStrategyId);
        }

        return Inertia::render('strategies/index', [
            'strategies' => $strategies,
            'activeStrategy' => $activeStrategy,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:maintenance_strategies,name',
            'description' => 'nullable|string',
        ]);

        $strategy = MaintenanceStrategy::create($validated);
        return redirect()->route('strategies.index', ['strategy_id' => $strategy->id])->with('success', 'Strategie toegevoegd.');
    }

    public function update(Request $request, MaintenanceStrategy $strategy)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:maintenance_strategies,name,' . $strategy->id,
            'description' => 'nullable|string',
        ]);

        $strategy->update($validated);
        return back()->with('success', 'Strategie gewijzigd.');
    }

    public function destroy(MaintenanceStrategy $strategy)
    {
        $strategy->delete();
        return redirect()->route('strategies.index')->with('success', 'Strategie verwijderd.');
    }

    // Package Management
    public function storePackage(Request $request, MaintenanceStrategy $strategy)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'cycle_value' => 'required|integer|min:1',
            'cycle_unit' => 'required|string',
            'hierarchy_short_text' => 'nullable|integer',
        ]);

        $strategy->packages()->create($validated);
        return back()->with('success', 'Frequente (Package) toegevoegd aan strategie.');
    }

    public function updatePackage(Request $request, MaintenanceStrategyPackage $package)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'cycle_value' => 'required|integer|min:1',
            'cycle_unit' => 'required|string',
            'hierarchy_short_text' => 'nullable|integer',
        ]);

        $package->update($validated);
        return back()->with('success', 'Frequentie gewijzigd.');
    }

    public function destroyPackage(MaintenanceStrategyPackage $package)
    {
        $package->delete();
        return back()->with('success', 'Frequentie verwijderd.');
    }

    // Import Upload & Process
    public function importUpload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt,xlsx,xls|max:10240',
            'strategy_id' => 'required|exists:maintenance_strategies,id',
        ]);

        try {
            $path = $request->file('file')->store('imports');
            $headersData = (new \Maatwebsite\Excel\HeadingRowImport)->toArray(storage_path('app/private/' . $path));
            $headers = $headersData[0][0] ?? [];

            return Inertia::render('strategies/import-mapping', [
                'filePath' => $path,
                'headers' => $headers,
                'strategyId' => $request->strategy_id,
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Fout bij inlezen bestand: ' . $e->getMessage());
        }
    }

    public function importProcess(Request $request)
    {
        $request->validate([
            'file_path' => 'required|string',
            'strategy_id' => 'required|exists:maintenance_strategies,id',
            'mapping' => 'required|array',
            'mapping.name' => 'required|string',
            'mapping.cycle_value' => 'required|string',
            'mapping.cycle_unit' => 'required|string',
        ]);

        try {
            $import = new StrategyPackagesImport($request->mapping, $request->strategy_id);
            Excel::import($import, storage_path('app/private/' . $request->file_path));
            \Illuminate\Support\Facades\Storage::delete($request->file_path);

            $imported = $import->getImportedCount();
            $skipped = $import->getSkippedCount();

            $msg = "Succesvol {$imported} frequenties geïmporteerd.";
            if ($skipped > 0)
                $msg .= " ({$skipped} overgeslagen).";

            return redirect()->route('strategies.index', ['strategy_id' => $request->strategy_id])->with('success', $msg);
        } catch (\Exception $e) {
            return redirect()->route('strategies.index', ['strategy_id' => $request->strategy_id])->with('error', 'Fout bij importeren: ' . $e->getMessage());
        }
    }
}
