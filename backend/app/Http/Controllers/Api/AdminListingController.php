<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminListingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $status = (string) $request->query('status', 'pending');
        if (! in_array($status, ['pending', 'approved', 'rejected'], true)) {
            $status = 'pending';
        }

        $listings = Product::query()
            ->where('status', $status)
            ->orderByDesc('created_at')
            ->get([
                'id',
                'name',
                'slug',
                'starting_price_cents',
                'currency',
                'image_url',
                'status',
                'seller_name',
                'seller_email',
                'rejection_reason',
                'approved_at',
                'rejected_at',
                'created_at',
            ]);

        return response()->json(['data' => $listings]);
    }

    public function approve(Product $product): JsonResponse
    {
        $product->update([
            'status' => 'approved',
            'approved_at' => now(),
            'rejected_at' => null,
            'rejection_reason' => null,
        ]);

        return response()->json(['data' => $product]);
    }

    public function reject(Request $request, Product $product): JsonResponse
    {
        $data = $request->validate([
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $product->update([
            'status' => 'rejected',
            'approved_at' => null,
            'rejected_at' => now(),
            'rejection_reason' => $data['reason'] ?? null,
        ]);

        return response()->json(['data' => $product]);
    }
}