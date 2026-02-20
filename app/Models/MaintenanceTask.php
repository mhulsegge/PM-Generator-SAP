<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceTask extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'status',
        'is_sap_ready',
        'maintenance_plan_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->belongsTo(MaintenancePlan::class, 'maintenance_plan_id');
    }

    public function items()
    {
        return $this->hasMany(MaintenanceItem::class);
    }

    public function taskList()
    {
        return $this->hasOne(TaskList::class);
    }
}
