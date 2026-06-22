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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade'); // المستخدم الذي يقيّم
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade'); // البائع الذي يتم تقييمه
            $table->foreignId('product_id')->nullable()->constrained('products')->onDelete('set null'); // المنتج المرتبط بالتقييم (اختياري)
            $table->tinyInteger('rating')->unsigned(); // التقييم من 1 إلى 5
            $table->text('comment')->nullable(); // تعليق اختياري
            $table->boolean('is_verified')->default(false); // هل التقييم موثوق (تم شراء المنتج)
            $table->timestamps();

            // منع تكرار التقييم - كل مستخدم يقيم بائع مرة واحدة فقط لكل منتج
            $table->unique(['reviewer_id', 'seller_id', 'product_id']);
            
            // Indexes للأداء
            $table->index('seller_id');
            $table->index('rating');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
