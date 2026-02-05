<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class CreateListingWithImagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_listing_with_many_uploaded_images(): void
    {
        Storage::fake('public');

        $name = 'Test Product '.Str::random(8);

        $files = [];
        for ($i = 1; $i <= 12; $i++) {
            $files[] = UploadedFile::fake()->image("img{$i}.jpg");
        }

        $res = $this->post('/api/listings', [
            'name' => $name,
            'description' => 'Testing multi image upload',
            'starting_price_cents' => 1234,
            'currency' => 'USD',
            'seller_name' => 'Seller',
            'seller_email' => 'seller@example.com',
            'images' => $files,
        ]);

        $res->assertCreated();
        $res->assertJsonPath('data.name', $name);

        $product = Product::query()->where('name', $name)->firstOrFail();
        $product->load('images');

        $this->assertCount(12, $product->images);
        $res->assertJsonCount(12, 'data.images');

        foreach ($product->images as $image) {
            Storage::disk('public')->assertExists($image->path);
        }
    }
}

