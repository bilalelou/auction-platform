<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'starting_price_cents',
        'currency',
        'image_url',
        'status',
        'seller_name',
        'seller_email',
        'approved_at',
        'rejected_at',
        'rejection_reason',
        'buy_now_price_cents',
    ];

    protected function casts(): array
    {
        return [
            'starting_price_cents' => 'integer',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
            'buy_now_price_cents' => 'integer',
        ];
    }

    /** @return HasMany<Bid, $this> */
    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class);
    }

    /** @return HasMany<ProductImage, $this> */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }
}
