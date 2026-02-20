<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceTask;
use App\Models\MasterData;
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

        $task = $request->user()->maintenanceTasks()->create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'status' => 'draft',
        ]);

        // Create initial plan
        $task->plan()->create([
            'frequency_unit' => $validated['frequency_unit'],
            'frequency_value' => $validated['frequency_value'],
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
        // Ensure user owns the task
        if ($maintenanceTask->user_id !== auth()->id()) {
            abort(403);
        }

        $maintenanceTask->load(['plan', 'items', 'taskList.operations.materials', 'taskList.operations.documents']);

        $masterData = [
            'disciplines' => MasterData::where('category', 'discipline')->where('is_active', true)->orderBy('sort_order')->get(),
            'strategies' => MasterData::where('category', 'strategy_package')->where('is_active', true)->orderBy('sort_order')->get(),
            'frequencyUnits' => MasterData::where('category', 'frequency_unit')->where('is_active', true)->orderBy('sort_order')->get(),
        ];

        return Inertia::render('maintenance-tasks/edit', [
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
            $maintenanceTask->plan()->updateOrCreate(
                ['maintenance_task_id' => $maintenanceTask->id],
                $request->input('plan')
            );
        }

        // Handling items, task list, operations is more complex and might require specialized methods
        // or a more robust service. For MVP, we'll keep it simple.

        return back()->with('success', 'Wijzigingen opgeslagen.');
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
}
