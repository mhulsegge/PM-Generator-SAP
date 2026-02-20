<?php

use App\Http\Controllers\AI\ChatController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// AI Chat Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('ai-chat', function () {
        return Inertia::render('ai-chat');
    })->name('ai-chat');

    Route::post('api/chat', [ChatController::class, 'chat'])->name('api.chat');
});

// Projects CRUD Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('projects', ProjectController::class)->except(['show']);
    Route::resource('maintenance-tasks', \App\Http\Controllers\MaintenanceTaskController::class);
    Route::resource('master-data', \App\Http\Controllers\MasterDataController::class)->except(['create', 'show', 'edit']);
});

// Socialite OAuth Routes
Route::middleware('guest')->group(function () {
    Route::get('auth/{provider}/redirect', [SocialiteController::class, 'redirect'])
        ->name('socialite.redirect');
    Route::get('auth/{provider}/callback', [SocialiteController::class, 'callback'])
        ->name('socialite.callback');
});

require __DIR__ . '/settings.php';
