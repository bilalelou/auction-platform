<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('bid_id')->constrained()->onDelete('cascade');
            $table->string('bidder_email');
            $table->unsignedBigInteger('amount_cents');
            $table->string('currency', 10)->default('MAD');
            $table->enum('payment_method', ['paypal', 'card', 'cod'])->default('cod');
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->string('transaction_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['product_id', 'status']);
            $table->index('bidder_email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
