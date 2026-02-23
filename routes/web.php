<?php

use App\Http\Controllers\AI\ChatController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\SapObjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// AI Chat Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('ai-chat', function () {
        return Inertia::render('ai-chat');
    })->name('ai-chat');

    Route::post('api/chat', [ChatController::class, 'chat'])->name('api.chat');
});

// Projects CRUD Routes (Removed)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('maintenance-tasks/bulk-delete', [\App\Http\Controllers\MaintenanceTaskController::class, 'bulkDelete'])->name('maintenance-tasks.bulk-delete');
    Route::post('maintenance-tasks/bulk-status', [\App\Http\Controllers\MaintenanceTaskController::class, 'bulkStatus'])->name('maintenance-tasks.bulk-status');
    Route::post('maintenance-tasks/merge', [\App\Http\Controllers\MaintenanceTaskController::class, 'mergeTasks'])->name('maintenance-tasks.merge');

    // PM Generator detail tabs
    Route::get('maintenance-tasks/{maintenance_task}/plan', [\App\Http\Controllers\MaintenanceTaskController::class, 'editPlan'])->name('maintenance-tasks.plan');
    Route::get('maintenance-tasks/{maintenance_task}/items', [\App\Http\Controllers\MaintenanceTaskController::class, 'editItems'])->name('maintenance-tasks.items');
    Route::get('maintenance-tasks/{maintenance_task}/task-list', [\App\Http\Controllers\MaintenanceTaskController::class, 'editTaskList'])->name('maintenance-tasks.task-list');
    Route::post('maintenance-tasks/import/upload', [\App\Http\Controllers\MaintenanceTaskController::class, 'importUpload'])->name('maintenance-tasks.import.upload');
    Route::post('maintenance-tasks/import/process', [\App\Http\Controllers\MaintenanceTaskController::class, 'importProcess'])->name('maintenance-tasks.import.process');
    Route::post('maintenance-tasks/import/execute', [\App\Http\Controllers\MaintenanceTaskController::class, 'importExecute'])->name('maintenance-tasks.import.execute');

    Route::post('master-data/import/upload', [\App\Http\Controllers\MasterDataController::class, 'importUpload'])->name('master-data.import.upload');
    Route::post('master-data/import/process', [\App\Http\Controllers\MasterDataController::class, 'importProcess'])->name('master-data.import.process');

    Route::post('articles/import/upload', [ArticleController::class, 'importUpload'])->name('articles.import.upload');
    Route::post('articles/import/process', [ArticleController::class, 'importProcess'])->name('articles.import.process');

    Route::post('sap-objects/import/upload', [SapObjectController::class, 'importUpload'])->name('sap-objects.import.upload');
    Route::post('sap-objects/import/process', [SapObjectController::class, 'importProcess'])->name('sap-objects.import.process');

    Route::post('strategies/import/upload', [\App\Http\Controllers\MaintenanceStrategyController::class, 'importUpload'])->name('strategies.import.upload');
    Route::post('strategies/import/process', [\App\Http\Controllers\MaintenanceStrategyController::class, 'importProcess'])->name('strategies.import.process');
    Route::post('strategies/{strategy}/packages', [\App\Http\Controllers\MaintenanceStrategyController::class, 'storePackage'])->name('strategies.packages.store');
    Route::put('strategies/packages/{package}', [\App\Http\Controllers\MaintenanceStrategyController::class, 'updatePackage'])->name('strategies.packages.update');
    Route::delete('strategies/packages/{package}', [\App\Http\Controllers\MaintenanceStrategyController::class, 'destroyPackage'])->name('strategies.packages.destroy');

    Route::resource('maintenance-tasks', \App\Http\Controllers\MaintenanceTaskController::class);
    Route::resource('master-data', \App\Http\Controllers\MasterDataController::class)
        ->parameters(['master-data' => 'masterData'])
        ->except(['create', 'show', 'edit']);
    Route::resource('articles', ArticleController::class)->except(['create', 'show', 'edit']);
    Route::resource('sap-objects', SapObjectController::class)->except(['create', 'show', 'edit']);
    Route::resource('strategies', \App\Http\Controllers\MaintenanceStrategyController::class)->except(['create', 'show', 'edit']);
    Route::resource('template-task-lists', \App\Http\Controllers\TemplateTaskListController::class);
    Route::post('template-task-lists/save-from-task/{maintenanceTask}', [\App\Http\Controllers\TemplateTaskListController::class, 'saveFromTask'])->name('template-task-lists.save-from-task');
});

// Socialite OAuth Routes
Route::middleware('guest')->group(function () {
    Route::get('auth/{provider}/redirect', [SocialiteController::class, 'redirect'])
        ->name('socialite.redirect');
    Route::get('auth/{provider}/callback', [SocialiteController::class, 'callback'])
        ->name('socialite.callback');
});

require __DIR__ . '/settings.php';
