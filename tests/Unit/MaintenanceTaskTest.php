<?php

use App\Models\MaintenanceTask;
use App\Models\User;

test('it has fillable attributes', function () {
    $task = new MaintenanceTask([
        'name' => 'Test Task',
        'status' => 'draft',
    ]);

    expect($task->name)->toBe('Test Task')
        ->and($task->status)->toBe('draft');
});

test('it belongs to a user', function () {
    $task = new MaintenanceTask();
    expect($task->user())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);
});

test('it has one plan', function () {
    $task = new MaintenanceTask();
    expect($task->plan())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\HasOne::class);
});

test('it has many items', function () {
    $task = new MaintenanceTask();
    expect($task->items())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class);
});

test('it has one task list', function () {
    $task = new MaintenanceTask();
    expect($task->taskList())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\HasOne::class);
});
