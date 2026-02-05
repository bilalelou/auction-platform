<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::query()
            ->orderBy('id')
            ->get([
                'id',
                'name',
                'slug',
                'description',
                'price_cents',
                'currency',
                'image_url',
                'stock',
            ]);

        return response()->json(['data' => $products]);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json([
            'data' => $product->only([
                'id',
                'name',
                'slug',
                'description',
                'price_cents',
                'currency',
                'image_url',
                'stock',
            ]),
        ]);
    }
}
