<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BidController extends Controller
{
    public function store(Request $request, Product $product): JsonResponse
    {
        abort_if($product->status !== 'approved', 404);

        $data = $request->validate([
            'bidder_email' => ['required', 'email', 'max:150'],
            'amount_cents' => ['required', 'integer', 'min:1'],
        ]);

        $bid = DB::transaction(function () use ($product, $data) {
            $maxBid = (int) ($product->bids()->max('amount_cents') ?? 0);
            $minAllowed = max((int) $product->starting_price_cents, $maxBid + 1);

            if ((int) $data['amount_cents'] < $minAllowed) {
                throw ValidationException::withMessages([
                    'amount_cents' => ["Bid must be at least {$minAllowed} cents."],
                ]);
            }

            return $product->bids()->create([
                'bidder_email' => $data['bidder_email'],
                'amount_cents' => (int) $data['amount_cents'],
            ]);
        });

        return response()->json([
            'data' => [
                'id' => $bid->id,
                'product_id' => $bid->product_id,
                'bidder_email' => $bid->bidder_email,
                'amount_cents' => (int) $bid->amount_cents,
                'created_at' => $bid->created_at,
            ],
        ], 201);
    }
}