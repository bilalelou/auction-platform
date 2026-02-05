<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'bid_id',
        'bidder_email',
        'buyer_email',
        'buyer_name',
        'amount_cents',
        'currency',
        'payment_method',
        'status',
        'transaction_id',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'product_id' => 'integer',
            'bid_id' => 'integer',
            'amount_cents' => 'integer',
        ];
    }

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return BelongsTo<Bid, $this> */
    public function bid(): BelongsTo
    {
        return $this->belongsTo(Bid::class);
    }
}
