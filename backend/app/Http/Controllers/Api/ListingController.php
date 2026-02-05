<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ListingController extends Controller
{
    private function publicImageUrl(Request $request, string $path): string
    {
        $base = $request->getSchemeAndHttpHost();
        $normalized = ltrim($path, '/');

        return "{$base}/storage/{$normalized}";
    }

    public function index(Request $request): JsonResponse
    {
        $query = Product::query()->where('status', 'approved');

        $search = trim((string) $request->query('q', ''));
        if ($search !== '') {
            $query->where('name', 'like', "%{$search}%");
        }

        $listings = $query
            ->with(['images:id,product_id,path,sort_order'])
            ->withCount('bids')
            ->withMax('bids', 'amount_cents')
            ->orderByDesc('approved_at')
            ->orderByDesc('id')
            ->get([
                'id',
                'name',
                'slug',
                'description',
                'starting_price_cents',
                'currency',
                'image_url',
                'status',
                'approved_at',
                'created_at',
                'buy_now_price_cents',
            ]);

        $data = $listings->map(function (Product $listing) use ($request) {
            $maxBid = (int) ($listing->bids_max_amount_cents ?? 0);
            $currentPrice = max((int) $listing->starting_price_cents, $maxBid);

            $imageUrls = $listing->images
                ->sortBy('sort_order')
                ->map(fn (ProductImage $img) => $this->publicImageUrl($request, $img->path))
                ->values()
                ->all();

            $primaryImageUrl = $imageUrls[0] ?? $listing->image_url;

            return [
                'id' => $listing->id,
                'name' => $listing->name,
                'slug' => $listing->slug,
                'description' => $listing->description,
                'starting_price_cents' => (int) $listing->starting_price_cents,
                'current_price_cents' => $currentPrice,
                'currency' => $listing->currency,
                'image_url' => $primaryImageUrl,
                'images' => $imageUrls,
                'bids_count' => (int) $listing->bids_count,
                'approved_at' => $listing->approved_at,
                'created_at' => $listing->created_at,
                'buy_now_price_cents' => $listing->buy_now_price_cents,
            ];
        });

        return response()->json(['data' => $data]);
    }

    public function show(Request $request, Product $product): JsonResponse
    {
        abort_if($product->status !== 'approved', 404);

        $product->load([
            'images:id,product_id,path,sort_order',
            'bids' => fn ($q) => $q
                ->orderByDesc('amount_cents')
                ->orderByDesc('id')
                ->limit(25),
        ]);

        $maxBid = (int) ($product->bids->max('amount_cents') ?? 0);
        $currentPrice = max((int) $product->starting_price_cents, $maxBid);

        $imageUrls = $product->images
            ->sortBy('sort_order')
            ->map(fn (ProductImage $img) => $this->publicImageUrl($request, $img->path))
            ->values()
            ->all();

        $primaryImageUrl = $imageUrls[0] ?? $product->image_url;

        return response()->json([
            'data' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'starting_price_cents' => (int) $product->starting_price_cents,
                'current_price_cents' => $currentPrice,
                'currency' => $product->currency,
                'image_url' => $primaryImageUrl,
                'images' => $imageUrls,
                'status' => $product->status,
                'approved_at' => $product->approved_at,
                'created_at' => $product->created_at,
                'bids' => $product->bids->map(fn ($bid) => [
                    'id' => $bid->id,
                    'bidder_email' => $bid->bidder_email,
                    'amount_cents' => (int) $bid->amount_cents,
                    'created_at' => $bid->created_at,
                ]),
                'buy_now_price_cents' => $product->buy_now_price_cents,
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:2000'],
            'image_url' => ['nullable', 'url', 'max:2048'],
            'images' => ['nullable', 'array', 'max:20'],
            'images.*' => ['file', 'image', 'max:5120'], // 5MB per image
            'starting_price_cents' => ['required', 'integer', 'min:1'],
            'currency' => ['nullable', 'string', 'size:3'],
            'seller_name' => ['nullable', 'string', 'max:150'],
            'seller_email' => ['required', 'email', 'max:150'],
            'buy_now_price_cents' => ['nullable', 'integer', 'min:1'],
        ]);

        $slugBase = Str::slug($data['name']);
        if ($slugBase === '') {
            $slugBase = Str::lower(Str::random(10));
        }

        $slug = $slugBase;
        $i = 2;
        while (Product::query()->where('slug', $slug)->exists()) {
            $slug = $slugBase.'-'.$i;
            $i++;
        }

        /** @var UploadedFile[] $uploadedImages */
        $uploadedImages = $request->file('images', []);

        $listing = DB::transaction(function () use ($data, $slug, $uploadedImages) {
            $product = Product::create([
                'name' => $data['name'],
                'slug' => $slug,
                'description' => $data['description'] ?? null,
                'image_url' => $data['image_url'] ?? null,
                'starting_price_cents' => (int) $data['starting_price_cents'],
                'currency' => strtoupper($data['currency'] ?? 'USD'),
                'status' => 'pending',
                'seller_name' => $data['seller_name'] ?? null,
                'seller_email' => $data['seller_email'],
                'approved_at' => null,
                'rejected_at' => null,
                'rejection_reason' => null,
                'buy_now_price_cents' => isset($data['buy_now_price_cents']) ? (int) $data['buy_now_price_cents'] : null,
            ]);

            if (count($uploadedImages) > 0) {
                foreach (array_values($uploadedImages) as $index => $file) {
                    $ext = $file->getClientOriginalExtension();
                    $filename = (string) Str::uuid().($ext ? ".{$ext}" : '');
                    $path = $file->storeAs("product-images/{$product->id}", $filename, 'public');

                    $product->images()->create([
                        'path' => $path,
                        'sort_order' => $index,
                    ]);
                }
            }

            return $product->load(['images:id,product_id,path,sort_order']);
        });

        $imageUrls = $listing->images
            ->sortBy('sort_order')
            ->map(fn (ProductImage $img) => $this->publicImageUrl($request, $img->path))
            ->values()
            ->all();

        $primaryImageUrl = $imageUrls[0] ?? $listing->image_url;

        return response()->json([
            'data' => [
                'id' => $listing->id,
                'name' => $listing->name,
                'slug' => $listing->slug,
                'status' => $listing->status,
                'starting_price_cents' => (int) $listing->starting_price_cents,
                'currency' => $listing->currency,
                'image_url' => $primaryImageUrl,
                'images' => $imageUrls,
                'buy_now_price_cents' => $listing->buy_now_price_cents,
                'created_at' => $listing->created_at,
            ],
        ], 201);
    }
}
