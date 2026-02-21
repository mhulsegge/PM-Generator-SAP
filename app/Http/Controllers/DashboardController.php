<?php

namespace App\Http\Controllers;

use App\Models\MaintenancePlan;
use App\Models\MaintenanceTask;
use App\Models\MasterData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Totals
        $totalTasks = MaintenanceTask::count();
        $totalPlans = MaintenancePlan::count();
        $totalMasterData = MasterData::count();

        // Tasks per status
        $tasksByStatus = MaintenanceTask::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->orderBy('count', 'desc')
            ->get();

        // Recent tasks
        $recentTasks = MaintenanceTask::with('plan')
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get();

        // Master Data stats (Count per category is interesting but we'll stick to full totals for now to keep it clean)
        $masterDataByCategory = MasterData::select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalTasks' => $totalTasks,
                'totalPlans' => $totalPlans,
                'totalMasterData' => $totalMasterData,
            ],
            'tasksByStatus' => $tasksByStatus,
            'recentTasks' => $recentTasks,
            'masterDataByCategory' => $masterDataByCategory,
        ]);
    }
}
