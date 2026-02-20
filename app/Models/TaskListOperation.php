<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskListOperation extends Model
{
    protected $fillable = [
        'task_list_id',
        'operation_number',
        'control_key',
        'short_text',
        'long_text',
        'work_center',
        'duration_normal',
        'duration_unit',
        'number_of_people',
    ];

    public function taskList()
    {
        return $this->belongsTo(TaskList::class);
    }

    public function materials()
    {
        return $this->hasMany(OperationMaterial::class);
    }

    public function documents()
    {
        return $this->hasMany(OperationDocument::class);
    }
}
