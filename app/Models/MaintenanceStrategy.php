<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceStrategy extends Model
{
    protected $fillable = ['name', 'description'];

    public function packages()
    {
        return $this->hasMany(MaintenanceStrategyPackage::class)->orderBy('cycle_value');
    }
}
