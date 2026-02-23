<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenancePlan extends Model
{
    protected $fillable = [
        'name',
        'frequency_unit',
        'frequency_value',
        'call_horizon_unit',
        'call_horizon_value',
        'start_date',
        'is_strategy_plan',
        'maintenance_strategy_id',
        'discipline',
        'scheduling_period_value',
        'scheduling_period_unit',
        'order_type',
        'completion_requirement',
        'auto_order_generation',
    ];

    public function strategy()
    {
        return $this->belongsTo(MaintenanceStrategy::class, 'maintenance_strategy_id');
    }

    public function tasks()
    {
        return $this->hasMany(MaintenanceTask::class, 'maintenance_plan_id');
    }

    /** @deprecated Use tasks() instead */
    public function task()
    {
        return $this->tasks()->first();
    }
}
