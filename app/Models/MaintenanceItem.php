<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceItem extends Model
{
    protected $fillable = [
        'maintenance_task_id',
        'object_type',
        'object_id',
        'object_description',
        'location',
        'planner_group',
        'main_work_center',
        'order_type',
    ];

    public function task()
    {
        return $this->belongsTo(MaintenanceTask::class, 'maintenance_task_id');
    }
}
