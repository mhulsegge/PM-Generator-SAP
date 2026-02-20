<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskList extends Model
{
    protected $fillable = [
        'maintenance_task_id',
        'type',
        'description',
        'work_center',
        'plant',
        'status',
        'group_counter',
        'strategy_package',
        'general_instructions',
        'usage',
    ];

    public function task()
    {
        return $this->belongsTo(MaintenanceTask::class, 'maintenance_task_id');
    }

    public function operations()
    {
        return $this->hasMany(TaskListOperation::class);
    }
}
