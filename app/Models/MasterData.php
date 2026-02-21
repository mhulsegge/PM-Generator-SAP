<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterData extends Model
{
    protected $fillable = [
        'category',
        'key',
        'label',
        'sort_order',
        'is_active',
        'is_default',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'sort_order' => 'integer',
    ];
}
