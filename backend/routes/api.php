<?php

use App\Http\Controllers\Api\AdminListingController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BidController;
use App\Http\Controllers\Api\BuyNowController;
use App\Http\Controllers\Api\EmailTemplateController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => ['ok' => true]);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::put('/profile', [ProfileController::class, 'update']);
        Route::post('/change-password', [ProfileController::class, 'changePassword']);
    });
});

// Public auction listings (approved only)
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{product:slug}', [ListingController::class, 'show']);

// Customer submits a new listing (pending until admin approves)
Route::post('/listings', [ListingController::class, 'store']);

// Place a bid on an approved listing
Route::post('/listings/{product:slug}/bids', [BidController::class, 'store']);

// Buy Now instant purchase
Route::post('/listings/{product:slug}/buy-now', [BuyNowController::class, 'purchase']);

// Payment routes
Route::get('/payment/{slug}', [PaymentController::class, 'getPaymentInfo']);
Route::post('/payment', [PaymentController::class, 'processPayment']);

// Admin review/moderation
Route::prefix('admin')->middleware('admin')->group(function () {
    Route::get('/listings', [AdminListingController::class, 'index']);
    Route::post('/listings/{product}/approve', [AdminListingController::class, 'approve']);
    Route::post('/listings/{product}/reject', [AdminListingController::class, 'reject']);
    
    // Email templates management
    Route::get('/email-templates', [EmailTemplateController::class, 'index']);
    Route::get('/email-templates/{key}', [EmailTemplateController::class, 'show']);
    Route::put('/email-templates/{key}', [EmailTemplateController::class, 'update']);
    Route::post('/email-templates/{key}/toggle', [EmailTemplateController::class, 'toggle']);
});