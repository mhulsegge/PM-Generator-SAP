<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SapObject extends Model
{
    protected $fillable = ['object_id', 'name', 'type', 'description'];
}
