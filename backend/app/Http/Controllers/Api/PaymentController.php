<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bid;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Get payment info for a product (winning bid details)
     */
    public function getPaymentInfo(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)
            ->where('status', 'approved')
            ->firstOrFail();

        // Get the winning (highest) bid
        $winningBid = $product->bids()
            ->orderByDesc('amount_cents')
            ->first();

        if (!$winningBid) {
            return response()->json([
                'error' => 'No bids found for this product',
            ], 404);
        }

        // Check if payment already exists
        $existingPayment = Payment::where('product_id', $product->id)
            ->where('bid_id', $winningBid->id)
            ->first();

        return response()->json([
            'data' => [
                'product' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'image_url' => $product->image_url,
                ],
                'winning_bid' => [
                    'id' => $winningBid->id,
                    'bidder_email' => $winningBid->bidder_email,
                    'amount_cents' => (int) $winningBid->amount_cents,
                    'currency' => $product->currency ?? 'MAD',
                ],
                'payment_status' => $existingPayment?->status ?? 'not_started',
                'existing_payment' => $existingPayment ? [
                    'id' => $existingPayment->id,
                    'payment_method' => $existingPayment->payment_method,
                    'status' => $existingPayment->status,
                ] : null,
            ],
        ]);
    }

    /**
     * Process payment for a winning bid
     */
    public function processPayment(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'bid_id' => ['required', 'integer', 'exists:bids,id'],
            'payment_method' => ['required', 'in:paypal,card,cod'],
            'card_number' => ['required_if:payment_method,card', 'nullable', 'string'],
            'card_expiry' => ['required_if:payment_method,card', 'nullable', 'string'],
            'card_cvv' => ['required_if:payment_method,card', 'nullable', 'string'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $product = Product::findOrFail($data['product_id']);
        $bid = Bid::findOrFail($data['bid_id']);

        // Verify this is the winning bid
        $maxBid = $product->bids()->max('amount_cents');
        if ((int) $bid->amount_cents !== (int) $maxBid) {
            return response()->json([
                'error' => 'This is not the winning bid',
            ], 400);
        }

        // Check if payment already completed
        $existingPayment = Payment::where('product_id', $product->id)
            ->where('bid_id', $bid->id)
            ->where('status', 'completed')
            ->first();

        if ($existingPayment) {
            return response()->json([
                'error' => 'Payment already completed for this bid',
            ], 400);
        }

        // Simulate payment processing
        $transactionId = null;
        $status = 'pending';

        switch ($data['payment_method']) {
            case 'paypal':
                // In real implementation, redirect to PayPal
                $transactionId = 'PP-' . Str::random(16);
                $status = 'completed';
                break;

            case 'card':
                // In real implementation, process card via Stripe/etc
                $transactionId = 'CARD-' . Str::random(16);
                $status = 'completed';
                break;

            case 'cod':
                // Cash on delivery - pending until delivered
                $transactionId = 'COD-' . Str::random(16);
                $status = 'pending';
                break;
        }

        $payment = Payment::create([
            'product_id' => $product->id,
            'bid_id' => $bid->id,
            'bidder_email' => $bid->bidder_email,
            'amount_cents' => $bid->amount_cents,
            'currency' => $product->currency ?? 'MAD',
            'payment_method' => $data['payment_method'],
            'status' => $status,
            'transaction_id' => $transactionId,
            'notes' => $data['notes'] ?? null,
        ]);

        return response()->json([
            'data' => [
                'id' => $payment->id,
                'transaction_id' => $payment->transaction_id,
                'payment_method' => $payment->payment_method,
                'status' => $payment->status,
                'amount_cents' => (int) $payment->amount_cents,
                'currency' => $payment->currency,
            ],
            'message' => $this->getSuccessMessage($data['payment_method']),
        ], 201);
    }

    private function getSuccessMessage(string $method): string
    {
        return match ($method) {
            'paypal' => 'تم الدفع بنجاح عبر PayPal',
            'card' => 'تم الدفع بنجاح عبر البطاقة البنكية',
            'cod' => 'تم تأكيد الطلب - الدفع عند الاستلام',
            default => 'تم معالجة الدفع',
        };
    }
}
