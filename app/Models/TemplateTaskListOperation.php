<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TemplateTaskListOperation extends Model
{
    protected $fillable = [
        'template_task_list_id',
        'operation_number',
        'control_key',
        'short_text',
        'long_text',
        'work_center',
        'duration_normal',
        'duration_unit',
        'number_of_people',
        'maintenance_strategy_package_id',
    ];

    public function templateTaskList()
    {
        return $this->belongsTo(TemplateTaskList::class);
    }

    public function materials()
    {
        return $this->hasMany(TemplateTaskListOperationMaterial::class);
    }

    public function strategyPackage()
    {
        return $this->belongsTo(MaintenanceStrategyPackage::class, 'maintenance_strategy_package_id');
    }
}
