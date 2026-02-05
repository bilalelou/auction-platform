<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Make bid_id nullable for Buy Now purchases (no bid involved)
            $table->foreignId('bid_id')->nullable()->change();
            
            // Add user_id for authenticated purchases
            $table->foreignId('user_id')->nullable()->after('id');
            
            // Add buyer info for Buy Now purchases
            $table->string('buyer_email')->nullable()->after('bidder_email');
            $table->string('buyer_name')->nullable()->after('buyer_email');
        });
        
        // Update payment_method enum to include buy_now
        \DB::statement("ALTER TABLE payments MODIFY payment_method ENUM('paypal', 'card', 'cod', 'buy_now') DEFAULT 'cod'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['user_id', 'buyer_email', 'buyer_name']);
        });
        
        \DB::statement("ALTER TABLE payments MODIFY payment_method ENUM('paypal', 'card', 'cod') DEFAULT 'cod'");
    }
};
