<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();

        $listings = [
            [
                'name' => 'Vintage Camera',
                'slug' => 'vintage-camera',
                'description' => 'Classic film camera in good condition. Starts low — bid to win.',
                'starting_price_cents' => 5000,
                'currency' => 'USD',
                'image_url' => 'https://picsum.photos/seed/vintage-camera/800/600',
                'status' => 'approved',
                'seller_name' => 'Sara',
                'seller_email' => 'sara@example.com',
                'approved_at' => $now,
            ],
            [
                'name' => 'Gaming Chair',
                'slug' => 'gaming-chair',
                'description' => 'Comfortable chair, minimal wear.',
                'starting_price_cents' => 12000,
                'currency' => 'USD',
                'image_url' => 'https://picsum.photos/seed/gaming-chair/800/600',
                'status' => 'approved',
                'seller_name' => 'Youssef',
                'seller_email' => 'youssef@example.com',
                'approved_at' => $now,
            ],
            [
                'name' => 'Old Watch',
                'slug' => 'old-watch',
                'description' => 'Needs a new battery. Pending admin review.',
                'starting_price_cents' => 2500,
                'currency' => 'USD',
                'image_url' => 'https://picsum.photos/seed/old-watch/800/600',
                'status' => 'pending',
                'seller_name' => 'Amina',
                'seller_email' => 'amina@example.com',
                'approved_at' => null,
            ],
        ];

        foreach ($listings as $listing) {
            Product::updateOrCreate(
                ['slug' => $listing['slug']],
                array_merge(
                    [
                        'rejected_at' => null,
                        'rejection_reason' => null,
                    ],
                    $listing,
                ),
            );
        }

        // Seed bids (reset for idempotency)
        $camera = Product::query()->where('slug', 'vintage-camera')->first();
        if ($camera) {
            $camera->bids()->delete();
            $camera->bids()->createMany([
                ['bidder_email' => 'bidder1@example.com', 'amount_cents' => 5500],
                ['bidder_email' => 'bidder2@example.com', 'amount_cents' => 6200],
            ]);
        }

        $chair = Product::query()->where('slug', 'gaming-chair')->first();
        if ($chair) {
            $chair->bids()->delete();
            $chair->bids()->createMany([
                ['bidder_email' => 'bidder3@example.com', 'amount_cents' => 12500],
            ]);
        }
    }
}