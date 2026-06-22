<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ReviewController extends Controller
{
    /**
     * الحصول على جميع تقييمات بائع معين
     */
    public function index(Request $request, $sellerId)
    {
        $perPage = $request->get('per_page', 10);
        $rating = $request->get('rating'); // فلترة حسب عدد النجوم
        $verified = $request->get('verified'); // فقط التقييمات الموثوقة

        $query = Review::where('seller_id', $sellerId)
            ->with(['reviewer:id,name,email', 'product:id,title,slug'])
            ->latest();

        if ($rating) {
            $query->where('rating', $rating);
        }

        if ($verified) {
            $query->where('is_verified', true);
        }

        $reviews = $query->paginate($perPage);

        // حساب الإحصائيات
        $stats = Review::where('seller_id', $sellerId)
            ->select(
                DB::raw('AVG(rating) as average_rating'),
                DB::raw('COUNT(*) as total_reviews'),
                DB::raw('SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_stars'),
                DB::raw('SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_stars'),
                DB::raw('SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_stars'),
                DB::raw('SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_stars'),
                DB::raw('SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star')
            )
            ->first();

        return response()->json([
            'reviews' => $reviews,
            'stats' => [
                'average_rating' => round($stats->average_rating ?? 0, 1),
                'total_reviews' => $stats->total_reviews ?? 0,
                'rating_distribution' => [
                    5 => $stats->five_stars ?? 0,
                    4 => $stats->four_stars ?? 0,
                    3 => $stats->three_stars ?? 0,
                    2 => $stats->two_stars ?? 0,
                    1 => $stats->one_star ?? 0,
                ],
            ],
        ]);
    }

    /**
     * إضافة تقييم جديد
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'seller_id' => 'required|exists:users,id',
            'product_id' => 'nullable|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // التحقق من أن المستخدم لا يقيم نفسه
        if ($request->user()->id == $validated['seller_id']) {
            return response()->json([
                'message' => 'لا يمكنك تقييم نفسك',
            ], 422);
        }

        // التحقق من عدم وجود تقييم سابق لنفس البائع والمنتج
        $existingReview = Review::where('reviewer_id', $request->user()->id)
            ->where('seller_id', $validated['seller_id'])
            ->where('product_id', $validated['product_id'] ?? null)
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'لقد قمت بتقييم هذا البائع من قبل',
            ], 422);
        }

        // التحقق إذا كان المستخدم قد اشترى منتج من هذا البائع (للتحقق من التقييم)
        $isVerified = false;
        if ($validated['product_id']) {
            // يمكن إضافة منطق للتحقق من الشراء الفعلي
            // مثلاً: التحقق من جدول orders
            $isVerified = true; // مؤقتاً
        }

        $review = Review::create([
            'reviewer_id' => $request->user()->id,
            'seller_id' => $validated['seller_id'],
            'product_id' => $validated['product_id'] ?? null,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'is_verified' => $isVerified,
        ]);

        $review->load(['reviewer:id,name,email', 'product:id,title,slug']);

        return response()->json([
            'message' => 'تم إضافة التقييم بنجاح',
            'review' => $review,
        ], 201);
    }

    /**
     * تحديث تقييم موجود
     */
    public function update(Request $request, Review $review)
    {
        // التحقق من أن المستخدم هو صاحب التقييم
        if ($request->user()->id !== $review->reviewer_id) {
            return response()->json([
                'message' => 'غير مصرح لك بتحديث هذا التقييم',
            ], 403);
        }

        $validated = $request->validate([
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review->update($validated);
        $review->load(['reviewer:id,name,email', 'product:id,title,slug']);

        return response()->json([
            'message' => 'تم تحديث التقييم بنجاح',
            'review' => $review,
        ]);
    }

    /**
     * حذف تقييم
     */
    public function destroy(Request $request, Review $review)
    {
        // التحقق من أن المستخدم هو صاحب التقييم أو المدير
        if ($request->user()->id !== $review->reviewer_id && !$request->user()->is_admin) {
            return response()->json([
                'message' => 'غير مصرح لك بحذف هذا التقييم',
            ], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'تم حذف التقييم بنجاح',
        ]);
    }

    /**
     * الحصول على ملخص تقييمات البائع
     */
    public function sellerSummary($sellerId)
    {
        $seller = User::findOrFail($sellerId);

        $stats = Review::where('seller_id', $sellerId)
            ->select(
                DB::raw('AVG(rating) as average_rating'),
                DB::raw('COUNT(*) as total_reviews'),
                DB::raw('SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_stars'),
                DB::raw('SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_stars'),
                DB::raw('SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_stars'),
                DB::raw('SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_stars'),
                DB::raw('SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star')
            )
            ->first();

        $recentReviews = Review::where('seller_id', $sellerId)
            ->with(['reviewer:id,name', 'product:id,title,slug'])
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'seller' => [
                'id' => $seller->id,
                'name' => $seller->name,
                'email' => $seller->email,
            ],
            'stats' => [
                'average_rating' => round($stats->average_rating ?? 0, 1),
                'total_reviews' => $stats->total_reviews ?? 0,
                'rating_distribution' => [
                    5 => $stats->five_stars ?? 0,
                    4 => $stats->four_stars ?? 0,
                    3 => $stats->three_stars ?? 0,
                    2 => $stats->two_stars ?? 0,
                    1 => $stats->one_star ?? 0,
                ],
            ],
            'recent_reviews' => $recentReviews,
        ]);
    }
}
