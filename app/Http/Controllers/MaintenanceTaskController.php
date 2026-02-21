<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceTask;
use App\Models\MasterData;
use App\Imports\MaintenanceTasksImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaintenanceTaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = MaintenanceTask::with(['plan', 'items'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('maintenance-tasks/index', [
            'tasks' => $tasks,
        ]);
    }

    public function create()
    {
        $frequencyUnits = MasterData::where('category', 'frequency_unit')->where('is_active', true)->orderBy('sort_order')->get();
        return Inertia::render('maintenance-tasks/create', [
            'frequencyUnits' => $frequencyUnits
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'frequency_unit' => 'required|string',
            'frequency_value' => 'required|integer',
            'object_type' => 'required|in:equipment,floc', // simple validation for step 1
            'object_id' => 'required|string',
        ]);

        // Create a standalone plan first
        $plan = \App\Models\MaintenancePlan::create([
            'name' => $validated['name'],
            'frequency_unit' => $validated['frequency_unit'],
            'frequency_value' => $validated['frequency_value'],
        ]);

        $task = $request->user()->maintenanceTasks()->create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'status' => 'draft',
            'maintenance_plan_id' => $plan->id,
        ]);

        // Create initial item
        $task->items()->create([
            'object_type' => $validated['object_type'],
            'object_id' => $validated['object_id'],
        ]);

        return redirect()->route('maintenance-tasks.edit', $task)
            ->with('success', 'Preventieve onderhoudstaak aangemaakt.');
    }

    public function edit(MaintenanceTask $maintenanceTask)
    {
        if ($maintenanceTask->user_id !== auth()->id()) {
            abort(403);
        }
        return redirect()->route('maintenance-tasks.plan', $maintenanceTask);
    }

    public function editPlan(MaintenanceTask $maintenanceTask)
    {
        if ($maintenanceTask->user_id !== auth()->id()) {
            abort(403);
        }

        $maintenanceTask->load(['plan', 'items']);

        $masterData = [
            'strategies' => \App\Models\MaintenanceStrategy::with('packages')->orderBy('name')->get(),
            'frequencyUnits' => MasterData::where('category', 'frequency_unit')->where('is_active', true)->orderBy('sort_order')->get(),
            'orderTypes' => MasterData::where('category', 'order_type')->where('is_active', true)->orderBy('sort_order')->get(),
            'disciplines' => MasterData::where('category', 'discipline')->where('is_active', true)->orderBy('sort_order')->get(),
            // Defaults: the key of the default item for each category (null if none)
            'defaults' => [
                'order_type' => MasterData::where('category', 'order_type')->where('is_default', true)->value('key'),
                'frequency_unit' => MasterData::where('category', 'frequency_unit')->where('is_default', true)->value('key'),
                'discipline' => MasterData::where('category', 'discipline')->where('is_default', true)->value('key'),
            ],
        ];

        return Inertia::render('maintenance-tasks/plan', [
            'task' => $maintenanceTask,
            'masterData' => $masterData,
        ]);
    }

    public function editItems(MaintenanceTask $maintenanceTask)
    {
        if ($maintenanceTask->user_id !== auth()->id()) {
            abort(403);
        }

        $maintenanceTask->load('items');

        $masterData = [
            'objects' => \App\Models\SapObject::orderBy('object_id')->get(),
            'plannerGroups' => MasterData::where('category', 'planner_group')->where('is_active', true)->orderBy('sort_order')->get(),
            'workCenters' => MasterData::where('category', 'main_work_center')->where('is_active', true)->orderBy('sort_order')->get(),
            'orderTypes' => MasterData::where('category', 'order_type')->where('is_active', true)->orderBy('sort_order')->get(),
        ];

        return Inertia::render('maintenance-tasks/items', [
            'task' => $maintenanceTask,
            'masterData' => $masterData,
        ]);
    }

    public function editTaskList(MaintenanceTask $maintenanceTask)
    {
        if ($maintenanceTask->user_id !== auth()->id()) {
            abort(403);
        }

        $maintenanceTask->load(['taskList.operations.materials', 'taskList.operations.documents']);

        $masterData = [
            'strategies' => \App\Models\MaintenanceStrategy::with('packages')->orderBy('name')->get(),
            'controlKeys' => MasterData::where('category', 'control_key')->where('is_active', true)->orderBy('sort_order')->get(),
            'workCenters' => MasterData::where('category', 'main_work_center')->where('is_active', true)->orderBy('sort_order')->get(),
            'plants' => MasterData::where('category', 'plant')->where('is_active', true)->orderBy('sort_order')->get(),
            'articles' => \App\Models\Article::orderBy('article_number')->get(),
        ];

        return Inertia::render('maintenance-tasks/task-list', [
            'task' => $maintenanceTask,
            'masterData' => $masterData,
        ]);
    }

    public function update(Request $request, MaintenanceTask $maintenanceTask)
    {
        if ($maintenanceTask->user_id !== auth()->id()) {
            abort(403);
        }

        // This method will be used to save the state from the wizard
        // We'll accept a partial update of the task and its related models

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:draft,ready,active',
            // ... validation for nested data could be complex, for MVP we trust the frontend state mostly
            // but in a real app we'd rigorously validate everything
        ]);

        $maintenanceTask->update($request->only(['name', 'description', 'status', 'is_sap_ready']));

        if ($request->has('plan')) {
            $planData = $request->input('plan');
            if ($maintenanceTask->maintenance_plan_id) {
                // Update the existing linked plan
                \App\Models\MaintenancePlan::where('id', $maintenanceTask->maintenance_plan_id)->update($planData);
            } else {
                // Create a new plan and link it
                $plan = \App\Models\MaintenancePlan::create(array_merge(['name' => $maintenanceTask->name], $planData));
                $maintenanceTask->update(['maintenance_plan_id' => $plan->id]);
            }
        }

        if ($request->has('items') && is_array($request->items)) {
            // Delete existing ids not in the request
            $itemIds = collect($request->items)->pluck('id')->filter()->toArray();
            $maintenanceTask->items()->whereNotIn('id', $itemIds)->delete();

            foreach ($request->items as $itemData) {
                $maintenanceTask->items()->updateOrCreate(
                    ['id' => $itemData['id'] ?? null],
                    $itemData
                );
            }
        }

        if ($request->has('task_list') && is_array($request->task_list)) {
            $taskListData = $request->input('task_list');

            $taskList = $maintenanceTask->taskList()->updateOrCreate(
                ['maintenance_task_id' => $maintenanceTask->id],
                collect($taskListData)->except(['operations'])->toArray()
            );

            if (isset($taskListData['operations']) && is_array($taskListData['operations'])) {
                $opIds = collect($taskListData['operations'])->pluck('id')->filter()->toArray();
                $taskList->operations()->whereNotIn('id', $opIds)->delete();

                foreach ($taskListData['operations'] as $opData) {
                    $opPayload = collect($opData)->except(['materials'])->toArray();
                    $opPayload['short_text'] = $opPayload['short_text'] ?? 'Nieuwe bewerking';

                    $op = $taskList->operations()->updateOrCreate(
                        ['id' => $opData['id'] ?? null],
                        $opPayload
                    );

                    if (isset($opData['materials']) && is_array($opData['materials'])) {
                        $matIds = collect($opData['materials'])->pluck('id')->filter()->toArray();
                        $op->materials()->whereNotIn('id', $matIds)->delete();
                        foreach ($opData['materials'] as $matData) {
                            $op->materials()->updateOrCreate(
                                ['id' => $matData['id'] ?? null],
                                $matData
                            );
                        }
                    }
                }
            }
        }

        return back()->with('success', 'Wijzigingen opgeslagen.');
    }

    public function importUpload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt,xlsx,xls|max:10240',
        ]);

        try {
            $path = $request->file('file')->store('imports');

            // Extract the headers
            $headersData = (new \Maatwebsite\Excel\HeadingRowImport)->toArray(storage_path('app/private/' . $path));
            $headers = $headersData[0][0] ?? [];

            return Inertia::render('maintenance-tasks/import-mapping', [
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
            'mapping.name' => 'required|string',
            'mapping.frequency_unit' => 'required|string',
            'mapping.frequency_value' => 'required|string',
            'mapping.object_type' => 'required|string',
            'mapping.object_id' => 'required|string',
        ]);

        try {
            // First we read all rows to validate assets
            $rows = Excel::toArray(new \stdClass(), storage_path('app/private/' . $request->file_path));
            $data = $rows[0] ?? [];

            $missingAssets = [];
            $assetIdsToCheck = [];

            foreach ($data as $row) {
                $mappedObjId = $row[$request->mapping['object_id']] ?? null;
                if ($mappedObjId) {
                    $assetIdsToCheck[] = trim($mappedObjId);
                }
            }

            $assetIdsToCheck = array_unique($assetIdsToCheck);

            // Fetch existing assets
            $existingAssets = \App\Models\SapObject::whereIn('object_id', $assetIdsToCheck)->pluck('object_id')->toArray();

            // Find missing
            $missingIds = array_diff($assetIdsToCheck, $existingAssets);

            if (count($missingIds) > 0) {
                // Determine their types from the import if possible, or just default
                foreach ($missingIds as $id) {
                    $type = 'equipment'; // default
                    foreach ($data as $row) {
                        if (($row[$request->mapping['object_id']] ?? null) == $id) {
                            $type = strtolower(trim($row[$request->mapping['object_type']] ?? 'equipment'));
                            break;
                        }
                    }
                    $missingAssets[] = [
                        'object_id' => $id,
                        'object_type' => $type,
                        'name' => 'Auto-imported ' . $id, // default name
                    ];
                }

                // Redirect to resolution screen
                return Inertia::render('maintenance-tasks/import-resolve', [
                    'filePath' => $request->file_path,
                    'mapping' => $request->mapping,
                    'missingAssets' => $missingAssets,
                ]);
            }

            // If no missing assets, proceed to execute directly
            return $this->executeImport($request->file_path, $request->mapping, []);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Storage::delete($request->file_path);
            return redirect()->route('maintenance-tasks.index')->with('error', 'Fout bij het importeren: ' . $e->getMessage());
        }
    }

    public function importExecute(Request $request)
    {
        $request->validate([
            'file_path' => 'required|string',
            'mapping' => 'required|array',
            'resolved_assets' => 'required|array',
        ]);

        return $this->executeImport($request->file_path, $request->mapping, $request->resolved_assets);
    }

    private function executeImport(string $filePath, array $mapping, array $resolvedAssets)
    {
        try {
            // Create the resolved assets if they are marked to be created
            foreach ($resolvedAssets as $asset) {
                if (($asset['action'] ?? '') === 'create') {
                    \App\Models\SapObject::firstOrCreate(
                        ['object_id' => $asset['object_id']],
                        [
                            'type' => $asset['object_type'],
                            'name' => $asset['name'] ?? $asset['object_id'],
                        ]
                    );
                }
            }

            // The import class needs to know which ones to skip
            $skipAssetIds = collect($resolvedAssets)
                ->filter(fn($a) => ($a['action'] ?? '') === 'skip')
                ->pluck('object_id')
                ->toArray();

            $import = new \App\Imports\MaintenanceTasksImport($mapping, $skipAssetIds);
            Excel::import($import, storage_path('app/private/' . $filePath));

            // Cleanup
            \Illuminate\Support\Facades\Storage::delete($filePath);

            $importedCount = $import->getImportedCount();
            $skippedCount = $import->getSkippedCount();

            $message = "Succesvol {$importedCount} taken geïmporteerd.";
            if ($skippedCount > 0) {
                $message .= " ({$skippedCount} overgeslagen ivm ontbrekende/overgeslagen data).";
            }

            return redirect()->route('maintenance-tasks.index')->with('success', $message);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Storage::delete($filePath);
            return redirect()->route('maintenance-tasks.index')->with('error', 'Fout bij het uitvoeren van import: ' . $e->getMessage());
        }
    }

    public function destroy(MaintenanceTask $maintenanceTask)
    {
        if ($maintenanceTask->user_id !== auth()->id()) {
            abort(403);
        }

        $maintenanceTask->delete();

        return redirect()->route('maintenance-tasks.index')
            ->with('success', 'Taak verwijderd.');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:maintenance_tasks,id',
        ]);

        $query = MaintenanceTask::whereIn('id', $request->ids)
            ->where('user_id', auth()->id());

        $count = $query->count();
        $query->delete();

        return redirect()->route('maintenance-tasks.index')
            ->with('success', "{$count} taken verwijderd.");
    }

    public function bulkStatus(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:maintenance_tasks,id',
            'status' => 'required|in:draft,ready,active',
        ]);

        $query = MaintenanceTask::whereIn('id', $request->ids)
            ->where('user_id', auth()->id());

        $count = $query->count();
        $query->update(['status' => $request->status]);

        return redirect()->route('maintenance-tasks.index')
            ->with('success', "Status van {$count} taken gewijzigd naar {$request->status}.");
    }

    public function mergeTasks(Request $request)
    {
        $request->validate([
            'ids' => 'required|array|min:2',
            'ids.*' => 'integer|exists:maintenance_tasks,id',
            'name' => 'required|string|max:255',
        ]);

        $tasks = MaintenanceTask::with(['plan'])->whereIn('id', $request->ids)->where('user_id', auth()->id())->get();

        if ($tasks->count() < 2) {
            return back()->with('error', 'Selecteer minimaal 2 taken om samen te voegen.');
        }

        // Use the first task's plan data as the base for the shared plan frequency settings
        $basePlan = $tasks->first()->plan;

        // Create a single shared Maintenance Plan
        $sharedPlan = \App\Models\MaintenancePlan::create([
            'name' => $request->name,
            'frequency_unit' => $basePlan?->frequency_unit,
            'frequency_value' => $basePlan?->frequency_value,
            'call_horizon_unit' => $basePlan?->call_horizon_unit,
            'call_horizon_value' => $basePlan?->call_horizon_value,
            'discipline' => $basePlan?->discipline,
        ]);

        // Link all selected tasks to the new shared plan (source tasks remain intact!)
        foreach ($tasks as $task) {
            $oldPlanId = $task->maintenance_plan_id;

            // Point this task at the new shared plan
            $task->update(['maintenance_plan_id' => $sharedPlan->id]);

            // Clean up the old solo plan if it is now orphaned
            if ($oldPlanId && $oldPlanId !== $sharedPlan->id) {
                $stillUsed = MaintenanceTask::where('maintenance_plan_id', $oldPlanId)->exists();
                if (!$stillUsed) {
                    \App\Models\MaintenancePlan::destroy($oldPlanId);
                }
            }
        }

        return redirect()->route('maintenance-tasks.index')
            ->with('success', "Taken succesvol gekoppeld aan plan '{$request->name}'.");
    }
}
