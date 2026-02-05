<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'distinct'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:999'],
        ]);

        /** @var array<int, array{product_id:int, quantity:int}> $rawItems */
        $rawItems = $data['items'];
        $itemsByProductId = collect($rawItems)->keyBy('product_id');

        $products = Product::query()
            ->whereIn('id', $itemsByProductId->keys())
            ->get();

        if ($products->count() !== $itemsByProductId->count()) {
            throw ValidationException::withMessages([
                'items' => ['One or more products were not found.'],
            ]);
        }

        $currency = $products->first()?->currency ?? 'USD';
        if ($products->contains(fn (Product $product) => $product->currency !== $currency)) {
            throw ValidationException::withMessages([
                'items' => ['All products must use the same currency.'],
            ]);
        }

        $order = DB::transaction(function () use ($data, $products, $itemsByProductId, $currency): Order {
            $order = Order::create([
                'email' => $data['email'],
                'status' => 'pending',
                'total_cents' => 0,
                'currency' => $currency,
                'items_count' => 0,
            ]);

            $itemsCount = 0;
            $totalCents = 0;
            $orderItems = [];

            foreach ($products as $product) {
                $quantity = (int) $itemsByProductId[$product->id]['quantity'];
                $lineTotal = $product->price_cents * $quantity;

                $itemsCount += $quantity;
                $totalCents += $lineTotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_slug' => $product->slug,
                    'quantity' => $quantity,
                    'unit_price_cents' => $product->price_cents,
                    'line_total_cents' => $lineTotal,
                ];
            }

            $order->items()->createMany($orderItems);
            $order->update([
                'items_count' => $itemsCount,
                'total_cents' => $totalCents,
            ]);

            return $order->fresh('items');
        });

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
                    'product_id' => $item->product_id,
                    'product_name' => $item->product_name,
                    'product_slug' => $item->product_slug,
                    'quantity' => $item->quantity,
                    'unit_price_cents' => $item->unit_price_cents,
                    'line_total_cents' => $item->line_total_cents,
                ]),
            ],
        ], 201);
    }
}
