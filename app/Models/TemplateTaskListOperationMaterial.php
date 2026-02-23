<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TemplateTaskListOperationMaterial extends Model
{
    protected $fillable = [
        'template_task_list_operation_id',
        'material_number',
        'quantity',
        'unit',
    ];

    public function operation()
    {
        return $this->belongsTo(TemplateTaskListOperation::class, 'template_task_list_operation_id');
    }
}
