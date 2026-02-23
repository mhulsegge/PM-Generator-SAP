<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TemplateTaskList;
use App\Models\TemplateTaskListOperation;
use App\Models\MaintenanceTask;
use App\Models\MasterData;
use App\Models\MaintenanceStrategy;
use App\Models\Article;
use Inertia\Inertia;

class TemplateTaskListController extends Controller
{
    public function index(Request $request)
    {
        $templates = TemplateTaskList::withCount('operations')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('template-tasklists/index', [
            'templates' => $templates
        ]);
    }

    public function create()
    {
        $masterData = [
            'strategies' => MaintenanceStrategy::with('packages')->orderBy('name')->get(),
            'controlKeys' => MasterData::where('category', 'control_key')->where('is_active', true)->orderBy('sort_order')->get(),
            'workCenters' => MasterData::where('category', 'main_work_center')->where('is_active', true)->orderBy('sort_order')->get(),
            'plants' => MasterData::where('category', 'plant')->where('is_active', true)->orderBy('sort_order')->get(),
            'articles' => Article::orderBy('article_number')->get(),
        ];

        return Inertia::render('template-tasklists/edit', [
            'template' => new TemplateTaskList([
                'maintenance_strategy_id' => null,
            ]),
            'masterData' => $masterData,
            'isCreating' => true,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'work_center' => 'nullable|string',
            'plant' => 'nullable|string',
            'general_instructions' => 'nullable|string',
            'usage' => 'nullable|string',
            'maintenance_strategy_id' => 'nullable|integer|exists:maintenance_strategies,id',
        ]);

        $template = TemplateTaskList::create($validated);

        if ($request->has('operations') && is_array($request->operations)) {
            foreach ($request->operations as $opData) {
                $opPayload = collect($opData)->only([
                    'operation_number',
                    'control_key',
                    'short_text',
                    'long_text',
                    'work_center',
                    'duration_normal',
                    'duration_unit',
                    'number_of_people',
                    'maintenance_strategy_package_id'
                ])->toArray();

                $opPayload['short_text'] = $opPayload['short_text'] ?? 'Nieuwe bewerking';
                $template->operations()->create($opPayload);
            }
        }

        return redirect()->route('template-task-lists.index')
            ->with('success', 'Sjabloon succesvol aangemaakt.');
    }

    public function edit(TemplateTaskList $templateTaskList)
    {
        $templateTaskList->load('operations');

        $masterData = [
            'strategies' => MaintenanceStrategy::with('packages')->orderBy('name')->get(),
            'controlKeys' => MasterData::where('category', 'control_key')->where('is_active', true)->orderBy('sort_order')->get(),
            'workCenters' => MasterData::where('category', 'main_work_center')->where('is_active', true)->orderBy('sort_order')->get(),
            'plants' => MasterData::where('category', 'plant')->where('is_active', true)->orderBy('sort_order')->get(),
            'articles' => Article::orderBy('article_number')->get(),
        ];

        return Inertia::render('template-tasklists/edit', [
            'template' => $templateTaskList,
            'masterData' => $masterData,
            'isCreating' => false,
        ]);
    }

    public function update(Request $request, TemplateTaskList $templateTaskList)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'work_center' => 'nullable|string',
            'plant' => 'nullable|string',
            'general_instructions' => 'nullable|string',
            'usage' => 'nullable|string',
            'maintenance_strategy_id' => 'nullable|integer|exists:maintenance_strategies,id',
        ]);

        $templateTaskList->update($validated);

        if ($request->has('operations') && is_array($request->operations)) {
            $opIds = collect($request->operations)->pluck('id')->filter()->toArray();
            $templateTaskList->operations()->whereNotIn('id', $opIds)->delete();

            foreach ($request->operations as $opData) {
                $opPayload = collect($opData)->only([
                    'operation_number',
                    'control_key',
                    'short_text',
                    'long_text',
                    'work_center',
                    'duration_normal',
                    'duration_unit',
                    'number_of_people',
                    'maintenance_strategy_package_id'
                ])->toArray();

                $opPayload['short_text'] = $opPayload['short_text'] ?? 'Nieuwe bewerking';

                $templateTaskList->operations()->updateOrCreate(
                    ['id' => $opData['id'] ?? null],
                    $opPayload
                );
            }
        } else {
            $templateTaskList->operations()->delete();
        }

        return redirect()->route('template-task-lists.index')
            ->with('success', 'Sjabloon succesvol bijgewerkt.');
    }

    public function destroy(TemplateTaskList $templateTaskList)
    {
        $templateTaskList->delete();

        return redirect()->route('template-task-lists.index')
            ->with('success', 'Sjabloon verwijderd.');
    }

    public function saveFromTask(Request $request, MaintenanceTask $maintenanceTask)
    {
        if ($maintenanceTask->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'template_name' => 'required|string|max:255',
        ]);

        $taskList = $maintenanceTask->taskList;

        if (!$taskList) {
            return back()->with('error', 'Deze taak heeft nog geen taaklijst.');
        }

        $template = TemplateTaskList::create([
            'name' => $request->template_name,
            'description' => $taskList->description,
            'work_center' => $taskList->work_center,
            'plant' => $taskList->plant,
            'general_instructions' => $taskList->general_instructions,
            'usage' => $taskList->usage,
            'maintenance_strategy_id' => $taskList->maintenance_strategy_id,
        ]);

        foreach ($taskList->operations as $op) {
            $newOp = $template->operations()->create([
                'operation_number' => $op->operation_number,
                'control_key' => $op->control_key,
                'short_text' => $op->short_text,
                'long_text' => $op->long_text,
                'work_center' => $op->work_center,
                'duration_normal' => $op->duration_normal,
                'duration_unit' => $op->duration_unit,
                'number_of_people' => $op->number_of_people,
                'maintenance_strategy_package_id' => $op->maintenance_strategy_package_id,
            ]);

            foreach ($op->materials as $mat) {
                $newOp->materials()->create([
                    'material_number' => $mat->material_number,
                    'quantity' => $mat->quantity,
                    'unit' => $mat->unit,
                ]);
            }
        }

        return back()->with('success', 'Taaklijst is succesvol opgeslagen als sjabloon.');
    }
}
