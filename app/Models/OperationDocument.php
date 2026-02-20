<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OperationDocument extends Model
{
    protected $fillable = [
        'task_list_operation_id',
        'document_type',
        'document_number',
        'document_part',
        'document_version',
        'description',
    ];

    public function operation()
    {
        return $this->belongsTo(TaskListOperation::class, 'task_list_operation_id');
    }
}
