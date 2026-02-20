<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OperationMaterial extends Model
{
    protected $fillable = [
        'task_list_operation_id',
        'material_number',
        'description',
        'quantity',
        'unit',
    ];

    public function operation()
    {
        return $this->belongsTo(TaskListOperation::class, 'task_list_operation_id');
    }
}
