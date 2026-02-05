<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function show(Order $order): JsonResponse
    {
        $order->load('items');

        return response()->json([
            'data' => [
                'id' => $order->id,
                'email' => $order->email,
                'status' => $order->status,
                'total_cents' => $order->total_cents,
                'currency' => $order->currency,
                'items_count' => $order->items_count,
                'created_at' => $order->created_at,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product_name,
                    'product_slug' => $item->product_slug,
                    'quantity' => $item->quantity,
                    'unit_price_cents' => $item->unit_price_cents,
                    'line_total_cents' => $item->line_total_cents,
                ]),
            ],
        ]);
    }
}
