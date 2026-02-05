<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'email',
        'status',
        'total_cents',
        'currency',
        'items_count',
    ];

    protected function casts(): array
    {
        return [
            'total_cents' => 'integer',
            'items_count' => 'integer',
        ];
    }

    /** @return HasMany<OrderItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
