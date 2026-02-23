<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TemplateTaskList extends Model
{
    protected $fillable = [
        'name',
        'description',
        'work_center',
        'plant',
        'general_instructions',
        'usage',
        'maintenance_strategy_id',
    ];

    public function operations()
    {
        return $this->hasMany(TemplateTaskListOperation::class);
    }

    public function strategy()
    {
        return $this->belongsTo(MaintenanceStrategy::class, 'maintenance_strategy_id');
    }
}
