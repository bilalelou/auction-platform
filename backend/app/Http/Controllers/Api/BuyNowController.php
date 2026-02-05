<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BuyNowController extends Controller
{
    /**
     * Process an instant "Buy Now" purchase.
     */
    public function purchase(Request $request, Product $product): JsonResponse
    {
        // Ensure product is approved and has a buy now price
        abort_if($product->status !== 'approved', 404, 'Product not available');
        abort_if($product->buy_now_price_cents === null, 400, 'This product does not have a Buy Now price');

        $data = $request->validate([
            'buyer_email' => ['required', 'email', 'max:150'],
            'buyer_name' => ['nullable', 'string', 'max:150'],
        ]);

        // Create a payment record for the buy now purchase
        $payment = Payment::create([
            'user_id' => $request->user()?->id,
            'product_id' => $product->id,
            'amount_cents' => $product->buy_now_price_cents,
            'currency' => $product->currency,
            'status' => 'pending',
            'payment_method' => 'buy_now',
            'buyer_email' => $data['buyer_email'],
            'buyer_name' => $data['buyer_name'] ?? null,
        ]);

        // Mark product as sold
        $product->update(['status' => 'sold']);

        return response()->json([
            'data' => [
                'payment_id' => $payment->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'amount_cents' => $product->buy_now_price_cents,
                'currency' => $product->currency,
                'status' => 'pending',
                'message' => 'Purchase initiated. Please complete payment.',
            ],
        ], 201);
    }
}
