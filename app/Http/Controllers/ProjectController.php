<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of the projects.
     */
    public function index(Request $request): Response
    {
        $query = Project::query()
            ->where('user_id', $request->user()->id);

        // Global search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Column text filter (name)
        if ($filterName = $request->input('filter_name')) {
            $query->where('name', 'like', "%{$filterName}%");
        }

        // Column select filters (status, priority)
        if ($filterStatus = $request->input('filter_status')) {
            $query->where('status', $filterStatus);
        }

        if ($filterPriority = $request->input('filter_priority')) {
            $query->where('priority', $filterPriority);
        }

        // Budget range filter
        if ($budgetMin = $request->input('budget_min')) {
            $query->where('budget', '>=', $budgetMin);
        }
        if ($budgetMax = $request->input('budget_max')) {
            $query->where('budget', '<=', $budgetMax);
        }

        // Start date range filter
        if ($startDateFrom = $request->input('start_date_from')) {
            $query->where('start_date', '>=', $startDateFrom);
        }
        if ($startDateTo = $request->input('start_date_to')) {
            $query->where('start_date', '<=', $startDateTo);
        }

        // Created at date range filter
        if ($createdAtFrom = $request->input('created_at_from')) {
            $query->whereDate('created_at', '>=', $createdAtFrom);
        }
        if ($createdAtTo = $request->input('created_at_to')) {
            $query->whereDate('created_at', '<=', $createdAtTo);
        }

        // Sorting
        $sortBy = $request->input('sort_by');
        $sortDirection = $request->input('sort_direction', 'desc');

        if ($sortBy) {
            $query->orderBy($sortBy, $sortDirection);
        } else {
            $query->latest();
        }

        $projects = $query->paginate($request->input('per_page', 10))
            ->withQueryString();

        return Inertia::render('projects/index', [
            'projects' => $projects,
            'filters' => [
                'search' => $request->input('search', ''),
                'filter_name' => $request->input('filter_name', ''),
                'filter_status' => $request->input('filter_status', ''),
                'filter_priority' => $request->input('filter_priority', ''),
                'budget_min' => $request->input('budget_min', ''),
                'budget_max' => $request->input('budget_max', ''),
                'start_date_from' => $request->input('start_date_from', ''),
                'start_date_to' => $request->input('start_date_to', ''),
                'created_at_from' => $request->input('created_at_from', ''),
                'created_at_to' => $request->input('created_at_to', ''),
                'sort_by' => $request->input('sort_by', ''),
                'sort_direction' => $request->input('sort_direction', 'desc'),
                'per_page' => (int) $request->input('per_page', 10),
            ],
            'statuses' => [
                ['value' => 'concept', 'label' => 'Concept'],
                ['value' => 'actief', 'label' => 'Actief'],
                ['value' => 'voltooid', 'label' => 'Voltooid'],
                ['value' => 'geannuleerd', 'label' => 'Geannuleerd'],
            ],
            'priorities' => [
                ['value' => 'laag', 'label' => 'Laag'],
                ['value' => 'normaal', 'label' => 'Normaal'],
                ['value' => 'hoog', 'label' => 'Hoog'],
                ['value' => 'urgent', 'label' => 'Urgent'],
            ],
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create(): Response
    {
        return Inertia::render('projects/create', [
            'statuses' => [
                ['value' => 'concept', 'label' => 'Concept'],
                ['value' => 'actief', 'label' => 'Actief'],
                ['value' => 'voltooid', 'label' => 'Voltooid'],
                ['value' => 'geannuleerd', 'label' => 'Geannuleerd'],
            ],
            'priorities' => [
                ['value' => 'laag', 'label' => 'Laag'],
                ['value' => 'normaal', 'label' => 'Normaal'],
                ['value' => 'hoog', 'label' => 'Hoog'],
                ['value' => 'urgent', 'label' => 'Urgent'],
            ],
        ]);
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:concept,actief,voltooid,geannuleerd',
            'priority' => 'required|in:laag,normaal,hoog,urgent',
            'budget' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $request->user()->projects()->create($validated);

        return redirect('/projects')
            ->with('success', 'Project succesvol aangemaakt.');
    }

    /**
     * Show the form for editing the specified project.
     */
    public function edit(Project $project): Response
    {
        $this->authorize('update', $project);

        return Inertia::render('projects/edit', [
            'project' => $project,
            'statuses' => [
                ['value' => 'concept', 'label' => 'Concept'],
                ['value' => 'actief', 'label' => 'Actief'],
                ['value' => 'voltooid', 'label' => 'Voltooid'],
                ['value' => 'geannuleerd', 'label' => 'Geannuleerd'],
            ],
            'priorities' => [
                ['value' => 'laag', 'label' => 'Laag'],
                ['value' => 'normaal', 'label' => 'Normaal'],
                ['value' => 'hoog', 'label' => 'Hoog'],
                ['value' => 'urgent', 'label' => 'Urgent'],
            ],
        ]);
    }

    /**
     * Update the specified project in storage.
     */
    public function update(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:concept,actief,voltooid,geannuleerd',
            'priority' => 'required|in:laag,normaal,hoog,urgent',
            'budget' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $project->update($validated);

        return redirect('/projects')
            ->with('success', 'Project succesvol bijgewerkt.');
    }

    /**
     * Remove the specified project from storage.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        $project->delete();

        return redirect('/projects')
            ->with('success', 'Project succesvol verwijderd.');
    }
}
