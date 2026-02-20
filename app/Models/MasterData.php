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
    ];
}
