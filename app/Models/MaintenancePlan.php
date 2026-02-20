<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenancePlan extends Model
{
    protected $fillable = [
        'maintenance_task_id',
        'frequency_unit',
        'frequency_value',
        'call_horizon_unit',
        'call_horizon_value',
        'start_date',
        'is_strategy_plan',
        'strategy_package',
        'discipline',
    ];

    public function task()
    {
        return $this->belongsTo(MaintenanceTask::class, 'maintenance_task_id');
    }
}
