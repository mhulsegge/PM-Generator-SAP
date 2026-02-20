<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceStrategyPackage extends Model
{
    protected $fillable = [
        'maintenance_strategy_id',
        'name',
        'cycle_value',
        'cycle_unit',
        'hierarchy_short_text',
    ];

    public function strategy()
    {
        return $this->belongsTo(MaintenanceStrategy::class, 'maintenance_strategy_id');
    }
}
