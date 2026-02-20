<?php

use App\Models\User;
use App\Models\MaintenanceTask;

test('maintenance task wizard flow', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    // 1. Create Task (Step 1)
    $response = $this->post(route('maintenance-tasks.store'), [
        'name' => 'Test Pump Inspection',
        'description' => 'Visual check',
        'frequency_unit' => 'WK',
        'frequency_value' => 4,
        'object_type' => 'equipment',
        'object_id' => 'P-101',
    ]);

    $response->assertRedirect();
    $task = MaintenanceTask::first();
    expect($task)->not->toBeNull();
    expect($task->name)->toBe('Test Pump Inspection');
    expect($task->plan->frequency_value)->toBe(4);
    expect($task->items->first()->object_id)->toBe('P-101');

    // 2. Update Task (Step 6 - status ready)
    $response = $this->put(route('maintenance-tasks.update', $task), [
        'status' => 'ready',
        'is_sap_ready' => true,
    ]);

    $response->assertSessionHas('success');
    $task->refresh();
    expect($task->status)->toBe('ready');
    expect($task->is_sap_ready)->toBe(1);
});
