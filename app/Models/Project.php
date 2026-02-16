<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'status',
        'priority',
        'budget',
        'start_date',
        'end_date',
        'user_id',
    ];

    protected $casts = [
        'budget' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope for filtering by search term.
     */
    public function scopeSearch($query, ?string $search)
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return $query;
    }

    /**
     * Scope for filtering by status.
     */
    public function scopeStatus($query, ?string $status)
    {
        if ($status) {
            $query->where('status', $status);
        }

        return $query;
    }

    /**
     * Scope for filtering by priority.
     */
    public function scopePriority($query, ?string $priority)
    {
        if ($priority) {
            $query->where('priority', $priority);
        }

        return $query;
    }

    /**
     * Scope for sorting.
     */
    public function scopeSorted($query, ?string $sortBy, string $sortDirection = 'asc')
    {
        if ($sortBy) {
            $query->orderBy($sortBy, $sortDirection);
        } else {
            $query->latest();
        }

        return $query;
    }
}
